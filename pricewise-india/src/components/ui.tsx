import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Baby, BookOpen, Armchair, Dumbbell, Heart, MapPin, Package, Plug, Search, Shirt, ShoppingBasket, Smartphone, Sparkles, Loader2, type LucideIcon } from 'lucide-react';
import type { CategoryId, Product } from '../types';
import type { Summary } from '../utils/search';
import { hash, inr, validPincode } from '../utils/hash';
import { useApp } from '../context/AppContext';
export const ICONS:Record<CategoryId,LucideIcon>={groceries:ShoppingBasket,electronics:Smartphone,fashion:Shirt,beauty:Sparkles,appliances:Plug,furniture:Armchair,baby:Baby,sports:Dumbbell,books:BookOpen,other:Package};
export function ProductImage({p,size=36,className=''}:{p:Product;size?:number;className?:string}){
  const I=ICONS[p.category],hue=hash(p.brand)%360;
  return <div role="img" aria-label={`Placeholder image for ${p.title}`} className={`flex items-center justify-center rounded-xl ${className}`} style={{background:`linear-gradient(135deg,hsl(${hue} 70% 94%),hsl(${hue} 60% 84%))`,color:`hsl(${hue} 50% 30%)`}}><I size={size} aria-hidden/></div>;
}
export function StateMsg({kind,onRetry,children}:{kind:'loading'|'error'|'empty';onRetry?:()=>void;children?:React.ReactNode}){
  return <div className="card p-10 text-center" role={kind==='error'?'alert':'status'}>
    {kind==='loading'&&<Loader2 className="mx-auto mb-2 animate-spin text-brand-600"/>}{kind==='error'&&<AlertTriangle className="mx-auto mb-2 text-red-600"/>}
    <p className="text-slate-600">{children??(kind==='loading'?'Loading sample prices…':kind==='error'?'Could not load price data.':'Nothing here yet.')}</p>
    {onRetry&&<button className="btn-primary mt-4" onClick={onRetry}>Try again</button>}</div>;
}
export function SaveButton({id}:{id:string}){
  const {saved,toggleSaved}=useApp();const on=saved.includes(id);
  return <button onClick={()=>toggleSaved(id)} aria-pressed={on} aria-label={on?'Remove from saved':'Save product'} className="rounded-full p-2 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-600"><Heart size={18} className={on?'fill-red-500 text-red-500':'text-slate-400'}/></button>;
}
export function SearchBar({initial=''}:{initial?:string}){
  const [q,setQ]=useState(initial);const nav=useNavigate();
  const go=(e:FormEvent)=>{e.preventDefault();nav(`/search?q=${encodeURIComponent(q.trim())}`);};
  return <form onSubmit={go} role="search" className="flex flex-1 gap-2"><label className="sr-only" htmlFor="q">Search products</label>
    <div className="relative flex-1"><Search size={16} className="absolute left-3 top-3 text-slate-400" aria-hidden/><input id="q" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search product, brand or model" className="input w-full pl-9"/></div>
    <button className="btn-primary">Search</button></form>;
}
export function PincodeBox(){
  const {pincode,setPincode}=useApp();const [v,setV]=useState(pincode);const [err,setErr]=useState('');
  const save=(e:FormEvent)=>{e.preventDefault();if(validPincode(v)){setPincode(v);setErr('');}else setErr('Enter a valid 6-digit pincode');};
  return <form onSubmit={save} className="flex flex-wrap items-center gap-2 text-sm"><MapPin size={16} className="text-save-600" aria-hidden/>
    <label htmlFor="pin" className="sr-only">Delivery pincode</label><input id="pin" inputMode="numeric" maxLength={6} value={v} onChange={e=>setV(e.target.value.replace(/\D/g,''))} placeholder="Pincode" className="input w-28 py-1"/>
    <button className="btn-ghost py-1">Save</button>
    <span className={err?'text-red-600':'text-slate-500'} role="status">{err||(pincode?`${pincode} saved · pricing by location is simulated (no serviceability check)`:'Location pricing is simulated in this demo')}</span></form>;
}
export function ProductCard({s}:{s:Summary}){
  const {addToBasket}=useApp();const p=s.product;
  return <article className="card flex flex-col gap-3 p-4"><div className="flex items-start justify-between"><ProductImage p={p} className="h-20 w-20"/><SaveButton id={p.id}/></div>
    <div><p className="text-xs font-medium uppercase text-slate-500">{p.brand}</p><h3 className="font-semibold leading-snug"><Link className="hover:underline" to={`/product/${p.id}`}>{p.title}</Link></h3><p className="text-sm text-slate-500">{p.variant} · {p.packSize}</p></div>
    <div className="mt-auto"><p className="text-xs text-slate-500">{s.lowestTotal!==null?'Lowest est. payable':'Lowest listed (fees unknown)'}</p>
      <p className="text-xl font-bold text-brand-900">{s.lowestTotal!==null||s.lowestListed!==null?inr((s.lowestTotal??s.lowestListed)!):'Unavailable'}</p>
      <p className="text-xs text-slate-500">{s.priced.length} retailer{s.priced.length===1?'':'s'}{s.maxDiscount>0&&<span className="ml-2 font-semibold text-save-700">up to {s.maxDiscount}% off MRP</span>}</p></div>
    <div className="flex gap-2"><Link to={`/product/${p.id}`} className="btn-primary flex-1">Compare</Link>{p.isGrocery&&<button className="btn-ghost" onClick={()=>addToBasket(p.id)}>+ Basket</button>}</div></article>;
}
