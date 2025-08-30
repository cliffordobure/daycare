import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">N</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Nurtura Daycare
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Professional childcare management system
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>&copy; 2025 Nurtura Daycare. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
