import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Hash,
  Clock,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { EmployeeFormData } from "../../../../api/admin/Employee";

interface EmployeeFormProps {
  formData: EmployeeFormData;
  isEditMode: boolean;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  handleInputChange: {
    (name: string, value: any): void;
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void;
  };
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  onClose: () => void;
}

const indianNumberRegex = /^[6-9]\d{9}$/;

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  formData,
  isEditMode,
  isSubmitting,
  submitSuccess,
  submitError,
  handleInputChange,
  handleSubmit,
  resetForm,
}) => {
  // State for form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        resetForm();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [submitSuccess, resetForm]);

  // Validate input fields on each change
  useEffect(() => {
    const curErrors: { [key: string]: string } = {};

    if (!formData.emailId)
      curErrors.emailId = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId))
      curErrors.emailId = "Invalid email format.";

    if (!formData.employeeName)
      curErrors.employeeName = "Employee name is required.";

    if (!formData.joinDate)
      curErrors.joinDate = "Join date is required.";

    if (!formData.contactNumber)
      curErrors.contactNumber = "Contact number is required.";
    else if (!indianNumberRegex.test(formData.contactNumber))
      curErrors.contactNumber =
        "Enter a valid 10 digit Indian mobile number starting with 6-9.";

    if (!formData.position)
      curErrors.position = "Position is required.";

    if (!formData.address)
      curErrors.address = "Address is required.";

    if (!formData.currentSalary)
      curErrors.currentSalary = "Current salary is required.";
    else if (isNaN(Number(formData.currentSalary)) || Number(formData.currentSalary) <= 0)
      curErrors.currentSalary = "Enter a valid salary.";

    if (!formData.age)
      curErrors.age = "Age is required.";
    else if (isNaN(Number(formData.age)) || Number(formData.age) < 18)
      curErrors.age = "Enter a valid age (minimum 18).";

    if (isEditMode && !formData.status)
      curErrors.status = "Status is required.";

    setErrors(curErrors);
  }, [formData, isEditMode]);

  const isFormValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
            Employee {isEditMode ? "updated" : "added"} successfully!
          </div>
        )}

        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
            {submitError}
          </div>
        )}

        <div className="border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            Employee Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-4 py-2 border ${errors.emailId ? "border-red-400" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  placeholder="employee@company.com"
                />
              </div>
              {errors.emailId && (
                <span className="text-xs text-red-600">{errors.emailId}</span>
              )}
            </div>

            {/* Employee Name */}
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
                className={`w-full px-4 py-2 border ${errors.employeeName ? "border-red-400" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                placeholder="John Doe"
              />
              {errors.employeeName && (
                <span className="text-xs text-red-600">{errors.employeeName}</span>
              )}
            </div>

            {/* Join Date */}
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
                  className={`w-full pl-10 pr-4 py-2 border ${errors.joinDate ? "border-red-400" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                />
              </div>
              {errors.joinDate && (
                <span className="text-xs text-red-600">{errors.joinDate}</span>
              )}
            </div>

            {/* Contact Number */}
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
                  maxLength={10}
                  className={`w-full pl-10 pr-4 py-2 border ${errors.contactNumber ? "border-red-400" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  placeholder="9876543210"
                />
              </div>
              {errors.contactNumber && (
                <span className="text-xs text-red-600">{errors.contactNumber}</span>
              )}
            </div>

            {/* Position */}
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
                  className={`w-full px-3 py-2 border ${errors.position ? "border-red-400" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                >
                  <option value="">Select a position</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="coordinator">Coordinator</option>
                </select>
              </div>
              {errors.position && (
                <span className="text-xs text-red-600">{errors.position}</span>
              )}
            </div>

            {/* Address */}
            <div className={isEditMode ? "" : "md:col-span-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-4 py-2 border ${errors.address ? "border-red-400" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  placeholder="123 Main St, City, Country"
                />
              </div>
              {errors.address && (
                <span className="text-xs text-red-600">{errors.address}</span>
              )}
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase className="text-blue-600" size={20} />
            Professional Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Salary */}
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
                  min={0}
                  className={`w-full pl-10 pr-4 py-2 border ${errors.currentSalary ? "border-red-400" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  placeholder="75000"
                />
              </div>
              {errors.currentSalary && (
                <span className="text-xs text-red-600">{errors.currentSalary}</span>
              )}
            </div>

            {/* Age */}
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
                  min={18}
                  className={`w-full pl-10 pr-4 py-2 border ${errors.age ? "border-red-400" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  placeholder="30"
                />
              </div>
              {errors.age && (
                <span className="text-xs text-red-600">{errors.age}</span>
              )}
            </div>

            {/* Status (Edit mode only) */}
            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border ${errors.status ? "border-red-400" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                {errors.status && (
                  <span className="text-xs text-red-600">{errors.status}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${
              isSubmitting || !isFormValid ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>{isEditMode ? "Update" : "Save"}</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EmployeeForm;
