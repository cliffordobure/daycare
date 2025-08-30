import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhoneIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const HealthRecords = () => {
  const { user } = useSelector((state) => state.auth);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data for now
  useEffect(() => {
    setTimeout(() => {
      setHealthRecords([
        {
          id: 1,
          childName: "Emma Johnson",
          className: "Preschool A",
          recordType: "vaccination",
          title: "MMR Vaccine",
          description: "Measles, Mumps, and Rubella vaccination",
          date: "2024-11-15",
          status: "completed",
          priority: "normal",
          doctor: "Dr. Sarah Wilson",
          location: "City Medical Center",
          notes:
            "Emma received her MMR vaccine as scheduled. No adverse reactions observed.",
          nextDue: "2025-11-15",
          documents: ["vaccination_card.pdf"],
          alerts: [],
        },
        {
          id: 2,
          childName: "Emma Johnson",
          className: "Preschool A",
          recordType: "checkup",
          title: "Annual Physical Examination",
          description: "Routine health checkup and assessment",
          date: "2024-10-20",
          status: "completed",
          priority: "normal",
          doctor: "Dr. Michael Chen",
          location: "Pediatric Care Clinic",
          notes:
            "Emma is in excellent health. Height and weight are within normal range for her age. No concerns noted.",
          nextDue: "2025-10-20",
          documents: ["physical_exam_report.pdf", "growth_chart.pdf"],
          alerts: [],
        },
        {
          id: 3,
          childName: "Emma Johnson",
          className: "Preschool A",
          recordType: "allergy",
          title: "Peanut Allergy Alert",
          description: "Severe peanut allergy identified",
          date: "2024-09-10",
          status: "active",
          priority: "high",
          doctor: "Dr. Sarah Wilson",
          location: "Allergy Specialist Clinic",
          notes:
            "Emma has a confirmed severe peanut allergy. EpiPen prescribed. Strict avoidance required.",
          nextDue: "2024-12-10",
          documents: ["allergy_test_results.pdf", "epipen_prescription.pdf"],
          alerts: [
            "Requires immediate attention",
            "EpiPen must be available at all times",
          ],
        },
        {
          id: 4,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          recordType: "vaccination",
          title: "DTaP Booster",
          description: "Diphtheria, Tetanus, and Pertussis booster",
          date: "2024-11-20",
          status: "completed",
          priority: "normal",
          doctor: "Dr. Sarah Wilson",
          location: "City Medical Center",
          notes: "Lucas received his DTaP booster without complications.",
          nextDue: "2029-11-20",
          documents: ["vaccination_record.pdf"],
          alerts: [],
        },
        {
          id: 5,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          recordType: "checkup",
          title: "Dental Checkup",
          description: "Regular dental examination and cleaning",
          date: "2024-11-05",
          status: "completed",
          priority: "normal",
          doctor: "Dr. Emily Rodriguez",
          location: "Bright Smiles Dental",
          notes:
            "Lucas has excellent oral hygiene. No cavities found. Continue with current brushing routine.",
          nextDue: "2025-05-05",
          documents: ["dental_report.pdf"],
          alerts: [],
        },
        {
          id: 6,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          recordType: "medication",
          title: "Asthma Inhaler Prescription",
          description: "Albuterol inhaler for asthma management",
          date: "2024-10-15",
          status: "active",
          priority: "medium",
          doctor: "Dr. Michael Chen",
          location: "Pediatric Care Clinic",
          notes:
            "Lucas has mild asthma. Inhaler to be used as needed for shortness of breath or wheezing.",
          nextDue: "2025-01-15",
          documents: ["asthma_action_plan.pdf", "inhaler_instructions.pdf"],
          alerts: ["Monitor for asthma symptoms", "Keep inhaler accessible"],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getRecordTypeColor = (type) => {
    switch (type) {
      case "vaccination":
        return "text-blue-600 bg-blue-100";
      case "checkup":
        return "text-green-600 bg-green-100";
      case "allergy":
        return "text-red-600 bg-red-100";
      case "medication":
        return "text-purple-600 bg-purple-100";
      case "emergency":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "active":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "overdue":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "normal":
        return "text-green-600 bg-green-100";
      case "low":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRecordTypeIcon = (type) => {
    switch (type) {
      case "vaccination":
        return <CheckCircleIcon className="h-5 w-5 text-blue-600" />;
      case "checkup":
        return <HeartIcon className="h-5 w-5 text-green-600" />;
      case "allergy":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case "medication":
        return <DocumentTextIcon className="h-5 w-5 text-purple-600" />;
      case "emergency":
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredRecords = healthRecords.filter((record) => {
    if (selectedChild !== "all" && record.childName !== selectedChild)
      return false;
    if (selectedStatus !== "all" && record.status !== selectedStatus)
      return false;
    return true;
  });

  const uniqueChildren = [
    ...new Set(healthRecords.map((record) => record.childName)),
  ];
  const uniqueStatuses = [
    ...new Set(healthRecords.map((record) => record.status)),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
        <p className="text-gray-600 mt-2">
          Monitor your children's health, vaccinations, and medical information
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Child
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Children</option>
              {uniqueChildren.map((child) => (
                <option key={child} value={child}>
                  {child}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSelectedChild("all");
              setSelectedStatus("all");
            }}
            className="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Health Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Records</p>
              <p className="text-2xl font-semibold text-gray-900">
                {healthRecords.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {healthRecords.filter((r) => r.status === "completed").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Active Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {healthRecords.filter((r) => r.alerts.length > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">
                {healthRecords.filter((r) => r.status === "active").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Records List */}
      <div className="space-y-6">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            {/* Record Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getRecordTypeIcon(record.recordType)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {record.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {record.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getRecordTypeColor(
                      record.recordType
                    )}`}
                  >
                    {record.recordType.charAt(0).toUpperCase() +
                      record.recordType.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      record.status
                    )}`}
                  >
                    {record.status.charAt(0).toUpperCase() +
                      record.status.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                      record.priority
                    )}`}
                  >
                    {record.priority.charAt(0).toUpperCase() +
                      record.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Record Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
                    Child Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Child:</span>
                      <span className="font-medium">{record.childName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class:</span>
                      <span className="font-medium">{record.className}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Due:</span>
                      <span className="font-medium">
                        {record.nextDue
                          ? new Date(record.nextDue).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medical Details */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <HeartIcon className="h-5 w-5 text-green-600 mr-2" />
                    Medical Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-medium">{record.doctor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{record.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{record.recordType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className="font-medium">{record.priority}</span>
                    </div>
                  </div>
                </div>

                {/* Documents & Alerts */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-purple-600 mr-2" />
                    Documents & Alerts
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Documents:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {record.documents.map((doc, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                    {record.alerts.length > 0 && (
                      <div>
                        <span className="text-sm text-red-600">Alerts:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {record.alerts.map((alert, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                            >
                              {alert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {record.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">
                    Notes
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {record.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Documents
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Download Report
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Share with Doctor
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Schedule Follow-up
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Record Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <button className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
          <div className="flex items-center justify-center space-x-2">
            <PlusIcon className="h-6 w-6" />
            <span className="font-medium">Add New Health Record</span>
          </div>
        </button>
      </div>

      {/* No Records Message */}
      {filteredRecords.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No health records found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or add a new health record.
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
