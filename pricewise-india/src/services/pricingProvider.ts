import type { Catalog } from '../types';
import { CATALOG } from '../data/catalog';
/** Implement this interface later with authorized retailer/affiliate API adapters. */
export interface PricingProvider{readonly name:string;readonly isDemo:boolean;getCatalog(pincode:string|null):Promise<Catalog>}
export class MockPricingProvider implements PricingProvider{
  readonly name='Mock (local sample data)';readonly isDemo=true;
  // pincode is accepted but ignored: location-based pricing is SIMULATED/not implemented in v0.1.
  getCatalog(_pincode:string|null):Promise<Catalog>{return new Promise(res=>setTimeout(()=>res(CATALOG),400));}
}
