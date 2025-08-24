import { useState, useEffect, useRef } from "react";
import "./App.css";

interface MediaFile {
  file: File;
  url: string;
  thumbnail: string;
}

function App() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [playing, setPlaying] = useState<MediaFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const filesArray = Array.from(files).filter((f) =>
      f.type.startsWith("video/")
    );

    const mediaData: MediaFile[] = await Promise.all(
      filesArray.map(async (file) => {
        const url = URL.createObjectURL(file);
        const thumbnail = await getVideoThumbnail(url);
        return { file, url, thumbnail };
      })
    );

    setMediaFiles(mediaData);
  };

  const getVideoThumbnail = (videoUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.currentTime = 0.1; // first frame
      video.muted = true;
      video.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 90;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      });
    });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Video Explorer</h1>
        <button onClick={() => fileInputRef.current?.click()}>
          Select Videos
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </header>

      <div className="media-grid">
        {mediaFiles.length === 0 && <p>No videos selected</p>}
        {mediaFiles.map((media, i) => (
          <div
            key={i}
            className="media-card"
            onClick={() => setPlaying(media)}
          >
            <img src={media.thumbnail} alt={media.file.name} />
            <p>{media.file.name}</p>
          </div>
        ))}
      </div>

      {playing && (
        <div className="video-overlay" onClick={() => setPlaying(null)}>
          <video
            src={playing.url}
            controls
            autoPlay
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default App;
