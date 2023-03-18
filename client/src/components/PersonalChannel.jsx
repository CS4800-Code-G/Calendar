import React from 'react'

const PersonalChannelList = ({ children, error = false, loading, type }) => {
    if (error) {
        return type === 'team' ? (
            <div className='team-channel-list'>
                <p className='team-channel-list__message'>
                    Account not created, entered username is already taken.
                </p>
            </div>
        ) : null
    }

    if (loading) {
        return (
            <div className='team-channel-list'>
                <p className='team-channel-list__message loading'>
                    Channels loading...
                </p>
            </div>
        )
    }

    return (
        <div className='team-channel-list'>
            <div className='team-channel-list__header'>
                <p className='team-channel-list__header__title'>
                    Personal
                </p>
            </div>
            {children}
        </div>
    )
}

export default PersonalChannelList