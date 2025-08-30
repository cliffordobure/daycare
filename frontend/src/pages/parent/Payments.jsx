import React from "react";
import { CreditCardIcon } from "@heroicons/react/24/outline";

const Payments = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-600 mt-2">View and manage your payment history</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Payment management interface will be displayed here</p>
            <p className="text-sm text-gray-400">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
