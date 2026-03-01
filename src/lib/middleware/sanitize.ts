// Input sanitization middleware

const MALICIOUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
  /javascript:/gi, // JavaScript protocol
  /on\w+\s*=/gi, // Event handlers
  /<iframe/gi, // Iframes
  /eval\(/gi, // Eval function
  /expression\(/gi, // CSS expressions
  /vbscript:/gi, // VBScript protocol
  /data:text\/html/gi, // Data URLs with HTML
];

export function sanitizeString(input: string): string {
  let sanitized = input;
  
  // Remove malicious patterns
  MALICIOUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

export function containsMaliciousContent(input: string): boolean {
  return MALICIOUS_PATTERNS.some(pattern => pattern.test(input));
}
