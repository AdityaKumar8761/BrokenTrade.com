import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import './css-pages/BrokerDetailPage.css';

export function BrokerDetailPage() {
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

  // 1. Initial Load: Get or Create Chat and Broker Data
  useEffect(() => {
    const initPage = async () => {
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
          // If we were on /broker/[ID], redirect to /chat/id/[ID] for a cleaner URL
          if (!existingChatId) {
            navigate(`/broker/id/${data._id}`, { replace: true });
          }
        }
      } catch (err) {
        console.error('Core init error', err);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [existingChatId, brokerId, user, navigate]);

  // 2. Poll for new messages
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
      <div className="broker-detail-wrapper">
        <Header />
        <div className="broker-detail-container" style={{display: 'flex', justifyContent: 'center', paddingTop: '200px'}}>
          <div style={{textAlign: 'center'}}>
            <h2>Please log in to contact brokers</h2>
            <button className="chat-box__send" style={{marginTop: '20px', padding: '12px 24px'}} onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !chat) {
    return (
      <div className="broker-detail-wrapper">
        <Header />
        <div className="broker-detail-container" style={{display: 'flex', justifyContent: 'center', paddingTop: '200px'}}>
           <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Broker context
  const broker = chat.brokerId;
  const isMeBroker = String(user.id) === String(broker._id);
  const otherUser = isMeBroker ? chat.learnerId : broker;

  return (
    <div className="broker-detail-wrapper">
      <Header />
      
      <main className="broker-detail-container">
        {/* LEFT: Broker Details */}
        <section className="broker-detail__main">
          <div className="broker-detail__hero">
             <img 
               src={broker.gig || "https://images.unsplash.com/photo-1611974717482-58206a2378b2?q=80&w=2070&auto=format&fit=crop"} 
               alt={`${broker.name} Banner`} 
             />
          </div>
          
          <div className="broker-detail__header">
            <h1 className="broker-detail__title">{broker.gig || `Professional Financial Services by ${broker.name}`}</h1>
            
            <div className="broker-detail__profile-bar">
              <div className="broker-detail__avatar">
                {broker.image ? <img src={broker.image} alt={broker.name} /> : (broker.name ? broker.name.charAt(0).toUpperCase() : 'B')}
              </div>
              <div className="broker-detail__meta">
                <span className="broker-detail__name">{broker.name}</span>
                <div className="broker-detail__level">
                    <span style={{color: '#1dbf73', fontWeight: 700}}>Verified Broker</span>
                    <span>| Platform Partner</span>
                    <span className="broker-detail__rating-summary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffbe5b" style={{marginRight: '2px'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        <strong>{broker.rating || '0.0'}</strong>
                        <span style={{color: '#b5b6ba'}}> rating</span>
                    </span>
                </div>
              </div>
            </div>
          </div>

          <div className="broker-detail__section">
            <h3>About This Broker</h3>
            <div className="broker-detail__description">
              <p>
                {broker.description || "The broker has not provided a detailed description yet."}
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT: Chat Sidebar */}
        <aside className="broker-detail__sidebar">
          <div className="broker-detail__chat-box">
            <div className="chat-box__header">
              <h4>Message {otherUser.name}</h4>
            </div>
            
            <div className="chat-box__messages">
                {chat.messages.length === 0 && (
                    <div style={{textAlign: 'center', marginTop: '40px', color: '#74767e', fontSize: '0.85rem'}}>
                        <p>Say hi to start the conversation!</p>
                    </div>
                )}
                {chat.messages.map((m, i) => {
                    const isMe = String(m.senderId) === String(user.id);
                    return (
                        <div key={i} className={`chat-box__bubble ${isMe ? 'chat-box__bubble--me' : 'chat-box__bubble--them'}`}>
                            {m.text}
                            <span className="chat-box__time">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-box__input-area" onSubmit={handleSend}>
                <input 
                    type="text" 
                    className="chat-box__input" 
                    placeholder="Type your message..." 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="chat-box__send" disabled={sending || !text.trim()}>
                    {sending ? '...' : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    )}
                </button>
            </form>
          </div>
          
          <div style={{marginTop: '16px', textAlign: 'center'}}>
              <p style={{fontSize: '0.8125rem', color: '#74767e'}}>Average response time: <strong>1 hour</strong></p>
          </div>
        </aside>
      </main>
    </div>
  );
}
