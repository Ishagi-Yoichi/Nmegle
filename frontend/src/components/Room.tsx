import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {Socket ,io} from "socket.io-client"

const URL = "http://localhost:3000"

export const Room = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [lobby,setLobby] = useState(true);
    const name = searchParams.get('name');
    const [sendingPc,setSendingPc] = useState<null | Socket>(null);
    const [receivingPc,setReceivingPc] = useState<null | Socket>(null); 
    const [remoteVideoTrack, setRemoteVideoTrack] = useState<null | MediaStreamTrack>(null);    
    const [socket, setSocket] = useState<null | Socket>(null);
    const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteAudioTrack, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack, null>(null);
   // const [connected,setConnected] = useState(false)
    useEffect(() => {
     const socket = io(URL);
     socket.on('send-offer',async({roomId}) => {
        setLobby(false);
        const pc = new RTCPeerConnection();
        setSendingPc(pc);
        const sdp= await pc.createOffer();
        alert('send offer please')
        socket.emit('offer',{
            sdp,
            roomId
            
        });
     });
     socket.on('offer', async ({roomId,offer}) => {
        alert('send answer please')
        setLobby(false);
        const pc = new RTCPeerConnection();
        pc.setRemoteDescription(new RTCSessionDescription({sdp:offer,type:"offer"}));
        const sdp= await pc.createAnswer();
        setReceivingPc(pc);
        pc.ontrack = (({track,type}) => {
            if(type == 'audio') {
                setRemoteAudioTrack(track);
            } else {
                setRemoteVideoTrack(track);
            }
        });
        socket.emit('answer',{
            roomId,
            sdp: sdp
        });
     });
    socket.on("answer", ({roomId, answer}) => {
            setLobby(false);
            setSendingPc(pc => {
                pc?.setRemoteDescription({
                    type: "answer",
                    sdp: answer
                })
                return pc;
            })
        })
    socket.on('lobby', () => {
        setLobby(true);
        alert('You are in the lobby');
    });

     setSocket(socket)
    
    }, [name])

    if(lobby) return <div>Waiting for another user...</div>

    return (
        <div>
            hi {name}
           <video width={400} height={300}></video>
           <video width={400} height={300}></video>
        </div>
    )
}