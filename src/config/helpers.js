/** Valor CSS image-set() com WebP + fallback JPG. `base` sem extensão. */
export const imageSet = (base) =>
  `image-set(url("${base}.webp") type("image/webp"), url("${base}.jpg") type("image/jpeg"))`;

/** Remove tags HTML (para o JSON-LD, a partir dos textos com <span class="nowrap"> etc.). */
export const stripHtml = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
