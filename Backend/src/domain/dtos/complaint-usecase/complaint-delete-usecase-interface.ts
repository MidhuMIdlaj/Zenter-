export interface IDeleteComplaintUsecase {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount?: number; 
}
