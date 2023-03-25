import React, { useState, useEffect } from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import Cookies from "universal-cookie";

import {
  ChannelSearch,
  PersonalChannel,
  TeamChannelList,
  TeamChannelPreview,
} from "./";
import CalendarIcon from "../assets/calendar.png";
import LogoutIcon from "../assets/logout.png";

const cookies = new Cookies();

const SideBar = ({ logout }) => (
  <div className="channel-list__sidebar">
    <div className="channel-list__sidebar__icon1">
      <div className="icon1__inner">
        <img src={CalendarIcon} alt="Calendar" width="30" />
      </div>
    </div>
    <div className="channel-list__sidebar__icon2">
      <div className="icon1__inner" onClick={logout}>
        <img src={LogoutIcon} alt="Logout" title="Sign Out" width="40" />
      </div>
    </div>
  </div>
);

const CompanyHeader = () => (
  <div className="channel-list__header">
    <p className="channel-list__header__text">SyncSchedule</p>
  </div>
);

const customPersonalChannelFilter = (channels) => {
  return channels.filter((channel) => {
    if (channel.type !== "messaging") {
      return false;
    }
    const members = Object.values(channel.state.members || {});
    return members.some(
      (member) => member.user.id === "18c0d74c3413610d5f814f9964668116"
    );
  });
};

const customChannelTeamFilter = (channels) => {
  return channels.filter((channel) => channel.type === "team");
};

const customChannelMessagingFilter = (channels) => {
  return channels.filter((channel) => {
    if (channel.type !== "messaging") {
      return false;
    }
    const members = Object.values(channel.state.members || {});
    return !members.some(
      (member) => member.user.id === "18c0d74c3413610d5f814f9964668116"
    );
  });
};

const ChannelListContent = ({
  isCreating,
  setIsCreating,
  setCreateType,
  setIsEditing,
  setToggleContainer,
  data,
  teamChannelHashTable,
  setTeamChannelHashTable
}) => {
  const { client } = useChatContext();

  useEffect(() => {
    const getChannels = async () => {
      try {
        const response = await fetch("http://localhost:5000/channels")
        const data = await response.json()

        const teamChannelHashTable = {}
        data.forEach((channel) => {
          teamChannelHashTable[channel._id] = channel.channelName;
        })
        setTeamChannelHashTable(teamChannelHashTable)

      } catch (error) {
        console.error(error);
      }
    };

    if (client) {
      getChannels();
    }
  }, [client]);

  const logout = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("username");
    cookies.remove("fullName");
    cookies.remove("avatarURL");
    cookies.remove("hashedPassword");
    cookies.remove("phoneNumber");

    window.location.reload();
  };

  const createMessagingChannel = async () => {
    try {
      const channel = client.channel("messaging", {
        members: [client.userID, "18c0d74c3413610d5f814f9964668116"],
      });
      await channel.create();
    } catch (error) {
      console.error("Error creating personal channel:", error);
    }
  };

  if (data.username !== "Personal") {
    createMessagingChannel()
  }

  const filters = { members: { $in: [client.userID] } };

  return (
    <>
      <SideBar logout={logout} />
      <div className="channel-list__list__wrapper">
        <CompanyHeader />
        <ChannelSearch 
          setToggleContainer={setToggleContainer}
          teamChannelHashTable={teamChannelHashTable} />
        <ChannelList
          filters={filters}
          channelRenderFilterFn={customPersonalChannelFilter}
          List={(listProps) => (
            <PersonalChannel {...listProps} type="messaging" />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              setIsCreating={setIsCreating}
              setIsEditing={setIsEditing}
              setToggleContainer={setToggleContainer}
              type="messaging"
            />
          )}
        />
        <ChannelList
          filters={filters}
          channelRenderFilterFn={customChannelTeamFilter}
          List={(listProps) => (
            <TeamChannelList
              {...listProps}
              type="team"
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              setCreateType={setCreateType}
              setIsEditing={setIsEditing}
              setToggleContainer={setToggleContainer}
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              setIsCreating={setIsCreating}
              setIsEditing={setIsEditing}
              setToggleContainer={setToggleContainer}
              teamChannelHashTable={teamChannelHashTable}
              type="team"
            />
          )}
        />
        <ChannelList
          filters={filters}
          channelRenderFilterFn={customChannelMessagingFilter}
          List={(listProps) => (
            <TeamChannelList
              {...listProps}
              type="messaging"
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              setCreateType={setCreateType}
              setIsEditing={setIsEditing}
              setToggleContainer={setToggleContainer}
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              setIsCreating={setIsCreating}
              setIsEditing={setIsEditing}
              setToggleContainer={setToggleContainer}
              type="messaging"
            />
          )}
        />
      </div>
    </>
  );
};

const ChannelListContainer = ({
  setCreateType,
  setIsCreating,
  setIsEditing,
  data,
  teamChannelHashTable,
  setTeamChannelHashTable
}) => {
  const [toggleContainer, setToggleContainer] = useState(false);

  return (
    <>
      <div className="channel-list__container">
        <ChannelListContent
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          teamChannelHashTable={teamChannelHashTable}
          setTeamChannelHashTable={setTeamChannelHashTable}
          data={data}
        />
      </div>

      <div
        className="channel-list__container-responsive"
        style={{
          left: toggleContainer ? "0%" : "-89%",
          backgroundColor: "#005fff",
        }}
      >
        <div
          className="channel-list__container-toggle"
          onClick={() =>
            setToggleContainer((prevToggleContainer) => !prevToggleContainer)
          }
        ></div>
        <ChannelListContent
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          data={data}
          teamChannelHashTable={teamChannelHashTable}
          setTeamChannelHashTable={setTeamChannelHashTable}
          setToggleContainer={setToggleContainer}
        />
      </div>
    </>
  );
};

export default ChannelListContainer;
