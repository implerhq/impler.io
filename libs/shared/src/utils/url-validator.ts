/**
 * Validates that a URL is safe for server-side requests.
 * Prevents SSRF attacks by blocking internal/private network addresses.
 */
export function isUrlSafeForServerRequest(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);

    // Only allow http and https protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    const hostname = url.hostname.toLowerCase();

    // Block localhost variants
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0.0.0.0' ||
      hostname === '[::1]'
    ) {
      return false;
    }

    // Block private IPv4 ranges
    const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4Match) {
      const [, a, b] = ipv4Match.map(Number);
      // 10.0.0.0/8
      if (a === 10) return false;
      // 172.16.0.0/12
      if (a === 172 && b >= 16 && b <= 31) return false;
      // 192.168.0.0/16
      if (a === 192 && b === 168) return false;
      // 169.254.0.0/16 (link-local, AWS metadata)
      if (a === 169 && b === 254) return false;
      // 0.0.0.0/8
      if (a === 0) return false;
    }

    // Block cloud metadata endpoints
    const blockedHostnames = [
      'metadata.google.internal',
      'metadata.google.com',
      'metadata',
      'instance-data',
    ];
    if (blockedHostnames.includes(hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a webhook/callback URL.
 * Returns error message if invalid, null if valid.
 */
export function validateWebhookUrl(urlStr: string): string | null {
  if (!urlStr || typeof urlStr !== 'string') {
    return 'URL is required';
  }

  try {
    new URL(urlStr);
  } catch {
    return 'Invalid URL format';
  }

  if (!isUrlSafeForServerRequest(urlStr)) {
    return 'URL points to a restricted address. Only public HTTP(S) URLs are allowed.';
  }

  return null;
}

/**
 * Maximum allowed pagination limit to prevent memory exhaustion.
 */
export const MAX_PAGINATION_LIMIT = 1000;

/**
 * Sanitize and clamp pagination parameters.
 */
export function sanitizePaginationParams(page: number, limit: number): { page: number; limit: number } {
  const safePage = Math.max(1, Math.floor(Number(page) || 1));
  const safeLimit = Math.min(Math.max(1, Math.floor(Number(limit) || 10)), MAX_PAGINATION_LIMIT);

  return { page: safePage, limit: safeLimit };
}
