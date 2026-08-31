/**
 * Horizon Roleplay - Lottie Refcode Dynamic Engine
 * Handles automatic text replacement and mathematical box stretching with Bezier curve preservation.
 */

export interface RefcodeCustomOptions {
  code: string;
  title?: string;
  boxColor?: string; // hex (e.g. #00DCFF)
  textColor?: string; // hex (e.g. #000000)
  titleColor?: string; // hex (e.g. #FFFFFF)
  codeFont?: string; // e.g. '1FTV VIP Sakana', 'Chakra Petch', 'Montserrat'
  titleFont?: string; // e.g. '1FTV VIP Sakana', 'Chakra Petch', 'Montserrat'
}

export interface RefcodeItem {
  id: string;
  code: string;
  slug: string;
  title?: string;
  owner?: string;
  reward?: string;
  targetUrl?: string;
  boxColor?: string;
  textColor?: string;
  titleColor?: string;
  codeFont?: string;
  titleFont?: string;
  createdAt?: string;
  clicks?: number;
}

export const AVAILABLE_FONTS = [
  { id: '1FTV VIP Sakana', name: '1FTV VIP Sakana (Font Chuẩn Horizon)', path: '/fonts/1FTV-VIP-Sakana.otf' },
  { id: 'Chakra Petch', name: 'Chakra Petch (Cyberpunk Gaming)', path: '' },
  { id: 'Montserrat', name: 'Montserrat (Hiện Đại Đậm Nét)', path: '' },
  { id: 'Readex Pro', name: 'Readex Pro (Bo Tròn Trẻ Trung)', path: '' },
  { id: 'Inter', name: 'Inter (Clean / Tối Giản)', path: '' },
];

export function resolveFontMeta(fontName?: string) {
  const clean = (fontName || '1FTV VIP Sakana').trim();
  if (clean.toLowerCase().includes('sakana') || clean.toLowerCase().includes('1ftv')) {
    return {
      fName: '1FTVVIPSakana-Regular',
      fFamily: '1FTVVIPSakana-Regular',
      origin: 0,
      fPath: '',
    };
  }
  return {
    fName: clean,
    fFamily: clean,
    origin: 0,
    fPath: '',
  };
}

/**
 * Convert hex color (#RRGGBB or #RGB) to normalized Lottie RGB array [0..1, 0..1, 0..1]
 */
export function hexToLottieColor(hex: string): [number, number, number] {
  let clean = (hex || '').replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) {
    return [0, 0.8627, 1]; // Default Horizon Cyan
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [Number(r.toFixed(4)), Number(g.toFixed(4)), Number(b.toFixed(4))];
}

/**
 * Calculate visual text width accurately using Canvas in browser or character heuristics
 */
export function measureRefcodeTextWidth(
  text: string,
  fontSize: number,
  fontFamily = '1FTV VIP Sakana'
): number {
  const trackingExtra = Math.max(0, text.length - 1) * fontSize * 0.035;

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = `600 ${fontSize}px "${fontFamily}", "1FTVVIPSakana-Regular", "1FTV VIP Sakana", "Chakra Petch", sans-serif`;
        const metrics = ctx.measureText(text);
        if (metrics && metrics.width > 0) {
          return metrics.width + trackingExtra;
        }
      }
    } catch {
      // Fall back to heuristic calculation
    }
  }

  // Heuristic based on proportional character distribution in bold display fonts
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/[ijlI1\.,\':;!| \-]/.test(ch)) width += fontSize * 0.35;
    else if (/[wmWM@#%&]/.test(ch)) width += fontSize * 0.82;
    else if (/[A-Z0-9]/.test(ch)) width += fontSize * 0.62;
    else if (/[a-z]/.test(ch)) width += fontSize * 0.52;
    else width += fontSize * 0.45;
  }
  return (width > 0 ? width : fontSize * 3) + trackingExtra;
}

/**
 * Calculate responsive box geometry and adapted font size
 */
export function calculateRefcodeGeometry(
  text: string,
  baseFontSize = 120,
  fontFamily = '1FTV VIP Sakana'
) {
  const safeText = (text || 'Ibunny').trim();
  let fontSize = baseFontSize;
  const maxVisualBoxWidth = 880; // Maximum visual width on 1024x1024 canvas
  const paddingVisual = 160; // 80px visual padding on each side

  let measuredWidth = measureRefcodeTextWidth(safeText, fontSize, fontFamily);
  let visualWidth = measuredWidth + paddingVisual;

  // If text is very long, automatically scale down font size so it never overflows
  if (visualWidth > maxVisualBoxWidth) {
    const scaleFactor = (maxVisualBoxWidth - paddingVisual) / measuredWidth;
    fontSize = Math.max(48, Math.floor(baseFontSize * scaleFactor));
    measuredWidth = measureRefcodeTextWidth(safeText, fontSize, fontFamily);
    visualWidth = Math.min(maxVisualBoxWidth, measuredWidth + paddingVisual);
  }

  // Ensure a pleasant minimum visual width
  visualWidth = Math.max(300, visualWidth);

  // Precomp layer scale is 72.358% (0.72358)
  const precompScale = 0.72358;
  const boxCoordWidth = visualWidth / precompScale;
  const W = Number((boxCoordWidth / 2).toFixed(3));
  const R = Math.min(50, Number((W * 0.35).toFixed(3)));
  const W_flat = Number(Math.max(0, W - R).toFixed(3));
  const kappa = Number((R * 0.5522847498).toFixed(3));

  return {
    fontSize,
    W,
    R,
    W_flat,
    kappa,
    visualWidth: Number(visualWidth.toFixed(2)),
  };
}

/**
 * Deeply mutates a clone of `refcode-vtb.json` with dynamic text, fonts, colors and auto-stretching box
 */
export function customizeRefcodeLottie(baseJson: any, options: RefcodeCustomOptions) {
  if (!baseJson) return baseJson;
  const data = JSON.parse(JSON.stringify(baseJson));
  const text = (options.code || 'Ibunny').trim();
  const title = (options.title || 'REFCODE').trim();
  const codeFont = (options.codeFont || '1FTV VIP Sakana').trim();
  const titleFont = (options.titleFont || '1FTV VIP Sakana').trim();

  const geom = calculateRefcodeGeometry(text, 120, codeFont);

  const codeFontMeta = resolveFontMeta(codeFont);
  const titleFontMeta = resolveFontMeta(titleFont);

  // Build fonts.list: deduplicate by fName, set Code font to 700 (Semi-Bold/Bold)
  const fontEntries: any[] = [];
  const seenNames = new Set<string>();

  const addFont = (meta: { fName: string; fFamily: string }, isCode = false) => {
    if (!seenNames.has(meta.fName)) {
      seenNames.add(meta.fName);
      fontEntries.push({
        ascent: 70,
        fClass: '',
        fFamily: meta.fFamily,
        fStyle: isCode ? 'Bold' : 'Regular',
        fName: meta.fName,
        fPath: '',
        fWeight: isCode ? '700' : 'normal',
        origin: 0,
      });
    }
  };

  // Always include Sakana first (it's the base font in the original JSON)
  addFont({ fName: '1FTVVIPSakana-Regular', fFamily: '1FTVVIPSakana-Regular' }, true);
  addFont(codeFontMeta, true);
  addFont(titleFontMeta, false);

  data.fonts = { list: fontEntries };

  // 1. Modify "box-code-text" text layer (Layer 3)
  const codeTextLayer = data.layers?.find(
    (l: any) => l.nm === 'box-code-text' || (l.ty === 5 && l.ind === 3)
  );
  if (codeTextLayer && codeTextLayer.t?.d?.k?.[0]?.s) {
    codeTextLayer.t.d.k[0].s.t = text;
    codeTextLayer.t.d.k[0].s.s = geom.fontSize;
    codeTextLayer.t.d.k[0].s.lh = Number((geom.fontSize * 1.2).toFixed(1));
    codeTextLayer.t.d.k[0].s.f = codeFontMeta.fName;

    // Tracking (letter-spacing: 35/1000 em) to ensure characters have ample breathing room and never overlap
    codeTextLayer.t.d.k[0].s.tr = 35;

    // Set color on document level
    const codeColor = options.textColor && options.textColor.trim() !== '' ? options.textColor : '#000000';
    const cColorLottie = hexToLottieColor(codeColor);
    codeTextLayer.t.d.k[0].s.fc = cColorLottie;

    // Remove heavy strokes to maintain clean 600-700 weight without glyph collision
    delete (codeTextLayer.t.d.k[0].s as any).sc;
    delete (codeTextLayer.t.d.k[0].s as any).sw;
    delete (codeTextLayer.t.d.k[0].s as any).of;

    // IMPORTANT: Remove text animators so document-level s.fc takes full effect.
    // Text animators with selector.amount=100 override s.fc regardless of the value we set.
    codeTextLayer.t.a = [];
  }

  // 2. Modify "REFCODE- title" text layer (Layer 1)
  const titleLayer = data.layers?.find(
    (l: any) => l.nm === 'REFCODE- title' || (l.ty === 5 && l.ind === 1)
  );
  if (titleLayer && titleLayer.t?.d?.k?.[0]?.s) {
    if (title) {
      titleLayer.t.d.k[0].s.t = title;
    }
    titleLayer.t.d.k[0].s.f = titleFontMeta.fName;

    // Set color on document level
    const titleColor = options.titleColor && options.titleColor.trim() !== '' ? options.titleColor : '#FFFFFF';
    const tColorLottie = hexToLottieColor(titleColor);
    titleLayer.t.d.k[0].s.fc = tColorLottie;
    // IMPORTANT: Remove text animators so document-level s.fc takes full effect.
    titleLayer.t.a = [];
  }

  // 3. Modify "box-text" inside precomp "a02" (Asset ID: 5_79686799-ebc4-407a-b2dd-c20d4f85217b)
  const a02 = data.assets?.find(
    (a: any) => a.id === '5_79686799-ebc4-407a-b2dd-c20d4f85217b' || (a.layers && a.nm === 'a02')
  );
  const boxTextLayer = a02?.layers?.find((l: any) => l.nm === 'box-text');

  if (boxTextLayer?.shapes?.[0]?.it) {
    // Find shape path
    const pathItem = boxTextLayer.shapes[0].it.find((it: any) => it.ty === 'sh');
    if (pathItem?.ks?.k) {
      const keyframes = pathItem.ks.k;
      const { W, W_flat, kappa } = geom;

      // Keyframe 0 (t: 40.04) - Pop-in initial small rectangle
      if (keyframes[0]?.s?.[0]) {
        const W_init = Math.min(56.133, Number((W * 0.15).toFixed(3)));
        const W_init_flat = Math.max(0, Number((W_init - 25).toFixed(3)));
        keyframes[0].s[0].v = [
          [W_init, -52.079],
          [W_init, 53.178],
          [W_init_flat, 103.178],
          [-W_init_flat, 102.954],
          [-W_init, 52.954],
          [-W_init, -52.304],
          [-W_init_flat, -102.304],
          [W_init_flat, -102.079],
        ];
      }

      // Keyframe 1 (t: 52.853) - Fully expanded state with dynamic width
      if (keyframes[1]?.s?.[0]) {
        keyframes[1].s[0].v = [
          [W, -52.629],
          [W, 52.629],
          [W_flat, 102.629],
          [-W_flat, 102.629],
          [-W, 52.629],
          [-W, -52.629],
          [-W_flat, -102.629],
          [W_flat, -102.629],
        ];
        keyframes[1].s[0].i = [
          [0, -kappa],
          [0, 0],
          [kappa, 0],
          [0, 0],
          [0, kappa],
          [0, 0],
          [-kappa, 0],
          [0, 0],
        ];
        keyframes[1].s[0].o = [
          [0, 0],
          [0, kappa],
          [0, 0],
          [-kappa, 0],
          [0, 0],
          [0, -kappa],
          [0, 0],
          [kappa, 0],
        ];
      }
    }

    // Modify Fill Color of the Box
    const boxColor = options.boxColor || '#00DCFF';
    const fillItem = boxTextLayer.shapes[0].it.find((it: any) => it.ty === 'fl');
    if (fillItem?.c) {
      fillItem.c.k = hexToLottieColor(boxColor);
    }
  }

  return data;
}

export function slugifyRefcode(code: string): string {
  return (code || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Automatically detects and formats numeric hash or refcode strings.
 * Supports: id#12345678, id-12345678, id12345678, #12345678, 12345678.
 * Limits numeric part to a maximum of 8 digits as requested.
 */
export function formatHashOrNumericRefcode(raw?: string): string | null {
  if (!raw) return null;
  const decoded = decodeURIComponent(raw).trim();

  // Match id#12345678, id-12345678, id12345678, #id12345678, ID#12345678
  const idMatch = decoded.match(/^(?:#)?id[-#_]?(\d{1,8})$/i);
  if (idMatch) {
    return `#${idMatch[1]}`;
  }

  // Match #12345678
  if (decoded.startsWith('#')) {
    const rawDigits = decoded.slice(1);
    const digits = rawDigits.replace(/\D/g, '').slice(0, 8);
    if (digits.length > 0) {
      return `#${digits}`;
    }
  }

  // Match pure numbers up to 8 digits (e.g. 12345678)
  if (/^\d{1,8}$/.test(decoded)) {
    return `#${decoded}`;
  }

  return null;
}
