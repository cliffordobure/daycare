import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BuildingOfficeIcon,
  UserIcon,
  PhotoIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const CenterSetup = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [centerData, setCenterData] = useState({
    name: "",
    description: "",
    contactInfo: {
      email: "",
      phone: "",
      website: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      country: "Kenya",
      postalCode: "",
    },
    type: "daycare",
    capacity: "",
    ageRange: {
      min: "",
      max: "",
    },
    services: [],
    programs: [],
  });
  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const steps = [
    {
      id: 1,
      title: "Center Information",
      description: "Basic details about your daycare center",
      icon: BuildingOfficeIcon,
    },
    {
      id: 2,
      title: "Contact & Address",
      description: "How parents can reach you",
      icon: UserIcon,
    },
    {
      id: 3,
      title: "Services & Programs",
      description: "What you offer to children",
      icon: PhotoIcon,
    },
    {
      id: 4,
      title: "Admin Account",
      description: "Create your admin account",
      icon: UserIcon,
    },
    {
      id: 5,
      title: "Review & Complete",
      description: "Finalize your center setup",
      icon: CheckCircleIcon,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setCenterData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCenterData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayInputChange = (field, value) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setCenterData((prev) => ({
      ...prev,
      [field]: items,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Debug: Log the data being sent
      console.log("Center data:", centerData);
      console.log("Admin data:", adminData);

      // Validate admin data
      if (adminData.password !== adminData.confirmPassword) {
        alert("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      // Validate phone numbers
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
      
      if (!adminData.phone || adminData.phone.trim() === '') {
        alert("Please enter a valid phone number for the admin account");
        setIsSubmitting(false);
        return;
      }

      if (!phoneRegex.test(adminData.phone.trim())) {
        alert("Please enter a valid phone number for the admin account (e.g., +254700123456 or 0700123456)");
        setIsSubmitting(false);
        return;
      }

      if (!centerData.contactInfo.phone || centerData.contactInfo.phone.trim() === '') {
        alert("Please enter a valid phone number for the center");
        setIsSubmitting(false);
        return;
      }

      if (!phoneRegex.test(centerData.contactInfo.phone.trim())) {
        alert("Please enter a valid phone number for the center (e.g., +254700123456 or 0700123456)");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/centers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          centerData,
          adminData: {
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            email: adminData.email,
            phone: adminData.phone,
            password: adminData.password,
          },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success - redirect to login page
        alert("Center created successfully! Please login with your admin credentials.");
        navigate("/auth/login");
      } else {
        // Error - show specific validation errors
        if (result.errors && result.errors.length > 0) {
          const errorMessages = result.errors.map(error => error.msg).join('\n');
          alert(`Validation failed:\n${errorMessages}`);
        } else {
          alert(result.message || "Failed to create center. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error creating center:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Center Name *
              </label>
              <input
                type="text"
                name="name"
                value={centerData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your center name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                name="type"
                value={centerData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daycare">Daycare</option>
                <option value="preschool">Preschool</option>
                <option value="kindergarten">Kindergarten</option>
                <option value="nursery">Nursery</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={centerData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your center and what makes it special"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={centerData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Max number of children"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Age *
                </label>
                <input
                  type="number"
                  name="ageRange.min"
                  value={centerData.ageRange.min}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Age *
                </label>
                <input
                  type="number"
                  name="ageRange.max"
                  value={centerData.ageRange.max}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="6"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={centerData.contactInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="info@yourcenter.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={centerData.contactInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+254 700 123 456"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter phone number only (e.g., +254700123456 or 0700123456)
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="contactInfo.website"
                value={centerData.contactInfo.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="www.yourcenter.com"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={centerData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={centerData.address.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nairobi"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province *
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={centerData.address.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nairobi County"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="address.postalCode"
                  value={centerData.address.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="00100"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Services (comma-separated)
              </label>
              <input
                type="text"
                value={centerData.services.join(", ")}
                onChange={(e) =>
                  handleArrayInputChange("services", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Early Childhood Education, Nutrition, Health Monitoring"
              />
              <p className="text-sm text-gray-500 mt-1">
                List the main services your center provides
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programs (comma-separated)
              </label>
              <input
                type="text"
                value={centerData.programs.join(", ")}
                onChange={(e) =>
                  handleArrayInputChange("programs", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Preschool, Kindergarten, After-School Care"
              />
              <p className="text-sm text-gray-500 mt-1">
                List the educational programs you offer
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Create Your Admin Account
              </h3>
              <p className="text-blue-700">
                Set up your administrator account to manage your center.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={adminData.firstName}
                  onChange={handleAdminInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={adminData.lastName}
                  onChange={handleAdminInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={adminData.email}
                  onChange={handleAdminInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="admin@yourcenter.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={adminData.phone}
                  onChange={handleAdminInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+254 700 123 456"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter phone number only (e.g., +254700123456 or 0700123456)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={adminData.password}
                  onChange={handleAdminInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a secure password (min 8 characters)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={adminData.confirmPassword}
                  onChange={handleAdminInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Review Your Center Information
              </h3>
              <p className="text-blue-700">
                Please review all the information below before completing your
                center setup.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Center Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {centerData.name}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {centerData.type}
                  </div>
                  <div>
                    <span className="font-medium">Capacity:</span>{" "}
                    {centerData.capacity}
                  </div>
                  <div>
                    <span className="font-medium">Age Range:</span>{" "}
                    {centerData.ageRange.min}-{centerData.ageRange.max} years
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Contact Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {centerData.contactInfo.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {centerData.contactInfo.phone}
                  </div>
                  <div>
                    <span className="font-medium">Website:</span>{" "}
                    {centerData.contactInfo.website || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Admin Account</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {adminData.firstName} {adminData.lastName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {adminData.email}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {adminData.phone}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span> Administrator
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Address</h4>
              <div className="text-sm">
                {centerData.address.street}
                <br />
                {centerData.address.city}, {centerData.address.state}
                <br />
                {centerData.address.country} {centerData.address.postalCode}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {centerData.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Programs</h4>
                <div className="flex flex-wrap gap-2">
                  {centerData.programs.map((program, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {program}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <BuildingOfficeIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Nurtura!
          </h1>
          <p className="text-lg text-gray-600">
            Let's set up your daycare center. This will only take a few minutes.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="text-center flex-1">
                <div
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 text-sm font-medium rounded-lg ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Previous
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center"
                >
                  Next Step
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 text-sm font-medium rounded-lg flex items-center ${
                    isSubmitting
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Center...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircleIcon className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CenterSetup;

