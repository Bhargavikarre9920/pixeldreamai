import { useEffect, useRef } from "react";
import * as T from "three";

/**
 * Hero artwork: small pixels swirl together into the PixelDreamAi logo, a neon ring draws around
 * the mark, then the logo dissolves and the loop restarts. The panel tilts with the mouse.
 */
export default function PixelLogo() {
  const host = useRef(null), stage = useRef(null), cv = useRef(null), fallback = useRef(null), gl = useRef(null);

  useEffect(() => {
    const h = host.current, c = cv.current, ctx = c.getContext("2d");
    const im = new Image();
    im.src = "/assets/pixeldreamai-logo-full.png";
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0, P = [], S = [], ready = false, vis = true, raf = 0, T0 = performance.now();
    const ring = { cx: 0, cy: 0, r: 0 };
    let lg = { x: 0, y: 0, w: 0, h: 0 };
    const rnd = (a, b) => a + Math.random() * (b - a);
    const ease = (t) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
    const LOOP = 13;

    const fail = () => { c.hidden = true; if (fallback.current) fallback.current.hidden = false; };

    function layout() {
      const iw = im.naturalWidth, ih = im.naturalHeight;
      let w = Math.min(W * 0.72, H * 0.66 * iw / ih), hh = w * ih / iw;
      lg = { x: (W - w) / 2, y: (H - hh) / 2 - H * 0.09, w, h: hh };
      const o = document.createElement("canvas"), step = Math.max(3, Math.round(w / 150));
      o.width = Math.round(w); o.height = Math.round(hh);
      const ox = o.getContext("2d");
      ox.drawImage(im, 0, 0, o.width, o.height);
      let d;
      try { d = ox.getImageData(0, 0, o.width, o.height).data; } catch { return fail(); }
      let T = [];
      for (let y = 0; y < o.height; y += step)
        for (let x = 0; x < o.width; x += step) {
          const k = (y * o.width + x) * 4;
          if (d[k + 3] > 110) T.push([lg.x + x, lg.y + y, d[k], d[k + 1], d[k + 2], step]);
        }
      if (T.length > 2600) { const f = T.length / 2600; T = T.filter((_, i) => i % f < 1); }
      P = T.map((t) => {
        const a = Math.random() * 6.283, rr = Math.max(W, H) * rnd(0.35, 0.8);
        return { tx: t[0], ty: t[1], c: `rgb(${t[2]},${t[3]},${t[4]})`, sz: t[5] * rnd(0.8, 1.05),
          sx: W / 2 + Math.cos(a) * rr, sy: H / 2 + Math.sin(a) * rr * 0.9, dl: Math.random() * 0.32, sp: rnd(0.7, 1.5), ph: Math.random() * 6.28, px: 0, py: 0 };
      });
      S = Array.from({ length: 110 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: rnd(1.5, 4), vx: rnd(-0.12, 0.12), vy: rnd(-0.2, -0.04), ph: Math.random() * 6.28, hue: Math.random() < 0.5 ? "122,190,255" : "170,130,255" }));
      let mx0 = 1e9, mx1 = -1, my0 = 1e9, my1 = -1;
      const lim = o.height * 0.64;
      for (let yy = 0; yy < lim; yy += 2)
        for (let xx = 0; xx < o.width; xx += 2)
          if (d[(yy * o.width + xx) * 4 + 3] > 110) { mx0 = Math.min(mx0, xx); mx1 = Math.max(mx1, xx); my0 = Math.min(my0, yy); my1 = Math.max(my1, yy); }
      ring.cx = lg.x + (mx0 + mx1) / 2; ring.cy = lg.y + (my0 + my1) / 2; ring.r = Math.max(mx1 - mx0, my1 - my0) * 0.62;
    }
    function size() {
      const r = h.getBoundingClientRect();
      W = Math.max(200, r.width); H = Math.max(200, r.height);
      c.width = W * DPR; c.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (ready) layout();
    }
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!ready || !vis || document.hidden) return;
      const t = ((now - T0) / 1000) % LOOP;
      ctx.clearRect(0, 0, W, H);
      for (const s of S) {
        s.x += s.vx; s.y += s.vy;
        if (s.y < -6) s.y = H + 6; if (s.x < -6) s.x = W + 6; if (s.x > W + 6) s.x = -6;
        ctx.fillStyle = `rgba(${s.hue},${0.35 + 0.35 * Math.sin(now / 700 + s.ph)})`;
        ctx.fillRect(s.x, s.y, s.s, s.s);
      }
      // 0-1.5 scatter, 1.5-5.5 swirl in, 5.5-11.5 hold, 11.5-13 dissolve
      const gather = t < 1.5 ? 0 : t < 5.5 ? ease((t - 1.5) / 4) : t < 11.5 ? 1 : 1 - ease((t - 11.5) / 1.5);
      const cx = W / 2, cy = H / 2;
      for (const p of P) {
        let e = ease(gather * 1.32 - p.dl); e = Math.min(1, Math.max(0, e));
        const ox = p.sx - cx, oy = p.sy - cy, tx = p.tx - cx, ty = p.ty - cy;
        const rx = ox + (tx - ox) * e, ry = oy + (ty - oy) * e;
        const ang = (1 - e) * (2.6 + p.sp) * (t < 11 ? 1 : -1), ca = Math.cos(ang), sa = Math.sin(ang);
        let x = cx + rx * ca - ry * sa, y = cy + rx * sa + ry * ca;
        if (e < 0.02) { x += Math.sin(now / 1500 + p.ph) * 10; y += Math.cos(now / 1300 + p.ph) * 10; }
        if (e > 0.05 && e < 0.95) {
          ctx.strokeStyle = p.c; ctx.globalAlpha = 0.16 * (1 - e); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.px || x, p.py || y); ctx.lineTo(x, y); ctx.stroke();
        }
        p.px = x; p.py = y;
        ctx.globalAlpha = 0.55 + 0.45 * e; ctx.fillStyle = p.c;
        const z = p.sz * (e < 1 ? 1 + 0.5 * (1 - e) : 1);
        ctx.fillRect(x, y, z, z);
      }
      ctx.globalAlpha = 1;
      const la = t >= 5.2 && t < 11 ? ease((t - 5.2) / 1.6) : t >= 11 ? 1 - ease(t - 11) : 0;
      if (la > 0) {
        const gl = t > 5.6 && t < 7.2 ? Math.sin((t - 5.6) * 40) * 6 * (1 - (t - 5.6) / 1.6) : 0;
        if (gl) {
          ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.55 * la;
          ctx.drawImage(im, lg.x - gl, lg.y, lg.w, lg.h); ctx.drawImage(im, lg.x + gl, lg.y + gl * 0.3, lg.w, lg.h);
          ctx.globalCompositeOperation = "source-over";
        }
        ctx.globalAlpha = la; ctx.shadowColor = "rgba(120,110,255,.8)"; ctx.shadowBlur = 26 * la;
        ctx.drawImage(im, lg.x, lg.y, lg.w, lg.h); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }
      const ra = t >= 6 && t < 11.5 ? ease((t - 6) / 1.6) : t >= 11.5 ? 1 - ease(t - 11.5) : 0;
      if (ra > 0) {
        const g = ctx.createLinearGradient(ring.cx - ring.r, ring.cy, ring.cx + ring.r, ring.cy);
        g.addColorStop(0, "#4cc9ff"); g.addColorStop(0.5, "#8a6bff"); g.addColorStop(1, "#ff5fd2");
        ctx.save(); ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.shadowColor = "#8a6bff"; ctx.shadowBlur = 18;
        ctx.globalAlpha = Math.min(1, ra * 1.2) * (t > 9.5 && t < 11 ? 0.55 : 1);
        const st = -1.57 + now / 1600, en = st + 6.283 * ra;
        ctx.beginPath(); ctx.arc(ring.cx, ring.cy, ring.r * (1.02 + 0.02 * Math.sin(now / 600)), st, en); ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ring.cx + Math.cos(en) * ring.r, ring.cy + Math.sin(en) * ring.r, 3.5, 0, 6.283); ctx.fill();
        ctx.restore();
      }
    }

    im.onload = () => { ready = true; size(); raf = requestAnimationFrame(frame); };
    im.onerror = fail;
    const restart = () => (T0 = performance.now());
    if (window.__pdaiGo) restart(); else window.addEventListener("pdai-go", restart);
    const onResize = () => size();
    window.addEventListener("resize", onResize);
    const io = "IntersectionObserver" in window ? new IntersectionObserver((e) => (vis = e[0].isIntersecting)) : null;
    io?.observe(h);

    // mouse tilt
    let mx = 0, my = 0, hov = false, tr = 0;
    const move = (e) => { const r = h.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5; hov = true; };
    const leave = () => (hov = false);
    h.addEventListener("pointermove", move); h.addEventListener("pointerleave", leave);
    const tilt = (n) => {
      const a = hov ? mx * 14 : Math.sin(n / 2600) * 7, b = hov ? -my * 10 : Math.cos(n / 3100) * 4;
      stage.current?.style.setProperty("--ry", a.toFixed(2) + "deg");
      stage.current?.style.setProperty("--rx", (b + 4).toFixed(2) + "deg");
      tr = requestAnimationFrame(tilt);
    };
    tr = requestAnimationFrame(tilt);

    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(tr);
      window.removeEventListener("pdai-go", restart); window.removeEventListener("resize", onResize);
      h.removeEventListener("pointermove", move); h.removeEventListener("pointerleave", leave); io?.disconnect();
    };
  }, []);

  // 3D version: the logo built from thousands of lit 3D cubes (three.js). Cubes fly in, settle into the
  // logo, shove away from the cursor, and scatter on click. If WebGL is unavailable the 2D canvas above stays.
  useEffect(() => {
    const hostEl = host.current, glEl = gl.current;
    if (!hostEl || !glEl) return;
    let R;
    try { R = new T.WebGLRenderer({ canvas: glEl, antialias: true, alpha: true }); } catch { return; }
    R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    R.setClearColor(0x000000, 0);
    const cleanups = [];
    let alive = true, raf = 0;
    const img = new Image();
    img.onload = () => { if (alive) { try { build(img); } catch (err) { console.warn("3D hero unavailable", err); } } };
    img.src = "/assets/pixeldreamai-mark.png";
    function build(img){
  const COLS=90,ROWS=Math.round(COLS*img.height/img.width),S=.1;
  const cc=document.createElement('canvas');cc.width=COLS;cc.height=ROWS;const cx=cc.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0,COLS,ROWS);
  const px=cx.getImageData(0,0,COLS,ROWS).data,cells=[];
  for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const k=(j*COLS+i)*4;if(px[k+3]>120)cells.push([(i-COLS/2+.5)*S,-(j-ROWS/2+.5)*S,px[k]/255,px[k+1]/255,px[k+2]/255])}
  const N=cells.length;if(!N)return;
  const sc=new T.Scene(),cam=new T.PerspectiveCamera(30,1,.1,100),grp=new T.Group();sc.add(grp);
  const mesh=new T.InstancedMesh(new T.BoxGeometry(S*.88,S*.88,S*.88),new T.MeshStandardMaterial({roughness:.4,metalness:.2}),N);
  mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;grp.add(mesh);
  const col=new T.Color(),M=mesh.instanceMatrix.array;
  const hx=new Float32Array(N),hy=new Float32Array(N),hz=new Float32Array(N),X=new Float32Array(N),Y=new Float32Array(N),Z=new Float32Array(N),VX=new Float32Array(N),VY=new Float32Array(N),VZ=new Float32Array(N),DL=new Float32Array(N);
  const half=COLS*S/2;
  for(let n=0;n<N;n++){const c=cells[n];hx[n]=c[0];hy[n]=c[1];hz[n]=(c[2]+c[3]+c[4])/3*.16;
   col.setRGB(Math.min(1,c[2]*1.08),Math.min(1,c[3]*1.08),Math.min(1,c[4]*1.08));mesh.setColorAt(n,col);
   const a=Math.random()*6.2832,b=Math.acos(2*Math.random()-1),r=4+Math.random()*5;
   X[n]=Math.sin(b)*Math.cos(a)*r;Y[n]=Math.sin(b)*Math.sin(a)*r;Z[n]=Math.cos(b)*r;
   DL[n]=(c[0]+half)/(2*half)*.9+Math.random()*.35;
   const o=n*16;M[o]=1;M[o+5]=1;M[o+10]=1;M[o+15]=1;M[o+12]=X[n];M[o+13]=Y[n];M[o+14]=Z[n]}
  mesh.instanceColor.needsUpdate=true;
  sc.add(new T.AmbientLight(0xa9b4ff,.85));
  const key=new T.DirectionalLight(0xffffff,1.1);key.position.set(-3,4,6);sc.add(key);
  const l1=new T.PointLight(0x2f7bff,2.4,22);l1.position.set(-5,-2.5,5);sc.add(l1);
  const l2=new T.PointLight(0xff2bd6,2.4,22);l2.position.set(5,3,5);sc.add(l2);
  const lp=new T.PointLight(0xcfc4ff,1.8,6);lp.position.set(0,0,2.4);grp.add(lp);
  const DN=150,pg=new T.BufferGeometry(),pp=new Float32Array(DN*3),pc=new Float32Array(DN*3),pal=[[0,.78,.93],[.09,.47,1],[.48,.18,.97],[.9,.09,.61]];
  for(let n=0;n<DN;n++){pp[n*3]=(Math.random()-.5)*16;pp[n*3+1]=(Math.random()-.5)*11;pp[n*3+2]=-1-Math.random()*5;const q=pal[n%4];pc[n*3]=q[0];pc[n*3+1]=q[1];pc[n*3+2]=q[2]}
  pg.setAttribute('position',new T.BufferAttribute(pp,3));pg.setAttribute('color',new T.BufferAttribute(pc,3));
  const dust=new T.Points(pg,new T.PointsMaterial({size:.07,vertexColors:true,transparent:true,opacity:.75,depthWrite:false}));sc.add(dust);
  const rc=new T.Raycaster(),pl=new T.Plane(new T.Vector3(0,0,1),0),m2=new T.Vector2(),hit=new T.Vector3();
  let mx=1e3,my=1e3,tx=0,ty=0,vis=true,t0=performance.now(),last=t0,go=window.__pdaiGo===true;const onGo=()=>{go=true;t0=performance.now()};addEventListener('pdai-go',onGo);cleanups.push(()=>removeEventListener('pdai-go',onGo));const RR=1.2,RR2=RR*RR;
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fit(){const w=glEl.clientWidth,h=glEl.clientHeight;if(!w||!h)return;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
   const t=Math.tan(cam.fov*Math.PI/360),W=COLS*S/.9,H=ROWS*S/.8;cam.position.set(0,0,Math.max(W/(2*t*cam.aspect),H/(2*t)));cam.lookAt(0,0,0)}
  fit();const ro=new ResizeObserver(fit);ro.observe(glEl);cleanups.push(()=>ro.disconnect());
  const io=new IntersectionObserver(a=>{vis=a[0].isIntersecting});io.observe(hostEl);cleanups.push(()=>io.disconnect());
  const setPtr=e=>{const r=glEl.getBoundingClientRect();m2.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);tx=m2.x;ty=m2.y;
   rc.setFromCamera(m2,cam);if(rc.ray.intersectPlane(pl,hit)){grp.updateMatrixWorld();grp.worldToLocal(hit);mx=hit.x;my=hit.y;lp.position.set(mx,my,2.4)}};
  hostEl.addEventListener('pointermove',setPtr);hostEl.addEventListener('pointerdown',setPtr);cleanups.push(()=>{hostEl.removeEventListener('pointermove',setPtr);hostEl.removeEventListener('pointerdown',setPtr)});
  hostEl.addEventListener('pointerleave',()=>{mx=my=1e3;tx=ty=0});
  hostEl.addEventListener('click',()=>{for(let n=0;n<N;n++){let dx=hx[n],dy=hy[n],dl=Math.hypot(dx,dy)||1;const f=.35+Math.random()*.6;VX[n]+=dx/dl*f+(Math.random()-.5)*.3;VY[n]+=dy/dl*f+(Math.random()-.5)*.3;VZ[n]+=(Math.random()-.2)*f*1.6}});
  function step(now){const dt=Math.min(.05,(now-last)/1000);last=now;const t=go?(now-t0)/1000:-1,k=dt*60;
   for(let n=0;n<N;n++){
    if(t>=DL[n]){VX[n]+=(hx[n]-X[n])*.05*k;VY[n]+=(hy[n]-Y[n])*.05*k;VZ[n]+=(hz[n]-Z[n])*.05*k;
     const dx=X[n]-mx,dy=Y[n]-my,d2=dx*dx+dy*dy;
     if(d2<RR2){const d=Math.sqrt(d2)+.001,f=(1-d/RR)*(1-d/RR)*.11*k;VX[n]+=dx/d*f;VY[n]+=dy/d*f;VZ[n]+=f*1.1}
     const dm=Math.pow(.86,k);VX[n]*=dm;VY[n]*=dm;VZ[n]*=dm}
    else{VX[n]+=(Math.random()-.5)*.004;VY[n]+=(Math.random()-.5)*.004}
    X[n]+=VX[n]*k;Y[n]+=VY[n]*k;Z[n]+=VZ[n]*k;const o=n*16;M[o+12]=X[n];M[o+13]=Y[n];M[o+14]=Z[n]}
   mesh.instanceMatrix.needsUpdate=true;
   grp.rotation.y+=(tx*.32-grp.rotation.y)*.06;grp.rotation.x+=(-ty*.22-grp.rotation.x)*.06;grp.position.y=Math.sin(t*.9)*.07;dust.rotation.y=t*.02;
   R.render(sc,cam)}
  if(reduceMotion){for(let n=0;n<N;n++){const o=n*16;M[o+12]=hx[n];M[o+13]=hy[n];M[o+14]=hz[n]}mesh.instanceMatrix.needsUpdate=true;R.render(sc,cam)}
  else{const loop=now=>{if(!alive)return;if(vis&&!document.hidden)step(now);else last=now;raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop)}
  hostEl.classList.add('on');
    }
    return () => {
      alive = false; cancelAnimationFrame(raf);
      cleanups.forEach((f) => f());
      hostEl.classList.remove("on");
      R.dispose();
    };
  }, []);

  return (
    <div className="pdx" ref={host} role="img" aria-label="Pixels swirl together to form the PixelDreamAi logo">
      <div className="pdx-st" ref={stage}>
        <div className="pdx-plat" aria-hidden="true"><i className="a" /><i className="b" /><i className="c" /></div>
        <div className="pdx-beam" aria-hidden="true" />
        <div className="pdx-r" aria-hidden="true" />
        <canvas ref={cv} />
        <div className="pdx-fx" aria-hidden="true"><i className="sh s1" /><i className="sh s3" /><i className="sh s5" /><i className="sh s6" /></div>
      </div>
      <i className="cm tl" /><i className="cm tr" /><i className="cm bl" /><i className="cm br" />
      <canvas ref={gl} className="gl4" aria-hidden="true" />
      <p className="hint" aria-hidden="true">Move over the logo · To Experience the Magic </p>
      <img ref={fallback} hidden src="/assets/pixeldreamai-logo-full.png" alt="" className="absolute inset-[12%] h-3/4 w-3/4 object-contain" />
    </div>
  );
}
