const {
  createClient
} = require('redis');
const {
  updateChat
} = require('../data/chat');
const client = createClient();
client.on("error", function (error) {
  console.error(error);
});

const objectFlip = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => (acc[value] = key, acc), {});
}

const updateUserSocket = async (socketId, userId) => {
  if (!client.isOpen) {
    await client.connect();
  }
  const userToSocket = JSON.parse(await client.get('userToSocket') || '{}');
  userToSocket[userId] = socketId;
  await client.set('userToSocket', JSON.stringify(userToSocket));
};

const removeSocketUser = async (socketId) => {
  if (!client.isOpen) {
    await client.connect();
  }
  let userToSocket = JSON.parse(await client.get('userToSocket') || '{}');
  const socketToUser = objectFlip(userToSocket);
  let userId = "Someone";
  if (socketId in socketToUser) {
    userId = socketToUser[socketId];
    delete socketToUser[socketId];
    userToSocket = objectFlip(socketToUser);
    await client.set('userToSocket', JSON.stringify(userToSocket));
  }
  return userId;
};

const clearRedisData = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
  await client.del('userToSocket');
};

const constructor = async (io) => {
  await clearRedisData();
  io.on('connection', (socket) => {
    console.log('Connecting user with SocketId: ', socket.id);

    socket.on('setupUser', async ({
      userId
    }) => {
      console.log(`UserId: ${userId} connected with SocketId: ${socket.id}`);
      await updateUserSocket(socket.id, userId);
      const userToSocket = JSON.parse(await client.get('userToSocket') || '{}');
      console.log('Current User to Socket:', userToSocket)
    });

    socket.on('message', async ({
      chatId,
      userId,
      msgText,
      timestamp
    }) => {
      console.log(userId, socket.id);
      const updatedChat = await updateChat(chatId, userId, msgText, timestamp);
      const receiverId = updatedChat.userId === userId ? updatedChat.hostId : updatedChat.userId;
      const userToSocket = JSON.parse(await client.get('userToSocket') || '{}');
      const receiverSocket = userToSocket[receiverId]
      console.log(`sending message to ${receiverId} : ${receiverSocket}`);
      if (receiverSocket) {
        io.to(receiverSocket).emit('message', {
          chatId,
          userId,
          msgText,
          timestamp
        });
      }
    });

    socket.on('disconnect', async () => {
      const userId = await removeSocketUser(socket.id);
      console.log(`${userId} with ${socket.id} is disconnected !!`);
    });
  });

};


module.exports = constructor;