const demo = document.querySelector("[data-demo-section]");
const img = document.querySelector("[data-demo-img]");

demo.addEventListener("click", () => {
  demo.classList.add("demo--active");
});
