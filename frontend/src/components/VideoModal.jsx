import React, { useEffect } from 'react';
import './VideoModal.css';
import '../styles/main.css'; // Importar estilos comunes

function VideoModal({ isOpen, onClose, videoUrl, title }) {
  useEffect(() => {
    // Prevenir scroll cuando el modal está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="video-modal-close" 
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <i className="fas fa-times"></i>
        </button>
        
        {title && <h3 className="video-modal-title">{title}</h3>}
        
        <div className="video-wrapper">
          <iframe
            src={videoUrl}
            title={title || "Video demo"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default VideoModal;
