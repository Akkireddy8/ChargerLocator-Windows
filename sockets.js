const managerModel = require('./src/models/managerModel.js');
module.exports = (io) => {
    let users = {}; 

    io.on('connection', (socket) => {
        console.log('User connected: ' + socket.id);


        socket.on('setUserId', (data) => {
            users[data.userId] = socket.id;
           // console.log('User ID set:', data.userId, 'Socket ID:', socket.id);
        });


        socket.on('userSendMessage', async (data) => {
            const { message } = data;
            console.log('Message from user:', 'Message:', message);
            
            try {
                
                const manager = await managerModel.findOne();
                if (manager) {
                    const managerId = manager._id.toString();

                    if (users[managerId]) {
                        io.to(users[managerId]).emit('managerReceiveMessage', { message, userSocketId: socket.id });
                        console.log('Message sent to manager:', managerId);
                    } else {
                        console.log('Manager is not connected.');
                    }
                } else {
                    console.log('No manager found in database.');
                }
            } catch (error) {
                console.error('Error fetching managerId:', error);
            }
        });

        socket.on('managerSendMessage', (data) => {
            const { message, userId } = data;
           // console.log('Message from user:', userId, 'Message:', message);
                io.to(userId).emit('userReceiveMessage', { message, userSocketId: socket.id });
        });


        socket.on('disconnect', () => {
 
            for (let userId in users) {
                if (users[userId] === socket.id) {
                    delete users[userId];
                    break;
                }
            }
            console.log('A user disconnected: ' + socket.id);
        });
    });
};
