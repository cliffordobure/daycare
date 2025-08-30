import React from "react";
import { useSelector } from "react-redux";
import {
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  HeartIcon,
  BellIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const TeacherDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const classStats = [
    {
      name: "Total Students",
      value: "18",
      icon: UserGroupIcon,
      color: "text-blue-600",
    },
    {
      name: "Present Today",
      value: "16",
      icon: CalendarIcon,
      color: "text-green-600",
    },
    {
      name: "Absent Today",
      value: "2",
      icon: CalendarIcon,
      color: "text-red-600",
    },
    {
      name: "Health Alerts",
      value: "1",
      icon: HeartIcon,
      color: "text-orange-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "attendance",
      message: "Marked attendance for Class A",
      time: "5 minutes ago",
      icon: CalendarIcon,
    },
    {
      id: 2,
      type: "activity",
      message: "Updated activity log for Emma",
      time: "1 hour ago",
      icon: DocumentTextIcon,
    },
    {
      id: 3,
      type: "health",
      message: "Health note added for Michael",
      time: "2 hours ago",
      icon: HeartIcon,
    },
    {
      id: 4,
      type: "communication",
      message: "Message sent to Sarah's parents",
      time: "3 hours ago",
      icon: BellIcon,
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Submit weekly progress reports",
      due: "Today",
      priority: "high",
    },
    {
      id: 2,
      title: "Parent-teacher meeting prep",
      due: "Tomorrow",
      priority: "medium",
    },
    {
      id: 3,
      title: "Update activity curriculum",
      due: "This week",
      priority: "low",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {user?.firstName || "Teacher"}! 🌅
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your class overview and today's tasks.
        </p>
      </div>

      {/* Class Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {classStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Activities
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium">
                View all activities
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Upcoming Tasks
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">Due: {task.due}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium">
                View all tasks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CalendarIcon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Mark Attendance
              </span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <DocumentTextIcon className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Activity Log
              </span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <HeartIcon className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Health Notes
              </span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BellIcon className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Send Message
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
