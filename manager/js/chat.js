const socket = io('http://localhost:4200');

const chatIcon = document.getElementById('chat-icon');
const chatBox = document.getElementById('chat-box');
const closeChatBtn = document.getElementById('close-chat');
const userMessageInput = document.getElementById('user-message');
const sendMessageBtn = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');

var chatWithUserId = null;
var chatWithUserMail = null;

let managerId = localStorage.getItem('managerId');
socket.emit('setManager', { userId: managerId });

function loadUserChat(userId, userEmail) {
    chatWithUserId = userId;
    chatWithUserMail = userEmail;
    
    chatMessages.innerHTML = `<div class="loading">Loading chat...</div>`;

    socket.emit('fetchUserMessages', { userId });

    
    socket.on('chatHistory', (data) => {
        chatMessages.innerHTML = '';
        console.log('User messages:', data.messages);
        
        data.messages.forEach(msg => {
            const side = msg.senderType === 'manager' ? 'right' : 'left';
            addMessageToChat(`${side === 'right' ? 'You' : 'User'}: ${msg.message}`, side);
        });
    });
}

socket.on('managerReceiveMessage', (data) => {
    console.log(data);
    if (chatWithUserMail === data.userEmail) {
        addMessageToChat('User: ' + data.message, 'left');
    } else {
        console.log(data.userEmail);
        const doc = document.getElementById(data.userId);
        if (doc) {
            const chatIcon = doc.querySelector('.table-chat-icon img');
            if (chatIcon) {
                chatIcon.src = './images/new-message.png';
                doc.querySelector('.table-chat-icon').style.display = 'inline-block';
            } else {
                console.error('Chat icon image not found in the row');
            }
        } else {
            console.error('Row not found for email:', data.userId);
        }
    }

    const tableBody = document.getElementById('user-table-body');
    const userRow = document.getElementById(data.userId);
    if (userRow) {
        tableBody.prepend(userRow);
    }

});

socket.on('userNotConnected', (message) => {
    console.log(message);
});

chatIcon.addEventListener('click', () => {
    chatBox.style.display = 'block';
    scrollToBottom();
});

closeChatBtn.addEventListener('click', () => {
    chatBox.style.display = 'none';
});

sendMessageBtn.addEventListener('click', () => {
    if (chatWithUserMail) {
        const message = userMessageInput.value.trim();
        if (message) {
            sendMessage(message);
            userMessageInput.value = '';
            userMessageInput.focus();
            const tableBody = document.getElementById('user-table-body');
            const userRow = document.getElementById(data.userId);
            if (userRow) {
                tableBody.prepend(userRow);
            }
        }
    } else {
        console.log('Select a user');
    }
});

function sendMessage(message) {
    socket.emit('managerSendMessage', { message, userId: chatWithUserId });
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
