import "./chat.css";
import Contacts from "./Contacts";
import MainChat from "./MainChat";
const Chat = () => {
  return (
    <div className="main-chat-container">
      <div className="chat-container">
        <Contacts />
        <MainChat />
      </div>
    </div>
  );
};

export default Chat;
