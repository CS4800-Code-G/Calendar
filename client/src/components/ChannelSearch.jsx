import React, { useState, useEffect } from 'react'
import { useChatContext } from 'stream-chat-react'

import { ResultsDropdown } from './'
import { SearchIcon } from '../assets'

const ChannelSearch = ({ setToggleContainer }) => {
    const { client, setActiveChannel } = useChatContext()
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [teamChannels, setTeamChannels] = useState([])
    const [directChannels, setDirectChannels] = useState([])

    useEffect(() => {
        if (!query) {
            setTeamChannels([])
            setDirectChannels([])
        }
    }, [query])

    const getChannels = async (text) => {
        try {
          const filter = {
            type: 'team',
            $or: [
              { name: { $autocomplete: text } },
              { members: { $in: [client.user.id] } },
            ],
          };
          const sort = { last_message_at: -1 };
          const channels = await client.queryChannels(filter, sort);
          setTeamChannels(channels);
          setDirectChannels([]);
        } catch (error) {
          setTeamChannels([]);
          setDirectChannels([]);
        }
      }

    const onSearch = (event) => {
        event.preventDefault()

        setLoading(true)
        setQuery(event.target.value)
        getChannels(event.target.value)
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
                />
            )}
        </div>
    )
}

export default ChannelSearch