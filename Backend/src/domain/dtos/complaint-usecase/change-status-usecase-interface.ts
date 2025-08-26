export interface IChangeStatusUsecase{
  acknowledged?: boolean;
  matchedCount: number;
  modifiedCount?: number;
}
