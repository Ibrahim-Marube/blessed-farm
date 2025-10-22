import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const showArchived = searchParams.get('archived') === 'true';
    
    // Show archived orders or non-archived orders (including orders without archived field)
    const filter = showArchived 
      ? { archived: true }
      : { $or: [{ archived: false }, { archived: { $exists: false } }] };
    
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
