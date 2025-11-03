/*
 * Copyright (C) 2016 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

/**
 *
 * Curity UI Library
 * Helper functions for the authentication templates
 *
 * Requires jQuery to be loaded in the page. Does not require the $ variable to
 * be set.
 */

/**
 *
 */
module.exports = function () {

  var $ = jQuery;

  var _isInt = function(value) {
    var x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
  }

  var _passwordStrength = function(password) {

    if (password === undefined || password === "") {
      return 0;
    }

    var checkRepeatingChars = function(password) {
      var chars = {};
      var s = 0;
      for (var i=0; i<password.length; i++) {
          chars[password[i]] = (chars[password[i]] || 0) + 1;
          s += 5.0 / chars[password[i]];
      }
      return s;
    }
    var checkDiversity = function(password){
      var res =
        (((/\d/.test(password))    ? 1 : 0)
        + ((/[a-z]/.test(password)) ? 1 : 0)
        + ((/[A-Z]/.test(password)) ? 1 : 0)
        + ((/\W/.test(password))    ? 1 : 0));
      return res;
        //Numbers, Lowercase, Uppercase, Other
    };

    var normalizeStrength = function(strength){
      var normalizedStrength = strength;
      if (strength > 100){
        return 100;
      }
      return parseInt(normalizedStrength);
    }

    var strength = checkRepeatingChars(password);
    var diversity = checkDiversity(password);
    strength += (diversity - 1) * 10;             // If 1 then no diversity.
    return normalizeStrength(strength);
  };

  var _updateProgress = function() {
    $("div.progress div[role='progressbar']").each(function(i, val){
      var currentValue = $(this).attr("aria-valuenow");
      if(currentValue > 100 || currentValue < 0) {
        return;
      }
      $(this).width(currentValue + "%");
    });
  };

  var setProgress = function(value, element) {

    if(!_isInt(value)) {
      return;
    }
    if(element === undefined) {
      return;
    }

    value = (value < 0)? 0 : value;
    value = (value > 100)? 100 : value;
    var $element = (element instanceof jQuery) ? element : $(element);

    var role = $element.attr("role");
    var $target = undefined;
    if(role !== undefined && role !== false && role === "progressbar") {
      $target = $element;
    }
    else {
      $child = $element.find("div[role='progressbar']").first();
      if ($child.length === 0) {
        //No element found to update, do nothing.
        return;
      }
      $target = $child;
    }
    $target.width(value + "%");
    $target.attr("aria-valuenow", value);
    return $target;
  };

  var _assignPasswordStrength = function() {
      var strengthToColor = function(strength, $element){
        var allColors = ("progress-success progress-info progress-warning progress-danger");
        var strengthLabel = $(".password-strength-grade");
        $element.removeClass(allColors);
        if (strength < 33) {
          return $element.addClass("progress-danger");
        }
        else if (strength < 66) {
          return $element.addClass("progress-warning");
        }
        else {
          return $element.addClass("progress-success");
        }
      }

      var assignEvent = function($input, $progess){
        $input.on('input', function(evt) {
          var currentVal = $(this).val();
          var strength = _passwordStrength(currentVal);
          var $bar = setProgress(strength, $progess);
          strengthToColor(strength, $bar);
        })
      };

      var $passwordGroups = $(".password-group");
      $passwordGroups.each(function () {
          var $pwdField = $(this).children("input[type='password']");
          var $progressBar = $(this).children("div.progress");
          if ($progressBar.length > 0) {
              assignEvent($pwdField, $progressBar);
          }
      })
  };

  var _passwordRevealer = function() {

    var $fields = $(".password-group");

    var assignEvent = function($passwordField, $toggler) {
      $toggler.on("click", function(e) {
        e && e.preventDefault();
        if ($passwordField.attr("type") == "password") {
          $passwordField.attr("type", "text");
          $(this).addClass("active");
        } else {
          $(this).removeClass("active");
          $passwordField.attr("type", "password");
        }
      });
    }

    $fields.each(function(){
      var $toggler = $(this).find(".form-password-reveal-form-icon");
      var $passwordField = $(this).find("input");
      assignEvent($passwordField, $toggler);
    });
  };

  const _qrTimer = function() {
    const qrTimeProgress = document.getElementById('qr-time');
    if(qrTimeProgress) {
        const time_duration = document.querySelector('#qr-time-duration');
        const label = document.querySelector('#qr-time-duration span');
        const time_indicator_minutes = document.getElementById('qr-time-label-minutes');
        const time_indicator_seconds = document.getElementById('qr-time-label-seconds');
        let max = parseInt(qrTimeProgress.max);
        let value = parseInt(qrTimeProgress.value);

        const interval = setInterval(() => {
            if (value < max) {
                value += 1;
                qrTimeProgress.value = value;
                if(max - value < 60) {
                    label.textContent = (max - value).toString();
                    time_indicator_minutes.classList.add('hide')
                    time_indicator_seconds.classList.remove('hide')
                } else {
                    const minutes = Math.floor((max - value) / 60);
                    const seconds = (max - value) % 60;
                    label.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
                    time_indicator_seconds.classList.add('hide')
                    time_indicator_minutes.classList.remove('hide')
                }
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }
  };

  const _qrEnlarge = function(selector = "#trigger-fullscreen", target = document.documentElement) {
      const trigger = document.querySelector(selector);
      if (trigger) {
        trigger.addEventListener("click", event => {
          event.preventDefault();
          trigger.querySelector('img').classList.toggle('qr-enlarge');
        })
      }
  };

  // Namespace for input validation helpers
  const validation = function () {
    function debounce(func, timeout = 300) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func(...args);
        }, timeout);
      };
    }

    function strCodePoints(str) {
      if (typeof str != "string") {
        throw "Not a string";
      }
      // String iterator iterates over code points
      return [...str];
    }

    // Abstract
    class MatchingCharacters {
      constructor(minCount) {
        this.minCount = minCount;
      }

      isValid(str) {
        const codePoints = strCodePoints(str);
        let count = 0;
        for (let i = 0; i < codePoints.length; i++) {
          if (this.isMatch(codePoints[i]) && ++count >= this.minCount) {
            return true;
          }
        }
        return false;
      }

      // Abstract
      isMatch(codePoint) {
        return false;
      }
    }

    class MinimumLowerCase extends MatchingCharacters {
      constructor(minCount) {
        super(minCount);
        this.regExp = /^\p{Ll}$/u;
      }

      isMatch(codePoint) {
        return this.regExp.test(codePoint);
      }
    }

    class MinimumUpperCase extends MatchingCharacters {
      constructor(minCount) {
        super(minCount);
        this.regExp = /^\p{Lu}$/u;
      }

      isMatch(codePoint) {
        return this.regExp.test(codePoint);
      }
    }

    class MinimumDigits extends MatchingCharacters{
      constructor(minCount) {
        super(minCount);
        this.regExp = /^\p{Nd}$/u;
      }

      isMatch(codePoint) {
        return this.regExp.test(codePoint);
      }
    }

    class MinimumSpecial extends MatchingCharacters {
      constructor(minCount) {
        super(minCount);

        const baseSymbols = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
        const latin1Symbols = "\u00a1\u00a2\u00a3\u00a4\u00a5\u00a6\u00a7\u00a8\u00a9\u00aa\u00ab\u00ac\u00ad\u00ae\u00af\u00b0\u00b1\u00b2\u00b3\u00b4\u00b5\u00b6\u00b7\u00b8\u00b9\u00ba\u00bb\u00bc\u00bd\u00be\u00bf";
        this.symbolsSet = new Set([...strCodePoints(baseSymbols), ...strCodePoints(latin1Symbols)])
        this.currencySymbolsRegExp = /^\p{Sc}$/u;
      }

      isMatch(codePoint) {
        return this.symbolsSet.has(codePoint) || this.currencySymbolsRegExp.test(codePoint);
      }
    }

    class MinimumLength {
      constructor(minLength) {
        this.minLength = minLength;
      }

      isValid(str) {
        return strCodePoints(str).length >= this.minLength;
      }
    }

    class MinimumUnique {
      constructor(minCount) {
        this.minCount = minCount;
      }

      isValid(str) {
        const unique = new Set(strCodePoints(str));
        return unique.size >= this.minCount;
      }
    }

    class MaximumSequence {
      constructor(maxCount) {
        this.maxCount = maxCount;

        const englishAlphabetical = strCodePoints("abcdefghijklmnopqrstuvwxyz");
        const digits = strCodePoints("01234567890");
        const quertyLine1 = strCodePoints("qwertyuiop");
        const quertyLine2 = strCodePoints("asdfghjkl");
        const quertyLine3 = strCodePoints("zxcvbnm");
        this.sequences = [
          englishAlphabetical,
          [...englishAlphabetical].reverse(),
          digits,
          [...digits].reverse(),
          quertyLine1,
          [...quertyLine1].reverse(),
          quertyLine2,
          [...quertyLine2].reverse(),
          quertyLine3,
          [...quertyLine3].reverse(),
        ];
      }

      isValid(str) {
        const codePoints = strCodePoints(str).map(c => c.toLowerCase());
        const stopIndex = codePoints.length - this.maxCount;
        for (let startIndex = 0; startIndex < stopIndex; startIndex++) {
          const foundInSequence = this.sequences.find(s => this.isDisallowedSubsequence(codePoints, startIndex, s));
          if (foundInSequence) {
            return false;
          }
        }
        return true;
      }

      isDisallowedSubsequence(str, startIndex, sequence) {
        let sequenceIndex = sequence.indexOf(str[startIndex]);
        if (sequenceIndex < 0 || sequenceIndex + this.maxCount > sequence.length) {
          return false;
        }

        const endIndex = startIndex + this.maxCount;
        for (let i = startIndex; i <= endIndex; i++) {
          const strChar = str[i];
          const sequenceChar = sequence[sequenceIndex++]
          if (strChar !== sequenceChar) {
            return false;
          }
        }

        return true;
      }
    }

    class AlwaysValid {
      isValid() {
        return true;
      }
    }

    const rulesByType = {
      'min-lower-case-characters': MinimumLowerCase,
      'min-upper-case-characters': MinimumUpperCase,
      'min-digits': MinimumDigits,
      'min-special-characters': MinimumSpecial,
      'min-unique-characters': MinimumUnique,
      'min-length': MinimumLength,
      'max-sequence': MaximumSequence
    };

    // 'rules' should be a list of { type: string, arg: number }
    function bindInputRequirementsValidation(inputElementId, rulesElementId, rules) {
      const inputElement = document.getElementById(inputElementId)
      if (!inputElement) {
        throw "Cannot find input element";
      }

      const getRuleElement = function (index) {
        const selector = '#' + rulesElementId + ' .input-requirements-rule:nth-child(' + (index + 1) + ')';
        const element = document.querySelector(selector);
        if (!element) {
          throw "Cannot find rule element";
        }
        return element;
      };

      const viewModels = rules
          .map((r) => {
            const RuleConstructor = rulesByType[r.type];
            if (RuleConstructor && typeof r.arg === "number") {
              try {
                return new RuleConstructor(r.arg);
              } catch (e) {
                // Rule should create any needed utils on constructor. In case the rule uses some feature not
                // supported by the current browser, ignore the error.
                console.error("Error creating validation rule", r.type, e);
              }
            } else {
              console.error("Invalid validation rule definition", r.type, r.arg);
            }
            return new AlwaysValid();
          })
          .map((r, i) => ({
            rule: r,
            element: getRuleElement(i),
          }));

      inputElement.addEventListener('input', debounce((e) => {
        viewModels.forEach((m) => {
          const inputValue = e.target.value;
          if (inputValue && inputValue.length > 0 && m.rule.isValid(inputValue)) {
            m.element.classList.remove('input-requirements-rule-unmet');
            m.element.classList.add('input-requirements-rule-satisfied');
          } else {
            m.element.classList.remove('input-requirements-rule-satisfied');
            m.element.classList.add('input-requirements-rule-unmet');
          }
        });
      }));
    }

    return {
      bindInputRequirementsValidation: bindInputRequirementsValidation
    };
  }();

    /**
     * Set a flag in localStorage to remember a user decision regarding whether to enable
     * non-essential cookies.
     *
     * This flag may be set automatically by a user interface element by using the
     * {@link bindNonEssentialCookiesTo} function.
     *
     * @param enable boolean representing the user's decision
     */
    function setEnableNonEssentialCookies(enable) {
        if (typeof enable === 'boolean') {
            localStorage.setItem('curityui-enable-non-essential-cookies', enable ? '1' : '0');
        } else {
            throw Error('setEnableNonEssentialCookies expects a boolean but got: ' + enable);
        }
    }

    /**
     * Get the user's decision regarding enabling non-essential cookies.
     *
     * If the user has not explicitly made a decision, the returned value will be null.
     * Otherwise, a boolean value is returned.
     *
     * @returns {null|boolean} the user's decision, if known
     */
    function isNonEssentialCookiesEnabled() {
        var localStorageValue = localStorage.getItem('curityui-enable-non-essential-cookies');
        if (localStorageValue) {
            return localStorageValue === '1';
        }
        // no explicit decision has been made
        return null;
    }

    /**
     * Bind the non-essential cookies flag to the "checked" attribute of the given element.
     *
     * See also {@link isNonEssentialCookiesEnabled}.
     *
     * @param element HTML element to bind to (must have the "checked" attribute)
     */
    function bindNonEssentialCookiesTo(element) {
        if (!element) return;
        var isEnabled = isNonEssentialCookiesEnabled();
        if (isEnabled !== null) {
            element.checked = isEnabled;
        }
        element.onchange = function () {
            setEnableNonEssentialCookies(element.checked);
        };
    }

  var init = function () {
    _updateProgress();
    _assignPasswordStrength();
    _passwordRevealer();
    _qrTimer();
    _qrEnlarge()
  }
  init();

  return {
    setProgress: setProgress,
    validation: validation,
    setEnableNonEssentialCookies: setEnableNonEssentialCookies,
    isNonEssentialCookiesEnabled: isNonEssentialCookiesEnabled,
    bindNonEssentialCookiesTo: bindNonEssentialCookiesTo,
  };
}();
