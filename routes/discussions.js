var express = require('express');
var router = express.Router();
const { createDiscussion, getDiscussions, getDiscussionById, updateDiscussion, deleteDiscussion } = require('../controllers/discussions.js');
const auth = require("../middleware/auth.js");

router.post('/', auth, createDiscussion);
router.get('/', auth, getDiscussions);
router.get('/:discussionId', auth, getDiscussionById);
router.put('/:discussionId', auth, updateDiscussion);
router.delete('/:discussionId', auth, deleteDiscussion);

module.exports = router;