import { FrameRequest, getFrameAccountAddress } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../kysely';

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
    <meta property="fc:frame:post_url" content="" />
  </head></html>`);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return getResponse(req);
}

// This is the frame URL
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if(!slug) {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://zizzamia.xyz/park-2.png" />
      <meta property="fc:frame:button:1" content="Project not found" />
      <meta property="fc:frame:post_url" content="" />
    </head></html>`);
  }

  const result = await db
    .selectFrom('projects')
    .selectAll()
    .where('slug', '=', slug)
    .executeTakeFirst();

  if(!result) {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://zizzamia.xyz/park-2.png" />
      <meta property="fc:frame:button:1" content="Project not found" />
      <meta property="fc:frame:post_url" content="" />
    </head></html>`);
  }

  // return with project image and name
  return new NextResponse(`<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${result.image}" />
      <meta property="fc:frame:button:1" content="${result.name}" />
      <meta property="fc:frame:post_url" content="" />
    </head></html>`);
}

export const dynamic = 'force-dynamic';
