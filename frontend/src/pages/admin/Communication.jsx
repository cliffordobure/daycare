import React, { useState, useEffect } from "react";
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Communication = () => {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  useEffect(() => {
    const mockCommunications = [
      {
        id: 1,
        type: "announcement",
        title: "Important Update: New Safety Protocols",
        content:
          "We have implemented new safety protocols effective immediately...",
        sender: "Admin Team",
        recipients: ["All Staff", "All Parents"],
        status: "sent",
        priority: "high",
        createdAt: "2024-01-15T10:00:00Z",
        readBy: 45,
        totalRecipients: 67,
      },
      {
        id: 2,
        type: "reminder",
        title: "Parent-Teacher Conference Reminder",
        content:
          "Don't forget about the upcoming parent-teacher conferences...",
        sender: "Principal Smith",
        recipients: ["All Parents"],
        status: "scheduled",
        priority: "medium",
        createdAt: "2024-01-14T14:30:00Z",
        scheduledFor: "2024-01-20T09:00:00Z",
        readBy: 0,
        totalRecipients: 45,
      },
      {
        id: 3,
        type: "notification",
        title: "New Activity Program Available",
        content:
          "We're excited to announce our new after-school activity program...",
        sender: "Activities Coordinator",
        recipients: ["All Parents"],
        status: "draft",
        priority: "low",
        createdAt: "2024-01-13T16:45:00Z",
        readBy: 0,
        totalRecipients: 45,
      },
    ];

    setTimeout(() => {
      setCommunications(mockCommunications);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case "announcement":
        return <EnvelopeIcon className="h-5 w-5 text-blue-600" />;
      case "reminder":
        return <CalendarIcon className="h-5 w-5 text-yellow-600" />;
      case "notification":
        return <UserGroupIcon className="h-5 w-5 text-green-600" />;
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

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredCommunications = communications.filter((comm) => {
    const matchesFilter = filter === "all" || comm.type === filter;
    const matchesSearch =
      comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this communication?")) {
      setCommunications(communications.filter((comm) => comm.id !== id));
    }
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Communication Management
        </h1>
        <p className="text-gray-600">
          Manage announcements, reminders, and notifications
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowNewForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
            New Communication
          </button>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="announcement">Announcements</option>
            <option value="reminder">Reminders</option>
            <option value="notification">Notifications</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search communications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Communications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCommunications.map((comm) => (
                <tr key={comm.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(comm.type)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {comm.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {comm.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {comm.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comm.sender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {comm.recipients.join(", ")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {comm.readBy}/{comm.totalRecipients} read
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        comm.status
                      )}`}
                    >
                      {comm.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        comm.priority
                      )}`}
                    >
                      {comm.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(comm.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedCommunication(comm)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setSelectedCommunication(comm)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(comm.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Communication Form Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                New Communication
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="announcement">Announcement</option>
                    <option value="reminder">Reminder</option>
                    <option value="notification">Notification</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter content"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipients
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="all-staff">All Staff</option>
                    <option value="all-parents">All Parents</option>
                    <option value="specific-class">Specific Class</option>
                    <option value="specific-users">Specific Users</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
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

      {/* Communication Details Modal */}
      {selectedCommunication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Communication Details
                </h3>
                <button
                  onClick={() => setSelectedCommunication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Type:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 capitalize">
                    {selectedCommunication.type}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Title:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedCommunication.title}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Content:
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedCommunication.content}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Sender:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedCommunication.sender}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Recipients:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedCommunication.recipients.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Status:
                  </span>
                  <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedCommunication.status
                    )}`}
                  >
                    {selectedCommunication.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Priority:
                  </span>
                  <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                      selectedCommunication.priority
                    )}`}
                  >
                    {selectedCommunication.priority}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Created:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {new Date(selectedCommunication.createdAt).toLocaleString()}
                  </span>
                </div>
                {selectedCommunication.scheduledFor && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Scheduled for:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {new Date(
                        selectedCommunication.scheduledFor
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Read by:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedCommunication.readBy}/
                    {selectedCommunication.totalRecipients}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;
