const socket = io('http://localhost:4200');

const chatIcon = document.getElementById('chat-icon');
const chatBox = document.getElementById('chat-box');
const closeChatBtn = document.getElementById('close-chat');
const userMessageInput = document.getElementById('user-message');
const sendMessageBtn = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');
const chatImg = document.getElementById('chat-img');

let unreadMessageCount = 0;

var userId = localStorage.getItem('userId');
var userEmail = localStorage.getItem('email');

socket.emit('setUserId', { userId });

chatIcon.addEventListener('click', () => {
   chatBox.style.display = 'block';

   unreadMessageCount = 0;

   const notificationBadge = document.querySelector('.chat-icon span');
   notificationBadge.textContent = '0';
   notificationBadge.style.display = 'none';
  // scrollToBottom();
  // chatImg.src = './images/message.png';
});

socket.on('chatHistory', (data) => {
   chatMessages.innerHTML = '';
   data.forEach(msg => {
      const side = msg.senderType === 'manager' ? 'left' : 'right';
      addMessageToChat(`${msg.message}`, side, new Date(msg.timestamp));
   });
});

socket.on('userReceiveMessage', (data) => {
   if (data.userSocketId !== socket.id) {
      addMessageToChat(`${data.message}`, 'left', new Date());
      
      if (chatBox.style.display === '' || chatBox.style.display === 'none') {

         unreadMessageCount++;
         const notificationBadge = document.querySelector('.chat-icon span');
         notificationBadge.textContent = unreadMessageCount;
         notificationBadge.style.display = 'block';
         
       //  chatImg.src = './images/new-message.png';
      }
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
   addMessageToChat(`${message}`, 'right', new Date());
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
