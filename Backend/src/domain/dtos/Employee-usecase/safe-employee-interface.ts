export interface ISafeEmployee {
  id: string;
  employeeName: string;
  emailId: string;
  joinDate: Date;
  contactNumber: string;
  address: string;
  currentSalary: number;
  age: number;
  position: "mechanic" | "coordinator";
  previousJob: string | null | undefined;
  experience: number;
  status: string;
  isDeleted: boolean;
  workingStatus: string;
  fieldOfMechanic: string[];
}
