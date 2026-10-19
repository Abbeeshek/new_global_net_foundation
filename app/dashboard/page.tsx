import { requireChatGPTUser } from '../chatgpt-auth';import MemberShell from '../member-shell';import Dashboard from './dashboard';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/dashboard');return <MemberShell><Dashboard/></MemberShell>}
