import React, { useState } from 'react'
import { StreamChat } from 'stream-chat'
import { Chat } from 'stream-chat-react'
import Cookies from 'universal-cookie'

import { Calendar, ChannelListContainer, ChannelContainer, Auth } from './components'

import 'stream-chat-react/dist/css/index.css'
import './App.css'

const cookies = new Cookies()

const apiKey = 'ctuxx9s77qmj'
const authToken = cookies.get('token')

const client = StreamChat.getInstance(apiKey)

if (authToken) {
    client.connectUser({
        id: cookies.get('userId'),
        name: cookies.get('username'),
        fullName: cookies.get('fullName'),
        image: cookies.get('avatarURL'),
        hashedPassword: cookies.get('hashedPassword'),
        phoneNumber: cookies.get('phoneNumber'),
    }, authToken)
}

const App = () => {
    const [createType, setCreateType] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isSignup, setIsSignup] = useState(true)
    const [teamChannelHashTable, setTeamChannelHashTable] = useState({})

    const data = {
        username: cookies.get('username'),
    }

    if (!authToken) return <Auth isSignup={isSignup} setIsSignup={setIsSignup}/>

    return (
        <div className='app__wrapper'>
            <Chat client={client} theme='team light'>
                <ChannelListContainer
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                    teamChannelHashTable={teamChannelHashTable}
                    setTeamChannelHashTable={setTeamChannelHashTable}
                    data={data}
                    isSignup={isSignup}
                />
                <Calendar data={data}/>
                <ChannelContainer
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    createType={createType}
                    teamChannelHashTable={teamChannelHashTable}
                />
            </Chat>
        </div>
    )
}

export default App