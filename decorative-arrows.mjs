// Link decoration is geometric so rendering never depends on an arrow font.
export const decorativeArrow='<span class="decorative-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

export function renderDecorativeArrows(html) {
  return html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g,anchor=>anchor
    .replace(/<span aria-hidden="true">\u2197<\/span>/g,decorativeArrow)
    .replace(/\u2197/g,decorativeArrow));
}
