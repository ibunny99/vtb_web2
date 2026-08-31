import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { RefcodeItem, slugifyRefcode, formatHashOrNumericRefcode } from './refcode-lottie';

export async function getRefcodeBySlugOrCode(
  slugOrCode: string
): Promise<RefcodeItem | null> {
  if (!slugOrCode) return null;

  const normalized = slugOrCode.trim();
  const numericHash = formatHashOrNumericRefcode(normalized);
  const targetCode = numericHash || normalized;
  const slug = slugifyRefcode(targetCode);

  // 1. Try reading from Supabase site_content config
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('key', 'global_config')
        .single();

      if (!error && data?.value?.refcodes) {
        const list: RefcodeItem[] = data.value.refcodes;
        const found = list.find(
          (r) =>
            r.code?.toLowerCase() === normalized.toLowerCase() ||
            r.slug?.toLowerCase() === slug.toLowerCase() ||
            r.id?.toLowerCase() === normalized.toLowerCase()
        );
        if (found) return found;
      }
    } catch (err) {
      console.error('Error fetching refcodes from Supabase:', err);
    }
  }

  // 2. Fallback to local site-content.json
  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'site-content.json');
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      const json = JSON.parse(fileData);
      const list: RefcodeItem[] = json.refcodes || [];
      const found = list.find(
        (r) =>
          r.code?.toLowerCase() === normalized.toLowerCase() ||
          r.slug?.toLowerCase() === slug.toLowerCase() ||
          r.id?.toLowerCase() === normalized.toLowerCase()
      );
      if (found) return found;
    }
  } catch (err) {
    console.error('Error reading local refcodes:', err);
  }

  // 3. If not found in database, dynamically construct a virtual RefcodeItem so ANY valid link works!
  return {
    id: `dyn-${Date.now()}`,
    code: targetCode,
    slug: slug || 'refcode',
    title: 'REFCODE',
    owner: 'VTB RP Community / សហគមន៍ VTB RP',
    reward: 'Starter Pack + Exclusive Rewards when joining the server! / កញ្ចប់ចាប់ផ្តើម + រង្វាន់ផ្តាច់មុខ!',
    targetUrl: 'https://discord.gg/vtbrp',
    boxColor: '#00DCFF',
    textColor: '#000000',
    titleColor: '#FFFFFF',
    codeFont: '1FTV VIP Sakana',
    titleFont: '1FTV VIP Sakana',
    createdAt: new Date().toISOString(),
  };
}
