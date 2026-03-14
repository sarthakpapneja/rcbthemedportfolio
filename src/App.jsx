import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Share+Tech+Mono&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Barlow',sans-serif;background:#080000;color:#f0e8e0;overflow-x:hidden;cursor:crosshair;}

:root{
  --void:#080000;
  --deep:#100000;
  --panel:#160404;
  --red:#cc0000;
  --red2:#ff1a00;
  --red3:#ff4422;
  --gold:#ffd700;
  --gold2:#ffaa00;
  --black:#000000;
  --cream:#f5e8d0;
  --text:#f0e8e0;
  --muted:#886858;
  --border:rgba(204,0,0,0.25);
  --gborder:rgba(255,215,0,0.22);
  --glow:0 0 28px rgba(204,0,0,0.6);
  --gglow:0 0 28px rgba(255,215,0,0.5);
}

/* Static ambient glow (no canvas = smooth) */
.fire-ambient{
  position:fixed;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(ellipse 120% 60% at 50% 100%,rgba(204,0,0,0.06) 0%,transparent 50%);
}

/* STADIUM TEXTURE - simplified gradients */
.stadium{
  min-height:100vh;
  background:
    radial-gradient(ellipse at 50% -10%,rgba(204,0,0,0.1) 0%,transparent 50%),
    var(--void);
  position:relative;
}

/* FLOODLIGHTS - run once, then static */
.floodlight{
  position:fixed;top:0;pointer-events:none;z-index:1;
  width:3px;height:100vh;
  background:linear-gradient(180deg,rgba(255,215,0,0.6),rgba(255,215,0,0.1),transparent);
  transform-origin:top center;
  opacity:0;
}
.fl-l{left:15%;animation:floodsweep 3s 0.2s cubic-bezier(0.34,1.2,0.64,1) forwards;}
.fl-r{right:15%;animation:floodsweep 3s 0.4s cubic-bezier(0.34,1.2,0.64,1) forwards;}
.fl-l2{left:30%;animation:floodsweep 3s 0.6s cubic-bezier(0.34,1.2,0.64,1) forwards;}
.fl-r2{right:30%;animation:floodsweep 3s 0.8s cubic-bezier(0.34,1.2,0.64,1) forwards;}
@keyframes floodsweep{
  0%{opacity:0;transform:scaleX(1) rotate(-30deg);}
  30%{opacity:0.7;}
  60%{opacity:0.3;transform:scaleX(1) rotate(5deg);}
  100%{opacity:0.08;transform:scaleX(1) rotate(0deg);}
}

/* TICKER */
.ticker{
  background:var(--red);
  border-bottom:2px solid var(--gold);
  padding:8px 0;overflow:hidden;white-space:nowrap;
  position:relative;z-index:200;
}
.ticker-inner{
  display:inline-block;
  animation:tick 55s linear infinite;
  font-family:'Share Tech Mono',monospace;
  font-size:0.72rem;letter-spacing:0.08em;color:#fff;
}
@keyframes tick{from{transform:translate3d(100vw,0,0);}to{transform:translate3d(-100%,0,0);}}
.t-sep{margin:0 28px;color:var(--gold);}

/* NAV */
.nav{
  position:sticky;top:0;z-index:300;
  background:#080000;
  border-bottom:2px solid rgba(204,0,0,0.4);
  padding:0 48px;height:64px;
  display:flex;align-items:center;justify-content:space-between;
}
.nav::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),var(--red),var(--gold),transparent);
  opacity:0.7;
}

.nav-logo{
  font-family:'Bebas Neue',sans-serif;
  font-size:1.6rem;color:var(--red);
  text-decoration:none;letter-spacing:0.12em;
  text-shadow:0 0 20px rgba(204,0,0,0.8),0 0 50px rgba(204,0,0,0.3);
  display:flex;align-items:center;gap:12px;
}
.rcb-emblem{
  width:36px;height:36px;position:relative;flex-shrink:0;
}
.rcb-emblem svg{opacity:0.95;}

.nav-ul{display:flex;gap:4px;list-style:none;align-items:center;}
.nav-ul a{
  font-family:'Bebas Neue',sans-serif;font-size:0.9rem;
  color:var(--muted);text-decoration:none;
  letter-spacing:0.12em;padding:5px 12px;
  border:1px solid transparent;transition:all 0.18s;
}
.nav-ul a:hover{color:var(--red);border-color:var(--border);background:rgba(204,0,0,0.06);}
.nav-res{color:var(--gold)!important;border-color:rgba(255,215,0,0.3)!important;background:rgba(255,215,0,0.06)!important;}
.nav-res:hover{background:rgba(255,215,0,0.14)!important;box-shadow:var(--gglow)!important;}

/* MAIN */
.arena{position:relative;z-index:2;max-width:1100px;margin:0 auto;padding:0 28px 100px;}

/* SECTION HEADER */
.sh{display:flex;align-items:flex-end;gap:14px;padding:60px 0 26px;}
.sh-n{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:var(--gold);letter-spacing:0.2em;margin-bottom:7px;opacity:0.7;}
.sh-t{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4.5vw,3.2rem);color:#fff;letter-spacing:0.08em;line-height:1;text-shadow:2px 2px 0 rgba(204,0,0,0.4);}
.sh-r{flex:1;height:2px;background:linear-gradient(90deg,var(--red),rgba(255,215,0,0.5),transparent);margin-bottom:7px;}
.sh-tag{font-family:'Share Tech Mono',monospace;font-size:0.58rem;color:var(--muted);letter-spacing:0.14em;margin-bottom:7px;white-space:nowrap;}

/* PANEL */
.panel{
  background:linear-gradient(135deg,rgba(22,4,4,0.97),rgba(12,0,0,0.99));
  border:1px solid rgba(255,255,255,0.05);
  border-top:2px solid var(--red);
  padding:40px 48px;position:relative;overflow:hidden;
  content-visibility:auto;
  contain-intrinsic-size:auto 200px;
}
.panel::after{content:'';position:absolute;bottom:0;right:0;width:120px;height:120px;background:radial-gradient(circle,rgba(204,0,0,0.06),transparent);pointer-events:none;}

/* CORNER FIRE - static */
.cf-corner{position:absolute;font-size:1.4rem;opacity:0.12;}
.cf-tl{top:12px;left:16px;} .cf-tr{top:12px;right:16px;}
.cf-bl{bottom:12px;left:16px;} .cf-br{bottom:12px;right:16px;}

/* ══ HERO ══ */
.hero{
  min-height:96vh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  text-align:center;position:relative;padding-top:10px;
  gap:0;
}

/* RCB RING */
.rcb-ring-wrap{
  position:relative;width:240px;height:240px;margin-bottom:8px;
  animation:fadeup 0.8s 0.3s ease both;
}
.ring{
  position:absolute;inset:0;border-radius:50%;
  border:2px solid transparent;
  animation:ringspin linear infinite;
}
.ring1{border-color:rgba(204,0,0,0.6) transparent transparent transparent;animation-duration:8s;}
.ring2{inset:14px;border-color:rgba(255,215,0,0.5) transparent transparent transparent;animation-duration:12s;animation-direction:reverse;}
.ring2,.ring1{transform:translateZ(0);}
@keyframes ringspin{from{transform:rotate(0deg) translateZ(0);}to{transform:rotate(360deg) translateZ(0);}}
.ring-center{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);
  width:140px;height:140px;border-radius:50%;
  background:radial-gradient(circle,rgba(204,0,0,0.15),rgba(0,0,0,0.8));
  border:2px solid rgba(204,0,0,0.4);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  box-shadow:0 0 40px rgba(204,0,0,0.3),inset 0 0 30px rgba(204,0,0,0.1);
}
.rc-num{font-family:'Bebas Neue',sans-serif;font-size:3.5rem;color:var(--red);line-height:1;text-shadow:0 0 20px rgba(204,0,0,0.9);}
.rc-label{font-family:'Share Tech Mono',monospace;font-size:0.5rem;color:var(--gold);letter-spacing:0.18em;}

/* TYPEWRITER */
.typewriter{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(1rem,2.5vw,1.6rem);
  color:var(--gold);letter-spacing:0.22em;
  text-shadow:0 0 20px rgba(255,215,0,0.5);
  margin-bottom:12px;min-height:2rem;
  animation:fadeup 0.8s 0.2s ease both;
}
.tw-cursor{animation:blink 0.7s step-end infinite;color:var(--red);}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}

.hero-name{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(3.5rem,12vw,10.5rem);
  color:#fff;line-height:0.88;letter-spacing:0.06em;
  text-shadow:4px 4px 0 rgba(204,0,0,0.4),0 0 80px rgba(204,0,0,0.1);
  animation:fadeup 0.8s 0.5s ease both;
}
.hero-name span{
  color:var(--red);
  text-shadow:0 0 40px rgba(204,0,0,0.9),4px 4px 0 rgba(120,0,0,0.5);
}
.hero-role{
  font-family:'Barlow',sans-serif;font-size:clamp(0.95rem,2vw,1.3rem);
  font-weight:300;font-style:italic;color:var(--muted);
  letter-spacing:0.1em;margin-bottom:8px;
  animation:fadeup 0.8s 0.7s ease both;
}
@keyframes fadeup{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}

/* SCOREBOARD */
.scoreboard{
  background:linear-gradient(135deg,#1a0800,#0d0400);
  border:2px solid var(--gold);
  border-radius:4px;padding:16px 28px;
  display:flex;gap:24px;align-items:center;
  margin:18px 0 20px;
  box-shadow:0 0 50px rgba(255,215,0,0.12),inset 0 1px 0 rgba(255,215,0,0.2);
  animation:fadeup 0.8s 0.9s ease both;
  flex-wrap:wrap;justify-content:center;
}
.sb-item{text-align:center;min-width:70px;}
.sb-lbl{font-family:'Share Tech Mono',monospace;font-size:0.5rem;color:var(--muted);letter-spacing:0.16em;text-transform:uppercase;margin-bottom:4px;}
.sb-val{font-family:'Bebas Neue',sans-serif;font-size:2.2rem;color:var(--gold);line-height:1;text-shadow:0 0 14px rgba(255,215,0,0.6);}
.sb-val.red{color:var(--red);text-shadow:0 0 14px rgba(204,0,0,0.7);}
.sb-div{width:1px;height:50px;background:rgba(255,215,0,0.2);}
.live-badge{
  background:var(--red);color:#fff;
  font-family:'Share Tech Mono',monospace;font-size:0.56rem;
  letter-spacing:0.18em;padding:4px 12px;
}

/* FIREBALL CANVAS */
#ball-canvas{position:absolute;inset:0;pointer-events:none;z-index:5;}

/* PLAY BOLD BUTTON */
.pb-btn{
  font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:0.18em;
  background:linear-gradient(135deg,var(--red),#aa0000);
  color:#fff;border:none;
  padding:14px 40px;cursor:pointer;
  box-shadow:0 4px 24px rgba(204,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.15);
  transition:all 0.2s;position:relative;overflow:hidden;
  animation:fadeup 0.8s 1.1s ease both;
}
.pb-btn:hover{transform:translateY(-4px) scale(1.03);box-shadow:0 8px 36px rgba(204,0,0,0.7);}
.pb-btn:active{transform:translateY(0) scale(0.98);}

.ctas{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;animation:fadeup 0.8s 1.2s ease both;margin-top:18px;}
.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;font-family:'Bebas Neue',sans-serif;font-size:0.95rem;letter-spacing:0.12em;text-decoration:none;transition:all 0.2s;cursor:pointer;border:none;}
.btn-r{background:var(--red);color:#fff;box-shadow:0 4px 18px rgba(204,0,0,0.35);}
.btn-r:hover{background:var(--red2);transform:translateY(-3px);box-shadow:0 8px 28px rgba(204,0,0,0.6);}
.btn-g{background:rgba(255,215,0,0.1);color:var(--gold);border:1.5px solid rgba(255,215,0,0.4);}
.btn-g:hover{background:rgba(255,215,0,0.2);transform:translateY(-3px);box-shadow:var(--gglow);}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:44px;align-items:start;}
.bio p{font-size:0.97rem;font-weight:300;line-height:1.9;color:#d8c8b8;margin-bottom:13px;}
.bio strong{color:var(--gold);}
.jersey{
  background:linear-gradient(160deg,#1a0404,#0d0000);
  border:1.5px solid rgba(204,0,0,0.4);border-radius:4px;
  overflow:hidden;box-shadow:0 0 40px rgba(204,0,0,0.08);
}
.jersey-top{
  background:linear-gradient(90deg,var(--red),#990000,var(--red));
  padding:14px 20px;font-family:'Bebas Neue',sans-serif;
  font-size:1rem;letter-spacing:0.14em;color:#fff;
  display:flex;justify-content:space-between;align-items:center;
  border-bottom:2px solid var(--gold);
}
.jersey-num{font-family:'Bebas Neue',sans-serif;font-size:2rem;color:var(--gold);text-shadow:0 0 10px rgba(255,215,0,0.5);}
.jr-row{display:flex;border-bottom:1px solid rgba(255,255,255,0.04);padding:10px 18px;gap:10px;}
.jr-row:last-child{border-bottom:none;}
.jr-k{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:var(--muted);min-width:120px;letter-spacing:0.06em;}
.jr-v{font-size:0.9rem;font-weight:400;color:#e0d0c0;}
.jr-v.gold{color:var(--gold);font-weight:600;}
.jr-v.green{color:#22ee66;}

/* FLAME PROGRESS BARS */
.skill-row{padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;flex-direction:column;gap:8px;}
.skill-row:last-child{border-bottom:none;}
.sk-meta{display:flex;justify-content:space-between;align-items:center;}
.sk-cat{font-family:'Bebas Neue',sans-serif;font-size:0.95rem;color:#fff;letter-spacing:0.06em;}
.sk-pct{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:var(--gold);letter-spacing:0.1em;}
.sk-bar-track{height:6px;background:rgba(255,255,255,0.05);border-radius:3px;overflow:hidden;position:relative;}
.sk-bar-fill{
  height:100%;border-radius:3px;width:0%;
  background:linear-gradient(90deg,var(--red),var(--red2),var(--gold));
  transition:width 1.4s cubic-bezier(0.34,1.4,0.64,1);
  box-shadow:0 0 8px rgba(204,0,0,0.6),0 0 16px rgba(255,100,0,0.3);
  position:relative;
}
.sk-bar-fill::after{
  content:'🔥';position:absolute;right:-2px;top:50%;
  transform:translateY(-50%);font-size:10px;
}
.sk-tags{display:flex;flex-wrap:wrap;gap:5px;}
.sk-tag{font-size:0.76rem;font-weight:300;color:#c0a898;border:1px solid rgba(204,0,0,0.2);padding:3px 9px;background:rgba(204,0,0,0.04);transition:all 0.18s;cursor:default;}
.sk-tag:hover{background:rgba(204,0,0,0.12);border-color:rgba(204,0,0,0.5);color:#fff;}

/* PROJECTS — MATCH CARDS */
.matches-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.match{
  background:rgba(20,4,4,0.9);
  border:1px solid rgba(204,0,0,0.15);
  padding:18px;position:relative;overflow:hidden;
  display:flex;flex-direction:column;gap:8px;
  transition:transform 0.2s ease-out,border-color 0.2s,opacity 0.2s;cursor:default;
}
.match::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 100%,rgba(204,0,0,0.08),transparent 60%);
  opacity:0;transition:opacity 0.3s;
}
.match::after{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--red),var(--gold),var(--red));
  opacity:0;transition:opacity 0.3s;
}
.match:hover{border-color:rgba(204,0,0,0.5);transform:translateY(-4px) scale(1.01);}
.match:hover::before,.match:hover::after{opacity:1;}
.m-format{font-family:'Share Tech Mono',monospace;font-size:0.52rem;color:var(--red3);letter-spacing:0.14em;text-transform:uppercase;}
.m-title{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:#fff;line-height:1.2;letter-spacing:0.05em;}
.m-result{font-family:'Bebas Neue',sans-serif;font-size:0.78rem;color:var(--gold);letter-spacing:0.08em;}
.m-desc{font-size:0.77rem;font-weight:300;color:var(--muted);line-height:1.7;flex:1;}
.tech{display:flex;flex-wrap:wrap;gap:4px;}
.tech span{font-family:'Share Tech Mono',monospace;font-size:0.52rem;color:var(--muted);border:1px solid rgba(255,255,255,0.07);padding:2px 6px;background:rgba(255,255,255,0.02);}
.plinks{display:flex;gap:11px;margin-top:3px;}
.plink{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:var(--red3);text-decoration:none;letter-spacing:0.04em;transition:all 0.18s;border-bottom:1px solid transparent;}
.plink:hover{color:var(--gold);border-bottom-color:var(--gold);}

/* EXP */
.exp-tl{display:flex;flex-direction:column;}
.tl-item{padding:20px 0 20px 32px;border-left:2px solid rgba(204,0,0,0.25);position:relative;}
.tl-dot{position:absolute;left:-8px;top:24px;width:14px;height:14px;border-radius:50%;background:var(--red);box-shadow:0 0 14px rgba(204,0,0,0.8);}
.tl-dot.old{background:var(--muted);box-shadow:none;}
.ex-role{font-family:'Bebas Neue',sans-serif;font-size:1.15rem;color:#fff;letter-spacing:0.05em;}
.ex-co{font-size:0.9rem;font-style:italic;color:var(--gold);}
.ex-per{display:inline-block;font-family:'Share Tech Mono',monospace;font-size:0.56rem;color:var(--red3);letter-spacing:0.1em;margin:5px 0 10px;background:rgba(204,0,0,0.08);border:1px solid var(--border);padding:3px 10px;}
.ex-ul{list-style:none;}
.ex-ul li{font-size:0.86rem;font-weight:300;color:var(--muted);line-height:1.74;padding-left:16px;position:relative;margin-bottom:4px;}
.ex-ul li::before{content:'🔴';position:absolute;left:0;font-size:0.5rem;top:5px;}

/* RESEARCH — CHAMPIONS TROPHY */
.champ{border:2px solid var(--gold);overflow:hidden;box-shadow:0 0 50px rgba(255,215,0,0.1);}
.champ-banner{
  background:linear-gradient(90deg,#1a0e00,rgba(255,215,0,0.12),#1a0e00);
  border-bottom:1px solid rgba(255,215,0,0.35);
  padding:14px 28px;text-align:center;
  display:flex;align-items:center;justify-content:center;gap:16px;
}
.champ-icon{font-size:1.8rem;}
.champ-title{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:var(--gold);letter-spacing:0.14em;text-shadow:0 0 20px rgba(255,215,0,0.5);}
.champ-body{padding:26px 30px;}
.c-title{font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:#fff;line-height:1.3;margin-bottom:9px;letter-spacing:0.04em;}
.c-authors{font-size:0.86rem;font-style:italic;color:var(--gold);margin-bottom:10px;}
.c-meta{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px;}
.c-meta span{font-family:'Share Tech Mono',monospace;font-size:0.56rem;color:var(--muted);background:rgba(255,215,0,0.05);border:1px solid var(--gborder);padding:3px 9px;}
.c-abs{font-size:0.86rem;font-weight:300;line-height:1.88;color:#d0c0b0;border-left:3px solid var(--gold);padding-left:14px;margin-bottom:14px;font-style:italic;}
.c-kws{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}
.c-kw{font-family:'Share Tech Mono',monospace;font-size:0.56rem;color:var(--red3);border:1px solid rgba(255,68,34,0.3);padding:3px 8px;background:rgba(255,68,34,0.06);}

/* CONTACT */
.contact-cols{display:grid;grid-template-columns:1fr 1fr;gap:44px;}
.c-intro{font-size:0.97rem;font-weight:300;color:var(--muted);line-height:1.84;margin-bottom:26px;font-style:italic;}
.cf-form{display:flex;flex-direction:column;gap:13px;}
.cf-lbl{font-family:'Share Tech Mono',monospace;font-size:0.56rem;color:var(--muted);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:2px;display:block;}
.fi{font-family:'Barlow',sans-serif;font-size:0.92rem;font-weight:300;background:rgba(204,0,0,0.04);border:1px solid rgba(204,0,0,0.2);padding:11px 14px;color:#e0d0c0;outline:none;transition:all 0.2s;width:100%;}
.fi:focus{border-color:var(--red);box-shadow:0 0 14px rgba(204,0,0,0.12);}
.fta{font-family:'Barlow',sans-serif;font-size:0.92rem;font-weight:300;background:rgba(204,0,0,0.04);border:1px solid rgba(204,0,0,0.2);padding:11px 14px;color:#e0d0c0;outline:none;transition:all 0.2s;width:100%;resize:vertical;min-height:115px;}
.fta:focus{border-color:var(--red);box-shadow:0 0 14px rgba(204,0,0,0.12);}
.fsub{font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:0.12em;background:linear-gradient(135deg,var(--red),#aa0000);color:#fff;border:none;padding:12px 32px;cursor:pointer;transition:all 0.2s;align-self:flex-start;box-shadow:0 4px 18px rgba(204,0,0,0.35);}
.fsub:hover{transform:translateY(-3px);background:linear-gradient(135deg,var(--red2),var(--red));box-shadow:0 8px 30px rgba(204,0,0,0.55);}
.fsub:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
.fst-ok{font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:#22ee66;letter-spacing:0.08em;}
.fst-err{font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:var(--red3);}
.soc-list{display:flex;flex-direction:column;}
.soc{display:flex;align-items:center;gap:14px;text-decoration:none;color:#d0c0b0;font-size:0.92rem;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);transition:all 0.2s;}
.soc:last-child{border-bottom:none;}
.soc:hover{color:var(--red);padding-left:5px;}
.soc-ic{width:32px;height:32px;background:rgba(204,0,0,0.08);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:var(--red);flex-shrink:0;}

/* CROWD - static gradient (no per-element animation) */
.crowd-fixed{
  position:fixed;bottom:0;left:0;right:0;height:48px;pointer-events:none;z-index:0;
  background:linear-gradient(180deg,transparent 0%,rgba(204,0,0,0.08) 20%,rgba(255,68,34,0.12) 50%,rgba(255,215,0,0.06) 80%,transparent 100%);
}

/* EE SALA BANNER - static */
.ee-sala{
  text-align:center;padding:28px;
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(1.5rem,4vw,3rem);
  color:var(--red);letter-spacing:0.16em;
  text-shadow:0 0 30px rgba(204,0,0,0.5);
  border-top:1px solid rgba(204,0,0,0.2);
  border-bottom:1px solid rgba(204,0,0,0.2);
  margin:40px 0;
}

/* FOOTER */
.foot{text-align:center;padding:44px 28px;position:relative;z-index:2;border-top:2px solid rgba(204,0,0,0.25);}
.foot-fire{display:flex;justify-content:center;gap:8px;margin-bottom:14px;font-size:1.2rem;}
.foot p{font-family:'Share Tech Mono',monospace;font-size:0.64rem;color:var(--muted);letter-spacing:0.14em;}
.foot span{color:var(--red);}

/* Scroll progress bar */
.scroll-progress{
  position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--red),var(--gold));
  z-index:400;transform-origin:left;
  transform:translateZ(0);
}

/* Active nav link */
.nav-ul a.nav-active{color:var(--red)!important;border-color:var(--border);background:rgba(204,0,0,0.08);}

/* Back to top */
.back-top{
  position:fixed;bottom:80px;right:24px;z-index:250;
  width:48px;height:48px;border-radius:50%;
  background:linear-gradient(135deg,var(--red),#aa0000);
  border:2px solid var(--gold);
  color:#fff;font-size:1.2rem;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(204,0,0,0.5);
  opacity:0;visibility:hidden;transform:translateY(12px);
  transition:opacity 0.25s, transform 0.25s, visibility 0.25s;
}
.back-top.visible{opacity:1;visibility:visible;transform:translateY(0);}
.back-top:hover{transform:translateY(-4px) scale(1.05);box-shadow:0 8px 28px rgba(204,0,0,0.7);}

/* Ticker pause on hover */
.ticker.ticker-paused .ticker-inner{animation-play-state:paused;}

/* Expandable match card */
.match.expanded .m-desc{display:block;}
.match .m-desc{transition:all 0.3s;}
.match .expand-btn{
  font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:var(--gold);
  letter-spacing:0.1em;margin-top:6px;cursor:pointer;opacity:0.8;
  background:none;border:none;padding:4px 0;align-self:flex-start;
  transition:opacity 0.2s;
}
.match .expand-btn:hover{opacity:1;color:#fff;}
.match.expanded .expand-btn::before{content:'▼ ';}
.match:not(.expanded) .expand-btn::before{content:'▶ ';}

/* Staggered match card entrance */
.match-card-enter{opacity:0;transform:translateY(24px);}
.match-card-enter.visible{opacity:1;transform:translateY(0);}

/* Confetti container */
.confetti-wrap{position:fixed;inset:0;pointer-events:none;z-index:600;}
.confetti-dot{
  position:absolute;width:8px;height:8px;border-radius:50%;
  animation:confetti-fall 2.5s ease-out forwards;
}

@keyframes confetti-fall{
  0%{opacity:1;transform:translateY(-20px) rotate(0deg);}
  100%{opacity:0;transform:translateY(100vh) rotate(720deg);}
}

/* Scoreboard click to re-animate */
.sb-item.clickable{cursor:pointer;}
.sb-item.clickable .sb-val{transition:transform 0.2s;}
.sb-item.clickable:hover .sb-val{transform:scale(1.08);}

@media(max-width:820px){
  .nav{padding:0 16px;}
  .nav-ul li:not(:last-child):not(:nth-last-child(2)){display:none;}
  .panel{padding:28px 20px;}
  .about-grid,.contact-cols{grid-template-columns:1fr;}
  .matches-grid{grid-template-columns:1fr;}
  .scoreboard{gap:16px;}
  .hero-name{font-size:19vw;}
  .back-top{bottom:70px;right:16px;width:44px;height:44px;}
}
`;

// ── Data ──
const TICKER_TEXT = [
  "🔴 EE SALA CUP NAMDE",
  "🏏 SARTHAK PAPNEJA — VIT CHENNAI — CLASS OF 2026",
  "🔥 PLAY BOLD",
  "⚡ 9 PROJECTS · 8.67 CGPA · PUBLISHED RESEARCHER",
  "🏆 Q-NOTARY: POST-QUANTUM CRYPTOGRAPHY — IJVRA 2026",
  "🎯 GASTRO-XAI — 83% ACCURACY",
  "💥 AI · CLOUD · FULL-STACK — THE COMPLETE ALL-ROUNDER",
  "🌟 SEEKING MSc AI/ML — GERMANY 2026",
  "🔴 IN VIRAT WE TRUST",
].join("     🔴     ");

const PROJECTS = [
  {format:"T20 · AI/XAI",title:"Gastro-XAI",result:"83% ACC · 6️⃣",desc:"Explainable AI for gastrointestinal disease classification. Grad-CAM visualisations + automated clinical reports.",tech:["Python","PyTorch","Flask","React","Grad-CAM"],gh:"https://github.com/sarthakpapneja/Gastro-XAI",live:null},
  {format:"TEST · AI/AUDIT",title:"ModelAuditAI",result:"5-DIM AUDIT · 4️⃣",desc:"Production ML audit system — Performance, Fairness, Drift, Overfitting, Leakage.",tech:["TypeScript","React","Python","FastAPI"],gh:"https://github.com/sarthakpapneja/ML-Auditor",live:null},
  {format:"ODI · NLP",title:"Resume Analyzer",result:"ATS ✅ · 4️⃣",desc:"Intelligent resume parsing — skill gap analysis and ATS compatibility scoring.",tech:["TypeScript","React","Python","NLP"],gh:"https://github.com/sarthakpapneja/resume-analyzer",live:null},
  {format:"T20 · FULLSTACK",title:"Finance Track",result:"MERN · 6️⃣",desc:"Finance tracker — transaction management, balance computation, data visualisation.",tech:["JavaScript","React","Node.js","MongoDB"],gh:"https://github.com/sarthakpapneja/Finance-Track",live:null},
  {format:"ODI · AI/FIN",title:"Regulatory Reporting",result:"AUTOMATED · W",desc:"AI-powered regulatory compliance assistant streamlining reporting workflows.",tech:["Python","Flask","AI/ML"],gh:"https://github.com/sarthakpapneja/Regulatory-Reporting-Assistant",live:null},
  {format:"T20 · CV",title:"RoadVision VMS",result:"LIVE TRACK · 4️⃣",desc:"Vehicle Management via computer vision — road monitoring and traffic analysis.",tech:["Python","Computer Vision","Deep Learning"],gh:"https://github.com/sarthakpapneja/RoadVision-VMS",live:null},
  {format:"ODI · WEB",title:"School Website",result:"DEPLOYED · W",desc:"Full-featured institutional website — dynamic content, event management, responsive.",tech:["JavaScript","React","Vite","CSS"],gh:"https://github.com/sarthakpapneja/school-website-",live:"https://school-website-murex-seven.vercel.app/"},
  {format:"TEST · DB",title:"Bank Security System",result:"RBAC SECURE · W",desc:"Bank management with Role-Based Access Control and data segregation.",tech:["Python","MySQL","RBAC"],gh:"https://github.com/sarthakpapneja/banksecuritysystem",live:null},
  {format:"T20 · DATA",title:"Table Detection Model",result:"OCR INT · 4️⃣",desc:"TableNet/VGG-19 encoder-decoder for table detection with integrated OCR.",tech:["Deep Learning","Python","OCR","VGG-19"],gh:null,live:"https://colab.research.google.com/drive/1xpn7qXNKuUoMzCklZjbyLiv23v8SheIN?usp=sharing"},
];

const SKILLS = [
  {cat:"Core Concepts",tags:["Computer Architecture","AI","DBMS","OS","Networks","OOP"],pct:92},
  {cat:"Languages",tags:["C","C++","Java","JavaScript","Python","TypeScript"],pct:95},
  {cat:"Web & Frameworks",tags:["ReactJS","Next.js","Tailwind","Flask","FastAPI","Node.js"],pct:88},
  {cat:"AI / ML",tags:["PyTorch","Deep Learning","CV","NLP","Grad-CAM","XAI"],pct:90},
  {cat:"Data & Analytics",tags:["SQL","PowerBI","Tableau","MySQL","MongoDB"],pct:83},
  {cat:"Cloud & Infra",tags:["AWS EC2","IAM","VPC","S3","RDS","CloudFront"],pct:78},
];

const EXP = [
  {role:"Cloud Intern",co:"Velocis Systems, Noida",period:"Jun–Jul 2025",active:true,bullets:["AWS & GCP: EC2, IAM, VPC, RDS, CloudFront, Load Balancer.","Supported enterprise-grade solutions in fast-paced project environments."]},
  {role:"Operations Member",co:"Android Club, VIT Chennai",period:"Jun 2023–Present",active:true,bullets:["Organised technical events; delivered UI/UX seminar session.","Collaborated with teams ensuring on-time delivery.","Drove operational improvements through leadership."]},
  {role:"UI/UX Member",co:"Microsoft Innovations Club",period:"Sep–Nov 2023",active:false,bullets:["Redesigned event interfaces with advanced UI principles.","Boosted user access 30%; cut registration time 20%."]},
  {role:"Core Developer",co:"Smart India Hackathon",period:"Various",active:false,bullets:["Core developer in national-level competition."]},
];

const RKW=["Post-Quantum Crypto","SPHINCS+","IPFS","Verifiable Credentials","Decentralized Notary","Quantum-Resistant"];

// ── Confetti (fewer particles for performance) ──
function Confetti({ trigger }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!trigger) return;
    const colors = ['#cc0000', '#ff4422', '#ffd700', '#ffaa00', '#fff'];
    const list = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.3,
      duration: 2 + Math.random() * 0.8,
      size: 6 + Math.random() * 4,
    }));
    setParticles(list);
    const t = setTimeout(() => setParticles([]), 2800);
    return () => clearTimeout(t);
  }, [trigger]);
  if (particles.length === 0) return null;
  return (
    <div className="confetti-wrap">
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-dot"
          style={{
            left: `${p.left}%`,
            top: '50%',
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

// ── Fireball Canvas ──
function FireballCanvas({ shoot, onDone }) {
  const ref = useRef(null);
  const raf = useRef(null);
  const lastLabel = useRef('');
  useEffect(() => {
    if (!shoot) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width, H = canvas.height;
    const variants = [
      { ex: W * 0.85, ey: H * 0.05, label: "SIX! 🔴", color: '#ff2200' },
      { ex: W * 0.12, ey: H * 0.1, label: "SIX! PLAY BOLD 🔥", color: '#ff6600' },
      { ex: W * 0.75, ey: H * 0.45, label: "FOUR! 🔴", color: '#ffaa00' },
    ];
    const v = variants[Math.floor(Math.random() * variants.length)];
    const sx = W * 0.5, sy = H * 0.65;
    let t = 0, trail = [];
    const FRAMES = 100;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const p = t / FRAMES;
      const x = sx + (v.ex - sx) * p;
      const y = sy + (v.ey - sy) * p - Math.sin(p * Math.PI) * H * 0.38;
      trail.push({ x, y, p });
      if (trail.length > 35) trail.shift();
      trail.forEach((pt, i) => {
        const a = (i / trail.length) * (1 - pt.p) * 0.7;
        const r = (i / trail.length) * 10 + 2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
        g.addColorStop(0, `rgba(255,200,0,${a})`);
        g.addColorStop(0.5, `rgba(255,80,0,${a * 0.6})`);
        g.addColorStop(1, `rgba(204,0,0,0)`);
        ctx.fillStyle = g;
        ctx.fill();
      });
      // fireball
      const R = 14;
      const bg = ctx.createRadialGradient(x - 3, y - 3, 1, x, y, R);
      bg.addColorStop(0, '#fff');
      bg.addColorStop(0.3, '#ffcc00');
      bg.addColorStop(0.7, v.color);
      bg.addColorStop(1, 'rgba(100,0,0,0)');
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.shadowBlur = 24; ctx.shadowColor = v.color;
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.shadowBlur = 0;
      // seam
      ctx.beginPath();
      ctx.arc(x, y, R * 0.7, 0.3, Math.PI - 0.3);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (t === Math.floor(FRAMES * 0.45)) {
        lastLabel.current = v.label;
        ctx.font = 'bold 20px Bebas Neue, sans-serif';
        ctx.fillStyle = v.color;
        ctx.shadowBlur = 10; ctx.shadowColor = v.color;
        ctx.textAlign = 'center';
        ctx.fillText(v.label, x, y - 24);
        ctx.shadowBlur = 0;
      }
      t++;
      if (t < FRAMES + 15) raf.current = requestAnimationFrame(draw);
      else { ctx.clearRect(0, 0, W, H); onDone && onDone(lastLabel.current.includes('SIX')); }
    };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [shoot]);
  return (
    <canvas ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
    />
  );
}

// ── Typewriter (throttled for smoothness) ──
function Typewriter({ texts }) {
  const [display, setDisplay] = useState('');
  const [ti, setTi] = useState(0);
  const [ci, setCi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const text = texts[ti];
    const speed = deleting ? 60 : 120;
    const t = setTimeout(() => {
      if (!deleting) {
        if (ci < text.length) { setDisplay(text.slice(0, ci + 1)); setCi(c => c + 1); }
        else setTimeout(() => setDeleting(true), 2000);
      } else {
        if (ci > 0) { setDisplay(text.slice(0, ci - 1)); setCi(c => c - 1); }
        else { setDeleting(false); setTi(i => (i + 1) % texts.length); setCi(0); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [ci, deleting, ti, texts]);
  return <div className="typewriter">{display}<span className="tw-cursor">|</span></div>;
}

// ── Counter ──
function useCounter(target, dur = 1600, go = false) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!go) return;
    let cur = 0; const step = target / 60;
    const i = setInterval(() => { cur = Math.min(cur + step, target); setV(Math.round(cur)); if (cur >= target) clearInterval(i); }, dur / 60);
    return () => clearInterval(i);
  }, [target, dur, go]);
  return v;
}

// ── RCB Emblem (2 rings for performance) ──
function RCBEmblem() {
  return (
    <div className="rcb-ring-wrap">
      <div className="ring ring1" />
      <div className="ring ring2" />
      <div className="ring-center">
        <div className="rc-num">18</div>
        <div className="rc-label">PLAY BOLD</div>
      </div>
    </div>
  );
}

// ── Main ──
const SECTIONS = ['hero', 'about', 'projects', 'skills', 'experience', 'contact'];

export default function Portfolio() {
  const [shooting, setShooting] = useState(false);
  const [statsVis, setStatsVis] = useState(false);
  const [skillsVis, setSkillsVis] = useState(false);
  const [skillsFilled, setSkillsFilled] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [scrollPct, setScrollPct] = useState(0);
  const [backTopVisible, setBackTopVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [tickerPaused, setTickerPaused] = useState(false);
  const [expandedProject, setExpandedProject] = useState(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [projectsVisible, setProjectsVisible] = useState(false);
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);

  const proj = useCounter(9, 1400, statsVis);
  const cgpa = useCounter(867, 1600, statsVis);
  const runs = useCounter(8670, 1800, statsVis);
  const wins = useCounter(100, 1200, statsVis);

  useEffect(() => {
    const o1 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVis(true); }, { threshold: 0.3 });
    const o2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSkillsVis(true); setTimeout(() => setSkillsFilled(true), 200); } }, { threshold: 0.2 });
    const o3 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setProjectsVisible(true); }, { threshold: 0.1 });
    if (heroRef.current) o1.observe(heroRef.current);
    if (skillsRef.current) o2.observe(skillsRef.current);
    if (projectsRef.current) o3.observe(projectsRef.current);
    return () => { o1.disconnect(); o2.disconnect(); o3.disconnect(); };
  }, []);

  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const y = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        setScrollPct(docH > 0 ? Math.min((y / docH) * 100, 100) : 0);
        setBackTopVisible(y > 400);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          for (const e of entries) {
            if (e.isIntersecting) setActiveSection(e.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-60px 0px -20% 0px' }
    );
    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const fireShot = () => { if (shooting) return; setShooting(true); };
  const handleFireballDone = (isSix) => {
    setShooting(false);
    if (isSix) setConfettiTrigger(c => c + 1);
  };

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault(); setStatus('sending');
    try {
      const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ access_key: 'd9743274-bd82-40a7-9d2b-b6b785c6c275', subject: 'New Contact from Portfolio', from_name: 'Portfolio Contact Form', ...form }) });
      if (r.ok) { setStatus('ok'); setForm({ name: '', email: '', message: '' }); } else setStatus('err');
    } catch { setStatus('err'); }
  };

  return (<>
    <style>{CSS}</style>
    <div className="scroll-progress" style={{ transform: `translateZ(0) scaleX(${scrollPct / 100})` }} />
    <div className="fire-ambient" />
    <div className="crowd-fixed" />
    <Confetti trigger={confettiTrigger} />
    <button type="button" className={`back-top ${backTopVisible ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button>

    {/* FLOODLIGHTS */}
    <div className="floodlight fl-l" />
    <div className="floodlight fl-r" />
    <div className="floodlight fl-l2" />
    <div className="floodlight fl-r2" />

    {/* TICKER */}
    <div className={`ticker ${tickerPaused ? 'ticker-paused' : ''}`} onMouseEnter={() => setTickerPaused(true)} onMouseLeave={() => setTickerPaused(false)}>
      <div className="ticker-inner">{TICKER_TEXT}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{TICKER_TEXT}</div>
    </div>

    <div className="stadium">
      {/* NAV */}
      <nav className="nav">
        <a href="#" className="nav-logo">
          <div className="rcb-emblem">
            <svg viewBox="0 0 36 36" fill="none" width="36" height="36">
              <circle cx="18" cy="18" r="16" stroke="#cc0000" strokeWidth="2" fill="rgba(204,0,0,0.08)" />
              <circle cx="18" cy="18" r="11" stroke="#ffd700" strokeWidth="1.5" fill="none" />
              <circle cx="18" cy="18" r="5" fill="#cc0000" />
              <text x="18" y="22" textAnchor="middle" fill="#ffd700" fontFamily="Bebas Neue" fontSize="6" letterSpacing="0.5">RCB</text>
            </svg>
          </div>
          SP · RCB
        </a>
        <ul className="nav-ul">
          <li><a href="#hero" className={activeSection === 'hero' ? 'nav-active' : ''}>Player</a></li>
          <li><a href="#about" className={activeSection === 'about' ? 'nav-active' : ''}>About</a></li>
          <li><a href="#projects" className={activeSection === 'projects' ? 'nav-active' : ''}>Innings</a></li>
          <li><a href="#skills" className={activeSection === 'skills' ? 'nav-active' : ''}>Skills</a></li>
          <li><a href="#experience" className={activeSection === 'experience' ? 'nav-active' : ''}>Career</a></li>
          <li><a href="#contact" className={activeSection === 'contact' ? 'nav-active' : ''}>Sign</a></li>
          <li><a href="https://drive.google.com/file/d/1u3hQLi61BAbKneym4_QYbEXHYJYvHuio/view?usp=sharing" target="_blank" rel="noreferrer" className="nav-res">Résumé</a></li>
        </ul>
      </nav>

      <div className="arena">

        {/* ── HERO ── */}
        <section className="hero" id="hero" ref={heroRef} style={{ position: 'relative' }}>
          <FireballCanvas shoot={shooting} onDone={handleFireballDone} />

          <RCBEmblem />
          <Typewriter texts={["EE SALA CUP NAMDE 🔴", "PLAY BOLD 🔥", "IN VIRAT WE TRUST ⚡", "AVAILABLE 2026 🏏"]} />
          <div className="hero-name">SARTHAK<br /><span>PAPNEJA</span></div>
          <div className="hero-role">Aspiring Software Engineer · AI · Cloud · Full-Stack</div>

          {/* SCOREBOARD */}
          <div className="scoreboard">
            <div className="sb-item">
              <div className="sb-lbl">Career Runs</div>
              <div className="sb-val">{statsVis ? runs : 0}</div>
            </div>
            <div className="sb-div" />
            <div className="sb-item">
              <div className="sb-lbl">Projects</div>
              <div className="sb-val red">{statsVis ? proj : 0}</div>
            </div>
            <div className="sb-div" />
            <div className="sb-item">
              <div className="sb-lbl">Average</div>
              <div className="sb-val">{statsVis ? (cgpa / 100).toFixed(2) : '0.00'}</div>
            </div>
            <div className="sb-div" />
            <div className="sb-item">
              <div className="sb-lbl">Win %</div>
              <div className="sb-val red">{statsVis ? wins : 0}%</div>
            </div>
            <div className="sb-div" />
            <div className="sb-item">
              <div className="sb-lbl">Status</div>
              <div className="sb-val" style={{ fontSize: '0.9rem' }}><span className="live-badge">BATTING</span></div>
            </div>
          </div>

          <button className="pb-btn" onClick={fireShot} disabled={shooting}>
            {shooting ? '🔥 TRACKING BALL...' : '🔥 PLAY BOLD — HIT A SIX!'}
          </button>

          <div className="ctas">
            <a href="#projects" className="btn btn-r">🏏 View Innings</a>
            <a href="#contact" className="btn btn-g">⭐ Sign the Player</a>
          </div>
        </section>

        {/* EE SALA BANNER */}
        <div className="ee-sala">🔴 EE SALA CUP NAMDE 🔴 SARTHAK PAPNEJA · CLASS OF 2026 🔴 PLAY BOLD 🔥</div>

        {/* ── ABOUT ── */}
        <section id="about">
          <div className="sh">
            <div style={{ flex: '0 0 auto' }}>
              <div className="sh-n">INNINGS 01</div>
              <div className="sh-t">PLAYER PROFILE</div>
            </div>
            <div className="sh-r" />
            <div className="sh-tag">SQUAD RECORD</div>
          </div>
          <div className="panel">
            <div className="cf-corner cf-tl">🔴</div><div className="cf-corner cf-tr">🔴</div>
            <div className="cf-corner cf-bl">🔴</div><div className="cf-corner cf-br">🔴</div>
            <div className="about-grid">
              <div className="bio">
                <p>I am a Computer Science Engineering student at <strong>VIT University, Chennai</strong> (2022–2026) with a CGPA of <strong>8.67</strong>. A true all-rounder — I build secure banking systems, create AI models, and ship full-stack web applications. Just like RCB, I don't just play — I play bold.</p>
                <p>Hands-on expertise in full-stack development, cloud computing (AWS), data analytics, and AI/ML. Published researcher in <strong>post-quantum cryptography</strong>. I thrive in high-pressure environments and collaborate relentlessly to deliver impact.</p>
                <p>Currently in peak form — preparing for <strong>German MSc season 2026</strong>. IELTS 8.0. APS certified. Ready to bat at the top of the order.</p>
              </div>
              <div>
                <div className="jersey">
                  <div className="jersey-top">
                    <span>🔴 RCB · SARTHAK PAPNEJA</span>
                    <span className="jersey-num">18</span>
                  </div>
                  <div className="jr-row"><span className="jr-k">Full Name</span><span className="jr-v">Sarthak Papneja</span></div>
                  <div className="jr-row"><span className="jr-k">Team</span><span className="jr-v">VIT Chennai XI</span></div>
                  <div className="jr-row"><span className="jr-k">Role</span><span className="jr-v">All-Rounder (AI+Cloud)</span></div>
                  <div className="jr-row"><span className="jr-k">Batting Avg</span><span className="jr-v gold">8.67 CGPA</span></div>
                  <div className="jr-row"><span className="jr-k">German Grade</span><span className="jr-v gold">≈ 1.80 (Bavarian)</span></div>
                  <div className="jr-row"><span className="jr-k">IELTS</span><span className="jr-v">8.0 Overall</span></div>
                  <div className="jr-row"><span className="jr-k">APS Certificate</span><span className="jr-v">32486/25</span></div>
                  <div className="jr-row"><span className="jr-k">Debut Year</span><span className="jr-v">2022</span></div>
                  <div className="jr-row"><span className="jr-k">Contract</span><span className="jr-v green">◉ AVAILABLE 2026</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects">
          <div className="sh">
            <div style={{ flex: '0 0 auto' }}>
              <div className="sh-n">INNINGS 02</div>
              <div className="sh-t">MATCH SCORECARD</div>
            </div>
            <div className="sh-r" />
            <div className="sh-tag">9 MATCHES · 9 WINS 🔥</div>
          </div>
          <div className="panel">
            <div className="cf-corner cf-tl">🏏</div><div className="cf-corner cf-tr">🏏</div>
            <div className="cf-corner cf-bl">🏏</div><div className="cf-corner cf-br">🏏</div>
            <div className="matches-grid">
              {PROJECTS.map(p => (
                <div className="match" key={p.title}>
                  <div className="m-format">{p.format}</div>
                  <div className="m-title">{p.title}</div>
                  <div className="m-result">⚡ {p.result}</div>
                  <p className="m-desc">{p.desc}</p>
                  <div className="tech">{p.tech.map(t => <span key={t}>{t}</span>)}</div>
                  <div className="plinks">
                    {p.gh && <a href={p.gh} target="_blank" rel="noreferrer" className="plink">⌥ GitHub</a>}
                    {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="plink">↗️ Live</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" ref={skillsRef}>
          <div className="sh">
            <div style={{ flex: '0 0 auto' }}>
              <div className="sh-n">INNINGS 03</div>
              <div className="sh-t">BATTING ARSENAL</div>
            </div>
            <div className="sh-r" />
            <div className="sh-tag">FULL SKILL CARD 🔥</div>
          </div>
          <div className="panel">
            <div className="cf-corner cf-tl">🔥</div><div className="cf-corner cf-tr">🔥</div>
            {SKILLS.map(s => (
              <div className="skill-row" key={s.cat}>
                <div className="sk-meta">
                  <div className="sk-cat">{s.cat}</div>
                  <div className="sk-pct">{skillsFilled ? s.pct : 0}%</div>
                </div>
                <div className="sk-bar-track">
                  <div className="sk-bar-fill" style={{ width: skillsFilled ? `${s.pct}%` : '0%' }} />
                </div>
                <div className="sk-tags">{s.tags.map(t => <span key={t} className="sk-tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CAREER + RESEARCH ── */}
        <section id="experience">
          <div className="sh">
            <div style={{ flex: '0 0 auto' }}>
              <div className="sh-n">INNINGS 04</div>
              <div className="sh-t">CAREER LOG & TROPHIES</div>
            </div>
            <div className="sh-r" />
            <div className="sh-tag">FIELD RECORD</div>
          </div>
          <div className="panel">
            <div className="cf-corner cf-tl">🏆</div><div className="cf-corner cf-tr">🏆</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '52px' }}>
              <div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem', color: 'var(--red)', letterSpacing: '0.18em', marginBottom: '18px', opacity: 0.8, textTransform: 'uppercase' }}>Career History</div>
                <div className="exp-tl">
                  {EXP.map(e => (
                    <div className="tl-item" key={e.co}>
                      <div className={`tl-dot${e.active ? '' : ' old'}`} />
                      <div className="ex-role">{e.role}</div>
                      <div className="ex-co">@ {e.co}</div>
                      <span className="ex-per">{e.period}</span>
                      <ul className="ex-ul">{e.bullets.map(b => <li key={b}>{b}</li>)}</ul>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '0.18em', marginBottom: '18px', opacity: 0.75, textTransform: 'uppercase' }}>🏆 Champions Trophy — Published Research</div>
                <div className="champ">
                  <div className="champ-banner">
                    <div className="champ-icon">🏆</div>
                    <div className="champ-title">CHAMPIONS TROPHY — RESEARCH</div>
                    <div className="champ-icon">🏆</div>
                  </div>
                  <div className="champ-body">
                    <div className="c-title">Q-Notary: A Decentralized, Quantum-Resistant Notary for Verifiable Collaborative Workflows</div>
                    <div className="c-authors">Sarthak Papneja · Romit Gupta · Dr. Neelanarayanan V</div>
                    <div className="c-meta">
                      <span>IJVRA · Vol 4, Issue 1</span>
                      <span>January 2026</span>
                      <span>DOI: 10.13140/RG.2.2.35802.20169</span>
                    </div>
                    <p className="c-abs">Quantum computing threatens classical signature schemes. Q-Notary delivers a post-quantum secure notary framework using SPHINCS+, IPFS, and W3C Verifiable Credentials for tamper-evident notarisations and collaborative approvals.</p>
                    <div className="c-kws">{RKW.map(k => <span key={k} className="c-kw">{k}</span>)}</div>
                    <a href="https://www.researchgate.net/publication/399985730_Q-Notary_A_Decentralized_Quantum-Resistant_Notary_for_Verifiable_Collaborative_Workflows" target="_blank" rel="noreferrer" className="btn btn-g" style={{ fontSize: '0.76rem', padding: '9px 20px' }}>↗️ View on ResearchGate</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact">
          <div className="sh">
            <div style={{ flex: '0 0 auto' }}>
              <div className="sh-n">INNINGS 05</div>
              <div className="sh-t">SIGN THE PLAYER</div>
            </div>
            <div className="sh-r" />
            <div className="sh-tag">OPEN AUCTION 🔴</div>
          </div>
          <div className="panel" style={{ borderTopColor: 'var(--gold)' }}>
            <div className="cf-corner cf-tl" style={{ color: 'var(--gold)' }}>⭐</div><div className="cf-corner cf-tr" style={{ color: 'var(--gold)' }}>⭐</div>
            <p className="c-intro">I'm available for new opportunities — MSc programmes, internships, engineering roles. Step up. Make your bid. Ee sala cup namde.</p>
            <div className="contact-cols">
              <form className="cf-form" onSubmit={submit}>
                <div><label className="cf-lbl">Name</label><input className="fi" placeholder="Your name..." value={form.name} onChange={e => upd('name', e.target.value)} required /></div>
                <div><label className="cf-lbl">Email</label><input className="fi" type="email" placeholder="your@email.com" value={form.email} onChange={e => upd('email', e.target.value)} required /></div>
                <div><label className="cf-lbl">Message</label><textarea className="fta" placeholder="Your message..." value={form.message} onChange={e => upd('message', e.target.value)} required /></div>
                <button type="submit" className="fsub" disabled={status === 'sending'}>{status === 'sending' ? '🔥 Sending...' : '🔴 PLAY BOLD — SEND IT'}</button>
                {status === 'ok' && <p className="fst-ok">✔ Message received. EE SALA! I'll reply soon.</p>}
                {status === 'err' && <p className="fst-err">✘ Failed. Email me directly.</p>}
              </form>
              <div className="soc-list">
                <a href="mailto:sarthakpapneja01@gmail.com" className="soc"><span className="soc-ic">✉</span>sarthakpapneja01@gmail.com</a>
                <a href="https://www.linkedin.com/in/sarthak-papneja-485118232/" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic">in</span>LinkedIn</a>
                <a href="https://github.com/sarthakpapneja" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic">GH</span>GitHub</a>
                <a href="https://www.researchgate.net/profile/Sarthak-Papneja" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic" style={{ fontSize: '0.54rem' }}>RG</span>ResearchGate</a>
                <a href="https://drive.google.com/file/d/1u3hQLi61BAbKneym4_QYbEXHYJYvHuio/view?usp=sharing" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic">↓</span>Résumé PDF</a>
              </div>
            </div>
          </div>
        </section>

      </div>

      <footer className="foot">
        <div className="foot-fire">🔴🔥🏏🔥🔴</div>
        <p>Designed & Built by <span>Sarthak Papneja</span> · RCB Fan · <span>Ee Sala Cup Namde</span> 🔴🔥</p>
      </footer>
    </div>
  </>);
}
