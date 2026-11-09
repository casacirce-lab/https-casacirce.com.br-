(function(){
  function abrir(id){
    var alvo=document.querySelector('[data-painel="'+id+'"]');
    if(!alvo)return;
    document.querySelectorAll('[data-painel]').forEach(function(p){p.hidden=p!==alvo;});
    document.querySelectorAll('[data-case]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-case')===id);});
    return alvo;
  }
  document.querySelectorAll('[data-case]').forEach(function(b){
    b.addEventListener('click',function(){abrir(b.getAttribute('data-case'));});
  });
  if(document.querySelector('[data-painel]')){
    var inicial=location.hash.slice(1);
    var a=abrir(inicial)||abrir('basf');
    if(inicial&&a)a.scrollIntoView({block:'start'});
  }
  var fx=document.querySelector('.fx');
  if(fx)document.querySelectorAll('.fxb').forEach(function(b){
    b.addEventListener('click',function(){
      var i=b.getAttribute('data-fx');
      var cel=window.matchMedia('(max-width:820px)').matches;
      var fechar=cel&&b.classList.contains('on');
      document.querySelectorAll('.fxb').forEach(function(o){var on=o===b&&!fechar;o.classList.toggle('on',on);o.setAttribute('aria-pressed',on?'true':'false');});
      document.querySelectorAll('.fxp').forEach(function(p){p.hidden=fechar||p.getAttribute('data-pfx')!==i;});
      fx.setAttribute('data-at',i);
      if(cel&&!fechar)setTimeout(function(){var y=b.getBoundingClientRect().top;if(y<0||y>window.innerHeight*.6)window.scrollBy({top:y-16,behavior:'smooth'});},20);
    });
  });
})();

(function(){
  var nv=document.querySelector('.nv');
  if(nv){
    document.documentElement.classList.add('js');
    var b=document.createElement('button');
    b.className='mn';b.type='button';b.setAttribute('aria-label','Abrir menu');b.setAttribute('aria-expanded','false');
    b.innerHTML='<span></span><span></span><span></span>';
    nv.appendChild(b);
    function fechar(){nv.classList.remove('ab');document.body.style.overflow='';b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Abrir menu');}
    b.addEventListener('click',function(){
      var aberto=nv.classList.toggle('ab');
      document.body.style.overflow=aberto?'hidden':'';
      b.setAttribute('aria-expanded',aberto?'true':'false');
      b.setAttribute('aria-label',aberto?'Fechar menu':'Abrir menu');
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape')fechar();});
    window.addEventListener('resize',function(){if(window.innerWidth>720)fechar();});
  }
  var r=document.querySelector('.fxr'),l=document.querySelector('.fxl1');
  if(r&&l){
    var cel=window.matchMedia('(max-width:820px)');
    function pos(){
      if(cel.matches){var a=l.querySelector('.fxb.on');if(a)a.after(r);}
      else if(r.parentNode===l){l.after(r);}
    }
    pos();
    l.addEventListener('click',function(){setTimeout(pos,0);});
    cel.addEventListener('change',pos);
  }
})();

(function(){
  var r=document.querySelector('.vr'),l=document.querySelector('.vl');
  if(!r||!l)return;
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){r.classList.add('vis');o.disconnect();}});},{threshold:.25}).observe(r);
  }else{r.classList.add('vis');}
  var bs=[].slice.call(l.querySelectorAll('.vb'));
  function centrar(b){if(l.scrollWidth>l.clientWidth)l.scrollTo({left:b.offsetLeft-(l.clientWidth-b.offsetWidth)/2,behavior:'smooth'});}
  bs.forEach(function(b){b.addEventListener('click',function(){centrar(b);});});
  var x0=null,y0=null;
  r.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY;},{passive:true});
  r.addEventListener('touchend',function(e){
    if(x0===null)return;
    var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;
    if(Math.abs(dx)<50||Math.abs(dx)<Math.abs(dy)*1.5)return;
    var i=bs.indexOf(l.querySelector('.vb.on'));
    var n=bs[(i+(dx<0?1:-1)+bs.length)%bs.length];
    n.click();
  },{passive:true});
})();

/* movimento feito aqui, para rodar igual em qualquer aparelho */
(function(){
  var quadros=[];
  function laco(t){quadros.forEach(function(q){q(t);});requestAnimationFrame(laco);}
  document.documentElement.classList.add('js-mq');
  document.querySelectorAll('.mqt').forEach(function(tr){
    var pos=0,ant=0,parado=false,m=tr.parentNode;
    if(window.matchMedia('(hover:hover)').matches){
      m.addEventListener('mouseenter',function(){parado=true;});
      m.addEventListener('mouseleave',function(){parado=false;});
    }
    quadros.push(function(t){
      var dt=Math.min(t-ant,100);ant=t;
      var meio=tr.scrollWidth/2;
      if(!meio||parado)return;
      pos=(pos+meio/48000*dt)%meio;
      tr.style.transform='translate3d('+(-pos)+'px,0,0)';
    });
  });
  document.querySelectorAll('.pulso,.orb').forEach(function(c){
    var am=c.querySelector('animateMotion');
    if(!am)return;
    var d=am.getAttribute('path')||(am.querySelector('mpath')&&document.querySelector(am.querySelector('mpath').getAttribute('href')).getAttribute('d'));
    if(!d)return;
    var p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);
    var dur=parseFloat(am.getAttribute('dur'))*1000,ini=parseFloat(am.getAttribute('begin')||0)*1000,tam=p.getTotalLength();
    c.removeChild(am);
    quadros.push(function(t){
      var e=(t-ini)/dur;
      if(e<0){c.setAttribute('opacity','0');return;}
      c.removeAttribute('opacity');
      var q=p.getPointAtLength((e%1)*tam);
      c.setAttribute('transform','translate('+q.x+' '+q.y+')');
    });
  });
  var vs=document.querySelector('.vs'),vr=[].slice.call(document.querySelectorAll('.vir'));
  var fw=document.querySelector('.fw'),fi=[].slice.call(document.querySelectorAll('.fi'));
  var sol=document.querySelector('.vsol');
  var ns='http://www.w3.org/2000/svg',svg,base,linha,ponta,tam=0;
  function tracar(){
    if(!fw)return;
    var w=fw.offsetWidth,h=fw.offsetHeight,b=fw.getBoundingClientRect(),pts=fi.map(function(i){
      var n=i.querySelector('.fn').getBoundingClientRect();
      return [n.left-b.left+n.width/2,n.top-b.top+n.height/2,i.getBoundingClientRect().bottom-b.top+12];
    });
    if(!pts.length)return;
    var d='M'+pts[0][0]+' '+(-60);
    var ant=[pts[0][0],-60];
    pts.concat([[pts[pts.length-1][0],h+96]]).forEach(function(q){
      var ini=ant[2]||ant[1],dy=(q[1]-ini)*.55;
      if(ant[2])d+=' L'+ant[0]+' '+ini;
      d+=' C'+ant[0]+' '+(ini+dy)+' '+q[0]+' '+(q[1]-dy)+' '+q[0]+' '+q[1];
      ant=q;
    });
    svg.setAttribute('viewBox','0 0 '+w+' '+h);
    base.setAttribute('d',d);linha.setAttribute('d',d);
    tam=linha.getTotalLength();
    linha.style.strokeDasharray=tam+' '+tam;
  }
  if(fw){
    svg=document.createElementNS(ns,'svg');svg.setAttribute('class','fsv');svg.setAttribute('aria-hidden','true');
    base=document.createElementNS(ns,'path');linha=document.createElementNS(ns,'path');ponta=document.createElementNS(ns,'circle');
    base.setAttribute('fill','none');base.setAttribute('stroke','rgba(250,249,246,.14)');base.setAttribute('stroke-width','2');
    linha.setAttribute('fill','none');linha.setAttribute('stroke','#E9A44C');linha.setAttribute('stroke-width','5');linha.setAttribute('stroke-linecap','round');
    ponta.setAttribute('r','9');ponta.setAttribute('fill','#E9A44C');
    svg.appendChild(base);svg.appendChild(linha);svg.appendChild(ponta);
    fw.insertBefore(svg,fw.firstChild);
    tracar();
    window.addEventListener('resize',tracar);
    window.addEventListener('load',tracar);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(tracar);
  }
  var ult=-1;
  quadros.push(function(){
    var vh=window.innerHeight,y=window.pageYOffset;
    if(y===ult)return;ult=y;
    vr.forEach(function(v){if(v.getBoundingClientRect().top<vh*.72)v.classList.add('on');});
    if(vs&&sol){
      var r=vs.getBoundingClientRect(),e=Math.max(0,Math.min(1,(vh-r.top)/(vh+r.height)));
      sol.style.setProperty('--e',(.72+e*.42).toFixed(3));
    }
    if(fw&&tam){
      var b=fw.getBoundingClientRect(),pr=Math.max(0,Math.min(1,(vh*.62-b.top+60)/(b.height+156)));
      var l=pr*tam;
      linha.style.strokeDashoffset=tam-l;
      var q=linha.getPointAtLength(l);
      ponta.setAttribute('cx',q.x);ponta.setAttribute('cy',q.y);
      ponta.style.opacity=pr>0?1:0;
      fi.forEach(function(i){if(i.getBoundingClientRect().top<vh*.68)i.classList.add('on');});
    }
  });
  requestAnimationFrame(laco);
})();
