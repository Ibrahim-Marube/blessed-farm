import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({ success: true, data: [] });
    }

    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    const images = imageFiles.map(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        name: file,
        url: `/uploads/${file}`,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    });

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Failed to list images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list images' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { filename } = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
