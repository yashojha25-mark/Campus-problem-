const STORAGE_KEY = 'campusComplaints';

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
const i18n = new Proxy({}, {
	get: (_, prop) => window.campusI18n?.[prop]
});

let complaints = loadComplaints();
let activeFilter = 'All';
let selectedPhoto = '';

renderComplaints();

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

complaintForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const place = placeInput.value;
	const house = houseInput.value;
	const complaint = {
		id: Date.now(),
		name: document.getElementById('name').value.trim(),
		email: document.getElementById('email').value.trim(),
		place,
		house,
		hostelArea: hostelAreaInput.value,
		roomNumber: roomNumberInput.value.trim(),
		problemType: document.getElementById('problemType').value,
		title: document.getElementById('title').value.trim(),
		description: document.getElementById('description').value.trim(),
		status: 'Pending',
		image: selectedPhoto,
		createdAt: new Date().toLocaleString()
	};

	complaints.unshift(complaint);
	saveComplaints();
	activeFilter = 'All';
	setActiveFilterButton();
	renderComplaints();
	resetForm();
	closeForm();

	message.textContent = i18n?.messages.complaintSuccess() || 'Complaint submitted successfully.';
	setTimeout(() => {
		message.textContent = '';
	}, 2500);
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

function loadComplaints() {
	const savedComplaints = localStorage.getItem(STORAGE_KEY);
	return savedComplaints ? JSON.parse(savedComplaints) : [];
}

function saveComplaints() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

function renderComplaints() {
	const visibleComplaints = complaints.filter((complaint) => {
		return activeFilter === 'All' || complaint.place === activeFilter;
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
	image.src = complaint.image || placeholderImage();
	image.alt = `${complaint.title} complaint photo`;

	const content = document.createElement('div');
	content.className = 'complaint-content';

	const top = document.createElement('div');
	top.className = 'complaint-top';

	const title = document.createElement('h2');
	title.className = 'complaint-title';
	title.textContent = complaint.title;

	const status = document.createElement('span');
	status.className = 'status';
	status.textContent = complaint.status;

	const meta = document.createElement('div');
	meta.className = 'meta';

	const place = document.createElement('span');
	place.className = 'pill';
	place.textContent = getComplaintLocation(complaint);

	const problemType = document.createElement('span');
	problemType.className = 'pill';
	problemType.textContent = complaint.problemType;

	const createdAt = document.createElement('span');
	createdAt.textContent = complaint.createdAt;

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

function getComplaintLocation(complaint) {
	if (complaint.house) {
		return `${complaint.place} - ${complaint.house}`;
	}

	if (complaint.hostelArea === 'Room' && complaint.roomNumber) {
		return `${complaint.place} - Room ${complaint.roomNumber}`;
	}

	if (complaint.hostelArea) {
		return `${complaint.place} - ${complaint.hostelArea}`;
	}

	return complaint.place;
}

function placeholderImage() {
	return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360">
			<rect width="480" height="360" fill="#e2e8f0"/>
			<rect x="72" y="88" width="336" height="184" rx="16" fill="#cbd5e1"/>
			<circle cx="174" cy="154" r="34" fill="#94a3b8"/>
			<path d="M104 246l86-70 54 48 42-38 90 60z" fill="#64748b"/>
			<text x="240" y="312" text-anchor="middle" font-family="Arial" font-size="24" fill="#475569">No Photo</text>
		</svg>
	`);
}
