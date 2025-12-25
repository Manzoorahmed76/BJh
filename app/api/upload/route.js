import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BJDEVS_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // clientPayload mein hum password receive karenge agar user ne set kiya hoga
        return {
          allowedContentTypes: [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'video/mp4', 'application/zip', 'text/plain', 'text/html', 
            'text/css', 'application/javascript', 'application/pdf'
          ],
          tokenPayload: clientPayload, // Password metadata store karne ke liye
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
