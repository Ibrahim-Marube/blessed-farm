import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryPreference: string;
}

export async function sendCustomerConfirmation(data: OrderEmailData) {
  const itemsList = data.items
    .map(
      (item) =>
        `${item.productName} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n');

  const msg = {
    to: data.customerEmail,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Order Confirmation - ${data.orderNumber}`,
    text: `
Hi ${data.customerName},

Thank you for your order at Blessed Farm!

Order Number: ${data.orderNumber}
Delivery Method: ${data.deliveryPreference === 'delivery' ? 'Delivery' : 'Pickup'}

Items:
${itemsList}

Total: $${data.totalAmount.toFixed(2)}

We'll notify you when your order is ready.

Best regards,
Blessed Farm Team
    `,
    html: `
      <h2>Order Confirmation</h2>
      <p>Hi ${data.customerName},</p>
      <p>Thank you for your order at Blessed Farm!</p>
      <p><strong>Order Number:</strong> ${data.orderNumber}</p>
      <p><strong>Delivery Method:</strong> ${data.deliveryPreference === 'delivery' ? 'Delivery' : 'Pickup'}</p>
      <h3>Items:</h3>
      <ul>
        ${data.items.map((item) => `<li>${item.productName} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total: $${data.totalAmount.toFixed(2)}</strong></p>
      <p>We'll notify you when your order is ready.</p>
      <p>Best regards,<br>Blessed Farm Team</p>
    `,
  };

  await sgMail.send(msg);
}

export async function sendAdminNotification(data: OrderEmailData) {
  const itemsList = data.items
    .map(
      (item) =>
        `${item.productName} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n');

  const msg = {
    to: process.env.ADMIN_EMAIL!,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `New Order - ${data.orderNumber}`,
    text: `
New order received!

Order Number: ${data.orderNumber}
Customer: ${data.customerName}
Email: ${data.customerEmail}
Delivery Method: ${data.deliveryPreference === 'delivery' ? 'Delivery' : 'Pickup'}

Items:
${itemsList}

Total: $${data.totalAmount.toFixed(2)}

Login to admin dashboard to process this order.
    `,
  };

  await sgMail.send(msg);
}
