import React, { useEffect, useMemo } from "react";
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void; // For event handlers
  };
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  onClose: () => void
}


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
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        resetForm();
      }, 2000); 
      
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, resetForm]);


    const isFormValid = useMemo(() => {
    return (
      formData.date &&
      formData.emailId &&
      formData.employeeName &&
      formData.joinDate &&
      formData.contactNumber &&
      formData.position &&
      formData.employeeAddress &&
      formData.currentSalary &&
      formData.age &&
      (!isEditMode || formData.status)
    );
  }, [formData, isEditMode]);
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
                  name="emailId"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Select a position</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="coordinator">Coordinator</option>
                </select>
              </div>
            </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            )}

            <div className={isEditMode ? "" : "md:col-span-2"}>
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
                Previous Job
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="previousJob"
                  value={formData.previousJob}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Senior Mechanic at ABC Motors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (Years)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="5"
                />
              </div>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Mechanic
              </label>
              
              {/* Selected chips */}
              {formData.fieldOfMechanic?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.fieldOfMechanic.map((field) => (
                    <span 
                      key={field}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {field}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleInputChange(
                            "fieldOfMechanic", 
                            formData.fieldOfMechanic.filter(f => f !== field)
                          );
                        }}
                        className="ml-1.5 inline-flex items-center justify-center w-3 h-3 text-blue-600 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="relative">
                <select
                  name="fieldOfMechanic"
                  multiple
                  value={formData.fieldOfMechanic}
                  onChange={(e) => {
                    const options = e.target.options;
                    const selectedValues: string[] = [];
                    for (let i = 0; i < options.length; i++) {
                      if (options[i].selected) {
                        selectedValues.push(options[i].value);
                      }
                    }
                    handleInputChange("fieldOfMechanic", selectedValues);
                  }}
                  className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none h-auto min-h-[42px]"
                  size={3}
                >
                  {["Battery", "Invertor", "Solar"].map(option => (
                    <option 
                      key={option} 
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
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