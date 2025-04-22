import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  emailId: { type: String, required: true },
  password: { type: String,  default: null},
  joinDate: { type: Date, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  currentSalary: { type: Number, required: true },
  age: { type: Number, required: true },
  position: { type: String, enum: ['coordinator', 'mechanic'], required: true },
  previousJob: { type: String },
  experience: { type: Number },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;