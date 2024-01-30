import { FrameRequest, getFrameAccountAddress } from '@coinbase/onchainkit';
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  try {
    const body: FrameRequest = await req.json();
    accountAddress = await getFrameAccountAddress(body, { NEYNAR_API_KEY: 'NEYNAR_API_DOCS' });
  } catch (err) {
    console.error(err);
  }

  return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="https://zizzamia.xyz/park-2.png" />
    <meta property="fc:frame:button:1" content="${accountAddress}" />
    <meta property="fc:frame:post_url" content="https://zizzamia.xyz/api/frame" />
  </head></html>`);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body: {
    price: string;
    token: string;
    chain_id: string;
    proposer: string;
  } = await req.json();
  const proposedPrice = body.price;
  const token = body.token;

  await kv.set(`tokens:${token}_${body.chain_id}`, proposedPrice);


}

export async function GET(request: NextRequest) {
  const prices = await kv.hgetall('tokens:USDC');
  
  return NextResponse.json(
    prices,
    {
      status: 200,
    },
  );
}

export const dynamic = 'force-dynamic';
