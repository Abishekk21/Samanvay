import React from 'react';
import './VideoBackground.css';
import videoSrc from '../video.mov';

const VideoBackground = () => {
  return (
    <div className="video-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-background__video"
      >
        <source src={videoSrc} type="video/quicktime" />
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-background__overlay"></div>
    </div>
  );
};

export default VideoBackground;
