const socket = io('http://localhost:4200');

const chatIcon = document.getElementById('chat-icon');
const chatBox = document.getElementById('chat-box');
const closeChatBtn = document.getElementById('close-chat');
const userMessageInput = document.getElementById('user-message');
const sendMessageBtn = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');

let unreadMessageCounts = {};

var chatWithUserId = null;
var chatWithUserMail = null;

let managerId = localStorage.getItem('managerId');
socket.emit('setManager', { userId: managerId });

function loadUserChat(userId, userEmail) {
    chatWithUserId = userId;
    chatWithUserMail = userEmail;
    
    chatMessages.innerHTML = `<div class="loading">Loading chat...</div>`;

    socket.emit('fetchUserMessages', { userId });

    unreadMessageCounts[userId] = 0;
    updateUnreadMessageCounter(userId);
    
    socket.on('chatHistory', (data) => {
        chatMessages.innerHTML = '';
        console.log('User messages:', data.messages);
        
        data.messages.forEach(msg => {
            const side = msg.senderType === 'manager' ? 'right' : 'left';
            addMessageToChat(`${msg.message}`, side, new Date(msg.timestamp));
        });
    });
}

socket.on('managerReceiveMessage', (data) => {
    console.log(data);
    if (chatWithUserMail === data.userEmail) {
        addMessageToChat(data.message, 'left', new Date());
    } else {
        console.log(data.userEmail);

        unreadMessageCounts[data.userId] = (unreadMessageCounts[data.userId] || 0) + 1;
        updateUnreadMessageCounter(data.userId);
    }

    const tableBody = document.getElementById('user-table-body');
    const userRow = document.getElementById(data.userId);
    if (userRow) {
        tableBody.prepend(userRow);
    }
});

function updateUnreadMessageCounter(userId) {
    const userRow = document.getElementById(userId);
    if (userRow) {
        const chatIcon = userRow.querySelector('.table-chat-icon');
        const counterSpan = chatIcon.querySelector('.message-counter');
        const chatImg = chatIcon.querySelector('img');

        if (unreadMessageCounts[userId] > 0) {
            counterSpan.textContent = unreadMessageCounts[userId];
            chatIcon.style.display = 'block';
            counterSpan.style.display = 'block';
           // chatImg.src = './images/new-message.png';
        } else {
            chatIcon.style.display = 'none';
            counterSpan.style.display = 'none';
          //  chatImg.src = './images/message.png';
        }
    }
}

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
    addMessageToChat(message, 'right', new Date());

    const tableBody = document.getElementById('user-table-body');
    const userRow = document.getElementById(chatWithUserId);
    if (userRow) {
        tableBody.prepend(userRow);
    }
}

function addMessageToChat(message, side, timestamp) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${side}`;
    messageElement.innerHTML = `${message}<span class="timestamp">${formatTime(timestamp)}</span>`;
   chatMessages.appendChild(messageElement);
    scrollToBottom();
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
 }

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
