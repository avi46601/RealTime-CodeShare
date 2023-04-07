import React, { useEffect, useRef, useState } from "react";
import ClientList from "../components/clientList"
import Editorlog from "../components/Editor";
import toast from "react-hot-toast";
import { initSocket } from "../socket";
import Action from '../Actions';
import { Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
function Editor ()
{ 
    const socketRef =useRef(null);
    const location= useLocation();
    const reactNavigate= useNavigate();
    const {roomid} =useParams();
    const [clients,setClient]=useState([]);
    const codeRef= useRef(null);
    useEffect(()=>{
           const init =async ()=>{
            socketRef.current =await initSocket();
              
            socketRef.current.on('connect_error',(err)=>handleErrors(err));
            socketRef.current.on('connect_failed',(err)=>handleErrors(err));

            function handleErrors(e){
               console.log('socket error',e);
               toast.error('socket connection failed ,try again later.');
               reactNavigate('/');
            }
            
            socketRef.current.emit(Action.JOIN,
               {
                  roomId:roomid,
                  username:location.state?.userName,
               });
          
            //listing from server.js for joined event
            socketRef.current.on(
               Action.JOINED,
               ({clients,username,socketId})=>{
                  if(username!==location.state?.username){
                                      toast.success(`${username} joined the room.`);
                                      console.log(`${username} joined. `);
                  }
                  setClient(clients);
                  socketRef.current.emit(Action.SYNC_CODE,{code:codeRef.current,socketId});
               }
            );
            //listning from server.js for disconnected

            socketRef.current.on(Action.DISCONNECTED,({socketId,username})=>{
                   toast.success(`${username} left the room`);
                   console.log(`${username} LEFT. `);
                  setClient((prev)=>{
                      return prev.filter(client=>client.socketId !==socketId);
                   })
            })
           };
           init();
           return ()=>{                                                        //cleaning LISTENER function
            socketRef.current.disconnect();
            socketRef.current.off(Action.JOINED);                                           
            socketRef.current.off(Action.DISCONNECTED);
           }
    },[]);                                                    // eslint-disable-line react-hooks/exhaustive-deps

    if(!location.state)
    {
      return <Navigate to="/" />;
    }
      async function copyroomid()
      {
         try
         {
           console.log(roomid);
            await navigator.clipboard.writeText(roomid);
            toast.success("RoomId has been copy")
         }
            catch(err){
            toast.error("Could not copy RoomID ")
          }
      }
      function leaveroom()
      {
         reactNavigate('/');
      }
    return <div className="mainwrap">
    <div className="aside">
             <div className="sideInner"> 
                  <div className="logoclient"> 
                  <img src="/abhi.png" className="logoImage"  alt="logo"   />
                  </div>
             
                 <h3>Connected</h3>
                  <div className="clientList">
                   {
                     clients.map(
                         (x)=>(<ClientList key={x.socketId} username={x.username}/>)
                     )
                   }
                  </div>
             </div>
             <div>
                <button onClick={copyroomid} className="btn copybtn">Copy Room Id</button>
                <button onClick={leaveroom}className="btn leavebtn">Leave</button>
             </div>
    </div>
    <div >
       <Editorlog socketRef={socketRef} roomid={roomid} onCodeChange={(code)=>{codeRef.current=code}}/>
    </div>
 </div>;
}
export default Editor ;