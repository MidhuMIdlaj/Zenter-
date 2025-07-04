export interface UserDetails {
    email: string;
    name?: string;
    address?: string;
    products?: Array<{
      productId?: string;
      productName?: string;
      purchaseDate?: Date;
      warrantyStatus?: string;
    }>;
  }
  
  export default interface UserService {
    getUserByEmail(email: string): Promise<UserDetails | null>;
  }