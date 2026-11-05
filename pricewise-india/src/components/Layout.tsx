import { NavLink, Link, Outlet } from 'react-router-dom';
import { Heart, Home, LayoutGrid, ShoppingBasket } from 'lucide-react';
import { PincodeBox, SearchBar } from './ui';
import { useApp } from '../context/AppContext';
export default function Layout(){
  const {basket,saved}=useApp();
  const nav=[{to:'/',label:'Home',I:Home,n:0},{to:'/categories',label:'Categories',I:LayoutGrid,n:0},{to:'/basket',label:'Basket',I:ShoppingBasket,n:basket.length},{to:'/saved',label:'Saved',I:Heart,n:saved.length}];
  const cls=({isActive}:{isActive:boolean})=>`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${isActive?'bg-brand-50 text-brand-700':'text-slate-600 hover:bg-slate-100'}`;
  return <div className="min-h-screen pb-16 md:pb-0">
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="mr-2"><span className="text-xl font-extrabold text-brand-900">PriceWise <span className="text-save-600">India</span></span><span className="block text-[11px] text-slate-500">Compare More. Spend Less.</span></Link>
        <div className="order-3 w-full md:order-none md:w-auto md:flex-1"><SearchBar/></div>
        <nav className="hidden gap-1 md:flex" aria-label="Main">{nav.map(({to,label,n})=><NavLink key={to} to={to} end className={cls}>{label}{n>0&&<span className="rounded-full bg-save-600 px-1.5 text-xs text-white">{n}</span>}</NavLink>)}</nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-2"><PincodeBox/></div>
      <div role="note" className="bg-amber-50 py-1 text-center text-xs font-semibold text-amber-900">Demo prices only — not live retailer data.</div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-6"><Outlet/></main>
    <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t bg-white py-1 md:hidden">{nav.map(({to,label,I,n})=><NavLink key={to} to={to} end className={({isActive})=>`relative flex flex-col items-center px-3 py-1 text-[11px] ${isActive?'text-brand-700':'text-slate-500'}`}><I size={20} aria-hidden/>{label}{n>0&&<span className="absolute right-1 top-0 rounded-full bg-save-600 px-1.5 text-[10px] text-white">{n}</span>}</NavLink>)}</nav>
  </div>;
}
