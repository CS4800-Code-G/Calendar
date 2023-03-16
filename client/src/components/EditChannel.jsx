import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
  const handleChange = (event) => {
    event.preventDefault();

    setChannelName(event.target.value);
  };

  return (
    <div className='channel-name-input__wrapper'>
      <p>Name</p>
      <input value={channelName} onChange={handleChange} placeholder='channel-name' />
      <p>Add Members</p>
    </div>
  );
};

const EditChannel = ({ setIsEditing }) => {
  const { channel, client } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const userId = client.userID;
  const isOwner = channel?.data?.created_by?.id === userId;

  const updateChannel = async (event) => {
    event.preventDefault();

    const nameChanged = channelName !== (channel.data.name || channel.data.id);

    if (nameChanged) {
      await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}` });
    }

    if (selectedUsers.length) {
      await channel.addMembers(selectedUsers);
    }

    setChannelName(null);
    setIsEditing(false);
    setSelectedUsers([]);
  };

  const leaveChannel = async () => {
    if (isOwner) {
      const confirmed = window.confirm('Are you sure you want to delete this channel?');
      if (!confirmed) return;

      await client.channel(channel.type, channel.id).delete();
    } else {
      await client.channel(channel.type, channel.id).removeMembers([client.userID]);
    }

    setIsEditing(false);
    // Navigate to a different channel or page
  };

  return (
    <div className='edit-channel_container'>
      <div className='edit-channel__header'>
        <p>Edit Channel</p>
        <CloseCreateChannel setIsEditing={setIsEditing} />
      </div>
      <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className='edit-channel__button-wrapper' onClick={updateChannel}>
        <p>Save Changes</p>
      </div>
      <div className='edit-channel__button-wrapper' onClick={leaveChannel}>
        <p>{isOwner ? 'Delete Channel' : 'Leave Channel'}</p>
      </div>
    </div>
  );
};


export default EditChannel;
