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
    container,
    triggerSelector,
    dialogSelector,
    closeSelector,
    submitSelector,
    validateFn,
    submitFn,
    loadFn,
  }) {
    const trigger = container.divElement.querySelector(triggerSelector);
    const dialog = container.divElement.querySelector(dialogSelector);
    const closeBtn = container.divElement.querySelector(closeSelector);
    const submitBtn = container.divElement.querySelector(submitSelector);

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
      const isValid = validateFn ? await validateFn() : true;

      if (isValid) {
        if (submitFn) await submitFn();
        closeDialog(dialog);
      } else {
        console.warn("Formulario inválido. No se cerrará el diálogo.");
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
