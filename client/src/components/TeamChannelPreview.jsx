import React, { useState } from 'react'
import { Avatar, useChatContext } from 'stream-chat-react'

const TeamChannelPreview = ({ channel, type, setIsCreating, setIsEditing, setToggleContainer, setActiveChannel }) => {
    const { channel: activeChannel, client } = useChatContext()
    const [channelName, setChannelName] = useState(null)

    getChannelByID(channel?.data?.name)


    const ChannelPreview = () => (
        <p className='channel-preview__item'>
            # {channelName}
        </p>
    )
    

    const DirectPreview = () => {
        const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID)

        return (
            <div className='channel-preview__item single'>
                <Avatar
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.fullName || members[0]?.user?.id}
                    size={24}
                />
                <p className='channel-preview__item-text'>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
            </div>
        )
    }

    async function getChannelByID(id) {
        fetch('http://localhost:5000/channels/' + id)
            .then(response => response.json())
            .then(channel => {
                setChannelName(channel.channelName)
            })
            .catch(error => console.error(error));
    }

    return (
        <div className={
            channel?.id === activeChannel?.id
                ? 'channel-preview__wrapper__selected'
                : 'channel-preview__wrapper'
        }
        onClick={() => {
            setIsCreating(false)
            setIsEditing(false)
            setActiveChannel(channel)
            if (setToggleContainer) {
                setToggleContainer((prevState) => !prevState)
            }
        }}
        >
            {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
        </div>
    )
}

export default TeamChannelPreview