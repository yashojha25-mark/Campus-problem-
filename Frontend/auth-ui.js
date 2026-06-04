document.addEventListener('DOMContentLoaded', () => {
	const logoutLink = document.getElementById('logoutLink');
	if (logoutLink && window.CampusAPI) {
		logoutLink.addEventListener('click', async (event) => {
			event.preventDefault();
			await CampusAPI.logout();
			window.location.href = 'login.html';
		});
	}

	const authContainer = document.querySelector('.hp-auth');
	if (!authContainer || !window.CampusAPI) {
		return;
	}

	const signInLink = authContainer.querySelector('.signin-link');
	const signUpLink = authContainer.querySelector('.hp-signup');
	const user = CampusAPI.getUser();

	if (CampusAPI.isLoggedIn() && user) {
		if (signInLink) {
			signInLink.textContent = user.name || 'Account';
			signInLink.href = 'complain.html';
			signInLink.classList.add('signed-in');
		}

		if (signUpLink) {
			signUpLink.textContent = 'Logout';
			signUpLink.href = '#';
			signUpLink.classList.add('logout-link');
			signUpLink.addEventListener('click', async (event) => {
				event.preventDefault();
				await CampusAPI.logout();
				window.location.href = 'index.html';
			});
		}
	}
});
