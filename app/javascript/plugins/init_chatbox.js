const initChatbox = () => {
	const chatHeader = document.getElementById('chat-toggle')
	const chatContent = document.getElementById('chat-content')
	const chatboxStatus = document.getElementById('chatbox-status')
	const newMessageForm = document.getElementById('new-message')
	const textArea = document.getElementById('message_content')
	const submitBtn = document.getElementById('submit-btn')
	if (chatHeader) {
		chatHeader.addEventListener('click', (event) => {
			chatContent.classList.toggle('active')
			if (chatContent.classList.contains('active')) {
				chatboxStatus.innerHTML = `<i class="fas fa-chevron-circle-down"></i>`
			} else {
				chatboxStatus.innerHTML = `<i class="fas fa-chevron-circle-up"></i>`
			}

		})
	}
	if (textArea) {
		$('#message_content').keypress(function(e){
			if(e.which == 13){
				e.preventDefault();
				submitBtn.click();
			}
		});
	}
	
}

export { initChatbox }