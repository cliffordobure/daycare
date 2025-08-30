import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const TeacherActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockActivities = [
      {
        id: 1,
        name: "Morning Circle Time",
        description:
          "Daily morning gathering for songs, stories, and group activities to start the day positively",
        category: "daily",
        duration: "30 minutes",
        time: "8:30 AM",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        materials: [
          "Story books",
          "Musical instruments",
          "Visual aids",
          "Calendar",
        ],
        objectives: [
          "Social interaction",
          "Language development",
          "Listening skills",
          "Routine building",
        ],
        ageGroup: "3-5 years",
        maxParticipants: 20,
        status: "active",
        lastConducted: "2024-12-10",
        nextScheduled: "2024-12-11",
        notes:
          "Children respond well to interactive songs. Consider adding more movement activities.",
        outcomes: [
          "Improved group participation",
          "Better listening skills",
          "Enhanced social interaction",
        ],
        photos: [],
      },
      {
        id: 2,
        name: "Art & Craft Workshop",
        description:
          "Creative activities using various art materials to develop fine motor skills and creativity",
        category: "weekly",
        duration: "45 minutes",
        time: "10:00 AM",
        days: ["Tuesday", "Thursday"],
        materials: [
          "Paint",
          "Paper",
          "Scissors",
          "Glue",
          "Crayons",
          "Markers",
          "Construction paper",
        ],
        objectives: [
          "Fine motor skills",
          "Creativity",
          "Self-expression",
          "Color recognition",
        ],
        ageGroup: "3-6 years",
        maxParticipants: 15,
        status: "active",
        lastConducted: "2024-12-09",
        nextScheduled: "2024-12-12",
        notes:
          "Supervision needed with scissors. Consider pre-cutting some materials for younger children.",
        outcomes: [
          "Enhanced creativity",
          "Improved fine motor skills",
          "Better color recognition",
        ],
        photos: [],
      },
      {
        id: 3,
        name: "Outdoor Play & Physical Activities",
        description:
          "Physical activities and games in the playground to develop gross motor skills and social play",
        category: "daily",
        duration: "40 minutes",
        time: "11:00 AM",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        materials: [
          "Balls",
          "Hula hoops",
          "Jump ropes",
          "Playground equipment",
          "Cones",
        ],
        objectives: [
          "Physical development",
          "Gross motor skills",
          "Social play",
          "Teamwork",
        ],
        ageGroup: "3-6 years",
        maxParticipants: 20,
        status: "active",
        lastConducted: "2024-12-10",
        nextScheduled: "2024-12-11",
        notes:
          "Weather dependent. Have indoor alternatives ready for rainy days.",
        outcomes: [
          "Improved physical coordination",
          "Better social skills",
          "Enhanced teamwork",
        ],
        photos: [],
      },
      {
        id: 4,
        name: "Science Discovery Hour",
        description:
          "Hands-on science experiments to foster curiosity and critical thinking",
        category: "weekly",
        duration: "50 minutes",
        time: "2:00 PM",
        days: ["Wednesday"],
        materials: [
          "Magnifying glasses",
          "Simple lab equipment",
          "Natural materials",
          "Science books",
        ],
        objectives: [
          "Critical thinking",
          "Curiosity",
          "Observation skills",
          "Scientific method basics",
        ],
        ageGroup: "4-6 years",
        maxParticipants: 12,
        status: "active",
        lastConducted: "2024-12-04",
        nextScheduled: "2024-12-11",
        notes:
          "Children love the magnifying glasses. Plan more nature-based experiments.",
        outcomes: [
          "Increased curiosity",
          "Better observation skills",
          "Enhanced critical thinking",
        ],
        photos: [],
      },
      {
        id: 5,
        name: "Music & Movement",
        description:
          "Interactive music sessions with movement to develop rhythm and coordination",
        category: "weekly",
        duration: "35 minutes",
        time: "9:30 AM",
        days: ["Monday", "Wednesday", "Friday"],
        materials: [
          "CD player",
          "Musical instruments",
          "Props",
          "Movement cards",
        ],
        objectives: [
          "Rhythm development",
          "Coordination",
          "Musical appreciation",
          "Creative movement",
        ],
        ageGroup: "3-6 years",
        maxParticipants: 18,
        status: "active",
        lastConducted: "2024-12-09",
        nextScheduled: "2024-12-11",
        notes:
          "Children respond well to familiar songs. Introduce new songs gradually.",
        outcomes: [
          "Improved rhythm",
          "Better coordination",
          "Enhanced musical appreciation",
        ],
        photos: [],
      },
    ];

    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "daily":
        return <CalendarIcon className="h-5 w-5 text-blue-600" />;
      case "weekly":
        return <ClockIcon className="h-5 w-5 text-green-600" />;
      case "monthly":
        return <ChartBarIcon className="h-5 w-5 text-purple-600" />;
      case "special":
        return <StarIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "daily":
        return "bg-blue-100 text-blue-800";
      case "weekly":
        return "bg-green-100 text-green-800";
      case "monthly":
        return "bg-purple-100 text-purple-800";
      case "special":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || activity.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || activity.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddActivity = () => {
    setShowAddModal(true);
  };

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setShowDetailsModal(true);
  };

  const handleDeleteActivity = (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      setActivities(activities.filter((activity) => activity.id !== id));
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
          Class Activities
        </h1>
        <p className="text-gray-600">
          Plan, manage, and track classroom activities and learning experiences
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddActivity}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Activity
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="special">Special</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getCategoryIcon(activity.category)}
                  <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                      activity.category
                    )}`}
                  >
                    {activity.category}
                  </span>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    activity.status
                  )}`}
                >
                  {activity.status}
                </span>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activity.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {activity.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">
                    {activity.duration}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{activity.time}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {activity.ageGroup} • Max {activity.maxParticipants}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {activity.days.join(", ")}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Next: {new Date(activity.nextScheduled).toLocaleDateString()}
                </div>
              </div>

              {/* Objectives Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Objectives
                </h4>
                <div className="flex flex-wrap gap-1">
                  {activity.objectives.slice(0, 3).map((objective, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {objective}
                    </span>
                  ))}
                  {activity.objectives.length > 3 && (
                    <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{activity.objectives.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDetails(activity)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  View Details
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteActivity(activity.id)}
                  className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Activities
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Daily Activities
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter((a) => a.category === "daily").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Activities
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter((a) => a.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  activities.filter((a) =>
                    a.days.some((day) =>
                      [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ].includes(day)
                    )
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Activity
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter activity name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter activity description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select category</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="special">Special</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 30 minutes"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="20"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Add Activity
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {showDetailsModal && selectedActivity && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Activity Details: {selectedActivity.name}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Basic Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Name:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedActivity.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Description:
                      </span>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedActivity.description}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Category:
                      </span>
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {selectedActivity.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Duration:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedActivity.duration}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Time:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedActivity.time}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Days:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedActivity.days.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Requirements & Objectives */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Requirements & Objectives
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Age Group:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedActivity.ageGroup}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Max Participants:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedActivity.maxParticipants}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Status:
                      </span>
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          selectedActivity.status
                        )}`}
                      >
                        {selectedActivity.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Objectives:
                      </span>
                      <div className="mt-2 space-y-1">
                        {selectedActivity.objectives.map((objective, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                            {objective}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Materials Needed
                  </h4>
                  <div className="space-y-2">
                    {selectedActivity.materials.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <AcademicCapIcon className="h-4 w-4 mr-2 text-blue-500" />
                        {material}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule & Outcomes */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Schedule & Outcomes
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Last Conducted:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {new Date(
                          selectedActivity.lastConducted
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Next Scheduled:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {new Date(
                          selectedActivity.nextScheduled
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Expected Outcomes:
                      </span>
                      <div className="mt-2 space-y-1">
                        {selectedActivity.outcomes.map((outcome, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <ChartBarIcon className="h-4 w-4 mr-2 text-purple-500" />
                            {outcome}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="lg:col-span-2">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Teacher Notes
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedActivity.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add missing StarIcon component
const StarIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

export default TeacherActivities;
