const nodemailer = require('nodemailer');

// Create transporter with your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Send email with temporary password
exports.sendTemporaryPassword = async (recipientEmail, tempPassword, userName, userRole) => {
  try {
    console.log('Attempting to send email to:', recipientEmail);
    console.log('Using email credentials:', process.env.EMAIL_USER);
    console.log('Temporary password to send:', tempPassword);
    
    // Determine title based on role
    const titlePrefix = userRole === 'doctor' ? 'Dr.' : 
                        userRole === 'pharmacist' ? 'Pharmacist' : '';
    
    const mailOptions = {
      from: `"MediFlow System" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: 'Welcome to MediFlow - Your Account Details',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">
        <!-- Header with gradient background -->
        <div style="background: linear-gradient(135deg, #4a7eff 0%, #6453e5 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <!-- Embedded base64 image (replace with your actual base64 encoded image) -->
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Welcome to MediFlow</h1>
        <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Your Healthcare Management System</p>
        </div>
          
          <!-- Main content -->
          <div style="padding: 30px 40px; background-color: #ffffff; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;">
            <p style="font-size: 16px; color: #333; margin-bottom: 25px; line-height: 1.5;">
              Hello ${titlePrefix} ${userName},
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 25px; line-height: 1.5;">
              Your account has been created in the MediFlow healthcare system. Here are your login credentials:
            </p>
            
            <div style="background-color: #f8f9fa; border-left: 4px solid #4a7eff; padding: 20px; border-radius: 5px; margin: 30px 0;">
              <p style="font-size: 15px; color: #333; margin: 0 0 15px 0;">
                <strong>Username:</strong>
              </p>
              <p style="font-family: monospace; font-size: 18px; margin: 0 0 20px 0; color: #4a5568; word-break: break-all; background: rgba(74, 126, 255, 0.1); padding: 10px; border-radius: 4px; text-align: center;">
                ${recipientEmail}
              </p>
              
              <p style="font-size: 15px; color: #333; margin: 20px 0 15px 0;">
                <strong>Temporary Password:</strong>
              </p>
              <p style="font-family: monospace; font-size: 18px; margin: 0; color: #4a5568; word-break: break-all; background: rgba(74, 126, 255, 0.1); padding: 10px; border-radius: 4px; text-align: center;">
                ${tempPassword}
              </p>
            </div>
            
            <div style="background-color: #fff8e6; border-left: 4px solid #ffbb00; padding: 20px; border-radius: 5px; margin: 30px 0;">
              <p style="font-size: 16px; color: #333; margin: 0; line-height: 1.5;">
                <strong>Important:</strong> For your security, you will be required to change this temporary password when you first log in.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 25px; line-height: 1.5;">
              You can log in to your account by visiting <a href="${process.env.FRONTEND_URL || 'https://mediflow.com'}" style="color: #4a7eff; text-decoration: none; font-weight: 500;">our website</a>.
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 25px; line-height: 1.5;">
              If you have any questions, please contact the system administrator.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f5f7ff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
              &copy; ${new Date().getFullYear()} MediFlow Healthcare Systems
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
      
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};