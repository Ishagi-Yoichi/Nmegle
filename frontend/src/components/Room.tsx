import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {Socket ,io} from "socket.io-client"

const URL = "http://localhost:3000"

export const Room = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const name = searchParams.get('name');
    const [socket, setSocket] = useState<null | Socket>(null);
   // const [connected,setConnected] = useState(false)
    useEffect(() => {
     const socket = io(URL);
     socket.on('send-offer',({roomId}) => {
        alert('send offer please')
        socket.emit('offer',{
            roomId,
            sdp: ''
        });
     });
     socket.on('offer', ({roomId,offer}) => {
        alert('send answer please')
        socket.emit('answer',{
            roomId,
            sdp: ''
        });
     });
     socket.on('answer', ({roomId,answer}) => {
        alert('connection established')
        
     })
     setSocket(socket)
    
    }, [name])
    return (
        <div>
            Hi {name}
        </div>
    )
}