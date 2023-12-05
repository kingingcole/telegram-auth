import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createScript } from './createScript';
import { LoginButtonProps, TTelegramAuthLogin } from './types';

/**
 * It takes an object with a bunch of properties and assigns it to the global variable
 * `TelegramAuthLogin`
 *
 * @param {TTelegramAuthLogin} options - The options to set on the global variable.
 */
function initTelegramAuthLogin(options: TTelegramAuthLogin) {
	window.TelegramAuthLogin = options;
}

/**
 * A React component that renders a Telegram login button.
 *
 * @see https://core.telegram.org/widgets/login
 *
 * @param {LoginButtonProps} props The props to pass to the component.
 * @returns A React component that renders the Telegram login button.
 */
export interface LoginButtonRef {
    clickTelegramButton: () => void;
}

export const LoginButton = forwardRef<LoginButtonRef, LoginButtonProps>((props, forwardedRef) => {
	const hiddenDivRef = useRef<HTMLDivElement>(null);
	const scriptRef = useRef<HTMLScriptElement>();

	const telegramBotElement = `telegram-login-${props.botUsername}`

	useImperativeHandle(forwardedRef, () => ({
		clickTelegramButton: () => {
			const loginBtn = document.querySelector('.tgme_widget_login_button')
			console.log({ loginBtn })
			if (loginBtn) {
				loginBtn.click()
			}
		}
	}))

	useEffect(() => {
		console.log('inside telegram button')
		// destry the existing script element
		scriptRef.current?.remove();

		// init the global variable
		initTelegramAuthLogin({ onAuthCallback: props.onAuthCallback });

		// create a new script element and save it
		scriptRef.current = createScript(props);

		// add the script element to the DOM
		hiddenDivRef.current?.after(scriptRef.current);

		 // Handle visibility
		 const toggleVisibility = () => {
            const iframe = document.getElementById(telegramBotElement) as HTMLIFrameElement;
			console.log('iframe', iframe)
            if (iframe) {
                iframe.style.display = props.hidden ? 'none' : 'block';
            }
        };

        toggleVisibility();

        // Add an observer to handle dynamic changes
        const observer = new MutationObserver(toggleVisibility);
        observer.observe(document.body, { childList: true, subtree: true });

	}, [props]);

	return <div ref={hiddenDivRef} hidden />;
})
