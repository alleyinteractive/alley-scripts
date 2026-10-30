import apiFetch, { APIFetchOptions } from '@wordpress/api-fetch';
import { getQueryArgs } from '@wordpress/url';

/**
 * A minimal in-memory WordPress REST API so components that call apiFetch or
 * the core data store can render in Storybook without a WordPress backend.
 */

const image = (seed: string) => `https://picsum.photos/seed/${seed}/600/400`;

const media = [
  { id: 1, mime_type: 'image/jpeg', media_type: 'image', source_url: image('alley-1'), alt_text: 'Mountains' },
  { id: 2, mime_type: 'image/jpeg', media_type: 'image', source_url: image('alley-2'), alt_text: 'Ocean' },
  { id: 3, mime_type: 'image/jpeg', media_type: 'image', source_url: image('alley-3'), alt_text: 'Forest' },
  { id: 10, mime_type: 'audio/mpeg', media_type: 'file', source_url: 'https://cldup.com/59IrU0WJtq.mp3', alt_text: '' },
  { id: 20, mime_type: 'video/mp4', media_type: 'file', source_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', alt_text: '' },
].map((item) => ({
  ...item,
  type: 'attachment',
  title: { rendered: `Attachment ${item.id}` },
  media_details: {
    sizes: item.media_type === 'image' ? {
      thumbnail: { source_url: item.source_url.replace('600/400', '150/150') },
      full: { source_url: item.source_url },
    } : {},
  },
}));

const postTitles = [
  'Hello World',
  'Building Blocks for the Modern Newsroom',
  'A Field Guide to the WordPress Block Editor',
  'Ten Tips for Faster Publishing',
  'Why Structured Content Matters',
  'Designing for Accessibility First',
  'The Art of the Headline',
  'Inside the Editorial Workflow',
  'Measuring What Matters',
  'Notes From the Engineering Team',
  'How We Ship on Fridays',
  'An Ode to the Humble Paragraph',
  'Shipping Stories at Scale',
  'Breaking News, Unbroken Sites',
  'Small Changes, Big Results',
];

const posts = postTitles.map((title, index) => {
  const id = 100 + index;
  const type = index % 4 === 3 ? 'page' : 'post';

  return {
    id,
    type,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    status: 'publish',
    link: `https://example.org/${type}/${id}/`,
    title: { rendered: title, raw: title },
    excerpt: { rendered: `<p>An excerpt for &ldquo;${title}&rdquo;.</p>` },
    featured_media: index < 3 ? media[index].id : 0,
    categories: [200 + (index % 6) * 2],
    tags: [201 + (index % 6) * 2],
    meta: {
      subtitle: `A subtitle for ${title}`,
      hide_from_homepage: false,
    },
  };
});

const terms = [
  'Business', 'Culture', 'Engineering', 'Design', 'News', 'Opinion',
  'Politics', 'Science', 'Sports', 'Technology', 'Travel', 'World',
].map((name, index) => ({
  id: 200 + index,
  name,
  taxonomy: index % 2 ? 'post_tag' : 'category',
}));

const taxonomies = {
  category: { slug: 'category', name: 'Categories', rest_base: 'categories', rest_namespace: 'wp/v2', types: ['post'] },
  post_tag: { slug: 'post_tag', name: 'Tags', rest_base: 'tags', rest_namespace: 'wp/v2', types: ['post'] },
};

const settings: Record<string, unknown> = {
  title: 'Alley Scripts',
  description: 'Shared packages from Alley Interactive.',
  posts_per_page: 10,
};

const types = {
  post: { slug: 'post', name: 'Posts', rest_base: 'posts', rest_namespace: 'wp/v2' },
  page: { slug: 'page', name: 'Pages', rest_base: 'pages', rest_namespace: 'wp/v2' },
  attachment: { slug: 'attachment', name: 'Media', rest_base: 'media', rest_namespace: 'wp/v2' },
};

const matches = (text: string, search?: unknown) => (
  !search || text.toLowerCase().includes(String(search).toLowerCase())
);

const csv = (value: unknown): string[] => (
  value ? String(value).split(',').filter((item) => item && item !== 'any') : []
);

/**
 * Paginate a result set, returning the page and the total page count.
 */
const paginate = <T>(items: T[], args: Record<string, unknown>) => {
  const perPage = Number(args.per_page ?? 10);
  const page = Number(args.page ?? 1);

  return {
    body: items.slice((page - 1) * perPage, page * perPage),
    headers: {
      'X-WP-Total': String(items.length),
      'X-WP-TotalPages': String(Math.max(1, Math.ceil(items.length / perPage))),
    },
  };
};

const search = (args: Record<string, unknown>) => {
  const include = csv(args.include).map(Number);
  const exclude = csv(args.exclude).map(Number);
  const subtypes = csv(args.subtype);

  if (args.type === 'term') {
    return terms
      .filter((term) => !subtypes.length || subtypes.includes(term.taxonomy))
      .filter((term) => matches(term.name, args.search))
      .map((term) => ({
        id: term.id,
        title: term.name,
        type: term.taxonomy,
        url: `https://example.org/${term.taxonomy}/${term.id}/`,
      }));
  }

  return posts
    .filter((post) => !include.length || include.includes(post.id))
    .filter((post) => !exclude.includes(post.id))
    .filter((post) => !subtypes.length || subtypes.includes(post.type))
    .filter((post) => matches(post.title.rendered, args.search))
    .map((post) => ({
      id: post.id,
      title: post.title.rendered,
      type: 'post',
      subtype: post.type,
      url: post.link,
      _embedded: {
        self: [post],
      },
    }));
};

type Result = { body: unknown; headers?: Record<string, string>; status?: number };

const route = (path: string, method: string, data: Record<string, unknown> = {}): Result => {
  const [pathname] = path.split('?');
  const isWrite = ['POST', 'PUT', 'PATCH'].includes(method);
  const args = getQueryArgs(path) as Record<string, unknown>;
  const notFound = { body: { code: 'rest_not_found', message: 'Not found.' }, status: 404 };
  let match: RegExpMatchArray | null;

  if (pathname === '/wp/v2/search') {
    return paginate(search(args), args);
  }

  if (pathname === '/wp/v2/types') {
    return { body: types };
  }

  if ((match = pathname.match(/^\/wp\/v2\/types\/([\w-]+)$/))) {
    return types[match[1] as keyof typeof types] ? { body: types[match[1] as keyof typeof types] } : notFound;
  }

  if ((match = pathname.match(/^\/wp\/v2\/media\/(\d+)$/))) {
    const item = media.find(({ id }) => id === Number(match![1]));
    return item ? { body: item } : notFound;
  }

  if (pathname === '/wp/v2/media') {
    return paginate(media, args);
  }

  if ((match = pathname.match(/^\/wp\/v2\/(posts|pages)\/(\d+)$/))) {
    const type = match[1] === 'posts' ? 'post' : 'page';
    const item = posts.find(({ id }) => id === Number(match![2]));

    if (!item || item.type !== type) {
      return notFound;
    }

    if (isWrite) {
      Object.assign(item, data);
    }

    return { body: item };
  }

  if ((match = pathname.match(/^\/wp\/v2\/(posts|pages)$/))) {
    const type = match[1] === 'posts' ? 'post' : 'page';
    const include = csv(args.include).map(Number);
    return paginate(
      posts.filter((post) => post.type === type && (!include.length || include.includes(post.id))),
      args,
    );
  }

  if (/^\/wp\/v2\/(posts|pages)\/\d+\/autosaves$/.test(pathname)) {
    return { body: [] };
  }

  if (pathname === '/wp/v2/taxonomies') {
    return { body: taxonomies };
  }

  if ((match = pathname.match(/^\/wp\/v2\/(categories|tags)(?:\/(\d+))?$/))) {
    const taxonomy = match[1] === 'categories' ? 'category' : 'post_tag';
    const found = terms.filter((term) => term.taxonomy === taxonomy);

    if (match[2]) {
      const term = found.find(({ id }) => id === Number(match![2]));
      return term ? { body: term } : notFound;
    }

    return paginate(found, args);
  }

  if (pathname === '/wp/v2/settings') {
    if (isWrite) {
      Object.assign(settings, data);
    }

    return { body: settings };
  }

  if (pathname === '/wp/v2/themes') {
    return { body: [{ stylesheet: 'twentytwentyfour', name: { rendered: 'Twenty Twenty-Four' } }] };
  }

  return notFound;
};

const LATENCY = 300;

apiFetch.setFetchHandler(async (options: APIFetchOptions) => {
  const {
    data,
    method = 'GET',
    parse = true,
    path = '',
    signal,
  } = options;
  const { body, headers = {}, status = 200 } = route(path, method.toUpperCase(), data as Record<string, unknown>);

  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, LATENCY);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('The operation was aborted.', 'AbortError'));
    });
  });

  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

  if (!parse) {
    return response;
  }

  if (status >= 400) {
    throw await response.json();
  }

  return response.json();
});

export { media, posts, terms };
