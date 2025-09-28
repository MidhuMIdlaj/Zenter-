export interface IGetAvailableMechanicUsecase {
 id: string;
  joinDate: string | Date;
  employeeName: string;
  emailId: string;
  contactNumber: string;
  address: string | null | undefined;
  currentSalary: number;
  age: number;
  password: string;
  position: 'coordinator' | 'mechanic';
  status: 'active' | 'inactive';
  isDeleted: boolean;
  workingStatus: 'Available' | 'Occupied';
  previousJob?: string | null;
  experience?: number | null;
  fieldOfMechanic: string[];
}
