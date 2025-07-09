Here's a polished, general guide that gives **high-level flows** and **main requirements** for my signup email verification and forgot-password features using JWT tokens and Nodemailer —without diving into my existing code specifics. This will help AI or a developer adapt according to my actual project structure:

Of course. Here is the guide using Nodemailer and your Gmail account, translated into English.

---

## 🔁 Flow Overview

### A. Signup & Email Verification

1.  **Frontend (`/signup`)**
    *   The user submits all their details, such as name, email, password, etc. → sends them to your `/signup` endpoint.

2.  **Backend (`/signup` handler)**
    *   Check if the user already exists → return an "Already registered" error.
    *   If it's a new user → generate a JWT token with the complete user details as the payload, with an expiry (e.g., 1 hour).
    *   Rely solely on JWT (no database field is needed unless you want to implement revocation).
    *   Send a verification email using **Nodemailer** containing a link:
        ```
        https://yourfrontend.com/login?verifyToken=<jwtToken>
        ```
    *   Respond with success to the frontend.

3.  **Frontend (`/login` route with query)**
    *   Detect `verifyToken` in the URL → show an "Email verification in progress..." UI.
    *   Automatically POST to your backend's `/verify-email` endpoint with `{ token }`.

4.  **Backend (`/verify-email` handler)**
    *   Validate the JWT token (`jwt.verify()`).
    *   Extract the user information from the payload and save/create the user in the database.
    *   Respond with a status → the frontend displays "Verification successful! Please log in."

---

### B. Forgot Password Flow

1.  **Frontend (`/login` page)**
    *   The user clicks "Forgot Password?" → which reveals an email input field, replacing the login form.

2.  **Frontend submits to `/forgot-password`**
    *   Send `{ email }`.

3.  **Backend (`/forgot-password`)**
    *   Look up the user by email; if they don't exist, respond that the user does not exist.
    *   Generate a JWT reset token (payload: user's email or ID, expiry: 1 hour).
    *   Send a reset email via **Nodemailer** with a link:
        ```
        https://yourfrontend.com/login?resetToken=<jwtToken>
        ```

4.  **Frontend (`login` route)**
    *   Detect `resetToken` in the URL → switch the UI to the "Reset Password" form.

5.  **Frontend submits the new password to `/reset-password`**
    *   Send `{ token, newPassword }`.

6.  **Backend (`/reset-password`)**
    *   Verify the token → extract the email/ID → hash the new password and update it in the database.
    *   Optionally, clear any existing refresh tokens or sessions.
    *   Respond with success → the frontend shows "Password has been reset! Please log in."

---

## ⚙️ Key Requirements

1.  **JWT Setup**
    *   Use the `jsonwebtoken` library.
    *   Sign tokens in the signup and forgot-password flows using a secret key from your `.env` file.
    *   Include an expiration (e.g., `{ expiresIn: '1h' }`).

2.  **Nodemailer Integration (with Gmail)**
    *   **Set up a Gmail App Password:** Enable 2-Step Verification on your Gmail account, then go to "Security" → "App Passwords" to generate a new 16-character App Password.
    *   **Install Nodemailer:**
        ```bash
        npm install nodemailer
        ```
    *   **Configure the transporter and send the email:** Use `dotenv` to store your credentials securely.
        ```javascript
        require('dotenv').config();
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,       // Your Gmail address
            pass: process.env.GMAIL_APP_PASS,  // Your 16-character App Password
          },
        });

        const mailOptions = {
          from: `Your App Name <${process.env.GMAIL_USER}>`,
          to: 'recipient@example.com', // The recipient's email
          subject: 'Email Verification',
          html: '<p>Click <a href="...">here</a> to verify your account</p>',
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error('Error:', err);
          } else {
            console.log('Email sent:', info.response);
          }
        });
        ```

3.  **No Database Adjustments**
    *   You may not need a token field in your database if you are verifying solely via the JWT signature.

4.  **Frontend Behavior**
    *   Upon detecting `verifyToken` or `resetToken` in the URL → POST to the backend to trigger the corresponding action.
    *   Dynamically render forms/messages based on the presence and validity of the token.

5.  **Error Handling & UX**
    *   Verify the token's validity and expiration.
    *   Provide clear feedback for success, expired links, or invalid tokens.
    *   Redirect to the login page after a successful action.

6.  **Security Considerations**
    *   Store secrets (`JWT_SECRET`, `GMAIL_APP_PASS`) securely in environment variables.
    *   Ensure tokens expire and are intended for single use.

---

## 🛠 Starter Checklist

✔️ JWT library and signing logic
✔️ `/signup`, `/verify-email`, `/forgot-password`, `/reset-password` endpoints
✔️ **Nodemailer email sending configured**
✔️ Frontend UI logic to parse tokens and render verification/reset workflows
✔️ Clear success/error states and redirects