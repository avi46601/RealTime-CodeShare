import React, { useState } from "react";
import {v4 as uuidv4} from "uuid";
import Toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";
function Home () 
{
    const navigate = useNavigate();
    const [roomid ,setroomid]=useState('');
    const [userName ,setUserName]=useState('');
    function createNewRoom(x)
    {
        const id = uuidv4();
        setroomid(id);
        Toast.success('Hey ! Your New Room has Been Created :)');
        x.preventDefault();
    }
    function joinClient()
    {
        if(!roomid || !userName)
        {
        Toast.error('RoomID & UserName Are Required');
        return ;
        }
        //redirect
        navigate(`/editor/${roomid}`,
        {
            state:
            {
                userName,
            },
        });
    };
    
    function handleInputEnter(x)
    {
        if(x.code === 'Enter')
        {
            joinClient();
        }
    }

    return <div className="homePageWrapper">
         <div className="imagediv">
            <img src="/abhi.png" className="image" alt="pic" />
         </div>
         <div className="formWrapper">
             
              <h5 className="mainLable">Paste Inviation Code Id</h5>
              <div className="inputGroup">
                <input type="text" onChange={(x)=>setroomid(x.target.value)} onKeyUp={handleInputEnter} className="inputBox" placeholder="Room ID" value={roomid}></input>
                <input type="text" onChange={(x)=>setUserName(x.target.value)} onKeyUp={handleInputEnter} className="inputBox" placeholder="UserName" value={userName}></input>
                <button className="btn joinbtn" onClick={joinClient}>Join</button>
                <span className="createInput">
                    If you don't have an invite then Create &nbsp;
                    <a onClick={createNewRoom} href="/#"className="createNewBtn">New Room</a>
                </span>
              </div>
         </div>
         <footer>
            <h4>
                👨‍🔧 Made By  <a href="https://www.linkedin.com/in/avi46601/">Abhishek</a>
            </h4>
         </footer>
    </div>
};
export default Home;