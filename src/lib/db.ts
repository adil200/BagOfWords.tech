/**
 * Cloudflare D1 Database Client
 * Supports:
 * 1. Cloudflare Native D1 Binding (process.env.DB or Cloudflare request context)
 * 2. Cloudflare D1 HTTP REST API fallback (for local development via CLOUDFLARE_* env vars)
 * 3. In-memory graceful fallback (preventing crashes during local builds or when credentials are not yet set)
 */

interface D1QueryResult<T = any> {
  results: T[];
  success: boolean;
  error?: string;
}

// In-memory store for fallback during local development/build if D1 is not bound
const localStore = {
  contacts: [] as any[],
  newsletter: [] as any[],
  comments: [] as any[],
};

export async function executeD1Query<T = any>(sql: string, params: any[] = []): Promise<D1QueryResult<T>> {
  // 1. Try Cloudflare Worker / Pages Native D1 Binding
  // @ts-ignore
  const nativeDb = (typeof process !== 'undefined' && process.env?.DB) || (globalThis as any).DB;
  if (nativeDb && typeof nativeDb.prepare === 'function') {
    try {
      const stmt = nativeDb.prepare(sql).bind(...params);
      const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
      if (isSelect) {
        const res = await stmt.all();
        return { results: res.results as T[], success: true };
      } else {
        const res = await stmt.run();
        return { results: [], success: res.success !== false };
      }
    } catch (err: any) {
      console.error('[D1 Native] Query error:', err);
      return { results: [], success: false, error: err.message };
    }
  }

  // 2. Try Cloudflare D1 REST API (for local development)
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (accountId && databaseId && apiToken) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql, params }),
        }
      );
      const data = await response.json();
      if (data.success && data.result?.[0]) {
        return {
          results: (data.result[0].results || []) as T[],
          success: true,
        };
      } else {
        console.warn('[D1 REST] API Error:', data.errors);
        return {
          results: [],
          success: false,
          error: data.errors?.[0]?.message || 'REST query failed',
        };
      }
    } catch (restErr: any) {
      console.warn('[D1 REST] Network error:', restErr.message);
    }
  }

  // 3. Graceful in-memory fallback for local development & build time
  return handleInMemoryFallback<T>(sql, params);
}

function handleInMemoryFallback<T>(sql: string, params: any[]): D1QueryResult<T> {
  const normalized = sql.trim();
  const lower = normalized.toLowerCase();

  // Handle Comments SELECT
  if (lower.startsWith('select * from comments')) {
    const slug = params[0];
    const filtered = localStore.comments.filter((c) => c.article_slug === slug);
    return { results: filtered as unknown as T[], success: true };
  }

  // Handle Newsletter check SELECT
  if (lower.startsWith('select id from newsletter where email =')) {
    const email = params[0];
    const found = localStore.newsletter.filter((n) => n.email === email);
    return { results: found as unknown as T[], success: true };
  }

  // Handle Newsletter INSERT
  if (lower.startsWith('insert into newsletter')) {
    const [id, email, status] = params;
    localStore.newsletter.push({ id, email, status, created_at: new Date().toISOString() });
    return { results: [], success: true };
  }

  // Handle Contacts INSERT
  if (lower.startsWith('insert into contacts')) {
    const [id, name, email, message, status] = params;
    localStore.contacts.push({ id, name, email, message, status, created_at: new Date().toISOString() });
    return { results: [], success: true };
  }

  // Handle Comments INSERT
  if (lower.startsWith('insert into comments')) {
    const [id, article_slug, content, author_name, author_avatar, parent_id, is_author] = params;
    localStore.comments.push({
      id,
      article_slug,
      content,
      author_name,
      author_avatar,
      parent_id,
      is_author,
      upvotes: 0,
      downvotes: 0,
      created_at: new Date().toISOString(),
    });
    return { results: [], success: true };
  }

  // Handle Newsletter DELETE (unsubscribe)
  if (lower.startsWith('delete from newsletter where email =')) {
    const email = params[0];
    localStore.newsletter = localStore.newsletter.filter((n) => n.email !== email);
    return { results: [], success: true };
  }

  // Handle Comment upvote
  if (lower.startsWith('update comments set upvotes = upvotes + 1')) {
    const id = params[0];
    const comment = localStore.comments.find((c) => c.id === id);
    if (comment) comment.upvotes = (comment.upvotes || 0) + 1;
    return { results: [], success: true };
  }

  // Handle Comment downvote
  if (lower.startsWith('update comments set downvotes = downvotes + 1')) {
    const id = params[0];
    const comment = localStore.comments.find((c) => c.id === id);
    if (comment) comment.downvotes = (comment.downvotes || 0) + 1;
    return { results: [], success: true };
  }

  return { results: [], success: true };
}
