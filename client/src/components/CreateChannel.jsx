import React, { useState } from 'react'
import { useChatContext } from 'stream-chat-react'

import { UserList } from './'
import { CloseCreateChannel } from '../assets'

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    const handleChange = (event) => {
        event.preventDefault()

        setChannelName(event.target.value)
    }

    return (
        <div className='channel-name-input__wrapper'>
            <p>Name</p>
            <input value={channelName} onChange={handleChange} placeholder='channel-name' />
            <p>Add Members</p>
        </div>
    )
}

const CreateChannel = ({ createType, setIsCreating, teamChannelHashTable }) => {
    const { client, setActiveChannel } = useChatContext()
    const [selectedUsers, setSelectedUsers] = useState([client.userID || ''])
    const [channelName, setChannelName] = useState('')

    const createChannel = async (e) => {
        e.preventDefault()

        try {

            const uuid = crypto.randomUUID();

            const newChannel = await client.channel(createType, uuid, {
                name: uuid, members: selectedUsers
            })

            const channel = {
                _id: uuid,
                channelName: channelName
            }

            teamChannelHashTable[uuid] = channelName
            sendChannel(channel)

            await newChannel.watch()

            setChannelName('')
            setIsCreating(false)
            setSelectedUsers([client.userID])
            setActiveChannel(newChannel)
        } catch (error) {
            console.log(error)
        }
    }

    async function sendChannel(channel) {
        fetch('http://localhost:5000/channels', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(channel)
          })
            .then(response => response.json())
            .then(data => {})
            .catch(error => console.error(error));
    }


    return (
        <div className='create-channel__container'>
            <div className='create-channel__header'>
                <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
                <CloseCreateChannel setIsCreating={setIsCreating}/>
            </div>
            {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName}/>}
            <UserList setSelectedUsers={setSelectedUsers} />
            <div className='create-channel__button-wrapper' onClick={createChannel}>
                <p>{createType === 'team' ? 'Create Channel' : 'Create Message Group'}</p>
            </div>
        </div>
    )
}

export default CreateChannel