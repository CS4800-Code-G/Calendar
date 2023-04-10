import React, { useState, useEffect } from 'react';
import { Avatar } from 'stream-chat-react';

export const ProfileModal = ({ onSave, onClose, fullName, username, phoneNumber, image }) => {
  const [phoneNumberInput, setPhoneNumberInput] = useState(phoneNumber || '');
  const [imageInput, setImageInput] = useState(image || '');
  const [showMessage, setShowMessage] = useState(false);
  const [updatedImage, setUpdatedImage] = useState(image || '');

  const handleSave = () => {
    onSave(phoneNumberInput, imageInput);
    setShowMessage(true);
    setUpdatedImage(imageInput);
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showMessage]);

  const isImageValid = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <>
      <div id='profileModal'>
        <h2 className='profile_header'>Profile</h2>
        <div className='profile_avatar' style={{ margin: '0 auto' }}>
          {isImageValid(updatedImage) ? (
            <Avatar 
              image={updatedImage} 
              name={fullName} 
              size={75} 
              onMouseOver={(e) => e.currentTarget.removeAttribute("title")} 
            />
          ) : (
            <Avatar 
              name={fullName} 
              size={75} 
              onMouseOver={(e) => e.currentTarget.removeAttribute("title")} 
            />
          )}
        </div>
        <p className='profile_full-name'>{fullName}</p>
        <p className='profile_username'>@{username}</p>
        <input
          className='profile_phone-number'
          value={phoneNumberInput}
          onChange={(e) => setPhoneNumberInput(e.target.value)}
          placeholder='Phone Number'
        />
        <input
          className='profile_avatar-url'
          value={imageInput}
          onChange={(e) => setImageInput(e.target.value)}
          placeholder='Avatar URL'
        />
        <button onClick={handleSave} id='saveButton'>
          Save
        </button>
        <button
          onClick={() => {
            onClose();
          }}
          id='cancelButton'
        >
          Close
        </button>
        {
            showMessage && 
            <div className='profile_updated-message'>
                Saved ✓
            </div>
        }
      </div>
    </>
  );
};