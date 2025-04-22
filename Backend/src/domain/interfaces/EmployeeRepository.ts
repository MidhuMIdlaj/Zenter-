import Employee from "../entities/Employee";

export default interface EmployeeRepository {
  createEmployee(
    employeeName: string,
    emailId: string,
    joinDate: string | Date,
    contactNumber: string,
    address: string,
    currentSalary: number,
    age: number,
    position: 'coordinator' | 'mechanic',
    previousJob? : string,
    experience? :  number,
  ): Promise<Employee | null>;


  findByEmail(emailId: string): Promise<Employee | null>;
  storeOTP(email: string, otp: string): Promise<void>;
  verifyOTP(email: string, otp: string): Promise<boolean>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;

}
