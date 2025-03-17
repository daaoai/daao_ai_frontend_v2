import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { daaoAddress: string } }) {
  try {
    const { daaoAddress } = params;
    console.log('Requested DAO Address:', daaoAddress);

    // Fetch the JSON file from the public folder
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/data/daaos.json`);

    if (!res.ok) {
      throw new Error('Failed to fetch daaos');
    }

    const daaos = await res.json();

    // You can now use daaoAddress to filter or find specific DAO data
    // For example:
    const specificDao = daaos.find((dao: any) => dao.address === daaoAddress);

    if (!specificDao) {
      return NextResponse.json({ success: false, message: 'DAO not found' }, { status: 404 });
    }

    // Return the specific DAO data
    return NextResponse.json({ success: true, data: specificDao });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to load data', error: error.message }, { status: 500 });
  }
}
