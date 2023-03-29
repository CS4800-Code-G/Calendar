import React, { useState, useEffect } from 'react'
import { useChatContext } from 'stream-chat-react'

import { ResultsDropdown } from './'
import { SearchIcon } from '../assets'

const ChannelSearch = ({ setToggleContainer, teamChannelHashTable, query, setQuery }) => {
    const { client, setActiveChannel } = useChatContext()
    const [loading, setLoading] = useState(false)
    const [teamChannels, setTeamChannels] = useState([])
    const [directChannels, setDirectChannels] = useState([])

    useEffect(() => {
        if (!query) {
            setTeamChannels([])
            setDirectChannels([])
        }
    }, [query])

    const getChannels = async (channelText, userText) => {
        try {
            const channelResponse = client.queryChannels({
                type: 'team', 
                name: { $in: channelText }, 
                members: { $in: [client.user.id]}
            }) 
            const userResponse = client.queryUsers({
                id: { $nin: [client.userID, '18c0d74c3413610d5f814f9964668116', 'codeg', 'kims', 'jred'] },
                name: { $autocomplete: userText }
            })

            const [channels, { users }] = await Promise.all([channelResponse, userResponse])

            if (channels.length) setTeamChannels(channels)
            if (users.length) setDirectChannels(users)
        } catch (error) {
            //setQuery('')
        }
      }
      /*
    const onSearch = (event) => {
        event.preventDefault()

        setLoading(true)
        setQuery(event.target.value)
        getChannels(event.target.value)
    }
    */

    const escapeRegExp = (str) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      
      const getKeyByValue = (obj, value) => {
        const escapedValue = escapeRegExp(value);
        const matchingEntries = Object.entries(obj).filter(
          (entry) => entry[1].match(new RegExp(`^${escapedValue}`, 'i'))
        );
        return matchingEntries.length ? matchingEntries.map((entry) => entry[0]) : null;
      }

      const onSearch = (event) => {
        event.preventDefault();
      
        setLoading(true);
        const searchTerm = event.target.value;
        const channelKeys = getKeyByValue(teamChannelHashTable, searchTerm)
        if (channelKeys) {
            setQuery(searchTerm);
            getChannels(channelKeys, searchTerm)
        } else {
            setQuery(searchTerm);
            getChannels([searchTerm], searchTerm)
        }
      }

    const setChannel = (channel) => {
        setQuery('')
        setActiveChannel(channel)
    }

    return (
        <div className='channel-search__container'>
            <div className='channel-search__input__wrapper'>
                <div className='channel-search__input__icon'>
                    <SearchIcon />
                </div>
                <input 
                    className='channel-search__input__text' 
                    placeholder='Search' 
                    type='text' 
                    value={query} 
                    onChange={onSearch}
                />
            </div>
            { query && (
                <ResultsDropdown 
                    teamChannels={teamChannels}
                    directChannels={directChannels}
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                    teamChannelHashTable={teamChannelHashTable}
                />
            )}
        </div>
    )
}

export default ChannelSearch