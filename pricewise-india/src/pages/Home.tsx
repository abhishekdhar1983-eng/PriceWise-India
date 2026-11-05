import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { ICONS, ProductCard, StateMsg } from '../components/ui';
import { summarize, sortSummaries } from '../utils/search';
import { useApp } from '../context/AppContext';
import { inr } from '../utils/hash';
const POPULAR=['amul-milk-1l','atta-5','galaxy-m35-128','iphone15','sony-ch520','shoes-campus','shampoo-dove','mixer-prestige'];
export default function Home(){
  const {catalog,status,reload,basket,saved}=useApp();
  if(status==='loading')return <StateMsg kind="loading"/>;
  if(status==='error'||!catalog)return <StateMsg kind="error" onRetry={reload}/>;
  const all=catalog.products.map(p=>summarize(p,catalog));
  const popular=POPULAR.map(id=>all.find(s=>s.product.id===id)!).filter(Boolean);
  const deals=sortSummaries(all,'discount').slice(0,4);
  return <div className="space-y-10">
    <section className="rounded-3xl bg-gradient-to-br from-brand-900 to-brand-600 p-8 text-white"><h1 className="text-3xl font-extrabold md:text-4xl">Compare More. Spend Less.</h1>
      <p className="mt-2 max-w-xl text-brand-100">Search once and see illustrative prices, fees and delivery times across Indian retailers.</p>
      <div className="mt-5 flex flex-wrap gap-3"><Link to="/basket" className="btn bg-white text-brand-900">Grocery basket ({basket.length})</Link><Link to="/saved" className="btn bg-save-600 text-white">Saved products ({saved.length})</Link></div></section>
    <section aria-labelledby="cats"><h2 id="cats" className="mb-3 text-lg font-bold">Browse categories</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{CATEGORIES.map(c=>{const I=ICONS[c.id];return <Link key={c.id} to={`/search?category=${c.id}`} className="card flex flex-col items-center gap-2 p-4 text-center text-sm font-semibold hover:ring-brand-600"><I className="text-brand-600"/>{c.name}</Link>;})}</div></section>
    <section><h2 className="mb-3 text-lg font-bold">Popular products</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{popular.map(s=><ProductCard key={s.product.id} s={s}/>)}</div></section>
    <section><h2 className="mb-1 text-lg font-bold">Trending sample deals</h2><p className="mb-3 text-xs text-slate-500">Biggest discounts vs. sample MRP. Demo data — not verified deals.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{deals.map(s=><ProductCard key={s.product.id} s={s}/>)}</div></section>
    <section><h2 className="mb-3 text-lg font-bold">Featured comparisons</h2><div className="grid gap-4 md:grid-cols-3">{popular.slice(2,5).map(s=><div key={s.product.id} className="card p-4"><Link to={`/product/${s.product.id}`} className="font-semibold hover:underline">{s.product.title}</Link>
      <ul className="mt-2 divide-y text-sm">{s.priced.slice(0,3).map(x=><li key={x.offer.retailerId} className="flex justify-between py-1.5"><span>{catalog.retailers.find(r=>r.id===x.offer.retailerId)?.name}</span><span className="font-semibold">{inr(x.offer.price)}</span></li>)}</ul></div>)}</div></section>
  </div>;
}
