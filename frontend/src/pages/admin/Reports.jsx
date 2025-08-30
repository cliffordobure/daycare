import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  ClockIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Reports = () => {
  const { user } = useSelector((state) => state.auth);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedReportType, setSelectedReportType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  // Mock data for now
  useEffect(() => {
    setTimeout(() => {
      setReports([
        {
          id: 1,
          title: "Monthly Progress Report - November 2024",
          description:
            "Comprehensive overview of all children's learning progress and development",
          reportType: "progress",
          className: "All Classes",
          teacher: "All Teachers",
          date: "2024-12-01",
          status: "completed",
          priority: "normal",
          period: "November 2024",
          sections: [
            "Academic Progress",
            "Social Development",
            "Physical Skills",
            "Recommendations",
          ],
          summary:
            "Overall excellent progress across all classes. 95% of children meeting developmental milestones.",
          nextReport: "2024-12-31",
          documents: [
            "progress_report_nov_2024.pdf",
            "assessment_charts.pdf",
            "recommendations.pdf",
          ],
          alerts: [],
          generatedBy: "Admin System",
          approvedBy: "Director Johnson",
        },
        {
          id: 2,
          title: "Attendance Summary - November 2024",
          description:
            "Monthly attendance record and punctuality analysis for all classes",
          reportType: "attendance",
          className: "All Classes",
          teacher: "All Teachers",
          date: "2024-12-01",
          status: "completed",
          priority: "normal",
          period: "November 2024",
          sections: [
            "Attendance Rate",
            "Punctuality",
            "Absence Reasons",
            "Trends",
          ],
          summary:
            "Average attendance rate: 94.2%. Excellent punctuality maintained across all classes.",
          nextReport: "2024-12-31",
          documents: [
            "attendance_report_nov_2024.pdf",
            "punctuality_chart.pdf",
            "trends_analysis.pdf",
          ],
          alerts: [],
          generatedBy: "Admin System",
          approvedBy: "Director Johnson",
        },
        {
          id: 3,
          title: "Health & Wellness Report - Q4 2024",
          description:
            "Quarterly health assessment and wellness recommendations",
          reportType: "health",
          className: "All Classes",
          teacher: "Nurse Rodriguez",
          date: "2024-11-30",
          status: "completed",
          priority: "normal",
          period: "Q4 2024",
          sections: [
            "Physical Health",
            "Nutrition",
            "Sleep Patterns",
            "Wellness Tips",
          ],
          summary:
            "All children in excellent health. Good eating habits and regular sleep patterns observed.",
          nextReport: "2025-02-28",
          documents: [
            "health_report_q4_2024.pdf",
            "nutrition_chart.pdf",
            "wellness_guidelines.pdf",
          ],
          alerts: [],
          generatedBy: "Nurse Rodriguez",
          approvedBy: "Director Johnson",
        },
        {
          id: 4,
          title: "Financial Summary - November 2024",
          description:
            "Monthly financial overview including tuition, expenses, and budget analysis",
          reportType: "financial",
          className: "All Classes",
          teacher: "Finance Department",
          date: "2024-12-01",
          status: "pending",
          priority: "high",
          period: "November 2024",
          sections: ["Revenue", "Expenses", "Budget Analysis", "Projections"],
          summary:
            "Revenue targets met. Some areas need budget review for next quarter.",
          nextReport: "2024-12-31",
          documents: ["financial_summary_nov_2024.pdf", "budget_analysis.pdf"],
          alerts: ["Requires director approval", "Budget review needed"],
          generatedBy: "Finance Department",
          approvedBy: null,
        },
        {
          id: 5,
          title: "Staff Performance Review - Q4 2024",
          description:
            "Quarterly staff performance evaluation and development recommendations",
          reportType: "staff",
          className: "All Classes",
          teacher: "HR Department",
          date: "2024-11-25",
          status: "in-progress",
          priority: "medium",
          period: "Q4 2024",
          sections: [
            "Performance Metrics",
            "Development Areas",
            "Training Needs",
            "Recommendations",
          ],
          summary:
            "Staff performance review in progress. 80% of evaluations completed.",
          nextReport: "2024-12-15",
          documents: ["staff_performance_q4_2024.pdf", "training_needs.pdf"],
          alerts: ["Incomplete evaluations", "Training plan needed"],
          generatedBy: "HR Department",
          approvedBy: null,
        },
        {
          id: 6,
          title: "Safety & Compliance Audit - Q4 2024",
          description:
            "Quarterly safety inspection and compliance verification report",
          reportType: "safety",
          className: "All Classes",
          teacher: "Safety Officer",
          date: "2024-11-28",
          status: "completed",
          priority: "high",
          period: "Q4 2024",
          sections: [
            "Safety Inspections",
            "Compliance Status",
            "Risk Assessment",
            "Action Items",
          ],
          summary:
            "All safety requirements met. Minor improvements recommended for playground equipment.",
          nextReport: "2025-02-28",
          documents: [
            "safety_audit_q4_2024.pdf",
            "compliance_report.pdf",
            "action_items.pdf",
          ],
          alerts: ["Playground maintenance needed"],
          generatedBy: "Safety Officer",
          approvedBy: "Director Johnson",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      case "overdue":
        return "text-red-600 bg-red-100";
      case "draft":
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

  const getReportTypeColor = (type) => {
    switch (type) {
      case "progress":
        return "text-blue-600 bg-blue-100";
      case "attendance":
        return "text-green-600 bg-green-100";
      case "health":
        return "text-purple-600 bg-purple-100";
      case "financial":
        return "text-orange-600 bg-orange-100";
      case "staff":
        return "text-indigo-600 bg-indigo-100";
      case "safety":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case "in-progress":
        return <ExclamationTriangleIcon className="h-5 w-5 text-blue-600" />;
      case "overdue":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case "draft":
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || report.className === selectedClass;
    const matchesStatus =
      selectedStatus === "all" || report.status === selectedStatus;
    const matchesReportType =
      selectedReportType === "all" || report.reportType === selectedReportType;

    return matchesSearch && matchesClass && matchesStatus && matchesReportType;
  });

  const uniqueClasses = [...new Set(reports.map((report) => report.className))];
  const uniqueStatuses = [...new Set(reports.map((report) => report.status))];
  const uniqueReportTypes = [
    ...new Set(reports.map((report) => report.reportType)),
  ];

  const getReportStats = () => {
    const total = reports.length;
    const completed = reports.filter((r) => r.status === "completed").length;
    const pending = reports.filter((r) => r.status === "pending").length;
    const inProgress = reports.filter((r) => r.status === "in-progress").length;

    return { total, completed, pending, inProgress };
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setShowAddModal(true);
  };

  const handleDelete = (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setReports(reports.filter((report) => report.id !== reportId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getReportStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reports Management
            </h1>
            <p className="text-gray-600 mt-2">
              Generate, manage, and track all reports across the daycare system
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Generate New Report
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
                placeholder="Search by report title or teacher..."
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
              Report Type
            </label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              {uniqueReportTypes.map((type) => (
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
              setSelectedReportType("all");
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
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
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
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pending}
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
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.inProgress}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Reports List</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Scope
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content & Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval & Generation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {report.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getReportTypeColor(
                        report.reportType
                      )}`}
                    >
                      {report.reportType.charAt(0).toUpperCase() +
                        report.reportType.slice(1)}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {report.className}
                    </div>
                    <div className="text-sm text-gray-500">
                      {report.teacher}
                    </div>
                    <div className="text-sm text-gray-500">{report.period}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center mb-2">
                      {getStatusIcon(report.status)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        report.priority
                      )}`}
                    >
                      {report.priority.charAt(0).toUpperCase() +
                        report.priority.slice(1)}{" "}
                      Priority
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded mb-2">
                      {report.summary}
                    </div>
                    <div className="text-sm text-gray-900 mb-2">Sections:</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {report.sections.slice(0, 3).map((section, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {section}
                        </span>
                      ))}
                      {report.sections.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          +{report.sections.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-900 mb-2">Documents:</div>
                    <div className="flex flex-wrap gap-1">
                      {report.documents.slice(0, 2).map((doc, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {doc}
                        </span>
                      ))}
                      {report.documents.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          +{report.documents.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <strong>Generated by:</strong> {report.generatedBy}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <strong>Approved by:</strong>{" "}
                      {report.approvedBy || "Pending"}
                    </div>
                    {report.nextReport && (
                      <div className="text-sm text-gray-500 mt-1">
                        <strong>Next report:</strong>{" "}
                        {new Date(report.nextReport).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(report)}
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
                        onClick={() => {
                          /* Download */
                        }}
                        className="text-purple-600 hover:text-purple-900 p-1"
                        title="Download"
                      >
                        <ArrowDownIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
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

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports found
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
                {editingReport ? "Edit Report" : "Generate New Report"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {editingReport
                  ? "Update report information"
                  : "Configure new report parameters"}
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
                    setEditingReport(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingReport ? "Update" : "Generate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
