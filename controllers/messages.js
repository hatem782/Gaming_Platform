const Discussion = require('../models/discussions.js');
const Message = require('../models/messages.js');
const io = require('../socket.js');


const createMessage = async (req, res) => {
    console.log('req.params:', req.params);
    const { discussionId } = req.params;
    console.log('discussionId:', discussionId);
    const { content } = req.body;

    try {
        // find discussion by id
        const discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found!" });
        }
        const sender = req.userID;
        // create a new message using the Message model
        const newMessage = new Message({ sender, content });
        // save the new message
        await newMessage.save();

        // push the new message to the discussion
        discussion.messages.push(newMessage);
        console.log('req.body:', req.body);

        // save the updated discussion, including the new message
        await discussion.save();

        // Emit a message created event to all connected clients in the discussion room
        io.to(discussionId).emit("messageCreated", { discussionId, message: newMessage });

        res.status(201).json({ message: "Message created successfully", discussion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getMessages = async (req, res) => {
    const { discussionId } = req.params;

    try {
        // find discussion by Id and get its messages
        const discussion = await Discussion.findById(discussionId).populate('messages');
        if (!discussion) {
            res.status(404).json({ message: "Discussion not found!" });
        }
        const messages = discussion.messages.map(message => ({
            _id: message._id,
            sender: message.sender,
            content: message.content,
            timestamp: message.timestamp
        }));

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
};

const updateMessage = async (req, res) => {
    const { discussionId, messageId } = req.params;
    const { content } = req.body;

    try {
        // Find the discussion by Id and populate messages
        const discussion = await Discussion.findById(discussionId).populate('messages');

        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found!" });
        }

        // fimd the message within the discussion by id
        const messageToUpdate = discussion.messages.find(msg => msg._id.toString() === messageId);

        if (!messageToUpdate) {
            return res.status(404).json({ message: "Message not found!" });
        }

        // Update the message content
        messageToUpdate.content = content || messageToUpdate.content;

        // Save the updated discussion
        await discussion.save();

        // find and update the message in the Message model
        await Message.findByIdAndUpdate(messageId, { content });

        // Emit a message updated event to all connected clients in the discussion room
        io.to(discussionId).emit("messageUpdated", { discussionId, messageId, updatedContent: content });

        const updatedMessage = await Message.findById(messageId);

        return res.status(200).json({ message: 'Message updated successfully', discussion, updatedMessage });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteMessage = async (req, res) => {
    const { discussionId, messageId } = req.params;

    // find discussion by id
    try {
        // find discussion by id and populate messages
        const discussion = await Discussion.findById(discussionId).populate('messages');

        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found!" });
        }

        // find the index of the message within the discussion by id
        const messageIndex = discussion.messages.findIndex(msg => msg._id.toString() === messageId);

        if (messageIndex === -1) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // get the message object from the array
        const messageToRemove = discussion.messages[messageIndex];

        // remove message from the array
        discussion.messages.splice(messageIndex, 1);
        await discussion.save();

        // explicitly delete the message from the Message model
        await Message.findByIdAndDelete(messageToRemove._id);

        // Emit a message deleted event to all connected clients in the discussion room
        io.to(discussionId).emit("messageDeleted", { discussionId, messageId });

        return res.status(200).json({ message: 'Message deleted Successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createMessage,
    getMessages,
    updateMessage,
    deleteMessage
};