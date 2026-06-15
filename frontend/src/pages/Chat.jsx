import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI } from '../services/api';

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
};

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesContainerRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  const scrollToBottom = (behavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior });
  };

  const loadMessages = useCallback(async (isInitial = false) => {
    try {
      const response = await chatAPI.getAll();
      const data = response.data.results || response.data;
      setMessages(data);
      setError('');

      if (isInitial || shouldAutoScroll.current) {
        setTimeout(() => scrollToBottom(isInitial ? 'auto' : 'smooth'), 50);
      }
    } catch (err) {
      if (isInitial) {
        setError('Failed to load messages. Please try again.');
      }
      console.error(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages(true);

    const interval = setInterval(() => loadMessages(false), 3000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    shouldAutoScroll.current = distanceFromBottom < 80;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content || sending) return;

    setSending(true);
    setError('');

    try {
      await chatAPI.send(content);
      setNewMessage('');
      shouldAutoScroll.current = true;
      await loadMessages(false);
    } catch (err) {
      setError(
        err.response?.data?.content?.[0] ||
        err.response?.data?.error ||
        'Failed to send message. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  const renderMessages = () => {
    let lastDate = null;

    return messages.map((message) => {
      const isOwn = message.user_id === user?.id;
      const messageDate = new Date(message.created_at).toDateString();
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message.id} className="min-w-0">
          {showDate && (
            <div className="flex justify-center my-4">
              <span className="text-xs text-purple-300 bg-indigo-900/40 px-3 py-1 rounded-full border border-cyan-500/20">
                {formatDateLabel(message.created_at)}
              </span>
            </div>
          )}
          <div className={`flex mb-3 min-w-0 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`min-w-0 max-w-[85%] sm:max-w-[70%] flex flex-col ${
                isOwn ? 'items-end' : 'items-start'
              }`}
            >
              {!isOwn && (
                <span className="text-xs text-cyan-300 mb-1 ml-1">{message.username}</span>
              )}
              <div
                className={`w-full min-w-0 px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word] ${
                  isOwn
                    ? 'bg-gradient-to-r from-cyan-600/80 to-purple-600/80 text-white rounded-br-md'
                    : 'bg-indigo-900/50 text-cyan-50 border border-cyan-500/20 rounded-bl-md'
                }`}
              >
                {message.content}
              </div>
              <span className={`text-[10px] text-purple-400 mt-1 shrink-0 ${isOwn ? 'mr-1' : 'ml-1'}`}>
                {formatTime(message.created_at)}
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden p-4 sm:p-6 box-border bg-space-gradient">
      <div className="max-w-3xl mx-auto w-full h-full flex flex-col min-h-0 overflow-hidden">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent shrink-0">
          Chat
        </h1>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-indigo-900/20 backdrop-blur-md rounded-2xl border border-cyan-500/20 shadow-xl">
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4"
          >
            {loading ? (
              <div className="flex items-center justify-center h-full min-h-[12rem]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-cyan-400 border-r-purple-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[12rem] text-center">
                <p className="text-purple-300">No messages yet. Say hello!</p>
              </div>
            ) : (
              renderMessages()
            )}
          </div>

          {error && (
            <div className="shrink-0 px-4 py-2 bg-red-900/40 border-t border-red-500/30 text-red-200 text-sm break-words">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="shrink-0 p-4 border-t border-cyan-500/20 bg-indigo-900/30 flex gap-3 items-end"
          >
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 min-w-0 px-4 py-3 bg-indigo-900/40 border border-cyan-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-purple-300 resize-none min-h-[48px] max-h-32 break-words"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 shrink-0"
            >
              {sending ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
