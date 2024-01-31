import { Generated, ColumnType, Selectable, Insertable, Updateable } from 'kysely'
import { createKysely } from '@vercel/postgres-kysely'

interface ProjectsTable {
  // Columns that are generated by the database should be marked
  // using the `Generated` type. This way they are automatically
  // made optional in inserts and updates.
  id: Generated<number>
  name: string
  slug: string
  webhookUrl: string
  image: string

  // You can specify a different type for each operation (select, insert and
  // update) using the `ColumnType<SelectType, InsertType, UpdateType>`
  // wrapper. Here we define a column `createdAt` that is selected as
  // a `Date`, can optionally be provided as a `string` in inserts and
  // can never be updated:
  createdAt: ColumnType<Date, string | undefined, never>
}

export type Project = Selectable<ProjectsTable>
export type NewProject = Insertable<ProjectsTable>
export type ProjectUpdate = Updateable<ProjectsTable>

// Keys of this interface are table names.
export interface Database {
  projects: ProjectsTable
}

export const db = createKysely<Database>()
export { sql } from 'kysely'