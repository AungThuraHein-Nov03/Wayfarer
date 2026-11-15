// Keep the pocket grimoire's two scrollable pages on the same reading progress.
const maxScroll=element=>Math.max(0,element.scrollHeight-element.clientHeight);
export function syncPageScroll(panes,source,position=source.scrollTop,ignore=null){
  const maximum=maxScroll(source);
  const progress=maximum>0?Math.min(1,Math.max(0,position/maximum)):0;
  for(const pane of panes){
    const target=progress*maxScroll(pane);
    if(Math.abs(pane.scrollTop-target)>0.5){
      ignore?.set(pane,target);
      pane.scrollTop=target;
    }
  }
}

export function synchronizePreparedBookScroll(pages,{isSpread=()=>!window.matchMedia('(max-width:590px)').matches}={}){
  const panes=()=>[...pages.querySelectorAll('.prepared-page-scroll')];
  const ignored=new WeakMap();
  const onWheel=event=>{
    if(!isSpread()||event.ctrlKey||!event.deltaY)return;
    const pair=panes();
    const anchor=pair.reduce((best,pane)=>!best||maxScroll(pane)>maxScroll(best)?pane:best,null);
    if(!anchor||maxScroll(anchor)===0)return;
    // Listen on the whole spread so a short or empty page can still turn both pages.
    event.preventDefault();
    const delta=event.deltaMode===1?event.deltaY*16:event.deltaMode===2?event.deltaY*anchor.clientHeight:event.deltaY;
    syncPageScroll(pair,anchor,anchor.scrollTop+delta,ignored);
  };
  const onScroll=event=>{
    if(!isSpread())return;
    const pair=panes();
    if(!pair.includes(event.target))return;
    const expected=ignored.get(event.target);
    if(expected!==undefined){
      ignored.delete(event.target);
      if(Math.abs(event.target.scrollTop-expected)<1)return;
    }
    // Also synchronize scrollbar dragging, keyboard scrolling, and touch scrolling.
    syncPageScroll(pair,event.target,event.target.scrollTop,ignored);
  };
  pages.addEventListener('wheel',onWheel,{passive:false});
  pages.addEventListener('scroll',onScroll,true);
  return ()=>{
    pages.removeEventListener('wheel',onWheel);
    pages.removeEventListener('scroll',onScroll,true);
  };
}
