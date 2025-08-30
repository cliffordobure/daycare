import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { toggleSidebar } from "../../store/slices/uiSlice";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onSidebarToggle={handleSidebarToggle} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={handleSidebarToggle}
        />
      )}
    </div>
  );
};

export default Layout;
