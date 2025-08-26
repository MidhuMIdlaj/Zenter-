export function videoCallInvitationEmail({
  recipientName,
  callInitiator,
  callLink,
}: {
  recipientName: string;
  callInitiator: string;
  callLink: string;
}) {
  return `
    <div>
      <h2>Hello ${recipientName},</h2>
      <p>${callInitiator} has invited you to a video call.</p>
      <p><a href="${callLink}">Join the call</a></p>
    </div>
  `;
}
