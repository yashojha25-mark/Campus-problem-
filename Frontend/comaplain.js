const mainCategory = document.getElementById('mainCategory');
const houseLabel = document.getElementById('houseLabel');
const houseCategory = document.getElementById('houseCategory');
const issueLabel = document.getElementById('issueLabel');
const issueCategory = document.getElementById('issueCategory');

mainCategory.addEventListener('change', function() {
	const selected = this.value;
	
	houseCategory.value = '';
	issueCategory.value = '';
	
	if (selected === 'Campus') {
		houseLabel.style.display = 'block';
		issueLabel.style.display = 'none';
		houseCategory.required = true;
		issueCategory.required = false;
	}
	else if (selected === 'Girls hostel' || selected === 'Boys hostel') {
		houseLabel.style.display = 'none';
		issueLabel.style.display = 'block';
		houseCategory.required = false;
		issueCategory.required = true;
	}
	else {
		houseLabel.style.display = 'none';
		issueLabel.style.display = 'none';
		houseCategory.required = false;
		issueCategory.required = false;
	}
});

houseCategory.addEventListener('change', function() {
	if (this.value) {
		issueLabel.style.display = 'block';
		issueCategory.required = true;
	} else {
		issueLabel.style.display = 'none';
		issueCategory.required = false;
	}
});

document.getElementById('attachment').addEventListener('change', function(e) {
	const fileName = e.target.files[0]?.name;
	const fileNameDiv = document.getElementById('fileName');
	if (fileName) {
		fileNameDiv.textContent = 'Selected: ' + fileName;
	} else {
		fileNameDiv.textContent = '';
	}
});

document.getElementById('complaintForm').addEventListener('submit', function(e) {
	e.preventDefault();
	
	let finalCategory = mainCategory.value;
	if (houseCategory.value) {
		finalCategory += ' > ' + houseCategory.value;
	}
	if (issueCategory.value) {
		finalCategory += ' > ' + issueCategory.value;
	}
	
	console.log('Final Category:', finalCategory);
	
	const message = document.getElementById('message');
	message.textContent = 'Complaint submitted: ' + finalCategory;
	message.className = 'message success';
	
	setTimeout(() => {
		this.reset();
		houseLabel.style.display = 'none';
		issueLabel.style.display = 'none';
		document.getElementById('fileName').textContent = '';
		message.textContent = '';
	}, 3000);
});