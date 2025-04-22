import nodemailer from "nodemailer";

export const sendResetOTP = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    text: `Your OTP for resetting password is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};
