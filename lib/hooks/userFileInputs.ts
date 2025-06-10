import { useRef, useState } from "react";

export const useFileInputs = (maxSize: number) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [durations, setDurations] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > maxSize) return;

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(selectedFile);

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      if (selectedFile.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          if (isFinite(video.duration) && video.duration > 0) {
            setDurations(Math.round(video.duration));
          } else {
            setDurations(0);
          }
          URL.revokeObjectURL(video.src);
        };
        video.src = objectUrl;
      }
    }
  };

  const resetFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setDurations(null);

    if (inputRef.current) inputRef.current.value = "";
  };

  return {
    file,
    previewUrl,
    durations,
    inputRef,
    handleFileChange,
    resetFile,
  };
};
