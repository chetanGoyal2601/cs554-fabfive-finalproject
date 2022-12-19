const uuid = require('uuid');
const {
    getChats,
    ObjectId,
    MongoError
} = require("../config/mongoCollections");
const {
    get: getUser
} = require('./users');



const getEventChats = async (eventId, userId) => {
    const chats = await getChats();
    const eventChats = await chats.find({
        eventId
    }).toArray();
    let userChats = eventChats.filter(chat => {
        return userId === chat.userId || userId === chat.hostId;
    });
    userChats.sort((a, b) => b.lastMsgTime - a.lastMsgTime);
    return userChats.map(chat => {
        chat._id = chat._id.toString();
        return chat;
    });
};

const updateChat = async (chatId, userId, msgText, timestamp) => {
    const msgObj = {
        msgId: uuid.v4(),
        userId,
        msgText,
        timestamp
    };
    const chats = await getChats();
    let result = await chats.findOneAndUpdate({
        _id: ObjectId(chatId)
    }, {
        $push: {
            messages: msgObj
        },
        $set: {
            lastMsgTime: timestamp
        }
    }, {
        returnDocument: 'after'
    });
    return result.value;
};

const createChat = async (eventId, hostId, userId) => {
    console.log(hostId, userId, 'in createChat');
    const host = await getUser(hostId);
    const user = await getUser(userId);
    const newChat = {
        eventId,
        hostId,
        userId,
        hostName: host.name,
        userName: user.name,
        lastMsgTime: new Date().getTime(),
        messages: [{
            msgId: uuid.v4(),
            userId: hostId,
            msgText: "Thank you for joining our event. Feel free to ping me if you have any questions.. :)",
            timestamp: new Date().getTime()
        }]
    }
    const chats = await getChats();
    const {
        acknowledged,
        insertedId
    } = await chats.insertOne(newChat);
    return insertedId;
}


module.exports = {
    getEventChats,
    createChat,
    updateChat
};