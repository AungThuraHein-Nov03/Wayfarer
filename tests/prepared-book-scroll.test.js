import test from 'node:test';
import assert from 'node:assert/strict';
import {syncPageScroll,synchronizePreparedBookScroll} from '../src/prepared-book-scroll.js';

const pane=(height,viewport=400)=>({scrollHeight:height,clientHeight:viewport,scrollTop:0});
test('two parchment pages use the same scroll percentage even with unequal text lengths',()=>{
  const left=pane(1400),right=pane(800);
  syncPageScroll([left,right],left,500);
  assert.equal(left.scrollTop,500);
  assert.equal(right.scrollTop,200);
  syncPageScroll([left,right],right,400);
  assert.equal(left.scrollTop,1000);
  assert.equal(right.scrollTop,400);
  syncPageScroll([left,right],left,-500);
  assert.equal(left.scrollTop,0);
  assert.equal(right.scrollTop,0);
});
test('wheel over either page moves the whole spread; scrollbars and keyboard also synchronize',()=>{
  let pair=[pane(1400),pane(800)];
  const handlers={};
  const pages={
    querySelectorAll:()=>pair,
    addEventListener:(name,handler)=>{handlers[name]=handler;},
    removeEventListener:(name)=>{delete handlers[name];}
  };
  const stop=synchronizePreparedBookScroll(pages,{isSpread:()=>true});
  let prevented=false;
  handlers.wheel({deltaY:250,deltaMode:0,ctrlKey:false,preventDefault:()=>{prevented=true;}});
  assert.equal(prevented,true);
  assert.equal(pair[0].scrollTop,250);
  assert.equal(pair[1].scrollTop,100);
  // Programmatic scroll events must not bounce the synchronized position back.
  handlers.scroll({target:pair[1]});
  assert.equal(pair[0].scrollTop,250);
  pair[1].scrollTop=200;
  handlers.scroll({target:pair[1]});
  assert.equal(pair[0].scrollTop,500);
  // A new bookmark replaces the inner pages, but the outer listener remains attached.
  pair=[pane(900),pane(1500)];
  handlers.wheel({deltaY:180,deltaMode:0,ctrlKey:false,preventDefault(){}});
  assert.equal(pair[1].scrollTop,180);
  assert.ok(pair[0].scrollTop>0);
  stop();
  assert.equal(handlers.wheel,undefined);
  assert.equal(handlers.scroll,undefined);
});
test('the short or empty page still lets wheel scroll the longer page',()=>{
  const left=pane(400),right=pane(1700);
  let wheel;
  synchronizePreparedBookScroll({
    querySelectorAll:()=>[left,right],
    addEventListener:(name,fn)=>{if(name==='wheel')wheel=fn;},
    removeEventListener(){}
  },{isSpread:()=>true});
  wheel({deltaY:140,deltaMode:0,ctrlKey:false,preventDefault(){}});
  assert.equal(left.scrollTop,0);
  assert.equal(right.scrollTop,140);
});
test('stacked mobile pages and zoom gestures retain browser-native scrolling',()=>{
  const left=pane(1400),right=pane(800);
  let wheel;
  synchronizePreparedBookScroll({
    querySelectorAll:()=>[left,right],
    addEventListener:(name,fn)=>{if(name==='wheel')wheel=fn;},
    removeEventListener(){}
  },{isSpread:()=>false});
  wheel({deltaY:100,deltaMode:0,ctrlKey:false,preventDefault(){throw Error('mobile wheel prevented');}});
  assert.equal(left.scrollTop,0);
  assert.equal(right.scrollTop,0);
  // Desktop pinch zoom should not be hijacked either.
  assert.ok(wheel);
});
