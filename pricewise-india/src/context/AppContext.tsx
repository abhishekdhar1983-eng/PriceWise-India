import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Catalog } from '../types';
import { MockPricingProvider } from '../services/pricingProvider';
import { useLocalStorage } from '../hooks/useLocalStorage';
const provider=new MockPricingProvider();
interface Ctx{catalog:Catalog|null;status:'loading'|'ready'|'error';reload:()=>void;pincode:string;setPincode:(p:string)=>void;saved:string[];toggleSaved:(id:string)=>void;
  basket:{productId:string;qty:number}[];addToBasket:(id:string)=>void;setQty:(id:string,q:number)=>void;removeFromBasket:(id:string)=>void;clearBasket:()=>void}
const C=createContext<Ctx>(null!);
export const useApp=()=>useContext(C);
export function AppProvider({children}:{children:ReactNode}){
  const [catalog,setCatalog]=useState<Catalog|null>(null);const [status,setStatus]=useState<Ctx['status']>('loading');
  const [pincode,setPincode]=useLocalStorage('pw.pincode','');const [saved,setSaved]=useLocalStorage<string[]>('pw.saved',[]);
  const [basket,setBasket]=useLocalStorage<Ctx['basket']>('pw.basket',[]);
  const reload=useCallback(()=>{setStatus('loading');provider.getCatalog(pincode||null).then(c=>{setCatalog(c);setStatus('ready');}).catch(()=>setStatus('error'));},[pincode]);
  useEffect(reload,[reload]);
  const value:Ctx={catalog,status,reload,pincode,setPincode,saved,toggleSaved:id=>setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]),basket,
    addToBasket:id=>setBasket(b=>b.some(x=>x.productId===id)?b.map(x=>x.productId===id?{...x,qty:x.qty+1}:x):[...b,{productId:id,qty:1}]),
    setQty:(id,q)=>setBasket(b=>q<=0?b.filter(x=>x.productId!==id):b.map(x=>x.productId===id?{...x,qty:q}:x)),
    removeFromBasket:id=>setBasket(b=>b.filter(x=>x.productId!==id)),clearBasket:()=>setBasket([])};
  return <C.Provider value={value}>{children}</C.Provider>;
}
