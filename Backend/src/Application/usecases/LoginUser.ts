// import UserRepository from "../domain/interfaces/UserRepository";
// import User from "../domain/entities/User";

// export default class LoginUser {
//   constructor(private userRepository: UserRepository) {}

//   async execute(email: string, password: string): Promise<User> {
//     const user = await this.userRepository.findByEmail(email);
//     if (!user) throw new Error("User not found");

//     const valid = await this.userRepository.comparePassword(password, user.password);
//     if (!valid) throw new Error("Invalid credentials");

//     return user;
//   }
// }
