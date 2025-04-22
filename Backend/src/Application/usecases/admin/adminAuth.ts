import { AdminRepository } from "../../../domain/interfaces/AdminRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export default class LoginAdminUseCase {
  constructor(private adminRepo: AdminRepository) {}

  async execute(email: string, password: string): Promise<string> {
    console.log("LoginAdmin use case called with email:", email)
  const admin = await this.adminRepo.findByEmail(email);
  console.log(admin, "admin")
  if (!admin) {
    throw new Error("Admin not found");
  }
   console.log(password, admin.password)
  const isMatch = await bcrypt.compare(password, admin.password);
  console.log(isMatch, "isMatch")
  if (!isMatch) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET!, {
    expiresIn: "1d"
  });
  console.log(token, "token");
  return token;
  }
}