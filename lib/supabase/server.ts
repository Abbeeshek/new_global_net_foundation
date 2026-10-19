import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export function authConfigured(){return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)}
export async function createClient(){
 if(!authConfigured())throw new Error('Member accounts are not configured yet.');
 const jar=await cookies();
 return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{cookies:{getAll:()=>jar.getAll(),setAll:values=>{try{values.forEach(({name,value,options})=>jar.set(name,value,options))}catch{/* Server components rely on the proxy to refresh cookies. */}}}});
}
