document.addEventListener("DOMContentLoaded", () => {
  const $modals = document.querySelectorAll(".modal");

  for (let $modal of $modals) {
    $modal.querySelector("[toggle-modal]")?.addEventListener("click", () => {
      $modal.classList.remove("show");
    });
    $modal.addEventListener("click", (e) => {
      e.stopPropagation();

      $modal.classList.remove("show");
    });

    $modal.querySelector(".modal-dialog").addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.hasAttribute("toggle-modal")) return;

    const modalId = e.target.getAttribute("modal-id");

    if (!modalId) return;

    const $modal = document.querySelector(`.modal#${modalId}`);

    $modal?.classList.add("show");
  });
});
