// 「我也感觉到了」：只记次数，不记名字、不用 cookie。服务不通时按钮保持隐藏。
(function(){
  var API=document.documentElement.getAttribute('data-ticks');if(!API)return;
  var boxes=[].slice.call(document.querySelectorAll('[data-tick]'));if(!boxes.length)return;
  var ids=boxes.map(function(b){return b.getAttribute('data-tick')});
  function mine(id){try{return localStorage.getItem('tick:'+id)==='1'}catch(e){return false}}
  function mark(id){try{localStorage.setItem('tick:'+id,'1')}catch(e){}}
  function paint(b,n){var id=b.getAttribute('data-tick'),btn=b.querySelector('button'),c=b.querySelector('.n');
    c.textContent=n>0?('还有 '+n+' 人也感觉到了 · '+n+' others felt it too'):'';
    if(mine(id)){btn.disabled=true;btn.textContent='✓ 你也感觉到了 · You felt it too'}b.hidden=false}
  fetch(API+'/counts?ids='+ids.join(',')).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
    boxes.forEach(function(b){var id=b.getAttribute('data-tick');paint(b,d[id]||0);
      b.querySelector('button').addEventListener('click',function(){var btn=this;if(mine(id))return;btn.disabled=true;
        fetch(API+'/tick',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})})
        .then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(x){mark(id);paint(b,x.count)})
        .catch(function(){btn.disabled=false;btn.textContent='没记上，再点一次 · Try again'})})})
  }).catch(function(){});
})();
// 「找到了吗」之后：接住一片飘来的叶子。只记次数：不记名字、不记 IP、不用 cookie。
// Used on point pages (via ticks-client.js) and in the forest. Any element <div data-ff="pointkey"></div> is mounted automatically.
(function(){
  if(window.FoundFlow)return;
  var API=document.documentElement.getAttribute('data-ticks')||window.__TICKS||'';
  var FELT=[['warm','热了','warm'],['soft','松了','softer'],['tingle','有点麻','tingling'],['sink','沉下去','sinking'],['none','没什么感觉','nothing yet']];
  var STUCK=[['where','不确定是不是这里',"not sure it's here"],['step','有一步看不懂','one step is unclear'],['reach','手够不到',"can't reach"],['nails','指甲太长','long nails']];
  var INPERSON='<div class="ff-in"><b>想当面找一找？<span class="ff-en">Rather find it in person?</span></b>'+
    '<p><b>2027 年 9 月 · 伦敦 Yogarise Peckham</b> · Austin Ince 阴瑜伽师资培训，中医入门<span class="ff-en">September 2027 · London · Introduction to TCM on Austin Ince\'s Yin Yoga Teacher Training</span></p>'+
    '<p class="ff-links"><a href="https://www.austininceyoga.com/yin-teacher-training-london" rel="noopener" target="_blank">Austin Ince 的课程 · The course ↗</a> <a href="inperson.html">当面 · In person →</a></p>'+
    '<p class="ff-mail"><span>写信 · Write</span> <code>hello@weidingpractice.com</code> <button type="button" class="ff-copy">复制 · Copy</button></p></div>';
  var CSS='.ff{display:flex;flex-direction:column;gap:10px;margin-top:12px}.ff[hidden]{display:none}.ff p{margin:0}'+
    '.ff-en{display:block;color:var(--muted,#5d6b6b);font-size:13px;font-weight:400}'+
    '.ff-q{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.ff-q b{font-weight:600}'+
    '.ff button{font:inherit;font-size:14px;border-radius:999px;border:1px solid var(--line,#dfe3df);background:transparent;color:inherit;padding:5px 13px;cursor:pointer}'+
    '.ff-done{color:var(--water,#1f6f6a);font-size:14px}'+
    '.ff-drift{display:flex;flex-wrap:wrap;gap:8px}'+
    '.ff .ff-chip{border:none;background:rgba(60,150,140,.16);color:inherit;padding:6px 12px;animation:fffloat 5s ease-in-out infinite}'+
    '.ff .ff-chip:nth-child(2n){animation-delay:-1.6s}.ff .ff-chip:nth-child(3n){animation-delay:-3.1s}'+
    '.ff-chip i{font-style:normal;font-size:12px;color:var(--muted,#5d6b6b);margin-left:6px}'+
    '.ff-stuck .ff-chip{background:rgba(190,90,60,.16)}'+
    '.ff .ff-chip.on{background:#1f6f6a;color:#fff;animation:none}.ff-chip.on i{color:#fff}'+
    '@keyframes fffloat{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-3px) rotate(-1deg)}}'+
    '@media (prefers-reduced-motion:reduce){.ff .ff-chip{animation:none}}'+
    '.ff-say{font-size:13px;color:var(--water,#1f6f6a)}'+
    '.ff-in{background:rgba(60,150,140,.12);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:8px;font-size:14px}'+
    '.ff-links{display:flex;flex-wrap:wrap;gap:6px 16px}.ff-links a{color:var(--water,#1f6f6a)}'+
    '.ff-mail code{user-select:all;background:transparent;border:1px solid var(--line,#dfe3df);border-radius:6px;padding:1px 7px}.ff-mail .ff-copy{font-size:12px;padding:2px 10px}';
  function css(){if(document.getElementById('ff-css'))return;var s=document.createElement('style');s.id='ff-css';s.textContent=CSS;document.head.appendChild(s)}
  function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function put(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function tick(id){return fetch(API+'/tick',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})}).then(function(r){if(!r.ok)throw 0;return r.json()})}
  function counts(ids){return fetch(API+'/counts?ids='+ids.join(',')).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return {}})}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function chips(k,list,cls,c){return '<div class="ff-drift '+cls+'">'+list.map(function(x){var id='leaf-'+k+'-'+x[0],on=get('leaf:'+k+':'+x[0])==='1',n=c[id]||0;
    return '<button type="button" class="ff-chip'+(on?' on':'')+'" data-c="'+x[0]+'"'+(on?' aria-pressed="true" disabled':'')+'>'+esc(x[1])+' · '+esc(x[2])+(n?'<i>'+n+'</i>':'')+'</button>'}).join('')+'</div>'}
  function after(el,k,a){
    var list=a==='yes'?FELT:STUCK,ids=list.map(function(x){return 'leaf-'+k+'-'+x[0]});if(a==='yes')ids.push('find-'+k+'-yes');
    counts(ids).then(function(c){
      var head;
      if(a==='yes'){var n=Math.max(0,(c['find-'+k+'-yes']||1)-1);
        head='<p class="ff-done">✓ '+(n?'你和另外 '+n+' 个人找到了。<span class="ff-en">You and '+n+' others found it.</span>':'找到了。<span class="ff-en">Found.</span>')+'</p><p><b>这里有什么感觉？</b><span class="ff-en">What do you feel here? Catch a leaf.</span></p>';
      }else head='<p><b>卡在哪一步？</b><span class="ff-en">Where did it stop working?</span></p>';
      var caughtStuck=STUCK.some(function(x){return get('leaf:'+k+':'+x[0])==='1'});
      el.innerHTML=head+chips(k,list,a==='yes'?'ff-felt':'ff-stuck',c)+'<p class="ff-say" role="status"></p>'+(a==='no'&&caughtStuck?INPERSON:'');
    });
  }
  function ask(el,k){
    el.innerHTML='<div class="ff-q"><b>找到了吗？</b><span class="ff-en" style="display:inline">Did you find it?</span> <button type="button" data-a="yes">✓ 找到了 · Yes</button> <button type="button" data-a="no">没找到 · Not yet</button></div>';
  }
  function mount(el){
    if(el.__ff)return;el.__ff=1;var k=el.getAttribute('data-ff');if(!API||!/^[a-z0-9-]{1,40}$/.test(k))return;css();el.classList.add('ff');
    var a=get('found:'+k);if(a==='yes'||a==='no')after(el,k,a);else ask(el,k);el.hidden=false;
    el.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b||b.disabled)return;
      if(b.hasAttribute('data-a')){var ans=b.getAttribute('data-a');[].forEach.call(el.querySelectorAll('button'),function(x){x.disabled=true});
        tick('find-'+k+'-'+ans).then(function(){put('found:'+k,ans);after(el,k,ans)}).catch(function(){[].forEach.call(el.querySelectorAll('button'),function(x){x.disabled=false})});return}
      if(b.classList.contains('ff-chip')){var c=b.getAttribute('data-c');b.disabled=true;
        tick('leaf-'+k+'-'+c).then(function(x){put('leaf:'+k+':'+c,'1');b.classList.add('on');b.setAttribute('aria-pressed','true');
          var i=b.querySelector('i');if(!i){i=document.createElement('i');b.appendChild(i)}i.textContent=x.count;
          var say=el.querySelector('.ff-say');if(say)say.textContent='✓ 你接住了这片叶子，它长在这里了。 Caught: it grows here now.';
          if(b.closest('.ff-stuck')&&!el.querySelector('.ff-in'))el.insertAdjacentHTML('beforeend',INPERSON);
        }).catch(function(){b.disabled=false});return}
      if(b.classList.contains('ff-copy')){var t='hello@weidingpractice.com';
        (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){b.textContent='已复制 · Copied'}).catch(function(){var r=document.createRange();r.selectNodeContents(el.querySelector('.ff-mail code'));var s=getSelection();s.removeAllRanges();s.addRange(r)})}
    });
  }
  function scan(root){[].forEach.call((root||document).querySelectorAll('[data-ff]'),mount)}
  window.FoundFlow={mount:mount,scan:scan};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){scan()});else scan();
  if(window.MutationObserver)new MutationObserver(function(){scan()}).observe(document.documentElement,{childList:true,subtree:true});
})();
