export interface ISearchEmployeeResponse {
  id: string;
  date: string;
  emailId: string;
  employeeName: string;
  joinDate: string; 
  contactNumber: string;
  address: string;
  position: 'coordinator' | 'mechanic';
  employeeAddress: string;
  currentSalary: string;
  age: string;
  previousJob: string;
  experience: string;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  fieldOfMechanic: string[];
  employeeId: string;
}

export interface ISearchEmployeesResult {
  employees: ISearchEmployeeResponse[];
  total: number;
}
