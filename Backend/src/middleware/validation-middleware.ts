import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../domain/error/complaintError';

export const validateComplaintInput = (req: Request, res: Response, next: NextFunction) => {
  const { 
    customerId,
    customerName, 
    customerEmail, 
    customerPhone, 
    vehicleModel, 
    vehicleRegistration, 
    complaintType, 
    complaintDetails,
    priority
  } = req.body;

  const errors: string[] = [];

  if (!customerId) errors.push('Customer ID is required');
  if (!customerName) errors.push('Customer name is required');
  if (!customerEmail) errors.push('Customer email is required');
  if (!validateEmail(customerEmail)) errors.push('Invalid email format');
  if (!customerPhone) errors.push('Customer phone is required');
  if (!vehicleModel) errors.push('Vehicle model is required');
  if (!vehicleRegistration) errors.push('Vehicle registration is required');
  if (!complaintType) errors.push('Complaint type is required');
  if (!complaintDetails) errors.push('Complaint details are required');
  if (complaintDetails && complaintDetails.length < 10) errors.push('Complaint details must be at least 10 characters');
  
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    errors.push('Priority must be low, medium, or high');
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors.join(', ')));
  }

  next();
};

export const validateStatusUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { status, comments } = req.body;
  const errors: string[] = [];

  if (!status) errors.push('Status is required');
  if (status && !['submitted', 'in_progress', 'resolved', 'rejected'].includes(status)) {
    errors.push('Status must be submitted, in_progress, resolved, or rejected');
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors.join(', ')));
  }

  next();
};

export const validateAssignment = (req: Request, res: Response, next: NextFunction) => {
  const { employeeId } = req.body;
  
  if (!employeeId) {
    return next(new ValidationError('Employee ID is required'));
  }

  next();
};
function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}