const signupButton = document.getElementById('sign');
const loginButton = document.getElementById('btn');
const recoverButton = document.getElementById('recover');
const passwordToggles = document.querySelectorAll('.toggle-password');

function showMessage(text, isError) {
	const message = document.getElementById('message');

	if (message) {
		message.innerText = text;
		message.style.color = isError ? '#c0392b' : '#1f8a70';
	} else {
		alert(text);
	}
}

function getInputValue(id) {
	const input = document.getElementById(id);
	return input ? input.value.trim() : '';
}

function clearUserInfo() {
	['name', 'email', 'password', 'passw', 'new-password', 'confirm-password'].forEach((id) => {
		const input = document.getElementById(id);
		if (input) {
			input.value = '';
		}
	});
}

function setButtonLoading(button, isLoading, loadingText) {
	if (!button) {
		return;
	}

	button.disabled = isLoading;
	button.dataset.originalText = button.dataset.originalText || button.textContent;
	button.textContent = isLoading ? loadingText : button.dataset.originalText;
}

function getRedirectTarget() {
	const params = new URLSearchParams(window.location.search);
	const redirect = params.get('redirect');
	return redirect && !redirect.includes('://') ? redirect : 'index.html';
}

passwordToggles.forEach((toggleButton) => {
	toggleButton.addEventListener('click', () => {
		const passwordInput = toggleButton.previousElementSibling;
		if (!passwordInput) {
			return;
		}

		const isHidden = passwordInput.type === 'password';
		passwordInput.type = isHidden ? 'text' : 'password';
		toggleButton.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
	});
});

if (signupButton) {
	signupButton.addEventListener('click', async (e) => {
		e.preventDefault();
		const name = getInputValue('name');
		const email = getInputValue('email');
		const password = getInputValue('password');
		const confirmPassword = getInputValue('passw');

		if (!name || !email || !password || !confirmPassword) {
			showMessage('Please fill all fields', true);
			return;
		}

		if (password.length < 6) {
			showMessage('Password must be at least 6 characters', true);
			return;
		}

		if (password !== confirmPassword) {
			showMessage('Passwords do not match', true);
			return;
		}

		setButtonLoading(signupButton, true, 'Creating account...');

		try {
			await CampusAPI.register({ name, email, password });
			showMessage('Account created. You can log in now.', false);
			clearUserInfo();
			setTimeout(() => {
				window.location.href = 'login.html';
			}, 900);
		} catch (error) {
			showMessage(CampusAPI.formatApiError(error), true);
		} finally {
			setButtonLoading(signupButton, false, 'Sign Up');
		}
	});
}

if (loginButton) {
	loginButton.addEventListener('click', async (e) => {
		e.preventDefault();
		const email = getInputValue('email');
		const password = getInputValue('password');

		if (!email || !password) {
			showMessage('Please enter email and password', true);
			return;
		}

		setButtonLoading(loginButton, true, 'Signing in...');

		try {
			await CampusAPI.login({ email, password });
			showMessage('Login successful', false);
			clearUserInfo();
			setTimeout(() => {
				window.location.href = getRedirectTarget();
			}, 500);
		} catch (error) {
			showMessage(CampusAPI.formatApiError(error), true);
		} finally {
			setButtonLoading(loginButton, false, 'Login');
		}
	});
}

const requestCodeButton = document.getElementById('requestCode');

if (requestCodeButton) {
	requestCodeButton.addEventListener('click', async (e) => {
		e.preventDefault();
		const email = getInputValue('email');

		if (!email) {
			showMessage('Enter your email first', true);
			return;
		}

		setButtonLoading(requestCodeButton, true, 'Sending code...');

		try {
			const data = await CampusAPI.requestPasswordReset({ email });
			let message = data.message || 'If the account exists, a reset code was generated.';

			if (data.resetToken) {
				message += ` Dev code: ${data.resetToken}`;
				const resetTokenInput = document.getElementById('resetToken');
				if (resetTokenInput) {
					resetTokenInput.value = data.resetToken;
				}
			}

			showMessage(message, false);
		} catch (error) {
			showMessage(CampusAPI.formatApiError(error), true);
		} finally {
			setButtonLoading(requestCodeButton, false, 'Send reset code');
		}
	});
}

if (recoverButton) {
	recoverButton.addEventListener('click', async (e) => {
		e.preventDefault();
		const email = getInputValue('email');
		const resetToken = getInputValue('resetToken');
		const password = getInputValue('new-password');
		const confirmPassword = getInputValue('confirm-password');

		if (!email || !resetToken || !password || !confirmPassword) {
			showMessage('Fill email, reset code, and both password fields', true);
			return;
		}

		if (password.length < 6) {
			showMessage('Password must be at least 6 characters', true);
			return;
		}

		if (password !== confirmPassword) {
			showMessage('Passwords do not match', true);
			return;
		}

		setButtonLoading(recoverButton, true, 'Updating password...');

		try {
			await CampusAPI.resetPassword({ email, resetToken, password });
			showMessage('Password updated. Redirecting to login...', false);
			clearUserInfo();
			setTimeout(() => {
				window.location.href = 'login.html';
			}, 900);
		} catch (error) {
			showMessage(CampusAPI.formatApiError(error), true);
		} finally {
			setButtonLoading(recoverButton, false, 'Recover Password');
		}
	});
}

if (CampusAPI.isLoggedIn() && loginButton) {
	window.location.href = getRedirectTarget();
}
