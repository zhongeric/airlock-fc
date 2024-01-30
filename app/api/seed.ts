import { db, sql } from './kysely';

export async function seed() {
  const createTable = await db.schema
    .createTable('projects')
    .ifNotExists()
    .addColumn('id', 'serial', (cb) => cb.primaryKey())
    .addColumn('name', 'varchar(255)', (cb) => cb.notNull())
    .addColumn('slug', 'varchar(255)', (cb) => cb.notNull().unique())
    .addColumn('webhookUrl', 'varchar(255)', (cb) => cb.notNull().unique())
    .addColumn('image', 'varchar(255)')
    .addColumn('createdAt', sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`)
    )
    .execute()
  console.log(`Created "project" table`)

  return {
    createTable
  }
}
