/**
 * Maps canonical file names to exact object keys in the Cloudflare R2 bucket.
 */
export const ASSET_MAPPING: Record<string, string> = {
  'hero.png': 'hero.png',
  'Ai_Hero.svg': 'Ai_Hero.svg',
  'ai-working.svg': 'ai-working.svg',
  'mission.png': 'mission.png',
  'community-image.png': 'community-image.png',
  'bot-icon.svg': 'bot-icon.svg',
  'BoW.png': 'BoW.png',
  'adil.png': 'adil (1).png',
  'adil (1).png': 'adil (1).png',
  'Profile Photo (1).jpg': 'Profile Photo (1).jpg',
  'Profile Photo-compressed (1).jpg': 'Profile Photo-compressed (1).jpg',
  'WhatsApp Image 2025-11-03 at 14.53.34_361a3eec (1).jpg': 'WhatsApp Image 2025-11-03 at 14.53.34_361a3eec (1).jpg',
  'WhatsApp Image 2025-11-03 at 14.53.34_361a3eec (1)': 'WhatsApp Image 2025-11-03 at 14.53.34_361a3eec (1).jpg',
  'compressedImage (1)': 'compressedImage (1).jpeg',
  'compressedImage (1).jpeg': 'compressedImage (1).jpeg',
  'Firewall.png': 'Firewall (1).png',
  'Firewall (1).png': 'Firewall (1).png',
  'PasswordCrypto.png': 'PasswordCrypto (1).png',
  'PasswordCrypto (1).png': 'PasswordCrypto (1).png',
  'diffusion.webp': 'diffusion.webp',
  'diffusion.png': 'diffusion.webp',
  'diffusion': 'diffusion.webp',
  'PyRegExp.jpg': 'PyRegExp.jpg',
  'PyRegExp.webp': 'PyRegExp.webp',
  'PyRegExp.png': 'PyRegExp.jpg',
  'PyRegExp': 'PyRegExp.jpg',
  'Generated Image November 08, 2025 - 4_33PM (1).png': 'Generated Image November 08, 2025 - 4_33PM (1).png',
  'export.png': 'export.png',
  'Output1.png': 'Output1.png',
  'Output2.png': 'Output2.png',
  'Output3.png': 'Output3.png',
  'prompt.png': 'prompt.png',
  'First.mp4': 'First.mp4',
  'Second.mp4': 'Second.mp4',
  'GH-300.pdf': 'GH-300 (3).pdf',
  'GH-300 (3).pdf': 'GH-300 (3).pdf',
  'GitHub-CoPilot.avif': 'GitHub-CoPilot-770x433 (1).avif',
  'GitHub-CoPilot-770x433 (1).avif': 'GitHub-CoPilot-770x433 (1).avif',
};

export const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_URL || 'https://assets.bagofwords.tech';

/**
 * Returns a publicly accessible URL for an asset in Cloudflare R2, encoding special characters.
 */
export function getR2AssetUrl(filename: string): string {
  if (!filename) return '';
  const mapped = ASSET_MAPPING[filename] || filename;
  const encodedName = encodeURI(mapped);
  return `${ASSETS_BASE_URL}/${encodedName}`;
}
