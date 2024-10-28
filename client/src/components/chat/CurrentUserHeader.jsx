/* eslint-disable react/prop-types */
import extractTime from "./extractTime";

const CurrentUserHeader = ({ selectedUserInfo }) => {
  const currentTime = extractTime(new Date().toISOString());
  return (
    <>
      <div className="chat-contact chat-bar">
        <img
          className="chat-pic stark"
          src={selectedUserInfo.avatar.url}
          alt={selectedUserInfo.name}
        />
        <span className="chat-name">{selectedUserInfo.name}</span>
        <p className="chat-seen">Today at {currentTime}</p>
      </div>
    </>
  );
};

export default CurrentUserHeader;
