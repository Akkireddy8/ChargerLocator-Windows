
const socket = io('http://localhost:4200');


const chatIcon = document.getElementById('chat-icon');
const chatBox = document.getElementById('chat-box');
const closeChatBtn = document.getElementById('close-chat');
const userMessageInput = document.getElementById('user-message');
const sendMessageBtn = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');


let userId = localStorage.getItem('userId');
socket.emit('setUserId', { userId });
socket.on('userReceiveMessage', (data) => {
    console.log(data)
    if (data.userSocketId !== socket.id) {
        addMessageToChat('Manager: ' + data.message, 'left');
    }
});

chatIcon.addEventListener('click', () => {
    chatBox.style.display = 'block';
    scrollToBottom();
});

closeChatBtn.addEventListener('click', () => {
    chatBox.style.display = 'none';
});

sendMessageBtn.addEventListener('click', () => {
    const message = userMessageInput.value.trim();
    if (message) {
        sendMessage(message);
        userMessageInput.value = '';
        userMessageInput.focus();
    }
});

function sendMessage(message) {
    socket.emit('userSendMessage', { message });
    addMessageToChat('You: ' + message, 'right');
}

function addMessageToChat(message, side) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${side}`;
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
