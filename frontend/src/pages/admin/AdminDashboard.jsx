import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  CreditCardIcon,
  ChartBarIcon,
  BellIcon,
  PlusIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { fetchCenterDetails, fetchCenterUsers } from "../../store/slices/centerSlice";
import { selectCurrentCenter, selectCenterLoading, selectCenterUsers } from "../../store/slices/centerSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const currentCenter = useSelector(selectCurrentCenter);
  const loading = useSelector(selectCenterLoading);
  const centerUsers = useSelector(selectCenterUsers);

  const [stats, setStats] = useState({
    totalChildren: 0,
    activeClasses: 0,
    todayAttendance: 0,
    monthlyRevenue: 0,
    totalStaff: 0,
    totalParents: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (user?.center) {
      const centerId = typeof user.center === 'object' ? user.center._id : user.center;
      dispatch(fetchCenterDetails(centerId));
      // Also fetch center users for statistics
      dispatch(fetchCenterUsers({ centerId, params: { limit: 100 } }));
    }
  }, [dispatch, user?.center]);

  useEffect(() => {
    if (currentCenter && centerUsers) {
      // Calculate real statistics from center data and users
      const children = centerUsers.filter(user => user.role === 'parent').length;
      const teachers = centerUsers.filter(user => user.role === 'teacher').length;
      const admins = centerUsers.filter(user => user.role === 'admin').length;
      
      const calculatedStats = {
        totalChildren: children,
        activeClasses: currentCenter.classes?.length || 0,
        todayAttendance: 85, // TODO: Fetch real attendance data
        monthlyRevenue: 25000, // TODO: Fetch real revenue data
        totalStaff: teachers + admins,
        totalParents: children, // Each parent represents one child
      };
      setStats(calculatedStats);

      // Generate real activities based on user data
      const realActivities = [];
      
      // Add recent user enrollments (show last 3 parents)
      const recentParents = centerUsers
        .filter(user => user.role === 'parent')
        .slice(0, 3);
      
      recentParents.forEach((parent, index) => {
        realActivities.push({
          id: `parent-${index + 1}`,
          type: "enrollment",
          message: `New child enrolled: ${parent.firstName} ${parent.lastName}`,
          time: "Recently",
          icon: UserGroupIcon,
        });
      });
      
      // Add recent teacher additions
      const recentTeachers = centerUsers
        .filter(user => user.role === 'teacher')
        .slice(0, 2);
      
      recentTeachers.forEach((teacher, index) => {
        realActivities.push({
          id: `teacher-${index + 1}`,
          type: "staff",
          message: `New teacher joined: ${teacher.firstName} ${teacher.lastName}`,
          time: "Recently",
          icon: AcademicCapIcon,
        });
      });
      
      // Fill remaining slots with placeholder activities
      while (realActivities.length < 4) {
        const placeholders = [
          {
            id: `placeholder-${realActivities.length + 1}`,
            type: "attendance",
            message: "Daily attendance marked",
            time: "Today",
            icon: CalendarIcon,
          },
          {
            id: `placeholder-${realActivities.length + 1}`,
            type: "health",
            message: "Health records updated",
            time: "Today",
            icon: ChartBarIcon,
          }
        ];
        realActivities.push(placeholders[realActivities.length % 2]);
      }
      
      setRecentActivities(realActivities);
      setLastUpdated(new Date());
    }
  }, [currentCenter, centerUsers]);

  const handleQuickAction = (action) => {
    switch (action) {
      case "addChild":
        navigate("/admin/children");
        break;
      case "createClass":
        navigate("/admin/classes");
        break;
      case "markAttendance":
        navigate("/admin/attendance");
        break;
      case "sendNotice":
        navigate("/admin/communication");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      name: "Total Children",
      value: stats.totalChildren.toString(),
      change: stats.totalChildren > 0 ? `${stats.totalChildren} enrolled` : "No children yet",
      changeType: stats.totalChildren > 0 ? "positive" : "neutral",
      icon: UserGroupIcon,
      color: "text-blue-600",
    },
    {
      name: "Active Classes",
      value: stats.activeClasses.toString(),
      change: stats.activeClasses > 0 ? `${stats.activeClasses} classes` : "No classes yet",
      changeType: stats.activeClasses > 0 ? "positive" : "neutral",
      icon: AcademicCapIcon,
      color: "text-green-600",
    },
    {
      name: "Today's Attendance",
      value: `${stats.todayAttendance}%`,
      change: "Target: 90%",
      changeType: stats.todayAttendance >= 90 ? "positive" : "neutral",
      icon: CalendarIcon,
      color: "text-purple-600",
    },
    {
      name: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      change: "This month",
      changeType: "neutral",
      icon: CreditCardIcon,
      color: "text-orange-600",
    },
    {
      name: "Total Staff",
      value: stats.totalStaff.toString(),
      change: `${stats.totalStaff} members`,
      changeType: stats.totalStaff > 0 ? "positive" : "neutral",
      icon: UserGroupIcon,
      color: "text-indigo-600",
    },
    {
      name: "Total Parents",
      value: stats.totalParents.toString(),
      change: `${stats.totalParents} families`,
      changeType: stats.totalParents > 0 ? "positive" : "neutral",
      icon: UserGroupIcon,
      color: "text-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName || "Admin"}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening at {currentCenter?.name || "Nurtura Daycare"} today.
            </p>
          </div>
          <button
            onClick={() => {
              if (user?.center) {
                setIsRefreshing(true);
                const centerId = typeof user.center === 'object' ? user.center._id : user.center;
                Promise.all([
                  dispatch(fetchCenterDetails(centerId)),
                  dispatch(fetchCenterUsers({ centerId, params: { limit: 100 } }))
                ]).finally(() => setIsRefreshing(false));
              }
            }}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
        {currentCenter && (
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <span>Center: {currentCenter.name}</span>
            <span>•</span>
            <span>Location: {currentCenter.address?.city}, {currentCenter.address?.state}</span>
            <span>•</span>
            <span>Type: {currentCenter.type}</span>
            {lastUpdated && (
              <>
                <span>•</span>
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardStats.map((stat) => {
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
              <div className="mt-4">
                <span
                  className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "bg-green-100 text-green-800"
                      : stat.changeType === "negative"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {stat.changeType === "neutral" ? "" : "from last month"}
                </span>
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

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleQuickAction("addChild")}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserGroupIcon className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  Add Child
                </span>
              </button>
              <button 
                onClick={() => handleQuickAction("createClass")}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <AcademicCapIcon className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  Create Class
                </span>
              </button>
              <button 
                onClick={() => handleQuickAction("markAttendance")}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CalendarIcon className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  Mark Attendance
                </span>
              </button>
              <button 
                onClick={() => handleQuickAction("sendNotice")}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BellIcon className="h-8 w-8 text-orange-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  Send Notice
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Analytics Overview
          </h3>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                Charts and analytics will be displayed here
              </p>
              <p className="text-sm text-gray-400">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
