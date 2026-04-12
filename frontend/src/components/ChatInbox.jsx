import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ChatInbox.css';

export function ChatInbox({ userId }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/inbox/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setChats(data);
        }
      } catch (err) {
        console.error('Failed to fetch inbox', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, [userId]);

  if (loading) return <div className="inbox-loading">Loading conversations...</div>;

  return (
    <div className="chat-inbox">
      <div className="chat-inbox__header">
        <h3>Recent Messages</h3>
        <span className="chat-inbox__count">{chats.length}</span>
      </div>
      
      <div className="chat-inbox__list">
        {chats.length === 0 ? (
          <div className="chat-inbox__empty">
            <p>No messages yet.</p>
          </div>
        ) : (
          chats.map((chat) => {
            const otherUser = String(userId) === String(chat.brokerId._id) ? chat.learnerId : chat.brokerId;
            const lastMsg = chat.messages[chat.messages.length - 1];
            
            return (
              <Link to={`/chat/id/${chat._id}`} key={chat._id} className="chat-inbox__item">
                <div className="chat-item__avatar">
                  {otherUser.image ? (
                    <img src={otherUser.image} alt={otherUser.name} />
                  ) : (
                    otherUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="chat-item__content">
                  <div className="chat-item__top">
                    <span className="chat-item__name">{otherUser.name}</span>
                    <span className="chat-item__time">
                      {lastMsg ? new Date(lastMsg.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </div>
                  <p className="chat-item__preview">
                    {lastMsg ? lastMsg.text : 'Start a conversation...'}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
