import React, { useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";

import {
  Calendar,
  ChannelListContainer,
  ChannelContainer,
  Auth,
} from "./components";
import CurrentDayPlans from "./components/CurrentDayPlans";
import RightSideBarContainer from "./components/RightSideBarContainer";
import "stream-chat-react/dist/css/index.css";
import "./App.css";

const cookies = new Cookies();

const apiKey = "ctuxx9s77qmj";
const authToken = cookies.get("token");

const client = StreamChat.getInstance(apiKey);

if (authToken) {
  client.connectUser(
    {
      id: cookies.get("userId"),
      name: cookies.get("username"),
      fullName: cookies.get("fullName"),
      image: cookies.get("avatarURL"),
      hashedPassword: cookies.get("hashedPassword"),
      phoneNumber: cookies.get("phoneNumber"),
    },
    authToken
  );
}

const App = () => {
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [teamChannelHashTable, setTeamChannelHashTable] = useState({});
  const [query, setQuery] = useState("");
  const [pcid, setPcid] = useState(null);

  const data = {
    username: cookies.get("username"),
  };

  if (!authToken) return <Auth isSignup={isSignup} setIsSignup={setIsSignup} />;

  const tabs = [
    {
      label: "Today's Events",
      content: <CurrentDayPlans></CurrentDayPlans>,
    },
    {
      label: "Messages",
      content: (
        <ChannelContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          createType={createType}
          teamChannelHashTable={teamChannelHashTable}
          setQuery={setQuery}
          pcid={pcid}
        />
      ),
    },
  ];
  return (
    <div className="app__wrapper">
      <Chat client={client} theme="team light">
        <ChannelListContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          teamChannelHashTable={teamChannelHashTable}
          setTeamChannelHashTable={setTeamChannelHashTable}
          data={data}
          isSignup={isSignup}
          query={query}
          setQuery={setQuery}
          pcid={pcid}
          setPcid={setPcid}
        />
        <Calendar data={data} />
        <ChannelContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          createType={createType}
          teamChannelHashTable={teamChannelHashTable}
          setQuery={setQuery}
          pcid={pcid}
        />
      </Chat>
    </div>
  );
};

export default App;
