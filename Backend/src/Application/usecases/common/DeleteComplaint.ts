// DeleteComplaint.ts
import mongoose from "mongoose";
import { ComplaintModel } from "../../../infrastructure/db/ComplaintModel";

export const DeleteComplaint = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid complaint ID format');
        }

        const updateResult = await ComplaintModel.updateOne(
            { _id: id },
            { 
                $set: {
                    isDeleted: true,
                    deletedAt: new Date(),
                }
            }
        );
        return updateResult;
    } catch (error) {
        console.error('Error in DeleteComplaint service:', error);
        throw error; 
    }
}