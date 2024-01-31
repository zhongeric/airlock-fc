import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata, ResolvingMetadata } from 'next';
import { BASE_URL } from '../app/api/frame/route';
import { db } from './api/kysely';

const TITLE = "Airlock"

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const defaultFrameMetadata = getFrameMetadata({
    buttons: ['Airlock secured'],
    image: 'https://zizzamia.xyz/park-1.png',
    post_url: '',
  });
  // read route params
  const slug = searchParams.slug
  if(!slug) {
    // TODO: path to choose popular projects here 
    // generic metadata
    return {
      title: TITLE,
      description: 'LFG',
      openGraph: {
        title: TITLE,
        description: 'LFG',
        images: ['https://zizzamia.xyz/park-1.png'],
      },
      other: {
        ...defaultFrameMetadata
      },
    };
  }

  const res = await db.selectFrom('projects')
    .select('webhookUrl')
    .where('slug', '=', slug)
    .executeTakeFirst();

  const frameMetadata = getFrameMetadata({
      buttons: ['Check eligibility'],
      image: 'https://zizzamia.xyz/park-1.png',
      post_url: `${BASE_URL}?webhookUrl=${res?.webhookUrl}`,
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
      ...frameMetadata
    },
  };
}

export default function Page({ params, searchParams }: Props) {}
