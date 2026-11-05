import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { ICONS } from '../components/ui';
export default function Categories(){return <div><h1 className="mb-4 text-2xl font-bold">Categories</h1><div className="grid grid-cols-2 gap-4 md:grid-cols-5">{CATEGORIES.map(c=>{const I=ICONS[c.id];return <Link key={c.id} to={`/search?category=${c.id}`} className="card flex flex-col items-center gap-3 p-6 font-semibold hover:ring-brand-600"><I size={32} className="text-brand-600"/>{c.name}</Link>;})}</div></div>;}
