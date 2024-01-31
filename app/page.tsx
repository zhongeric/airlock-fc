import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { BASE_URL } from './api/frame/route';

const TITLE = "Airlock"

const frameMetadata = getFrameMetadata({
  buttons: ['Check eligibility'],
  image: 'https://zizzamia.xyz/park-1.png',
  post_url: BASE_URL,
});

export const metadata: Metadata = {
  title: TITLE,
  description: 'LFG',
  openGraph: {
    title: TITLE,
    description: 'LFG',
    images: ['https://zizzamia.xyz/park-1.png'],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Airlock</h1>
    </>
  );
}
