export function px2num(px:string): number{
  const temWidth = px.replace('px', '') as string;
  const w:number = parseInt(temWidth, 10) as number;
  return w;
}