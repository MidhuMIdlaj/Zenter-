export interface IGetComplaintMechanicUsecase {
  id: string;
  titel : string;
  clientName: string;
  customerEmail: string;
  customerPhone: string;
  location: string;
  status: string;
  assignedMechanics: {
    mechanicId: string;
    status: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  workingStatus : string;
  priority : string
}