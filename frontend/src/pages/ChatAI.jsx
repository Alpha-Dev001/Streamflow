import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Enhanced chat responses with more natural variations
const chatResponses = {
  // Greetings and Introductions
  greeting: [
    "Hello! I'm your StreamFlow assistant. How can I help you today?",
    "Hi there! I'm here to help with streaming, content discovery, account management, and technical support. What do you need?",
    "Welcome to StreamFlow! I can assist with streaming setup, audience growth, and platform features. How can I help?",
    "Hey! I'm your StreamFlow expert. Ready to help with streaming, troubleshooting, or account questions. What's on your mind?",
    "Hi! I'm doing great, thanks for asking! I'm here to help you with anything StreamFlow related. What can I assist you with?",
    "Hello! I'm here and ready to help. Whether you need streaming advice or technical support, I've got you covered. What would you like to know?"
  ],

  // Conversational responses
  howAreYou: [
    "I'm doing great, thanks for asking! I'm here to help you with anything StreamFlow related. What can I assist you with?",
    "I'm functioning perfectly and ready to help! I'm your dedicated StreamFlow assistant. What do you need help with today?",
    "Thanks for checking in! I'm here to help you succeed on StreamFlow. What can I do for you?",
    "I'm excellent! Always ready to help with streaming, account questions, or technical issues. What's on your mind?"
  ],

  farewell: [
    "Goodbye! Feel free to come back anytime if you need help with StreamFlow. Have a great day!",
    "See you later! I'm always here if you need streaming advice or technical support. Take care!",
    "Bye! Don't hesitate to reach out if you need help with your StreamFlow journey. Happy streaming!",
    "Take care! Remember I'm here 24/7 to help with any StreamFlow questions. See you soon!"
  ],

  // General system/platform inquiries
  system: [
    "StreamFlow is a comprehensive streaming platform that combines powerful broadcasting tools with community features. You can stream high-quality content, engage with your audience through live chat, and grow your channel with our analytics tools. What specific aspect would you like to explore?",
    "StreamFlow offers professional streaming capabilities with real-time interaction, content discovery, and monetization options. Our platform supports HD streaming, audience analytics, and community building tools. What would you like to know more about?",
    "StreamFlow is your all-in-one streaming solution! We provide live broadcasting tools, audience engagement features, content discovery algorithms, and comprehensive analytics. Whether you're a creator or viewer, there's something for everyone. What interests you most?"
  ],

  content: [
    "StreamFlow offers diverse content across gaming, creative arts, music, education, lifestyle, and entertainment categories. You can discover live streams, recorded content, highlights, and community posts. Our algorithm helps you find content tailored to your interests. What type of content are you looking for?",
    "On StreamFlow, you'll find everything from gaming streams and creative art sessions to music performances and educational content. Creators share live experiences, while viewers can interact through real-time chat and virtual gifts. What content categories interest you most?",
    "StreamFlow's content ecosystem includes live broadcasting, video-on-demand, highlight clips, and community posts. Creators can share their passions while building engaged communities. What kind of content would you like to explore or create?"
  ],

  live: [
    "Going live on StreamFlow is easy! Just ensure you have a good internet connection (5+ Mbps upload), test your camera and microphone, then click 'Start Streaming' from your dashboard. You can configure quality settings, add a title and tags, and engage with your audience through live chat. Would you like a step-by-step setup guide?",
    "Live streaming on StreamFlow supports HD quality up to 1080p60fps with real-time chat interaction. You'll need a modern browser, camera/mic permissions, and stable internet. Our platform provides analytics, audience tools, and monetization options. Are you looking to start your first stream or improve your current setup?",
    "StreamFlow's live streaming feature includes professional broadcasting tools, real-time audience engagement, and performance analytics. You can stream in various quality tiers, use custom overlays, and interact through live chat. What specific aspect of live streaming would you like help with?"
  ],

  // Default response
  default: [
    "I'm here to help with all things StreamFlow! Whether you need assistance with streaming setup, content discovery, account management, or technical support, I've got you covered. What specific topic would you like to explore?",
    "That's an interesting question! I'm your dedicated StreamFlow assistant and can help with streaming, audience growth, platform features, and troubleshooting. What would you like to know more about?",
    "I'd be happy to help you with StreamFlow! From setting up your first stream to growing your audience, I'm here to provide guidance. What specific challenge are you facing?"
  ]
};

const ChatAI = () => {
  const { user } = useAuth();

  // User-specific localStorage key
  const storageKey = user ? `streamflow-chatai-messages-${user.id}` : 'streamflow-chatai-messages-guest';

  // Load messages from localStorage on component mount
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(storageKey);
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    }
    return [{
      id: 1,
      sender: 'bot',
      text: chatResponses.greeting[0],
      timestamp: new Date()
    }];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  const formatTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Check for greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return chatResponses.greeting[Math.floor(Math.random() * chatResponses.greeting.length)];
    }

    // Check for how are you
    if (message.includes('how are you') || message.includes('how are you doing')) {
      return chatResponses.howAreYou[Math.floor(Math.random() * chatResponses.howAreYou.length)];
    }

    // Check for goodbyes
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      return chatResponses.farewell[Math.floor(Math.random() * chatResponses.farewell.length)];
    }

    // Check for streaming questions
    if (message.includes('stream') || message.includes('live') || message.includes('broadcast')) {
      return chatResponses.live[Math.floor(Math.random() * chatResponses.live.length)];
    }

    // Check for content questions
    if (message.includes('content') || message.includes('video') || message.includes('watch')) {
      return chatResponses.content[Math.floor(Math.random() * chatResponses.content.length)];
    }

    // Check for system questions
    if (message.includes('what is') || message.includes('platform') || message.includes('streamflow')) {
      return chatResponses.system[Math.floor(Math.random() * chatResponses.system.length)];
    }

    // Default response
    return chatResponses.default[Math.floor(Math.random() * chatResponses.default.length)];
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

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: getResponse(inputMessage),
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
      <div className="w-full max-w-full mx-auto h-[calc(100vh-3rem)] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">AI Assistant</h1>
          <p className="text-gray-400">Get help with streaming, account management, and technical support</p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden min-h-0">
          {/* Chat Header */}
          <div className="bg-black/60 backdrop-blur-md border-b border-white/10 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">StreamFlow AI Assistant</h2>
              <p className="text-xs text-gray-400">Always here to help</p>
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
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.sender === 'user'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white border border-white/20'
                    }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-600' : 'text-gray-500'
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

export default ChatAI;
