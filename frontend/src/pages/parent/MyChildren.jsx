import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  UserCircleIcon,
  CalendarIcon,
  HeartIcon,
  AcademicCapIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const MyChildren = () => {
  const { user } = useSelector((state) => state.auth);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now - this will be replaced with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChildren([
        {
          id: 1,
          name: "Emma Johnson",
          age: 4,
          photo: null, // Will be replaced with actual photo URL
          class: "Preschool A",
          teacher: "Sarah Wilson",
          status: "present",
          lastCheckIn: "8:30 AM",
          healthStatus: "healthy",
          attendance: {
            present: 18,
            absent: 2,
            total: 20,
          },
          activities: [
            { name: "Art Class", time: "9:00 AM", status: "completed" },
            { name: "Story Time", time: "10:30 AM", status: "completed" },
            { name: "Outdoor Play", time: "2:00 PM", status: "upcoming" },
          ],
          emergencyContact: {
            name: "John Johnson",
            relationship: "Father",
            phone: "+1 (555) 123-4567",
            email: "john.johnson@email.com",
          },
        },
        {
          id: 2,
          name: "Lucas Johnson",
          age: 6,
          photo: null,
          class: "Kindergarten B",
          teacher: "Michael Chen",
          status: "present",
          lastCheckIn: "8:15 AM",
          healthStatus: "healthy",
          attendance: {
            present: 19,
            absent: 1,
            total: 20,
          },
          activities: [
            { name: "Math Class", time: "9:00 AM", status: "completed" },
            { name: "Reading", time: "10:00 AM", status: "completed" },
            { name: "Science", time: "1:00 PM", status: "upcoming" },
          ],
          emergencyContact: {
            name: "John Johnson",
            relationship: "Father",
            phone: "+1 (555) 123-4567",
            email: "john.johnson@email.com",
          },
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "text-green-600 bg-green-100";
      case "absent":
        return "text-red-600 bg-red-100";
      case "late":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "attention":
        return "text-yellow-600 bg-yellow-100";
      case "alert":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
        <p className="text-gray-600 mt-2">
          Manage and monitor your children's information, attendance, and
          activities
        </p>
      </div>

      {/* Children List */}
      <div className="space-y-6">
        {children.map((child) => (
          <div
            key={child.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            {/* Child Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {child.photo ? (
                    <img
                      src={child.photo}
                      alt={child.name}
                      className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg">
                      <UserCircleIcon className="h-12 w-12 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {child.name}
                  </h2>
                  <p className="text-gray-600">{child.age} years old</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        child.status
                      )}`}
                    >
                      {child.status.charAt(0).toUpperCase() +
                        child.status.slice(1)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthStatusColor(
                        child.healthStatus
                      )}`}
                    >
                      {child.healthStatus.charAt(0).toUpperCase() +
                        child.healthStatus.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last Check-in</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {child.lastCheckIn}
                  </p>
                </div>
              </div>
            </div>

            {/* Child Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Class Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                    Class Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class:</span>
                      <span className="font-medium">{child.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Teacher:</span>
                      <span className="font-medium">{child.teacher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendance:</span>
                      <span className="font-medium">
                        {child.attendance.present}/{child.attendance.total} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Today's Activities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CalendarIcon className="h-5 w-5 text-green-600 mr-2" />
                    Today's Activities
                  </h3>
                  <div className="space-y-2">
                    {child.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600">
                          {activity.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {activity.time}
                          </span>
                          {activity.status === "completed" ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          ) : activity.status === "upcoming" ? (
                            <ClockIcon className="h-4 w-4 text-blue-600" />
                          ) : (
                            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <PhoneIcon className="h-5 w-5 text-red-600 mr-2" />
                    Emergency Contact
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {child.emergencyContact.name}
                      </p>
                      <p className="text-gray-600">
                        {child.emergencyContact.relationship}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        {child.emergencyContact.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        {child.emergencyContact.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Full Profile
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    View Attendance
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    View Activities
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    Health Records
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Child Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <button className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
          <div className="flex items-center justify-center space-x-2">
            <UserCircleIcon className="h-6 w-6" />
            <span className="font-medium">Add Another Child</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MyChildren;
