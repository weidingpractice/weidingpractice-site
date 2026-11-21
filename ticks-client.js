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
  var FELT=[['warm','热了','Warm'],['soft','松了','Softer'],['tingle','有点麻','Tingling'],['sink','沉下去','Sinking'],['move','想动','Engaged'],['none','没感觉','Nothing yet']];
  var STUCK=[['where','不确定是这里',"Not sure it's here"],['step','有一步不懂','A step is unclear'],['reach','够不到',"Can't reach"]];
  var STUCK_AT={laogong:[['nails','指甲太长','Long nails']]};  // only where it really happens
  function stuckFor(k){return STUCK.concat(STUCK_AT[k]||[])}
  // the forest has a 中文/English switch (body.zh / body.en, spans .z/.e); point pages show Chinese with English beneath
  function forest(){return document.body.classList.contains('zh')||document.body.classList.contains('en')}
  function T(z,e,inline){return forest()?'<span class="z">'+z+'</span><span class="e">'+e+'</span>':(inline?z+' · '+e:z+'<span class="ff-en">'+e+'</span>')}
  function INP(found){return '<div class="ff-in"><b>'+(found?T('一起捡叶子？','Meet up?'):T('哪天一起找？','Find it together?'))+'</b> <a href="inperson.html">'+T('当面','In person',1)+' →</a></div>'}
  // 11-20: 「不确定是这里」 → the lights next door on the body (forest: window.FF_NEAR; point pages: data-near from the build)
  function NEARBY(el,k){var L=window.FF_NEAR?window.FF_NEAR(k):(function(){try{return JSON.parse(el.getAttribute('data-near')||'[]')}catch(e){return []}})();if(!L.length)return '';
    return '<div class="ff-near"><p><b>'+T('想找的是旁边的？','Maybe the one next door?')+'</b></p><div class="ff-drift">'+L.map(function(x){
      return window.FF_NEAR?'<button type="button" class="chip" data-pt="'+esc(x.k)+'">'+T(esc(x.zh),esc(x.py),1)+'</button>':'<a class="ff-nb" href="'+esc(x.slug)+'.html">'+T(esc(x.zh),esc(x.py),1)+' →</a>'}).join('')+'</div></div>'}
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
    '.ff-in{background:rgba(60,150,140,.12);border-radius:12px;padding:10px 14px;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;font-size:14px}.ff-in a{color:var(--water,#1f6f6a)}.ff-in .ff-en{display:inline;margin-left:4px}.ff-near{display:flex;flex-direction:column;gap:8px}.ff-nb{color:var(--water,#1f6f6a);font-size:14px;padding:4px 0;margin-right:12px}'+
    '.ff-links{display:flex;flex-wrap:wrap;gap:6px 16px}.ff-links a{color:var(--water,#1f6f6a)}'+
    '.ff-mail{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.ff-mail code{font-size:12.5px;user-select:all;background:transparent;border:1px solid var(--line,#dfe3df);border-radius:6px;padding:1px 7px}.ff-mail .ff-copy{font-size:12px;padding:2px 10px}';
  function css(){if(document.getElementById('ff-css'))return;var s=document.createElement('style');s.id='ff-css';s.textContent=CSS;document.head.appendChild(s)}
  function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function put(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  // 11-21: a preview (no counter) still shows the whole flow; it just counts nothing
  function tick(id){if(!API)return Promise.resolve({count:1,preview:true});return fetch(API+'/tick',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})}).then(function(r){if(!r.ok)throw 0;return r.json()})}
  function counts(ids){if(!API)return Promise.resolve({});return fetch(API+'/counts?ids='+ids.join(',')).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return {}})}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function chips(k,list,cls,c){return '<div class="ff-drift '+cls+'">'+list.map(function(x){var id='leaf-'+k+'-'+x[0],on=get('leaf:'+k+':'+x[0])==='1',n=c[id]||0;
    return '<button type="button" class="ff-chip'+(on?' on':'')+'" data-c="'+x[0]+'"'+(on?' aria-pressed="true" disabled':'')+'>'+T(esc(x[1]),esc(x[2]),1)+(n?'<i>'+n+'</i>':'')+'</button>'}).join('')+'</div>'}
  function after(el,k,a){
    var list=a==='yes'?FELT:stuckFor(k),ids=list.map(function(x){return 'leaf-'+k+'-'+x[0]});if(a==='yes')ids.push('find-'+k+'-yes');
    counts(ids).then(function(c){
      var head;
      if(a==='yes'){var n=Math.max(0,(c['find-'+k+'-yes']||1)-1);
        head='<p class="ff-done">✓ '+(n?T('你和另外 '+n+' 人找到了','Found, with '+n+' others'):T('找到了','Found'))+'</p><p><b>'+T('有什么感觉？','What do you feel?')+'</b></p>';
      }else head='<p><b>'+T('卡在哪？','Stuck where?')+'</b></p>';
      var caught=list.some(function(x){return get('leaf:'+k+':'+x[0])==='1'});
      el.innerHTML=head+chips(k,list,a==='yes'?'ff-felt':'ff-stuck',c)+(a==='no'&&get('leaf:'+k+':where')==='1'?NEARBY(el,k):'')+(caught?INP(a==='yes'):'');
    });
  }
  function ask(el,k){
    el.innerHTML='<div class="ff-q"><b>'+T('找到了吗？','Found it?',1)+'</b> <button type="button" data-a="yes">'+T('✓ 找到了','✓ Yes',1)+'</button> <button type="button" data-a="no">'+T('没找到','Not yet',1)+'</button></div>';
  }
  function mount(el){
    if(el.__ff)return;el.__ff=1;var k=el.getAttribute('data-ff');if(!/^[a-z0-9-]{1,40}$/.test(k))return;css();el.classList.add('ff');
    var a=get('found:'+k);if(a==='yes'||a==='no')after(el,k,a);else ask(el,k);el.hidden=false;
    el.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b||b.disabled)return;
      if(b.hasAttribute('data-a')){var ans=b.getAttribute('data-a');[].forEach.call(el.querySelectorAll('button'),function(x){x.disabled=true});
        tick('find-'+k+'-'+ans).then(function(){put('found:'+k,ans);after(el,k,ans)}).catch(function(){[].forEach.call(el.querySelectorAll('button'),function(x){x.disabled=false})});return}
      if(b.classList.contains('ff-chip')){var c=b.getAttribute('data-c');b.disabled=true;
        tick('leaf-'+k+'-'+c).then(function(x){put('leaf:'+k+':'+c,'1');b.classList.add('on');b.setAttribute('aria-pressed','true');
          var i=b.querySelector('i');if(!i){i=document.createElement('i');b.appendChild(i)}i.textContent=x.count;
          try{el.dispatchEvent(new CustomEvent('ff-caught',{bubbles:true,detail:{k:k,c:c,kind:b.closest('.ff-stuck')?'stuck':'felt'}}))}catch(x){}
          if(c==='where'&&!el.querySelector('.ff-near')){var nb=NEARBY(el,k);if(nb)el.querySelector('.ff-drift').insertAdjacentHTML('afterend',nb)}
          if(!el.querySelector('.ff-in'))el.insertAdjacentHTML('beforeend',INP(!b.closest('.ff-stuck')));
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
