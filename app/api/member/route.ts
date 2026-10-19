import { getChatGPTUser } from '../../chatgpt-auth';
import { getDb } from '../../../db';
import { members } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
const options=['Digital Marketing','OTT & Entertainment','Sports Association','E-commerce','Real Estate Projects','Educational Network','Crypto & Blockchain','Startups & Tech','Women Self-Help','Lifestyle Coaching','Health Sector','Astrology Group'];
const profile=z.object({name:z.string().trim().min(2).max(100),phone:z.string().trim().max(20).regex(/^[+\d\s()-]*$/),state:z.string().trim().min(2).max(80),city:z.string().trim().min(2).max(80),interests:z.array(z.string().refine(v=>options.includes(v))).max(12),updates:z.boolean(),consent:z.literal(true)});
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){const user=await getChatGPTUser();if(!user)return json({error:'Please sign in.'},401);try{const rows=await getDb().select().from(members).where(eq(members.userId,user.userId)).limit(1);return json({user:{email:user.email,name:user.fullName??''},member:rows[0]?{...rows[0],interests:JSON.parse(rows[0].interests)}:null})}catch{return json({error:'Your profile could not be loaded. Please try again.'},503)}}
export async function POST(request:Request){
 const user=await getChatGPTUser();if(!user)return json({error:'Please sign in.'},401);
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);
 if(Number(request.headers.get('content-length')??0)>10000)return json({error:'Request too large.'},413);
 let data;try{const raw=await request.text();if(raw.length>10000)return json({error:'Request too large.'},413);data=profile.safeParse(JSON.parse(raw))}catch{return json({error:'Invalid profile data.'},400)}
 if(!data.success)return json({error:'Please enter your name, state and city, a valid phone number, and accept the privacy notice.'},400);
 try{const db=getDb(),now=new Date().toISOString(),v=data.data;const fields={email:user.email,name:v.name,phone:v.phone,state:v.state,city:v.city,interests:JSON.stringify([...new Set(v.interests)]),updates:v.updates,updatedAt:now};await db.insert(members).values({userId:user.userId,memberId:'NGNF-'+crypto.randomUUID().slice(0,12).toUpperCase(),...fields,createdAt:now,consentAt:now}).onConflictDoUpdate({target:members.userId,set:fields});return json({saved:true})}catch{return json({error:'Your profile could not be saved. Please try again.'},503)}
}
export async function DELETE(request:Request){const user=await getChatGPTUser();if(!user)return json({error:'Please sign in.'},401);if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);try{await getDb().delete(members).where(eq(members.userId,user.userId));return json({deleted:true})}catch{return json({error:'Could not delete your profile. Please try again.'},503)}}
