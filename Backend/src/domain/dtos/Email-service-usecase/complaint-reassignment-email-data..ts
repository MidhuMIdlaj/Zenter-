export interface IComplaintReassignmentEmailData {
  complaintId: string;
  productName: string;
  complaintDetails: string;
  oldMechanic: {
    id: string;
    name: string;
  };
  newMechanic: {
    id: string;
    name: string;
  };
  rejectionReason: string;
  coordinatorName: string;
}
