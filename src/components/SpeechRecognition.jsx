import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Microphone2, MicrophoneSlash, Refresh2 } from 'iconsax-react';

const Microphone = ({ 
    socket = null, 
    connected = false, 
    onTranscriptChange, 
    showTranscript = true, 
    activeContestant = null 
}) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [localTranscript, setLocalTranscript] = useState("");

    // WebSocket Handling (Only if `socket` is provided)
    useEffect(() => {
        if (!socket || !connected) return;

        const handleMessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'transcript_update':
                    if (data.data.active_contestant === activeContestant) {
                        setLocalTranscript(data.data.transcript);
                        onTranscriptChange?.(data.data.transcript);
                    }
                    break;
                
                case 'answer_submitted':
                case 'next_contestant':
                    setLocalTranscript("");
                    onTranscriptChange?.("");
                    break;
            }
        };

        socket.addEventListener('message', handleMessage);
        
        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket, connected, activeContestant, onTranscriptChange]);

    // Local transcript updates when speech is detected
    useEffect(() => {
        if (transcript) {
            setLocalTranscript(transcript);
            onTranscriptChange?.(transcript);
            
            // Broadcast to WebSocket only if connected
            if (socket && connected) {
                socket.send(JSON.stringify({
                    type: "transcript_update",
                    data: { transcript }
                }));
            }
        }
    }, [transcript, onTranscriptChange, socket, connected]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const handleStartListening = () => {
        SpeechRecognition.startListening({ continuous: true });
    };

    const handleStopListening = () => {
        SpeechRecognition.stopListening();
    };

    const handleSubmitAnswer = () => {
        if (socket && connected) {
            socket.send(JSON.stringify({
                type: "answer_submit",
                data: { transcript: localTranscript }
            }));
        }
    };

    return (
        <div className='w-3/4 items-center'>
            {showTranscript && (
                <div className="bg-[#9adfb1] rounded-3xl self-center justify-center p-4">
                    <div className="text-xl font-normal">Your Answer</div>
                    <div className="bg-white p-5 rounded-2xl">
                        {localTranscript || "Speak something..."}
                    </div>
                </div>
            )}
            <p>Microphone: {listening ? 'on' : 'off'}</p>

            <div className='flex self-center justify-center'>
                {listening ? (
                    <Microphone2
                        size="32"
                        color="#4f5b6e"
                        variant="Bold"
                        onClick={handleStopListening}
                        aria-label="Stop Listening"
                        className="cursor-pointer"
                    />
                ) : (
                    <MicrophoneSlash
                        size="32"
                        color="#76859c"
                        variant="Bold"
                        onClick={handleStartListening}
                        aria-label="Start Listening"
                        className="cursor-pointer"
                    />
                )}
                <Refresh2
                    size="32"
                    color="#4f5b6e"
                    variant="Bold"
                    onClick={() => {
                        resetTranscript();
                        setLocalTranscript("");
                    }}
                    aria-label="Reset Transcript"
                    className="cursor-pointer"
                />
            </div>
        </div>
    );
};

export default Microphone;
