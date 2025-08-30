import React, { useState, useEffect } from "react";
import {
  UserIcon,
  AcademicCapIcon,
  HeartIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const ChildProfiles = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChild, setSelectedChild] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data for demonstration
  useEffect(() => {
    const mockChildren = [
      {
        id: 1,
        name: "Emma Johnson",
        age: 4,
        gender: "female",
        dateOfBirth: "2020-03-15",
        enrollmentDate: "2024-09-01",
        parentName: "John Johnson",
        parentPhone: "+1 (555) 123-4567",
        parentEmail: "john.johnson@email.com",
        emergencyContact: "Mary Johnson",
        emergencyPhone: "+1 (555) 987-6543",
        address: "123 Main St, Anytown, ST 12345",
        allergies: ["Peanuts", "Tree nuts"],
        medicalConditions: ["Asthma"],
        medications: ["EpiPen", "Inhaler"],
        dietaryRestrictions: ["No nuts", "Dairy free"],
        photo: null,
        attendance: { present: 18, absent: 2, total: 20 },
        lastCheckIn: "2024-12-10 8:30 AM",
        status: "active",
        notes:
          "Emma is a bright and curious child who loves reading and art. She has shown excellent progress in social skills and language development.",
        progress: {
          reading: 85,
          writing: 70,
          math: 80,
          socialSkills: 90,
          motorSkills: 75,
        },
        activities: [
          "Story Time",
          "Art & Craft",
          "Music & Movement",
          "Outdoor Play",
        ],
        achievements: [
          "Perfect Attendance Award",
          "Most Improved Reader",
          "Best Helper Award",
        ],
      },
      {
        id: 2,
        name: "Lucas Johnson",
        age: 6,
        gender: "male",
        dateOfBirth: "2018-08-22",
        enrollmentDate: "2024-09-01",
        parentName: "John Johnson",
        parentPhone: "+1 (555) 123-4567",
        parentEmail: "john.johnson@email.com",
        emergencyContact: "Mary Johnson",
        emergencyPhone: "+1 (555) 987-6543",
        address: "123 Main St, Anytown, ST 12345",
        allergies: [],
        medicalConditions: ["Mild asthma"],
        medications: ["Inhaler"],
        dietaryRestrictions: [],
        photo: null,
        attendance: { present: 19, absent: 1, total: 20 },
        lastCheckIn: "2024-12-10 8:15 AM",
        status: "active",
        notes:
          "Lucas is very energetic and loves physical activities. He has made great progress in following instructions and working with others.",
        progress: {
          reading: 90,
          writing: 85,
          math: 95,
          socialSkills: 80,
          motorSkills: 95,
        },
        activities: [
          "Physical Education",
          "Science Experiments",
          "Building Blocks",
          "Team Games",
        ],
        achievements: [
          "Math Whiz Award",
          "Sportsmanship Award",
          "Leadership Award",
        ],
      },
      {
        id: 3,
        name: "Sophia Rodriguez",
        age: 5,
        gender: "female",
        dateOfBirth: "2019-05-10",
        enrollmentDate: "2024-09-01",
        parentName: "Carlos Rodriguez",
        parentPhone: "+1 (555) 234-5678",
        parentEmail: "carlos.rodriguez@email.com",
        emergencyContact: "Maria Rodriguez",
        emergencyPhone: "+1 (555) 876-5432",
        address: "456 Oak Ave, Somewhere, ST 12345",
        allergies: [],
        medicalConditions: [],
        medications: [],
        dietaryRestrictions: [],
        photo: null,
        attendance: { present: 17, absent: 3, total: 20 },
        lastCheckIn: "2024-12-10 8:45 AM",
        status: "active",
        notes:
          "Sophia is a creative and imaginative child who excels in art and storytelling. She is very helpful to other children.",
        progress: {
          reading: 88,
          writing: 92,
          math: 78,
          socialSkills: 95,
          motorSkills: 82,
        },
        activities: [
          "Creative Arts",
          "Drama & Role Play",
          "Nature Walks",
          "Group Projects",
        ],
        achievements: [
          "Creative Artist Award",
          "Best Friend Award",
          "Environmental Awareness Award",
        ],
      },
    ];

    setTimeout(() => {
      setChildren(mockChildren);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredChildren = children.filter((child) => {
    const matchesSearch =
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || child.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (child) => {
    setSelectedChild(child);
    setShowDetailsModal(true);
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
          Child Profiles
        </h1>
        <p className="text-gray-600">
          View detailed information about each child in your class
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search children or parents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChildren.map((child) => (
          <div
            key={child.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {child.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {child.age} years old
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    child.status
                  )}`}
                >
                  {child.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Enrolled</p>
                  <p className="font-medium text-gray-900">
                    {new Date(child.enrollmentDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Attendance</p>
                  <p className="font-medium text-gray-900">
                    {Math.round(
                      (child.attendance.present / child.attendance.total) * 100
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {child.parentPhone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {child.parentEmail}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {child.address}
                </div>
              </div>

              {/* Progress Overview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Progress Overview
                </h4>
                <div className="space-y-2">
                  {Object.entries(child.progress).map(([skill, score]) => (
                    <div
                      key={skill}
                      className="flex justify-between items-center"
                    >
                      <span className="text-xs text-gray-600 capitalize">
                        {skill.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span
                        className={`text-xs font-medium ${getProgressColor(
                          score
                        )}`}
                      >
                        {score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDetails(child)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  View Details
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Child Details Modal */}
      {showDetailsModal && selectedChild && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Child Profile: {selectedChild.name}
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
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Full Name:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedChild.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Age:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedChild.age} years old
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Date of Birth:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {new Date(
                          selectedChild.dateOfBirth
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Gender:
                      </span>
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {selectedChild.gender}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Enrollment Date:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {new Date(
                          selectedChild.enrollmentDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Parent Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Parent Name:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedChild.parentName}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Phone:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedChild.parentPhone}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Email:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedChild.parentEmail}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Address:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedChild.address}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Health Information
                  </h4>
                  <div className="space-y-3">
                    {selectedChild.allergies.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Allergies:
                        </span>
                        <span className="ml-2 text-sm text-gray-900">
                          {selectedChild.allergies.join(", ")}
                        </span>
                      </div>
                    )}
                    {selectedChild.medicalConditions.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Medical Conditions:
                        </span>
                        <span className="ml-2 text-sm text-gray-900">
                          {selectedChild.medicalConditions.join(", ")}
                        </span>
                      </div>
                    )}
                    {selectedChild.medications.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Medications:
                        </span>
                        <span className="ml-2 text-sm text-gray-900">
                          {selectedChild.medications.join(", ")}
                        </span>
                      </div>
                    )}
                    {selectedChild.dietaryRestrictions.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Dietary Restrictions:
                        </span>
                        <span className="ml-2 text-sm text-gray-900">
                          {selectedChild.dietaryRestrictions.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Progress */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Academic Progress
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(selectedChild.progress).map(
                      ([skill, score]) => (
                        <div
                          key={skill}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {skill.replace(/([A-Z])/g, " $1")}
                          </span>
                          <div className="flex items-center">
                            <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(
                                  score
                                ).replace("text-", "bg-")}`}
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                            <span
                              className={`text-sm font-medium ${getProgressColor(
                                score
                              )}`}
                            >
                              {score}%
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Activities & Achievements */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Favorite Activities
                      </h4>
                      <div className="space-y-2">
                        {selectedChild.activities.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Achievements
                      </h4>
                      <div className="space-y-2">
                        {selectedChild.achievements.map(
                          (achievement, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <ChartBarIcon className="h-4 w-4 mr-2 text-green-500" />
                              {achievement}
                            </div>
                          )
                        )}
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
                    {selectedChild.notes}
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

export default ChildProfiles;
