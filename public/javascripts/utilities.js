function handleSubmitButtonDisable() {
  const submitButton = document.querySelector('button[type="submit"]');
  console.log('The submit button is', submitButton);
  submitButton.disabled = true;
  // e.preventDefault();
  submitButton.innerText = 'Submitting form...';
}
