import React, { useState } from 'react';
import './FloatingChat.css';

function FloatingChat() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { from: 'bot', text: 'Hi! How can we help you today?' }
  ]);
  const [input, setInput] = React.useState("");
  function sendMessage() {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'bot', text: 'Thank you for your message! Our team will reply soon.' }]);
    }, 1000);
    setInput("");
  }
  return (
    <>
      <button className="floating-chat" onClick={() => setOpen(o => !o)} title="Chat with us!">
        💬
      </button>
      {open && (
        <div className="floating-chat-window">
          <b>Live Chat</b>
          <div className="floating-chat-messages">
            {messages.map((m, i) => <div key={i} style={{ textAlign: m.from === 'bot' ? 'left' : 'right', margin: '6px 0' }}><span style={{ background: m.from === 'bot' ? '#e6f9e6' : '#d1e7fd', padding: '6px 12px', borderRadius: 12, display: 'inline-block' }}>{m.text}</span></div>)}
          </div>
          <div className="floating-chat-input-row">
            <input className="floating-chat-input" placeholder="Type your message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
            <button className="floating-chat-send" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingChat;
