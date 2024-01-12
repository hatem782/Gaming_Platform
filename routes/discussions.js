var express = require('express');
var router = express.Router();
const { createDiscussion, getDiscussions, getDiscussionById, updateDiscussion, deleteDiscussion } = require('../controllers/discussions.js');

router.post('/', createDiscussion);
router.get('/', getDiscussions);
router.get('/:discussionId', getDiscussionById);
router.put('/:discussionId', updateDiscussion);
router.delete('/:discussionId', deleteDiscussion);

module.exports = router;
