import { NextResponse } from 'next/server';
import { sendCustomerConfirmation, sendAdminNotification } from '@/lib/utils/email';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    await Promise.all([
      sendCustomerConfirmation(data),
      sendAdminNotification(data),
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
