import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import './css-pages/ChatPage.css';

export function ChatPage() {
  const { chatId: existingChatId, brokerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Initial Load: Get or Create Chat
  useEffect(() => {
    const initChat = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        let res;
        if (existingChatId) {
          res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/${existingChatId}`);
        } else if (brokerId) {
          res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/initiate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ learnerId: user.id, brokerId })
          });
        }

        if (res && res.ok) {
          const data = await res.json();
          setChat(data);
          // If we were on /[brokerId], redirect to /[chatId] for a cleaner URL
          if (!existingChatId) {
            navigate(`/chat/id/${data._id}`, { replace: true });
          }
        }
      } catch (err) {
        console.error('Chat init error', err);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [existingChatId, brokerId, user, navigate]);

  // 2. Poll for new messages (Simple polling for now)
  useEffect(() => {
    if (!chat?._id) return;
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/${chat._id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages.length !== chat.messages.length) {
            setChat(data);
          }
        }
      } catch (e) {}
    }, 3000);

    return () => clearInterval(interval);
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !chat?._id || !user) return;

    setSending(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/${chat._id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: user.id, text })
      });
      if (res.ok) {
        const updatedChat = await res.json();
        setChat(updatedChat);
        setText('');
      }
    } catch (err) {
      console.error('Send error', err);
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="chat-page-wrapper">
        <Header />
        <div className="chat-error">
          <h2>Please log in to chat with brokers.</h2>
          <button className="chat-header__btn" onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-page-wrapper">
        <Header />
        <div className="chat-loading">
          <div className="spinner"></div>
          <p>Connecting to secure server...</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="chat-page-wrapper">
        <Header />
        <div className="chat-error">
          <h2>Could not establish connection.</h2>
          <button className="chat-header__btn" onClick={() => navigate('/brokers')}>Back to Brokers</button>
        </div>
      </div>
    );
  }

  // Determine who we are chatting with
  const isBrokerInChat = chat.brokerId && typeof chat.brokerId === 'object' && String(user.id) === String(chat.brokerId._id);
  const otherUser = isBrokerInChat ? (chat.learnerId || {}) : (chat.brokerId || {});
  const otherName = otherUser.name || 'User';

  return (
    <div className="chat-page-wrapper">
      <Header />
      
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <div className="chat-header__info">
            <div className="chat-header__avatar">
              {otherUser.image ? (
                <img src={otherUser.image} alt={otherName} />
              ) : (
                otherName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="chat-header__details">
              <h2>{otherName}</h2>
              <p>{otherUser.type === 'Broker' ? 'Official Broker' : 'Verified Partner'}</p>
            </div>
          </div>
          
          <div className="chat-header__actions">
            <button className="chat-header__btn" title="End Chat" onClick={() => navigate(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="chat-messages">
          {chat.messages.map((ms, idx) => {
            const isMe = String(ms.senderId) === String(user.id);
            return (
              <div 
                key={idx} 
                className={`chat-message ${isMe ? 'chat-message--learner' : 'chat-message--broker'}`}
              >
                <div className="chat-message__text">{ms.text}</div>
                <span className="chat-message__time">
                  {new Date(ms.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="chat-input-bar" onSubmit={handleSend}>
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Type a message..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="chat-send-btn" disabled={sending || !text.trim()}>
            {sending ? '...' : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
