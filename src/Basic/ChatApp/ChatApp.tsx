import React, { useState } from "react";
import "./ChatApp.css";
// import sampleImage from "./sample.jpg";

const contactsData = [
  {
    name: "John Doe",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Emma Thompson",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Olivia Miller",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Sophia Davis",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "Ava Wilson",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Isabella Brown",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Mia Johnson",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
];

const ChatApp = () => {
  const [selectedContact, setSelectedContact] = useState(contactsData[0]);
  const [messages, setMessages] = useState([
    { from: "John Doe", text: "Hey man!" },
    { from: "me", text: "Yo sup?!" },
    {
      from: "me",
    //   image: sampleImage,
      text: "Look where I am at the moment! 😄",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { from: "me", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="user-info">
          <img
            src="https://i.pravatar.cc/150?img=8"
            alt="user"
            className="user-avatar"
          />
          <span>devburak</span>
        </div>
        <div className="tabs">
          <button className="active">Chats</button>
          <button>Contacts</button>
        </div>
        <div className="contacts-list">
          {contactsData.map((contact) => (
            <div
              key={contact.name}
              className={`contact-item ${
                selectedContact.name === contact.name ? "selected" : ""
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <img src={contact.avatar} alt={contact.name} className="avatar" />
              <div>
                <p>{contact.name}</p>
                <span>{contact.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        <div className="chat-header">
          <img
            src={selectedContact.avatar}
            alt={selectedContact.name}
            className="avatar"
          />
          <span>{selectedContact.name}</span>
        </div>

        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.from === "me" ? "sent" : "received"}`}
            >
              {/* {msg.image && (
                <img src={msg.image} alt="sent" className="chat-image" />
              )} */}
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
