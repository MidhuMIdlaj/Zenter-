export interface IAddEmployeeDTO {
    employeeName: string,
    emailId: string,
    joinDate: string | Date,
    contactNumber: string,
    address: string | null | undefined,
    currentSalary: number,
    age: number,
    position: 'coordinator' | 'mechanic';
    previousJob?: string | null | undefined;
    fieldOfMechanic?: string[],
    experience?: number | null;
}