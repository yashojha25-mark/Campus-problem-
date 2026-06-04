const form = document.getElementById("Feedbackform");
const description = document.getElementById("description");
const charCount = document.getElementById("charCount");
const successMessage = document.getElementById("successMessage");
const counterLabel = document.querySelector(".counter-label");
const i18n = new Proxy({}, {
    get: (_, prop) => window.campusI18n?.[prop]
});

description.addEventListener("input", () => {
    charCount.textContent = description.value.length;
});

form.addEventListener("submit", function(bheem){

    bheem.preventDefault();

    successMessage.style.display = "block";
    if (successMessage) {
        successMessage.textContent = `🎉 ${i18n?.messages.feedbackSuccess() || "Feedback Submitted Successfully!"}`;
    }

    form.reset();
    charCount.textContent = "0";

    setTimeout(() => {
        successMessage.style.display = "none";
    }, 4000);

});

if (counterLabel) {
    const renderCounterLabel = () => {
        counterLabel.textContent = `/2000 ${i18n?.t('pages.feedback.counterSuffix') || 'Characters'}`;
    };

    renderCounterLabel();
    window.addEventListener("campus-language-change", renderCounterLabel);
}
