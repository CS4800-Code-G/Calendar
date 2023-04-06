import React, { useState, useEffect } from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import { ProfileModal } from "./ProfileModal";
import Cookies from "universal-cookie";

import {
  ChannelSearch,
  PersonalChannel,
  TeamChannelList,
  TeamChannelPreview,
} from "./";
import CalendarIcon from "../assets/calendar.png";
import LogoutIcon from "../assets/logout.png";
import SettingIcon from "../assets/setting.png"

const cookies = new Cookies();

const SideBar = ({ logout, settings }) => (
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
    <div className="channel-list__sidebar__icon2">
      <div className="icon1__inner" onClick={settings}>
        <img src={SettingIcon} alt="Settings" title="Settings" width="40" />
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
  isSignup,
  teamChannelHashTable,
  setTeamChannelHashTable,
  query,
  setQuery,
  pcid,
  setPcid
}) => {
  const { client, setActiveChannel } = useChatContext();
  const [settingsClicked, setSettingsClicked] = useState(false)

  useEffect(() => {
    const getChannels = async () => {
      try {
        const response = await fetch("http://54.238.166.164:5000/channels")
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

  const settings = () => {
    setSettingsClicked(true)
    setQuery('')
  }

  const createPersonalChannel = async () => {
    try {
      const channel = client.channel("messaging", {
        members: [client.userID, "18c0d74c3413610d5f814f9964668116"],
      });
      await channel.create()
      setPcid(channel.id)
    } catch (error) {
      console.error("Error creating personal channel:", error);
    }
  };

  useEffect(() => {
    if (isSignup && data.username !== "Personal") {
      client.queryChannels({
        type: "messaging",
        members: { $eq: [client.userID, "18c0d74c3413610d5f814f9964668116"] },
      })
      .then((channels) => {
        if (channels.length > 0) {
          const channel = channels[0]
          setPcid(channel.id)
        } else {
          createPersonalChannel()
          const pc = client.channel('messaging', pcid)
          setActiveChannel(pc)
        }
      })
      .catch((error) => {
        console.error("Error querying channels:", error);
      })
    }
  }, [pcid])

  const filters = { members: { $in: [client.userID] } };

  return (
    <>
      <SideBar logout={logout} settings={settings}/>
      <div className="channel-list__list__wrapper">
        <CompanyHeader />
        <ChannelSearch 
          setToggleContainer={setToggleContainer}
          teamChannelHashTable={teamChannelHashTable} 
          query={query}
          setQuery={setQuery}
          />
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
        {
          settingsClicked === true && (
            <ProfileModal
              fullName={client?.user?.fullName}
              username={client?.user?.name}
              phoneNumber={client?.user?.phoneNumber}
              image={client?.user?.image}
              onSave={(phoneNumber, image) => {
                const update = {
                  id: client.userID,
                  set: {
                      phoneNumber: phoneNumber,
                      image: image
                  }
                }
                client.partialUpdateUser(update)
              }}
              onClose={() => {
                setSettingsClicked(false)
              }}
            />
          )
        }
      </div>
    </>
  );
};

const ChannelListContainer = ({
  setCreateType,
  setIsCreating,
  setIsEditing,
  data,
  isSignup,
  teamChannelHashTable,
  setTeamChannelHashTable,
  query,
  setQuery,
  pcid,
  setPcid
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
          isSignup={isSignup}
          query={query}
          setQuery={setQuery}
          pcid={pcid}
          setPcid={setPcid}
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
          isSignup={isSignup}
          teamChannelHashTable={teamChannelHashTable}
          setTeamChannelHashTable={setTeamChannelHashTable}
          setToggleContainer={setToggleContainer}
          query={query}
          setQuery={setQuery}
          pcid={pcid}
          setPcid={setPcid}
        />
      </div>
    </>
  );
};

export default ChannelListContainer;
