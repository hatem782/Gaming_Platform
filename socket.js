let onlineUsers = {};

function joinRoom(socket, io) {
    socket.on("newUser", (data) => {
        console.log(data);

        if (data) {
            let userId = data;

            if (!onlineUsers[userId]) {
                onlineUsers[userId] = socket.id;
            } else {
                // If user already exists, update socket.id
                onlineUsers[userId] = socket.id;
            }
        }

        // Emit updated online users to all clients
        io.emit("onlineUsers", Object.keys(onlineUsers));
    });
}

function joinDiscussionRoom(socket, io) {
    socket.on("join-discussion", (discussionId) => {
        socket.join(discussionId);
    });
}

function leaveDiscussionRoom(socket, io) {
    socket.on("leave-discussion", (discussionId) => {
        socket.leave(discussionId);
    });
}

function sendDiscussionMessage(socket, io) {
    socket.on("sendDiscussionMessage", ({ discussionId, userId, text }) => {
        console.log(discussionId, userId, text);

        // Emit the message to all clients in the discussion room
        io.to(discussionId).emit("discussionMessage", { userId, discussionId, text });
    });
}

// Add more functions based on your specific requirements...

module.exports = {
    joinRoom,
    joinDiscussionRoom,
    leaveDiscussionRoom,
    sendDiscussionMessage,
    // Add more exports as needed...
};
