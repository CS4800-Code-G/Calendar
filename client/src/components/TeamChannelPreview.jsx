import React, { useState } from 'react'
import { Avatar, useChatContext } from 'stream-chat-react'

const TeamChannelPreview = ({ channel, type, setIsCreating, setIsEditing, setToggleContainer, setActiveChannel, teamChannelHashTable }) => {
    const { channel: activeChannel, client } = useChatContext()

    const ChannelPreview = () => (
        <p className='channel-preview__item'>
            # {teamChannelHashTable[channel?.data?.name]}
        </p>
    )  

    const DirectPreview = () => {
        const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);

        const isImageValid = (url) => {
            try {
                new URL(url);
                return true;
            } catch (error) {
                return false;
            }
        }

        const renderAvatar = () => {
            if (isImageValid(members[0]?.user?.image)) {
                return (
                    <Avatar
                        image={members[0]?.user?.image}
                        name={members[0]?.user?.fullName || members[0]?.user?.id}
                        size={24}
                    />
                )
            } else {
                return (
                    <Avatar
                        name={members[0]?.user?.fullName || members[0]?.user?.id}
                        size={24}
                    />
                )
            }
        }

        return (
            <div className='channel-preview__item single'>
                {renderAvatar()}
                <p className='channel-preview__item-text'>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
            </div>
        )
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