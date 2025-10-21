import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendOrderConfirmationEmail } from '@/lib/email';

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `BF-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    console.log('=== ORDER API CALLED ===');
    
    await dbConnect();
    console.log('Database connected successfully');
    
    const body = await request.json();
    console.log('Order data received');
    
    // Validate required fields
    if (!body.customerName || !body.customerEmail || !body.customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = generateOrderNumber();
    const orderData = {
      ...body,
      orderNumber,
    };

    // Create order
    console.log('Creating order with number:', orderNumber);
    const order = await Order.create(orderData);
    console.log('Order created successfully');

    // Send emails
    try {
      console.log('Sending confirmation emails...');
      await sendOrderConfirmationEmail(order);
      console.log('Emails sent successfully');
    } catch (emailError) {
      console.error('Email sending failed (order still created):', emailError);
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('=== ORDER API ERROR ===');
    console.error('Error:', error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
