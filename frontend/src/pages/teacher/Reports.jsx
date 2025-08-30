import React, { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowDownIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  HeartIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const TeacherReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("week");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        type: "attendance",
        title: "Weekly Attendance Report",
        description: "Attendance summary for Preschool A class",
        className: "Preschool A",
        dateRange: "Dec 2-8, 2024",
        generatedAt: "2024-12-08T10:00:00Z",
        status: "completed",
        fileSize: "2.3 MB",
        format: "PDF",
        data: {
          totalDays: 5,
          presentDays: 23,
          absentDays: 2,
          attendanceRate: 92.0,
          children: [
            { name: "Emma Johnson", present: 5, absent: 0, rate: 100 },
            { name: "Lucas Johnson", present: 4, absent: 1, rate: 80 },
            { name: "Sophia Rodriguez", present: 5, absent: 0, rate: 100 },
          ],
        },
      },
      {
        id: 2,
        type: "academic",
        title: "Monthly Progress Report",
        description: "Academic progress assessment for all students",
        className: "Preschool A",
        dateRange: "November 2024",
        generatedAt: "2024-12-01T14:30:00Z",
        status: "completed",
        fileSize: "4.1 MB",
        format: "PDF",
        data: {
          totalStudents: 15,
          averageProgress: 85.2,
          skillsAssessed: ["Reading", "Writing", "Math", "Social Skills"],
          topPerformers: ["Emma Johnson", "Sophia Rodriguez"],
          areasForImprovement: ["Fine motor skills", "Attention span"],
        },
      },
      {
        id: 3,
        type: "behavior",
        title: "Behavior Incident Report",
        description: "Behavior tracking and incident summary",
        className: "Preschool A",
        dateRange: "Dec 1-7, 2024",
        generatedAt: "2024-12-07T16:45:00Z",
        status: "completed",
        fileSize: "1.8 MB",
        format: "PDF",
        data: {
          totalIncidents: 3,
          positiveBehaviors: 28,
          incidentsByType: {
            "Minor conflicts": 2,
            "Attention issues": 1,
          },
          recommendations: [
            "Continue positive reinforcement",
            "Implement calming strategies",
          ],
        },
      },
      {
        id: 4,
        type: "health",
        title: "Health Status Report",
        description: "Health and wellness summary for class",
        className: "Preschool A",
        dateRange: "December 2024",
        generatedAt: "2024-12-05T09:15:00Z",
        status: "completed",
        fileSize: "3.2 MB",
        format: "PDF",
        data: {
          totalStudents: 15,
          healthAlerts: 2,
          medications: 3,
          allergies: 4,
          wellnessCheck: "All students healthy and active",
        },
      },
    ];

    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const getReportTypeIcon = (type) => {
    switch (type) {
      case "attendance":
        return <CalendarIcon className="h-5 w-5 text-blue-600" />;
      case "academic":
        return <AcademicCapIcon className="h-5 w-5 text-green-600" />;
      case "behavior":
        return <UserGroupIcon className="h-5 w-5 text-purple-600" />;
      case "health":
        return <HeartIcon className="h-5 w-5 text-red-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getReportTypeColor = (type) => {
    switch (type) {
      case "attendance":
        return "bg-blue-100 text-blue-800";
      case "academic":
        return "bg-green-100 text-green-800";
      case "behavior":
        return "bg-purple-100 text-purple-800";
      case "health":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesType =
      selectedReportType === "all" || report.type === selectedReportType;
    return matchesType;
  });

  const handleGenerateReport = () => {
    setShowGenerateModal(true);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleDownloadReport = (report) => {
    // Mock download functionality
    console.log(`Downloading ${report.title}`);
    alert(`Downloading ${report.title}`);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">
          Generate and view comprehensive reports about your class
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGenerateReport}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Generate New Report
          </button>

          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Report Types</option>
            <option value="attendance">Attendance Reports</option>
            <option value="academic">Academic Reports</option>
            <option value="behavior">Behavior Reports</option>
            <option value="health">Health Reports</option>
          </select>

          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search reports..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {getReportTypeIcon(report.type)}
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReportTypeColor(
                    report.type
                  )}`}
                >
                  {report.type}
                </span>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  report.status
                )}`}
              >
                {report.status}
              </span>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {report.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{report.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                {report.className}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {report.dateRange}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="h-4 w-4 mr-2" />
                {new Date(report.generatedAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{report.fileSize}</span>
              <span>{report.format}</span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleViewReport(report)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                View
              </button>
              <button
                onClick={() => handleDownloadReport(report)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  reports.filter(
                    (r) =>
                      new Date(r.generatedAt).getMonth() ===
                      new Date().getMonth()
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Attendance Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <HeartIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Health Alerts</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Generate New Report
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select report type</option>
                    <option value="attendance">Attendance Report</option>
                    <option value="academic">Academic Progress Report</option>
                    <option value="behavior">Behavior Report</option>
                    <option value="health">Health Status Report</option>
                  </select>
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
                    Date Range
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Generate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Report Details
                </h3>
                <button
                  onClick={() => setSelectedReport(null)}
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
                    Title:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedReport.title}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Type:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 capitalize">
                    {selectedReport.type}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Class:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedReport.className}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Date Range:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedReport.dateRange}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Generated:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {new Date(selectedReport.generatedAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Status:
                  </span>
                  <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedReport.status
                    )}`}
                  >
                    {selectedReport.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    File Size:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedReport.fileSize}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Format:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedReport.format}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherReports;
