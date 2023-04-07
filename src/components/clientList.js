import React from "react";
import Avator from "react-avatar";
function client (props)
{
    return <div className="clientClass">
    <Avator name={props.username} size={50} round="14px"/>
        <span  >{props.username}</span>
    </div>
}


export default client;