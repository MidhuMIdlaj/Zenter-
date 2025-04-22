// src/types/authTypes.ts
export interface AdminAuthState {
    isAuthenticated: boolean;
    adminData: {
      id: string;
      email: string;
      token: string;
      name: string;
    } | null;
  }
  
  export interface EmployeeAuthState {
    isAuthenticated: boolean;
    employeeData: {
      id: string;
      email: string;
      token: string;
      name: string;
      position: string;
    } | null;
    position?: 'mechanic' | 'coordinator';
  }

  
  
  export interface AuthState {
    adminAuth: AdminAuthState;
    employeeAuth: EmployeeAuthState;
  }