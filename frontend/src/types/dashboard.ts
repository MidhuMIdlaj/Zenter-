export interface SalesDataPoint {
    name: string;
    value: number;
  }
  
  export interface StockDataPoint {
    name: string;
    inStock: number;
    outStock: number;
  }
  
  export interface DispatchDataPoint {
    day: string;
    value: number;
  }
  
  export interface SegmentDataPoint {
    name: string;
    value: number;
  }
  
 
export interface ClientFormData {
  id :number;
  email: string;
  name: string;
  // attendedDate: string;
  // contactNumber: string;
  // address: string;
  // productName: string;
  // quantity: string;
  // version: string;
  // brand: string;
  // model: string;
  // warrantyDate: string;
  // guaranteeDate: string;
  status : string;
  lastLogin: string;
}

export interface EmployeeFormData {
  employeeName: string;
  emailId: string;
  // token : string;
  // message : string;
  joinDate: string;
  contactNumber: string;
  address: string;
  currentSalary: string;
  age: string;
  position: 'coordinator' | 'mechanic'; 
  previousJob: string;
  experience: string;
}

export interface ResetPasswordEmailFormData {
  message : string;
  email : string;
}

  
  export interface SummaryItem {
    title: string;
    value: string;
    subtitle: string;
  }
  
  export interface StatsCardData {
    title: string;
    value: string;
    change: string;
    period: string;
  }

  export interface Admin{
    token : string;
    email : string;
    password : string; 
  }