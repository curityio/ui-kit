/*
 * Copyright (C) 2026 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

/**
 * Bot protection for authenticator pages (IS-12295).
 *
 * Loaded by fragments/bot-protection.vm on pages of an authenticator with bot protection enabled. Whenever a form is
 * posted to one of the authenticator's endpoints, it gets a fresh token from the provider (Google reCAPTCHA
 * Enterprise or Cloudflare Turnstile) and sends it in a hidden field, so templates need no changes.
 *
 * Tokens are single use and short-lived, so one is requested at submit time, never on page load.
 *
 * Forms are submitted in two ways, and both are handled:
 * - by the user (or requestSubmit()), which fires a "submit" event, caught here in the capture phase;
 * - by form.submit() (also used by jQuery's .submit()), which fires no event, so HTMLFormElement.prototype.submit
 *   is wrapped.
 *
 * If no token can be obtained (for example, the provider's script is blocked), the form is submitted without one and
 * the server responds with its bot-protection error.
 */
(function () {
    "use strict";

    var configElement = document.getElementById("bot-protection-config");

    if (!configElement || typeof HTMLFormElement === "undefined") {
        return;
    }

    var config;

    try {
        config = JSON.parse(configElement.textContent);
    } catch (e) {
        console.warn("Bot protection: invalid configuration", e);
        return;
    }

    var ONLOAD_CALLBACK = "__curityBotProtectionOnload";
    var nativeSubmit = HTMLFormElement.prototype.submit;
    var nativeRequestSubmit = HTMLFormElement.prototype.requestSubmit;
    var providerLoaded = null;
    var turnstileWidgetId = null;
    var pendingTurnstile = null;

    function loadProvider() {
        if (providerLoaded) {
            return providerLoaded;
        }

        providerLoaded = new Promise(function (resolve, reject) {
            window[ONLOAD_CALLBACK] = resolve;

            var script = document.createElement("script");
            script.src = config.scriptUrl + (config.scriptUrl.indexOf("?") >= 0 ? "&" : "?") + "onload=" + ONLOAD_CALLBACK;
            script.async = true;
            script.onerror = function () {
                providerLoaded = null;
                reject(new Error("the provider's script could not be loaded"));
            };
            document.head.appendChild(script);
        });

        return providerLoaded;
    }

    function recaptchaToken() {
        return new Promise(function (resolve, reject) {
            var enterprise = window.grecaptcha && window.grecaptcha.enterprise;

            if (!enterprise) {
                reject(new Error("reCAPTCHA Enterprise is not available"));
                return;
            }

            enterprise.ready(function () {
                enterprise.execute(config.siteKey, {action: config.action}).then(resolve, reject);
            });
        });
    }

    function settleTurnstile(error, token) {
        var pending = pendingTurnstile;
        pendingTurnstile = null;

        if (pending) {
            if (error) {
                pending.reject(error);
            } else {
                pending.resolve(token);
            }
        }
    }

    function turnstileToken() {
        return new Promise(function (resolve, reject) {
            var turnstile = window.turnstile;

            if (!turnstile) {
                reject(new Error("Turnstile is not available"));
                return;
            }

            pendingTurnstile = {resolve: resolve, reject: reject};

            if (turnstileWidgetId === null) {
                var container = document.createElement("div");
                container.className = "bot-protection-widget";
                document.body.appendChild(container);

                // invisible unless the provider decides the user must interact (managed mode)
                turnstileWidgetId = turnstile.render(container, {
                    sitekey: config.siteKey,
                    action: config.action,
                    execution: "execute",
                    appearance: "interaction-only",
                    callback: function (token) {
                        settleTurnstile(null, token);
                    },
                    "error-callback": function (code) {
                        settleTurnstile(new Error("Turnstile error " + code));
                        return true;
                    },
                    "expired-callback": function () {
                        turnstile.reset(turnstileWidgetId);
                    }
                });
            } else {
                // a widget holds one token at a time and tokens are single use
                turnstile.reset(turnstileWidgetId);
            }

            turnstile.execute(turnstileWidgetId);
        });
    }

    function getToken() {
        return loadProvider().then(function () {
            return config.provider === "turnstile" ? turnstileToken() : recaptchaToken();
        });
    }

    function needsToken(form, submitter) {
        var method = (submitter && submitter.getAttribute("formmethod")) || form.getAttribute("method") || "get";

        if (method.toLowerCase() !== "post") {
            return false;
        }

        // not form.action: an input named "action" shadows that property
        var action = (submitter && submitter.getAttribute("formaction")) || form.getAttribute("action") || "";
        var url;

        try {
            url = new URL(action, window.location.href);
        } catch (e) {
            return false;
        }

        if (url.origin !== window.location.origin) {
            return false;
        }

        return config.paths.some(function (path) {
            return url.pathname === path || url.pathname.indexOf(path + "/") === 0;
        });
    }

    function setToken(form, token) {
        var field = form.querySelector('input[type="hidden"][name="' + config.tokenField + '"]');

        if (!field) {
            field = document.createElement("input");
            field.type = "hidden";
            field.name = config.tokenField;
            form.appendChild(field);
        }

        field.value = token || "";
    }

    function withToken(form, then) {
        if (form.__botProtectionBusy) {
            return;
        }

        form.__botProtectionBusy = true;

        getToken()
            .then(function (token) {
                setToken(form, token);
            }, function (error) {
                console.warn("Bot protection: could not get a token, submitting without one:", error);
                setToken(form, "");
            })
            .then(function () {
                form.__botProtectionBusy = false;
                then();
            });
    }

    document.addEventListener("submit", function (event) {
        var form = event.target;

        if (!(form instanceof HTMLFormElement) || !needsToken(form, event.submitter)) {
            return;
        }

        if (form.__botProtectionPassThrough) {
            // the second round, with the token set: let the page's own handlers and the browser proceed
            form.__botProtectionPassThrough = false;
            return;
        }

        // hold the submission (and the page's own handlers) until there is a token
        event.preventDefault();
        event.stopImmediatePropagation();

        var submitter = event.submitter;

        withToken(form, function () {
            if (nativeRequestSubmit) {
                // requestSubmit fires the submit event synchronously; the flag must not outlive this call, or a
                // later submission (e.g. after failed constraint validation) would go out without a token
                form.__botProtectionPassThrough = true;
                try {
                    nativeRequestSubmit.call(form, submitter && submitter.form === form ? submitter : undefined);
                } finally {
                    form.__botProtectionPassThrough = false;
                }
            } else {
                if (submitter && submitter.name) {
                    var submitterField = document.createElement("input");
                    submitterField.type = "hidden";
                    submitterField.name = submitter.name;
                    submitterField.value = submitter.value;
                    form.appendChild(submitterField);
                }
                nativeSubmit.call(form);
            }
        });
    }, true);

    HTMLFormElement.prototype.submit = function () {
        var form = this;

        if (!needsToken(form)) {
            nativeSubmit.call(form);
            return;
        }

        withToken(form, function () {
            nativeSubmit.call(form);
        });
    };

    // a page restored from the back/forward cache must not reuse a spent token
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            var fields = document.querySelectorAll('input[name="' + config.tokenField + '"]');

            for (var i = 0; i < fields.length; i++) {
                fields[i].parentNode.removeChild(fields[i]);
            }

            var forms = document.forms;

            for (var j = 0; j < forms.length; j++) {
                forms[j].__botProtectionBusy = false;
                forms[j].__botProtectionPassThrough = false;
            }
        }
    });
})();
