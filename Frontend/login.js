const signupButton = document.getElementById("sign");
const loginButton = document.getElementById("btn");
const recoverButton = document.getElementById("recover");
const passwordToggles = document.querySelectorAll(".toggle-password");

function showMessage(text) {
  const message = document.getElementById("message");

  if (message) {
    message.innerText = text;
  } else {
    alert(text);
  }
}

function getInputValue(id) {
  return document.getElementById(id).value.trim();
}

function clearUserInfo() {
  ["name", "email", "password", "passw", "new-password", "confirm-password"].forEach(function (id) {
    const input = document.getElementById(id);

    if (input) {
      input.value = "";
    }
  });
}

if (signupButton) {
  signupButton.addEventListener("click", function () {
    const name = getInputValue("name");
    const email = getInputValue("email");
    const password = getInputValue("password");
    const confirmPassword = getInputValue("passw");

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
      showMessage("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match");
      return;
    }

    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    showMessage("Signup done");
    clearUserInfo();
    window.location.href = "login.html";
  });
}

passwordToggles.forEach(function (toggleButton) {
  toggleButton.addEventListener("click", function () {
    const passwordInput = toggleButton.previousElementSibling;

    if (!passwordInput) {
      return;
    }

    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggleButton.setAttribute(
      "aria-label",
      isHidden ? "Hide password" : "Show password"
    );
  });
});

if (recoverButton) {
  recoverButton.addEventListener("click", function () {
    const email = getInputValue("email");
    const newPassword = getInputValue("new-password");
    const confirmPassword = getInputValue("confirm-password");
    const user = JSON.parse(localStorage.getItem("user"));

    if (email === "" || newPassword === "" || confirmPassword === "") {
      showMessage("Please fill all fields");
      return;
    }

    if (!user || email !== user.email) {
      showMessage("No account found with this email");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match");
      return;
    }

    user.password = newPassword;
    localStorage.setItem("user", JSON.stringify(user));
    showMessage("Password updated");
    clearUserInfo();

    setTimeout(function () {
      window.location.href = "login.html";
    }, 800);
  });
}

if (loginButton) {
  loginButton.addEventListener("click", function () {
    const name = getInputValue("name");
    const email = getInputValue("email");
    const password = getInputValue("password");

    if (name === "" || email === "" || password === "") {
      showMessage("Please fill all fields");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (
      user &&
      name === user.name &&
      email === user.email &&
      password === user.password
    ) {
      showMessage("Login done");
      clearUserInfo();
      window.location.href = "index.html";
    } else {
      showMessage("Invalid login details");
      clearUserInfo();
    }
  });
}
