# Implementation Plan: Email Verification and Forgot Password

This document outlines the steps to integrate email verification and forgot password functionality into the application, based on `Flow_Overview.md`.

## 1. Backend (`api-grievance`) Modifications

### 1.1. Dependencies

- Install `nodemailer` for sending emails.

  ```bash
  npm install nodemailer
  ```

### 1.2. Gmail Setup and Environment Variables

1. **Gmail App Password Setup**:
   - Enable 2-Step Verification on your Gmail account
   - Go to Google Account settings → Security → App Passwords
   - Generate a new 16-character App Password for your application

2. **Environment Variables**:
   - Create a `.env` file in the `api-grievance` root directory and add the following variables:

     ```
     GMAIL_USER="your_gmail_address@gmail.com"
     GMAIL_APP_PASS="your_16_character_app_password"
     FRONTEND_URL="http://localhost:3000" # Or your frontend's URL
     JWT_SECRET_KEY="your_jwt_secret"
     SALT_ROUNDS=10
     ```

### 1.3. Nodemailer Configuration

Create a new file `config/mailer.js` to set up the Nodemailer transporter:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  const mailOptions = {
    from: `Grievance System <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendMail };
```

### 1.3. Controller (`controllers/UserController.js`) Updates

- **Modify `signup` function**:
    - Instead of saving the user directly, generate a JWT containing the user's details (`firstName`, `lastName`, `email`, `mobileNo`, `role`, `password`).
    - Use Nodemailer to send a verification email with a link: `${process.env.FRONTEND_URL}/login?verifyToken=<jwt>`.
    - Respond with a message prompting the user to check their email.

- **Create `verifyEmail` function**:
    - This new function will handle the `POST /verify-email` route.
    - It will receive a `token` in the request body.
    - It will verify the JWT. If valid, it will extract the user details, hash the password, and save the new user to the database.
    - It will respond with a success message.

- **Create `forgotPassword` function**:
    - This new function will handle the `POST /forgot-password` route.
    - It will receive an `email` in the request body.
    - It will find the user by email in the database.
    - If the user exists, it will generate a new JWT (with a shorter expiry, e.g., 15 minutes) containing the user's `_id`.
    - It will send a password reset email via Nodemailer with a link: `${process.env.FRONTEND_URL}/login?resetToken=<jwt>`.

- **Modify `changePassword` to `resetPassword` (or create a new one)**:
    - A new `resetPassword` function will handle the `POST /reset-password` route.
    - It will receive a `token` and `newPassword`.
    - It will verify the JWT to get the user `_id`.
    - It will find the user, hash the `newPassword`, and update the user's document in the database.

### 1.4. Routes (`routes/User.js`) Updates

- Add the new routes:

  ```javascript
  router.post('/verify-email', UserController.verifyEmail);
  router.post('/forgot-password', UserController.forgotPassword);
  router.post('/reset-password', UserController.resetPassword);
  ```

## 2. Frontend (`user-grievance`) Modifications

### 2.1. Component (`components/SignUp.vue`) Updates

- On successful submission to the `/signup` endpoint, change the success message to inform the user to check their email for a verification link, instead of redirecting to the login page.

### 2.2. Component (`components/MemberLogin.vue`) Updates

- **Add "Forgot Password?" Link**: Add a clickable link below the login form.
- **Implement Forgot Password UI**: Clicking the link should toggle a view to show an email input field and a submit button to call the `/forgot-password` endpoint.
- **Handle URL Tokens (`mounted` hook)**:
    - Check `this.$route.query` for `verifyToken` or `resetToken` when the component loads.
    - If `verifyToken` exists, automatically make a POST request to the `/verify-email` backend endpoint. Display a message like "Verifying your email..." and on success, show "Verification successful! Please log in."
    - If `resetToken` exists, hide the standard login form and display a "Reset Password" form (new password, confirm password). Submitting this form will call the `/reset-password` endpoint.

### 2.3. Router (`router/index.js`) Updates

- No major changes are required, but ensure the login page can correctly handle and process URL query parameters (`verifyToken`, `resetToken`).

## 3. Workflow Summary

1.  **Signup**: User signs up -> Receives email -> Clicks link -> Account is created in DB.
2.  **Forgot Password**: User requests reset -> Receives email -> Clicks link -> Enters new password -> Password is updated in DB.