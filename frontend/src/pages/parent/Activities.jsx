import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const Activities = () => {
  const { user } = useSelector((state) => state.auth);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  // Mock data for now
  useEffect(() => {
    setTimeout(() => {
      setActivities([
        {
          id: 1,
          childName: "Emma Johnson",
          className: "Preschool A",
          activityName: "Art & Craft",
          description: "Creative painting and drawing session",
          date: "2024-12-10",
          time: "9:00 AM - 10:30 AM",
          duration: "1.5 hours",
          status: "completed",
          participation: "excellent",
          teacher: "Sarah Wilson",
          location: "Art Room",
          materials: ["Paint", "Brushes", "Paper", "Easels"],
          skills: ["Creativity", "Fine Motor", "Color Recognition"],
          notes:
            "Emma showed great enthusiasm and creativity. Her painting skills are improving significantly.",
          photos: [],
        },
        {
          id: 2,
          childName: "Emma Johnson",
          className: "Preschool A",
          activityName: "Story Time",
          description: "Interactive reading and storytelling",
          date: "2024-12-10",
          time: "10:30 AM - 11:00 AM",
          duration: "30 minutes",
          status: "completed",
          participation: "good",
          teacher: "Sarah Wilson",
          location: "Reading Corner",
          materials: ["Story Books", "Puppets", "Cushions"],
          skills: ["Language", "Listening", "Imagination"],
          notes:
            "Emma was engaged and participated well in the story discussion.",
          photos: [],
        },
        {
          id: 3,
          childName: "Emma Johnson",
          className: "Preschool A",
          activityName: "Outdoor Play",
          description: "Physical activities and games in the playground",
          date: "2024-12-10",
          time: "2:00 PM - 3:00 PM",
          duration: "1 hour",
          status: "upcoming",
          participation: null,
          teacher: "Sarah Wilson",
          location: "Playground",
          materials: ["Balls", "Hula Hoops", "Jump Ropes"],
          skills: ["Gross Motor", "Coordination", "Social Skills"],
          notes: "",
          photos: [],
        },
        {
          id: 4,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          activityName: "Math Class",
          description: "Basic mathematics and number recognition",
          date: "2024-12-10",
          time: "9:00 AM - 10:00 AM",
          duration: "1 hour",
          status: "completed",
          participation: "excellent",
          teacher: "Michael Chen",
          location: "Classroom",
          materials: ["Number Blocks", "Counting Cards", "Worksheets"],
          skills: ["Mathematics", "Problem Solving", "Critical Thinking"],
          notes:
            "Lucas excelled in today's math activities. He quickly grasped the new concepts.",
          photos: [],
        },
        {
          id: 5,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          activityName: "Reading Session",
          description: "Phonics and reading practice",
          date: "2024-12-10",
          time: "10:00 AM - 11:00 AM",
          duration: "1 hour",
          status: "completed",
          participation: "good",
          teacher: "Michael Chen",
          location: "Library",
          materials: ["Reading Books", "Phonics Cards", "Whiteboard"],
          skills: ["Reading", "Phonics", "Vocabulary"],
          notes:
            "Lucas is making steady progress in reading. He needs more practice with complex words.",
          photos: [],
        },
        {
          id: 6,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          activityName: "Science Discovery",
          description: "Hands-on science experiments and learning",
          date: "2024-12-10",
          time: "1:00 PM - 2:00 PM",
          duration: "1 hour",
          status: "upcoming",
          participation: null,
          teacher: "Michael Chen",
          location: "Science Lab",
          materials: ["Microscopes", "Test Tubes", "Safety Goggles"],
          skills: ["Scientific Method", "Observation", "Curiosity"],
          notes: "",
          photos: [],
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
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getParticipationColor = (participation) => {
    switch (participation) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "fair":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getParticipationIcon = (participation) => {
    switch (participation) {
      case "excellent":
        return <StarIcon className="h-5 w-5 text-green-600" />;
      case "good":
        return <CheckCircleIcon className="h-5 w-5 text-blue-600" />;
      case "fair":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case "poor":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (selectedChild !== "all" && activity.childName !== selectedChild)
      return false;
    if (selectedDate && activity.date !== selectedDate) return false;
    return true;
  });

  const uniqueChildren = [
    ...new Set(activities.map((activity) => activity.childName)),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Activities & Learning
        </h1>
        <p className="text-gray-600 mt-2">
          Track your children's daily activities, participation, and learning
          progress
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Child
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Children</option>
              {uniqueChildren.map((child) => (
                <option key={child} value={child}>
                  {child}
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
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <button
            onClick={() => {
              setSelectedChild("all");
              setSelectedDate("");
            }}
            className="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-6">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            {/* Activity Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activity.activityName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {activity.status.charAt(0).toUpperCase() +
                      activity.status.slice(1)}
                  </span>
                  {activity.participation && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getParticipationColor(
                        activity.participation
                      )}`}
                    >
                      {activity.participation.charAt(0).toUpperCase() +
                        activity.participation.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                    Schedule
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Child:</span>
                      <span className="font-medium">{activity.childName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class:</span>
                      <span className="font-medium">{activity.className}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{activity.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{activity.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Teacher & Location */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <UserGroupIcon className="h-5 w-5 text-green-600 mr-2" />
                    Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Teacher:</span>
                      <span className="font-medium">{activity.teacher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{activity.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{activity.status}</span>
                    </div>
                    {activity.participation && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Participation:</span>
                        <div className="flex items-center space-x-2">
                          {getParticipationIcon(activity.participation)}
                          <span className="font-medium">
                            {activity.participation}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills & Materials */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-purple-600 mr-2" />
                    Learning
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">
                        Skills Developed:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {activity.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Materials Used:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {activity.materials.map((material, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Notes */}
              {activity.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">
                    Teacher Notes
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {activity.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Photos
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Download Report
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Share with Family
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Ask Teacher
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Activities Message */}
      {filteredActivities.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No activities found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or check back later for new activities.
          </p>
        </div>
      )}
    </div>
  );
};

export default Activities;
