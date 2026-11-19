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
// 「找到了吗」：用手找的那几句话，读的人真的找到了吗。只记次数；每个浏览器每个穴位记一次。
(function(){
  var API=document.documentElement.getAttribute('data-ticks');if(!API)return;
  var boxes=[].slice.call(document.querySelectorAll('[data-found]'));if(!boxes.length)return;
  function seen(k){try{return localStorage.getItem('found:'+k)}catch(e){return null}}
  function keep(k,a){try{localStorage.setItem('found:'+k,a)}catch(e){}}
  var THANKS={yes:'谢谢。· Thank you.',no:'谢谢告诉我们。没找到的人多，这几句话就会再改。· Thank you. If many people can\'t find it, these words will be rewritten.'};
  boxes.forEach(function(b){var k=b.getAttribute('data-found'),n=b.querySelector('.n'),bs=[].slice.call(b.querySelectorAll('button'));
    var done=function(a){bs.forEach(function(x){x.disabled=true});n.textContent=THANKS[a]||''};
    if(seen(k))done(seen(k));
    bs.forEach(function(x){x.addEventListener('click',function(){var a=x.getAttribute('data-a');if(seen(k))return;bs.forEach(function(y){y.disabled=true});
      fetch(API+'/tick',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:'find-'+k+'-'+a})})
      .then(function(r){if(!r.ok)throw 0;keep(k,a);done(a)})
      .catch(function(){bs.forEach(function(y){y.disabled=false});n.textContent='没记上，再点一次 · Try again'})})});
    b.hidden=false});
})();
