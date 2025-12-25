import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

// Random string banane ka function (e.g., CodAz55x9)
function generateRandomId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BJDEVS_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        // File extension nikaalna (e.g., .jpg)
        const contentType = pathname.split('.').pop();
        // Naya chota naam banana
        const newFilename = `${generateRandomId()}.${contentType}`;
        
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'application/zip', 'application/pdf'],
          // Hum blob storage ko keh rahe hain ke is naye naam se save karo
          addRandomSuffix: false, 
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
