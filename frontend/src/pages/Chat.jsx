import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Welcome to StreamFlow Chat! How can I help you connect with other streamers today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: 'Thanks for your message! This is the general chat area where you can connect with other StreamFlow users. Feel free to share your streaming experiences and tips!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Community Chat</h1>
          <p className="text-gray-400">Connect with other StreamFlow streamers and share experiences</p>
        </div>

        {/* Chat Container */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl h-[600px] flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-black/60 backdrop-blur-md border-b border-white/10 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">StreamFlow Community</h2>
              <p className="text-xs text-gray-400">Connect with fellow streamers</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white border border-white/20'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-gray-600' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-black/60 backdrop-blur-md border-t border-white/10">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
