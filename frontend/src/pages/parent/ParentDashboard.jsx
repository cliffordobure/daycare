import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  CalendarIcon,
  HeartIcon,
  CreditCardIcon,
  BellIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const ParentDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const childrenStats = [
    {
      name: "My Children",
      value: "2",
      icon: UserGroupIcon,
      color: "text-blue-600",
    },
    {
      name: "Present Today",
      value: "2",
      icon: CalendarIcon,
      color: "text-green-600",
    },
    {
      name: "Health Alerts",
      value: "0",
      icon: HeartIcon,
      color: "text-orange-600",
    },
    {
      name: "Pending Payments",
      value: "1",
      icon: CreditCardIcon,
      color: "text-red-600",
    },
  ];

  const recentUpdates = [
    {
      id: 1,
      type: "attendance",
      message: "Emma checked in at 8:30 AM",
      time: "2 hours ago",
      icon: CalendarIcon,
    },
    {
      id: 2,
      type: "activity",
      message: "Emma participated in art class",
      time: "4 hours ago",
      icon: DocumentTextIcon,
    },
    {
      id: 3,
      type: "health",
      message: "Health record updated for Emma",
      time: "1 day ago",
      icon: HeartIcon,
    },
    {
      id: 4,
      type: "communication",
      message: "Message from Teacher Sarah",
      time: "2 days ago",
      icon: BellIcon,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Parent-Teacher Meeting",
      date: "Tomorrow, 3:00 PM",
      type: "meeting",
    },
    {
      id: 2,
      title: "Field Trip to Zoo",
      date: "Friday, 9:00 AM",
      type: "trip",
    },
    {
      id: 3,
      title: "Monthly Payment Due",
      date: "Next Monday",
      type: "payment",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName || "Parent"}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your children today.
        </p>
      </div>

      {/* Children Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {childrenStats.map((stat) => {
          const Icon = stat.icon;
          const isMyChildren = stat.name === "My Children";

          const cardContent = (
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          );

          if (isMyChildren) {
            return (
              <Link
                key={stat.name}
                to="/parent/children"
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              {cardContent}
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Updates */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Updates
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUpdates.map((update) => {
                const Icon = update.icon;
                return (
                  <div key={update.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{update.message}</p>
                      <p className="text-sm text-gray-500">{update.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium">
                View all updates
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Upcoming Events
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.type === "meeting"
                        ? "bg-blue-100 text-blue-800"
                        : event.type === "trip"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium">
                View calendar
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
            <Link
              to="/parent/attendance"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <CalendarIcon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                View Attendance
              </span>
            </Link>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <DocumentTextIcon className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Activity Reports
              </span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <HeartIcon className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                Health Records
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

      {/* Children Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">My Children</h3>
            <Link
              to="/parent/children"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">E</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Emma Johnson
                  </h4>
                  <p className="text-sm text-gray-500">Class A • Age 4</p>
                  <p className="text-sm text-green-600">Present today</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-lg">
                    M
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Michael Johnson
                  </h4>
                  <p className="text-sm text-gray-500">Class B • Age 6</p>
                  <p className="text-sm text-green-600">Present today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
