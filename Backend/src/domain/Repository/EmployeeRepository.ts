import Employee from "../entities/Employee";

export default interface EmployeeRepository  {
  createEmployee(
    employeeName: string,
    emailId: string,
    joinDate: string | Date,
    contactNumber: string,
    address: string,
    currentSalary: number,
    age: number,
    position: 'coordinator' | 'mechanic',
    fieldOfMechanic?: string,
    previousJob? : string,
    experience? :  number,
  ): Promise<Employee | null>;
  
  getAllEmployees(page?: number, limit?: number): Promise<{
    employees: Employee[];
    total: number;
  }>;
  updateStatus(employeeId: string, status: "active" | "inactive"): Promise<void>;
  findAvailableMechanics(): Promise<Employee[]>;
  updateEmployee(employeeId: string, updatedData: Partial<Employee>): Promise<Employee | null>;
  findByEmail(emailId: string): Promise<Employee | null>;
  storeOTP(email: string, otp: string): Promise<void>;
  verifyOTP(email: string, otp: string): Promise<boolean>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
  findAllMechanics(): Promise<Employee[]>;
  findAllCoordinators(): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  findByEmployeeId(id : string): Promise<Employee | null >
}
