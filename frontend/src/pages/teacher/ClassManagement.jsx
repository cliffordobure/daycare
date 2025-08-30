import React, { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const ClassManagement = () => {
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockClassInfo = {
      id: 1,
      name: "Preschool A",
      teacher: "Sarah Wilson",
      ageGroup: "3-4 years",
      maxCapacity: 20,
      currentEnrollment: 15,
      schedule: {
        startTime: "8:00 AM",
        endTime: "3:00 PM",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      location: "Room 101 - Main Building",
      description:
        "A nurturing environment focused on early childhood development through play-based learning and social interaction.",
      curriculum: [
        "Early Literacy",
        "Numeracy Skills",
        "Social Development",
        "Creative Arts",
        "Physical Development",
      ],
    };

    const mockStudents = [
      {
        id: 1,
        name: "Emma Johnson",
        age: 4,
        gender: "female",
        enrollmentDate: "2024-09-01",
        parentName: "John Johnson",
        parentPhone: "+1 (555) 123-4567",
        attendance: { present: 18, absent: 2, total: 20 },
        lastCheckIn: "2024-12-10 8:30 AM",
        status: "active",
        photo: null,
      },
      {
        id: 2,
        name: "Lucas Johnson",
        age: 6,
        gender: "male",
        enrollmentDate: "2024-09-01",
        parentName: "John Johnson",
        parentPhone: "+1 (555) 123-4567",
        attendance: { present: 19, absent: 1, total: 20 },
        lastCheckIn: "2024-12-10 8:15 AM",
        status: "active",
        photo: null,
      },
      {
        id: 3,
        name: "Sophia Rodriguez",
        age: 5,
        gender: "female",
        enrollmentDate: "2024-09-01",
        parentName: "Carlos Rodriguez",
        parentPhone: "+1 (555) 234-5678",
        attendance: { present: 17, absent: 3, total: 20 },
        lastCheckIn: "2024-12-10 8:45 AM",
        status: "active",
        photo: null,
      },
    ];

    const mockActivities = [
      {
        id: 1,
        name: "Morning Circle Time",
        description:
          "Daily morning gathering for songs, stories, and group activities",
        duration: "30 minutes",
        time: "8:30 AM",
        type: "daily",
        materials: ["Story books", "Musical instruments", "Visual aids"],
        objectives: [
          "Social interaction",
          "Language development",
          "Listening skills",
        ],
      },
      {
        id: 2,
        name: "Art & Craft",
        description: "Creative activities using various art materials",
        duration: "45 minutes",
        time: "10:00 AM",
        type: "weekly",
        materials: ["Paint", "Paper", "Scissors", "Glue", "Crayons"],
        objectives: ["Fine motor skills", "Creativity", "Self-expression"],
      },
      {
        id: 3,
        name: "Outdoor Play",
        description: "Physical activities and games in the playground",
        duration: "40 minutes",
        time: "11:00 AM",
        type: "daily",
        materials: [
          "Balls",
          "Hula hoops",
          "Jump ropes",
          "Playground equipment",
        ],
        objectives: [
          "Physical development",
          "Gross motor skills",
          "Social play",
        ],
      },
    ];

    setTimeout(() => {
      setClassInfo(mockClassInfo);
      setStudents(mockStudents);
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceRate = (student) => {
    return Math.round(
      (student.attendance.present / student.attendance.total) * 100
    );
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 80) return "text-yellow-600";
    return "text-red-600";
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
          Class Management
        </h1>
        <p className="text-gray-600">
          Manage your class, students, and activities
        </p>
      </div>

      {/* Class Overview Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {classInfo.name}
            </h2>
            <p className="text-gray-600">{classInfo.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Teacher</p>
            <p className="font-medium text-gray-900">{classInfo.teacher}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {classInfo.currentEnrollment}
            </p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {classInfo.maxCapacity}
            </p>
            <p className="text-sm text-gray-600">Capacity</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {classInfo.ageGroup}
            </p>
            <p className="text-sm text-gray-600">Age Group</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {classInfo.schedule.days.length}
            </p>
            <p className="text-sm text-gray-600">Days/Week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Schedule</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                Time: {classInfo.schedule.startTime} -{" "}
                {classInfo.schedule.endTime}
              </p>
              <p>Days: {classInfo.schedule.days.join(", ")}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Location</h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {classInfo.location}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab("students")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === "students"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Students ({students.length})
          </button>
          <button
            onClick={() => setSelectedTab("activities")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === "activities"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Activities ({activities.length})
          </button>
          <button
            onClick={() => setSelectedTab("curriculum")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === "curriculum"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Curriculum
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Average Attendance
                </span>
                <span className="text-lg font-semibold text-green-600">
                  {Math.round(
                    students.reduce(
                      (acc, student) => acc + getAttendanceRate(student),
                      0
                    ) / students.length
                  )}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  New Students This Month
                </span>
                <span className="text-lg font-semibold text-blue-600">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Activities This Week
                </span>
                <span className="text-lg font-semibold text-purple-600">
                  15
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Parent Communication
                </span>
                <span className="text-lg font-semibold text-orange-600">8</span>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activities
            </h3>
            <div className="space-y-3">
              {activities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.time} • {activity.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === "students" && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Students</h3>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Student
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Check-in
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Enrolled:{" "}
                              {new Date(
                                student.enrollmentDate
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.age} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.parentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.parentPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span
                            className={getAttendanceColor(
                              getAttendanceRate(student)
                            )}
                          >
                            {getAttendanceRate(student)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.attendance.present}/
                          {student.attendance.total} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.lastCheckIn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "activities" && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Class Activities
              </h3>
              <button
                onClick={() => setShowAddActivityModal(true)}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Activity
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-medium text-gray-900">
                      {activity.name}
                    </h4>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.type === "daily"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {activity.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {activity.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {activity.time} • {activity.duration}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 text-sm">
                      View Details
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === "curriculum" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Curriculum Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classInfo.curriculum.map((area, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-gray-900">{area}</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Development of essential skills and knowledge in this area
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Student
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter parent name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddActivityModal && (
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
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
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
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddActivityModal(false)}
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
    </div>
  );
};

export default ClassManagement;
