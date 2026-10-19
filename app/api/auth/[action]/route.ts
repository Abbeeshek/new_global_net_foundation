import {NextResponse} from 'next/server';
import {z} from 'zod';
import {authConfigured,createClient} from '../../../../lib/supabase/server';
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){
 if(request.headers.get('origin')!==new URL(request.url).origin)return NextResponse.json({error:'Invalid request origin.'},{status:403});
 if(!authConfigured())return NextResponse.json({error:'Member accounts are not configured yet. Please check back soon.'},{status:503});
 const {action}=await params;if(!['login','signup','recover','password','signout'].includes(action))return NextResponse.json({error:'Unknown action.'},{status:404});
 try{
 const text=await request.text();if(text.length>10000)return NextResponse.json({error:'Request too large.'},{status:413});const body=JSON.parse(text),supabase=await createClient();
 if(action==='signout'){await supabase.auth.signOut();return NextResponse.json({redirect:'/login'})}
 if(action==='recover'){const email=z.string().email().max(254).parse(body.email);const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:new URL('/reset-password',request.url).href});if(error)return NextResponse.json({error:'Could not send a reset email. Please try again later.'},{status:400});return NextResponse.json({message:'If this email has an account, a password reset link has been sent.'})}
 if(action==='password'){const password=z.string().min(12).max(128).parse(body.password);const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:'Open the password reset link from your email first.'},{status:401});const {error}=await supabase.auth.updateUser({password});if(error)return NextResponse.json({error:'Could not update your password. Try a different password or request a new reset link.'},{status:400});return NextResponse.json({redirect:'/dashboard'})}
 const credentials=z.object({email:z.string().email().max(254),password:z.string().min(action==='signup'?12:1).max(128)}).parse(body);
 if(action==='signup'){const {data,error}=await supabase.auth.signUp({...credentials,options:{emailRedirectTo:new URL('/login',request.url).href}});if(error)return NextResponse.json({error:'Unable to create this account. Check your details or try logging in. If needed, try again later.'},{status:400});return NextResponse.json(data.session?{redirect:'/dashboard'}:{message:'Check your email to confirm your account, then return here to log in.'})}
 const {error}=await supabase.auth.signInWithPassword(credentials);if(error)return NextResponse.json({error:'Unable to sign in. Check your email and password, and confirm your email if you have just signed up.'},{status:400});return NextResponse.json({redirect:'/dashboard'});
 }catch{return NextResponse.json({error:'Please enter a valid email and password. New passwords must have at least 12 characters.'},{status:400})}
}
