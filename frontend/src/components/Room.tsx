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
    localAudioTrack: MediaStreamTrack | null,
    localVideoTrack: MediaStreamTrack | null,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [lobby,setLobby] = useState(true);
   // const name = searchParams.get('name');
    const [sendingPc,setSendingPc] = useState<null | RTCPeerConnection>(null);
    const [receivingPc,setReceivingPc] = useState<null | RTCPeerConnection>(null); 
    const [remoteVideoTrack, setRemoteVideoTrack] = useState< MediaStreamTrack | null>(null);    
    const [socket, setSocket] = useState<null | Socket>(null);
    const [remoteAudioTrack, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
   // const [connected,setConnected] = useState(false)
    useEffect(() => {
     const socket = io(URL);
     socket.on('send-offer',async({roomId}) => {
        console.log('sending offer');
        setLobby(false);
        const pc = new RTCPeerConnection();
        setSendingPc(pc);
        if(localAudioTrack){
            pc.addTrack(localAudioTrack);
        }

        if(localVideoTrack){
            pc.addTrack(localVideoTrack);
        }

        pc.onicecandidate = async (e)=> {
            console.log('receiving ice candidate locally');
            if(e.candidate){
                socket.emit('add-ice-candidate',{
                    candidate: e.candidate,
                    type: "sender",
                    roomId
                });
            }
            
        }

        pc.onnegotiationneeded = async () => {
            console.log('on negotiation needed, sending offer');
            const sdp = await pc.createOffer();
            pc.setLocalDescription(sdp);
            socket.emit('offer', {
                sdp,
                roomId
            });
        };
     });
     socket.on('offer', async ({roomId,sdp: remoteSdp}) => {
        console.log('recieved offer');
        setLobby(false);
        const pc = new RTCPeerConnection();
        pc.setRemoteDescription(remoteSdp);
        const sdp = await pc.createAnswer();
        pc.setLocalDescription(sdp);
        const stream = new MediaStream();
        if(remoteVideoRef.current) {
             remoteVideoRef.current.srcObject = stream;
        }
       
        setRemoteMediaStream( stream);
        //trickle ice
        setReceivingPc(pc);
         //@ts-ignore
        window.pcr = pc;
        pc.ontrack = (e) => {
            alert("ontrack");
        }

        pc.onicecandidate = async (e) => {
            if(!e.candidate){
                return;
            }
                console.log("on ice candidate on receiving side");
                if (e.candidate) {
                   socket.emit("add-ice-candidate", {
                    candidate: e.candidate,
                    type: "receiver",
                    roomId
                   })
                }
            }

       
        socket.emit('answer',{
            roomId,
            sdp: sdp
        });
     });
 
     setTimeout(() => {
        const pc = new RTCPeerConnection();
        const track1 = pc.getTransceivers()[0].receiver.track;
        const track2 = pc.getTransceivers()[1].receiver.track;
         console.log(track1);
         if(track1.kind === "video"){
            setRemoteAudioTrack(track2);
            setRemoteVideoTrack(track1);
         }
         else{
            setRemoteAudioTrack(track1);
            setRemoteVideoTrack(track2);
         }
         //@ts-ignore
         RemoteVideoRef.current.srcObject.addTrack(track1);
         //@ts-ignore
         RemoteVideoRef.current.srcObject.addTrack(track2);
         //@ts-ignore
                remoteVideoRef.current.play();
    },5000)

    socket.on("answer", async ({roomId, sdp: remoteSdp}) => {
            setLobby(false);
            setSendingPc(pc => {
                pc?.setRemoteDescription(remoteSdp);
                return pc;
            })
            console.log("loop closed");
        })
    socket.on('lobby', () => {
        setLobby(true);
    });

    socket.on("add-ice-candidate", ({candidate, type}) => {
            console.log("add ice candidate from remote");
            console.log({candidate, type})
            if (type == "sender") {
                setReceivingPc(pc => {
                    if(!pc){
                        console.error('sending pc not found')
                    }
                    else{
                        console.error(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            } else {
                setSendingPc(pc => {
                    if(!pc){
                        console.error('sending pc not found')
                    }
                    else{
                        console.error(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            }
        });

     setSocket(socket)
    }, [name])

    useEffect(() => {
        if(localVideoRef.current && localVideoTrack) {
            const localStream = new MediaStream([localVideoTrack]);
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current.play();
        }
    }, [localVideoRef, localVideoTrack])
    return (
        <div>
            hi {name}
           <video autoPlay width={400} height={400} ref={localVideoRef}></video>
           {lobby ? "waiting to connect you to someone" : null}
           <video autoPlay width={400} height={400} ref={remoteVideoRef}></video>
        </div>
    )
}