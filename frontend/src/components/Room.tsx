import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {Socket ,io} from "socket.io-client"

const URL = "http://localhost:3000"

export const Room = ({
    name,
    localAudioTrack,
    localVideoTrack
}: {
    name: string,
    localAudioTrack: MediaStreamTrack ,
    localVideoTrack: MediaStreamTrack ,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [lobby,setLobby] = useState(true);
   // const name = searchParams.get('name');
    const [sendingPc,setSendingPc] = useState<null | Socket>(null);
    const [receivingPc,setReceivingPc] = useState<null | Socket>(null); 
    const [remoteVideoTrack, setRemoteVideoTrack] = useState< MediaStreamTrack | null>(null);    
    const [socket, setSocket] = useState<null | Socket>(null);
    const [remoteAudioTrack, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
   // const [connected,setConnected] = useState(false)
    useEffect(() => {
     const socket = io(URL);
     socket.on('send-offer',async({roomId}) => {
        setLobby(false);
        const pc = new RTCPeerConnection();
        setSendingPc(pc);
        pc.addTrack(localAudioTrack);
        pc.addTrack(localVideoTrack);

        pc.onicecandidate = async ()=> {
            const sdp= await pc.createOffer();
            alert('send offer please')
            socket.emit('offer',{
                sdp,
                roomId
                
            });
        }

       
     });
     socket.on('offer', async ({roomId,offer}) => {
        alert('send answer please')
        setLobby(false);
        const pc = new RTCPeerConnection();
        pc.setRemoteDescription(new RTCSessionDescription({sdp:offer,type:"offer"}));
        const sdp= await pc.createAnswer();
        if(remoteVideoRef.current) {
             remoteVideoRef.current.srcObject = new MediaStream();
        }
       
        setRemoteMediaStream(new MediaStream());
        setReceivingPc(pc);
        pc.ontrack = (({track,type}) => {
            if(type == 'audio') {
                //setRemoteAudioTrack(track); 
               // @ts-ignore
                remoteVideoRef.current.srcObject.addTrack(track);
            } else {
                //setRemoteVideoTrack(track);
                // @ts-ignore
                remoteVideoRef.current.srcObject.addTrack(track);

            }//@ts-ignore
            remoteVideoRef.current.play();
        });
        socket.emit('answer',{
            roomId,
            sdp: sdp
        });
     });

    socket.on("answer", async ({roomId, answer}) => {
            setLobby(false);
            const pc = new RTCPeerConnection();
        pc.setRemoteDescription(new RTCSessionDescription({sdp:offer,type:"offer"}));
        const sdp= await pc.createAnswer();
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
           <video width={400} height={300} ref={remoteVideoRef}></video>
        </div>
    )
}