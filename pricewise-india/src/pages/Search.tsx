import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { ProductCard, StateMsg } from '../components/ui';
import { filterCatalog, sortSummaries, type SortKey } from '../utils/search';
import { useApp } from '../context/AppContext';
export default function SearchPage(){
  const {catalog,status,reload}=useApp();const [sp,setSp]=useSearchParams();
  const q=sp.get('q')??'',category=sp.get('category')??'';
  const [retailers,setRetailers]=useState<string[]>([]);const [brand,setBrand]=useState('');const [min,setMin]=useState('');const [max,setMax]=useState('');const [sort,setSort]=useState<SortKey>('total');
  const brands=useMemo(()=>[...new Set((catalog?.products??[]).filter(p=>!category||p.category===category).map(p=>p.brand))].sort(),[catalog,category]);
  const results=useMemo(()=>catalog?sortSummaries(filterCatalog(catalog,{q,category:category||undefined,retailers,brand:brand||undefined,min:min?+min:undefined,max:max?+max:undefined}),sort):[],[catalog,q,category,retailers,brand,min,max,sort]);
  if(status==='loading')return <StateMsg kind="loading"/>;
  if(status==='error'||!catalog)return <StateMsg kind="error" onRetry={reload}/>;
  const setCat=(c:string)=>{const n=new URLSearchParams(sp);c?n.set('category',c):n.delete('category');setSp(n);setBrand('');};
  return <div className="grid gap-6 md:grid-cols-[240px_1fr]">
    <aside className="card h-fit space-y-4 p-4 text-sm" aria-label="Filters">
      <div><label className="font-semibold" htmlFor="cat">Category</label><select id="cat" className="input mt-1 w-full" value={category} onChange={e=>setCat(e.target.value)}><option value="">All</option>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div><label className="font-semibold" htmlFor="brand">Brand{category&&` (in ${CATEGORIES.find(c=>c.id===category)?.name})`}</label><select id="brand" className="input mt-1 w-full" value={brand} onChange={e=>setBrand(e.target.value)}><option value="">All</option>{brands.map(b=><option key={b}>{b}</option>)}</select></div>
      <fieldset><legend className="font-semibold">Price range (₹)</legend><div className="mt-1 flex gap-2"><input aria-label="Minimum price" className="input w-full" type="number" min="0" placeholder="Min" value={min} onChange={e=>setMin(e.target.value)}/><input aria-label="Maximum price" className="input w-full" type="number" min="0" placeholder="Max" value={max} onChange={e=>setMax(e.target.value)}/></div></fieldset>
      <fieldset><legend className="font-semibold">Retailer</legend>{catalog.retailers.map(r=><label key={r.id} className="flex items-center gap-2 py-0.5"><input type="checkbox" checked={retailers.includes(r.id)} onChange={()=>setRetailers(s=>s.includes(r.id)?s.filter(x=>x!==r.id):[...s,r.id])}/>{r.name}</label>)}</fieldset>
    </aside>
    <section><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h1 className="text-xl font-bold">{results.length} result{results.length===1?'':'s'}{q&&<> for “{q}”</>}</h1>
      <div><label htmlFor="sort" className="mr-2 text-sm">Sort by</label><select id="sort" className="input" value={sort} onChange={e=>setSort(e.target.value as SortKey)}><option value="total">Lowest estimated payable</option><option value="listed">Lowest listed price</option><option value="discount">Highest discount</option><option value="alpha">A–Z</option></select></div></div>
      {results.length===0?<StateMsg kind="empty">No products match. Try fewer filters or a different search.</StateMsg>:<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.map(s=><ProductCard key={s.product.id} s={s}/>)}</div>}</section></div>;
}
