import React, { useState, useEffect } from "react";
import {
  BellIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const TeacherMessages = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("conversations");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessageText, setNewMessageText] = useState("");

  // Mock data for demonstration
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        type: "parent",
        participants: ["Sarah Wilson", "John Johnson"],
        lastMessage: "Thank you for the update on Emma's progress!",
        lastMessageTime: "2024-12-10T14:30:00Z",
        unreadCount: 2,
        status: "active",
        childName: "Emma Johnson",
        className: "Preschool A",
        messages: [
          {
            id: 1,
            sender: "John Johnson",
            content: "Hi Sarah, how is Emma doing in class?",
            timestamp: "2024-12-10T10:00:00Z",
            isRead: true,
          },
          {
            id: 2,
            sender: "Sarah Wilson",
            content:
              "Hi John! Emma is doing wonderfully. She's very engaged in our activities and has made great progress with her social skills.",
            timestamp: "2024-12-10T10:15:00Z",
            isRead: true,
          },
          {
            id: 3,
            sender: "John Johnson",
            content:
              "That's great to hear! Any areas we should work on at home?",
            timestamp: "2024-12-10T11:00:00Z",
            isRead: true,
          },
          {
            id: 4,
            sender: "Sarah Wilson",
            content:
              "She could benefit from some additional practice with fine motor skills. We're working on writing and drawing in class.",
            timestamp: "2024-12-10T11:30:00Z",
            isRead: true,
          },
          {
            id: 5,
            sender: "John Johnson",
            content: "Thank you for the update on Emma's progress!",
            timestamp: "2024-12-10T14:30:00Z",
            isRead: false,
          },
        ],
      },
      {
        id: 2,
        type: "staff",
        participants: ["Sarah Wilson", "Michael Chen", "Emily Davis"],
        lastMessage: "Don't forget about the staff meeting tomorrow at 3 PM.",
        lastMessageTime: "2024-12-10T13:45:00Z",
        unreadCount: 0,
        status: "active",
        subject: "Staff Meeting Reminder",
        messages: [
          {
            id: 1,
            sender: "Michael Chen",
            content:
              "Hi team, just a reminder about our staff meeting tomorrow.",
            timestamp: "2024-12-10T13:30:00Z",
            isRead: true,
          },
          {
            id: 2,
            sender: "Emily Davis",
            content: "Thanks for the reminder! What time is it again?",
            timestamp: "2024-12-10T13:35:00Z",
            isRead: true,
          },
          {
            id: 3,
            sender: "Michael Chen",
            content: "Don't forget about the staff meeting tomorrow at 3 PM.",
            timestamp: "2024-12-10T13:45:00Z",
            isRead: true,
          },
        ],
      },
      {
        id: 3,
        type: "parent",
        participants: ["Sarah Wilson", "Carlos Rodriguez"],
        lastMessage: "Sophia is excited about the upcoming field trip!",
        lastMessageTime: "2024-12-09T16:20:00Z",
        unreadCount: 0,
        status: "active",
        childName: "Sophia Rodriguez",
        className: "Preschool B",
        messages: [
          {
            id: 1,
            sender: "Carlos Rodriguez",
            content:
              "Hi Sarah, Sophia mentioned there's a field trip coming up?",
            timestamp: "2024-12-09T15:00:00Z",
            isRead: true,
          },
          {
            id: 2,
            sender: "Sarah Wilson",
            content:
              "Yes! We're planning a trip to the local library next week. I'll send out the details soon.",
            timestamp: "2024-12-09T15:30:00Z",
            isRead: true,
          },
          {
            id: 3,
            sender: "Carlos Rodriguez",
            content: "Sophia is excited about the upcoming field trip!",
            timestamp: "2024-12-09T16:20:00Z",
            isRead: true,
          },
        ],
      },
    ];

    const mockMessages = [
      {
        id: 1,
        type: "announcement",
        title: "Field Trip Permission Slips Due",
        content:
          "Please return the field trip permission slips by Friday. The trip is scheduled for next Tuesday.",
        sender: "Principal Smith",
        recipients: ["All Teachers"],
        timestamp: "2024-12-10T09:00:00Z",
        priority: "high",
        isRead: false,
      },
      {
        id: 2,
        type: "reminder",
        title: "Monthly Reports Due",
        content:
          "Monthly progress reports are due by the end of this week. Please submit them through the portal.",
        sender: "Admin Team",
        recipients: ["All Teachers"],
        timestamp: "2024-12-09T14:00:00Z",
        priority: "medium",
        isRead: true,
      },
      {
        id: 3,
        type: "notification",
        title: "New Curriculum Resources Available",
        content:
          "New curriculum resources have been added to the teacher portal. Check them out when you have time.",
        sender: "Curriculum Team",
        recipients: ["All Teachers"],
        timestamp: "2024-12-08T11:00:00Z",
        priority: "low",
        isRead: true,
      },
    ];

    setTimeout(() => {
      setConversations(mockConversations);
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case "parent":
        return <UserIcon className="h-5 w-5 text-blue-600" />;
      case "staff":
        return <UserGroupIcon className="h-5 w-5 text-green-600" />;
      case "announcement":
        return <BellIcon className="h-5 w-5 text-yellow-600" />;
      case "reminder":
        return <CalendarIcon className="h-5 w-5 text-purple-600" />;
      case "notification":
        return <EnvelopeIcon className="h-5 w-5 text-indigo-600" />;
      default:
        return <EnvelopeIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.participants.some((participant) =>
        participant.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      (conv.childName &&
        conv.childName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleNewMessage = () => {
    setShowNewMessageModal(true);
  };

  const handleSendMessage = () => {
    if (newMessageText.trim() && selectedConversation) {
      const newMessage = {
        id: Date.now(),
        sender: "Sarah Wilson",
        content: newMessageText,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      const updatedConversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage],
        lastMessage: newMessageText,
        lastMessageTime: newMessage.timestamp,
        unreadCount: selectedConversation.unreadCount + 1,
      };

      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation.id ? updatedConversation : conv
        )
      );
      setNewMessageText("");
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Mark messages as read
    const updatedConversation = {
      ...conversation,
      unreadCount: 0,
      messages: conversation.messages.map((msg) => ({ ...msg, isRead: true })),
    };
    setConversations(
      conversations.map((conv) =>
        conv.id === conversation.id ? updatedConversation : conv
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">
          Communicate with parents and staff members
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleNewMessage}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Message
          </button>

          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setSelectedTab("conversations")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                selectedTab === "conversations"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Conversations
            </button>
            <button
              onClick={() => setSelectedTab("messages")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                selectedTab === "messages"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Announcements
            </button>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations/Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedTab === "conversations"
                  ? "Conversations"
                  : "Announcements"}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {selectedTab === "conversations"
                ? filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "bg-blue-50 border-r-2 border-blue-600"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          {getTypeIcon(conversation.type)}
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {conversation.type === "parent"
                              ? conversation.childName
                              : conversation.subject || "Staff Chat"}
                          </span>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(
                          conversation.lastMessageTime
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                : filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !message.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          {getTypeIcon(message.type)}
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {message.title}
                          </span>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                            message.priority
                          )}`}
                        >
                          {message.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="bg-white rounded-lg shadow h-96 flex flex-col">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedConversation.type === "parent"
                        ? selectedConversation.childName
                        : selectedConversation.subject || "Staff Chat"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.participants.join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "Sarah Wilson"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === "Sarah Wilson"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "Sarah Wilson"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow h-96 flex items-center justify-center">
              <div className="text-center">
                <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No conversation selected
                </h3>
                <p className="text-gray-500">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                New Message
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select recipient type</option>
                    <option value="parent">Parent</option>
                    <option value="staff">Staff Member</option>
                    <option value="all">All Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select recipient</option>
                    <option value="john-johnson">
                      John Johnson (Emma's Parent)
                    </option>
                    <option value="carlos-rodriguez">
                      Carlos Rodriguez (Sophia's Parent)
                    </option>
                    <option value="michael-chen">Michael Chen (Teacher)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your message"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewMessageModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMessages;
