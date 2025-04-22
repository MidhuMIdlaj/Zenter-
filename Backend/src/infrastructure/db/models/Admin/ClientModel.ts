// src/models/clientModel.ts
import mongoose, { Schema, Document } from "mongoose";
import Client from "../../../../domain/entities/User";

const ClientSchema = new Schema<Client>(
  {
    email: { type: String, required: true },
    clientName: { type: String, required: true },
    attendedDate: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: String, required: true },
    version: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true }, // renamed here too
    warrantyDate: { type: Date, required: true },
    guaranteeDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<Client>("Client", ClientSchema);
