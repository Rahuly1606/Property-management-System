import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaPaperPlane, FaImage, FaFile, FaEllipsisV, FaSearch } from 'react-icons/fa';
import axios from '../../utils/api';
import { toast } from 'react-toastify';

const Messenger = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // In a real app, fetch from API
        // const response = await axios.get('/api/conversations');
        // setConversations(response.data);

        // Mock data
        setTimeout(() => {
          setConversations(mockConversations);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Failed to load conversations');
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        // In a real app, fetch from API
        // const response = await axios.get(`/api/conversations/${activeConversation.id}/messages`);
        // setMessages(response.data);

        // Mock data
        setTimeout(() => {
          setMessages(mockMessages[activeConversation.id] || []);
        }, 300);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
    
    // Mark conversation as read
    const updatedConversations = conversations.map(conv => 
      conv.id === activeConversation.id 
        ? { ...conv, unreadCount: 0 } 
        : conv
    );
    
    setConversations(updatedConversations);
  }, [activeConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    setIsSending(true);
    
    try {
      // In a real app, send to API
      // await axios.post(`/api/conversations/${activeConversation.id}/messages`, {
      //   content: newMessage,
      //   senderId: user.id,
      // });

      // Mock sending a message
      const mockNewMessage = {
        id: `msg-${Date.now()}`,
        conversationId: activeConversation.id,
        sender: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.profilePic || 'https://via.placeholder.com/40',
        },
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: true,
      };
      
      setMessages([...messages, mockNewMessage]);
      
      // Update conversation with last message
      const updatedConversations = conversations.map(conv => 
        conv.id === activeConversation.id 
          ? { 
              ...conv, 
              lastMessage: { 
                content: newMessage,
                timestamp: new Date().toISOString(),
              } 
            } 
          : conv
      );
      
      setConversations(updatedConversations);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      // Today: show time only
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffInDays < 7) {
      // This week: show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older: show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredConversations = conversations.filter(conversation => 
    conversation.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conversation.lastMessage && conversation.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Mock data
  const mockConversations = [
    {
      id: 'conv1',
      recipient: {
        id: 'user2',
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40',
        role: 'LANDLORD',
      },
      lastMessage: {
        content: "I'll check the plumbing issue tomorrow morning.",
        timestamp: '2023-06-15T10:30:00Z',
      },
      unreadCount: 2,
    },
    {
      id: 'conv2',
      recipient: {
        id: 'user3',
        name: 'Jane Smith',
        avatar: 'https://via.placeholder.com/40',
        role: 'TENANT',
      },
      lastMessage: {
        content: 'The rent has been paid. Thank you!',
        timestamp: '2023-06-14T15:45:00Z',
      },
      unreadCount: 0,
    },
    {
      id: 'conv3',
      recipient: {
        id: 'user4',
        name: 'Robert Johnson',
        avatar: 'https://via.placeholder.com/40',
        role: 'ADMIN',
      },
      lastMessage: {
        content: 'Your account has been verified successfully.',
        timestamp: '2023-06-10T09:20:00Z',
      },
      unreadCount: 0,
    },
  ];

  const mockMessages = {
    conv1: [
      {
        id: 'msg1',
        conversationId: 'conv1',
        sender: {
          id: 'user1', // Current user
          name: 'Current User',
          avatar: 'https://via.placeholder.com/40',
        },
        content: 'Hi, there is a plumbing issue in my apartment. The bathroom sink is leaking.',
        timestamp: '2023-06-15T09:00:00Z',
        read: true,
      },
      {
        id: 'msg2',
        conversationId: 'conv1',
        sender: {
          id: 'user2', // John Doe (landlord)
          name: 'John Doe',
          avatar: 'https://via.placeholder.com/40',
        },
        content: 'I\'m sorry to hear that. Can you provide more details about the leak?',
        timestamp: '2023-06-15T09:15:00Z',
        read: true,
      },
      {
        id: 'msg3',
        conversationId: 'conv1',
        sender: {
          id: 'user1', // Current user
          name: 'Current User',
          avatar: 'https://via.placeholder.com/40',
        },
        content: 'It seems to be leaking from the pipe under the sink. Water is pooling on the floor.',
        timestamp: '2023-06-15T09:30:00Z',
        read: true,
      },
      {
        id: 'msg4',
        conversationId: 'conv1',
        sender: {
          id: 'user2', // John Doe (landlord)
          name: 'John Doe',
          avatar: 'https://via.placeholder.com/40',
        },
        content: 'I\'ll check the plumbing issue tomorrow morning. Please make sure to keep towels under the sink to prevent water damage until then.',
        timestamp: '2023-06-15T10:30:00Z',
        read: false,
      },
    ],
    conv2: [
      {
        id: 'msg5',
        conversationId: 'conv2',
        sender: {
          id: 'user3', // Jane Smith (tenant)
          name: 'Jane Smith',
          avatar: 'https://via.placeholder.com/40',
        },
        content: 'I just transferred the rent for this month.',
        timestamp: '2023-06-14T15:30:00Z',
        read: true,
      },
      {
        id: 'msg6',
        conversationId: 'conv2',
        sender: {
          id: 'user1', // Current user
          name: 'Current User',
          avatar: 'https://via.placeholder.com/40',
        },
        content: 'The rent has been paid. Thank you!',
        timestamp: '2023-06-14T15:45:00Z',
        read: true,
      },
    ],
    conv3: [
      {
        id: 'msg7',
        conversationId: 'conv3',
        sender: {
          id: 'user4', // Robert Johnson (admin)
          name: 'Robert Johnson',
          avatar: 'https://via.placeholder.com/40',
        },
        content: 'We have reviewed your account information.',
        timestamp: '2023-06-10T09:00:00Z',
        read: true,
      },
      {
        id: 'msg8',
        conversationId: 'conv3',
        sender: {
          id: 'user4', // Robert Johnson (admin)
          name: 'Robert Johnson',
          avatar: 'https://via.placeholder.com/40',
        },
        content: 'Your account has been verified successfully.',
        timestamp: '2023-06-10T09:20:00Z',
        read: true,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 h-[70vh]">
        {/* Conversation List */}
        <div className="md:col-span-1 border-r border-base-300">
          <div className="p-4 border-b border-base-300">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="input input-bordered w-full pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(70vh-80px)]">
            {filteredConversations.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No conversations found</p>
              </div>
            ) : (
              <ul>
                {filteredConversations.map((conversation) => (
                  <li 
                    key={conversation.id}
                    className={`border-b border-base-300 cursor-pointer hover:bg-base-200 ${
                      activeConversation?.id === conversation.id ? 'bg-base-200' : ''
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="flex items-center p-4">
                      <div className="avatar placeholder mr-3 relative">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                          {conversation.recipient.avatar ? (
                            <img src={conversation.recipient.avatar} alt={conversation.recipient.name} />
                          ) : (
                            <span>{conversation.recipient.name.charAt(0)}</span>
                          )}
                        </div>
                        {conversation.recipient.role && (
                          <span className={`absolute bottom-0 right-0 badge badge-xs badge-${getRoleBadgeColor(conversation.recipient.role)}`}>
                            {conversation.recipient.role.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-semibold truncate">{conversation.recipient.name}</h3>
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(conversation.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="badge badge-primary ml-2">{conversation.unreadCount}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Message Area */}
        <div className="md:col-span-2 flex flex-col h-full">
          {activeConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-base-300 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="avatar placeholder mr-3">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                      {activeConversation.recipient.avatar ? (
                        <img src={activeConversation.recipient.avatar} alt={activeConversation.recipient.name} />
                      ) : (
                        <span>{activeConversation.recipient.name.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{activeConversation.recipient.name}</h3>
                    <p className="text-xs text-gray-500">
                      {activeConversation.recipient.role}
                    </p>
                  </div>
                </div>
                <div className="dropdown dropdown-end">
                  <button tabIndex={0} className="btn btn-ghost btn-circle">
                    <FaEllipsisV />
                  </button>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Mark as Unread</a></li>
                    <li><a>Block User</a></li>
                    <li><a className="text-error">Delete Conversation</a></li>
                  </ul>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-base-200">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isCurrentUser = message.sender.id === user.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                            {!isCurrentUser && (
                              <div className="avatar placeholder mr-2">
                                <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                  {message.sender.avatar ? (
                                    <img src={message.sender.avatar} alt={message.sender.name} />
                                  ) : (
                                    <span>{message.sender.name.charAt(0)}</span>
                                  )}
                                </div>
                              </div>
                            )}
                            <div
                              className={`max-w-xs mx-2 px-4 py-2 rounded-lg ${
                                isCurrentUser
                                  ? 'bg-primary text-primary-content rounded-br-none'
                                  : 'bg-base-100 rounded-bl-none'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-content opacity-60' : 'text-gray-500'}`}>
                                {formatTimestamp(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-base-300">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <button
                    type="button"
                    className="btn btn-circle btn-ghost btn-sm mr-2"
                    title="Attach image"
                  >
                    <FaImage />
                  </button>
                  <button
                    type="button"
                    className="btn btn-circle btn-ghost btn-sm mr-2"
                    title="Attach file"
                  >
                    <FaFile />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="input input-bordered flex-1 mr-2"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-circle"
                    disabled={!newMessage.trim() || isSending}
                  >
                    {isSending ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <FaPaperPlane />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-center p-8">
              <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
              <p className="text-gray-500 mb-6">Choose a conversation from the list to start messaging</p>
              <img 
                src="https://via.placeholder.com/200?text=Select+a+Chat" 
                alt="Select a conversation" 
                className="opacity-50 w-32 h-32 object-contain mb-4"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get badge color based on role
const getRoleBadgeColor = (role) => {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return 'error';
    case 'LANDLORD':
      return 'primary';
    case 'TENANT':
      return 'success';
    default:
      return 'info';
  }
};

export default Messenger; 