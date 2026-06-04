const AREA_LABELS = {
	campus: 'Campus',
	'boys-hostel': 'Boys hostel',
	'girls-hostel': 'Girls hostel',
};

const PROBLEM_TYPE_MAP = {
	'Water leakage': 'maintenance',
	'Fan not working': 'maintenance',
	'Electricity issues': 'electricity',
	'WiFi issues': 'other',
	'Cleanliness concerns': 'cleaning',
	'Furniture damage': 'maintenance',
	Other: 'other',
};

const complaintForm = document.getElementById('complaintForm');
const complaintList = document.getElementById('complaintList');
const emptyState = document.getElementById('emptyState');
const formPanel = document.getElementById('formPanel');
const modalBackdrop = document.getElementById('modalBackdrop');
const openFormBtn = document.getElementById('openFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const placeInput = document.getElementById('place');
const houseField = document.getElementById('houseField');
const houseInput = document.getElementById('house');
const hostelAreaField = document.getElementById('hostelAreaField');
const hostelAreaInput = document.getElementById('hostelArea');
const roomField = document.getElementById('roomField');
const roomNumberInput = document.getElementById('roomNumber');
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photoPreview');
const previewImage = document.getElementById('previewImage');
const removePhotoBtn = document.getElementById('removePhotoBtn');
const message = document.getElementById('message');
const filterButtons = document.querySelectorAll('.filter-btn');
const loadingState = document.getElementById('loadingState');

let complaints = [];
let activeFilter = 'All';
let selectedPhoto = '';

function showMessage(text, isError) {
	if (!message) {
		return;
	}

	message.textContent = text;
	message.classList.toggle('error', Boolean(isError));
}

function mapPlaceToArea(place) {
	if (place === 'Boys hostel') {
		return 'boys-hostel';
	}
	if (place === 'Girls hostel') {
		return 'girls-hostel';
	}
	return 'campus';
}

function mapFilterToArea(filter) {
	if (filter === 'Boys hostel') {
		return 'boys-hostel';
	}
	if (filter === 'Girls hostel') {
		return 'girls-hostel';
	}
	if (filter === 'Campus') {
		return 'campus';
	}
	return null;
}

function resolveComplaintType(hostelArea, problemType) {
	if (hostelArea === 'Room') {
		return 'room';
	}
	if (hostelArea === 'Dining Hall') {
		return 'dining-hall';
	}
	return PROBLEM_TYPE_MAP[problemType] || 'other';
}

function buildDescription({ description, problemType, house, place, hostelArea }) {
	const parts = [description.trim()];

	if (problemType) {
		parts.unshift(`Category: ${problemType}`);
	}
	if (house) {
		parts.unshift(`House: ${house}`);
	}
	if (hostelArea && place !== 'Campus') {
		parts.unshift(`Area: ${hostelArea}`);
	}
	return parts.filter(Boolean).join('\n');
}

function formatStatus(status) {
	if (!status) {
		return 'Pending';
	}
	return status
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

function formatDate(value) {
	if (!value) {
		return '';
	}
	return new Date(value).toLocaleString();
}

async function initPage() {
	if (!CampusAPI.requireAuth('complain.html')) {
		return;
	}

	setLoading(true);

	try {
		const user = await CampusAPI.fetchProfile();
		prefillUserFields(user);
		complaints = await CampusAPI.fetchMyComplaints();
		renderComplaints();
	} catch (error) {
		if (error.status === 401) {
			CampusAPI.clearAuth();
			CampusAPI.requireAuth('complain.html');
			return;
		}
		showMessage(CampusAPI.formatApiError(error), true);
	} finally {
		setLoading(false);
	}
}

function prefillUserFields(user) {
	if (!user) {
		return;
	}

	const nameInput = document.getElementById('name');
	const emailInput = document.getElementById('email');

	if (nameInput && !nameInput.value) {
		nameInput.value = user.name || '';
	}
	if (emailInput && !emailInput.value) {
		emailInput.value = user.email || '';
	}
}

function setLoading(isLoading) {
	if (loadingState) {
		loadingState.hidden = !isLoading;
	}
	if (complaintList) {
		complaintList.style.opacity = isLoading ? '0.5' : '1';
	}
}

openFormBtn.addEventListener('click', () => {
	openForm();
});

closeFormBtn.addEventListener('click', () => {
	closeForm();
});

modalBackdrop.addEventListener('click', () => {
	closeForm();
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && !formPanel.hidden) {
		closeForm();
	}
});

placeInput.addEventListener('change', () => {
	const isCampus = placeInput.value === 'Campus';
	const isHostel = placeInput.value === 'Girls hostel' || placeInput.value === 'Boys hostel';
	houseField.hidden = !isCampus;
	houseInput.required = isCampus;
	hostelAreaField.hidden = !isHostel;
	hostelAreaInput.required = isHostel;
	if (!isCampus) {
		houseInput.value = '';
	}
	if (!isHostel) {
		hostelAreaInput.value = '';
		roomNumberInput.value = '';
		roomField.hidden = true;
		roomNumberInput.required = false;
	}
});

hostelAreaInput.addEventListener('change', () => {
	const isRoom = hostelAreaInput.value === 'Room';
	roomField.hidden = !isRoom;
	roomNumberInput.required = isRoom;
	if (!isRoom) {
		roomNumberInput.value = '';
	}
});

photoInput.addEventListener('change', () => {
	const file = photoInput.files[0];
	if (!file) {
		clearPhoto();
		return;
	}

	const reader = new FileReader();
	reader.onload = () => {
		selectedPhoto = reader.result;
		previewImage.src = selectedPhoto;
		photoPreview.hidden = false;
	};
	reader.readAsDataURL(file);
});

removePhotoBtn.addEventListener('click', () => {
	clearPhoto();
});

filterButtons.forEach((button) => {
	button.addEventListener('click', () => {
		filterButtons.forEach((item) => item.classList.remove('active'));
		button.classList.add('active');
		activeFilter = button.dataset.filter;
		renderComplaints();
	});
});

complaintForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const place = placeInput.value;
	const house = houseInput.value;
	const hostelArea = hostelAreaInput.value;
	const problemType = document.getElementById('problemType').value;
	const type = resolveComplaintType(hostelArea, problemType);
	const area = mapPlaceToArea(place);
	const roomNumber = roomNumberInput.value.trim();
	const title = document.getElementById('title').value.trim();
	const description = document.getElementById('description').value.trim();

	if (type === 'room' && !roomNumber) {
		showMessage('Room number is required for room complaints.', true);
		return;
	}

	const submitButton = complaintForm.querySelector('.submit-btn');
	submitButton.disabled = true;
	showMessage('Submitting complaint...', false);

	const photoFile = photoInput.files[0] || null;

	try {
		await CampusAPI.createComplaint(
			{
				name: document.getElementById('name').value.trim(),
				email: document.getElementById('email').value.trim(),
				title,
				type,
				area,
				roomNumber: type === 'room' ? roomNumber : undefined,
				description: buildDescription({
					description,
					problemType,
					house,
					place,
					hostelArea,
				}),
			},
			photoFile
		);

		complaints = await CampusAPI.fetchMyComplaints();
		activeFilter = 'All';
		setActiveFilterButton();
		renderComplaints();
		resetForm();
		closeForm();
		showMessage('Complaint submitted successfully.', false);
	} catch (error) {
		showMessage(CampusAPI.formatApiError(error), true);
	} finally {
		submitButton.disabled = false;
	}
});

function openForm() {
	modalBackdrop.hidden = false;
	formPanel.hidden = false;
	document.body.style.overflow = 'hidden';
	document.getElementById('name').focus();
}

function closeForm() {
	formPanel.hidden = true;
	modalBackdrop.hidden = true;
	document.body.style.overflow = '';
}

function renderComplaints() {
	const areaFilter = mapFilterToArea(activeFilter);
	const visibleComplaints = complaints.filter((complaint) => {
		return activeFilter === 'All' || complaint.area === areaFilter;
	});

	complaintList.innerHTML = '';
	emptyState.hidden = visibleComplaints.length > 0;

	visibleComplaints.forEach((complaint) => {
		complaintList.appendChild(createComplaintCard(complaint));
	});
}

function createComplaintCard(complaint) {
	const card = document.createElement('article');
	card.className = 'complaint-card';

	const image = document.createElement('img');
	image.className = 'complaint-photo';
	image.src = complaint.imageUrl
		? CampusAPI.resolveAssetUrl(complaint.imageUrl)
		: placeholderImage();
	image.alt = `${complaint.title} complaint`;

	const content = document.createElement('div');
	content.className = 'complaint-content';

	const top = document.createElement('div');
	top.className = 'complaint-top';

	const title = document.createElement('h2');
	title.className = 'complaint-title';
	title.textContent = complaint.title;

	const status = document.createElement('span');
	status.className = `status status-${(complaint.status || 'pending').replace(/\s+/g, '-')}`;
	status.textContent = formatStatus(complaint.status);

	const meta = document.createElement('div');
	meta.className = 'meta';

	const place = document.createElement('span');
	place.className = 'pill';
	place.textContent = AREA_LABELS[complaint.area] || complaint.area;

	const problemType = document.createElement('span');
	problemType.className = 'pill';
	problemType.textContent = formatStatus(complaint.type);

	const createdAt = document.createElement('span');
	createdAt.textContent = formatDate(complaint.createdAt);

	const description = document.createElement('p');
	description.className = 'description';
	description.textContent = complaint.description;

	top.append(title, status);
	meta.append(place, problemType, createdAt);
	content.append(top, meta, description);
	card.append(image, content);

	return card;
}

function resetForm() {
	complaintForm.reset();
	houseField.hidden = true;
	houseInput.required = false;
	hostelAreaField.hidden = true;
	hostelAreaInput.required = false;
	roomField.hidden = true;
	roomNumberInput.required = false;
	clearPhoto();
	prefillUserFields(CampusAPI.getUser());
}

function clearPhoto() {
	selectedPhoto = '';
	photoInput.value = '';
	previewImage.removeAttribute('src');
	photoPreview.hidden = true;
}

function setActiveFilterButton() {
	filterButtons.forEach((button) => {
		button.classList.toggle('active', button.dataset.filter === activeFilter);
	});
}

function placeholderImage() {
	return (
		'data:image/svg+xml;charset=UTF-8,' +
		encodeURIComponent(`
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360">
			<rect width="480" height="360" fill="#e2e8f0"/>
			<rect x="72" y="88" width="336" height="184" rx="16" fill="#cbd5e1"/>
			<circle cx="174" cy="154" r="34" fill="#94a3b8"/>
			<path d="M104 246l86-70 54 48 42-38 90 60z" fill="#64748b"/>
			<text x="240" y="312" text-anchor="middle" font-family="Arial" font-size="24" fill="#475569">Campus Problem</text>
		</svg>
	`)
	);
}

initPage();
