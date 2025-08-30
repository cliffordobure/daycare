import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  AcademicCapIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Activities = () => {
  const { user } = useSelector((state) => state.auth);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  // Mock data for now
  useEffect(() => {
    setTimeout(() => {
      setActivities([
        {
          id: 1,
          name: "Art & Craft Session",
          description: "Creative painting and drawing session for preschoolers",
          className: "Preschool A",
          teacher: "Sarah Wilson",
          date: "2024-12-10",
          startTime: "9:00 AM",
          endTime: "10:30 AM",
          duration: "1.5 hours",
          status: "completed",
          location: "Art Room",
          maxParticipants: 15,
          currentParticipants: 12,
          materials: ["Paint", "Brushes", "Paper", "Easels", "Aprons"],
          skills: [
            "Creativity",
            "Fine Motor",
            "Color Recognition",
            "Self-Expression",
          ],
          objectives: [
            "Develop artistic skills",
            "Enhance creativity",
            "Improve fine motor coordination",
          ],
          notes:
            "Excellent participation from all children. Emma and Lucas showed exceptional creativity.",
          photos: [],
          assessment: "All objectives met successfully",
          nextSteps: "Continue with advanced painting techniques next week",
        },
        {
          id: 2,
          name: "Story Time & Reading",
          description: "Interactive reading and storytelling session",
          className: "Preschool A",
          teacher: "Sarah Wilson",
          date: "2024-12-10",
          startTime: "10:30 AM",
          endTime: "11:00 AM",
          duration: "30 minutes",
          status: "completed",
          location: "Reading Corner",
          maxParticipants: 15,
          currentParticipants: 15,
          materials: ["Story Books", "Puppets", "Cushions", "Picture Cards"],
          skills: [
            "Language Development",
            "Listening",
            "Imagination",
            "Vocabulary",
          ],
          objectives: [
            "Improve listening skills",
            "Expand vocabulary",
            "Foster love for reading",
          ],
          notes:
            "Children were engaged throughout. Great questions and discussions.",
          photos: [],
          assessment: "Objectives fully achieved",
          nextSteps: "Introduce more complex stories next session",
        },
        {
          id: 3,
          name: "Outdoor Play & Games",
          description: "Physical activities and games in the playground",
          className: "Preschool A",
          teacher: "Sarah Wilson",
          date: "2024-12-10",
          startTime: "2:00 PM",
          endTime: "3:00 PM",
          duration: "1 hour",
          status: "upcoming",
          location: "Playground",
          maxParticipants: 15,
          currentParticipants: 0,
          materials: ["Balls", "Hula Hoops", "Jump Ropes", "Cones"],
          skills: ["Gross Motor", "Coordination", "Social Skills", "Teamwork"],
          objectives: [
            "Improve physical coordination",
            "Develop social skills",
            "Encourage teamwork",
          ],
          notes: "",
          photos: [],
          assessment: "",
          nextSteps: "",
        },
        {
          id: 4,
          name: "Math & Numbers",
          description: "Basic mathematics and number recognition activities",
          className: "Kindergarten B",
          teacher: "Michael Chen",
          date: "2024-12-10",
          startTime: "9:00 AM",
          endTime: "10:00 AM",
          duration: "1 hour",
          status: "completed",
          location: "Classroom",
          maxParticipants: 18,
          currentParticipants: 16,
          materials: [
            "Number Blocks",
            "Counting Cards",
            "Worksheets",
            "Manipulatives",
          ],
          skills: [
            "Mathematics",
            "Problem Solving",
            "Critical Thinking",
            "Number Recognition",
          ],
          objectives: [
            "Learn number recognition",
            "Practice counting",
            "Develop problem-solving skills",
          ],
          notes:
            "Lucas excelled in today's activities. Some children need more practice with larger numbers.",
          photos: [],
          assessment:
            "Most objectives met, some children need additional support",
          nextSteps: "Provide extra practice materials for struggling students",
        },
        {
          id: 5,
          name: "Science Discovery Lab",
          description: "Hands-on science experiments and learning",
          className: "Kindergarten B",
          teacher: "Michael Chen",
          date: "2024-12-10",
          startTime: "1:00 PM",
          endTime: "2:00 PM",
          duration: "1 hour",
          status: "upcoming",
          location: "Science Lab",
          maxParticipants: 18,
          currentParticipants: 0,
          materials: [
            "Microscopes",
            "Test Tubes",
            "Safety Goggles",
            "Simple Chemicals",
          ],
          skills: [
            "Scientific Method",
            "Observation",
            "Curiosity",
            "Safety Awareness",
          ],
          objectives: [
            "Introduce scientific concepts",
            "Teach safety procedures",
            "Encourage curiosity",
          ],
          notes: "",
          photos: [],
          assessment: "",
          nextSteps: "",
        },
        {
          id: 6,
          name: "Music & Movement",
          description: "Rhythm, singing, and dance activities",
          className: "Toddler A",
          teacher: "Jessica Brown",
          date: "2024-12-10",
          startTime: "10:00 AM",
          endTime: "10:45 AM",
          duration: "45 minutes",
          status: "completed",
          location: "Music Room",
          maxParticipants: 12,
          currentParticipants: 8,
          materials: ["Musical Instruments", "CD Player", "Props", "Mats"],
          skills: ["Rhythm", "Coordination", "Listening", "Expression"],
          objectives: [
            "Develop rhythm awareness",
            "Improve coordination",
            "Encourage self-expression",
          ],
          notes:
            "Toddlers loved the musical instruments. Aiden was particularly engaged.",
          photos: [],
          assessment: "Objectives achieved with high engagement",
          nextSteps: "Introduce more complex rhythms next time",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "upcoming":
        return "text-blue-600 bg-blue-100";
      case "in-progress":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "postponed":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "upcoming":
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case "in-progress":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case "postponed":
        return <ExclamationTriangleIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getParticipationRate = (current, max) => {
    return max > 0 ? Math.round((current / max) * 100) : 0;
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || activity.className === selectedClass;
    const matchesStatus =
      selectedStatus === "all" || activity.status === selectedStatus;
    const matchesDate = !selectedDate || activity.date === selectedDate;

    return matchesSearch && matchesClass && matchesStatus && matchesDate;
  });

  const uniqueClasses = [
    ...new Set(activities.map((activity) => activity.className)),
  ];
  const uniqueStatuses = [
    ...new Set(activities.map((activity) => activity.status)),
  ];

  const getActivityStats = () => {
    const total = activities.length;
    const completed = activities.filter((a) => a.status === "completed").length;
    const upcoming = activities.filter((a) => a.status === "upcoming").length;
    const inProgress = activities.filter(
      (a) => a.status === "in-progress"
    ).length;

    return { total, completed, upcoming, inProgress };
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setShowAddModal(true);
  };

  const handleDelete = (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      setActivities(
        activities.filter((activity) => activity.id !== activityId)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getActivityStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Activities Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track all educational activities across all classes
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Activity
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by activity name or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedClass("all");
              setSelectedStatus("all");
              setSelectedDate("");
            }}
            className="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">
                Total Activities
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.upcoming}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.inProgress}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Activities List</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills & Materials
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assessment & Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {activity.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.className}
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.teacher}
                        </div>
                        <div className="flex items-center mt-1">
                          {getStatusIcon(activity.status)}
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              activity.status
                            )}`}
                          >
                            {activity.status.charAt(0).toUpperCase() +
                              activity.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.startTime} - {activity.endTime}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.duration}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.location}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {activity.currentParticipants} /{" "}
                      {activity.maxParticipants}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${getParticipationRate(
                            activity.currentParticipants,
                            activity.maxParticipants
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {getParticipationRate(
                        activity.currentParticipants,
                        activity.maxParticipants
                      )}
                      % participation
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 mb-2">Skills:</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {activity.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {activity.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          +{activity.skills.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-900 mb-2">Materials:</div>
                    <div className="flex flex-wrap gap-1">
                      {activity.materials.slice(0, 2).map((material, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {material}
                        </span>
                      ))}
                      {activity.materials.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          +{activity.materials.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {activity.notes && (
                      <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded mb-2">
                        {activity.notes}
                      </div>
                    )}
                    {activity.assessment && (
                      <div className="text-sm text-gray-900 mb-1">
                        <strong>Assessment:</strong> {activity.assessment}
                      </div>
                    )}
                    {activity.nextSteps && (
                      <div className="text-sm text-gray-700">
                        <strong>Next Steps:</strong> {activity.nextSteps}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          /* View details */
                        }}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="text-red-600 hover:text-red-900 p-1"
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

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No activities found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingActivity ? "Edit Activity" : "Add New Activity"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {editingActivity
                  ? "Update activity information"
                  : "Enter new activity details"}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingActivity(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingActivity ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
