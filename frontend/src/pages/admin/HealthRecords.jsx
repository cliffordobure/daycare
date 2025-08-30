import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  HeartIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhoneIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const HealthRecords = () => {
  const { user } = useSelector((state) => state.auth);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRecordType, setSelectedRecordType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Mock data for now
  useEffect(() => {
    setTimeout(() => {
      setHealthRecords([
        {
          id: 1,
          childId: 1,
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
          parentName: "John Johnson",
          parentPhone: "+1 (555) 123-4567",
          emergencyContact: "Mary Johnson",
          emergencyPhone: "+1 (555) 987-6543",
        },
        {
          id: 2,
          childId: 1,
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
          parentName: "John Johnson",
          parentPhone: "+1 (555) 123-4567",
          emergencyContact: "Mary Johnson",
          emergencyPhone: "+1 (555) 987-6543",
        },
        {
          id: 3,
          childId: 2,
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
          parentName: "John Johnson",
          parentPhone: "+1 (555) 123-4567",
          emergencyContact: "Mary Johnson",
          emergencyPhone: "+1 (555) 987-6543",
        },
        {
          id: 4,
          childId: 2,
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
          parentName: "John Johnson",
          parentPhone: "+1 (555) 123-4567",
          emergencyContact: "Mary Johnson",
          emergencyPhone: "+1 (555) 987-6543",
        },
        {
          id: 5,
          childId: 3,
          childName: "Sophia Rodriguez",
          className: "Preschool B",
          recordType: "checkup",
          title: "Annual Physical Examination",
          description: "Routine health checkup and assessment",
          date: "2024-10-20",
          status: "completed",
          priority: "normal",
          doctor: "Dr. Michael Chen",
          location: "Pediatric Care Clinic",
          notes:
            "Sophia is in excellent health. Height and weight are within normal range for her age. No concerns noted.",
          nextDue: "2025-10-20",
          documents: ["physical_exam_report.pdf", "growth_chart.pdf"],
          alerts: [],
          parentName: "Carlos Rodriguez",
          parentPhone: "+1 (555) 234-5678",
          emergencyContact: "Maria Rodriguez",
          emergencyPhone: "+1 (555) 876-5432",
        },
        {
          id: 6,
          childId: 4,
          childName: "Aiden Thompson",
          className: "Toddler A",
          recordType: "medication",
          title: "Dairy Allergy Management",
          description: "Lactose intolerance treatment plan",
          date: "2024-11-01",
          status: "active",
          priority: "medium",
          doctor: "Dr. Jessica Brown",
          location: "Pediatric Care Clinic",
          notes:
            "Aiden is lactose intolerant. Dairy-free diet required. Monitor for accidental exposure.",
          nextDue: "2025-02-01",
          documents: ["allergy_management_plan.pdf", "dietary_guidelines.pdf"],
          alerts: ["Strict dairy avoidance", "Monitor for symptoms"],
          parentName: "David Thompson",
          parentPhone: "+1 (555) 345-6789",
          emergencyContact: "Lisa Thompson",
          emergencyPhone: "+1 (555) 765-4321",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
      case "cancelled":
        return "text-gray-600 bg-gray-100";
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
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "active":
        return <ExclamationTriangleIcon className="h-5 w-5 text-blue-600" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case "overdue":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredHealthRecords = healthRecords.filter((record) => {
    const matchesSearch =
      record.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || record.className === selectedClass;
    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;
    const matchesRecordType =
      selectedRecordType === "all" || record.recordType === selectedRecordType;

    return matchesSearch && matchesClass && matchesStatus && matchesRecordType;
  });

  const uniqueClasses = [
    ...new Set(healthRecords.map((record) => record.className)),
  ];
  const uniqueStatuses = [
    ...new Set(healthRecords.map((record) => record.status)),
  ];
  const uniqueRecordTypes = [
    ...new Set(healthRecords.map((record) => record.recordType)),
  ];

  const getHealthStats = () => {
    const total = healthRecords.length;
    const completed = healthRecords.filter(
      (r) => r.status === "completed"
    ).length;
    const active = healthRecords.filter((r) => r.status === "active").length;
    const highPriority = healthRecords.filter(
      (r) => r.priority === "high"
    ).length;

    return { total, completed, active, highPriority };
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowAddModal(true);
  };

  const handleDelete = (recordId) => {
    if (window.confirm("Are you sure you want to delete this health record?")) {
      setHealthRecords(
        healthRecords.filter((record) => record.id !== recordId)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getHealthStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Health Records Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track all health records for children across all
              classes
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Health Record
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by child name or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map((className) => (
                <option key={className} value={className}>
                  {className}
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
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Record Type
            </label>
            <select
              value={selectedRecordType}
              onChange={(e) => setSelectedRecordType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              {uniqueRecordTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedClass("all");
              setSelectedStatus("all");
              setSelectedRecordType("all");
            }}
            className="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HeartIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Records</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
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
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.active}
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
              <p className="text-sm font-medium text-gray-500">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.highPriority}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Records List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Health Records List
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Child & Record Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents & Alerts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHealthRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <HeartIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {record.childName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.className}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {record.childId}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getRecordTypeColor(
                            record.recordType
                          )}`}
                        >
                          {record.recordType.charAt(0).toUpperCase() +
                            record.recordType.slice(1)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.title}</div>
                    <div className="text-sm text-gray-500">
                      {record.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      Date: {new Date(record.date).toLocaleDateString()}
                    </div>
                    {record.nextDue && (
                      <div className="text-sm text-gray-500">
                        Next Due:{" "}
                        {new Date(record.nextDue).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center mb-2">
                      {getStatusIcon(record.status)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        record.priority
                      )}`}
                    >
                      {record.priority.charAt(0).toUpperCase() +
                        record.priority.slice(1)}{" "}
                      Priority
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 mb-2">Documents:</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {record.documents.map((doc, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                    {record.alerts.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-900 mb-2">
                          Alerts:
                        </div>
                        <div className="space-y-1">
                          {record.alerts.map((alert, index) => (
                            <div
                              key={index}
                              className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded"
                            >
                              ⚠️ {alert}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.doctor}</div>
                    <div className="text-sm text-gray-500">
                      {record.location}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      <strong>Parent:</strong> {record.parentName}
                    </div>
                    <div className="text-sm text-gray-500">
                      <strong>Emergency:</strong> {record.emergencyContact}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          /* View details */
                        }}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHealthRecords.length === 0 && (
          <div className="text-center py-12">
            <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No health records found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRecord ? "Edit Health Record" : "Add Health Record"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {editingRecord
                  ? "Update health record information"
                  : "Enter new health record details"}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRecord(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingRecord ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
