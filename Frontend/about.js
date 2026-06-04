document.addEventListener("DOMContentLoaded", function () {
  const revealItems = document.querySelectorAll(".reveal");

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
});
