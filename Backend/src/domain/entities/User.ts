export interface Product {
  id ?: string | undefined;
  productName: string;
  quantity: string;
  brand: string;
  model: string;
  warrantyDate: Date;
  guaranteeDate: Date;
}

export default class Client {
  constructor(
    public id: string,
    public email: string,
    public clientName: string,
    public attendedDate: Date,
    public contactNumber: string,
    public address: string,
    public products: Product[], 
    public status: string,
    public isDeleted: boolean,
    public _id?: string,
  ) {}
}