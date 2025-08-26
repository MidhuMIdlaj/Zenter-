
export interface ISendVideoCallInvitationsUseCase {
  execute(initiatorId: string, employeeCallLink: string): Promise<{ success: boolean }>;
}
