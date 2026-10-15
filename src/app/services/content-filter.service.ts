import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentFilterService {
  // Comprehensive list of explicit, vulgar, and inappropriate terms to clean across the app
  private readonly explicitTerms: RegExp[] = [
    /\b(fuck\w*|shit\w*|bitch\w*|bastard\w*|asshole\w*|cunt\w*|dick\w*|cock\w*|pussy\w*|whore\w*|slut\w*)\b/gi,
    /\b(damn\w*|crap\w*|piss\w*|fag\w*|retard\w*|dumbass\w*|jackass\w*|bullshit\w*)\b/gi,
    /\b(nude|naked|porn\w*|erotic|orgasm|clitoris|penis|vagina|tits|boobs)\b/gi,
    /\b(wtf|stfu|lmao|omfg)\b/gi
  ];

  /**
   * Cleans any string, replacing explicit or vulgar terms with clean neutral wording or stars
   */
  public sanitize(text: string | null | undefined, replacement: string = '***'): string {
    if (!text) return '';
    let sanitized = String(text);
    for (const pattern of this.explicitTerms) {
      sanitized = sanitized.replace(pattern, (match) => {
        // Return friendly sanitized text or clean replacement
        return replacement.length === 3 ? '***' : replacement;
      });
    }
    return sanitized;
  }

  /**
   * Checks if a string contains any explicit or vulgar terms
   */
  public hasExplicitWord(text: string | null | undefined): boolean {
    if (!text) return false;
    const str = String(text);
    return this.explicitTerms.some(pattern => pattern.test(str));
  }
}
