const signupButton = document.getElementById("sign");
const loginButton = document.getElementById("btn");
const recoverButton = document.getElementById("recover");
const passwordToggles = document.querySelectorAll(".toggle-password");
const AUTH_STORAGE_KEY = "campusAuthSession";
const i18n = new Proxy({}, {
  get: (_, prop) => window.campusI18n?.[prop]
});

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

function saveSession(user) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("campus-auth-change", { detail: { user } }));
}

if (signupButton) {
  signupButton.addEventListener("click", function () {
    const name = getInputValue("name");
    const email = getInputValue("email");
    const password = getInputValue("password");
    const confirmPassword = getInputValue("passw");

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
      showMessage(i18n?.messages.signupFillAll() || "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      showMessage(i18n?.messages.signupMismatch() || "Passwords do not match");
      return;
    }

    const user = { name, email, password };
    saveSession(user);

    showMessage(i18n?.messages.signupDone() || "Signup done");
    clearUserInfo();
    window.location.href = "index.html";
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
      i18n?.getLanguage() === "hi"
        ? isHidden ? "पासवर्ड छिपाएँ" : "पासवर्ड दिखाएँ"
        : isHidden ? "Hide password" : "Show password"
    );
  });
});

function updatePasswordToggleLabels() {
  passwordToggles.forEach(function (toggleButton) {
    const passwordInput = toggleButton.previousElementSibling;
    if (!passwordInput) {
      return;
    }

    const isHidden = passwordInput.type === "password";
    toggleButton.setAttribute(
      "aria-label",
      i18n?.getLanguage() === "hi"
        ? isHidden ? "पासवर्ड दिखाएँ" : "पासवर्ड छिपाएँ"
        : isHidden ? "Show password" : "Hide password"
    );
  });
}

updatePasswordToggleLabels();
window.addEventListener("campus-language-change", updatePasswordToggleLabels);

if (recoverButton) {
  recoverButton.addEventListener("click", function () {
    const email = getInputValue("email");
    const newPassword = getInputValue("new-password");
    const confirmPassword = getInputValue("confirm-password");
    const user = JSON.parse(localStorage.getItem("user"));

    if (email === "" || newPassword === "" || confirmPassword === "") {
      showMessage(i18n?.messages.signupFillAll() || "Please fill all fields");
      return;
    }

    if (!user || email !== user.email) {
      showMessage(i18n?.messages.recoverNoAccount() || "No account found with this email");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage(i18n?.messages.signupMismatch() || "Passwords do not match");
      return;
    }

    user.password = newPassword;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    showMessage(i18n?.messages.recoverUpdated() || "Password updated");
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
      showMessage(i18n?.messages.loginFillAll() || "Please fill all fields");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (
      user &&
      name === user.name &&
      email === user.email &&
      password === user.password
    ) {
      saveSession(user);
      showMessage(i18n?.messages.loginDone() || "Login done");
      clearUserInfo();
      window.location.href = "index.html";
    } else {
      showMessage(i18n?.messages.loginInvalid() || "Invalid login details");
      clearUserInfo();
    }
  });
}
