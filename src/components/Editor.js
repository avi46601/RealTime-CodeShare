import React, { useEffect, useRef } from "react"
import CodeMirror from "codemirror";
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import Action from '../Actions';
function Editor ({socketRef,roomid,onCodeChange})
{
    const editorRef=useRef(null);
    useEffect(() => {
        async function init() {
                editorRef.current =CodeMirror.fromTextArea(
                    document.getElementById("realtimeedit"),{
                       mode:{name:'javascript' ,json:true} ,
                       theme:'dracula',
                       autoCloseTags:true ,
                       autoCloseBrackets:true ,
                       lineNumbers:true
                 }
                 );
                editorRef.current.on('change',(instance, changes)=>{

                    const {origin} =changes;
                    const code=instance.getValue();
                    onCodeChange(code);
                    if(origin !== 'setValue')
                    {
                       socketRef.current.emit(Action.CODE_CHANGE,{
                         roomid,
                         code,
                       })
                    }
                })
                
               
        }
        init();
    },[]);                                             // eslint-disable-line react-hooks/exhaustive-deps
                              
    useEffect(()=>{
            if(socketRef.current)
            {
                socketRef.current.on(Action.CODE_CHANGE,({code})=>
                {
                    if(code!==null){
                        editorRef.current.setValue(code);
                    }
                })
            }
            return ()=>{
                socketRef.current.off(Action.CODE_CHANGE);
            }
    },[socketRef.current]);                             // eslint-disable-line react-hooks/exhaustive-deps           

    return <textarea id="realtimeedit"></textarea> ;
}

export default Editor ;