import React, { useEffect, useRef } from 'react';

const Contestant = ({ userId, videoStream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      // Attach the video stream to the video element
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div className="contestant">
      <h3>Contestant: {userId}</h3>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};

export default Contestant;
