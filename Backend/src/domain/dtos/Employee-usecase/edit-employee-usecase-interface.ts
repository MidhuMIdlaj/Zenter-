export interface IEditEmployeeUsecase {
  id?: string;
  date: string;
  emailId: string;
  employeeName: string;
  joinDate: string;
  contactNumber: string;
  address: string;
  position: 'coordinator' | 'mechanic';
  employeeAddress: string;
  currentSalary: number; 
  age: number;
  previousJob: string;
  experience: number;
  status?: 'active' | 'inactive';
  isDeleted?: boolean;
  fieldOfMechanic: string[];
}
