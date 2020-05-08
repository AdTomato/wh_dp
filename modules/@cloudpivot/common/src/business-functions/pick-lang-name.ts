export function getLangName(block: any, nameKey?: string) {
  let str: string = '';
  const name: string = nameKey ? block[nameKey] : block.name;
  const lang: string = localStorage.getItem('locale') || 'zh';
  if (lang === 'zh') {
    str = name;
  } else {
    try {
      const names: any = JSON.parse(block.name_i18n);
      str = names[lang];
    } catch {
      str = name;
    }
  }
  return str;
}