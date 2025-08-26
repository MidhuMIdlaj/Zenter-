import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName  : {type : String ,  required : true , default :  null},
  lastName :{type : String, required : true,  default :  null},
  phoneNumber : { type : String , required : true ,  default : null}
});

export const AdminModel = mongoose.model("admins", adminSchema);
