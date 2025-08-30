import React from "react";
import { Link } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/24/outline";

const Error401 = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <LockClosedIcon className="h-12 w-12 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access denied
            </h1>
            <p className="text-gray-600 mb-8">
              You don't have permission to access this page. Please log in with
              appropriate credentials.
            </p>
            <div className="space-y-3">
              <Link
                to="/auth/login"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </Link>
              <Link
                to="/"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go back home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error401;
