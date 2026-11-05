import { Link, useParams } from 'react-router-dom';
import { ProductImage, SaveButton, StateMsg } from '../components/ui';
import { lowestComparable, priceOffer } from '../utils/pricing';
import { inr } from '../utils/hash';
import { useApp } from '../context/AppContext';
export default function ProductPage(){
  const {id}=useParams();const {catalog,status,reload,addToBasket}=useApp();
  if(status==='loading')return <StateMsg kind="loading"/>;
  if(status==='error'||!catalog)return <StateMsg kind="error" onRetry={reload}/>;
  const p=catalog.products.find(x=>x.id===id);
  if(!p)return <StateMsg kind="empty">Product not found. <Link className="underline" to="/search">Back to search</Link></StateMsg>;
  const priced=catalog.offers.filter(o=>o.productId===p.id).map(priceOffer).sort((a,b)=>a.estimatedTotal-b.estimatedTotal);
  const best=lowestComparable(priced);const name=(rid:string)=>catalog.retailers.find(r=>r.id===rid)?.name??rid;
  const fee=(v:number|null)=>v===null?<span className="text-amber-700">Unknown</span>:v===0?'Free':inr(v);
  return <div className="space-y-5"><div className="card flex flex-wrap items-center gap-4 p-5"><ProductImage p={p} size={44} className="h-24 w-24"/>
    <div className="flex-1"><p className="text-xs uppercase text-slate-500">{p.brand}</p><h1 className="text-2xl font-bold">{p.title}</h1><p className="text-slate-500">Variant: {p.variant} · Pack: {p.packSize}</p></div>
    <div className="flex items-center gap-2"><SaveButton id={p.id}/>{p.isGrocery&&<button className="btn-primary" onClick={()=>addToBasket(p.id)}>Add to basket</button>}</div></div>
    <div className="card overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><caption className="p-4 text-left text-xs text-slate-500">Estimated payable = listed price + delivery + handling − eligible discounts (none applied: no eligibility data). Sample prices; not live.</caption>
      <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Retailer','Listed','MRP','Discount','Delivery','Handling','Est. payable','Stock','ETA','Sample timestamp'].map(h=><th key={h} scope="col" className="px-3 py-2">{h}</th>)}</tr></thead>
      <tbody className="divide-y">{priced.map(x=>{const o=x.offer,isBest=best?.offer.retailerId===o.retailerId;return <tr key={o.retailerId} className={isBest?'bg-save-50':''}>
        <th scope="row" className="px-3 py-3 font-semibold">{name(o.retailerId)}{isBest&&<span className="ml-2 rounded-full bg-save-600 px-2 py-0.5 text-xs text-white">Lowest total</span>}</th>
        <td className="px-3">{inr(o.price)}</td><td className="px-3 text-slate-500">{x.discountAmount?<s>{inr(o.mrp)}</s>:'—'}</td><td className="px-3 font-semibold text-save-700">{x.discountPct?`${x.discountPct}% (${inr(x.discountAmount)})`:'—'}</td>
        <td className="px-3">{fee(o.deliveryFee)}</td><td className="px-3">{fee(o.handlingFee)}</td>
        <td className="px-3 font-bold">{inr(x.estimatedTotal)}{x.feesUnknown&&<span className="block text-xs font-normal text-amber-700">+ unknown fees</span>}</td>
        <td className="px-3">{o.inStock?<span className="text-save-700">In stock</span>:<span className="text-red-600">Out of stock</span>}</td><td className="px-3">{o.eta}</td>
        <td className="px-3 text-xs text-slate-500">{new Date(o.observedAt).toLocaleDateString('en-IN')}</td></tr>;})}</tbody></table></div>
    {!best&&<p role="status" className="text-sm text-amber-800">A “lowest total” is not shown: fewer than two in-stock offers have fully known fees, so totals are not comparable.</p>}</div>;
}
