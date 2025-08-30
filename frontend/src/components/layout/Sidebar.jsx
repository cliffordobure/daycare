import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  HeartIcon,
  DocumentTextIcon,
  CreditCardIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || "parent";

  const navigation = {
    admin: [
      { name: "Dashboard", href: "/admin", icon: HomeIcon },
      
      
      { name: "Children", href: "/admin/children", icon: UserGroupIcon },
      { name: "Classes", href: "/admin/classes", icon: AcademicCapIcon },
      { name: "Attendance", href: "/admin/attendance", icon: CalendarIcon },
      { name: "Activities", href: "/admin/activities", icon: CalendarIcon },
      {
        name: "Health Records",
        href: "/admin/health-records",
        icon: HeartIcon,
      },
      { name: "Reports", href: "/admin/reports", icon: ChartBarIcon },
      { name: "Payments", href: "/admin/payments", icon: CreditCardIcon },
      {
        name: "Communication",
        href: "/admin/communication",
        icon: EnvelopeIcon,
      },
      { name: "Users", href: "/admin/users", icon: UserGroupIcon },
      { name: "Settings", href: "/admin/settings", icon: CogIcon },
    ],
    teacher: [
      { name: "Dashboard", href: "/teacher", icon: HomeIcon },
      { name: "My Class", href: "/teacher/class", icon: AcademicCapIcon },
      { name: "Children", href: "/teacher/children", icon: UserGroupIcon },
      { name: "Attendance", href: "/teacher/attendance", icon: CalendarIcon },
      { name: "Activities", href: "/teacher/activities", icon: CalendarIcon },
      {
        name: "Health Records",
        href: "/teacher/health-records",
        icon: HeartIcon,
      },
      { name: "Reports", href: "/teacher/reports", icon: DocumentTextIcon },
      { name: "Messages", href: "/teacher/messages", icon: BellIcon },
    ],
    parent: [
      { name: "Dashboard", href: "/parent", icon: HomeIcon },
      { name: "My Children", href: "/parent/children", icon: UserGroupIcon },
      { name: "Attendance", href: "/parent/attendance", icon: CalendarIcon },
      { name: "Activities", href: "/parent/activities", icon: CalendarIcon },
      { name: "Health Records", href: "/parent/health", icon: HeartIcon },
      { name: "Payments", href: "/parent/payments", icon: CreditCardIcon },
      { name: "Messages", href: "/parent/messages", icon: BellIcon },
      { name: "Reports", href: "/parent/reports", icon: DocumentTextIcon },
    ],
  };

  const currentNavigation = navigation[userRole] || navigation.parent;

  const isActive = (href) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-shrink-0 ${
          isOpen ? "lg:block" : ""
        }`}
      >
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-white text-2xl font-bold">Nurtura</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {currentNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-900 border-r-2 border-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        className={`mr-3 flex-shrink-0 h-6 w-6 ${
                          isActive(item.href)
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white text-2xl font-bold">Nurtura</span>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {currentNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-900 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive(item.href)
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
