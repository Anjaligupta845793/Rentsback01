const AWS = require("aws-sdk");

// Configure AWS SES
const ses = new AWS.SES({
  region: process.env.AWS_REGION, // e.g., "us-east-1"
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/**
 * Send a verification email via AWS SES
 * @param {string} toEmail - Recipient email
 * @param {string} name - Recipient name
 * @param {string} verificationUrl - Verification link
 */
const sendVerificationEmail = async (toEmail, name, verificationUrl) => {
  const params = {
    Source: process.env.SES_EMAIL_SENDER, // Must be verified in AWS SES
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: "Verify Your Email" },
      Body: {
        Html: {
          Data: `
            <p>Hello ${name},</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
            <p>This link expires in 1 hour.</p>
          `,
        },
      },
    },
  };

  return ses.sendEmail(params).promise();
};

module.exports = { sendVerificationEmail };
