import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendOrderStatusEmail } from '@/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Send email if status was updated (not archived)
    if (body.status && !body.archived) {
      try {
        await sendOrderStatusEmail(order);
        console.log('✅ Status update email sent for order:', order.orderNumber);
      } catch (emailError) {
        console.error('❌ Failed to send status email:', emailError);
      }
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Order deleted permanently' });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
