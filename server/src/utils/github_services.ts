import crypto from 'crypto';


interface WebhookVerificationOptions {
    payload: string;
    signature: string | null;
    secret: string;
  }
  

 export function verifyGitHubWebhookSignature({
    payload, 
    signature, 
    secret
  }: WebhookVerificationOptions): boolean {
    if (!signature) return false;
  
    const expectedSignaturePrefix = 'sha256=';
    if (!signature.startsWith(expectedSignaturePrefix)) {
      return false;
    }
  
    const receivedSignature = signature.slice(expectedSignaturePrefix.length);
  
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  
    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature),
      Buffer.from(computedSignature)
    );
  }