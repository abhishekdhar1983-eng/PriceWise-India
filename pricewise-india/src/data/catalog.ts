import type { Catalog, CategoryId, Offer, Product, Retailer } from '../types';
import { hash } from '../utils/hash';
// DEMO DATA ONLY: all prices and fees are fictional and generated deterministically.
const R=(id:string,name:string,deliveryFee:number|null,freeDeliveryAbove:number|null,handlingFee:number|null,eta:string):Retailer=>({id,name,deliveryFee,freeDeliveryAbove,handlingFee,eta});
export const RETAILERS:Retailer[]=[R('amazon','Amazon',40,499,0,'1–3 days'),R('flipkart','Flipkart',40,500,0,'2–4 days'),R('blinkit','Blinkit',25,199,4,'10–15 min'),R('zepto','Zepto',30,199,5,'10–12 min'),R('instamart','Swiggy Instamart',35,199,6,'15–25 min'),R('bigbasket','BigBasket',30,300,0,'Today (slot)'),R('jiomart','JioMart',40,250,0,'1–2 days'),R('dmart','DMart Ready',49,500,0,'Next day (slot)'),R('myntra','Myntra',99,799,0,'3–5 days'),R('ajio','AJIO',79,999,0,'3–6 days'),R('meesho','Meesho',null,null,0,'4–7 days'),R('nykaa','Nykaa',49,499,0,'2–4 days')];
const Q=['blinkit','zepto','instamart','bigbasket','jiomart'],D=[...Q,'dmart'],AF=['amazon','flipkart'];
type Row=[string,string,string,CategoryId,string,string,number,string[]];
const rows:Row[]=[
['amul-milk-500','Amul Taaza Toned Milk','Amul','groceries','Toned','500 ml',29,Q],['amul-milk-1l','Amul Taaza Toned Milk','Amul','groceries','Toned','1 L',56,Q],
['atta-5','Aashirvaad Shudh Chakki Atta','Aashirvaad','groceries','Whole wheat','5 kg',265,[...D,'amazon']],['atta-10','Aashirvaad Shudh Chakki Atta','Aashirvaad','groceries','Whole wheat','10 kg',515,D],
['oil-1l','Fortune Sunflower Oil','Fortune','groceries','Refined','1 L',145,[...D,'amazon']],['salt-1','Tata Salt','Tata','groceries','Iodised','1 kg',28,D],
['surf-1','Surf Excel Easy Wash Powder','Surf Excel','groceries','Detergent powder','1 kg',135,[...D,'amazon']],['rice-5','India Gate Basmati Rice','India Gate','groceries','Classic','5 kg',620,D],
['tea-500','Tata Tea Gold','Tata','groceries','Leaf tea','500 g',295,D],['maggi-12','Maggi 2-Minute Noodles Masala','Nestle','groceries','Masala','12 pack',168,D],
['galaxy-m35-128','Samsung Galaxy M35 5G','Samsung','electronics','8GB + 128GB','1 unit',18999,AF],['galaxy-m35-256','Samsung Galaxy M35 5G','Samsung','electronics','8GB + 256GB','1 unit',21999,AF],
['iphone15','Apple iPhone 15','Apple','electronics','128GB Black','1 unit',66900,AF],['hp-15s','HP 15s Laptop','HP','electronics','Core i5 / 16GB / 512GB','1 unit',54990,AF],
['sony-ch520','Sony WH-CH520 Wireless Headphones','Sony','electronics','Black','1 unit',4490,AF],
['shoes-campus','Campus Running Shoes','Campus','fashion','UK 9 · Black','1 pair',1799,['myntra','ajio','amazon','flipkart','meesho']],
['tee-roadster','Roadster Men Cotton T-Shirt','Roadster','fashion','M · Navy','1 pc',449,['myntra','ajio','flipkart','meesho']],
['tee-polo','Allen Solly Men Polo T-Shirt','Allen Solly','fashion','L · White','1 pc',899,['myntra','ajio','amazon']],
['kurti-libas','Libas Women Printed Kurti','Libas','fashion','M · Teal','1 pc',799,['myntra','ajio','meesho','flipkart']],
['kurti-biba','Biba Women Straight Kurti','Biba','fashion','L · Maroon','1 pc',1299,['myntra','ajio','amazon']],
['facewash-him','Himalaya Purifying Neem Face Wash','Himalaya','beauty','Neem','150 ml',175,['nykaa','amazon','flipkart','blinkit','zepto']],
['facewash-cet','Cetaphil Gentle Skin Cleanser','Cetaphil','beauty','Normal to dry skin','250 ml',599,['nykaa','amazon','flipkart']],
['shampoo-dove','Dove Hair Fall Rescue Shampoo','Dove','beauty','Hair fall','650 ml',399,['nykaa','amazon','flipkart','blinkit','zepto']],
['shampoo-hs','Head & Shoulders Cool Menthol Shampoo','Head & Shoulders','beauty','Anti-dandruff','340 ml',299,['amazon','flipkart','blinkit','zepto','instamart']],
['mixer-prestige','Prestige Iris Mixer Grinder','Prestige','appliances','750W · 3 jars','1 unit',3499,AF],['mixer-bajaj','Bajaj Rex Mixer Grinder','Bajaj','appliances','500W · 3 jars','1 unit',2299,[...AF,'jiomart']],
['mattress-wake','Wakefit Memory Foam Mattress','Wakefit','furniture','Queen · 6 in','1 unit',12999,AF],
['diaper-pampers','Pampers Active Baby Diapers','Pampers','baby','Medium','76 pcs',899,['amazon','flipkart','bigbasket','blinkit']],
['yoga-boldfit','Boldfit Yoga Mat','Boldfit','sports','6 mm · Purple','1 pc',449,['amazon','flipkart','meesho']],
['book-atomic','Atomic Habits (James Clear)','Penguin','books','Paperback','1 copy',399,AF],
['bulb-philips','Philips LED Bulb 9W','Philips','other','Cool day light','4 pcs',349,['amazon','flipkart','jiomart','blinkit']]];
export const PRODUCTS:Product[]=rows.map(([id,title,brand,category,variant,packSize])=>({id,title,brand,category,variant,packSize,isGrocery:category==='groceries'}));
const SAMPLE_TIME='2026-11-01T09:00:00+05:30';
export const OFFERS:Offer[]=rows.flatMap(row=>row[7].map(rid=>{
  const id=row[0],base=row[6],r=RETAILERS.find(x=>x.id===rid)!,k=hash(id+rid),price=Math.round(base*(0.94+(k%13)/100)),mrp=Math.round(price*(1.08+(k%7)/25));
  const delivery=r.deliveryFee===null?null:r.freeDeliveryAbove!==null&&price>=r.freeDeliveryAbove?0:r.deliveryFee;
  return{productId:id,retailerId:rid,price,mrp,deliveryFee:delivery,handlingFee:r.handlingFee,eligibleDiscount:0,inStock:k%9!==0,eta:r.eta,observedAt:SAMPLE_TIME};}));
export const CATALOG:Catalog={products:PRODUCTS,offers:OFFERS,retailers:RETAILERS};
