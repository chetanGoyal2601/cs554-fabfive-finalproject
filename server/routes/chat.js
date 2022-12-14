const router = require("express").Router();

const {
    getEventChats
} = require('../data/chat');

router.get('/:eventId/:userId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        // get userid from session later
        const userId = req.params.userId;
        console.log('in route', eventId, userId);
        const eventChats = await getEventChats(eventId, userId);
        res.json({
            eventChats
        });
    } catch (e) {
        // console.log(e);
        res.status(e.code || 500).json({
            message: e.message || "Request Failed !!"
        });
    }
});


module.exports = router;