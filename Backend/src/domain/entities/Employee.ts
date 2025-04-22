export default class Employee {
    constructor(
      public joinDate: string | Date,
      public employeeName: string,
      public emailId: string,
      public contactNumber: string,
      public address: string,
      public currentSalary: number,
      public age: number,
      public password: string | null,
      public position: 'coordinator' | 'mechanic',
      public previousJob?: string | null,
      public experience?:  number | null,
    ) {}
  }  