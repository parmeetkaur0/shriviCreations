import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

/**
 * @param {Object} options
 * @param {String} options.to
 * @param {String} options.subject
 * @param {String} options.html
 */
export const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Shrivi Creations" <no-reply@shrivicreations.com>',
    to,
    subject,
    html,
  });
};

export const orderConfirmationTemplate = (order, user) => `
  <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #3E3A36;">
    <div style="background:#9AA68C; padding: 32px; text-align:center;">
      <h1 style="color:#FAF7F2; font-family: 'Playfair Display', serif; margin:0;">Shrivi Creations</h1>
      <p style="color:#FAF7F2; margin-top:8px;">Crafted with Love, Made to Last</p>
    </div>
    <div style="padding: 24px; background:#FAF7F2;">
      <h2>Hi ${user.name}, thank you for your order!</h2>
      <p>Your order <strong>#${order.orderNumber}</strong> has been confirmed and is being lovingly prepared.</p>
      <p><strong>Total:</strong> ₹${order.totalPrice}</p>
      <p><strong>Shipping to:</strong> ${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}</p>
      <p style="margin-top:24px;">We'll notify you again once it ships. You can track your order anytime from your account.</p>
    </div>
  </div>
`;

export const orderStatusUpdateTemplate = (order, user) => `
  <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #3E3A36;">
    <div style="background:#9AA68C; padding: 32px; text-align:center;">
      <h1 style="color:#FAF7F2; font-family: 'Playfair Display', serif; margin:0;">Shrivi Creations</h1>
    </div>
    <div style="padding: 24px; background:#FAF7F2;">
      <h2>Hi ${user.name}, your order status has been updated</h2>
      <p>Order <strong>#${order.orderNumber}</strong> is now: <strong style="color:#C8A66A; text-transform:capitalize;">${order.orderStatus.replace('_', ' ')}</strong></p>
      ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
    </div>
  </div>
`;
