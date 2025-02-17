import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Microphone2, MicrophoneSlash, Refresh2 } from 'iconsax-react';

const SecMicrophone = ({ onTranscriptChange, showTranscript = true }) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [inputText, setInputText] = useState("");

    useEffect(() => {
        if (transcript && listening) {
            setInputText(transcript); // Update input field when speaking
            onTranscriptChange(transcript);
        }
    }, [transcript, listening, onTranscriptChange]);

    useEffect(() => {
        if (!listening) {
            onTranscriptChange(inputText); // Update transcript when typing
        }
    }, [inputText, listening, onTranscriptChange]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const handleStartListening = () => {
        SpeechRecognition.startListening({ continuous: true });
    };

    const handleStopListening = () => {
        SpeechRecognition.stopListening();
    };

    const handleReset = () => {
        resetTranscript();
        setInputText("");
    };

    return (
        <div className='items-center'>
            {showTranscript && (
                <div className="bg-[#9adfb1] rounded-3xl self-center justify-center p-4">
                    <div className="text-xl font-normal">Your Answer</div>
                    <div className="bg-white p-5 rounded-2xl">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Speak or type your answer..."
                            className="w-full border-none outline-none"
                            disabled={listening} // Disable typing when speech recognition is active
                        />
                    </div>
                </div>
            )}
            <p className='text-center'>Microphone: {listening ? 'on' : 'off'}</p>

            <div className='flex self-center justify-center gap-4'>
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
                    onClick={handleReset}
                    aria-label="Reset Transcript"
                    className="cursor-pointer"
                />
            </div>
        </div>
    );
};

export default SecMicrophone;
