// src/models/clientModel.ts
import mongoose, { Schema, Document } from "mongoose";
import Client from "../../../../domain/entities/User";

const ProductSchema = new Schema({
  productName: { type: String, required: true },
  quantity: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  warrantyDate: { type: Date, required: true },
  guaranteeDate: { type: Date, required: true },
});

const ClientSchema = new Schema<Client>(
  {
    email: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    attendedDate: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    products: [ProductSchema], 
    isDeleted: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model<Client>("Client", ClientSchema);