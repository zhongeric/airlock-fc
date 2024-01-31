import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata, ResolvingMetadata } from 'next';
import { BASE_URL } from '../app/api/frame/route';

const TITLE = "Airlock"

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = searchParams.slug
 
  // fetch data
  // const product = await fetch(`https://.../${id}`).then((res) => res.json())

  const frameMetadata = getFrameMetadata({
    buttons: ['Check eligibility'],
    image: 'https://zizzamia.xyz/park-1.png',
    post_url: `${BASE_URL}?slug=${slug}`,
  });
 
  return {
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
}

export default function Page({ params, searchParams }: Props) {}
