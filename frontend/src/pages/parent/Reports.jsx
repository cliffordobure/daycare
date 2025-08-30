import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  ClockIcon,
  ArrowDownIcon,
  EyeIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";

const Reports = () => {
  const { user } = useSelector((state) => state.auth);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedReportType, setSelectedReportType] = useState("all");

  // Mock data for now
  useEffect(() => {
    setTimeout(() => {
      setReports([
        {
          id: 1,
          childName: "Emma Johnson",
          className: "Preschool A",
          reportType: "progress",
          title: "Monthly Progress Report - November 2024",
          description:
            "Comprehensive overview of Emma's learning progress and development",
          date: "2024-12-01",
          status: "available",
          priority: "normal",
          teacher: "Sarah Wilson",
          period: "November 2024",
          sections: [
            "Academic Progress",
            "Social Development",
            "Physical Skills",
            "Recommendations",
          ],
          summary:
            "Emma has shown excellent progress in all areas. Her creativity and social skills have improved significantly.",
          nextReport: "2024-12-31",
          documents: ["progress_report_nov_2024.pdf", "assessment_charts.pdf"],
          alerts: [],
        },
        {
          id: 2,
          childName: "Emma Johnson",
          className: "Preschool A",
          reportType: "attendance",
          title: "Attendance Summary - November 2024",
          description: "Monthly attendance record and punctuality analysis",
          date: "2024-12-01",
          status: "available",
          priority: "normal",
          teacher: "Sarah Wilson",
          period: "November 2024",
          sections: [
            "Attendance Rate",
            "Punctuality",
            "Absence Reasons",
            "Trends",
          ],
          summary:
            "Emma attended 22 out of 23 school days (95.7% attendance rate). Excellent punctuality maintained.",
          nextReport: "2024-12-31",
          documents: [
            "attendance_report_nov_2024.pdf",
            "punctuality_chart.pdf",
          ],
          alerts: [],
        },
        {
          id: 3,
          childName: "Emma Johnson",
          className: "Preschool A",
          reportType: "health",
          title: "Health & Wellness Report - Q4 2024",
          description:
            "Quarterly health assessment and wellness recommendations",
          date: "2024-11-30",
          status: "available",
          priority: "normal",
          teacher: "Sarah Wilson",
          period: "Q4 2024",
          sections: [
            "Physical Health",
            "Nutrition",
            "Sleep Patterns",
            "Wellness Tips",
          ],
          summary:
            "Emma is in excellent health. Good eating habits and regular sleep patterns observed.",
          nextReport: "2025-02-28",
          documents: ["health_report_q4_2024.pdf", "nutrition_chart.pdf"],
          alerts: [],
        },
        {
          id: 4,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          reportType: "progress",
          title: "Monthly Progress Report - November 2024",
          description:
            "Comprehensive overview of Lucas's learning progress and development",
          date: "2024-12-01",
          status: "available",
          priority: "normal",
          teacher: "Michael Chen",
          period: "November 2024",
          sections: [
            "Academic Progress",
            "Social Development",
            "Physical Skills",
            "Recommendations",
          ],
          summary:
            "Lucas continues to excel in mathematics and reading. Strong problem-solving skills demonstrated.",
          nextReport: "2024-12-31",
          documents: ["progress_report_nov_2024.pdf", "assessment_charts.pdf"],
          alerts: [],
        },
        {
          id: 5,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          reportType: "attendance",
          title: "Attendance Summary - November 2024",
          description: "Monthly attendance record and punctuality analysis",
          date: "2024-12-01",
          status: "available",
          priority: "normal",
          teacher: "Michael Chen",
          period: "November 2024",
          sections: [
            "Attendance Rate",
            "Punctuality",
            "Absence Reasons",
            "Trends",
          ],
          summary:
            "Lucas attended 23 out of 23 school days (100% attendance rate). Perfect attendance record.",
          nextReport: "2024-12-31",
          documents: [
            "attendance_report_nov_2024.pdf",
            "punctuality_chart.pdf",
          ],
          alerts: [],
        },
        {
          id: 6,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          reportType: "activities",
          title: "Activities & Participation Report - November 2024",
          description:
            "Monthly activities participation and skill development analysis",
          date: "2024-11-30",
          status: "available",
          priority: "normal",
          teacher: "Michael Chen",
          period: "November 2024",
          sections: [
            "Activity Participation",
            "Skill Development",
            "Social Interaction",
            "Recommendations",
          ],
          summary:
            "Lucas actively participated in all activities. Strong leadership skills emerging in group activities.",
          nextReport: "2024-12-31",
          documents: [
            "activities_report_nov_2024.pdf",
            "participation_chart.pdf",
          ],
          alerts: [],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getReportTypeColor = (type) => {
    switch (type) {
      case "progress":
        return "text-blue-600 bg-blue-100";
      case "attendance":
        return "text-green-600 bg-green-100";
      case "health":
        return "text-purple-600 bg-purple-100";
      case "activities":
        return "text-orange-600 bg-orange-100";
      case "behavior":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
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
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case "progress":
        return <AcademicCapIcon className="h-5 w-5 text-blue-600" />;
      case "attendance":
        return <CalendarIcon className="h-5 w-5 text-green-600" />;
      case "health":
        return <HeartIcon className="h-5 w-5 text-purple-600" />;
      case "activities":
        return <ChartBarIcon className="h-5 w-5 text-orange-600" />;
      case "behavior":
        return <UserGroupIcon className="h-5 w-5 text-red-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredReports = reports.filter((report) => {
    if (selectedChild !== "all" && report.childName !== selectedChild)
      return false;
    if (
      selectedReportType !== "all" &&
      report.reportType !== selectedReportType
    )
      return false;
    return true;
  });

  const uniqueChildren = [
    ...new Set(reports.map((report) => report.childName)),
  ];
  const uniqueReportTypes = [
    ...new Set(reports.map((report) => report.reportType)),
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
        <h1 className="text-2xl font-bold text-gray-900">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          Access comprehensive reports about your children's progress,
          attendance, and development
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
              Report Type
            </label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
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
              setSelectedChild("all");
              setSelectedReportType("all");
            }}
            className="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Reports Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reports.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Available</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reports.filter((r) => r.status === "available").length}
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
                {reports.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  reports.filter(
                    (r) => new Date(r.date).getMonth() === new Date().getMonth()
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            {/* Report Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getReportTypeIcon(report.reportType)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {report.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getReportTypeColor(
                      report.reportType
                    )}`}
                  >
                    {report.reportType.charAt(0).toUpperCase() +
                      report.reportType.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {report.status.charAt(0).toUpperCase() +
                      report.status.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                      report.priority
                    )}`}
                  >
                    {report.priority.charAt(0).toUpperCase() +
                      report.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Report Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
                    Report Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Child:</span>
                      <span className="font-medium">{report.childName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class:</span>
                      <span className="font-medium">{report.className}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Teacher:</span>
                      <span className="font-medium">{report.teacher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Period:</span>
                      <span className="font-medium">{report.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Generated:</span>
                      <span className="font-medium">
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Report Content */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-green-600 mr-2" />
                    Report Content
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Sections:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.sections.map((section, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Next Report:
                      </span>
                      <span className="text-sm font-medium ml-2">
                        {new Date(report.nextReport).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Documents & Summary */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-purple-600 mr-2" />
                    Summary & Files
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Summary:</span>
                      <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">
                        {report.summary}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Documents:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.documents.map((doc, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Report
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <ArrowDownIcon className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                    <ArrowUpIcon className="h-4 w-4 mr-2" />
                    Share Report
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Print Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Reports Message */}
      {filteredReports.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reports found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or check back later for new reports.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
