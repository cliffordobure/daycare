import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AcademicCapIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  UsersIcon,
  CalendarIcon,
  XMarkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import {
  fetchClasses,
  fetchClassStats,
  createClass,
  updateClass,
  deleteClass,
  clearClassError,
  clearClassSuccess,
} from "../../store/slices/classSlice";
import { fetchCenterUsers } from "../../store/slices/centerSlice";
import {
  selectClasses,
  selectClassLoading,
  selectClassError,
  selectClassSuccess,
  selectClassStats,
  selectClassPagination,
} from "../../store/slices/classSlice";
import {
  selectCurrentCenter,
  selectCenterUsers,
} from "../../store/slices/centerSlice";

const Classes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const currentCenter = useSelector(selectCurrentCenter);
  const centerUsers = useSelector(selectCenterUsers);
  
  // Class state
  const classes = useSelector(selectClasses);
  const loading = useSelector(selectClassLoading);
  const error = useSelector(selectClassError);
  const success = useSelector(selectClassSuccess);
  const stats = useSelector(selectClassStats);
  const pagination = useSelector(selectClassPagination);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTerm, setSelectedTerm] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ageGroup: {
      minAge: "",
      maxAge: "",
    },
    capacity: "",
    schedule: {
      days: [],
      startTime: "",
      endTime: "",
      duration: "",
    },
    curriculum: "",
    learningObjectives: [],
    activities: [],
    materials: [],
    teachers: [],
    assistants: [],
    room: {
      name: "",
      number: "",
      capacity: "",
      facilities: [],
      notes: "",
    },
    academicYear: "",
    term: "full-year",
    startDate: "",
    endDate: "",
    tuition: {
      monthly: "",
      registration: "",
      materials: "",
    },
    policies: [],
    requirements: [],
    specialInstructions: "",
  });

  // Load data when component mounts
  useEffect(() => {
    if (currentCenter?._id) {
      loadData();
    }
  }, [currentCenter, currentPage, searchTerm, selectedStatus, selectedTerm]);

  // Load center users for teacher selection
  useEffect(() => {
    if (currentCenter?._id) {
      dispatch(fetchCenterUsers({ 
        centerId: currentCenter._id, 
        params: { role: "teacher", limit: 100 } 
      }));
    }
  }, [dispatch, currentCenter]);

  // Load class statistics
  useEffect(() => {
    if (currentCenter?._id) {
      dispatch(fetchClassStats({ centerId: currentCenter._id }));
    }
  }, [dispatch, currentCenter]);

  const loadData = () => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: selectedStatus !== "all" ? selectedStatus : "",
      term: selectedTerm !== "all" ? selectedTerm : "",
      centerId: currentCenter._id,
    };
    dispatch(fetchClasses(params));
  };

  // Clear messages after timeout
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearClassSuccess());
      }, 3000);
    }
    if (error) {
      setTimeout(() => {
        dispatch(clearClassError());
      }, 5000);
    }
  }, [success, error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clean up form data before sending
    const cleanFormData = {
      ...formData,
      ageGroup: {
        minAge: parseInt(formData.ageGroup.minAge),
        maxAge: parseInt(formData.ageGroup.maxAge),
      },
      capacity: parseInt(formData.capacity),
      schedule: {
        ...formData.schedule,
        duration: parseInt(formData.schedule.duration),
      },
      room: {
        ...formData.room,
        capacity: formData.room.capacity ? parseInt(formData.room.capacity) : undefined,
      },
      tuition: {
        monthly: parseFloat(formData.tuition.monthly),
        registration: parseFloat(formData.tuition.registration) || 0,
        materials: parseFloat(formData.tuition.materials) || 0,
      },
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };
    
    try {
      if (editingClass) {
        await dispatch(updateClass({ 
          classId: editingClass._id, 
          updateData: cleanFormData 
        })).unwrap();
      } else {
        await dispatch(createClass(cleanFormData)).unwrap();
      }
      
      setShowAddModal(false);
      setEditingClass(null);
      resetForm();
      loadData(); // Refresh the list
    } catch (error) {
      console.error("Failed to save class:", error);
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      description: classItem.description || "",
      ageGroup: {
        minAge: classItem.ageGroup.minAge.toString(),
        maxAge: classItem.ageGroup.maxAge.toString(),
      },
      capacity: classItem.capacity.toString(),
      schedule: {
        days: classItem.schedule.days || [],
        startTime: classItem.schedule.startTime,
        endTime: classItem.schedule.endTime,
        duration: classItem.schedule.duration.toString(),
      },
      curriculum: classItem.curriculum || "",
      learningObjectives: classItem.learningObjectives || [],
      activities: classItem.activities || [],
      materials: classItem.materials || [],
      teachers: classItem.teachers?.map(t => t._id || t) || [],
      assistants: classItem.assistants?.map(a => a._id || a) || [],
      room: {
        name: classItem.room?.name || "",
        number: classItem.room?.number || "",
        capacity: classItem.room?.capacity?.toString() || "",
        facilities: classItem.room?.facilities || [],
        notes: classItem.room?.notes || "",
      },
      academicYear: classItem.academicYear,
      term: classItem.term,
      startDate: classItem.startDate ? new Date(classItem.startDate).toISOString().split('T')[0] : "",
      endDate: classItem.endDate ? new Date(classItem.endDate).toISOString().split('T')[0] : "",
      tuition: {
        monthly: classItem.tuition.monthly.toString(),
        registration: classItem.tuition.registration?.toString() || "0",
        materials: classItem.tuition.materials?.toString() || "0",
      },
      policies: classItem.policies || [],
      requirements: classItem.requirements || [],
      specialInstructions: classItem.specialInstructions || "",
    });
    setShowAddModal(true);
  };

  const handleDelete = (classItem) => {
    setClassToDelete(classItem);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {  
    if (classToDelete) {
      try {
        await dispatch(deleteClass(classToDelete._id)).unwrap();
        setShowDeleteModal(false);
        setClassToDelete(null);
        loadData(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete class:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      ageGroup: {
        minAge: "",
        maxAge: "",
      },
      capacity: "",
      schedule: {
        days: [],
        startTime: "",
        endTime: "",
        duration: "",
      },
      curriculum: "",
      learningObjectives: [],
      activities: [],
      materials: [],
      teachers: [],
      assistants: [],
      room: {
        name: "",
        number: "",
        capacity: "",
        facilities: [],
        notes: "",
      },
      academicYear: "",
      term: "full-year",
      startDate: "",
      endDate: "",
      tuition: {
        monthly: "",
        registration: "",
        materials: "",
      },
      policies: [],
      requirements: [],
      specialInstructions: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "inactive":
        return "text-gray-600 bg-gray-100";
      case "full":
        return "text-red-600 bg-red-100";
      case "waitlist":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getEnrollmentColor = (rate) => {
    if (rate >= 90) return "text-red-600";
    if (rate >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const filteredClasses = classes || [];

  if (loading && classes.length === 0) {
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
              Classes Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all classes in {currentCenter?.name || "the daycare"}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingClass(null);
              resetForm();
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Class
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by class name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="full">Full</option>
              <option value="waitlist">Waitlist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Terms</option>
              <option value="fall">Fall</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="full-year">Full Year</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedStatus("all");
              setSelectedTerm("all");
              setCurrentPage(1);
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
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Classes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalClasses || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Active Classes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activeClasses || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Enrollment</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalEnrollment || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Avg. Enrollment Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.averageEnrollmentRate || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Classes List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Classes List</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule & Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teachers & Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.map((classItem) => (
                <tr key={classItem._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {classItem.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {classItem.ageRange} • {classItem.term}
                        </div>
                        <div className="text-sm text-gray-500">
                          {classItem.academicYear}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {classItem.scheduleDisplay}
                    </div>
                    <div className="text-sm text-gray-500">
                      Duration: {classItem.schedule.duration} min
                    </div>
                    <div className="text-sm text-gray-500">
                      {classItem.schedule.days.length} day{classItem.schedule.days.length !== 1 ? 's' : ''} per week
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        classItem.status
                      )}`}
                    >
                      {classItem.status.charAt(0).toUpperCase() +
                        classItem.status.slice(1)}
                    </span>
                    <div className="text-sm text-gray-900 mt-1">
                      {classItem.currentEnrollment}/{classItem.capacity} students
                    </div>
                    <div className={`text-sm font-medium ${getEnrollmentColor(classItem.enrollmentRate)}`}>
                      {classItem.enrollmentRate}% full
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {classItem.teachers?.map((teacher, index) => (
                        <div key={teacher._id || index}>
                          {teacher.firstName} {teacher.lastName}
                        </div>
                      ))}
                    </div>
                    {classItem.room?.name && (
                      <div className="text-sm text-gray-500 mt-1">
                        <MapPinIcon className="h-4 w-4 inline mr-1" />
                        {classItem.room.name}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(classItem)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(classItem)}
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

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No classes found
            </h3>
            <p className="text-gray-500">
              {loading ? "Loading classes..." : "Try adjusting your search or filters."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingClass ? "Edit Class" : "Add New Class"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingClass(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="e.g., 2024-2025"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the class..."
                />
              </div>

              {/* Age Group and Capacity */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Age *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.ageGroup.minAge}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      ageGroup: { ...formData.ageGroup, minAge: e.target.value } 
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Age *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.ageGroup.maxAge}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      ageGroup: { ...formData.ageGroup, maxAge: e.target.value } 
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.schedule.startTime}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      schedule: { ...formData.schedule, startTime: e.target.value } 
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.schedule.endTime}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      schedule: { ...formData.schedule, endTime: e.target.value } 
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (min) *
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    value={formData.schedule.duration}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      schedule: { ...formData.schedule, duration: e.target.value } 
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days of Week *
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.schedule.days.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              schedule: {
                                ...formData.schedule,
                                days: [...formData.schedule.days, day]
                              }
                            });
                          } else {
                            setFormData({
                              ...formData,
                              schedule: {
                                ...formData.schedule,
                                days: formData.schedule.days.filter(d => d !== day)
                              }
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {day.slice(0, 3)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Teachers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teachers *
                </label>
                <select
                  multiple
                  required
                  value={formData.teachers}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    teachers: Array.from(e.target.selectedOptions, option => option.value) 
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {centerUsers
                    .filter(user => user.role === "teacher")
                    .map(user => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Hold Ctrl (or Cmd on Mac) to select multiple teachers
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term
                  </label>
                  <select
                    value={formData.term}
                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="fall">Fall</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="full-year">Full Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tuition */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Tuition *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.tuition.monthly}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      tuition: { ...formData.tuition, monthly: e.target.value } 
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Fee
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tuition.registration}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      tuition: { ...formData.tuition, registration: e.target.value } 
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Materials Fee
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tuition.materials}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      tuition: { ...formData.tuition, materials: e.target.value } 
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingClass(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingClass ? "Update Class" : "Add Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Delete Class
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to delete {classToDelete?.name}? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setClassToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
