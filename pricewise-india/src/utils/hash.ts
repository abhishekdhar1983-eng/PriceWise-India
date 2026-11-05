export const hash=(s:string)=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
export const inr=(n:number)=>'₹'+n.toLocaleString('en-IN');
export const validPincode=(s:string)=>/^[1-9][0-9]{5}$/.test(s);
