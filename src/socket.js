import {io} from 'socket.io-client';
                                                                              //read in documentation
export const initSocket = async() =>{                                
  const options={
    'force new connection': true ,
     reconnectionAttempt:'infinity',
     timeout : 10000,
     transports :['websocket'],
  };                                                                            //making of .env file
   return io(process.env.REACT_APP_BACKEND_URL,options);                                   
};