import MemberShell from '../../member-shell';import AuthForm from '../../auth-form';
export const dynamic='force-dynamic';export default function Page(){return <MemberShell><main className="privacy panel"><h1>Sign out</h1><AuthForm mode="signout"/></main></MemberShell>}
