import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Categories from './pages/Categories';
import SearchPage from './pages/Search';
import ProductPage from './pages/Product';
import Basket from './pages/Basket';
import Saved from './pages/Saved';
export default function App(){return <Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="categories" element={<Categories/>}/><Route path="search" element={<SearchPage/>}/><Route path="product/:id" element={<ProductPage/>}/><Route path="basket" element={<Basket/>}/><Route path="saved" element={<Saved/>}/><Route path="*" element={<Home/>}/></Route></Routes>;}
