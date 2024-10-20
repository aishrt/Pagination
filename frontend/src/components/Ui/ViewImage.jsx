import React, { useState } from "react";
import PropTypes from "prop-types";
import dummyImg from "../../assets/picture.png";
import { Box, Button, Modal } from "@mui/material";

const ViewImage = ({
  src,
  isCircle = false,
  borderColor = "#000",
  borderWidth = 0,
  size = 100,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageUrl = src || dummyImg; // Replace with your own dummy image URL

  const imageStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: isCircle ? "50%" : "0%",
    border: `${borderWidth}px solid ${borderColor}`,
    objectFit: "cover",
    cursor: "pointer", // Change cursor to pointer to indicate clickability
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <img
        src={imageUrl}
        alt="common"
        style={imageStyle}
        onClick={handleImageClick}
      />
      
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyles}>
          <img src={imageUrl} alt="common" style={modalImageStyle} />
          <Button variant="contained" color="error" onClick={closeModal} sx={closeButtonStyle}>
            X
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

// Modal styles using MUI's Box component styling
const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%", // Width of the modal
  maxWidth: "600px", // Max width of the modal
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

// Style for the modal image
const modalImageStyle = {
  maxWidth: "100%",
  maxHeight: "80vh",
  marginBottom: "16px", // Space between image and button
};

// Style for the close button
const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
};

// Default props
ViewImage.propTypes = {
  src: PropTypes.string,
  isCircle: PropTypes.bool,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  size: PropTypes.number,
};

export default ViewImage;
