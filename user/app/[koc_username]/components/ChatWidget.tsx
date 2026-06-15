'use client';
import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { kocShopService } from '../../../src/services/koc-shop.service';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  _id: string;
  senderType: 'koc' | 'guest';
  messageText?: string;
  images?: string[];
  createdAt: string;
}

export default function ChatWidget({ kocId, kocName }: { kocId: string; kocName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [guestSessionId, setGuestSessionId] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Khởi tạo guestSessionId
  useEffect(() => {
    let sessionId = localStorage.getItem('chat_guest_session_id');
    if (!sessionId) {
      sessionId = `guest-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('chat_guest_session_id', sessionId);
    }
    setGuestSessionId(sessionId);

    const savedName = localStorage.getItem('chat_guest_name');
    if (savedName) {
      setGuestName(savedName);
      setIsRegistered(true);
    }
  }, []);

  // Khởi động chat khi đã có tên khách
  useEffect(() => {
    if (!isRegistered || !guestSessionId || !kocId) return;

    const initChat = async () => {
      try {
        const conversation = await kocShopService.getOrCreateChatConversation({
          kocId,
          guestSessionId,
          guestName
        });
        setConversationId(conversation._id);

        // Lấy lịch sử chat
        const oldMessages = await kocShopService.getMessages(conversation._id);
        setMessages(oldMessages);

        // Kết nối Socket.io
        const socketUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5001';
        const socket = io(socketUrl, {
          transports: ['websocket'],
          withCredentials: true
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          socket.emit('joinRoom', { conversationId: conversation._id });
        });

        socket.on('newMessage', (newMsg: Message) => {
          setMessages(prev => [...prev, newMsg]);
        });
      } catch (error) {
        console.error('Lỗi khởi tạo chat:', error);
      }
    };

    initChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isRegistered, guestSessionId, kocId]);

  // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    localStorage.setItem('chat_guest_name', guestName);
    setIsRegistered(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !conversationId) return;

    const text = inputValue;
    setInputValue('');

    if (socketRef.current) {
      socketRef.current.emit('sendMessage', {
        conversationId,
        senderType: 'guest',
        text
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brandPink hover:scale-105 active:scale-95 transition-all text-white p-4 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white w-80 md:w-96 h-[480px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-fade-in-up">
          {/* Header */}
          <div className="bg-brandPurple text-white p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm">Trò chuyện với {kocName}</h4>
              <span className="text-[10px] opacity-80">Chúng tôi thường trả lời sau vài phút</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:opacity-80 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-brandBg/20 flex flex-col justify-end">
            {!isRegistered ? (
              <form onSubmit={handleRegister} className="space-y-4 my-auto">
                <p className="text-xs text-gray-500 text-center">Vui lòng nhập tên của bạn để bắt đầu cuộc trò chuyện trực tiếp</p>
                <input
                  type="text"
                  placeholder="Tên của bạn..."
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:border-brandPink text-sm"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-brandPink text-white py-2 rounded-2xl font-bold text-sm cursor-pointer"
                >
                  Bắt đầu Chat
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => {
                  const isMe = msg.senderType === 'guest';
                  return (
                    <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-brandPink text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                        }`}
                      >
                        {msg.messageText}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer Input */}
          {isRegistered && (
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-50 border-0 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brandPink"
              />
              <button
                type="submit"
                className="bg-brandPink text-white p-2 rounded-full hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
