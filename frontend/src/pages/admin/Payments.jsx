import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  CreditCardIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

const Payments = () => {
  const { user } = useSelector((state) => state.auth);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentType, setSelectedPaymentType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  // Mock data for now
  useEffect(() => {
    setTimeout(() => {
      setPayments([
        {
          id: 1,
          childId: 1,
          childName: "Emma Johnson",
          className: "Preschool A",
          parentName: "John Johnson",
          parentEmail: "john.johnson@email.com",
          paymentType: "tuition",
          amount: 850.0,
          dueDate: "2024-12-01",
          paidDate: "2024-11-28",
          status: "paid",
          method: "credit_card",
          transactionId: "TXN-001-2024",
          description: "November 2024 Tuition",
          lateFees: 0.0,
          totalAmount: 850.0,
          notes: "Payment received on time",
          receipt: "receipt_001.pdf",
        },
        {
          id: 2,
          childId: 2,
          childName: "Lucas Johnson",
          className: "Kindergarten B",
          parentName: "John Johnson",
          parentEmail: "john.johnson@email.com",
          paymentType: "tuition",
          amount: 950.0,
          dueDate: "2024-12-01",
          paidDate: "2024-11-30",
          status: "paid",
          method: "bank_transfer",
          transactionId: "TXN-002-2024",
          description: "November 2024 Tuition",
          lateFees: 0.0,
          totalAmount: 950.0,
          notes: "Payment received on time",
          receipt: "receipt_002.pdf",
        },
        {
          id: 3,
          childId: 3,
          childName: "Sophia Rodriguez",
          className: "Preschool B",
          parentName: "Carlos Rodriguez",
          parentEmail: "carlos.rodriguez@email.com",
          paymentType: "tuition",
          amount: 900.0,
          dueDate: "2024-12-01",
          paidDate: null,
          status: "overdue",
          method: null,
          transactionId: null,
          description: "November 2024 Tuition",
          lateFees: 25.0,
          totalAmount: 925.0,
          notes: "Payment overdue - reminder sent",
          receipt: null,
        },
        {
          id: 4,
          childId: 4,
          childName: "Aiden Thompson",
          className: "Toddler A",
          parentName: "David Thompson",
          parentEmail: "david.thompson@email.com",
          paymentType: "tuition",
          amount: 800.0,
          dueDate: "2024-12-01",
          paidDate: "2024-12-02",
          status: "paid",
          method: "cash",
          transactionId: "TXN-004-2024",
          description: "November 2024 Tuition",
          lateFees: 25.0,
          totalAmount: 825.0,
          notes: "Payment received with late fee",
          receipt: "receipt_004.pdf",
        },
        {
          id: 5,
          childId: 5,
          childName: "Isabella Chen",
          className: "Grade 1A",
          parentName: "James Chen",
          parentEmail: "james.chen@email.com",
          paymentType: "tuition",
          amount: 1000.0,
          dueDate: "2024-12-01",
          paidDate: null,
          status: "pending",
          method: null,
          transactionId: null,
          description: "November 2024 Tuition",
          lateFees: 0.0,
          totalAmount: 1000.0,
          notes: "Payment pending - due soon",
          receipt: null,
        },
        {
          id: 6,
          childId: 6,
          childName: "Maya Patel",
          className: "Preschool A",
          parentName: "Priya Patel",
          parentEmail: "priya.patel@email.com",
          paymentType: "activity_fee",
          amount: 150.0,
          dueDate: "2024-12-15",
          paidDate: null,
          status: "pending",
          method: null,
          transactionId: null,
          description: "December Activity Fee",
          lateFees: 0.0,
          totalAmount: 150.0,
          notes: "Activity fee for special programs",
          receipt: null,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "overdue":
        return "text-red-600 bg-red-100";
      case "cancelled":
        return "text-gray-600 bg-gray-100";
      case "refunded":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPaymentTypeColor = (type) => {
    switch (type) {
      case "tuition":
        return "text-blue-600 bg-blue-100";
      case "activity_fee":
        return "text-green-600 bg-green-100";
      case "late_fee":
        return "text-red-600 bg-red-100";
      case "deposit":
        return "text-purple-600 bg-purple-100";
      case "other":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "credit_card":
        return "text-blue-600 bg-blue-100";
      case "bank_transfer":
        return "text-green-600 bg-green-100";
      case "cash":
        return "text-yellow-600 bg-yellow-100";
      case "check":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case "overdue":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-gray-600" />;
      case "refunded":
        return <ArrowDownIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || payment.className === selectedClass;
    const matchesStatus =
      selectedStatus === "all" || payment.status === selectedStatus;
    const matchesPaymentType =
      selectedPaymentType === "all" ||
      payment.paymentType === selectedPaymentType;

    return matchesSearch && matchesClass && matchesStatus && matchesPaymentType;
  });

  const uniqueClasses = [
    ...new Set(payments.map((payment) => payment.className)),
  ];
  const uniqueStatuses = [
    ...new Set(payments.map((payment) => payment.status)),
  ];
  const uniquePaymentTypes = [
    ...new Set(payments.map((payment) => payment.paymentType)),
  ];

  const getPaymentStats = () => {
    const total = payments.length;
    const paid = payments.filter((p) => p.status === "paid").length;
    const pending = payments.filter((p) => p.status === "pending").length;
    const overdue = payments.filter((p) => p.status === "overdue").length;
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalCollected = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.totalAmount, 0);

    return { total, paid, pending, overdue, totalAmount, totalCollected };
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowAddModal(true);
  };

  const handleDelete = (paymentId) => {
    if (
      window.confirm("Are you sure you want to delete this payment record?")
    ) {
      setPayments(payments.filter((payment) => payment.id !== paymentId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getPaymentStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Payments Management
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage all payment records across the daycare system
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Payment Record
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
                placeholder="Search by child name or parent name..."
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
              Payment Type
            </label>
            <select
              value={selectedPaymentType}
              onChange={(e) => setSelectedPaymentType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              {uniquePaymentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ").charAt(0).toUpperCase() +
                    type.replace("_", " ").slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedClass("all");
              setSelectedStatus("all");
              setSelectedPaymentType("all");
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
              <CreditCardIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">
                Total Payments
              </p>
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
              <p className="text-sm font-medium text-gray-500">Paid</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.paid}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalAmount.toFixed(2)}
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
              <p className="text-sm font-medium text-gray-500">Collected</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalCollected.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Payments List</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Child & Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates & Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <CreditCardIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.childName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.className}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.parentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.parentEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.description}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentTypeColor(
                        payment.paymentType
                      )}`}
                    >
                      {payment.paymentType
                        .replace("_", " ")
                        .charAt(0)
                        .toUpperCase() +
                        payment.paymentType.replace("_", " ").slice(1)}
                    </span>
                    {payment.transactionId && (
                      <div className="text-sm text-gray-500 mt-1">
                        ID: {payment.transactionId}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <strong>Amount:</strong> ${payment.amount.toFixed(2)}
                    </div>
                    {payment.lateFees > 0 && (
                      <div className="text-sm text-red-600">
                        <strong>Late Fees:</strong> $
                        {payment.lateFees.toFixed(2)}
                      </div>
                    )}
                    <div className="text-sm text-gray-900">
                      <strong>Total:</strong> ${payment.totalAmount.toFixed(2)}
                    </div>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(payment.status)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.method ? (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getMethodColor(
                          payment.method
                        )}`}
                      >
                        {payment.method
                          .replace("_", " ")
                          .charAt(0)
                          .toUpperCase() +
                          payment.method.replace("_", " ").slice(1)}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Not specified
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <strong>Due:</strong>{" "}
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </div>
                    {payment.paidDate && (
                      <div className="text-sm text-green-600">
                        <strong>Paid:</strong>{" "}
                        {new Date(payment.paidDate).toLocaleDateString()}
                      </div>
                    )}
                    {payment.notes && (
                      <div
                        className="text-sm text-gray-500 mt-1 truncate max-w-xs"
                        title={payment.notes}
                      >
                        {payment.notes}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(payment)}
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
                      {payment.receipt && (
                        <button
                          onClick={() => {
                            /* Download receipt */
                          }}
                          className="text-purple-600 hover:text-purple-900 p-1"
                          title="Download Receipt"
                        >
                          <ArrowDownIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(payment.id)}
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

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No payments found
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
                {editingPayment ? "Edit Payment" : "Add Payment Record"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {editingPayment
                  ? "Update payment information"
                  : "Enter new payment details"}
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
                    setEditingPayment(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPayment ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
