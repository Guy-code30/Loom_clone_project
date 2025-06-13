const VideoPlayer = () => {
  return (
    <div className="video-player">
      <video controls>
        <source src="path/to/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;