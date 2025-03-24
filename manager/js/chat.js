
 const socket = io('http://localhost:4200');


const chatIcon = document.getElementById('chat-icon');
const chatBox = document.getElementById('chat-box');
const closeChatBtn = document.getElementById('close-chat');
const userMessageInput = document.getElementById('user-message');
const sendMessageBtn = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');
var userSocketId


let userId = localStorage.getItem('managerId');
socket.emit('setUserId', { userId });
socket.on('managerReceiveMessage', (data) => {
    console.log(data.userSocketId)
    if (data.userSocketId !== socket.id) {
        addMessageToChat('User: ' + data.message, 'left');
        userSocketId = data.userSocketId
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
    socket.emit('managerSendMessage', { message, userId : userSocketId });
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
