import React from "react";
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
  CheckCircle,
  Edit,
} from "lucide-react";
import { EmployeeFormData } from "../../../../api/admin/Employee";

interface EmployeeDetailsProps {
  employee: EmployeeFormData;
  onClose: () => void;
  onEdit: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employee,
  onClose,
  onEdit,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          Employee Details
        </h3>
        <button
          onClick={onClose}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            Personal Information
          </h4>
          <div className="space-y-3">
            <div className="flex gap-2">
              <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Name</div>
                <div className="text-gray-800">{employee.employeeName}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="text-gray-800">{employee.emailId}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Phone</div>
                <div className="text-gray-800">{employee.contactNumber}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Hash className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Age</div>
                <div className="text-gray-800">{employee.age} years</div>
              </div>
            </div>
            <div className="flex gap-2">
              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Address</div>
                <div className="text-gray-800">{employee.employeeAddress}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase className="text-blue-600" size={20} />
            Professional Details
          </h4>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Briefcase className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Position</div>
                <div className="text-gray-800 capitalize">{employee.position}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Join Date</div>
                <div className="text-gray-800">
                  {new Date(employee.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <DollarSign className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Current Salary</div>
                <div className="text-gray-800">
                  ${Number(employee.currentSalary).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Briefcase className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Previous Job</div>
                <div className="text-gray-800">
                  {employee.previousJob || "N/A"}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Experience</div>
                <div className="text-gray-800">
                  {employee.experience ? `${employee.experience} years` : "N/A"}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className={`font-medium ${
                  employee.status === 'active' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {employee.status === 'active' ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={onEdit}
          className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Edit size={16} />
          <span>Edit</span>
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetails;