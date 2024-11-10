import React from "react";
import ss from "./YoutubeIframePlayer.module.scss";

const YouTubeIframePlayer = ({ src }) => {
  // YouTube 링크를 embed 링크로 변환
  const embedSrc = src.replace("watch?v=", "embed/");

  return (
    <div
      className={ss.bg}
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
        maxWidth: "100%",
        background: "#000",
      }}>
      <iframe
        src={embedSrc}
        title="YouTube Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
};

export default YouTubeIframePlayer;
