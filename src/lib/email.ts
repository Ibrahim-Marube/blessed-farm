import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendOrderConfirmationEmail(order: any) {
  console.log('📧 Starting email send for order:', order.orderNumber);
  console.log('Customer email:', order.customerEmail);
  console.log('Admin email:', process.env.ADMIN_EMAIL || 'ibrahimnmarube@gmail.com');
  
  const itemsList = order.items
    .map((item: any) => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  const customerEmail = {
    to: order.customerEmail,
    from: process.env.SENDGRID_FROM_EMAIL || 'ibrahimnmarube@gmail.com',
    subject: `Order has been placed #${order.orderNumber} - Blessed Farm`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #16a34a; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0;">Order has been placed</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px;">Hi ${order.customerName},</p>
          <p>Thank you for your order! We've received it and will process it shortly.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16a34a; margin-top: 0;">Order #${order.orderNumber}</h2>
            
            <div style="margin: 20px 0;">
              <h3 style="margin-bottom: 10px;">Order Details:</h3>
              <pre style="background: #f3f4f6; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: Arial, sans-serif;">${itemsList}</pre>
            </div>
            
            <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
              <p style="font-size: 18px; font-weight: bold;">Total: $${order.total.toFixed(2)}</p>
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Delivery Method:</strong> ${order.deliveryMethod === 'delivery' ? 'Home Delivery' : 'Farm Pickup'}</p>
              ${order.deliveryAddress ? `<p><strong>Delivery Address:</strong><br>${order.deliveryAddress}</p>` : '<p><strong>Pickup Address:</strong><br>1234 Farm Road, Boulder, CO 80301</p>'}
              <p><strong>Phone:</strong> ${order.customerPhone}</p>
              <p><strong>Payment:</strong> ${order.paymentMethod === 'cash' ? 'Cash on ' + (order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup') : 'PayPal'}</p>
            </div>
          </div>
          
          <p>We'll contact you shortly to confirm delivery details.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>Blessed Farm Team</strong>
          </p>
        </div>
        
        <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2025 Blessed Farm. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  const deliveryFee = order.deliveryFee || 0;
  
  const adminEmail = {
    to: process.env.ADMIN_EMAIL || 'ibrahimnmarube@gmail.com',
    from: process.env.SENDGRID_FROM_EMAIL || 'ibrahimnmarube@gmail.com',
    subject: `New Order #${order.orderNumber} - Blessed Farm`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0;">New Order Received</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #dc2626;">Order #${order.orderNumber}</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Customer Information:</h3>
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>Phone:</strong> ${order.customerPhone}</p>
            
            <h3 style="margin-top: 20px;">Order Details:</h3>
            <pre style="background: #f3f4f6; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: Arial, sans-serif;">${itemsList}</pre>
            
            <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
              <p style="font-size: 18px; font-weight: bold;">Total: $${order.total.toFixed(2)}</p>
            </div>
            
            <h3 style="margin-top: 20px;">Delivery Information:</h3>
            <p><strong>Method:</strong> ${order.deliveryMethod === 'delivery' ? `Home Delivery ($${deliveryFee.toFixed(2)})` : 'Farm Pickup (Free)'}</p>
            ${order.deliveryAddress ? `<p><strong>Address:</strong><br>${order.deliveryAddress}</p>` : '<p><em>Farm pickup - no delivery address</em></p>'}
            
            <h3 style="margin-top: 20px;">Payment:</h3>
            <p><strong>Method:</strong> ${order.paymentMethod === 'cash' ? 'Cash on ' + (order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup') : 'PayPal'}</p>
            ${order.paymentMethod === 'paypal' && order.paymentId && order.paymentId !== 'pending' ? `<p><strong>Payment ID:</strong> ${order.paymentId}</p>` : ''}
            ${order.paymentMethod === 'paypal' && order.paymentId && order.paymentId !== 'pending' ? '<p style="color: #16a34a; font-weight: bold;">Payment Received via PayPal</p>' : ''}
            ${order.paymentMethod === 'cash' ? '<p style="color: #f59e0b; font-weight: bold;">Payment will be collected on ' + (order.deliveryMethod === 'delivery' ? 'delivery' : 'pickup') + '</p>' : ''}
            
            ${order.notes ? `<h3 style="margin-top: 20px;">Order Notes:</h3><p style="background: #fef3c7; padding: 10px; border-radius: 5px;">${order.notes}</p>` : ''}
          </div>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/orders" 
               style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              View in Admin Panel
            </a>
          </p>
        </div>
      </div>
    `,
  };

  try {
    console.log('�� Sending customer email...');
    await sgMail.send(customerEmail);
    console.log('✅ Customer email sent successfully');
  } catch (error: any) {
    console.error('❌ Failed to send customer email:', error.response?.body || error.message);
  }

  try {
    console.log('📤 Sending admin email...');
    await sgMail.send(adminEmail);
    console.log('✅ Admin email sent successfully');
  } catch (error: any) {
    console.error('❌ Failed to send admin email:', error.response?.body || error.message);
  }
}

export async function sendOrderStatusEmail(order: any) {
  const itemsList = order.items
    .map((item: any) => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  let statusTitle = '';
  let statusColor = '';
  let statusMessage = '';

  switch (order.status) {
    case 'processing':
      statusTitle = 'Order is Being Processed';
      statusColor = '#3b82f6';
      statusMessage = 'Good news! Your order is now being prepared. We\'ll notify you when it\'s ready for delivery/pickup.';
      break;
    case 'completed':
      statusTitle = 'Order Completed';
      statusColor = '#16a34a';
      statusMessage = 'Your order has been completed! Thank you for choosing Blessed Farm.';
      break;
    case 'cancelled':
      statusTitle = 'Order Cancelled';
      statusColor = '#dc2626';
      statusMessage = 'Your order has been cancelled. If you have any questions, please contact us.';
      break;
    default:
      return;
  }

  const email = {
    to: order.customerEmail,
    from: process.env.SENDGRID_FROM_EMAIL || 'ibrahimnmarube@gmail.com',
    subject: `${statusTitle} - Order #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${statusColor}; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0;">${statusTitle}</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px;">Hi ${order.customerName},</p>
          <p>${statusMessage}</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: ${statusColor}; margin-top: 0;">Order #${order.orderNumber}</h2>
            
            <div style="margin: 20px 0;">
              <h3 style="margin-bottom: 10px;">Order Details:</h3>
              <pre style="background: #f3f4f6; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: Arial, sans-serif;">${itemsList}</pre>
            </div>
            
            <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
              <p style="font-size: 18px; font-weight: bold;">Total: $${order.total.toFixed(2)}</p>
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Delivery Method:</strong> ${order.deliveryMethod === 'delivery' ? 'Home Delivery' : 'Farm Pickup'}</p>
              ${order.deliveryAddress ? `<p><strong>Delivery Address:</strong><br>${order.deliveryAddress}</p>` : '<p><strong>Pickup Address:</strong><br>1234 Farm Road, Boulder, CO 80301</p>'}
              <p><strong>Phone:</strong> ${order.customerPhone}</p>
              <p><strong>Payment:</strong> ${order.paymentMethod === 'cash' ? 'Cash on ' + (order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup') : 'PayPal'}</p>
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>Blessed Farm Team</strong>
          </p>
        </div>
        
        <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2025 Blessed Farm. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(email);
    console.log('Order status email sent successfully');
  } catch (error) {
    console.error('Failed to send order status email:', error);
  }
}
