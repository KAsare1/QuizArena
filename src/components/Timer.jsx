import React, { useState, useEffect } from 'react';

const Timer = ({ socket, connected, activeContestant }) => {
    const [timer, setTimer] = useState(30);
    
    useEffect(() => {
        if (!socket || !connected) return;
        
        // Handle incoming WebSocket messages
        const handleMessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'timer':
                    setTimer(data.data.timer);
                    break;
                    
                case 'next_contestant':
                    // Reset timer when next contestant is chosen
                    setTimer(30);
                    break;
                    
                case 'initial_state':
                    // Set initial timer value when joining
                    setTimer(data.data.timer);
                    break;
            }
        };

        socket.addEventListener('message', handleMessage);
        
        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket, connected]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center">
            <div className="text-4xl font-bold mb-2">
                {formatTime(timer)}
            </div>
            <div className="text-sm text-gray-600">
                {activeContestant === 0 ? 
                    "You're the host - timer syncs automatically" : 
                    "Timer controlled by host"}
            </div>
        </div>
    );
};

export default Timer;