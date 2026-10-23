/**
 * Cloudflare R2 Asset Mapping
 * Maps canonical file names to exact object names in the Cloudflare R2 bucket `bagofwords-assets`.
 * Includes overrides for downloaded files with ' (1)', ' (3)', etc.
 */

export const ASSET_MAPPING: Record<string, string> = {
  // Main Hero & Branding
  'hero.png': 'hero.png',
  'Ai_Hero.svg': 'Ai_Hero.svg',
  'ai-working.svg': 'ai-working.svg',
  'mission.png': 'mission.png',
  'community-image.png': 'community-image.png',
  'bot-icon.svg': 'bot-icon.svg',
  'BoW.png': 'BoW.png',

  // Author & Profile (Adil Naib)
  'adil.png': 'adil (1).png',
  'adil (1).png': 'adil (1).png',
  'Profile Photo (1).jpg': 'Profile Photo (1).jpg',
  'Profile Photo-compressed (1).jpg': 'Profile Photo-compressed (1).jpg',
  'WhatsApp Image 2025-11-03 at 14.53.34_361a3eec (1).jpg': 'WhatsApp Image 2025-11-03 at 14.53.34_361a3eec (1).jpg',

  // Articles & Features
  'Firewall.png': 'Firewall (1).png',
  'Firewall (1).png': 'Firewall (1).png',
  'PasswordCrypto.png': 'PasswordCrypto (1).png',
  'PasswordCrypto (1).png': 'PasswordCrypto (1).png',
  'diffusion.png': 'compressedImage1 (1).png',
  'compressedImage1 (1).png': 'compressedImage1 (1).png',
  'PyRegExp.png': 'compressedImage (1).jpeg',
  'compressedImage (1).jpeg': 'compressedImage (1).jpeg',
  'Generated Image November 08, 2025 - 4_33PM (1).png': 'Generated Image November 08, 2025 - 4_33PM (1).png',

  // Imagen 3 Tutorial Screenshots
  'export.png': 'export.png',
  'Output1.png': 'Output1.png',
  'Output2.png': 'Output2.png',
  'Output3.png': 'Output3.png',
  'prompt.png': 'prompt.png',

  // Media (Videos & PDFs)
  'First.mp4': 'First.mp4',
  'Second.mp4': 'Second.mp4',
  'GH-300.pdf': 'GH-300 (3).pdf',
  'GH-300 (3).pdf': 'GH-300 (3).pdf',
  'GitHub-CoPilot.avif': 'GitHub-CoPilot-770x433 (1).avif',
  'GitHub-CoPilot-770x433 (1).avif': 'GitHub-CoPilot-770x433 (1).avif',
};

export const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_URL || 'https://assets.bagofwords.tech';

/**
 * Returns a publicly accessible URL for an asset in Cloudflare R2
 * Handles URL encoding of spaces and special characters (e.g. "Firewall (1).png" -> "Firewall%20(1).png")
 */
export function getR2AssetUrl(filename: string): string {
  if (!filename) return '';
  const mapped = ASSET_MAPPING[filename] || filename;
  const encodedName = encodeURI(mapped);
  return `${ASSETS_BASE_URL}/${encodedName}`;
}
