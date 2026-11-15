// Browser-safe backup filenames; the JSON still contains the full Wayfarer library.
export function safeCharacterFilename(name){
  let result=String(name??'')
    .replace(/[<>:"/\\|?*\u0000-\u001f\u007f]/g,' ')
    .replace(/\s+/g,' ')
    .trim()
    .slice(0,80)
    .replace(/[. ]+$/g,'');
  if(!result)result='Adventurer';
  if(/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(result))result='Character '+result;
  return result;
}
export function exportFilename(library, date=new Date()){
  const active=library?.characters?.find(c=>c.id===library.selectedId)||library?.characters?.[0];
  const pad=value=>String(value).padStart(2,'0');
  const day=[date.getFullYear(),pad(date.getMonth()+1),pad(date.getDate())].join('-');
  return `${safeCharacterFilename(active?.name)} - ${day}.json`;
}
