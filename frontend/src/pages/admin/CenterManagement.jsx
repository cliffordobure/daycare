import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const CenterManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactInfo: {
      email: "",
      phone: "",
      website: "",
      emergencyPhone: "",
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
    operatingHours: {
      monday: { open: "08:00", close: "17:00", isOpen: true },
      tuesday: { open: "08:00", close: "17:00", isOpen: true },
      wednesday: { open: "08:00", close: "17:00", isOpen: true },
      thursday: { open: "08:00", close: "17:00", isOpen: true },
      friday: { open: "08:00", close: "17:00", isOpen: true },
      saturday: { open: "08:00", close: "17:00", isOpen: false },
      sunday: { open: "08:00", close: "17:00", isOpen: false },
    },
    services: [],
    programs: [],
    facilities: [],
    currency: "KES",
    paymentMethods: [],
  });

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setCenters([
        {
          id: 1,
          name: "Nurtura Daycare Center",
          description:
            "A nurturing environment for children to learn, grow, and develop",
          contactInfo: {
            email: "info@nurtura.com",
            phone: "+254 700 123 456",
            website: "www.nurtura.com",
            emergencyPhone: "+254 700 123 457",
          },
          address: {
            street: "123 Main Street",
            city: "Nairobi",
            state: "Nairobi County",
            country: "Kenya",
            postalCode: "00100",
          },
          type: "daycare",
          capacity: 100,
          ageRange: { min: 0, max: 6 },
          operatingHours: {
            monday: { open: "08:00", close: "17:00", isOpen: true },
            tuesday: { open: "08:00", close: "17:00", isOpen: true },
            wednesday: { open: "08:00", close: "17:00", isOpen: true },
            thursday: { open: "08:00", close: "17:00", isOpen: true },
            friday: { open: "08:00", close: "17:00", isOpen: true },
            saturday: { open: "08:00", close: "17:00", isOpen: false },
            sunday: { open: "08:00", close: "17:00", isOpen: false },
          },
          services: [
            "Early Childhood Education",
            "Nutrition",
            "Health Monitoring",
          ],
          programs: ["Preschool", "Kindergarten", "After-School Care"],
          facilities: ["Classrooms", "Playground", "Kitchen", "Medical Room"],
          currency: "KES",
          paymentMethods: ["Cash", "Bank Transfer", "Mobile Money"],
          images: {
            logo: "/logo.png",
            coverPhoto: "/cover.jpg",
            gallery: ["/gallery1.jpg", "/gallery2.jpg"],
          },
          staff: 15,
          students: 75,
          isActive: true,
          isVerified: true,
          createdAt: "2024-01-15",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayInputChange = (field, value) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({
      ...prev,
      [field]: items,
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: field === "isOpen" ? value === "true" : value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showEditModal && selectedCenter) {
      // Update existing center
      setCenters((prev) =>
        prev.map((center) =>
          center.id === selectedCenter.id ? { ...center, ...formData } : center
        )
      );
      setShowEditModal(false);
    } else {
      // Create new center
      const newCenter = {
        id: Date.now(),
        ...formData,
        staff: 0,
        students: 0,
        isActive: true,
        isVerified: false,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCenters((prev) => [...prev, newCenter]);
      setShowCreateModal(false);
    }
    setSelectedCenter(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      contactInfo: {
        email: "",
        phone: "",
        website: "",
        emergencyPhone: "",
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
      operatingHours: {
        monday: { open: "08:00", close: "17:00", isOpen: true },
        tuesday: { open: "08:00", close: "17:00", isOpen: true },
        wednesday: { open: "08:00", close: "17:00", isOpen: true },
        thursday: { open: "08:00", close: "17:00", isOpen: true },
        friday: { open: "08:00", close: "17:00", isOpen: true },
        saturday: { open: "08:00", close: "17:00", isOpen: false },
        sunday: { open: "08:00", close: "17:00", isOpen: false },
      },
      services: [],
      programs: [],
      facilities: [],
      currency: "KES",
      paymentMethods: [],
    });
  };

  const handleEdit = (center) => {
    setSelectedCenter(center);
    setFormData({
      name: center.name,
      description: center.description,
      contactInfo: center.contactInfo,
      address: center.address,
      type: center.type,
      capacity: center.capacity,
      ageRange: center.ageRange,
      operatingHours: center.operatingHours,
      services: center.services,
      programs: center.programs,
      facilities: center.facilities,
      currency: center.currency,
      paymentMethods: center.paymentMethods,
    });
    setShowEditModal(true);
  };

  const handleView = (center) => {
    setSelectedCenter(center);
    setShowViewModal(true);
  };

  const handleDelete = (centerId) => {
    if (window.confirm("Are you sure you want to delete this center?")) {
      setCenters((prev) => prev.filter((center) => center.id !== centerId));
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Center Management
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage daycare centers and schools
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Center
          </button>
        </div>
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centers.map((center) => (
          <div
            key={center.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            {/* Center Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {center.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {center.type}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(center)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(center)}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(center.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{center.description}</p>

              {/* Center Info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {center.address.city}, {center.address.state}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {center.contactInfo.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {center.contactInfo.email}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">
                      {center.capacity}
                    </div>
                    <div className="text-xs text-gray-500">Capacity</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {center.students}
                    </div>
                    <div className="text-xs text-gray-500">Students</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600">
                      {center.staff}
                    </div>
                    <div className="text-xs text-gray-500">Staff</div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    center.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {center.isActive ? "Active" : "Inactive"}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    center.isVerified
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {center.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {showEditModal ? "Edit Center" : "Create New Center"}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Center Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Contact Information */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="contactInfo.email"
                        value={formData.contactInfo.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        value={formData.contactInfo.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        name="contactInfo.website"
                        value={formData.contactInfo.website}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Phone
                      </label>
                      <input
                        type="tel"
                        name="contactInfo.emergencyPhone"
                        value={formData.contactInfo.emergencyPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Center Details */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Center Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity *
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        value={formData.ageRange.min}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        value={formData.ageRange.max}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Services and Programs */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Services & Programs
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Services (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.services.join(", ")}
                        onChange={(e) =>
                          handleArrayInputChange("services", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Early Childhood Education, Nutrition, Health Monitoring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Programs (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.programs.join(", ")}
                        onChange={(e) =>
                          handleArrayInputChange("programs", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Preschool, Kindergarten, After-School Care"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {showEditModal ? "Update Center" : "Create Center"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedCenter && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Center Details
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Center Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedCenter.name}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>{" "}
                        {selectedCenter.type}
                      </div>
                      <div>
                        <span className="font-medium">Capacity:</span>{" "}
                        {selectedCenter.capacity}
                      </div>
                      <div>
                        <span className="font-medium">Age Range:</span>{" "}
                        {selectedCenter.ageRange.min}-
                        {selectedCenter.ageRange.max} years
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedCenter.contactInfo.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedCenter.contactInfo.phone}
                      </div>
                      <div>
                        <span className="font-medium">Website:</span>{" "}
                        {selectedCenter.contactInfo.website || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Emergency:</span>{" "}
                        {selectedCenter.contactInfo.emergencyPhone || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                  <div className="text-sm">
                    {selectedCenter.address.street}
                    <br />
                    {selectedCenter.address.city},{" "}
                    {selectedCenter.address.state}
                    <br />
                    {selectedCenter.address.country}{" "}
                    {selectedCenter.address.postalCode}
                  </div>
                </div>

                {/* Services and Programs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCenter.services.map((service, index) => (
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
                    <h4 className="font-medium text-gray-900 mb-2">Programs</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCenter.programs.map((program, index) => (
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

                {/* Operating Hours */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Operating Hours
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {Object.entries(selectedCenter.operatingHours).map(
                      ([day, hours]) => (
                        <div
                          key={day}
                          className="flex items-center justify-between"
                        >
                          <span className="capitalize">{day}</span>
                          <span
                            className={
                              hours.isOpen ? "text-green-600" : "text-red-600"
                            }
                          >
                            {hours.isOpen
                              ? `${hours.open} - ${hours.close}`
                              : "Closed"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Center Statistics
                  </h4>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedCenter.capacity}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Capacity
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedCenter.students}
                      </div>
                      <div className="text-sm text-gray-600">
                        Current Students
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedCenter.staff}
                      </div>
                      <div className="text-sm text-gray-600">Staff Members</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CenterManagement;

