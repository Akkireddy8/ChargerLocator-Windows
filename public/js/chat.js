const socket = io('http://localhost:4200');

const chatIcon = document.getElementById('chat-icon');
const chatBox = document.getElementById('chat-box');
const closeChatBtn = document.getElementById('close-chat');
const userMessageInput = document.getElementById('user-message');
const sendMessageBtn = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');
const chatImg = document.getElementById('chat-img');

let userId = localStorage.getItem('userId');
let userEmail = localStorage.getItem('email');

socket.emit('setUserId', { userId });

chatIcon.addEventListener('click', () => {
    chatBox.style.display = 'block';
    scrollToBottom();
    chatImg.src = './images/message.png'
   // socket.emit('fetchUserMessages', { userId });
});


socket.on('chatHistory', (data) => {
    console.log('Chat history:', data);
    chatMessages.innerHTML = '';
    data.forEach(msg => {
        const side = msg.senderType === 'manager' ? 'left' : 'right';
        addMessageToChat(`${side === 'right' ? 'You' : 'Manager'}: ${msg.message}`, side);
    });
});

socket.on('userReceiveMessage', (data) => {
    console.log(data);
    if (data.userSocketId !== socket.id) {
        addMessageToChat('Manager: ' + data.message, 'left');
    } 
    console.log(chatImg, chatBox.style.display)
    if (chatBox.style.display === '' || chatBox.style.display === 'none'){
        chatImg.src = './images/new-message.png'
        
    }
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
    socket.emit('userSendMessage', { message, userId, userEmail });
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
