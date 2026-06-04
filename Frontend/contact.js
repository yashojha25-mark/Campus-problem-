document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('.contact-form-box form');
	if (!form) {
		return;
	}

	const nameInput = form.querySelector('#name');
	const emailInput = form.querySelector('#email');
	const messageInput = form.querySelector('#message');
	const submitButton = form.querySelector('.submit-btn') || form.querySelector('button[type="submit"]');
	const infoSection = document.querySelector('.contact-info');

	const style = document.createElement('style');
	style.textContent =
		'.counter{font-size:.85rem;color:#666;margin-top:6px}.toggle-btn{cursor:pointer;margin-top:8px;padding:4px 8px;border-radius:6px;background:#f0f0f0;border:1px solid #ddd}.sending{opacity:.8}.form-message{margin-bottom:12px}';
	document.head.appendChild(style);

	if (messageInput) {
		const max = 1000;
		const counter = document.createElement('div');
		counter.className = 'counter';
		const updateCounter = () => {
			counter.textContent = `${Math.max(0, max - messageInput.value.length)} characters remaining`;
		};
		messageInput.parentNode.appendChild(counter);
		messageInput.addEventListener('input', updateCounter);
		updateCounter();
	}

	if (infoSection) {
		const toggleButton = document.createElement('button');
		toggleButton.type = 'button';
		toggleButton.className = 'toggle-btn';
		toggleButton.textContent = 'Hide Details';
		infoSection.insertBefore(toggleButton, infoSection.firstChild);
		toggleButton.addEventListener('click', () => {
			const hide = toggleButton.textContent === 'Hide Details';
			infoSection.querySelectorAll('.info-item').forEach((item) => {
				item.style.display = hide ? 'none' : '';
			});
			toggleButton.textContent = hide ? 'Show Details' : 'Hide Details';
		});
	}

	function showFormMessage(text, isError) {
		form.querySelector('.form-message')?.remove();
		const message = document.createElement('div');
		message.className = 'form-message';
		message.style.color = isError ? '#c0392b' : '#1f8a70';
		message.textContent = text;
		form.insertBefore(message, form.firstChild);
	}

	function isValid() {
		return (
			nameInput &&
			emailInput &&
			messageInput &&
			nameInput.value.trim().length > 1 &&
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()) &&
			messageInput.value.trim().length > 5
		);
	}

	function toggleSubmit() {
		if (submitButton) {
			submitButton.disabled = !isValid();
		}
	}

	[nameInput, emailInput, messageInput].filter(Boolean).forEach((element) => {
		element.addEventListener('input', toggleSubmit);
	});
	toggleSubmit();

	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		if (!isValid()) {
			showFormMessage('Please complete the form correctly.', true);
			return;
		}

		const originalLabel = submitButton?.textContent || 'Send Message';
		if (submitButton) {
			submitButton.textContent = 'Sending...';
			submitButton.classList.add('sending');
			submitButton.disabled = true;
		}

		try {
			if (!window.CampusAPI) {
				throw new Error('API client is not loaded');
			}

			await CampusAPI.submitContact({
				name: nameInput.value.trim(),
				email: emailInput.value.trim(),
				message: messageInput.value.trim(),
			});

			showFormMessage('Message sent — we will reply within 24 hours.', false);
			form.reset();
			messageInput?.dispatchEvent(new Event('input'));
			toggleSubmit();
		} catch (error) {
			const message = window.CampusAPI
				? CampusAPI.formatApiError(error)
				: error.message || 'Could not send message';
			showFormMessage(message, true);
		} finally {
			if (submitButton) {
				submitButton.textContent = originalLabel;
				submitButton.classList.remove('sending');
				toggleSubmit();
			}
		}
	});
});
