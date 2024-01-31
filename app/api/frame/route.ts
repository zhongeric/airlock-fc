import { FrameRequest, getFrameAccountAddress } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../kysely';
import axios from 'axios';

export const HOST = "https://seer-fc.vercel.app"
export const BASE_URL = "https://seer-fc.vercel.app/api/frame";
export const DEFAULT_LANDING_IMG = HOST + "/airlock.png";
export const NOT_FOUND_IMG = HOST + "/not-found.jpg";
export const ELIGIBLE_IMG = HOST + "/success.png";
export const NOT_ELIGIBLE_IMG = HOST + "/fail.png";
export const ERROR_IMG = "";

export type WebhookUrlResponse = {
  eligible: boolean;
  quantity?: number;
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  try {
    const body: FrameRequest = await req.json();
    accountAddress = await getFrameAccountAddress(body, { NEYNAR_API_KEY: 'NEYNAR_API_DOCS' });
  } catch (err) {
    console.error(err);
  }

  const { searchParams } = new URL(req.url);
  const webhookUrl = searchParams.get('webhook_url');

  if(!webhookUrl) {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${NOT_FOUND_IMG}" />
      <meta property="fc:frame:button:1" content="Project not found" />
      <meta property="fc:frame:post_url" content="${BASE_URL}" />
    </head></html>`);
  }

  // Make the get request to the webhook url, and process the response
  const res = await axios.get<WebhookUrlResponse>(`${webhookUrl}?address=${accountAddress}`);
  console.log(res.status);
  console.log(res.data);

  if(res.status !== 200) {
    return NextResponse.json({ error: "Failed to fetch webhook" }, { status: 500 });
  }
  if(!Object.keys(res.data).includes('eligible')) {
    return NextResponse.json({ error: "Invalid webhook response" }, { status: 500 });
  }
  if(!res.data.eligible) {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${NOT_ELIGIBLE_IMG}" />
      <meta property="fc:frame:button:1" content="Not eligible" />
      <meta property="fc:frame:post_url" content="${BASE_URL}" />
    </head></html>`);
  }

  const successText = res.data.quantity ? `You are eligible for ${res.data.quantity}` : `You are eligible`;

  return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${ELIGIBLE_IMG}" />
    <meta property="fc:frame:button:1" content="${successText}" />
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
      <meta property="fc:frame:image" content="${NOT_FOUND_IMG}" />
      <meta property="fc:frame:button:1" content="Project not found" />
      <meta property="fc:frame:post_url" content="${BASE_URL}" />
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
      <meta property="fc:frame:image" content="${NOT_FOUND_IMG}" />
      <meta property="fc:frame:button:1" content="Project not found" />
      <meta property="fc:frame:post_url" content="${BASE_URL}" />
    </head></html>`);
  }

  // return with project image and name
  // TODO: add current url here + webhook url to pass to POST
  return new NextResponse(`<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${result.image}" />
      <meta property="fc:frame:button:1" content="${result.name}" />
      <meta property="fc:frame:post_url" content="${BASE_URL}?webhook_url=${result.webhookUrl}" />
    </head></html>`);
}

export const dynamic = 'force-dynamic';
