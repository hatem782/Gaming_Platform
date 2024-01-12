var express = require('express');
var router = express.Router();
const {
    createMessage,
    getMessages,
    updateMessage,
    deleteMessage
} = require('../controllers/messages.js')

router.post('/discussions/:discussionId/messages', createMessage);
router.get('/discussions/:discussionId/messages', getMessages);
router.put('/discussions/:discussionId/messages/:messageId', updateMessage);
router.delete('/discussions/:discussionId/messages/:messageId', deleteMessage);

module.exports = router;
