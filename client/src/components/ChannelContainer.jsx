import React, { useState } from 'react';
import { Channel, useChatContext, MessageTeam } from 'stream-chat-react';
import Modal from 'react-modal';

import { ChannelInner, CreateChannel, EditChannel } from './';
import Draggable from 'react-draggable';
Modal.setAppElement('#root');

const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType, isPopup }) => {
  const { channel } = useChatContext();
  const [showModal, setShowModal] = useState(isPopup);

  if (isCreating) {
    return (
      <div className='channel__container'>
        <CreateChannel createType={createType} setIsCreating={setIsCreating} />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className='channel__container'>
        <EditChannel setIsEditing={setIsEditing} />
      </div>
    );
  }

  const EmptyState = () => (
    <div className='channel-empty__container'>
      <p className='channel-empty__first'>This is the beginning of your chat history.</p>
      <p className='channel-empty__second'>Send messages, attachments, links, emojis, and more!</p>
    </div>
  );
/* changing chat must do npm install react-modal and npm install react-draggable*/
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      height: '500px',
      borderRadius: '5px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: '100',
    },
  };

  return (
    <div className='channel__container'>
      {showModal && (
        <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} style={customStyles}>
          <div style={{ marginBottom: '20px' }}>
            <button className='popup-close-button' onClick={() => setShowModal(false)}>
              X
            </button>
          </div>
          <Channel EmptyStateIndicator={EmptyState} Message={(messageProps, i) => <MessageTeam key={i} {...messageProps} />}>
            <ChannelInner setIsEditing={setIsEditing} />
          </Channel>
        </Modal>
      )}
      {!showModal && (
        <div style={{ position: 'relative', bottom: '0', right: '0', margin: '10px', boxShadow: '1px 1px 5px 0 rgba(0, 0, 0, 0.2)', zIndex: '100', backgroundColor: 'white', borderRadius: '5px' }}>
          <div className='popup-button-container'>
            <button className='popup-button' onClick={() => setShowModal(true)}>
              Open Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelContainer;
