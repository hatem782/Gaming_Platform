var express = require('express');
var router = express.Router();
const {
    createMessage,
    getMessages,
    updateMessage,
    deleteMessage
} = require('../controllers/messages.js');
const auth = require("../middleware/auth.js");


router.post('/discussions/:discussionId/messages', auth, createMessage);
router.get('/discussions/:discussionId/messages', auth, getMessages);
router.put('/discussions/:discussionId/messages/:messageId', auth, updateMessage);
router.delete('/discussions/:discussionId/messages/:messageId', auth, deleteMessage);

module.exports = router;
