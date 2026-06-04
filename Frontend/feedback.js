const form = document.getElementById("Feedbackform");
const description = document.getElementById("description");
const charCount = document.getElementById("charCount");
const successMessage = document.getElementById("successMessage");

description.addEventListener("input", () => {
    charCount.textContent = description.value.length;
});

form.addEventListener("submit", function(bheem){

    bheem.preventDefault();

    successMessage.style.display = "block";

    form.reset();
    charCount.textContent = "0";

    setTimeout(() => {
        successMessage.style.display = "none";
    }, 4000);

});
