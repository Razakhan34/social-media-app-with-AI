/* eslint-disable react/prop-types */
import Contact from "./Contact";

const ContactsList = ({ conversations }) => {
  return (
    <>
      <div className="chat-contact-container">
        {conversations &&
          conversations.map((conversation, idx) => (
            <Contact
              key={conversation._id}
              conversation={conversation}
              lastIdx={idx === conversations.length - 1}
            />
          ))}
      </div>
    </>
  );
};

export default ContactsList;
