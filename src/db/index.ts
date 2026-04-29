import { mkdirSync } from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });

const client = createClient({
  url: `file:${path.join(process.cwd(), 'data/dev.db')}`,
});

export const db = drizzle(client, { schema });
