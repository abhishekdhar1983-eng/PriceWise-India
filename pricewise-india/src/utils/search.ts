import type { Catalog, Product, PricedOffer } from '../types';
import { priceOffer } from './pricing';
export interface Summary{product:Product;priced:PricedOffer[];lowestTotal:number|null;lowestListed:number|null;maxDiscount:number}
export interface Filters{q?:string;category?:string;retailers?:string[];brand?:string;min?:number;max?:number}
export type SortKey='total'|'listed'|'discount'|'alpha';
const norm=(s:string)=>s.toLowerCase().replace(/[^a-z0-9 ]/g,' ');
export const matchesQuery=(p:Product,q:string)=>{const hay=norm(`${p.title} ${p.brand} ${p.variant} ${p.packSize}`);return norm(q).split(' ').filter(Boolean).every(t=>hay.includes(t));};
export function summarize(p:Product,cat:Catalog):Summary{
  const priced=cat.offers.filter(o=>o.productId===p.id).map(priceOffer);
  const live=priced.filter(x=>x.offer.inStock);const known=live.filter(x=>!x.feesUnknown);
  return{product:p,priced,lowestTotal:known.length?Math.min(...known.map(x=>x.estimatedTotal)):null,
    lowestListed:live.length?Math.min(...live.map(x=>x.offer.price)):null,maxDiscount:Math.max(0,...priced.map(x=>x.discountPct))};
}
export function filterCatalog(cat:Catalog,f:Filters):Summary[]{
  return cat.products.filter(p=>(!f.q||matchesQuery(p,f.q))&&(!f.category||p.category===f.category)&&(!f.brand||p.brand===f.brand))
    .map(p=>summarize(p,cat))
    .filter(s=>!f.retailers?.length||s.priced.some(x=>f.retailers!.includes(x.offer.retailerId)))
    .filter(s=>{const v=s.lowestTotal??s.lowestListed;if(v===null)return f.min===undefined&&f.max===undefined;return(f.min===undefined||v>=f.min)&&(f.max===undefined||v<=f.max);});
}
export function sortSummaries(l:Summary[],k:SortKey):Summary[]{
  const big=Number.MAX_SAFE_INTEGER;
  const c={total:(a:Summary,b:Summary)=>(a.lowestTotal??big)-(b.lowestTotal??big),listed:(a:Summary,b:Summary)=>(a.lowestListed??big)-(b.lowestListed??big),
    discount:(a:Summary,b:Summary)=>b.maxDiscount-a.maxDiscount,alpha:(a:Summary,b:Summary)=>a.product.title.localeCompare(b.product.title)}[k];
  return [...l].sort(c);
}
