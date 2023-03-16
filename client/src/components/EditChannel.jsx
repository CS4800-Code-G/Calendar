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
  const currentUser = client.userID;

  const isOwner = channel?.data?.created_by?.id === currentUser;

  const updateChannel = async (event) => {
    event.preventDefault();
  
    const nameChanged = channelName !== (channel.data.name || channel.data.id);
  
    if (nameChanged) {
      const existingChannels = await client.queryChannels({
        type: channel.type,
        name: channelName,
      });
  
      if (existingChannels.length) {
        // If a channel with the same name already exists, remove the current channel name from the list of channels
        const filteredChannels = existingChannels.filter(c => c.id !== channel.id);
  
        // If there are still channels with the same name, throw an error
        if (filteredChannels.length) {
          throw new Error(`A channel with the name ${channelName} already exists.`);
        }
      }
  
      await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}` });
    }
  
    if (selectedUsers.length) {
      await channel.addMembers(selectedUsers);
    }
  
    setChannelName(null);
    setIsEditing(false);
    setSelectedUsers([]);
  };

  const handleDeleteChannel = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this channel? This cannot be undone.');
    if (!confirmed) return;

    await channel.delete();
    setIsEditing(false);
    // Navigate to a different channel or page
  };

  const handleLeaveChannel = async () => {
    const confirmed = window.confirm('Are you sure you want to leave this channel?');
    if (!confirmed) return;

    await client.channel(channel.type, channel.id).delete({hard_delete: true});
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
      {isOwner ? (
        <div className='edit-channel__button-wrapper delete-leave' onClick={handleDeleteChannel}>
          <p>Delete Channel</p>
        </div>
      ) : (
        <div className='edit-channel__button-wrapper delete-leave' onClick={handleLeaveChannel}>
          <p>Leave Channel</p>
        </div>
      )}
      <div className='edit-channel__button-wrapper' onClick={updateChannel}>
        <p>Save Changes</p>
      </div>
    </div>
  );
};

export default EditChannel;
