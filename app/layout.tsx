import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Member Community | New Global Net Foundation',description:'Join the New Global Net Foundation community and manage your member profile.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
