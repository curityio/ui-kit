/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

export function StartPage() {
    return (
        <div className="mx-auto mw-60 center">
            <img
                src="/images/start.jpg"
                alt="Login Web App Previewer"
                loading="lazy"
                className="block mx-auto start-page-image"
            />
            <h1>Login Web App Previewer</h1>
            <p>Welcome to the previewer. Select a view from the sidebar to see examples.</p>
        </div>
    );
}
