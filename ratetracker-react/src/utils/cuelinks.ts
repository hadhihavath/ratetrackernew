// Cuelinks Publisher Configuration
export const CUELINKS_CONFIG = {
  apiKey: import.meta.env.VITE_CUELINKS_API_KEY || 'oQab8xOk401MwoV5ofoIevFvlP_zu-WR_EarndNqpXk',
  publisherCid: import.meta.env.VITE_CUELINKS_CID || '82192',
  v3BaseUrl: 'https://developers.cuelinks.com/pub_api/v3',
  redirectBaseUrl: 'https://linksredirect.com/',
};

export type LinkMode = 'cuelinks' | 'direct';

/**
 * Generate high-conversion affiliate redirect link
 */
export function generateCuelinksUrl(directUrl: string, subId: string = 'ratetracker'): string {
  if (!directUrl) return '#';
  const cleanUrl = encodeURIComponent(directUrl.trim());
  return `${CUELINKS_CONFIG.redirectBaseUrl}?cid=${CUELINKS_CONFIG.publisherCid}&source=api&url=${cleanUrl}&subid=${encodeURIComponent(subId)}`;
}

/**
 * Get final destination URL based on active link mode
 */
export function getEffectiveUrl(directUrl: string, linkMode: LinkMode, subId: string = 'ratetracker'): string {
  if (linkMode === 'direct') {
    return directUrl;
  }
  return generateCuelinksUrl(directUrl, subId);
}

/**
 * Safe click handler that opens deal without being blocked by ad-blockers
 */
export function openStoreDeal(
  event: React.MouseEvent | MouseEvent | undefined,
  directUrl: string,
  storeName: string,
  productTitle: string,
  linkMode: LinkMode,
  onToast?: (message: string, icon?: string) => void
): void {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const targetUrl = getEffectiveUrl(directUrl, linkMode, `ratetracker_${storeName.toLowerCase()}`);

  if (onToast) {
    onToast(`Opening ${storeName} deal for ${productTitle}...`, '🚀');
  }

  // Attempt window open
  const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');

  // If popup or ad-blocker intercepted window, redirect directly
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = directUrl;
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}