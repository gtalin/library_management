(function disableFormResubmit() {
  // 'use strict';

  window.addEventListener(
    'load',
    () => {
      const form = document.querySelector('form');
      // const submitButton = document.querySelector('button[type="submit"]');
      function handleFormSubmit(e) {
        // submitButton.disabled = true;
        // // e.preventDefault();
        // submitButton.innerText = 'Submitting form...';
        handleSubmitButtonDisable();
      }

      if (form) {
        form.addEventListener('submit', handleFormSubmit);
      }
    },
    false
  );
})();
