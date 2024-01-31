import { ethers } from "ethers";

export const runtime = 'edge'; // 'nodejs' is the default
export const dynamic = 'force-dynamic'; // static by default, unless reading the request
 
/// Mock airdrop webhook 
/// returns true for all valid eth addresses
export function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if(!address) {
        return Response.json({ error: "Missing address" }, { status: 400 });
    }

    const checksummed = ethers.isAddress(address);
    
    return Response.json({
        eligible: checksummed,
        quantity: 100
    }, { 
        status: 200
    })
}