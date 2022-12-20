const uuid = require('uuid');
const {
    getChats,
    ObjectId,
    MongoError
} = require("../config/mongoCollections");
const {
    get: getUser
} = require('./users');


const validateID = (id) => {
    if (id === undefined) {
        let e = new Error("The 'id' parameter does not exist !!");
        e.code = 400;
        throw e;
    }
    if (typeof (id) !== 'string' || id.trim().length === 0) {
        let e = new Error("The 'id' parameter should be a non-empty string (excluding spaces) !!");
        e.code = 400;
        throw e;
    }
    id = id.trim();
    if (!ObjectId.isValid(id) || ObjectId(id).toString() !== id) {
        let e = new Error("The 'id' parameter is not a valid ObjectID!!");
        e.code = 400;
        throw e;
    }
    return id;
};


const getEventChats = async (eventId, userId) => {
    eventId = validateID(eventId);
    userId = validateID(userId);
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
    eventId = validateID(eventId);
    hostId = validateID(hostId);
    userId = validateID(userId);
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
            msgText: "Thank you for joining the event. Feel free to ping me if you have any questions.. :)",
            timestamp: new Date().getTime()
        }]
    }
    const chats = await getChats();
    const {
        acknowledged,
        insertedId
    } = await chats.insertOne(newChat);
    return insertedId.toString();
}


const deleteChat = async (eventId, hostId, userId) => {
    eventId = validateID(eventId);
    hostId = validateID(hostId);
    userId = validateID(userId);
    const chats = await getChats();
    const res = await chats.deleteOne({
        eventId, 
        hostId, 
        userId
    });
    return res.deletedCount;
};

const deleteChatByEvent = async (eventId) => {
    eventId = validateID(eventId);
    const chats = await getChats();
    const eventChats = await chats.find({
        eventId
    }).toArray();
    eventChats.forEach(async ({eventId, hostId, userId}) => {
        await deleteChat(eventId, hostId, userId);
    });
    console.log('deleted chat count: ', eventChats.length);
    return eventChats.length;
};


module.exports = {
    validateID,
    getEventChats,
    createChat,
    updateChat,
    deleteChat,
    deleteChatByEvent
};