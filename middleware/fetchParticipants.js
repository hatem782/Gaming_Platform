const Discussion = require('../models/discussions');

const fetchParticipants = async (req, res, next) => {
    try {
        const { discussionId } = req.params;

        const discussion = await Discussion.findById(discussionId).select('participants');

        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        req.discussionParticipants = discussion.participants;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = fetchParticipants;
