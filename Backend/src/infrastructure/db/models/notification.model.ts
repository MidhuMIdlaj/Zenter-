import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: string;
  recipientType: string;
  title: string;
  message: string;
  type: string;
  relatedId: string;
  createdBy: string;
  read: boolean;
  createdAt: Date;
  data: {
    complaintId: string;
    customerName: string;
    priority: string;
    productName: string;
    deadline: Date;
  };
}

const NotificationSchema: Schema = new Schema({
  recipientId: { type: String, required: true },
   recipientType: {
    type: String,
    required : true,
    enum: ['admin', 'coordinator', 'mechanic', 'client'] 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  relatedId: { type: String, required: true },
  createdBy: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  data: {
    complaintId: { type: String },
    customerName: { type: String },
    priority: { type: String },
    productName: { type: String },
    deadline: { type: Date },
  },
});

export default mongoose.model<INotification>('Notification', NotificationSchema);