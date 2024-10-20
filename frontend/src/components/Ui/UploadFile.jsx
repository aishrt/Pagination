import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const fileFormatImage =
  "https://img.freepik.com/free-vector/illustration-folder-with-document_53876-37005.jpg?t=st=1729276655~exp=1729280255~hmac=d5366af9e7f7f061894b83ae3467ca9d4d784eb7c0557b265f1a6c7da178115b&w=996";

const UploadFile = ({
  label = "Upload",
  isCircle = false,
  borderColor = "#656565",
  borderWidth = 1.5,
  width = 100,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  allowedFormats = [], // Allow all formats by default if empty
  showFileName = false,
  backgroundColor = "#f0f0f0",
  initialFileData = null || "",
  helperText = "",
  onFileUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialFileData);
  const [fileError, setFileError] = useState("");
  const [cover, setCover] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const mediaStyle = {
    width: `${width}px`,
    height: `${width}px`,
    borderRadius: isCircle ? "50%" : "5%",
    border: `${borderWidth}px solid ${borderColor}`,
    objectFit: "cover",
    cursor: "pointer",
    padding: "2px",
    backgroundColor: backgroundColor,
    position: "relative", // Make this relative for absolute child positioning
  };

  const crossButtonStyle = {
    position: "absolute",
    top: "-8px", // Adjust to move slightly above the top edge
    right: "-8px", // Adjust to move slightly to the right of the preview
    backgroundColor: "black",
    color: "white",
    borderRadius: "50%",
    border: "none",
    width: "20px",
    height: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    zIndex: 2, // Ensure it appears on top of the image or video
  };

  // Handle initialFileData
  useEffect(() => {
    if (initialFileData) {
      setPreviewUrl(initialFileData);
      setFileName(initialFileData.split("/").pop()); // Extract filename from URL
    }
  }, [initialFileData]);

  useEffect(() => {
    if (previewUrl || cover) {
      onFileUpload({
        fileName,
        file: selectedFile,
        type: selectedFile?.type || "unknown",
        fileUrl: previewUrl || cover,
      });
    }
  }, [previewUrl, cover, selectedFile, fileName, onFileUpload]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file size
      if (file.size > maxFileSize) {
        setFileError(
          `File size exceeds the limit of ${maxFileSize / (1024 * 1024)} MB.`
        );
        return;
      }

      // Validate file type based on MIME types
      const formats = allowedFormats.length > 0 ? allowedFormats : [];
      if (formats.length && !formats.includes(file.type)) {
        setFileError("Unsupported file format. Please select a valid file.");
        return;
      }

      // File is valid
      setFileError("");
      setSelectedFile(file);
      setFileName(file.name); // Set file name for display

      // Handle images
      if (isImage(file.name)) {
        const newUrl = URL.createObjectURL(file);
        setPreviewUrl(newUrl); // Set image preview using object URL
        return () => URL.revokeObjectURL(newUrl); // Cleanup
      }
      // Handle videos
      else if (isVideo(file.name)) {
        const newUrl = URL.createObjectURL(file);
        setPreviewUrl(newUrl); // Set video preview
        const coverImage = await getVideoCover(file, 1.5); // Get video thumbnail
        setCover(coverImage);
        return () => URL.revokeObjectURL(newUrl); // Cleanup
      }
      // Handle non-image/non-video files (e.g., PDFs, docs)
      else {
        setPreviewUrl(fileFormatImage); // Set a placeholder for non-previewable files

        // Trigger onFileUpload with the file data
        onFileUpload({
          fileName: file.name,
          file: file,
          type: file.type,
          fileUrl: null, // No actual preview URL for non-image/video files
        });
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Simulate click on hidden file input
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName(null);
    setCover(null);
    fileInputRef.current.value = ""; // Clear file input value

    // Trigger the onFileUpload callback with empty data
    onFileUpload({
      fileName: null,
      file: null,
      type: null,
      fileUrl: null,
    });
  };

  const renderPreview = () => {
    // Render image preview
    if (previewUrl && isImage(selectedFile?.name || "")) {
      return (
        <div style={{ position: "relative", width: `${width}px` }}>
          <img
            src={previewUrl}
            alt="Selected"
            style={mediaStyle}
            onClick={handleClick}
          />
          <button style={crossButtonStyle} onClick={clearFile}>
            ×
          </button>
        </div>
      );
    }
    // Render video preview
    else if (previewUrl && isVideo(selectedFile?.name || "")) {
      return (
        <div style={{ position: "relative", width: `${width}px` }}>
          <video controls style={mediaStyle} onClick={handleClick}>
            <source src={previewUrl} type={selectedFile?.type || "video/mp4"} />
            Your browser does not support the video tag.
          </video>
          <button style={crossButtonStyle} onClick={clearFile}>
            ×
          </button>
        </div>
      );
    }
    // Render placeholder for non-image and non-video files
    else if (fileName) {
      return (
        <div style={{ position: "relative", width: `${width}px` }}>
          <img
            src={fileFormatImage}
            alt="File Format Placeholder"
            style={mediaStyle}
            onClick={handleClick}
          />
          <button style={crossButtonStyle} onClick={clearFile}>
            ×
          </button>
        </div>
      );
    }
    // Render initial placeholder before file selection with + sign
    else {
      return (
        <div
          style={{
            ...mediaStyle,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleClick}
        >
          <div
            style={{
              position: "absolute",
              fontSize: "40px",
              color: "#000",
              fontWeight: "bold",
              textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            +
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {label && (
        <label style={{ marginBottom: "10px", display: "block" }}>
          {label}
        </label>
      )}

      {/* File Preview with + sign */}
      {renderPreview()}

      {/* Hidden File Upload */}
      <input
        type="file"
        accept={allowedFormats.length > 0 ? allowedFormats.join(",") : "*/*"}
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      {/* Helper text */}
      {helperText && (
        <p style={{ color: "grey", fontSize: "12px" }}>{helperText}</p>
      )}

      {/* Error Message */}
      {fileError && <p style={{ color: "red" }}>{fileError}</p>}

      {/* Show/Hide File Name */}
      {showFileName &&
        (selectedFile ? (
          <p>{selectedFile.name}</p>
        ) : (
          initialFileData && <p>{fileName}</p> // Show filename from initialFileData if no file is selected
        ))}
    </div>
  );
};

// PropTypes and Default Props
UploadFile.propTypes = {
  label: PropTypes.string,
  isCircle: PropTypes.bool,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  width: PropTypes.number,
  maxFileSize: PropTypes.number,
  allowedFormats: PropTypes.arrayOf(PropTypes.string),
  showFileName: PropTypes.bool,
  backgroundColor: PropTypes.string,
  initialFileData: PropTypes.string,
  onFileUpload: PropTypes.func.isRequired,
};

export default UploadFile;

// Utility functions
function getExtension(filename) {
  const parts = filename.split(".");
  return parts[parts.length - 1];
}

function isImage(filename) {
  const ext = getExtension(filename);
  return [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
    "tiff",
    "ico",
  ].includes(ext.toLowerCase());
}

function isVideo(filename) {
  const ext = getExtension(filename);
  return [
    "m4v",
    "avi",
    "mpg",
    "mp4",
    "mov",
    "mkv",
    "webm",
    "wmv",
    "flv",
  ].includes(ext.toLowerCase());
}

export function getVideoCover(file, seekTo = 0.0) {
  return new Promise((resolve, reject) => {
    const videoPlayer = document.createElement("video");
    videoPlayer.src = URL.createObjectURL(file);
    videoPlayer.load();

    videoPlayer.addEventListener("error", () => {
      reject("Error when loading video file.");
    });

    videoPlayer.addEventListener("loadedmetadata", () => {
      if (videoPlayer.duration < seekTo) {
        reject("Video is too short.");
        return;
      }

      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);

      videoPlayer.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        }

        resolve(canvas.toDataURL("image/png"));
      });
    });
  });
}

// -------------- Usage-----------------

// <UploadFile
// label="Upload a file"
// width={110}
// maxFileSize={100}//Mb
// isCircle={true}
// initialFileData="https://img.freepik.com/free-vector/illustration-folder-with-document_53876-37005.jpg?t=st=1729276655~exp=1729280255~hmac=d5366af9e7f7f061894b83ae3467ca9d4d784eb7c0557b265f1a6c7da178115b&w=996"
// onFileUpload={handleFileUpload}
// showFileName={false}
// />

// const handleFileUpload = (fileDetails) => {
//   if (fileDetails?.fileName && fileDetails?.file == null) {
//     // Don't do anything in this case; it means we have not changed the image
//     console.log("Initial File Details:", fileDetails);
//     return;
//   } else {
//     console.log("Selected File Details:", fileDetails);
//   }
// };
