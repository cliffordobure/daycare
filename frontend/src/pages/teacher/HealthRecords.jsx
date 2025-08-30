import React, { useState, useEffect } from "react";
import {
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const TeacherHealthRecords = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockHealthRecords = [
      {
        id: 1,
        childName: "Emma Johnson",
        age: 4,
        className: "Preschool A",
        parentName: "John Johnson",
        parentPhone: "+1 (555) 123-4567",
        emergencyContact: "Mary Johnson",
        emergencyPhone: "+1 (555) 987-6543",
        allergies: ["Peanuts", "Tree nuts"],
        medicalConditions: ["Asthma"],
        medications: ["EpiPen", "Inhaler"],
        dietaryRestrictions: ["No nuts", "Dairy free"],
        lastCheckup: "2024-10-15",
        nextCheckup: "2025-04-15",
        immunizationStatus: "Up to date",
        notes:
          "EpiPen must be available at all times. Monitor for asthma symptoms during physical activities.",
        status: "active",
        lastUpdated: "2024-12-10",
      },
      {
        id: 2,
        childName: "Lucas Johnson",
        age: 6,
        className: "Kindergarten B",
        parentName: "John Johnson",
        parentPhone: "+1 (555) 123-4567",
        emergencyContact: "Mary Johnson",
        emergencyPhone: "+1 (555) 987-6543",
        allergies: [],
        medicalConditions: ["Mild asthma"],
        medications: ["Inhaler"],
        dietaryRestrictions: [],
        lastCheckup: "2024-09-20",
        nextCheckup: "2025-03-20",
        immunizationStatus: "Up to date",
        notes: "Mild asthma, inhaler available. No restrictions on activities.",
        status: "active",
        lastUpdated: "2024-12-08",
      },
      {
        id: 3,
        childName: "Sophia Rodriguez",
        age: 5,
        className: "Preschool B",
        parentName: "Carlos Rodriguez",
        parentPhone: "+1 (555) 234-5678",
        emergencyContact: "Maria Rodriguez",
        emergencyPhone: "+1 (555) 876-5432",
        allergies: [],
        medicalConditions: [],
        medications: [],
        dietaryRestrictions: [],
        lastCheckup: "2024-11-05",
        nextCheckup: "2025-05-05",
        immunizationStatus: "Up to date",
        notes: "No known health issues. All activities permitted.",
        status: "active",
        lastUpdated: "2024-12-05",
      },
    ];

    setTimeout(() => {
      setHealthRecords(mockHealthRecords);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (record) => {
    if (record.allergies.length > 0 || record.medicalConditions.length > 0) {
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
    }
    return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
  };

  const filteredRecords = healthRecords.filter((record) => {
    const matchesSearch =
      record.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || record.className === selectedClass;
    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleAddRecord = () => {
    setShowAddModal(true);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
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
          Health Records
        </h1>
        <p className="text-gray-600">
          Manage and monitor children's health information
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddRecord}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Health Record
          </button>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Classes</option>
            <option value="Preschool A">Preschool A</option>
            <option value="Preschool B">Preschool B</option>
            <option value="Kindergarten A">Kindergarten A</option>
            <option value="Kindergarten B">Kindergarten B</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
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

      {/* Health Records List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Child
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Checkup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Checkup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityIcon(record)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {record.childName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.age} years old
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.className}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {record.allergies.length > 0 && (
                        <div className="text-xs text-red-600">
                          {record.allergies.length} allergies
                        </div>
                      )}
                      {record.medicalConditions.length > 0 && (
                        <div className="text-xs text-orange-600">
                          {record.medicalConditions.length} conditions
                        </div>
                      )}
                      {record.allergies.length === 0 &&
                        record.medicalConditions.length === 0 && (
                          <div className="text-xs text-green-600">
                            No issues
                          </div>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.lastCheckup).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.nextCheckup).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowAddModal(true)}
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

      {/* Health Record Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Health Record Details
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
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Child:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedRecord.childName}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Class:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedRecord.className}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Parent:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedRecord.parentName}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Parent Phone:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedRecord.parentPhone}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Emergency Contact:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedRecord.emergencyContact}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Emergency Phone:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedRecord.emergencyPhone}
                  </span>
                </div>
                {selectedRecord.allergies.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Allergies:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {selectedRecord.allergies.join(", ")}
                    </span>
                  </div>
                )}
                {selectedRecord.medicalConditions.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Medical Conditions:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {selectedRecord.medicalConditions.join(", ")}
                    </span>
                  </div>
                )}
                {selectedRecord.medications.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Medications:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {selectedRecord.medications.join(", ")}
                    </span>
                  </div>
                )}
                {selectedRecord.dietaryRestrictions.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Dietary Restrictions:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {selectedRecord.dietaryRestrictions.join(", ")}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Last Checkup:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {new Date(selectedRecord.lastCheckup).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Next Checkup:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {new Date(selectedRecord.nextCheckup).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Immunization Status:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedRecord.immunizationStatus}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Notes:
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRecord.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Health Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add Health Record
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Child Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter child name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select class</option>
                    <option value="Preschool A">Preschool A</option>
                    <option value="Preschool B">Preschool B</option>
                    <option value="Kindergarten A">Kindergarten A</option>
                    <option value="Kindergarten B">Kindergarten B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allergies
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter allergies (comma separated)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Conditions
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter medical conditions"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter health notes"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Save
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

export default TeacherHealthRecords;
