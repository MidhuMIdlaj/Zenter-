export interface IFindAllCoordinatorAndMechanic {
  id: string;
  employeeName: string;
  emailId: string;
  joinDate: string | Date;
  contactNumber: string;
  address: string;
  currentSalary: number;
  age: number;
  position: "mechanic" | "coordinator";
  previousJob ?: string | null ;
  experience ?: number | null;
  status: string;
  isDeleted : Boolean;
}