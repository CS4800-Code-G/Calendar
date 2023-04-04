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

async function updateChannelByID(id, updatedChannel) {
  fetch(`http://18.183.252.141:5000/channels/${id}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedChannel)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to update channel');
      }
      return response.json();
  })
  .then(updatedChannel => {
      console.log('Updated channel:', updatedChannel);
  })
  .catch(error => {
      console.error(error);
  });
}

async function deleteChannelById(id) {
  fetch('http://18.183.252.141:5000/channels/' + id, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {})
    .catch(error => {
      console.error('Error deleting channel:', error)
    })
}

const EditChannel = ({ setIsEditing, teamChannelHashTable, setQuery, pcid }) => {
  const { channel, client, setActiveChannel } = useChatContext();
  const [channelName, setChannelName] = useState(teamChannelHashTable[channel?.data?.name]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const currentUser = client.userID;

  const isOwner = channel?.data?.created_by?.id === currentUser;

  //console.log("Edit Channel: " + pcid)

  const updateChannel = async (event) => {
    event.preventDefault();
  
    const nameChanged = channelName !== (channel.data.name || channel.data.id);
  
    if (nameChanged) {
      const existingChannels = await client.queryChannels({
        type: channel.type,
        name: channel.id,
      });
  
      if (existingChannels.length) {
        // If a channel with the same name already exists, remove the current channel name from the list of channels
        const filteredChannels = existingChannels.filter(c => c.id !== channel.id);
  
        // If there are still channels with the same name, throw an error
        if (filteredChannels.length) {
          throw new Error(`A channel with the name ${channelName} already exists.`);
        }
      }
  
      updateChannelByID(channel.id, {
        channelName: channelName
      })
      teamChannelHashTable[channel.id] = channelName
      await channel.update({ name: channel.id }, { text: `Channel name changed to ${channelName}` });
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

    deleteChannelById(channel.id)
    await channel.delete();
    setIsEditing(false);
    setQuery('')
    // Navigate to personal channel
    const pc = client.channel('messaging', pcid)
    setActiveChannel(pc)
  };

  const handleLeaveChannel = async () => {
    const confirmed = window.confirm('Are you sure you want to leave this channel?');
    if (!confirmed) return;
    await client.channel(channel.type, channel.id).removeMembers([client.userID]);
    setIsEditing(false);
    setQuery('')
    // Navigate to personal channel
    const pc = client.channel('messaging', pcid)
    setActiveChannel(pc)
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
