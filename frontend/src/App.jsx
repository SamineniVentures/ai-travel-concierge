import React, { useState } from 'react';
import FlightSearch from './FlightSearch';
import Chat from './Chat';

export default function App() {
  const [messages, setMessages] = useState([]);

  const handleUserMessage = async (text) => {
    const userMessage = { sender: 'user', text };
    setMessages((msgs) => [...msgs, userMessage]);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>AI Travel Concierge</h1>
      <FlightSearch />
      <Chat messages={messages} onSend={handleUserMessage} />
    </div>
  );
}
