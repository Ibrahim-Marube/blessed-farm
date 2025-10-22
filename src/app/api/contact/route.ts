import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save contact message
    const contact = await Contact.create(body);

    // Send notification to admin
    try {
      await sgMail.send({
        to: process.env.ADMIN_EMAIL || 'ibrahimnmarube@gmail.com',
        from: process.env.SENDGRID_FROM_EMAIL || 'ibrahimnmarube@gmail.com',
        subject: `New Contact Message from ${body.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0;">📬 New Contact Message</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <p><strong>From:</strong> ${body.name}</p>
                <p><strong>Email:</strong> ${body.email}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 10px;">
                  ${body.message.replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit message' },
      { status: 500 }
    );
  }
}
