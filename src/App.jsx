import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Share+Tech+Mono&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Barlow Condensed',sans-serif;background:#080808;color:#d0c8b8;overflow-x:hidden;cursor:crosshair;}

:root{
  --void:#080808;
  --concrete:#111;
  --panel:#141414;
  --panel2:#1a1a1a;
  --red:#ff1500;
  --orange:#ff6a00;
  --gold:#ffd700;
  --chrome:#b8b8c0;
  --chalk:rgba(255,255,255,0.06);
  --text:#d0c8b8;
  --muted:#6a6258;
  --border:rgba(255,21,0,0.2);
  --glow:0 0 30px rgba(255,21,0,0.4);
  --gglow:0 0 30px rgba(255,215,0,0.4);
}

#chalk-canvas{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.7;}

.gym{
  min-height:100vh;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,transparent 2px,
      rgba(255,255,255,0.008) 2px,rgba(255,255,255,0.008) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,transparent 60px,
      rgba(255,255,255,0.005) 60px,rgba(255,255,255,0.005) 61px
    ),
    radial-gradient(ellipse at 50% 0%,rgba(255,21,0,0.06) 0%,transparent 60%),
    var(--void);
  position:relative;
}

.spotlight{
  position:fixed;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(ellipse 600px 400px at 50% -100px,rgba(255,100,0,0.04),transparent);
  animation:spotmove 8s ease-in-out infinite alternate;
}
@keyframes spotmove{0%{background-position:20% 0;}100%{background-position:80% 0;}}

.nav{
  position:sticky;top:0;z-index:300;
  background:rgba(8,8,8,0.97);
  backdrop-filter:blur(20px);
  border-bottom:2px solid rgba(255,21,0,0.3);
  padding:0 48px;height:60px;
  display:flex;align-items:center;justify-content:space-between;
}
.nav::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--red),var(--orange),var(--red),transparent);
  animation:navburn 2s ease-in-out infinite alternate;
}
@keyframes navburn{0%{opacity:0.3;}100%{opacity:1;}}
.nav-logo{
  font-family:'Bebas Neue',sans-serif;
  font-size:1.6rem;color:var(--red);
  text-decoration:none;letter-spacing:0.1em;
  text-shadow:0 0 20px rgba(255,21,0,0.7),0 0 60px rgba(255,21,0,0.3);
  display:flex;align-items:center;gap:10px;
}
.logo-bar{
  width:28px;height:8px;
  background:var(--chrome);
  border-radius:1px;
  position:relative;
  box-shadow:0 0 8px rgba(184,184,192,0.3);
}
.logo-bar::before,.logo-bar::after{
  content:'';position:absolute;top:-4px;
  width:10px;height:16px;
  background:var(--chrome);
  border-radius:3px;
  box-shadow:0 0 6px rgba(184,184,192,0.4);
}
.logo-bar::before{left:-6px;}
.logo-bar::after{right:-6px;}
.nav-ul{display:flex;gap:4px;list-style:none;align-items:center;}
.nav-ul a{
  font-family:'Bebas Neue',sans-serif;font-size:0.9rem;
  color:var(--muted);text-decoration:none;
  letter-spacing:0.1em;
  padding:5px 12px;border:1px solid transparent;
  transition:all 0.15s;
}
.nav-ul a:hover{color:var(--red);border-color:var(--border);background:rgba(255,21,0,0.06);}
.nav-res{color:var(--gold)!important;border-color:rgba(255,215,0,0.3)!important;background:rgba(255,215,0,0.06)!important;}
.nav-res:hover{background:rgba(255,215,0,0.14)!important;}

.floor{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:0 28px 100px;}

.sec-hdr{
  display:flex;align-items:flex-end;gap:16px;
  padding:64px 0 28px;
}
.sec-num{
  font-family:'Share Tech Mono',monospace;
  font-size:0.62rem;color:var(--red);
  letter-spacing:0.18em;margin-bottom:8px;
  opacity:0.7;
}
.sec-title{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(2rem,5vw,3.4rem);
  color:#fff;letter-spacing:0.06em;
  line-height:1;
  text-shadow:2px 2px 0 rgba(255,21,0,0.3);
}
.sec-rule{flex:1;height:2px;background:linear-gradient(90deg,var(--red),transparent);margin-bottom:8px;}
.sec-tag{
  font-family:'Share Tech Mono',monospace;
  font-size:0.6rem;color:var(--muted);
  letter-spacing:0.14em;margin-bottom:8px;
  white-space:nowrap;
}

.panel{
  background:var(--panel);
  border:1px solid rgba(255,255,255,0.06);
  border-top:2px solid var(--red);
  border-radius:2px;
  padding:40px 48px;
  position:relative;
  overflow:hidden;
}
.panel::before{
  content:'';position:absolute;inset:0;
  background:repeating-linear-gradient(
    -45deg,transparent,transparent 30px,
    rgba(255,255,255,0.008) 30px,rgba(255,255,255,0.008) 31px
  );
  pointer-events:none;
}

.hero{
  min-height:92vh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  position:relative;padding-top:20px;
  text-align:center;gap:0;
}
.hero-eyebrow{
  font-family:'Share Tech Mono',monospace;
  font-size:0.72rem;color:var(--red);
  letter-spacing:0.28em;text-transform:uppercase;
  margin-bottom:16px;
  animation:fadeup 0.8s 0.2s ease both;
}
.hero-name{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(4rem,12vw,11rem);
  color:#fff;line-height:0.88;
  letter-spacing:0.04em;
  text-shadow:4px 4px 0 rgba(255,21,0,0.25),0 0 80px rgba(255,21,0,0.1);
  animation:fadeup 0.8s 0.3s ease both;
}
.hero-name span{color:var(--red);text-shadow:0 0 40px rgba(255,21,0,0.8),4px 4px 0 rgba(139,0,0,0.5);}
.hero-role{
  font-family:'Barlow Condensed',sans-serif;
  font-size:clamp(1rem,2.5vw,1.5rem);
  font-weight:300;font-style:italic;
  color:var(--chrome);letter-spacing:0.12em;
  margin-bottom:28px;
  animation:fadeup 0.8s 0.4s ease both;
}
@keyframes fadeup{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}

.barbell-wrap{
  display:flex;align-items:center;justify-content:center;
  margin:28px 0 32px;
  animation:fadeup 0.8s 0.5s ease both;
  position:relative;
}
.bb-bar{
  width:360px;height:10px;
  background:linear-gradient(180deg,#e0e0e8,#888,#e0e0e8);
  border-radius:5px;
  box-shadow:0 2px 8px rgba(0,0,0,0.6),0 0 20px rgba(184,184,192,0.15);
  position:relative;z-index:2;
}
.bb-bar::before,.bb-bar::after{
  content:'';position:absolute;top:50%;
  transform:translateY(-50%);
  width:20px;height:28px;
  background:linear-gradient(180deg,#c0c0c8,#707078,#c0c0c8);
  border-radius:2px;
  box-shadow:0 2px 6px rgba(0,0,0,0.5);
}
.bb-bar::before{left:8px;}
.bb-bar::after{right:8px;}
.bb-plates{
  display:flex;gap:4px;align-items:center;
  position:relative;z-index:3;
}
.plate{
  display:flex;align-items:center;justify-content:center;
  border-radius:4px;font-family:'Bebas Neue',sans-serif;
  font-size:0.7rem;letter-spacing:0.06em;
  box-shadow:2px 2px 0 rgba(0,0,0,0.4),0 0 12px rgba(0,0,0,0.3);
  flex-shrink:0;
  transform-origin:center;
}
.plate-45{width:22px;height:80px;background:linear-gradient(180deg,#cc1500,#880000,#cc1500);color:#ff8080;border:1px solid rgba(255,100,80,0.3);}
.plate-35{width:20px;height:68px;background:linear-gradient(180deg,#1155cc,#003399,#1155cc);color:#8aafff;border:1px solid rgba(100,150,255,0.3);}
.plate-25{width:18px;height:54px;background:linear-gradient(180deg,#ddaa00,#aa7700,#ddaa00);color:#ffe080;border:1px solid rgba(255,220,100,0.3);}
.plate-10{width:14px;height:40px;background:linear-gradient(180deg,#336633,#1a441a,#336633);color:#88cc88;border:1px solid rgba(100,200,100,0.3);}
.plate-5{width:12px;height:28px;background:linear-gradient(180deg,#888,#444,#888);color:#ccc;border:1px solid rgba(200,200,200,0.2);}
.plate.animate-in{animation:plateIn var(--delay,0.4s) var(--from,0.6s) cubic-bezier(0.34,1.56,0.64,1) both;}
@keyframes plateIn{
  from{opacity:0;transform:translateX(var(--tx,80px)) scale(0.5);}
  to{opacity:1;transform:translateX(0) scale(1);}
}
.total-weight{
  font-family:'Share Tech Mono',monospace;
  font-size:0.62rem;color:var(--gold);
  letter-spacing:0.16em;text-align:center;
  margin-top:-8px;margin-bottom:0;
  animation:fadeup 0.8s 1.4s ease both;
  text-shadow:0 0 10px rgba(255,215,0,0.4);
}

.hero-stats{
  display:flex;gap:0;
  border:1px solid rgba(255,21,0,0.2);
  border-radius:2px;overflow:hidden;
  margin:24px 0 32px;
  animation:fadeup 0.8s 0.7s ease both;
}
.hstat{
  padding:14px 22px;text-align:center;
  border-right:1px solid rgba(255,21,0,0.15);
  background:rgba(255,21,0,0.04);
}
.hstat:last-child{border-right:none;}
.hstat-l{font-family:'Share Tech Mono',monospace;font-size:0.52rem;color:var(--muted);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:5px;}
.hstat-v{font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:var(--red);text-shadow:0 0 14px rgba(255,21,0,0.5);}

.ecg-wrap{
  width:300px;height:44px;overflow:hidden;
  animation:fadeup 0.8s 0.9s ease both;
  margin-bottom:0px;
}
.ecg-line{animation:ecgmove 2.4s linear infinite;}
@keyframes ecgmove{from{transform:translateX(0);}to{transform:translateX(-50%);}};

.ctas{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;animation:fadeup 0.8s 1.0s ease both;margin-top:28px;}
.btn{display:inline-flex;align-items:center;gap:8px;padding:13px 30px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:0.12em;text-decoration:none;transition:all 0.18s;cursor:pointer;border:none;border-radius:1px;}
.btn-red{background:var(--red);color:#fff;box-shadow:0 4px 20px rgba(255,21,0,0.4),inset 0 1px 0 rgba(255,255,255,0.15);}
.btn-red:hover{background:#ff3020;transform:translateY(-3px);box-shadow:0 8px 30px rgba(255,21,0,0.6);}
.btn-red:active{transform:translateY(0) scale(0.98);}
.btn-outline{background:transparent;color:#fff;border:2px solid var(--chrome);box-shadow:0 4px 16px rgba(0,0,0,0.3);}
.btn-outline:hover{background:rgba(255,255,255,0.06);transform:translateY(-3px);border-color:#fff;}

.vitals-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:44px;align-items:start;}
.bio p{font-size:1rem;font-weight:300;line-height:1.84;color:var(--text);margin-bottom:13px;}
.bio strong{color:var(--red);font-weight:600;}
.athlete-card{
  background:var(--panel2);
  border:1px solid rgba(255,21,0,0.2);
  border-radius:2px;overflow:hidden;
}
.ac-hdr{
  background:linear-gradient(90deg,var(--red),rgba(255,106,0,0.8));
  padding:12px 18px;
  font-family:'Bebas Neue',sans-serif;
  font-size:1rem;letter-spacing:0.12em;color:#fff;
  display:flex;align-items:center;justify-content:space-between;
}
.ac-badge{font-size:0.65rem;background:rgba(0,0,0,0.3);padding:3px 10px;letter-spacing:0.14em;}
.ac-row{display:flex;border-bottom:1px solid rgba(255,255,255,0.04);padding:10px 18px;gap:10px;}
.ac-row:last-child{border-bottom:none;}
.ac-k{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:var(--muted);min-width:120px;letter-spacing:0.06em;}
.ac-v{font-size:0.9rem;font-weight:400;color:var(--text);}
.ac-v.pr{color:var(--gold);font-weight:700;}
.ac-v.active{color:#22ee66;}

.counter{font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:var(--red);}

.pr-board{
  background:var(--panel2);
  border:2px solid var(--red);
  border-radius:2px;overflow:hidden;
  margin-bottom:28px;
}
.prb-hdr{
  background:var(--red);
  padding:10px 20px;
  font-family:'Bebas Neue',sans-serif;
  font-size:1.1rem;letter-spacing:0.12em;color:#fff;
  display:flex;align-items:center;justify-content:space-between;
}
.prb-flash{
  font-size:0.6rem;letter-spacing:0.18em;
  background:rgba(255,255,255,0.2);
  padding:3px 10px;
  animation:flash 1s ease-in-out infinite;
}
@keyframes flash{0%,100%{opacity:1;}50%{opacity:0.3;}}

.proj-list{display:flex;flex-direction:column;gap:0;}
.proj{
  display:grid;grid-template-columns:70px 1fr;
  gap:0;
  border-bottom:1px solid rgba(255,255,255,0.05);
  padding:20px 0;
  transition:all 0.2s;
  cursor:default;
  position:relative;
}
.proj::after{
  content:'';position:absolute;left:0;top:0;bottom:0;width:0;
  background:rgba(255,21,0,0.04);
  transition:width 0.3s ease;
}
.proj:hover::after{width:100%;}
.proj:hover{transform:translateX(4px);}
.proj.shake{animation:shake 0.3s ease;}
@keyframes shake{0%,100%{transform:translateX(4px);}25%{transform:translateX(4px) translateY(-2px);}50%{transform:translateX(4px) translateX(3px);}75%{transform:translateX(4px) translateY(2px);}}
.proj-n{
  font-family:'Bebas Neue',sans-serif;
  font-size:2rem;color:rgba(255,21,0,0.2);
  line-height:1;padding-top:2px;position:relative;z-index:1;
}
.proj-body{position:relative;z-index:1;}
.proj-cat{font-family:'Share Tech Mono',monospace;font-size:0.54rem;color:var(--red);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:4px;}
.proj-title{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:#fff;line-height:1.1;margin-bottom:5px;letter-spacing:0.04em;}
.proj-desc{font-size:0.88rem;font-weight:300;color:var(--muted);line-height:1.72;margin-bottom:9px;}
.tech{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:9px;}
.tech span{font-family:'Share Tech Mono',monospace;font-size:0.54rem;color:var(--muted);border:1px solid rgba(255,255,255,0.08);padding:2px 7px;background:rgba(255,255,255,0.02);}
.plinks{display:flex;gap:13px;}
.plink{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:var(--orange);text-decoration:none;letter-spacing:0.04em;transition:all 0.18s;border-bottom:1px solid transparent;}
.plink:hover{color:#fff;border-bottom-color:var(--orange);}

.muscle-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.muscle{
  background:var(--panel2);
  border:1px solid rgba(255,255,255,0.05);
  border-radius:2px;padding:20px;
  position:relative;overflow:hidden;
}
.muscle::before{
  content:'';position:absolute;top:0;left:0;bottom:0;width:3px;
  background:var(--red);
}
.m-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.m-cat{font-family:'Bebas Neue',sans-serif;font-size:1rem;color:#fff;letter-spacing:0.08em;}
.m-pct{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:var(--red);letter-spacing:0.1em;}
.m-bar-track{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-bottom:14px;overflow:hidden;}
.m-bar-fill{
  height:100%;border-radius:2px;
  background:linear-gradient(90deg,var(--red),var(--orange));
  width:0%;
  transition:width 1.4s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow:0 0 8px rgba(255,21,0,0.5);
}
.m-bar-fill.pumped{animation:pump 0.6s 1.4s ease forwards;}
@keyframes pump{0%,100%{filter:brightness(1);}50%{filter:brightness(1.6) saturate(1.3);}}
.m-tags{display:flex;flex-wrap:wrap;gap:6px;}
.m-tag{
  font-size:0.8rem;font-weight:400;
  color:var(--text);
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:1px;padding:4px 10px;
  transition:all 0.18s;
}
.m-tag:hover{background:rgba(255,21,0,0.1);border-color:rgba(255,21,0,0.3);color:#fff;}

.exp-tl{display:flex;flex-direction:column;}
.tl-item{
  padding:20px 0 20px 32px;
  border-left:2px solid rgba(255,21,0,0.2);
  position:relative;
}
.tl-dot{
  position:absolute;left:-8px;top:24px;
  width:14px;height:14px;border-radius:50%;
  background:var(--red);
  box-shadow:0 0 14px rgba(255,21,0,0.8);
  animation:dotpulse 2s ease-in-out infinite;
}
@keyframes dotpulse{0%,100%{box-shadow:0 0 8px rgba(255,21,0,0.6);}50%{box-shadow:0 0 20px rgba(255,21,0,0.9),0 0 40px rgba(255,21,0,0.3);}}
.tl-dot.inactive{background:var(--muted);animation:none;box-shadow:none;}
.exp-role{font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:#fff;letter-spacing:0.05em;}
.exp-co{font-size:0.9rem;font-style:italic;color:var(--orange);}
.exp-per{display:inline-block;font-family:'Share Tech Mono',monospace;font-size:0.56rem;color:var(--red);letter-spacing:0.1em;margin:5px 0 10px;background:rgba(255,21,0,0.07);border:1px solid var(--border);padding:3px 10px;}
.exp-ul{list-style:none;}
.exp-ul li{font-size:0.88rem;font-weight:300;color:var(--muted);line-height:1.76;padding-left:16px;position:relative;margin-bottom:4px;}
.exp-ul li::before{content:'→';position:absolute;left:0;color:var(--red);font-size:0.7rem;top:3px;}

.belt{
  border:2px solid var(--gold);
  border-radius:4px;overflow:hidden;
  box-shadow:0 0 40px rgba(255,215,0,0.1),0 0 80px rgba(255,215,0,0.04);
  position:relative;
}
.belt::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse at 50% 0%,rgba(255,215,0,0.06),transparent 60%);
}
.belt-top{
  background:linear-gradient(90deg,#1a1200,rgba(255,215,0,0.15),#1a1200);
  border-bottom:1px solid rgba(255,215,0,0.3);
  padding:14px 28px;
  text-align:center;
  display:flex;align-items:center;justify-content:center;gap:16px;
}
.belt-icon{font-size:1.6rem;animation:spin 8s linear infinite;}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
.belt-heading{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:var(--gold);letter-spacing:0.14em;text-shadow:0 0 20px rgba(255,215,0,0.5);}
.belt-body{padding:28px 32px;}
.belt-title{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:#fff;line-height:1.28;margin-bottom:10px;letter-spacing:0.04em;}
.belt-authors{font-size:0.9rem;font-style:italic;color:var(--gold);margin-bottom:10px;}
.belt-meta{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
.belt-meta span{font-family:'Share Tech Mono',monospace;font-size:0.58rem;color:var(--muted);background:rgba(255,215,0,0.05);border:1px solid rgba(255,215,0,0.15);padding:3px 9px;}
.belt-abs{font-size:0.88rem;font-weight:300;line-height:1.86;color:var(--text);border-left:3px solid var(--gold);padding-left:14px;margin-bottom:14px;font-style:italic;}
.belt-kws{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;}
.belt-kw{font-family:'Share Tech Mono',monospace;font-size:0.56rem;color:var(--orange);border:1px solid rgba(255,106,0,0.3);padding:3px 8px;background:rgba(255,106,0,0.05);}

.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:44px;}
.contact-intro{font-size:1rem;font-weight:300;color:var(--muted);line-height:1.82;margin-bottom:26px;font-style:italic;}
.cf{display:flex;flex-direction:column;gap:12px;}
.cf-lbl{font-family:'Share Tech Mono',monospace;font-size:0.58rem;color:var(--muted);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:2px;display:block;}
.fi{font-family:'Barlow Condensed',sans-serif;font-size:0.95rem;font-weight:300;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:1px;padding:11px 14px;color:var(--text);outline:none;transition:all 0.2s;width:100%;}
.fi:focus{border-color:var(--red);box-shadow:0 0 14px rgba(255,21,0,0.1);}
.fta{font-family:'Barlow Condensed',sans-serif;font-size:0.95rem;font-weight:300;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:1px;padding:11px 14px;color:var(--text);outline:none;transition:all 0.2s;width:100%;resize:vertical;min-height:115px;}
.fta:focus{border-color:var(--red);box-shadow:0 0 14px rgba(255,21,0,0.1);}
.fsub{font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:0.12em;background:linear-gradient(135deg,var(--red),#cc0800);color:#fff;border:none;border-radius:1px;padding:13px 32px;cursor:pointer;transition:all 0.18s;align-self:flex-start;box-shadow:0 4px 20px rgba(255,21,0,0.3);}
.fsub:hover{transform:translateY(-3px);box-shadow:0 8px 30px rgba(255,21,0,0.5);}
.fsub:hover::before{left:120%;}
.fsub:active{transform:translateY(0) scale(0.97);}
.fsub:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
.fst-ok{font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:#22ee66;letter-spacing:0.08em;}
.fst-err{font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:var(--red);}
.socials{display:flex;flex-direction:column;}
.soc{display:flex;align-items:center;gap:14px;text-decoration:none;color:var(--text);font-size:0.95rem;font-weight:400;padding:13px 0;border-bottom:1px solid rgba(255,255,255,0.04);transition:all 0.2s;}
.soc:last-child{border-bottom:none;}
.soc:hover{color:var(--red);padding-left:6px;}
.soc-ic{width:32px;height:32px;background:rgba(255,21,0,0.07);border:1px solid rgba(255,21,0,0.2);border-radius:1px;display:flex;align-items:center;justify-content:center;font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:var(--red);flex-shrink:0;}

.foot{text-align:center;padding:48px 28px;position:relative;z-index:1;border-top:2px solid rgba(255,21,0,0.2);}
.foot-bar{
  display:flex;justify-content:center;margin-bottom:18px;
  position:relative;height:12px;align-items:center;
}
.foot-bb{width:200px;height:6px;background:linear-gradient(180deg,#b0b0b8,#666,#b0b0b8);border-radius:3px;position:relative;}
.foot-bb::before,.foot-bb::after{content:'';position:absolute;top:50%;transform:translateY(-50%);width:12px;height:20px;background:linear-gradient(180deg,#c0c0c8,#707078,#c0c0c8);border-radius:2px;}
.foot-bb::before{left:4px;} .foot-bb::after{right:4px;}
.foot p{font-family:'Share Tech Mono',monospace;font-size:0.64rem;color:var(--muted);letter-spacing:0.14em;}
.foot span{color:var(--red);}

@media(max-width:820px){
  .nav{padding:0 18px;}
  .nav-ul li:not(:last-child):not(:nth-last-child(2)){display:none;}
  .panel{padding:28px 22px;}
  .vitals-grid,.contact-grid{grid-template-columns:1fr;}
  .muscle-grid{grid-template-columns:1fr;}
  .hero-name{font-size:18vw;}
  .bb-bar{width:240px;}
  .proj{grid-template-columns:44px 1fr;}
}
`;

const PROJECTS=[
  {n:"01",cat:"AI / Explainability",title:"Gastro-XAI",desc:"Explainable AI framework for gastrointestinal disease classification and polyp segmentation. Grad-CAM visualisations + automated clinical report generation.",tech:["Python","PyTorch","Flask","React","Grad-CAM"],gh:"https://github.com/sarthakpapneja/Gastro-XAI",live:null},
  {n:"02",cat:"AI / Auditing",title:"ModelAuditAI",desc:"Production-grade ML audit system evaluating models for Performance, Fairness, Drift, Overfitting, and Leakage. Comprehensive model health reports.",tech:["TypeScript","React","Python","FastAPI","AI/ML"],gh:"https://github.com/sarthakpapneja/ML-Auditor",live:null},
  {n:"03",cat:"NLP / AI",title:"Resume Analyzer",desc:"Intelligent resume parsing delivering actionable insights, skill gap analysis, and ATS compatibility scoring.",tech:["TypeScript","React","Python","NLP"],gh:"https://github.com/sarthakpapneja/resume-analyzer",live:null},
  {n:"04",cat:"Full-Stack / FinTech",title:"Finance Track",desc:"MERN stack finance tracker — transaction management, balance computation, data visualisation and responsive dashboard.",tech:["JavaScript","React","Node.js","MongoDB","Express"],gh:"https://github.com/sarthakpapneja/Finance-Track",live:null},
  {n:"05",cat:"AI / FinTech",title:"Regulatory Reporting Assistant",desc:"AI-powered assistant streamlining regulatory compliance and financial reporting through intelligent automation.",tech:["Python","Flask","AI/ML"],gh:"https://github.com/sarthakpapneja/Regulatory-Reporting-Assistant",live:null},
  {n:"06",cat:"Computer Vision",title:"RoadVision VMS",desc:"Vehicle Management System applying computer vision for road monitoring, traffic analysis, and automated tracking.",tech:["Python","Computer Vision","Deep Learning"],gh:"https://github.com/sarthakpapneja/RoadVision-VMS",live:null},
  {n:"07",cat:"Web Development",title:"School Website",desc:"Full-featured institutional website — dynamic content, event management, video integration, responsive design.",tech:["JavaScript","React","Vite","CSS"],gh:"https://github.com/sarthakpapneja/school-website-",live:"https://school-website-murex-seven.vercel.app/"},
  {n:"08",cat:"Database Systems",title:"Bank Security System",desc:"Bank management application ensuring data segregation and integrity through Role-Based Access Control (RBAC).",tech:["Python","MySQL","RBAC"],gh:"https://github.com/sarthakpapneja/banksecuritysystem",live:null},
  {n:"09",cat:"Data Science",title:"Table Detection Model",desc:"Encoder-decoder deep learning model (TableNet / VGG-19) for table detection with integrated OCR extraction.",tech:["Deep Learning","Python","OCR","VGG-19"],gh:null,live:"https://colab.research.google.com/drive/1xpn7qXNKuUoMzCklZjbyLiv23v8SheIN?usp=sharing"},
];

const MUSCLES=[
  {cat:"Core Strength",tags:["Computer Architecture","AI","DBMS","OS","Computer Networks","OOP"],pct:92},
  {cat:"Languages",tags:["C","C++","Java","JavaScript","Python","TypeScript"],pct:95},
  {cat:"Web & Frameworks",tags:["ReactJS","Next.js","Tailwind CSS","Flask","FastAPI","Node.js","Figma"],pct:88},
  {cat:"AI / ML",tags:["PyTorch","Deep Learning","Computer Vision","NLP","Grad-CAM","XAI","Streamlit"],pct:90},
  {cat:"Data & Analytics",tags:["SQL","PowerBI","Excel","Tableau","MySQL","MongoDB"],pct:82},
  {cat:"Cloud & Infra",tags:["AWS EC2","IAM","VPC","S3","RDS","CloudFront"],pct:78},
];

const EXP=[
  {role:"Cloud Intern",co:"Velocis Systems, Noida",period:"June 2025 – July 2025",active:true,bullets:["Deployed and managed infrastructure on AWS and GCP: EC2, IAM, VPC, RDS, CloudFront, Load Balancer.","Supported enterprise-grade solutions in fast-paced project environments."]},
  {role:"Operations Member",co:"Android Club, VIT Chennai",period:"June 2023 – Present",active:true,bullets:["Organised and executed technical events; delivered dedicated UI/UX session.","Collaborated with teams ensuring timely task completion.","Drove operational improvements through leadership and process refinement."]},
  {role:"UI/UX Member",co:"Microsoft Innovations Club, VIT Chennai",period:"Sep 2023 – Nov 2023",active:false,bullets:["Redesigned event interfaces applying advanced UI principles.","Boosted user access 30%; cut registration time 20%."]},
  {role:"Core Developer",co:"Smart India Hackathon",period:"Various",active:false,bullets:["Represented institution as core developer in national-level competition."]},
];

const RKW=["Post-Quantum Cryptography","SPHINCS+","IPFS","Verifiable Credentials","Decentralized Notary","Quantum-Resistant Security"];

function useCounter(target, duration=1600, start=false){
  const [val,setVal]=useState(0);
  useEffect(()=>{
    if(!start) return;
    let s=null; const step=target/60;
    let cur=0;
    s=setInterval(()=>{
      cur=Math.min(cur+step,target);
      setVal(Math.round(cur));
      if(cur>=target) clearInterval(s);
    },duration/60);
    return()=>clearInterval(s);
  },[target,duration,start]);
  return val;
}

function ChalkCanvas(){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current;
    const ctx=canvas.getContext('2d');
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    const particles=Array.from({length:80},()=>({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      r:Math.random()*2.5+0.5,
      vx:(Math.random()-0.5)*0.3,
      vy:-Math.random()*0.5-0.1,
      alpha:Math.random()*0.35+0.05,
      life:Math.random(),
    }));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.life+=0.003;
        if(p.y<-10||p.life>1){
          p.y=canvas.height+10;
          p.x=Math.random()*canvas.width;
          p.life=Math.random()*0.3;
        }
        const a=p.alpha*Math.sin(p.life*Math.PI);
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${a})`;
        ctx.fill();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
    window.addEventListener('resize',resize);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas id="chalk-canvas" ref={ref}/>;
}

function Barbell(){
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{setTimeout(()=>setLoaded(true),600);},[]);
  const leftPlates=[
    {cls:"plate-45",label:"45",delay:"0.6s",tx:"-120px"},
    {cls:"plate-35",label:"35",delay:"0.75s",tx:"-100px"},
    {cls:"plate-25",label:"25",delay:"0.9s",tx:"-80px"},
    {cls:"plate-10",label:"10",delay:"1.0s",tx:"-60px"},
    {cls:"plate-5", label:"5", delay:"1.1s",tx:"-40px"},
  ];
  const rightPlates=[...leftPlates].map(p=>({...p,tx:p.tx.replace('-','')}));
  return(
    <div className="barbell-wrap">
      <div className="bb-plates">
        {leftPlates.map((p,i)=>(
          <div key={i} className={`plate ${p.cls}${loaded?' animate-in':''}`}
            style={{"--delay":p.delay,"--from":p.delay,"--tx":p.tx}}>
            {p.label}
          </div>
        ))}
        <div className="bb-bar"/>
        {rightPlates.map((p,i)=>(
          <div key={i} className={`plate ${p.cls}${loaded?' animate-in':''}`}
            style={{"--delay":p.delay,"--from":p.delay,"--tx":p.tx}}>
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ECG(){
  return(
    <div className="ecg-wrap">
      <svg width="600" height="44" viewBox="0 0 600 44" fill="none">
        <path className="ecg-line"
          d="M0,22 L40,22 L50,22 L55,4 L60,38 L65,10 L70,32 L75,22 L120,22 L130,22 L135,4 L140,38 L145,10 L150,32 L155,22 L200,22 L210,22 L215,4 L220,38 L225,10 L230,32 L235,22 L280,22 L290,22 L295,4 L300,38 L305,10 L310,32 L315,22 L360,22 L370,22 L375,4 L380,38 L385,10 L390,32 L395,22 L440,22 L450,22 L455,4 L460,38 L465,10 L470,32 L475,22 L520,22 L530,22 L535,4 L540,38 L545,10 L550,32 L555,22 L600,22"
          stroke="#ff1500" strokeWidth="1.5" opacity="0.7"
          style={{filter:"drop-shadow(0 0 4px rgba(255,21,0,0.8))"}}
        />
      </svg>
    </div>
  );
}

function MuscleBar({pct,visible}){
  const [filled,setFilled]=useState(false);
  useEffect(()=>{if(visible) setTimeout(()=>setFilled(true),200);},[visible]);
  return(
    <div className="m-bar-track">
      <div className="m-bar-fill pumped" style={{width:filled?`${pct}%`:"0%"}}/>
    </div>
  );
}

export default function Portfolio(){
  const [form,setForm]=useState({name:"",email:"",message:""});
  const [status,setStatus]=useState("");
  const [skillsVisible,setSkillsVisible]=useState(false);
  const [statsVisible,setStatsVisible]=useState(false);
  const [shakingProj,setShakingProj]=useState(null);
  const skillsRef=useRef(null);
  const statsRef=useRef(null);

  const projCount = useCounter(9,1200,statsVisible);
  const cgpaVal = useCounter(867,1600,statsVisible);
  const expYears = useCounter(3,1000,statsVisible);

  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting) setSkillsVisible(true);},{threshold:0.2});
    const obs2=new IntersectionObserver(([e])=>{if(e.isIntersecting) setStatsVisible(true);},{threshold:0.3});
    if(skillsRef.current) obs.observe(skillsRef.current);
    if(statsRef.current) obs2.observe(statsRef.current);
    return()=>{obs.disconnect();obs2.disconnect();};
  },[]);

  const handleProjHover=(n)=>{
    setShakingProj(n);
    setTimeout(()=>setShakingProj(null),300);
  };

  const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=async(e)=>{
    e.preventDefault();setStatus("sending");
    try{
      const r=await fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({access_key:"d9743274-bd82-40a7-9d2b-b6b785c6c275",subject:"New Contact from Portfolio",from_name:"Portfolio Contact Form",...form})});
      if(r.ok){setStatus("ok");setForm({name:"",email:"",message:""});}else setStatus("err");
    }catch{setStatus("err");}
  };

  return(<>
    <style>{CSS}</style>
    <ChalkCanvas/>
    <div className="spotlight"/>
    <div className="gym">

      <nav className="nav">
        <a href="#" className="nav-logo">
          <div className="logo-bar"/>
          IRON PARADISE
        </a>
        <ul className="nav-ul">
          <li><a href="#about">Vitals</a></li>
          <li><a href="#projects">PRs</a></li>
          <li><a href="#skills">Muscles</a></li>
          <li><a href="#experience">Log</a></li>
          <li><a href="#contact">Recruit</a></li>
          <li><a href="https://drive.google.com/file/d/1u3hQLi61BAbKneym4_QYbEXHYJYvHuio/view?usp=sharing" target="_blank" rel="noreferrer" className="nav-res">Résumé</a></li>
        </ul>
      </nav>

      <div className="floor">

        <section className="hero" id="hero">
          <div className="hero-eyebrow">🏋️ Iron Paradise · VIT Chennai · Class of 2026</div>
          <div className="hero-name">SARTHAK<br/><span>PAPNEJA</span></div>
          <div className="hero-role">Aspiring Software Engineer — AI · Cloud · Full-Stack</div>
          <Barbell/>
          <div className="total-weight">⚡ TOTAL LOADED: FULL STACK AI ENGINEER — READY TO LIFT ⚡</div>
          <ECG/>
          <div className="hero-stats" ref={statsRef}>
            <div className="hstat">
              <div className="hstat-l">Projects</div>
              <div className="hstat-v">{statsVisible?projCount:0}</div>
            </div>
            <div className="hstat">
              <div className="hstat-l">CGPA</div>
              <div className="hstat-v">{statsVisible?(cgpaVal/100).toFixed(2):0}</div>
            </div>
            <div className="hstat">
              <div className="hstat-l">Years Training</div>
              <div className="hstat-v">{statsVisible?expYears:0}+</div>
            </div>
            <div className="hstat">
              <div className="hstat-l">Status</div>
              <div className="hstat-v" style={{color:"#22ee66",fontSize:"1rem"}}>AVAILABLE</div>
            </div>
          </div>
          <div className="ctas">
            <a href="#projects" className="btn btn-red">💪 View PRs</a>
            <a href="#contact" className="btn btn-outline">🏆 Recruit Me</a>
          </div>
        </section>

        <section id="about">
          <div className="sec-hdr">
            <div style={{flex:"0 0 auto"}}>
              <div className="sec-num">§ 01</div>
              <div className="sec-title">ATHLETE VITALS</div>
            </div>
            <div className="sec-rule"/>
            <div className="sec-tag">BIOMETRIC PROFILE</div>
          </div>
          <div className="panel">
            <div className="vitals-grid">
              <div className="bio">
                <p>I am a Computer Science Engineering student at <strong>VIT University, Chennai</strong> (2022–2026) with a CGPA of <strong>8.67</strong>. My passion lies in building things that matter — secure banking systems, AI models for data extraction, full-stack web applications.</p>
                <p>Hands-on reps in full-stack development, cloud computing (AWS), data analytics, and AI/ML engineering. Published researcher in <strong>post-quantum cryptography</strong>. I train hard in fast-paced environments and collaborate with teams to deliver impact.</p>
                <p>Currently cutting weight for the <strong>MSc season</strong> — targeting Germany's top research universities for AI/ML and Data Science.</p>
              </div>
              <div>
                <div className="athlete-card">
                  <div className="ac-hdr">
                    🏋️ ATHLETE CARD
                    <span className="ac-badge">HIGH PERFORMANCE</span>
                  </div>
                  <div className="ac-row"><span className="ac-k">Athlete</span><span className="ac-v">Sarthak Papneja</span></div>
                  <div className="ac-row"><span className="ac-k">Training Base</span><span className="ac-v">VIT Chennai</span></div>
                  <div className="ac-row"><span className="ac-k">Division</span><span className="ac-v">B.Tech CSE</span></div>
                  <div className="ac-row"><span className="ac-k">Performance Score</span><span className="ac-v pr">8.67 / 10 CGPA</span></div>
                  <div className="ac-row"><span className="ac-k">German Grade</span><span className="ac-v pr">≈ 1.80 (Bavarian)</span></div>
                  <div className="ac-row"><span className="ac-k">IELTS</span><span className="ac-v">8.0 Overall</span></div>
                  <div className="ac-row"><span className="ac-k">Speciality</span><span className="ac-v">AI/ML · Cloud · Web</span></div>
                  <div className="ac-row"><span className="ac-k">Competition Status</span><span className="ac-v active">◉ AVAILABLE 2026</span></div>
                  <div className="ac-row"><span className="ac-k">Email</span><span className="ac-v" style={{fontSize:"0.76rem"}}>sarthakpapneja01@gmail.com</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects">
          <div className="sec-hdr">
            <div style={{flex:"0 0 auto"}}>
              <div className="sec-num">§ 02</div>
              <div className="sec-title">PERSONAL RECORDS</div>
            </div>
            <div className="sec-rule"/>
            <div className="sec-tag">9 PRs LOGGED</div>
          </div>
          <div className="pr-board">
            <div className="prb-hdr">
              🏆 ALL-TIME PR BOARD — SARTHAK PAPNEJA
              <span className="prb-flash">● LIVE</span>
            </div>
            <div style={{padding:"8px 20px 20px"}}>
              <div className="proj-list">
                {PROJECTS.map(p=>(
                  <div
                    key={p.n}
                    className={`proj${shakingProj===p.n?" shake":""}`}
                    onMouseEnter={()=>handleProjHover(p.n)}
                  >
                    <div className="proj-n">{p.n}</div>
                    <div className="proj-body">
                      <div className="proj-cat">{p.cat}</div>
                      <div className="proj-title">{p.title}</div>
                      <p className="proj-desc">{p.desc}</p>
                      <div className="tech">{p.tech.map(t=><span key={t}>{t}</span>)}</div>
                      <div className="plinks">
                        {p.gh&&<a href={p.gh} target="_blank" rel="noreferrer" className="plink">⌥ GitHub</a>}
                        {p.live&&<a href={p.live} target="_blank" rel="noreferrer" className="plink">↗️ Live</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" ref={skillsRef}>
          <div className="sec-hdr">
            <div style={{flex:"0 0 auto"}}>
              <div className="sec-num">§ 03</div>
              <div className="sec-title">MUSCLE GROUPS</div>
            </div>
            <div className="sec-rule"/>
            <div className="sec-tag">FULL BODY SCAN</div>
          </div>
          <div className="panel">
            <div className="muscle-grid">
              {MUSCLES.map(m=>(
                <div className="muscle" key={m.cat}>
                  <div className="m-hdr">
                    <div className="m-cat">{m.cat}</div>
                    <div className="m-pct">{skillsVisible?m.pct:0}%</div>
                  </div>
                  <MuscleBar pct={m.pct} visible={skillsVisible}/>
                  <div className="m-tags">{m.tags.map(t=><span key={t} className="m-tag">{t}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience">
          <div className="sec-hdr">
            <div style={{flex:"0 0 auto"}}>
              <div className="sec-num">§ 04</div>
              <div className="sec-title">TRAINING LOG & CHAMPIONSHIP</div>
            </div>
            <div className="sec-rule"/>
            <div className="sec-tag">FIELD RECORD</div>
          </div>
          <div className="panel">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"52px"}}>
              <div>
                <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"var(--red)",letterSpacing:"0.18em",marginBottom:"20px",opacity:0.8,textTransform:"uppercase"}}>Training Log</div>
                <div className="exp-tl">
                  {EXP.map(e=>(
                    <div className="tl-item" key={e.co}>
                      <div className={`tl-dot${e.active?"":" inactive"}`}/>
                      <div className="exp-role">{e.role}</div>
                      <div className="exp-co">@ {e.co}</div>
                      <span className="exp-per">{e.period}</span>
                      <ul className="exp-ul">{e.bullets.map(b=><li key={b}>{b}</li>)}</ul>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"var(--gold)",letterSpacing:"0.18em",marginBottom:"20px",opacity:0.85,textTransform:"uppercase"}}>World Record — Published Research</div>
                <div className="belt">
                  <div className="belt-top">
                    <div className="belt-icon">🏆</div>
                    <div className="belt-heading">WORLD RECORD HOLDER</div>
                    <div className="belt-icon">🏆</div>
                  </div>
                  <div className="belt-body">
                    <div className="belt-title">Q-Notary: A Decentralized, Quantum-Resistant Notary for Verifiable Collaborative Workflows</div>
                    <div className="belt-authors">Sarthak Papneja · Romit Gupta · Dr. Neelanarayanan V</div>
                    <div className="belt-meta">
                      <span>IJVRA · Vol 4, Issue 1</span>
                      <span>January 2026</span>
                      <span>DOI: 10.13140/RG.2.2.35802.20169</span>
                    </div>
                    <p className="belt-abs">Quantum computing advances threaten classical signature schemes. Q-Notary presents a post-quantum secure notary framework integrating SPHINCS+, IPFS, and W3C Verifiable Credentials for tamper-evident notarisations and collaborative approvals.</p>
                    <div className="belt-kws">{RKW.map(k=><span key={k} className="belt-kw">{k}</span>)}</div>
                    <a href="https://www.researchgate.net/publication/399985730_Q-Notary_A_Decentralized_Quantum-Resistant_Notary_for_Verifiable_Collaborative_Workflows" target="_blank" rel="noreferrer" className="btn btn-outline" style={{fontSize:"0.82rem",padding:"10px 22px",borderColor:"var(--gold)",color:"var(--gold)"}}>↗️ View on ResearchGate</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="sec-hdr">
            <div style={{flex:"0 0 auto"}}>
              <div className="sec-num">§ 05</div>
              <div className="sec-title">STEP UP TO THE BAR</div>
            </div>
            <div className="sec-rule"/>
            <div className="sec-tag">OPEN RECRUITMENT</div>
          </div>
          <div className="panel" style={{borderTopColor:"var(--gold)"}}>
            <p className="contact-intro">I'm currently looking for new opportunities. Whether you want to recruit, collaborate, or just say hi — step up. I'll spot you.</p>
            <div className="contact-grid">
              <form className="cf" onSubmit={submit}>
                <div><label className="cf-lbl">Name</label><input className="fi" placeholder="Your name..." value={form.name} onChange={e=>upd("name",e.target.value)} required/></div>
                <div><label className="cf-lbl">Email</label><input className="fi" type="email" placeholder="your@email.com" value={form.email} onChange={e=>upd("email",e.target.value)} required/></div>
                <div><label className="cf-lbl">Message</label><textarea className="fta" placeholder="Your message..." value={form.message} onChange={e=>upd("message",e.target.value)} required/></div>
                <button type="submit" className="fsub" disabled={status==="sending"}>{status==="sending"?"Sending...":"💪 Send It"}</button>
                {status==="ok"&&<p className="fst-ok">✔ Received. I'll get back to you fast.</p>}
                {status==="err"&&<p className="fst-err">✘ Failed. Email me directly.</p>}
              </form>
              <div className="socials">
                <a href="mailto:sarthakpapneja01@gmail.com" className="soc"><span className="soc-ic">✉</span>sarthakpapneja01@gmail.com</a>
                <a href="https://www.linkedin.com/in/sarthak-papneja-485118232/" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic">in</span>LinkedIn</a>
                <a href="https://github.com/sarthakpapneja" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic">GH</span>GitHub</a>
                <a href="https://www.researchgate.net/profile/Sarthak-Papneja" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic" style={{fontSize:"0.54rem"}}>RG</span>ResearchGate</a>
                <a href="https://drive.google.com/file/d/1u3hQLi61BAbKneym4_QYbEXHYJYvHuio/view?usp=sharing" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic">↓</span>Résumé PDF</a>
              </div>
            </div>
          </div>
        </section>

      </div>

      <footer className="foot">
        <div className="foot-bar"><div className="foot-bb"/></div>
        <p>Designed & Built by <span>Sarthak Papneja</span> · Iron Paradise Gym · No Days Off 🏋️</p>
      </footer>
    </div>
  </>);
}
