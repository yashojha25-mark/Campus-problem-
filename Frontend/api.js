(function () {
	const TOKEN_KEY = 'campusAuthToken';
	const USER_KEY = 'campusUser';

	// Backend URL — always direct to the API server.
	// Backend CORS allows all localhost origins in development mode,
	// so this works no matter which port the frontend is served from.
	const BACKEND_URL = 'http://localhost:5000';

	class ApiError extends Error {
		constructor(message, status, payload) {
			super(message);
			this.name = 'ApiError';
			this.status = status;
			this.payload = payload;
		}
	}

	function getBaseUrl() {
		// Allow runtime override via window.CAMPUS_API_URL (useful for production deploys).
		if (typeof window.CAMPUS_API_URL === 'string' && window.CAMPUS_API_URL.trim()) {
			return window.CAMPUS_API_URL.replace(/\/$/, '');
		}
		// Always hit the backend directly — works on any frontend port.
		return BACKEND_URL;
	}

	function resolveAssetUrl(assetPath) {
		if (!assetPath) {
			return null;
		}
		if (/^https?:\/\//i.test(assetPath) || assetPath.startsWith('data:')) {
			return assetPath;
		}
		return `${getBaseUrl()}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`;
	}

	function getToken() {
		return localStorage.getItem(TOKEN_KEY);
	}

	function setToken(token) {
		if (token) {
			localStorage.setItem(TOKEN_KEY, token);
		} else {
			localStorage.removeItem(TOKEN_KEY);
		}
	}

	function getUser() {
		const raw = localStorage.getItem(USER_KEY);
		if (!raw) {
			return null;
		}

		try {
			return JSON.parse(raw);
		} catch {
			return null;
		}
	}

	function setUser(user) {
		if (user) {
			localStorage.setItem(USER_KEY, JSON.stringify(user));
		} else {
			localStorage.removeItem(USER_KEY);
		}
	}

	function clearAuth() {
		setToken(null);
		setUser(null);
	}

	function isLoggedIn() {
		return Boolean(getToken());
	}

	function formatApiError(error) {
		if (!error || !error.payload) {
			return error?.message || 'Something went wrong. Please try again.';
		}

		if (Array.isArray(error.payload.errors) && error.payload.errors.length > 0) {
			return error.payload.errors.map((item) => item.msg).join('. ');
		}

		return error.payload.message || error.message || 'Request failed';
	}

	async function parseResponse(response) {
		let data = {};
		const contentType = response.headers.get('content-type') || '';
		if (contentType.includes('application/json')) {
			data = await response.json();
		}
		return data;
	}

	async function request(path, options = {}) {
		const method = (options.method || 'GET').toUpperCase();
		const headers = { ...(options.headers || {}) };
		if (method !== 'GET' && method !== 'HEAD' && !headers['Content-Type']) {
			headers['Content-Type'] = 'application/json';
		}
		const token = getToken();
		if (token) headers.Authorization = `Bearer ${token}`;
		const response = await fetch(`${getBaseUrl()}${path}`, { 
			...options, 
			headers,
			cache: 'no-store' 
		});
		const data = await parseResponse(response);
		if (!response.ok) throw new ApiError(data.message || 'Request failed', response.status, data);
		return data;
	}

	async function requestMultipart(path, formData, method = 'POST') {
		const headers = {};
		const token = getToken();
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		const response = await fetch(`${getBaseUrl()}${path}`, {
			method,
			headers,
			body: formData,
		});

		const data = await parseResponse(response);

		if (!response.ok) {
			throw new ApiError(data.message || 'Request failed', response.status, data);
		}

		return data;
	}

	async function register({ name, email, password }) {
		const res = await request('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify({ name, email, password }),
		});
		return res.data;
	}

	async function login({ email, password }) {
		const res = await request('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});
		const data = res.data;

		if (data && data.token) {
			setToken(data.token);
		}
		if (data && data.user) {
			setUser(data.user);
		}

		return data;
	}

	async function logout() {
		try {
			await request('/api/auth/logout', { method: 'POST' });
		} catch {
			// Client-side logout still works if the server is unreachable.
		} finally {
			clearAuth();
		}
	}

	async function fetchProfile() {
		const res = await request('/api/auth/me');
		const data = res.data;
		if (data && data.user) {
			setUser(data.user);
		}
		return data ? data.user : null;
	}

	async function updateProfile({ name }) {
		const res = await request('/api/auth/me', {
			method: 'PATCH',
			body: JSON.stringify({ name }),
		});
		const data = res.data;
		if (data && data.user) {
			setUser(data.user);
		}
		return data ? data.user : null;
	}

	async function requestPasswordReset({ email }) {
		const res = await request('/api/auth/forgot-password', {
			method: 'POST',
			body: JSON.stringify({ email }),
		});
		return {
			message: res.message,
			resetToken: res.data?.resetToken,
			note: res.data?.note
		};
	}

	async function resetPassword({ email, resetToken, password }) {
		const res = await request('/api/auth/reset-password', {
			method: 'POST',
			body: JSON.stringify({ email, resetToken, password }),
		});
		return res.data;
	}

	async function fetchMyComplaints() {
		const res = await request('/api/complaints/my');
		return res.data?.complaints || [];
	}

	async function createComplaint(payload, photoFile) {
		if (photoFile) {
			const formData = new FormData();
			Object.entries(payload).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					formData.append(key, value);
				}
			});
			formData.append('photo', photoFile);
			const res = await requestMultipart('/api/complaints', formData);
			return res.data;
		}

		const res = await request('/api/complaints', {
			method: 'POST',
			body: JSON.stringify(payload),
		});
		return res.data;
	}

	async function fetchMyFeedback() {
		const res = await request('/api/feedback/my');
		return res.data?.feedbacks || [];
	}

	async function createFeedback(payload) {
		const res = await request('/api/feedback', {
			method: 'POST',
			body: JSON.stringify(payload),
		});
		return res.data;
	}

	async function submitContact({ name, email, message }) {
		const res = await request('/api/contact', {
			method: 'POST',
			body: JSON.stringify({ name, email, message }),
		});
		return res.data;
	}

	function requireAuth(redirectPath) {
		if (isLoggedIn()) {
			return true;
		}

		const redirect = redirectPath || window.location.pathname.split('/').pop();
		window.location.href = `login.html?redirect=${encodeURIComponent(redirect)}`;
		return false;
	}

	window.CampusAPI = {
		ApiError,
		getBaseUrl,
		resolveAssetUrl,
		getToken,
		setToken,
		getUser,
		setUser,
		clearAuth,
		isLoggedIn,
		formatApiError,
		request,
		register,
		login,
		logout,
		fetchProfile,
		updateProfile,
		requestPasswordReset,
		resetPassword,
		fetchMyComplaints,
		createComplaint,
		fetchMyFeedback,
		createFeedback,
		submitContact,
		requireAuth,
	};
})();
