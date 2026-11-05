import { Link } from 'react-router-dom';
import { ProductCard, StateMsg } from '../components/ui';
import { summarize } from '../utils/search';
import { useApp } from '../context/AppContext';
export default function Saved(){
  const {catalog,status,reload,saved}=useApp();
  if(status==='loading')return <StateMsg kind="loading"/>;
  if(status==='error'||!catalog)return <StateMsg kind="error" onRetry={reload}/>;
  const list=catalog.products.filter(p=>saved.includes(p.id)).map(p=>summarize(p,catalog));
  return <div><h1 className="mb-4 text-2xl font-bold">Saved products</h1>{list.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{list.map(s=><ProductCard key={s.product.id} s={s}/>)}</div>:<StateMsg kind="empty">Nothing saved yet. Tap the heart on any product, or <Link className="underline" to="/search">start searching</Link>.</StateMsg>}</div>;
}
