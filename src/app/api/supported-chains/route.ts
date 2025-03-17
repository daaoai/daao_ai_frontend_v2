import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch the JSON file from the public folder
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/data/supportedChains.json`);

    if (!res.ok) {
      throw new Error('Failed to fetch supported chains');
    }

    const chains = await res.json();

    // Return the JSON data
    return NextResponse.json({ success: true, data: chains });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to load data', error: error.message });
  }
}
