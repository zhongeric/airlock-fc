import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata, ResolvingMetadata } from 'next';
import { BASE_URL, DEFAULT_LANDING_IMG } from '../app/api/frame/route';
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
  let imgUrl = DEFAULT_LANDING_IMG;
  const defaultFrameMetadata = getFrameMetadata({
    buttons: ['Airlock secured'],
    image: imgUrl,
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
        images: [imgUrl],
      },
      other: {
        ...defaultFrameMetadata
      },
    };
  }

  const res = await db.selectFrom('projects')
    .selectAll()
    .where('slug', '=', slug)
    .executeTakeFirst();

  imgUrl = res ? res.image : DEFAULT_LANDING_IMG;

  const frameMetadata = getFrameMetadata({
      buttons: ['Check eligibility'],
      image: imgUrl,
      post_url: `${BASE_URL}?webhookUrl=${res?.webhookUrl}`,
  });
 
  return {
    title: TITLE,
    description: 'LFG',
    openGraph: {
      title: TITLE,
      description: 'LFG',
      images: [imgUrl],
    },
    other: {
      ...frameMetadata
    },
  };
}

export default function Page({ params, searchParams }: Props) {}
