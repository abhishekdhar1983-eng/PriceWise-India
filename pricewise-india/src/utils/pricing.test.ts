import { describe, expect, it } from 'vitest';
import type { Catalog, Offer, Product, Retailer } from '../types';
import { cheapestComplete, compareBaskets, discountAmount, discountPct, isSameProduct, lowestComparable, priceOffer } from './pricing';
import { filterCatalog } from './search';
const P=(id:string,brand:string,title:string,variant:string,packSize:string):Product=>({id,brand,title,category:'groceries',variant,packSize,isGrocery:true});
const O=(productId:string,retailerId:string,price:number,o:Partial<Offer>={}):Offer=>({productId,retailerId,price,mrp:price,deliveryFee:0,handlingFee:0,eligibleDiscount:0,inStock:true,eta:'',observedAt:'',...o});
const RT=(id:string,d:number|null,free:number|null,h:number|null):Retailer=>({id,name:id,deliveryFee:d,freeDeliveryAbove:free,handlingFee:h,eta:''});
const milk=P('m','Amul','Milk','Toned','500 ml'),atta=P('a','Aashirvaad','Atta','Whole','5 kg');
describe('price calculation',()=>{
  it('adds fees, subtracts eligible discounts only',()=>expect(priceOffer(O('m','x',100,{deliveryFee:40,handlingFee:5,eligibleDiscount:10})).estimatedTotal).toBe(135));
  it('flags unknown fees',()=>expect(priceOffer(O('m','x',100,{deliveryFee:null})).feesUnknown).toBe(true));
  it('does not flag lowest when totals are not comparable',()=>expect(lowestComparable([priceOffer(O('m','a',90,{deliveryFee:null})),priceOffer(O('m','b',100))])).toBeNull());
  it('flags lowest among comparable',()=>expect(lowestComparable([priceOffer(O('m','a',90)),priceOffer(O('m','b',100)),priceOffer(O('m','c',95))])?.offer.retailerId).toBe('a'));
});
describe('discounts',()=>{it('computes %',()=>{expect(discountPct(80,100)).toBe(20);expect(discountAmount(80,100)).toBe(20);});it('no negative discount',()=>expect(discountPct(120,100)).toBe(0));});
describe('search filtering',()=>{
  const cat:Catalog={products:[milk,atta],offers:[O('m','blinkit',30),O('a','zepto',300)],retailers:[]};
  it('by query',()=>expect(filterCatalog(cat,{q:'amul'}).map(s=>s.product.id)).toEqual(['m']));
  it('by retailer',()=>expect(filterCatalog(cat,{retailers:['zepto']}).map(s=>s.product.id)).toEqual(['a']));
  it('by price range',()=>expect(filterCatalog(cat,{min:100}).map(s=>s.product.id)).toEqual(['a']));
});
describe('variant matching',()=>{
  it('different pack size is not the same product',()=>expect(isSameProduct(milk,P('m2','Amul','Milk','Toned','1 L'))).toBe(false));
  it('different variant is not the same product',()=>expect(isSameProduct(P('1','Samsung','M35','8GB+128GB','1'),P('2','Samsung','M35','8GB+256GB','1'))).toBe(false));
  it('identical attributes match',()=>expect(isSameProduct(milk,P('x','amul','MILK','toned','500ml'))).toBe(true));
});
describe('basket totals',()=>{
  const lines=[{product:milk,qty:2},{product:atta,qty:1}];
  const offers=[O('m','r1',30),O('a','r1',300),O('m','r2',28)];
  const rs=[RT('r1',40,500,5),RT('r2',20,null,0)];
  it('charges delivery once per basket',()=>{const q=compareBaskets(lines,offers,rs).find(x=>x.retailer.id==='r1')!;expect(q.subtotal).toBe(360);expect(q.deliveryFee).toBe(40);expect(q.total).toBe(405);});
  it('reports missing items and excludes them from cheapest',()=>{const qs=compareBaskets(lines,offers,rs);const r2=qs.find(x=>x.retailer.id==='r2')!;expect(r2.complete).toBe(false);expect(r2.missing[0].id).toBe('a');expect(cheapestComplete(qs)?.retailer.id).toBe('r1');});
});
