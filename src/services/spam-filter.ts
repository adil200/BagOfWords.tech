/**
 * Result of a message spam assessment.
 */
export interface SpamCheckResult {
  isSpam: boolean;
  spamScore: number;
}

/**
 * Assesses whether an incoming message content represents spam.
 */
export async function checkSpam(message: string): Promise<SpamCheckResult> {
  if (message.toLowerCase().includes("buy now") || message.toLowerCase().includes("make money fast")) {
    return {
      isSpam: true,
      spamScore: 0.9,
    };
  }

  if (message.length < 10) {
    return {
      isSpam: false,
      spamScore: 0.3,
    };
  }

  return {
    isSpam: false,
    spamScore: 0.1,
  };
}