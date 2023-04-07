const express=require('express');                                      //making of express server
const app=express();
const path=require('path');

const http=require('http');                                         
const server =http.createServer(app);

const {Server} =require('socket.io');
const io =new Server (server);

app.use(express.static('build'));
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'));
});

const Action =require('./src/Actions')
const userSocketMap={};

function getAllConnectedClients(roomId)
{
    //map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username:userSocketMap[socketId],

        };
    });
}

io.on('connection',(socket)=>{
         console.log('socket connected' ,socket.id);
      
        socket.on(Action.JOIN,({roomId,username})=>{
            userSocketMap[socket.id]=username;
            socket.join(roomId);                                       //add socket to the roomid
            const clients =getAllConnectedClients(roomId);
            clients.forEach(({socketId})=>{
                  io.to(socketId).emit(Action.JOINED,{                             // frontend call
                    clients,
                    username,
                    socketId:socket.id,
                  })
            })
        });
        
        socket.on(Action.CODE_CHANGE,({roomid,code})=>{
            socket.in(roomid).emit(Action.CODE_CHANGE,{code});
        })

        socket.on(Action.SYNC_CODE,({socketId,code})=>{
            io.to(socketId).emit(Action.CODE_CHANGE,{code});
        })

        socket.on('disconnecting',()=>{
            const rooms=[...socket.rooms];
            rooms.forEach((roomId)=>{
                socket.in(roomId).emit(Action.DISCONNECTED,{
                    socketId:socket.id,
                    username:userSocketMap[socket.id],
                });
            })
            delete userSocketMap[socket.id];
            socket.leave();                                                //DELETE SOCKET
        })


});
// make script on package.json server:dev  server:pord 



const PORT =process.env.PORT || 5000;
server.listen(PORT,()=>console.log("listing on port "+PORT));