import {createClient,authConfigured} from '../../../lib/supabase/server';
import {z} from 'zod';
const options=['Digital Marketing','OTT & Entertainment','Sports Association','E-commerce','Real Estate Projects','Educational Network','Crypto & Blockchain','Startups & Tech','Women Self-Help','Lifestyle Coaching','Health Sector','Astrology Group'];
const profile=z.object({name:z.string().trim().min(2).max(100),phone:z.string().trim().max(20).regex(/^[+\d\s()-]*$/),state:z.string().trim().min(2).max(80),city:z.string().trim().min(2).max(80),interests:z.array(z.string().refine(v=>options.includes(v))).max(12),updates:z.boolean(),consent:z.literal(true)});
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
async function session(){if(!authConfigured())return null;const db=await createClient();const {data:{user},error}=await db.auth.getUser();return !error&&user?.email?{db,user}:null}
export async function GET(){try{const s=await session();if(!s)return json({error:'Please sign in.'},401);const {data:member,error}=await s.db.from('foundation_members').select('*').eq('userId',s.user.id).maybeSingle();if(error)return json({error:'Your profile could not be loaded. Please try again.'},503);return json({user:{email:s.user.email,name:s.user.user_metadata?.full_name??''},member})}catch{return json({error:'Your profile could not be loaded. Please try again.'},503)}}
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);
 try{const s=await session();if(!s)return json({error:'Please sign in.'},401);const text=await request.text();if(text.length>10000)return json({error:'Request too large.'},413);let raw;try{raw=JSON.parse(text)}catch{return json({error:'Invalid profile data.'},400)}const result=profile.safeParse(raw);if(!result.success)return json({error:'Please enter your name, state and city, a valid phone number, and accept the privacy notice.'},400);
 const v=result.data,now=new Date().toISOString(),fields={email:s.user.email,name:v.name,phone:v.phone,state:v.state,city:v.city,interests:[...new Set(v.interests)],updates:v.updates,updatedAt:now};
 const {data:old,error:readError}=await s.db.from('foundation_members').select('userId').eq('userId',s.user.id).maybeSingle();if(readError)return json({error:'Your profile could not be saved. Please try again.'},503);
 let {error}=old?await s.db.from('foundation_members').update(fields).eq('userId',s.user.id):await s.db.from('foundation_members').insert({userId:s.user.id,...fields,consentAt:now});
 if(error?.code==='23505'){const retried=await s.db.from('foundation_members').update(fields).eq('userId',s.user.id);error=retried.error}
 return error?json({error:'Your profile could not be saved. Please try again.'},503):json({saved:true});
 }catch{return json({error:'Your profile could not be saved. Please try again.'},503)}
}
export async function DELETE(request:Request){if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);try{const s=await session();if(!s)return json({error:'Please sign in.'},401);const {error}=await s.db.from('foundation_members').delete().eq('userId',s.user.id);return error?json({error:'Could not delete your profile. Please try again.'},503):json({deleted:true})}catch{return json({error:'Could not delete your profile. Please try again.'},503)}}
