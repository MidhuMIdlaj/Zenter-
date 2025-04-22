// controllers/admin/EmployeeController.ts
import { Request, Response, NextFunction } from "express";
import EmployeeRepoImpl from "../../../infrastructure/repositories/EmployeeRepoImpl";
import { AddEmployeeUseCase } from "../../../Application/usecases/admin/addEmployee";

export default class EmployeeController {
  private employeeRepository = new EmployeeRepoImpl();
  private addEmployeeUseCase = new AddEmployeeUseCase(this.employeeRepository);

  addEmployee = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Add employee controller called", req.body);
    try {
      const {
        employeeName,
        email: emailId,
        joinDate,
        contactNumber,
        employeeAddress: address,
        currentSalary,
        age,
        position,
        previous: previousJob,
        experience
      } = req.body;
      
      const parsedJoinDate = new Date(joinDate);
      const parsedSalary = Number(currentSalary);
      const parsedAge = Number(age);
      const parsedExperience = Number(experience);
      
      console.log("Parsed values:", {
        parsedJoinDate,
        parsedSalary,
        parsedAge,
        parsedExperience,
      });
  
      const newEmployee = await this.addEmployeeUseCase.execute(
        employeeName,
        emailId,
        parsedJoinDate,
        contactNumber,
        address,
        parsedSalary,
        parsedAge,
        position,
        previousJob,
        parsedExperience
      );
      console.log("New employee created:", newEmployee);

      res.status(201).json({
        message: "Employee created successfully",
        employee: newEmployee,
      });
    } catch (err: any) {
      // Pass the error to the error handling middleware
      next(err);
    }
  };
}