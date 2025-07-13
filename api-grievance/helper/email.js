const forgotPasswordTemplate = (name, resetLink) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: sans-serif;
        background-color: #f4f4f4;
        color: #212631;
      }
      .container {
        padding: 20px;
        max-width: 600px;
        margin: auto;
      }
      .header {
        background-color: #212631;
        padding-bottom: 5px;
        text-align: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      .header img {
        max-width: 150px;
      }
      .header h1 {
        color: #ffffff;
        font-size: 24px;
      }
      .content {
        background-color: #ffffff;
        padding: 30px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      .button-container {
        text-align: center;
      }
      .button {
        background-color: #0087D4;
        color: white !important; /* Important for email client compatibility */
        padding: 14px 20px;
        margin: 20px 0;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        text-decoration: none;
        display: inline-block;
        font-weight: bold;
      }
      p {
        line-height: 1.6;
      }
      .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class=\"container\">
      <div class=\"header\">
        <!-- IMPORTANT: You need to host your logo image and replace the src below -->
        <img src=\"https://grievance-management-and-redressal-system.vercel.app/RDLOGOBGREMOVED.png\" alt=\"R.D. GMS Logo\" style=\"max-width: 150px;\">
        <h1>R.D. GMS</h1>
      </div>
      <div class=\"content\">
        <h3>Hi ${name},</h3>
        <p>You recently requested to reset your password for your R.D. GMS account. Use the button below to reset it. This password reset is only valid for the next 24 hours.</p>
        <div class=\"button-container\">
            <a href=\"${resetLink}\" class=\"button\" style=\"color: white;\">Reset Your Password</a>
        </div>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>Thanks,<br>The R.D. GMS Team</p>
      </div>
      <div class=\"footer\">
        <p>&copy; ${new Date().getFullYear()} R.D. GMS. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

const emailVerificationTemplate = (name, verificationLink) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: sans-serif;
        background-color: #f4f4f4;
        color: #212631;
      }
      .container {
        padding: 20px;
        max-width: 600px;
        margin: auto;
      }
      .header {
        background-color: #212631;
        padding-bottom: 5px;
        text-align: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      .header img {
        max-width: 150px;
      }
      .header h1 {
        color: #ffffff;
        font-size: 24px;
      }
      .content {
        background-color: #ffffff;
        padding: 30px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      .button-container {
        text-align: center;
      }
      .button {
        background-color: #0087D4;
        color: white !important; /* Important for email client compatibility */
        padding: 14px 20px;
        margin: 20px 0;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        text-decoration: none;
        display: inline-block;
        font-weight: bold;
      }
      p {
        line-height: 1.6;
      }
      .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class=\"container\">
      <div class=\"header\">
        <!-- IMPORTANT: You need to host your logo image and replace the src below -->
        <img src=\"https://grievance-management-and-redressal-system.vercel.app/RDLOGOBGREMOVED.png\" alt=\"R.D. GMS Logo\" style=\"max-width: 150px;\">
        <h1>R.D. GMS</h1>
      </div>
      <div class=\"content\">
        <h3>Hi ${name},</h3>
        <p>Thank you for registering with R.D. GMS. Please verify your email address by clicking the button below. This email verification is only valid for the next 24 hours.</p>
        <div class=\"button-container\">
            <a href=\"${verificationLink}\" class=\"button\" style=\"color: white;\">Verify Your Email</a>
        </div>
        <p>If you did not register for an account, please ignore this email.</p>
        <p>Thanks,<br>The R.D. GMS Team</p>
      </div>
      <div class=\"footer\">
        <p>&copy; ${new Date().getFullYear()} R.D. GMS. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
module.exports = { forgotPasswordTemplate, emailVerificationTemplate };