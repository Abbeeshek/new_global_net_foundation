// Compatibility exports for member pages; external deployments use Supabase Auth.
import { redirect } from 'next/navigation';
import {authConfigured,createClient} from '../lib/supabase/server';
export type ChatGPTUser={userId:string;displayName:string;email:string;fullName:string|null};
export async function getChatGPTUser():Promise<ChatGPTUser|null>{if(!authConfigured())return null;const supabase=await createClient();const {data:{user},error}=await supabase.auth.getUser();if(error||!user?.email)return null;const name=typeof user.user_metadata?.full_name==='string'?user.user_metadata.full_name:null;return {userId:user.id,email:user.email,displayName:name??user.email,fullName:name}}
export async function requireChatGPTUser(_returnTo:string){const user=await getChatGPTUser();if(!user)redirect('/login');return user}
export function chatGPTSignInPath(_returnTo:string){return '/login'}
export function chatGPTSignOutPath(_returnTo='/'){return '/auth/signout'}
