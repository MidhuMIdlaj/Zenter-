import { ComplaintModel } from "../../../infrastructure/db/ComplaintModel"


export const getMechanicComplaint = async (mechanicId: string) => {
  return await ComplaintModel.find({ 
    "assignedMechanics.mechanicId": mechanicId,
    isDeleted: false 
  });
}