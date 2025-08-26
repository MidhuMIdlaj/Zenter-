// infrastructure/services/NotificationService.ts

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { injectable } from 'inversify';
import { IEmailService } from '../../domain/Repository/i-email-repository';
import { videoCallInvitationEmail } from '../../service/email-service';
dotenv.config();

export class EmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendResetOTP(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Complaint Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `<div>...Your OTP is ${otp}...</div>`
    });
  }

  async sendComplaintStatusUpdate(email: string, complaintId: string, status: string, comments?: string): Promise<void> {
    const statusMap = {
      in_progress: { text: 'In Progress', color: '#f59e0b' },
      resolved: { text: 'Resolved', color: '#10b981' },
      rejected: { text: 'Rejected', color: '#ef4444' },
      default: { text: 'Submitted', color: '#3b82f6' }
    };

    const { text: statusText, color: statusColor } = statusMap[status as keyof typeof statusMap] || statusMap.default;

    await this.transporter.sendMail({
      from: `"Complaint Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Complaint Status Update: ${statusText}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Complaint Status Update</h2>
          <p>Your complaint (ID: ${complaintId}) is now <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>.</p>
          ${comments ? `<p>Comments: ${comments}</p>` : ''}
        </div>`
    });
  }

  async sendComplaintReassignmentEmail(email: string, data: any): Promise<void> {
    await this.transporter.sendMail({
      from: `"Complaint Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Complaint Reassigned (ID: ${data.complaintId})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Complaint Reassignment</h2>
          <p>Product: ${data.productName}</p>
          <p>Rejected by: ${data.oldMechanic.name}</p>
          <p>Reason: ${data.rejectionReason}</p>
          <p>New Mechanic: ${data.newMechanic.name}</p>
        </div>`
    });
  }

  async sendNoMechanicAvailableEmail(data: any): Promise<void> {
    await this.transporter.sendMail({
      from: `"Complaint Management System" <${process.env.EMAIL_USER}>`,
      to: data.recipientEmail,
      subject: `No Mechanic Available for Complaint ${data.complaintId}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: red;">Urgent: No Mechanic Available</h2>
          <p>Product: ${data.productName}</p>
          <p>Reason: ${data.rejectionReason}</p>
        </div>`
    });
  }

  async sendUniversalSMS(phoneNumber: string, message: string): Promise<boolean> {
    const smsTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const gateways = [
      '@vtext.com', '@txt.att.net', '@tmomail.net',
      '@messaging.sprintpcs.com', '@msg.fi.google.com', '@email.uscc.net'
    ];

    for (const gateway of gateways) {
      try {
        await smsTransporter.sendMail({
          from: `"Complaint System" <${process.env.EMAIL_USER}>`,
          to: `${cleanNumber}${gateway}`,
          text: message.substring(0, 160),
          subject: ''
        });
        return true;
      } catch (err) {
        console.warn(`Failed via ${gateway}`);
      }
    }

    throw new Error('All SMS gateways failed');
  }

  async sendEmployeeWelcomeEmail(email: string, name: string, password?: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Complaint Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Zenster!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome, ${name} 👋</h2>
          <p>Your account has been created.</p>
          ${password ? `<p><strong>Password:</strong> ${password}</p>` : ""}
          <p>Log in and update your password ASAP.</p>
        </div>`
    });
  }

   async sendVideoCallInvitation(
    recipientEmail: string,
    recipientName: string,
    initiatorName: string,
    callLink: string
  ): Promise<void> {
   try {
  await this.transporter.sendMail({
    from: `"Complaint Management System" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Video Call Invitation from ${initiatorName}`,
     html: videoCallInvitationEmail({
    recipientName,
    callInitiator: initiatorName,
    callLink
  })
  });
} catch (error) {
  console.error('Error sending video call invitation:', error);
  throw new Error('Failed to send video call invitation');
}
}
}
