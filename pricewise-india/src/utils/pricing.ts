import type { Offer, PricedOffer, Product, Retailer, BasketLine, BasketQuote } from '../types';
export const discountAmount=(price:number,mrp:number)=>mrp>price?mrp-price:0;
export const discountPct=(price:number,mrp:number)=>mrp>price?Math.round(((mrp-price)/mrp)*100):0;
/** Estimated payable = price + delivery + handling - ELIGIBLE discounts (conditional offers are never applied). */
export function priceOffer(o:Offer):PricedOffer{
  const feesUnknown=o.deliveryFee===null||o.handlingFee===null;
  return{offer:o,discountAmount:discountAmount(o.price,o.mrp),discountPct:discountPct(o.price,o.mrp),feesUnknown,
    estimatedTotal:o.price+(o.deliveryFee??0)+(o.handlingFee??0)-o.eligibleDiscount};
}
/** Lowest offer is flagged only among in-stock offers with fully known fees, and only if 2+ are comparable. */
export function lowestComparable(list:PricedOffer[]):PricedOffer|null{
  const c=list.filter(x=>x.offer.inStock&&!x.feesUnknown);
  return c.length<2?null:c.reduce((a,b)=>(b.estimatedTotal<a.estimatedTotal?b:a));
}
/** Product matching: brand, title, variant and pack size must all agree. */
const n=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
export const isSameProduct=(a:Product,b:Product)=>n(a.brand)===n(b.brand)&&n(a.title)===n(b.title)&&n(a.variant)===n(b.variant)&&n(a.packSize)===n(b.packSize);
const fee=(f:number|null,sub:number,free:number|null)=>f===null?null:free!==null&&sub>=free?0:f;
/** Basket: delivery/handling are charged ONCE per retailer basket, not per item. */
export function compareBaskets(lines:BasketLine[],offers:Offer[],retailers:Retailer[]):BasketQuote[]{
  const out:BasketQuote[]=[];
  for(const retailer of retailers){
    let subtotal=0,any=false;const missing:Product[]=[];
    for(const l of lines){
      const o=offers.find(x=>x.productId===l.product.id&&x.retailerId===retailer.id);
      if(!o||!o.inStock)missing.push(l.product);else{any=true;subtotal+=(o.price-o.eligibleDiscount)*l.qty;}
    }
    if(!any)continue;
    const deliveryFee=fee(retailer.deliveryFee,subtotal,retailer.freeDeliveryAbove),handlingFee=retailer.handlingFee;
    out.push({retailer,subtotal,deliveryFee,handlingFee,total:subtotal+(deliveryFee??0)+(handlingFee??0),
      feesUnknown:deliveryFee===null||handlingFee===null,missing,complete:missing.length===0});
  }
  return out;
}
export const cheapestComplete=(qs:BasketQuote[])=>{const c=qs.filter(q=>q.complete&&!q.feesUnknown);return c.length?c.reduce((a,b)=>b.total<a.total?b:a):null;};
