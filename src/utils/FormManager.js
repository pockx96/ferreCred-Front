const FormManager = (() => {
  function openDialog(dialog) {
    if (!dialog.open) {
      dialog.showModal();
      dialog.style.visibility = "visible";
    }
  }

  function closeDialog(dialog) {
    if (dialog.open) {
      dialog.style.visibility = "hidden";
      dialog.close();
    }
  }

  async function initForm({
    constainer,
    triggerSelector,
    dialogSelector,
    closeSelector,
    submitSelector,
    validateFn,
    submitFn,
    loadFn,
  }) {
    const trigger = constainer.divElement.querySelector(triggerSelector);
    const dialog = constainer.divElement.querySelector(dialogSelector);
    const closeBtn = constainer.divElement.querySelector(closeSelector);
    const submitBtn = constainer.divElement.querySelector(submitSelector);

    if (!trigger || !dialog || !closeBtn || !submitBtn) {
      console.error(
        "FormManager: No se encontró uno de los elementos necesarios."
      );
      return;
    }

    trigger.addEventListener("click", async () => {
      if (loadFn) await loadFn();
      openDialog(dialog);
    });

    closeBtn.addEventListener("click", () => {
      closeDialog(dialog);
    });

    submitBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      if (validateFn && validateFn()) {
        if (submitFn) await submitFn();
        closeDialog(dialog);
      }
    });
  }

  return {
    openDialog,
    closeDialog,
    initForm,
  };
})();

export default FormManager;
