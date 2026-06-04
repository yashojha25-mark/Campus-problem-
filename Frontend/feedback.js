/* feedback.js — mirrors complain.js structure exactly */

const formPanel    = document.getElementById('formPanel');
const modalBackdrop = document.getElementById('modalBackdrop');
const openFormBtn  = document.getElementById('openFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const feedbackList = document.getElementById('feedbackList');
const emptyState   = document.getElementById('emptyState');
const listMessage  = document.getElementById('listMessage');
const formMessage  = document.getElementById('formMessage');
const description  = document.getElementById('description');
const charCount    = document.getElementById('charCount');

let feedbacks = [];

/* ── Helpers ──────────────────────────────────────────────── */
function escapeHtml(value) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function formatDate(value) {
	if (!value) return '';
	return new Date(value).toLocaleString();
}

function setListMessage(text) {
	if (!listMessage) return;
	listMessage.textContent = text;
	listMessage.hidden = !text;
}

function showFormMessage(text, isError) {
	if (!formMessage) return;
	formMessage.textContent = text;
	formMessage.className = 'form-message ' + (isError ? 'error' : 'success');
	formMessage.hidden = false;
	if (!isError) {
		setTimeout(() => { formMessage.hidden = true; }, 3000);
	}
}

function hideFormMessage() {
	if (formMessage) formMessage.hidden = true;
}

/* ── Modal open / close (same pattern as complain.js) ──────── */
function openForm() {
	modalBackdrop.hidden = false;
	formPanel.hidden = false;
	document.body.style.overflow = 'hidden';
	hideFormMessage();
	setTimeout(() => {
		const nameInput = document.getElementById('name');
		if (nameInput) nameInput.focus();
	}, 60);
}

function closeForm() {
	formPanel.hidden = true;
	modalBackdrop.hidden = true;
	document.body.style.overflow = '';
	hideFormMessage();
	if (openFormBtn) openFormBtn.focus();
}

openFormBtn.addEventListener('click', openForm);
closeFormBtn.addEventListener('click', closeForm);
modalBackdrop.addEventListener('click', closeForm);

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && !formPanel.hidden) closeForm();
});

/* ── Character counter ──────────────────────────────────────── */
description.addEventListener('input', () => {
	charCount.textContent = description.value.length;
});

/* ── Render feedback cards ──────────────────────────────────── */
function renderFeedbacks() {
	feedbackList.innerHTML = '';

	if (feedbacks.length === 0) {
		emptyState.hidden = false;
		setListMessage('');
		return;
	}

	emptyState.hidden = true;
	setListMessage('');

	feedbacks.forEach((fb) => {
		const item = document.createElement('article');
		item.className = 'feedback-item';

		const body      = fb.descriptionFeedback || fb.description || '';
		const shortDesc = escapeHtml(body);
		const needsToggle = shortDesc.length > 220;

		item.innerHTML = `
			<h3>${escapeHtml(fb.title)}</h3>
			<small>by ${escapeHtml(fb.name)} (${escapeHtml(fb.email)}) &middot; ${escapeHtml(formatDate(fb.createdAt))}</small>
			<p class="desc">${shortDesc}</p>
			${needsToggle ? '<button type="button" class="read-more">Read more</button>' : ''}
		`;

		if (needsToggle) {
			const btn  = item.querySelector('.read-more');
			const desc = item.querySelector('.desc');
			btn.addEventListener('click', () => {
				const expanded = btn.textContent === 'Show less';
				desc.style.maxHeight = expanded ? '84px' : 'none';
				btn.textContent = expanded ? 'Read more' : 'Show less';
			});
		}

		feedbackList.appendChild(item);
	});
}

/* ── Prefill user fields ────────────────────────────────────── */
function prefillUserFields(user) {
	if (!user) return;
	const nameInput  = document.getElementById('name');
	const emailInput = document.getElementById('email');
	if (nameInput  && !nameInput.value)  nameInput.value  = user.name  || '';
	if (emailInput && !emailInput.value) emailInput.value = user.email || '';
}

/* ── Init page ──────────────────────────────────────────────── */
async function initPage() {
	if (!CampusAPI.requireAuth('feedback.html')) return;

	setListMessage('Loading feedback…');

	try {
		const user = await CampusAPI.fetchProfile();
		prefillUserFields(user);
		feedbacks = await CampusAPI.fetchMyFeedback();
		renderFeedbacks();
	} catch (error) {
		if (error.status === 401) {
			CampusAPI.clearAuth();
			CampusAPI.requireAuth('feedback.html');
			return;
		}
		setListMessage(CampusAPI.formatApiError(error));
	}
}

/* ── Form submit ────────────────────────────────────────────── */
document.getElementById('Feedbackform').addEventListener('submit', async (event) => {
	event.preventDefault();
	hideFormMessage();

	const name               = document.getElementById('name').value.trim();
	const email              = document.getElementById('email').value.trim();
	const title              = document.getElementById('title').value.trim();
	const descriptionFeedback = description.value.trim();

	if (!name || !email || !title || !descriptionFeedback) {
		showFormMessage('Please fill all fields.', true);
		return;
	}

	const submitBtn = event.target.querySelector('.submit-btn');
	submitBtn.disabled = true;
	submitBtn.textContent = 'Sending…';

	try {
		await CampusAPI.createFeedback({ name, email, title, descriptionFeedback });
		feedbacks = await CampusAPI.fetchMyFeedback();
		renderFeedbacks();

		event.target.reset();
		charCount.textContent = '0';
		prefillUserFields(CampusAPI.getUser());
		showFormMessage('Feedback submitted successfully! 🎉', false);

		setTimeout(closeForm, 1400);
	} catch (error) {
		showFormMessage(CampusAPI.formatApiError(error), true);
	} finally {
		submitBtn.disabled = false;
		submitBtn.textContent = '➤ Send Feedback';
	}
});

initPage();
