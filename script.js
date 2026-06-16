/* Muhammad Umair Amjad — Portfolio | Scripts */
(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  var eqBars = [];
  var analyser = null, freqData = null;

  document.addEventListener("DOMContentLoaded", init);

  function init(){
    setupNav(); setupMobileMenu(); setupReveals(); setupCardAnims();
    setupCounters(); setupRoleTyping(); setupPortalSparks();
    setupEduProgress();
    buildEq(); startViz();
    setupSound(); setupEnterGate(); setupResume();
    if(finePointer && !reduce){ setupCursor(); setupTilt(); }
    if(window.gsap) setupGsap();
  }

  function setupNav(){
    var shell = document.getElementById("navShell");
    function onScroll(){ shell.classList.toggle("scrolled", window.scrollY > 30); }
    onScroll(); window.addEventListener("scroll", onScroll, {passive:true});
  }
  function setupMobileMenu(){
    var menu = document.getElementById("mobileMenu");
    var open = document.getElementById("menuBtn");
    var close = document.getElementById("closeMenu");
    if(!menu) return;
    if(open) open.addEventListener("click", function(){ menu.classList.add("open"); });
    if(close) close.addEventListener("click", function(){ menu.classList.remove("open"); });
    var links = menu.querySelectorAll("[data-mclose]");
    for(var i=0;i<links.length;i++){ links[i].addEventListener("click", function(){ menu.classList.remove("open"); }); }
  }
  function setupRoleTyping(){
    var el = document.getElementById("roleText");
    if(!el || reduce) return;
    var roles = ["full_stack_developer","ai_engineer","problem_solver","cyber_security"];
    var cur = '<span class="cur">&nbsp;</span>';
    var r=0,i=0,deleting=false;
    function tick(){
      var word = roles[r];
      i += deleting ? -1 : 1;
      el.innerHTML = "&lt; " + word.slice(0,i) + " /&gt;" + cur;
      var delay = deleting ? 45 : 90;
      if(!deleting && i===word.length){ deleting=true; delay=1400; }
      else if(deleting && i===0){ deleting=false; r=(r+1)%roles.length; delay=350; }
      setTimeout(tick, delay);
    }
    setTimeout(tick, 900);
  }
  function setupReveals(){
    var els = document.querySelectorAll(".reveal");
    if(!("IntersectionObserver" in window) || reduce) return;
    document.documentElement.classList.add("gsap-on");
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var el = e.target;
          el.style.transition = "opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)";
          el.style.opacity = "1"; el.style.transform = "none";
          io.unobserve(el);
        }
      });
    }, {threshold:.12, rootMargin:"0px 0px -60px 0px"});
    els.forEach(function(el,idx){
      // directional timeline nodes get their own stagger via transitionDelay only
      if(!el.classList.contains("tnode-left") && !el.classList.contains("tnode-right")){
        el.style.transitionDelay = (idx % 4 * 0.06) + "s";
      }
      io.observe(el);
    });
  }
  function setupCounters(){
    var nums = document.querySelectorAll("[data-count]");
    if(!("IntersectionObserver" in window)){ return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ run(e.target); io.unobserve(e.target);} });
    }, {threshold:.5});
    nums.forEach(function(n){ io.observe(n); });
    function run(el){
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || "";
      var isFloat = !Number.isInteger(target);
      var dur = 1500, start = performance.now();
      function step(now){
        var p = Math.min((now-start)/dur, 1);
        var eased = 1 - Math.pow(1-p, 3);
        var val = target * eased;
        el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if(p<1) requestAnimationFrame(step);
        else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
      }
      requestAnimationFrame(step);
    }
  }
  function setupEduProgress(){
    var bars = document.querySelectorAll(".edu-prog .bar[data-w]");
    if(!bars.length) return;
    if(!("IntersectionObserver" in window) || reduce){
      for(var i=0;i<bars.length;i++){ bars[i].style.width = bars[i].getAttribute("data-w") + "%"; }
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ var b=e.target; b.style.width = b.getAttribute("data-w") + "%"; io.unobserve(b); } });
    }, {threshold:.4});
    for(var j=0;j<bars.length;j++){ io.observe(bars[j]); }
  }
  function setupPortalSparks(){
    var portal = document.getElementById("portal");
    if(!portal || reduce) return;
    var colors = ["#22d3ee","#a78bfa","#e056fd","#ffffff"];
    for(var i=0;i<12;i++){
      var s = document.createElement("div");
      s.className = "spark";
      s.style.left = (20 + Math.random()*60) + "%";
      s.style.bottom = (20 + Math.random()*30) + "%";
      s.style.background = colors[i % colors.length];
      s.style.boxShadow = "0 0 8px 2px " + colors[i % colors.length];
      s.style.animationDuration = (3 + Math.random()*4) + "s";
      s.style.animationDelay = (-Math.random()*6) + "s";
      portal.appendChild(s);
    }
  }
  function buildEq(){
    var eq = document.getElementById("eq");
    if(!eq) return;
    for(var i=0;i<16;i++){ var b=document.createElement("div"); b.className="b"; eq.appendChild(b); eqBars.push(b); }
  }
  function startViz(){
    function loop(now){
      var energy = 0, hasData = false;
      if(analyser && freqData){
        analyser.getByteFrequencyData(freqData);
        for(var e=2;e<34;e++){ energy += freqData[e]; }
        hasData = true;
      }
      if(hasData && energy > 30){
        for(var i=0;i<eqBars.length;i++){
          var bin = 2 + i*2;
          var v = freqData[bin] / 255;
          eqBars[i].style.height = (12 + Math.pow(v,0.85)*86) + "%";
        }
      } else if(reduce){
        for(var j=0;j<eqBars.length;j++){ eqBars[j].style.height = (22 + (j%4)*10) + "%"; }
      } else {
        for(var k=0;k<eqBars.length;k++){
          eqBars[k].style.height = (16 + 20*(0.5+0.5*Math.sin(now/640 + k*0.5))).toFixed(1) + "%";
        }
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function setupCursor(){
    var arrow = document.querySelector(".cursor-arrow");
    var canvas = document.querySelector(".cursor-canvas");
    if(!arrow || !canvas) return;
    document.documentElement.classList.add("cursor-custom");
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W, H;
    function resize(){ W = canvas.width = Math.floor(innerWidth*dpr); H = canvas.height = Math.floor(innerHeight*dpr); canvas.style.width = innerWidth+"px"; canvas.style.height = innerHeight+"px"; }
    resize(); window.addEventListener("resize", resize);
    var palette = ["#22d3ee","#a78bfa","#e056fd","#8b5cf6","#ffffff"];
    var sprites = palette.map(function(col){
      var c = document.createElement("canvas"); c.width = c.height = 20;
      var x = c.getContext("2d");
      var g = x.createRadialGradient(10,10,0,10,10,10);
      g.addColorStop(0, col); g.addColorStop(0.35, col); g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.beginPath(); x.arc(10,10,10,0,Math.PI*2); x.fill();
      return c;
    });
    var mx = innerWidth/2, my = innerHeight/2, lastX = mx, lastY = my;
    var ps = [];
    document.addEventListener("mousemove", function(e){
      mx = e.clientX; my = e.clientY; arrow.style.opacity = "1";
      var dx = mx-lastX, dy = my-lastY, speed = Math.sqrt(dx*dx + dy*dy);
      var count = speed > 2 ? Math.min(2, (speed/18)|0) + 1 : 0;
      for(var i=0;i<count;i++){
        ps.push({ x: mx*dpr+(Math.random()-.5)*8*dpr, y: my*dpr+(Math.random()-.5)*8*dpr,
          vx:(Math.random()-.5)*0.5*dpr, vy:((Math.random()-.5)*0.5-0.2)*dpr,
          life:1, decay:0.035+Math.random()*0.03, size:(Math.random()*2.2+1.6)*dpr,
          sp: sprites[(Math.random()*sprites.length)|0] });
      }
      if(ps.length > 90) ps.splice(0, ps.length-90);
      lastX = mx; lastY = my;
    });
    document.addEventListener("mouseleave", function(){ arrow.style.opacity = "0"; });
    var hov = document.querySelectorAll("a, button, [data-magnetic], .card, .proj, .tile, .edu-card");
    for(var h=0; h<hov.length; h++){
      hov[h].addEventListener("mouseenter", function(){ arrow.classList.add("hover"); });
      hov[h].addEventListener("mouseleave", function(){ arrow.classList.remove("hover"); });
    }
    function loop(){
      arrow.style.transform = "translate(" + (mx-4) + "px," + (my-3) + "px)";
      ctx.clearRect(0,0,W,H);
      ctx.globalCompositeOperation = "lighter";
      for(var i=ps.length-1;i>=0;i--){
        var p = ps[i]; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if(p.life <= 0){ ps.splice(i,1); continue; }
        var s = p.size * p.life * 2.4;
        ctx.globalAlpha = p.life * 0.9;
        ctx.drawImage(p.sp, p.x - s/2, p.y - s/2, s, s);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---- audio: custom MP3 (ambient.mp3), starts on first interaction, smooth fades, piano fallback ---- */
  var AUDIO_SRC = "ambient.mp3";
  var audioCtx=null, master=null, mediaGain=null, audioEl=null;
  var mediaConnected=false, usingPiano=false, schedTimer=null, pianoWave=null;
  var soundBtn=null, soundOn=false, gestureArmed=false, gestureHandler=null;
  var MEDIA_VOL=0.5;
  var gestureEvents=["pointerdown","keydown","touchstart","scroll","mousemove"];
  var CHORDS=[ [261.63,329.63,392.00,523.25],[392.00,493.88,587.33,783.99],[440.00,523.25,659.25,880.00],[349.23,440.00,523.25,698.46] ];
  var ci=0, si=0;

  function setupSound(){
    soundBtn=document.getElementById("soundToggle");
    if(!soundBtn) return;
    soundBtn.addEventListener("click", function(){ if(soundOn) stopSound(); else startSound(); });
    setBtnState(true);   // shows as "on"; music actually begins when the visitor clicks Enter
  }
  function setupEnterGate(){
    var gate=document.getElementById("bootGate");
    if(!gate) return;
    var docEl=document.documentElement;
    docEl.classList.add("gate-open");
    var done=false;
    function openCurtains(){
      if(done) return; done=true;
      gate.classList.add("opening");
      docEl.classList.remove("gate-open");
      setTimeout(function(){ gate.style.display="none"; }, 1050);
      startSound();
    }
    var b=document.getElementById("gateEnter");
    if(b) b.addEventListener("click", openCurtains);
  }
  function setupResume(){
    var modal=document.getElementById("resumeModal");
    var openBtn=document.getElementById("openResume");
    if(!modal||!openBtn) return;
    var closeBtn=document.getElementById("rmClose");
    var docEl=document.documentElement;
    function openM(){ modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); docEl.classList.add("modal-open"); }
    function closeM(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); docEl.classList.remove("modal-open"); }
    openBtn.addEventListener("click", openM);
    if(closeBtn) closeBtn.addEventListener("click", closeM);
    modal.addEventListener("click", function(e){ if(e.target.hasAttribute("data-rm-close")) closeM(); });
    document.addEventListener("keydown", function(e){ if(e.key==="Escape" && modal.classList.contains("open")) closeM(); });
  }
  function setupCardAnims(){
    var els=document.querySelectorAll(".anim");
    if(!els.length) return;
    if(!("IntersectionObserver" in window) || reduce){
      for(var i=0;i<els.length;i++){ els[i].classList.add("in"); }
      return;
    }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("in"); }
        else { e.target.classList.remove("in"); e.target.style.transform=""; }
      });
    }, {threshold:.16, rootMargin:"0px 0px -7% 0px"});
    for(var j=0;j<els.length;j++){ io.observe(els[j]); }
  }
  var TILT_BASE="opacity .7s ease, filter .7s ease, translate .8s cubic-bezier(.22,1,.36,1), scale .8s cubic-bezier(.22,1,.36,1)";
  function setupTilt(){
    var cards=document.querySelectorAll(".card, .proj, .edu-card");
    for(var i=0;i<cards.length;i++){ bindTilt(cards[i]); }
  }
  function bindTilt(card){
    card.addEventListener("mouseenter", function(){ card.style.transition=TILT_BASE+", transform .07s linear"; });
    card.addEventListener("mousemove", function(e){
      var r=card.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
      var rx=(py-0.5)*-9, ry=(px-0.5)*11;
      card.style.transform="perspective(900px) rotateX("+rx.toFixed(2)+"deg) rotateY("+ry.toFixed(2)+"deg) translateY(-6px)";
      card.style.setProperty("--mx",(px*100).toFixed(1)+"%");
      card.style.setProperty("--my",(py*100).toFixed(1)+"%");
    });
    card.addEventListener("mouseleave", function(){
      card.style.transition=TILT_BASE+", transform .5s cubic-bezier(.22,1,.36,1)";
      card.style.transform="";
    });
  }
  function setBtnState(on){
    soundOn=on;
    if(!soundBtn) return;
    soundBtn.classList.toggle("on", on);
    soundBtn.setAttribute("aria-pressed", on?"true":"false");
  }
  function ensureCtx(){
    if(audioCtx) return true;
    try{
      var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return false;
      audioCtx=new AC();
      master=audioCtx.createGain(); master.gain.value=0.0;
      analyser=audioCtx.createAnalyser(); analyser.fftSize=512; analyser.smoothingTimeConstant=0.85;
      freqData=new Uint8Array(analyser.frequencyBinCount);
      master.connect(analyser); analyser.connect(audioCtx.destination);
      var harm=[0,1,0.62,0.34,0.20,0.12,0.08,0.05,0.035,0.025];
      var real=new Float32Array(harm.length), imag=new Float32Array(harm.length);
      for(var i=0;i<harm.length;i++){ imag[i]=harm[i]; }
      pianoWave=audioCtx.createPeriodicWave(real, imag);
      return true;
    }catch(e){ return false; }
  }
  function ensureMedia(){
    /* createMediaElementSource must only be called once per element */
    if(mediaConnected) return true;
    if(!audioEl){
      audioEl=new Audio(AUDIO_SRC);
      audioEl.loop=true; audioEl.preload="auto";
      audioEl.addEventListener("error", function(){
        if(soundOn && !usingPiano && audioCtx && audioCtx.state==="running") startPiano();
      });
    }
    try{
      var msrc=audioCtx.createMediaElementSource(audioEl);
      mediaGain=audioCtx.createGain(); mediaGain.gain.value=0.0;
      msrc.connect(mediaGain); mediaGain.connect(analyser);
      mediaConnected=true;
      return true;
    }catch(e){ return false; }
  }
  function startSound(){
    setBtnState(true);
    if(!ensureCtx()) return;
    if(audioCtx.state==="suspended"){
      audioCtx.resume().then(doPlay, doPlay);
    } else {
      doPlay();
    }
  }
  function doPlay(){
    if(!soundOn) return;
    if(!ensureMedia()) return;
    var pr=audioEl.play();
    if(pr && pr.then){
      pr.then(function(){ usingPiano=false; fadeMediaIn(); disarmGesture(); })
        .catch(function(){ armGesture(); });
    } else { fadeMediaIn(); disarmGesture(); }
  }
  function fadeMediaIn(){
    if(!mediaGain||!audioCtx) return;
    var t=audioCtx.currentTime;
    mediaGain.gain.cancelScheduledValues(t);
    mediaGain.gain.setValueAtTime(Math.max(mediaGain.gain.value,0.0001), t);
    mediaGain.gain.linearRampToValueAtTime(MEDIA_VOL, t+1.4);
  }
  function armGesture(){
    if(gestureArmed) return; gestureArmed=true;
    gestureHandler=function(){
      disarmGesture();
      if(!soundOn) return;
      if(audioCtx && audioCtx.state==="suspended"){
        audioCtx.resume().then(doPlay, doPlay);
      } else { doPlay(); }
    };
    for(var i=0;i<gestureEvents.length;i++){ window.addEventListener(gestureEvents[i], gestureHandler, {passive:true}); }
  }
  function disarmGesture(){
    if(!gestureArmed) return; gestureArmed=false;
    if(gestureHandler){ for(var i=0;i<gestureEvents.length;i++){ window.removeEventListener(gestureEvents[i], gestureHandler, {passive:true}); } gestureHandler=null; }
  }
  function startPiano(){
    if(usingPiano || !audioCtx) return;
    usingPiano=true;
    try{ if(audioEl) audioEl.pause(); }catch(e){}
    ci=0; si=0;
    var t=audioCtx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(Math.max(master.gain.value,0.0001), t);
    master.gain.linearRampToValueAtTime(0.17, t+1.0);
    scheduleNotes();
  }
  function createPiano(freq,t,dur,vol){
    if(!audioCtx || audioCtx.state!=="running") return;
    var o=audioCtx.createOscillator(); o.setPeriodicWave(pianoWave); o.frequency.value=freq;
    var o2=audioCtx.createOscillator(); o2.setPeriodicWave(pianoWave); o2.frequency.value=freq; o2.detune.value=6;
    var lp=audioCtx.createBiquadFilter(); lp.type="lowpass";
    lp.frequency.setValueAtTime(5200, t); lp.frequency.exponentialRampToValueAtTime(900, t+dur);
    var g=audioCtx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t+0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
    o.connect(g); o2.connect(g); g.connect(lp); lp.connect(master);
    o.start(t); o2.start(t); o.stop(t+dur+0.1); o2.stop(t+dur+0.1);
  }
  function scheduleNotes(){
    if(!soundOn || !usingPiano || !audioCtx) return;
    var t=audioCtx.currentTime;
    var ch=CHORDS[ci];
    createPiano(ch[si % ch.length], t, 2.6, 0.5);
    if(si===0){ createPiano(ch[0]/2, t, 3.2, 0.34); }
    if(Math.random()<0.3){ createPiano(ch[(si+2) % ch.length], t+0.18, 2.2, 0.26); }
    si++;
    if(si>=4){ si=0; ci=(ci+1)%CHORDS.length; }
    schedTimer=setTimeout(scheduleNotes, 1200 + Math.random()*350);
  }
  function stopSound(){
    setBtnState(false);
    disarmGesture();
    if(schedTimer){ clearTimeout(schedTimer); schedTimer=null; }
    if(!audioCtx) return;
    var t=audioCtx.currentTime;
    /* fade out MP3 */
    if(mediaGain){
      mediaGain.gain.cancelScheduledValues(t);
      mediaGain.gain.setValueAtTime(mediaGain.gain.value, t);
      mediaGain.gain.linearRampToValueAtTime(0.0001, t+0.8);
      setTimeout(function(){ if(!soundOn && audioEl){ try{ audioEl.pause(); }catch(e){} } }, 850);
    } else if(audioEl){ try{ audioEl.pause(); }catch(e){} }
    /* fade out piano master */
    if(master){
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0.0001, t+0.6);
    }
    usingPiano=false;
  }

  function setupGsap(){
    if(reduce) return;
    try{
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".hero-head > *, .hero-body > *", {y:30, opacity:0, duration:.9, stagger:.1, ease:"power3.out", delay:.15});
      gsap.from(".portal", {scale:.85, opacity:0, duration:1.1, ease:"power3.out", delay:.3});
      gsap.to(".portal", {yPercent:-14, ease:"none", scrollTrigger:{trigger:"#top", start:"top top", end:"bottom top", scrub:true}});
      gsap.to(".blob.b1", {y:120, ease:"none", scrollTrigger:{trigger:"body", start:"top top", end:"bottom bottom", scrub:true}});
      gsap.to(".blob.b3", {y:-120, ease:"none", scrollTrigger:{trigger:"body", start:"top top", end:"bottom bottom", scrub:true}});
    }catch(err){}
  }
})();
