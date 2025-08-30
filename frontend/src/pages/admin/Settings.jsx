import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  CogIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // Mock data for now
  useEffect(() => {
    setTimeout(() => {
      setSettings({
        general: {
          daycareName: "Bright Future Daycare",
          address: "123 Education Street, Learning City, LC 12345",
          phone: "+1 (555) 123-4567",
          email: "info@brightfuturedaycare.com",
          website: "www.brightfuturedaycare.com",
          operatingHours: "7:00 AM - 6:00 PM",
          timezone: "America/New_York",
        },
        academic: {
          maxClassSize: 20,
          teacherStudentRatio: "1:10",
          curriculumFramework: "Early Learning Standards",
          assessmentFrequency: "Monthly",
          progressReportSchedule: "Quarterly",
          parentConferenceFrequency: "Twice per year",
        },
        financial: {
          tuitionPaymentSchedule: "Monthly",
          lateFeeAmount: 25.0,
          lateFeeGracePeriod: 5,
          acceptedPaymentMethods: [
            "Credit Card",
            "Bank Transfer",
            "Cash",
            "Check",
          ],
          refundPolicy: "50% refund within first week, no refund after",
          depositRequired: true,
          depositAmount: 200.0,
        },
        health: {
          requireImmunizationRecords: true,
          requireHealthCheckup: true,
          healthCheckupFrequency: "Annually",
          emergencyContactRequired: true,
          allergyAwareness: true,
          medicationPolicy: "Prescription only, stored securely",
        },
        communication: {
          parentNotificationMethods: ["Email", "SMS", "App"],
          dailyReportFrequency: "Daily",
          incidentReportTimeframe: "Within 2 hours",
          parentPortalAccess: true,
          teacherParentCommunication: "Weekly updates",
        },
        security: {
          requirePhotoID: true,
          visitorLogRequired: true,
          emergencyEvacuationPlan: true,
          backgroundCheckRequired: true,
          securityCameras: true,
          accessControlSystem: true,
        },
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleEdit = (section) => {
    setEditingSection(section);
  };

  const handleSave = (section, newData) => {
    setSettings((prev) => ({
      ...prev,
      [section]: newData,
    }));
    setEditingSection(null);
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

  const renderSettingItem = (key, value, section) => {
    const isEditing = editingSection === section;

    if (isEditing) {
      if (typeof value === "boolean") {
        return (
          <select
            defaultValue={value.toString()}
            onChange={(e) => {
              const newData = {
                ...settings[section],
                [key]: e.target.value === "true",
              };
              setSettings((prev) => ({ ...prev, [section]: newData }));
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      } else if (Array.isArray(value)) {
        return (
          <input
            type="text"
            defaultValue={value.join(", ")}
            onChange={(e) => {
              const newData = {
                ...settings[section],
                [key]: e.target.value.split(", ").map((item) => item.trim()),
              };
              setSettings((prev) => ({ ...prev, [section]: newData }));
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
          />
        );
      } else if (typeof value === "number") {
        return (
          <input
            type="number"
            defaultValue={value}
            onChange={(e) => {
              const newData = {
                ...settings[section],
                [key]: parseFloat(e.target.value),
              };
              setSettings((prev) => ({ ...prev, [section]: newData }));
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
          />
        );
      } else {
        return (
          <input
            type="text"
            defaultValue={value}
            onChange={(e) => {
              const newData = { ...settings[section], [key]: e.target.value };
              setSettings((prev) => ({ ...prev, [section]: newData }));
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
          />
        );
      }
    }

    if (typeof value === "boolean") {
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      );
    } else if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      );
    } else if (typeof value === "number") {
      return <span className="font-medium">{value}</span>;
    } else {
      return <span className="text-gray-900">{value}</span>;
    }
  };

  const renderSettingsSection = (
    sectionKey,
    sectionData,
    title,
    icon,
    description
  ) => {
    const isEditing = editingSection === sectionKey;

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {icon}
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleSave(sectionKey, settings[sectionKey])}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 flex items-center"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit(sectionKey)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(sectionData).map(([key, value]) => (
            <div key={key} className="border-b border-gray-100 pb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <div className="text-sm">
                {renderSettingItem(key, value, sectionKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
        <div className="flex items-center">
          <CogIcon className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              System Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Configure and manage all system settings for the daycare
            </p>
          </div>
        </div>
      </div>

      {/* Save Message */}
      {showSaveMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Settings saved successfully!
            </span>
          </div>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {renderSettingsSection(
          "general",
          settings.general,
          "General Information",
          <GlobeAltIcon className="h-6 w-6 text-blue-600" />,
          "Basic daycare information and contact details"
        )}

        {renderSettingsSection(
          "academic",
          settings.academic,
          "Academic Settings",
          <AcademicCapIcon className="h-6 w-6 text-green-600" />,
          "Class sizes, curriculum, and assessment settings"
        )}

        {renderSettingsSection(
          "financial",
          settings.financial,
          "Financial Settings",
          <CreditCardIcon className="h-6 w-6 text-purple-600" />,
          "Payment policies, fees, and refund settings"
        )}

        {renderSettingsSection(
          "health",
          settings.health,
          "Health & Safety",
          <ShieldCheckIcon className="h-6 w-6 text-red-600" />,
          "Health requirements and safety policies"
        )}

        {renderSettingsSection(
          "communication",
          settings.communication,
          "Communication",
          <BellIcon className="h-6 w-6 text-yellow-600" />,
          "Parent communication and notification settings"
        )}

        {renderSettingsSection(
          "security",
          settings.security,
          "Security & Access",
          <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />,
          "Security policies and access control settings"
        )}
      </div>

      {/* Additional Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Additional Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <DocumentTextIcon className="h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Export Settings</h4>
            <p className="text-sm text-gray-500">
              Download current settings as JSON
            </p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <DocumentTextIcon className="h-8 w-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Import Settings</h4>
            <p className="text-sm text-gray-500">
              Upload settings from JSON file
            </p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mb-2" />
            <h4 className="font-medium text-gray-900">Reset to Defaults</h4>
            <p className="text-sm text-gray-500">
              Restore all default settings
            </p>
          </button>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          System Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">System Version:</span>
            <span className="ml-2 text-gray-900">1.0.0</span>
          </div>
          <div>
            <span className="text-gray-500">Last Updated:</span>
            <span className="ml-2 text-gray-900">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Database Version:</span>
            <span className="ml-2 text-gray-900">1.0.0</span>
          </div>
          <div>
            <span className="text-gray-500">Environment:</span>
            <span className="ml-2 text-gray-900">Production</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
