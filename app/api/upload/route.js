import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BJDEVS_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        // Random ID generator
        const randomId = Math.random().toString(36).substring(2, 10);
        const extension = pathname.split('.').pop();
        const newFileName = `${randomId}.${extension}`;

        return {
          allowedContentTypes: [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'video/mp4', 'video/quicktime', 'video/x-matroska',
            'application/zip', 'application/x-zip-compressed',
            'text/plain', 'text/html', 'text/css', 'application/javascript',
            'application/pdf'
          ],
          // Is line se user ka asli naam hat jayega
          tokenPayload: JSON.stringify({
             newPath: newFileName 
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload Finished:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
