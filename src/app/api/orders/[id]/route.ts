import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendOrderStatusEmail } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    
    // Get old order to check if status changed
    const oldOrder = await Order.findById(id);
    const statusChanged = oldOrder && body.status && oldOrder.status !== body.status;
    
    const order = await Order.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Send status email if status was changed
    if (statusChanged) {
      try {
        console.log(`Order status changed to: ${order.status}`);
        await sendOrderStatusEmail(order);
        console.log('Status email sent successfully');
      } catch (emailError) {
        console.error('Failed to send status email:', emailError);
      }
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
