const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function formatNote(source){
 const inline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`([^`]+)`/g,'<code>$1</code>');
 const lines=String(source??'').split(/\r?\n/);let html='',list=false;
 const close=()=>{if(list){html+='</ul>';list=false;}};
 for(const line of lines){
  const heading=line.match(/^(#{1,3})\s+(.+)$/);
  const bullet=line.match(/^\s*[-*]\s+(.+)$/);
  if(heading){close();const n=heading[1].length;html+=`<h${n}>${inline(heading[2])}</h${n}>`;}
  else if(bullet){if(!list){html+='<ul>';list=true;}html+=`<li>${inline(bullet[1])}</li>`;}
  else{close();html+=line.trim()?`<p>${inline(line)}</p>`:'<div class="blank-line"></div>';}
 }
 close();return html;
}
