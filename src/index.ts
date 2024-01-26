const serverless = require('serverless-http'); // Netlify

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env, socketEnabled } = require('./config/vars');

const http = require('http'); // to use HTTPS, use: require('https') and the "options" with key, cert below.
// const https = require('spdy'); // for HTTP2
const fs = require('fs');
const app = require('./config/express');


const mongoose = require('./config/mongoose');

mongoose.connect(); // open mongoose connection

// HTTPS options
const options = {};
// const options = {
  //   key: fs.readFileSync(__dirname + '/config/https/localhost-key.pem'),
  //   cert: fs.readFileSync(__dirname + '/config/https/localhost.pem')
  // };
  const server = http.createServer(options, app);
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      
    },
    });


let onlineUser:Array<any> = []
io.on('connection', (socket: any) => {


  socket.on('disconnect', () => {
    socket.leave(socket.id)  
    onlineUser.map(x=>{
      console.log(x);
      
      x.userSocket.map((y:any,index:any) =>{
        console.log(index);
        
        if(y === socket.id)
        x.userSocket.splice(index, 1);

      })
    })
    console.log(onlineUser);
    
    socket.emit('onlineuser',onlineUser)
  });        

        socket.on('newUser',(data:any) =>{ 
            
            if(data){
              let userId:string =data;
             
              let userExsit = onlineUser.find((x:any)=> x.userId == userId )
              
              if(!userExsit){
                let arrayTab = [];
                arrayTab.push(socket.id)
                console.log(userId);0
                onlineUser.push({userId,userSocket:arrayTab})
              }else{
                userExsit.userSocket.push(socket.id)
              }
            }
            
            io.emit('onlineuser',onlineUser)
        })
        
  

  socket.on('join', (data: any) => {
    
    let user = data.user;
    let conversation = data.conversation
    
    socket.join(conversation);

 
    

      socket.emit('message', {
        user,
        text: `${user.name}, welcome to the chat `,
      });
      socket.broadcast
        .to(conversation)
        .emit('message', { user, text: `${user.name} has joined the chat!` });
 
  });

  socket.on("newnotif", async (data:any) => {
      console.log(data,"/////////");
      
      const resData = data.notification.email
      let arrF = onlineUser.find((user) =>{return  user.userId == resData});
      console.log(arrF);
      
      if(arrF)
      arrF.userSocket.map((x:any)=>{
          io.to(x).emit("getNotfi",{data:data.notification});
      })
    

  });
  
  socket.on('sendMessage', (message: any, user: any, discussionId: any, callback: any) => {
    console.log("message.discussionId",message.discussionId);
    
    io.to(message.discussionId).emit('message', { user, text: message }); 

  });

});

server.listen(port, () => {
  console.info(`--- 🌟  Started (${env}) --- http://localhost:${port}`);
});

if (env === 'development') {
  // initialize test data once (admin@example.com)
  require('./api/utils/InitData');
}

/**
 * Exports express
 * @public
 */
module.exports = app;

module.exports.handler = serverless(app);
