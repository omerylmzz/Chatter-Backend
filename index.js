const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const socketIO = new Server(server);


let groupList = [];
let messageList = [];

const createUniqueId = () => {
    return Math.random().toString(20).substring(2, 10)
}

socketIO.on("connection", (socket) => {
    console.log(`${socket.id} user is just connected`);

    socket.on("getAllGroups", () => {
        socket.emit("groupList", groupList)
    })

    socket.on("createNewGroup", (data) => {
        groupList.unshift({
            groupId: createUniqueId(),
            groupName: data.groupName,
            groupPassword: data.groupPassword,
            createrName: data.createrName,
            createrSurname: data.createrSurname,
            messages: messageList               
        });
        console.log(groupList);
        socket.emit("groupList", groupList);
    })

    socket.on("getAllMessages", () => {
        socket.emit("allMessages", messageList);
    })

    socket.on("messageData", (data) => {
        const {groupId, groupName, senderId, message, timeData ,createrName, createrSurname} = data;
        const newMessage = {
            groupId: groupId,
            senderId: senderId,
            messageId: createUniqueId(),
            text: message,
            time: `${timeData.hour + 3}:${timeData.minute}`,
            creater: `${createrName} ${createrSurname}`
        }
        messageList.push(newMessage);
        socket.emit("allMessages", messageList);
        console.log(newMessage);
    })

})



const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})