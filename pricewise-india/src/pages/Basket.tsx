import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ProductImage, StateMsg } from '../components/ui';
import { cheapestComplete, compareBaskets } from '../utils/pricing';
import { inr } from '../utils/hash';
import { useApp } from '../context/AppContext';
export default function Basket(){
  const {catalog,status,reload,basket,setQty,removeFromBasket,clearBasket}=useApp();
  const lines=useMemo(()=>basket.flatMap(b=>{const product=catalog?.products.find(p=>p.id===b.productId);return product?[{product,qty:b.qty}]:[];}),[basket,catalog]);
  const quotes=useMemo(()=>catalog?compareBaskets(lines,catalog.offers,catalog.retailers).sort((a,b)=>+b.complete-+a.complete||a.total-b.total):[],[lines,catalog]);
  if(status==='loading')return <StateMsg kind="loading"/>;
  if(status==='error'||!catalog)return <StateMsg kind="error" onRetry={reload}/>;
  if(!lines.length)return <StateMsg kind="empty">Your basket is empty. <Link className="underline" to="/search?category=groceries">Browse groceries</Link></StateMsg>;
  const best=cheapestComplete(quotes);const f=(v:number|null)=>v===null?'Unknown':v===0?'Free':inr(v);
  return <div className="space-y-6"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Grocery basket</h1><button className="btn-ghost" onClick={clearBasket}>Clear basket</button></div>
    <ul className="card divide-y">{lines.map(({product:p,qty})=><li key={p.id} className="flex items-center gap-3 p-3"><ProductImage p={p} size={22} className="h-12 w-12"/>
      <div className="flex-1"><Link to={`/product/${p.id}`} className="font-semibold hover:underline">{p.title}</Link><p className="text-xs text-slate-500">{p.packSize}</p></div>
      <div className="flex items-center gap-1"><button aria-label={`Decrease ${p.title}`} className="btn-ghost p-1.5" onClick={()=>setQty(p.id,qty-1)}><Minus size={14}/></button><span aria-live="polite" className="w-8 text-center font-semibold">{qty}</span><button aria-label={`Increase ${p.title}`} className="btn-ghost p-1.5" onClick={()=>setQty(p.id,qty+1)}><Plus size={14}/></button></div>
      <button aria-label={`Remove ${p.title}`} className="p-2 text-slate-400 hover:text-red-600" onClick={()=>removeFromBasket(p.id)}><Trash2 size={16}/></button></li>)}</ul>
    <div><h2 className="mb-1 text-lg font-bold">Basket totals by retailer</h2><p className="mb-3 text-xs text-slate-500">Delivery and handling fees are charged once per basket. Demo prices only — not live retailer data.</p>
      {!best&&<p role="status" className="mb-3 text-sm text-amber-800">No retailer has every item in stock with known fees, so no basket is marked cheapest.</p>}
      <div className="grid gap-4 md:grid-cols-2">{quotes.map(q=><div key={q.retailer.id} className={`card p-4 ${best?.retailer.id===q.retailer.id?'ring-2 ring-save-600':''}`}>
        <div className="flex items-center justify-between"><h3 className="font-bold">{q.retailer.name}</h3>{best?.retailer.id===q.retailer.id&&<span className="rounded-full bg-save-600 px-2 py-0.5 text-xs text-white">Cheapest complete basket</span>}{!q.complete&&<span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">Incomplete</span>}</div>
        <dl className="mt-2 grid grid-cols-2 gap-y-1 text-sm"><dt>Subtotal</dt><dd className="text-right">{inr(q.subtotal)}</dd><dt>Delivery</dt><dd className="text-right">{f(q.deliveryFee)}</dd><dt>Handling</dt><dd className="text-right">{f(q.handlingFee)}</dd><dt className="font-bold">Total{q.feesUnknown&&' (excl. unknown fees)'}</dt><dd className="text-right font-bold">{inr(q.total)}</dd></dl>
        {q.missing.length>0&&<p className="mt-2 text-xs text-red-700">Unavailable: {q.missing.map(m=>m.title+' '+m.packSize).join(', ')}</p>}</div>)}</div></div></div>;
}
