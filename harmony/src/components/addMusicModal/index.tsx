import React, { useState } from 'react';
import { Modal } from 'antd';
import TransparentBox1 from 'src/components/transparentBox1';

const addMusicModal = ({ isVisible, onClose, children }: any) => {
    if (!isVisible) return null;
  
    return (
      <div className="transparent_modal">
        <div className="content">
          {children}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  
  export default addMusicModal;
