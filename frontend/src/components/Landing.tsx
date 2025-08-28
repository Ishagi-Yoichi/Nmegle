import { useState , useEffect, useRef } from 'react';
import { Room } from './Room';
export const Landing = () => {
    const [name, setName] = useState('');
   const [joined,setJoined] = useState(false);
    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
   
   const getCam = async() => {
    const streams = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        //MEdiastream hai yaha se
        const videoTrack = streams.getVideoTracks()[0];
        const audioTrack = streams.getAudioTracks()[0];
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
        if(!videoRef.current){
            return;  
        }
        videoRef.current.srcObject = new MediaStream([videoTrack]);
        videoRef.current.play();
   }
    useEffect(() => {
        if(videoRef && videoRef.current) {
             getCam();
        }
       
    },[videoRef]);  
    
    if(!joined){
        return (
            <div>
                <video ref={videoRef} autoPlay ></video>
            <input type="text" onChange={(e) => {
                setName(e.target.value);
            }}>
            </input>
           <button onClick= {() => {
            setJoined(true);
           }}> Joined </button>
            </div>
        )
    }
   return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />
}