// src/services/emailService.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { videoCallInvitationEmail } from '../utils/nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVideoCallInvitation = async (
  recipientEmail: string,
  recipientName: string,
  initiatorName: string,
  callLink: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Video Call Invitation from ${initiatorName}`,
      html: videoCallInvitationEmail({
        recipientName,
        callInitiator: initiatorName,
        callLink
      })
    });
    console.log(`Video call invitation sent to ${recipientEmail}`);
  } catch (error) {
    console.error('Error sending video call invitation:', error);
    throw new Error('Failed to send video call invitation');
  }
};