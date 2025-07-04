import mongoose from "mongoose";
import { ComplaintModel } from "../../../infrastructure/db/ComplaintModel"

export const ChangeStatus = async (id: string, status: string, mechanicId: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid complaint ID format');
        }
        const updateResult = await ComplaintModel.updateOne(
            { 
                _id: id,
                assignedMechanicId: mechanicId
            },
            {
                $set: {
                    'status.status': status,
                    'status.updatedAt': new Date(),
                    'status.updatedBy': mechanicId,
                    workingStatus: status === 'processing' ? 'processing' : undefined
                }
            }
        );
        return updateResult;
    } catch (error) {
        console.error('Error in ChangeStatus service:', error);
        throw error; 
    }
}