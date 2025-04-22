import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Calendar,
  DollarSign,
  Hash,
  Clock,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { EmployeeApi } from "../../../api/admin/Employee";

interface EmployeeFormData {
  date: string;
  emailId: string;
  employeeName: string;
  joinDate: string;
  contactNumber: string;
  address: string;
  position : 'coordinator' | 'mechanic'; 
  employeeAddress: string;
  currentSalary: string;
  age: string;
  previousJob: string;
  experience: string;
}

const EmployeeTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    date: "",
    emailId: "",
    employeeName: "",
    joinDate: "",
    contactNumber: "",
    address: "'",
    position : 'coordinator',
    employeeAddress: '',
    currentSalary: "",
    age: "",
    previousJob: "",
    experience: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitError(null);
  
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailId)) {
      throw new Error("Please enter a valid email address");
    }
    
    if (!formData.employeeName.trim()) {
      throw new Error("Employee name is required");
    }
    
    if (!formData.joinDate) {
      throw new Error("Join date is required");
    }
    
    if (!formData.position) {
      throw new Error("Position is required");
    }
    
    const salary = Number(formData.currentSalary);
    if (isNaN(salary) || salary <= 0) {
      throw new Error("Please enter a valid salary amount");
    }
    
    const age = Number(formData.age);
    if (isNaN(age) || age < 18 || age > 80) {
      throw new Error("Age must be between 18 and 80");
    }
    
    const response = await EmployeeApi(formData);
    
    console.log("Employee added successfully:", response);
    setSubmitSuccess(true);
    setTimeout(() => {
      resetField();
      setSubmitSuccess(false);
    }, 2000);
    
  } catch (error) {
    console.error("Failed to add employee:", error);
    
    setSubmitError(
      error instanceof Error 
        ? error.message 
        : "Failed to add employee. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const resetField = () => {
    setShowModal(false);
    setFormData({
      date: "",
      emailId: "",
      employeeName: "",
      joinDate: "",
      contactNumber: "",
      address : "",
      position  : 'coordinator',
      employeeAddress: "",
      currentSalary: "",
      age: "",
      previousJob: "",
      experience: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden font-poppins">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Employee Management
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Add New Employee
                </h3>
                <button
                  onClick={resetField}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

              {submitSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
                  Employee added successfully!
                </div>
              )}

              {submitError && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                      <User className="text-blue-600" size={20} />
                      Employee Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email ID
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.emailId}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="employee@company.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Employee Name
                        </label>
                        <input
                          type="text"
                          name="employeeName"
                          value={formData.employeeName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Join Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="date"
                            name="joinDate"
                            value={formData.joinDate}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Position
                        </label>
                        <div className="relative">
                            <select
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                            <option value="">Select a position</option>
                            <option value="mechanic">Mechanic</option>
                            <option value="coordinator">Coordinator</option>
                            </select>
                        </div>
                        </div>


                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Employee Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="employeeAddress"
                            value={formData.employeeAddress}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="123 Main St, City, Country"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                      <Briefcase className="text-blue-600" size={20} />
                      Professional Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Salary
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            name="currentSalary"
                            value={formData.currentSalary}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="75000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous Employment
                        </label>
                        <div className="relative">
                          <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="previous"
                            value={formData.previousJob}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Previous Company"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Experience on this Job
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="3 years"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetField}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Employee"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;