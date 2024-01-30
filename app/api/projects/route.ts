import { NextResponse } from 'next/server';
import { NewProject, db } from '../kysely';
import { seed } from '../seed';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if(id) {
      const result = await db
        .selectFrom('projects')
        .selectAll()
        .where('id', '=', Number(id))
        .execute();
      return NextResponse.json({ result }, { status: 200 });
    }
    // find by slug
    if(slug) {
      const result = await db
        .selectFrom('projects')
        .selectAll()
        .where('slug', '=', slug)
        .execute();
      return NextResponse.json({ result }, { status: 200 });
    }
    // find latest 10
    const result = await db
      .selectFrom('projects')
      .selectAll()
      .limit(10)
      .orderBy('createdAt', 'desc')
      .execute();

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

/// Create a new project
/// TODO: add auth
export async function POST(req: Request) {
  const body: NewProject = await req.json();

  try {
    const result = await db
        .insertInto('projects')
        .values(body)
        .returningAll()
        .execute();
    return NextResponse.json({ result }, { status: 200 });
  } catch (error: any) {
    if (error.message === `relation "users" does not exist`) {
      console.log(
        'Table does not exist, creating...'
      )
      // Table is not created yet
      await seed()
      const result = await db
        .insertInto('projects')
        .values(body)
        .returningAll()
        .execute();
      return NextResponse.json({ result }, { status: 200 });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}