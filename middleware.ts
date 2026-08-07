/**
 * Vercel Edge Middleware.
 *
 * This app is a client-side SPA (React, no SSR), so search-engine and
 * social-media crawlers (Facebook, WhatsApp, Telegram, X/Twitter, LinkedIn,
 * Slack, Discord, etc.) never execute the JavaScript that renders an
 * article. They only ever see the static <head> of index.html, which is
 * always the same regardless of which article URL was shared.
 *
 * This middleware detects those crawler user-agents specifically, and for
 * article URLs (/artikel/:id) responds with a small server-rendered HTML
 * document containing the correct og:title / og:description / og:image for
 * that article (fetched live from Firestore's public REST API). Real human
 * visitors are untouched and continue to get the normal React app.
 */

const FIRESTORE_PROJECT_ID = 'halo-jatim-news';
const FIRESTORE_DATABASE_ID = '(default)';
const SITE_NAME = 'HALOJATIMNEWS';
const SITE_URL = 'https://halojatimnews-com.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;

// Known social/link-preview crawlers. Extend this list if a platform's
// preview stops working.
const BOT_UA_REGEX =
  /facebookexternalhit|Facebot|WhatsApp|TelegramBot|Twitterbot|LinkedInBot|Slackbot|Discordbot|SkypeUriPreview|Pinterest|redditbot|vkShare|Google-InspectionTool|Applebot/i;

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripFirestoreValue(field: any): string | undefined {
  if (!field) return undefined;
  return field.stringValue ?? field.integerValue ?? undefined;
}

// WhatsApp's crawler is notoriously strict about the OG image: it wants a
// modest file size, a standard 1200x630 aspect ratio, and explicit
// width/height meta tags — otherwise it silently shows no image at all
// (other platforms like Telegram are much more lenient). If the image was
// uploaded via Cloudinary, we can ask Cloudinary to serve an already
// resized/compressed JPG at the exact dimensions WhatsApp expects, by
// injecting a transformation segment into the URL.
function toWhatsAppFriendlyImage(url: string): { url: string; width: number; height: number } {
  const width = 1200;
  const height = 630;
  const marker = '/upload/';
  if (url.includes('res.cloudinary.com') && url.includes(marker)) {
    const idx = url.indexOf(marker) + marker.length;
    const transformed =
      url.slice(0, idx) +
      `w_${width},h_${height},c_fill,g_auto,q_auto,f_jpg/` +
      url.slice(idx);
    return { url: transformed, width, height };
  }
  // Not a Cloudinary URL (e.g. manual hotlink or the default logo) - use as-is.
  return { url, width, height };
}

async function fetchArticle(articleId: string) {
  const url =
    `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}` +
    `/databases/${FIRESTORE_DATABASE_ID}/documents/articles/${encodeURIComponent(articleId)}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const doc = await res.json();
  const fields = doc.fields ?? {};

  return {
    title: stripFirestoreValue(fields.title) ?? SITE_NAME,
    excerpt: stripFirestoreValue(fields.excerpt) ?? 'Informasi Jawa Timur Terkini',
    imageUrl: stripFirestoreValue(fields.imageUrl) ?? DEFAULT_IMAGE,
    category: stripFirestoreValue(fields.category) ?? '',
  };
}

function renderHtml(opts: {
  title: string;
  description: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  url: string;
}): string {
  const { title, description, image, imageWidth, imageHeight, url } = opts;
  const fullTitle = `${escapeHtml(title)} - ${SITE_NAME}`;

  return `<!doctype html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>${fullTitle}</title>
<meta name="description" content="${escapeHtml(description)}" />

<meta property="og:type" content="article" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:image:secure_url" content="${escapeHtml(image)}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="${imageWidth}" />
<meta property="og:image:height" content="${imageHeight}" />
<meta property="og:image:alt" content="${escapeHtml(title)}" />
<meta property="og:url" content="${escapeHtml(url)}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />

<meta http-equiv="refresh" content="0; url=${escapeHtml(url)}" />
</head>
<body></body>
</html>`;
}

export const config = {
  matcher: '/artikel/:path*',
};

export default async function middleware(request: Request) {
  const ua = request.headers.get('user-agent') || '';

  // Not a crawler -> let it fall through to the normal SPA.
  if (!BOT_UA_REGEX.test(ua)) {
    return; // undefined return = continue to the next handler / static file
  }

  const url = new URL(request.url);
  const match = url.pathname.match(/^\/artikel\/([^/]+)/);
  if (!match) return;

  const articleId = decodeURIComponent(match[1]);

  try {
    const article = await fetchArticle(articleId);
    if (!article) return;

    const { url: ogImage, width, height } = toWhatsAppFriendlyImage(article.imageUrl);

    const html = renderHtml({
      title: article.title,
      description: article.excerpt,
      image: ogImage,
      imageWidth: width,
      imageHeight: height,
      url: url.toString(),
    });

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300, s-maxage=600',
      },
    });
  } catch (err) {
    // On any failure, don't break the crawler request — just let it
    // through to the normal SPA shell (generic preview beats a 500).
    return;
  }
}
