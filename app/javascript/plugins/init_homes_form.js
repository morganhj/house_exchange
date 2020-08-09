const initHomesForm = () => {
	const newSpecChars = document.getElementById('new-spec-chars')
	if (newSpecChars) {
	  document.addEventListener('click', (event) => {
	  	if (event.target.classList.contains('toggle-catch')) {
	  		event.target.closest('label').classList.toggle('active')
	  	}
	  })
	}
}

export { initHomesForm };