const Discussion = require('../models/discussions.js');

const createDiscussion = async (req, res) => {
    const { title, content, tags } = req.body;

    try {
        // validate required fields
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' })
        }
        console.log('Received tags', tags);
        const newDiscussion = new Discussion({
            title,
            content,
            tags: tags ? (Array.isArray(tags) ? tags : [tags]) : []
        });

        // save the discussion to  the database
        const savedDiscussion = newDiscussion.save();

        res.status(201).json({ message: "Discussion created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find();
        res.status(200).json({ discussions });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server errror' })
    }
};

const getDiscussionById = async (req, res) => {
    const { discussionId } = req.params;
    try {
        const discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }
        res.status(200).json({ discussion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    const { title, content, tags } = req.body;

    try {
        //find the discussion by ID
        const discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }
        // update discussion details
        discussion.title = title || discussion.title;
        discussion.content = content || discussion.content;
        discussion.tags = tags ? (Array.isArray(tags) ? tags : [tags]) : [];

        // save the update discussion to the dataebase
        const updateDiscussion = await discussion.save();

        res.status(200).json({ message: 'Discussion Updated Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteDiscussion = async (req, res) => {
    const { discussionId } = req.params;

    try {
        // find and delete by ID
        const deleteDiscussion = await Discussion.findByIdAndDelete(discussionId);

        if (!deleteDiscussion) {
            return res.staus(404).json({ message: "Discussion not found!" });
        }
        res.status(200).json({ message: 'Discussion deleted successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });

    }
}

module.exports = {
    createDiscussion,
    getDiscussions,
    getDiscussionById,
    updateDiscussion,
    deleteDiscussion
};