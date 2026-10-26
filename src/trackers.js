export function ensureTrackers(c){if(!c.hp||typeof c.hp!=='object')c.hp={current:0,max:0,temp:0};if(!c.spellSlotTracker||typeof c.spellSlotTracker!=='object')c.spellSlotTracker={};return c;}
const safeInt=(v,max=999)=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(max,Math.trunc(n))):0;};
export function changeHP(c,kind,amount){ensureTrackers(c);const value=safeInt(amount,99999);if(!value)return false;const max=safeInt(c.hp.max,99999),current=safeInt(c.hp.current,99999),temp=safeInt(c.hp.temp,99999);
if(kind==='heal')c.hp.current=Math.min(max,current+value);
else if(kind==='damage'){const absorbed=Math.min(temp,value);c.hp.temp=temp-absorbed;c.hp.current=Math.max(0,current-(value-absorbed));}
else return false;return true;}
export function setSlotMaximum(c,level,value){ensureTrackers(c);const key=String(level);if(!Number.isInteger(level)||level<1||level>9)return false;const max=safeInt(value,30),old=c.spellSlotTracker[key];c.spellSlotTracker[key]={max,remaining:Math.min(max,safeInt(old?.remaining??max,30))};return true;}
export function setSlotRemaining(c,level,value){ensureTrackers(c);const slot=c.spellSlotTracker[String(level)];if(!slot)return false;slot.remaining=Math.min(safeInt(slot.max,30),safeInt(value,30));return true;}
