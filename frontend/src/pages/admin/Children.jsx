import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  AcademicCapIcon,
  CalendarIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  fetchChildren,
  fetchChildStats,
  createChild,
  updateChild,
  deleteChild,
  clearChildError,
  clearChildSuccess,
} from "../../store/slices/childSlice";
import { fetchCenterUsers } from "../../store/slices/centerSlice";
import {
  selectChildren,
  selectChildLoading,
  selectChildError,
  selectChildSuccess,
  selectChildStats,
  selectChildPagination,
} from "../../store/slices/childSlice";
import {
  selectCurrentCenter,
  selectCenterUsers,
} from "../../store/slices/centerSlice";

const Children = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const currentCenter = useSelector(selectCurrentCenter);
  const centerUsers = useSelector(selectCenterUsers);
  
  // Child state
  const children = useSelector(selectChildren);
  const loading = useSelector(selectChildLoading);
  const error = useSelector(selectChildError);
  const success = useSelector(selectChildSuccess);
  const stats = useSelector(selectChildStats);
  const pagination = useSelector(selectChildPagination);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [childToDelete, setChildToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
    parents: [],
    emergencyContacts: [],
    enrollmentStatus: "enrolled",
    currentClass: "",
    health: {
      allergies: [],
      medicalConditions: [],
    },
    dietary: {
      restrictions: [],
      preferences: [],
    },
    notes: "",
  });

  // Load data when component mounts
  useEffect(() => {
    if (currentCenter?._id) {
      loadData();
    }
  }, [currentCenter, currentPage, searchTerm, selectedStatus, selectedClass]);

  // Load center users for parent selection
  useEffect(() => {
    if (currentCenter?._id) {
      dispatch(fetchCenterUsers({ 
        centerId: currentCenter._id, 
        params: { role: "parent", limit: 100 } 
      }));
    }
  }, [dispatch, currentCenter]);

  // Load child statistics
  useEffect(() => {
    if (currentCenter?._id) {
      dispatch(fetchChildStats({ centerId: currentCenter._id }));
    }
  }, [dispatch, currentCenter]);

  const loadData = () => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: selectedStatus !== "all" ? selectedStatus : "",
      classId: selectedClass !== "all" ? selectedClass : "",
      centerId: currentCenter._id,
    };
    dispatch(fetchChildren(params));
  };

  // Clear messages after timeout
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearChildSuccess());
      }, 3000);
    }
    if (error) {
      setTimeout(() => {
        dispatch(clearChildError());
      }, 5000);
    }
  }, [success, error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clean up form data before sending
    const cleanFormData = {
      ...formData,
      // Convert empty strings to undefined for optional fields
      currentClass: formData.currentClass || undefined,
      notes: formData.notes || undefined,
      // Ensure arrays are properly formatted
      emergencyContacts: formData.emergencyContacts || [],
      health: {
        allergies: formData.health?.allergies || [],
        medicalConditions: formData.health?.medicalConditions || [],
      },
      dietary: {
        restrictions: formData.dietary?.restrictions || [],
        preferences: formData.dietary?.preferences || [],
      },
    };
    
    try {
      if (editingChild) {
        await dispatch(updateChild({ 
          childId: editingChild._id, 
          updateData: cleanFormData 
        })).unwrap();
      } else {
        await dispatch(createChild(cleanFormData)).unwrap();
      }
      
      setShowAddModal(false);
      setEditingChild(null);
      resetForm();
      loadData(); // Refresh the list
    } catch (error) {
      console.error("Failed to save child:", error);
    }
  };

  const handleEdit = (child) => {
    setEditingChild(child);
    setFormData({
      firstName: child.firstName,
      lastName: child.lastName,
      dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split('T')[0] : "",
      gender: child.gender,
      parents: child.parents?.map(p => p._id || p) || [],
      emergencyContacts: child.emergencyContacts || [],
      enrollmentStatus: child.enrollmentStatus,
      currentClass: child.currentClass?._id || child.currentClass || undefined,
      health: {
        allergies: child.health?.allergies?.map(a => a.allergen || a) || [],
        medicalConditions: child.health?.medicalConditions || [],
      },
      dietary: {
        restrictions: child.dietary?.restrictions || [],
        preferences: child.dietary?.preferences || [],
      },
      notes: child.notes?.[0]?.content || undefined,
    });
    setShowAddModal(true);
  };

  const handleDelete = (child) => {
    setChildToDelete(child);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (childToDelete) {
      try {
        await dispatch(deleteChild(childToDelete._id)).unwrap();
        setShowDeleteModal(false);
        setChildToDelete(null);
        loadData(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete child:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male",
      parents: [],
      emergencyContacts: [],
      enrollmentStatus: "enrolled",
      currentClass: undefined,
      health: {
        allergies: [],
        medicalConditions: [],
      },
      dietary: {
        restrictions: [],
        preferences: [],
      },
      notes: undefined,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "enrolled":
        return "text-green-600 bg-green-100";
      case "waitlisted":
        return "text-yellow-600 bg-yellow-100";
      case "withdrawn":
        return "text-red-600 bg-red-100";
      case "graduated":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getGenderIcon = (gender) => {
    return gender === "female" ? "👧" : "👦";
  };

  const filteredChildren = children || [];

  if (loading && children.length === 0) {
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
              Children Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all children enrolled in {currentCenter?.name || "the daycare"}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingChild(null);
              resetForm();
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Child
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-5 w-5 text-green-400" />
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
              <UserGroupIcon className="h-5 w-5 text-red-400" />
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
                placeholder="Search by child name..."
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
              <option value="enrolled">Enrolled</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedStatus("all");
              setSelectedClass("all");
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
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Children</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalChildren || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Enrolled</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activeChildren || 0}
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
              <p className="text-sm font-medium text-gray-500">Waitlisted</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.waitlistedChildren || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HeartIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">With Allergies</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.childrenWithAllergies || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Children List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Children List</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Child
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Enrollment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChildren.map((child) => (
                <tr key={child._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-lg">
                            {getGenderIcon(child.gender)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {child.firstName} {child.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {child.age} years old
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {child._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {child.parents?.map((parent, index) => (
                      <div key={parent._id || index} className="text-sm text-gray-900">
                        {parent.firstName} {parent.lastName}
                      </div>
                    ))}
                    {child.emergencyContacts?.length > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        Emergency: {child.emergencyContacts[0].name}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        child.enrollmentStatus
                      )}`}
                    >
                      {child.enrollmentStatus.charAt(0).toUpperCase() +
                        child.enrollmentStatus.slice(1)}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      Enrolled: {new Date(child.enrollmentDate).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {child.health?.allergies?.length > 0 ? (
                        <span className="text-red-600">
                          ⚠️ {child.health.allergies.map(a => a.allergen || a).join(", ")}
                        </span>
                      ) : (
                        <span className="text-green-600">✅ No allergies</span>
                      )}
                    </div>
                    {child.health?.medicalConditions?.length > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        Medical conditions present
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(child)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(child)}
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

        {filteredChildren.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No children found
            </h3>
            <p className="text-gray-500">
              {loading ? "Loading children..." : "Try adjusting your search or filters."}
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
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingChild ? "Edit Child" : "Add New Child"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingChild(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parents *
                </label>
                <select
                  multiple
                  required
                  value={formData.parents}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    parents: Array.from(e.target.selectedOptions, option => option.value) 
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {centerUsers
                    .filter(user => user.role === "parent")
                    .map(user => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Hold Ctrl (or Cmd on Mac) to select multiple parents
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enrollment Status
                </label>
                <select
                  value={formData.enrollmentStatus}
                  onChange={(e) => setFormData({ ...formData, enrollmentStatus: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="enrolled">Enrolled</option>
                  <option value="waitlisted">Waitlisted</option>
                  <option value="withdrawn">Withdrawn</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>

                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Current Class (Optional)
                 </label>
                 <select
                   value={formData.currentClass || ""}
                   onChange={(e) => setFormData({ ...formData, currentClass: e.target.value || undefined })}
                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 >
                   <option value="">No class assigned</option>
                   {/* TODO: Add class options when classes are implemented */}
                 </select>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Notes
                 </label>
                 <textarea
                   value={formData.notes || ""}
                   onChange={(e) => setFormData({ ...formData, notes: e.target.value || undefined })}
                   rows={3}
                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Any additional notes about the child..."
                 />
               </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingChild(null);
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
                  {loading ? "Saving..." : editingChild ? "Update Child" : "Add Child"}
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
                Delete Child
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to delete {childToDelete?.firstName} {childToDelete?.lastName}? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setChildToDelete(null);
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

export default Children;

