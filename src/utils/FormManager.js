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
      triggerSelector,
      dialogSelector,
      closeSelector,
      submitSelector,
      validateFn,
      submitFn,
      loadFn,
    }) {
      const trigger = divElement.querySelector(triggerSelector);
      const dialog = divElement.querySelector(dialogSelector);
      const closeBtn = divElement.querySelector(closeSelector);
      const submitBtn = divElement.querySelector(submitSelector);
  
      if (!trigger || !dialog || !closeBtn || !submitBtn) {
        console.error("FormManager: No se encontró uno de los elementos necesarios.");
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
  