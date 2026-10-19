import html from "./home-content";
export function GET(){return new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8"}})}