import React from 'react'
import { Channel, useChatContext, MessageTeam } from 'stream-chat-react'

import { ChannelInner, CreateChannel, EditChannel } from './'

const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType, teamChannelHashTable, setQuery, pcid }) => {
    const { channel } = useChatContext()

    if (isCreating) {
        return (
            <div className='channel__container'>
                <CreateChannel createType={createType} setIsCreating={setIsCreating} teamChannelHashTable={teamChannelHashTable} />
            </div>
        )
    }

    if (isEditing) {
        return (
            <div className='channel__container'>
                <EditChannel setIsEditing={setIsEditing} teamChannelHashTable={teamChannelHashTable} setQuery={setQuery} pcid={pcid} />
            </div>
        )
    }

    const EmptyState = () => (
        <div className='channel-empty__container'>
            <p className='channel-empty__first'>This is the beginning of your chat history.</p>
            <p className='channel-empty__second'>Send messages, attachments, links, emojis, and more!</p>
        </div>
    )

    return (
        <div className='channel__container'>
            <Channel
                EmptyStateIndicator={EmptyState}
                Message={(messageProps, i) => <MessageTeam key={i} {...messageProps} />}
            >
                <ChannelInner 
                    setIsEditing={setIsEditing} 
                    teamChannelHashTable={teamChannelHashTable} />
            </Channel>
        </div>
    )
}

export default ChannelContainer