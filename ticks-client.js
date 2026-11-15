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
