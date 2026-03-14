import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Share+Tech+Mono&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Barlow',sans-serif;background:#0a1a08;color:#e8f0e0;overflow-x:hidden;}

:root{
  --pitch:#1a4a10;
  --pitch2:#143d0c;
  --sky:#0a1a08;
  --red:#cc2200;
  --red2:#ff3a1a;
  --gold:#f5c518;
  --cream:#f5f0e0;
  --white:#ffffff;
  --green:#22c55e;
  --lime:#84cc16;
  --muted:#6a8060;
  --border:rgba(245,197,24,0.2);
  --glow:0 0 24px rgba(245,197,24,0.4);
  --rglow:0 0 24px rgba(204,34,0,0.6);
}

.ground{
  min-height:100vh;
  background:
    repeating-linear-gradient(90deg,rgba(255,255,255,0.015) 0px,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 40px),
    repeating-linear-gradient(0deg,rgba(255,255,255,0.01) 0px,rgba(255,255,255,0.01) 1px,transparent 1px,transparent 40px),
    radial-gradient(ellipse at 50% 100%,rgba(26,74,16,0.6),transparent 70%),
    var(--sky);
  position:relative;
}

.crowd-wrap{position:fixed;bottom:0;left:0;right:0;height:60px;pointer-events:none;z-index:0;overflow:hidden;}
.crowd-person{
  position:absolute;bottom:0;
  width:8px;
  background:linear-gradient(180deg,var(--c,#f59e0b),transparent);
  border-radius:4px 4px 0 0;
  animation:crowdwave var(--dur,2s) var(--del,0s) ease-in-out infinite alternate;
}
@keyframes crowdwave{from{height:var(--h1,20px);opacity:0.4;}to{height:var(--h2,40px);opacity:0.9;}}

.nav{
  position:sticky;top:0;z-index:300;
  background:rgba(10,26,8,0.97);
  backdrop-filter:blur(20px);
  border-bottom:2px solid rgba(245,197,24,0.3);
  padding:0 48px;height:60px;
  display:flex;align-items:center;justify-content:space-between;
}
.nav::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),var(--red2),var(--gold),transparent);
  animation:navshine 3s ease-in-out infinite alternate;
}
@keyframes navshine{0%{opacity:0.3;}100%{opacity:1;}}
.nav-logo{
  font-family:'Anton',sans-serif;
  font-size:1.4rem;color:var(--gold);
  text-decoration:none;letter-spacing:0.1em;
  text-shadow:0 0 20px rgba(245,197,24,0.6);
  display:flex;align-items:center;gap:10px;
}
.ball-icon{
  width:22px;height:22px;border-radius:50%;
  background:radial-gradient(circle at 35% 35%,#ff6040,var(--red),#880000);
  box-shadow:0 0 10px rgba(204,34,0,0.6);
  position:relative;overflow:hidden;flex-shrink:0;
  animation:ballspin 3s linear infinite;
}
.ball-icon::after{
  content:'';position:absolute;top:50%;left:0;right:0;height:1.5px;
  background:rgba(255,255,255,0.25);
  transform:translateY(-50%) rotate(15deg);
}
@keyframes ballspin{from{box-shadow:0 0 8px rgba(204,34,0,0.5);}50%{box-shadow:0 0 18px rgba(204,34,0,0.9),0 0 36px rgba(204,34,0,0.3);}to{box-shadow:0 0 8px rgba(204,34,0,0.5);}}
.nav-ul{display:flex;gap:4px;list-style:none;align-items:center;}
.nav-ul a{font-family:'Anton',sans-serif;font-size:0.82rem;color:var(--muted);text-decoration:none;letter-spacing:0.1em;padding:5px 11px;border:1px solid transparent;transition:all 0.2s;}
.nav-ul a:hover{color:var(--gold);border-color:var(--border);background:rgba(245,197,24,0.05);}
.nav-res{color:var(--red2)!important;border-color:rgba(255,58,26,0.3)!important;background:rgba(255,58,26,0.06)!important;}

.pitch{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:0 28px 100px;}

.ticker{
  background:var(--red);
  padding:8px 0;overflow:hidden;white-space:nowrap;
  border-bottom:2px solid var(--gold);
  position:relative;z-index:10;
}
.ticker-inner{
  display:inline-block;
  animation:tickermove 30s linear infinite;
  font-family:'Share Tech Mono',monospace;
  font-size:0.72rem;letter-spacing:0.06em;color:#fff;
}
@keyframes tickermove{from{transform:translateX(100vw);}to{transform:translateX(-100%);}}
.ticker-sep{margin:0 32px;color:var(--gold);opacity:0.7;}

.sec-hdr{display:flex;align-items:flex-end;gap:16px;padding:60px 0 26px;}
.sec-num{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:var(--gold);letter-spacing:0.2em;margin-bottom:7px;opacity:0.7;}
.sec-title{font-family:'Anton',sans-serif;font-size:clamp(1.8rem,4vw,3rem);color:#fff;letter-spacing:0.06em;line-height:1;text-shadow:2px 2px 0 rgba(245,197,24,0.2);}
.sec-rule{flex:1;height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin-bottom:7px;}
.sec-tag{font-family:'Share Tech Mono',monospace;font-size:0.58rem;color:var(--muted);letter-spacing:0.14em;margin-bottom:7px;white-space:nowrap;}

.panel{
  background:rgba(16,36,12,0.95);
  border:1px solid rgba(255,255,255,0.06);
  border-top:2px solid var(--gold);
  padding:38px 46px;position:relative;overflow:hidden;
}
.panel::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(-45deg,transparent,transparent 40px,rgba(255,255,255,0.006) 40px,rgba(255,255,255,0.006) 41px);pointer-events:none;}

.hero{
  min-height:94vh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  position:relative;text-align:center;gap:0;padding-top:10px;
}

.stumps-wrap{display:flex;justify-content:center;gap:80px;margin-bottom:24px;position:relative;}
.stump-set{display:flex;gap:5px;align-items:flex-end;position:relative;}
.stump{width:8px;border-radius:3px 3px 0 0;background:linear-gradient(180deg,#d4c4a0,#a89060);box-shadow:0 0 8px rgba(255,255,255,0.1);}
.stump.s1{height:60px;animation:stumpin 0.4s 0.2s ease-out both;}
.stump.s2{height:66px;animation:stumpin 0.4s 0.3s ease-out both;}
.stump.s3{height:60px;animation:stumpin 0.4s 0.4s ease-out both;}
.bail{
  position:absolute;top:0;height:4px;border-radius:2px;
  background:linear-gradient(90deg,#d4c4a0,#f5e8c0,#d4c4a0);
  box-shadow:0 0 6px rgba(255,255,255,0.3);
}
.bail-l{width:12px;left:2px;top:-3px;animation:stumpin 0.3s 0.6s ease-out both;}
.bail-r{width:12px;right:2px;top:-3px;animation:stumpin 0.3s 0.65s ease-out both;}
@keyframes stumpin{from{opacity:0;transform:translateY(-20px);}to{opacity:1;transform:translateY(0);}}
.stump.blown{animation:blownaway 0.5s ease-out forwards!important;}
.bail.blown{animation:bailfly 0.6s ease-out forwards!important;}
@keyframes blownaway{0%{transform:none;opacity:1;}30%{transform:rotate(var(--r,15deg)) translate(var(--tx,10px),var(--ty,-20px));opacity:1;}100%{transform:rotate(var(--r2,60deg)) translate(var(--tx2,40px),var(--ty2,80px));opacity:0;}}
@keyframes bailfly{0%{transform:none;opacity:1;}100%{transform:rotate(360deg) translate(30px,-60px);opacity:0;}}

.scoreboard{
  background:linear-gradient(135deg,#1a1208,#0d0d08);
  border:2px solid var(--gold);
  border-radius:4px;
  padding:16px 28px;
  display:flex;gap:28px;align-items:center;
  margin:16px 0 20px;
  box-shadow:0 0 40px rgba(245,197,24,0.15),inset 0 1px 0 rgba(245,197,24,0.2);
  animation:fadeup 0.8s 0.8s ease both;
}
.sb-item{text-align:center;}
.sb-lbl{font-family:'Share Tech Mono',monospace;font-size:0.5rem;color:var(--muted);letter-spacing:0.18em;text-transform:uppercase;margin-bottom:4px;}
.sb-val{font-family:'Anton',sans-serif;font-size:2rem;color:var(--gold);line-height:1;text-shadow:0 0 12px rgba(245,197,24,0.5);}
.sb-val.small{font-size:1.1rem;color:var(--cream);}
.sb-div{width:1px;height:48px;background:rgba(245,197,24,0.2);}
.innings-tag{
  background:var(--red);color:#fff;
  font-family:'Share Tech Mono',monospace;
  font-size:0.58rem;letter-spacing:0.14em;
  padding:3px 10px;border-radius:2px;
  animation:flash 1s ease-in-out infinite;
}
@keyframes flash{0%,100%{opacity:1;}50%{opacity:0.4;}}

.hero-name{font-family:'Anton',sans-serif;font-size:clamp(3.5rem,11vw,10rem);color:#fff;line-height:0.88;letter-spacing:0.04em;text-shadow:3px 3px 0 rgba(245,197,24,0.2),0 0 60px rgba(245,197,24,0.06);animation:fadeup 0.8s 0.1s ease both;}
.hero-name span{color:var(--gold);text-shadow:0 0 30px rgba(245,197,24,0.7),3px 3px 0 rgba(180,140,0,0.4);}
.hero-role{font-family:'Barlow',sans-serif;font-size:clamp(1rem,2.5vw,1.4rem);font-weight:300;font-style:italic;color:var(--muted);letter-spacing:0.1em;margin-bottom:8px;animation:fadeup 0.8s 0.3s ease both;}
@keyframes fadeup{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}

#traj-canvas{position:absolute;inset:0;pointer-events:none;z-index:5;}

.hawkeye-btn{
  font-family:'Anton',sans-serif;font-size:0.85rem;letter-spacing:0.1em;
  background:rgba(245,197,24,0.1);color:var(--gold);
  border:1px solid rgba(245,197,24,0.35);
  padding:8px 20px;cursor:pointer;transition:all 0.2s;
  margin-top:4px;
}
.hawkeye-btn:hover{background:rgba(245,197,24,0.2);box-shadow:var(--glow);}

.ctas{display:flex;gap:13px;justify-content:center;flex-wrap:wrap;animation:fadeup 0.8s 1.1s ease both;margin-top:20px;}
.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;font-family:'Anton',sans-serif;font-size:0.95rem;letter-spacing:0.1em;text-decoration:none;transition:all 0.2s;cursor:pointer;border:none;border-radius:2px;}
.btn-red{background:var(--red);color:#fff;box-shadow:0 4px 20px rgba(204,34,0,0.35);}
.btn-red:hover{background:var(--red2);transform:translateY(-3px);box-shadow:0 8px 28px rgba(204,34,0,0.55);}
.btn-gold{background:rgba(245,197,24,0.1);color:var(--gold);border:1.5px solid rgba(245,197,24,0.4);}
.btn-gold:hover{background:rgba(245,197,24,0.2);transform:translateY(-3px);box-shadow:var(--glow);}

.player-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:44px;align-items:start;}
.bio p{font-size:0.98rem;font-weight:300;line-height:1.88;color:#d0e0c8;margin-bottom:13px;}
.bio strong{color:var(--gold);}
.player-card{background:linear-gradient(160deg,#1a2e12,#0e1c08);border:1.5px solid rgba(245,197,24,0.3);border-radius:4px;overflow:hidden;box-shadow:0 0 40px rgba(245,197,24,0.08);}
.pc-banner{background:linear-gradient(90deg,var(--red),rgba(255,100,0,0.8));padding:12px 20px;font-family:'Anton',sans-serif;font-size:1rem;letter-spacing:0.12em;color:#fff;display:flex;justify-content:space-between;align-items:center;}
.pc-flag{font-size:1.2rem;}
.pc-row{display:flex;border-bottom:1px solid rgba(255,255,255,0.04);padding:10px 18px;gap:10px;}
.pc-row:last-child{border-bottom:none;}
.pc-k{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:var(--muted);min-width:120px;letter-spacing:0.06em;}
.pc-v{font-size:0.9rem;font-weight:400;color:#e0f0d8;}
.pc-v.gold{color:var(--gold);font-weight:600;}
.pc-v.green{color:var(--green);}

.ww-wrap{display:flex;flex-direction:column;align-items:center;gap:16px;}
.ww-title{font-family:'Anton',sans-serif;font-size:1rem;color:var(--gold);letter-spacing:0.1em;text-align:center;}
#wagon-canvas{cursor:pointer;}
.ww-legend{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:400px;}
.ww-leg-item{display:flex;align-items:center;gap:6px;font-family:'Share Tech Mono',monospace;font-size:0.58rem;color:var(--muted);letter-spacing:0.06em;}
.ww-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}

.matches{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.match{
  background:rgba(16,36,12,0.9);
  border:1px solid rgba(255,255,255,0.06);
  border-radius:3px;padding:18px;
  position:relative;overflow:hidden;
  display:flex;flex-direction:column;gap:8px;
  transition:all 0.22s;cursor:default;
}
.match::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--red),var(--gold));opacity:0;transition:opacity 0.3s;}
.match:hover{border-color:rgba(245,197,24,0.3);transform:translateY(-4px);box-shadow:0 8px 32px rgba(0,0,0,0.4),0 0 20px rgba(245,197,24,0.06);}
.match:hover::before{opacity:1;}
.match-format{font-family:'Share Tech Mono',monospace;font-size:0.52rem;color:var(--red2);letter-spacing:0.14em;text-transform:uppercase;}
.match-title{font-family:'Anton',sans-serif;font-size:1.05rem;color:#fff;line-height:1.2;letter-spacing:0.04em;}
.match-runs{font-family:'Anton',sans-serif;font-size:0.8rem;color:var(--gold);letter-spacing:0.06em;}
.match-desc{font-size:0.78rem;font-weight:300;color:var(--muted);line-height:1.72;flex:1;}
.tech{display:flex;flex-wrap:wrap;gap:4px;}
.tech span{font-family:'Share Tech Mono',monospace;font-size:0.54rem;color:var(--muted);border:1px solid rgba(255,255,255,0.07);padding:2px 6px;background:rgba(255,255,255,0.02);}
.plinks{display:flex;gap:12px;margin-top:3px;}
.plink{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:var(--gold);text-decoration:none;letter-spacing:0.04em;transition:all 0.18s;border-bottom:1px solid transparent;}
.plink:hover{color:#fff;border-bottom-color:var(--gold);}

.stats-table{background:rgba(16,36,12,0.9);border:1px solid rgba(255,255,255,0.06);overflow:hidden;}
.st-hdr{display:grid;grid-template-columns:180px 1fr 60px;background:rgba(245,197,24,0.1);border-bottom:1px solid rgba(245,197,24,0.2);padding:10px 16px;gap:12px;}
.st-hdr span{font-family:'Share Tech Mono',monospace;font-size:0.58rem;color:var(--gold);letter-spacing:0.14em;text-transform:uppercase;}
.st-row{display:grid;grid-template-columns:180px 1fr 60px;padding:13px 16px;gap:12px;border-bottom:1px solid rgba(255,255,255,0.04);align-items:center;transition:background 0.2s;}
.st-row:last-child{border-bottom:none;}
.st-row:hover{background:rgba(245,197,24,0.04);}
.st-cat{font-family:'Anton',sans-serif;font-size:0.88rem;color:#fff;letter-spacing:0.05em;}
.st-bar-wrap{height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;}
.st-bar{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--lime),var(--green));width:0%;transition:width 1.2s cubic-bezier(0.34,1.3,0.64,1);box-shadow:0 0 6px rgba(132,204,22,0.5);}
.st-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px;}
.st-tag{font-size:0.72rem;font-weight:300;color:#c0d8b0;border:1px solid rgba(255,255,255,0.07);padding:3px 8px;background:rgba(255,255,255,0.02);transition:all 0.18s;cursor:default;}
.st-tag:hover{background:rgba(245,197,24,0.08);border-color:rgba(245,197,24,0.3);color:#fff;}
.st-avg{font-family:'Anton',sans-serif;font-size:1rem;color:var(--gold);text-align:right;}

.career{display:flex;flex-direction:column;}
.career-item{display:grid;grid-template-columns:160px 1fr;gap:0;border-bottom:1px solid rgba(255,255,255,0.05);padding:20px 0;}
.career-item:last-child{border-bottom:none;}
.ci-left{padding-right:20px;border-right:1px solid rgba(255,255,255,0.06);}
.ci-format{font-family:'Share Tech Mono',monospace;font-size:0.56rem;color:var(--red2);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:5px;}
.ci-period{font-family:'Anton',sans-serif;font-size:0.75rem;color:var(--gold);line-height:1.3;}
.ci-team{font-size:0.78rem;font-weight:300;font-style:italic;color:var(--muted);margin-top:4px;}
.ci-right{padding-left:22px;}
.ci-role{font-family:'Anton',sans-serif;font-size:1.1rem;color:#fff;letter-spacing:0.04em;margin-bottom:8px;}
.ci-ul{list-style:none;}
.ci-ul li{font-size:0.86rem;font-weight:300;color:var(--muted);line-height:1.74;padding-left:16px;position:relative;margin-bottom:4px;}
.ci-ul li::before{content:'▶️';position:absolute;left:0;color:var(--gold);font-size:0.5rem;top:5px;}

.trophy{border:2px solid var(--gold);border-radius:4px;overflow:hidden;box-shadow:0 0 40px rgba(245,197,24,0.1);}
.tr-banner{background:linear-gradient(90deg,rgba(245,197,24,0.15),rgba(245,197,24,0.08));border-bottom:1px solid rgba(245,197,24,0.3);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;}
.tr-title{font-family:'Anton',sans-serif;font-size:1.1rem;color:var(--gold);letter-spacing:0.1em;}
.tr-trophy{font-size:1.4rem;animation:trophyshine 2s ease-in-out infinite alternate;}
@keyframes trophyshine{from{filter:drop-shadow(0 0 4px rgba(245,197,24,0.4));}to{filter:drop-shadow(0 0 14px rgba(245,197,24,0.9));}}
.tr-body{padding:24px 28px;}
.tr-ptitle{font-family:'Anton',sans-serif;font-size:1.2rem;color:#fff;line-height:1.28;margin-bottom:9px;letter-spacing:0.03em;}
.tr-authors{font-size:0.86rem;font-style:italic;color:var(--gold);margin-bottom:10px;}
.tr-meta{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px;}
.tr-meta span{font-family:'Share Tech Mono',monospace;font-size:0.56rem;color:var(--muted);background:rgba(245,197,24,0.05);border:1px solid var(--border);padding:3px 9px;}
.tr-abs{font-size:0.86rem;font-weight:300;line-height:1.86;color:#d0e0c8;border-left:3px solid var(--gold);padding-left:14px;margin-bottom:14px;font-style:italic;}
.tr-kws{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}
.tr-kw{font-family:'Share Tech Mono',monospace;font-size:0.56rem;color:var(--red2);border:1px solid rgba(255,58,26,0.3);padding:3px 8px;background:rgba(255,58,26,0.05);}

.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:44px;}
.contact-intro{font-size:0.96rem;font-weight:300;color:var(--muted);line-height:1.84;margin-bottom:26px;font-style:italic;}
.cf{display:flex;flex-direction:column;gap:12px;}
.cf-lbl{font-family:'Share Tech Mono',monospace;font-size:0.56rem;color:var(--muted);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:2px;display:block;}
.fi{font-family:'Barlow',sans-serif;font-size:0.92rem;font-weight:300;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:11px 14px;color:#e0f0d8;outline:none;transition:all 0.2s;width:100%;}
.fi:focus{border-color:var(--gold);box-shadow:0 0 12px rgba(245,197,24,0.08);}
.fta{font-family:'Barlow',sans-serif;font-size:0.92rem;font-weight:300;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:11px 14px;color:#e0f0d8;outline:none;transition:all 0.2s;width:100%;resize:vertical;min-height:115px;}
.fta:focus{border-color:var(--gold);box-shadow:0 0 12px rgba(245,197,24,0.08);}
.fsub{font-family:'Anton',sans-serif;font-size:0.95rem;letter-spacing:0.1em;background:var(--red);color:#fff;border:none;padding:12px 30px;cursor:pointer;transition:all 0.2s;align-self:flex-start;box-shadow:0 4px 18px rgba(204,34,0,0.3);}
.fsub:hover{background:var(--red2);transform:translateY(-3px);box-shadow:0 8px 28px rgba(204,34,0,0.5);}
.fsub:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
.fst-ok{font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:var(--green);letter-spacing:0.08em;}
.fst-err{font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:var(--red2);}
.socials{display:flex;flex-direction:column;}
.soc{display:flex;align-items:center;gap:14px;text-decoration:none;color:#d0e0c8;font-size:0.92rem;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05);transition:all 0.2s;}
.soc:last-child{border-bottom:none;}
.soc:hover{color:var(--gold);padding-left:5px;}
.soc-ic{width:30px;height:30px;background:rgba(245,197,24,0.06);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:'Share Tech Mono',monospace;font-size:0.58rem;color:var(--gold);flex-shrink:0;}

.foot{text-align:center;padding:44px 28px;position:relative;z-index:1;border-top:2px solid rgba(245,197,24,0.15);}
.foot-stumps{display:flex;justify-content:center;gap:6px;align-items:flex-end;margin-bottom:16px;}
.foot-stump{width:5px;border-radius:2px 2px 0 0;background:linear-gradient(180deg,#d4c4a0,#a89060);}
.foot p{font-family:'Share Tech Mono',monospace;font-size:0.64rem;color:var(--muted);letter-spacing:0.12em;}
.foot span{color:var(--gold);}

@media(max-width:820px){
  .nav{padding:0 16px;}.nav-ul li:not(:last-child):not(:nth-last-child(2)){display:none;}
  .panel{padding:28px 20px;}
  .player-grid,.contact-grid{grid-template-columns:1fr;}
  .matches{grid-template-columns:1fr;}
  .career-item{grid-template-columns:1fr;}
  .ci-left{border-right:none;padding-right:0;margin-bottom:8px;}
  .ci-right{padding-left:0;}
  .hero-name{font-size:18vw;}
  .scoreboard{flex-wrap:wrap;gap:16px;justify-content:center;}
}
`;

const COMMENTARY = [
  "🎙️ WHAT A PLAYER! Sarthak Papneja — 8.67 CGPA, 9 projects, published researcher",
  "🏏 SIX! Gastro-XAI clears the boundary — Grad-CAM explainability at its finest",
  "⚡ BOWLED! ModelAuditAI dismantles the competition",
  "🎯 PERFECT DELIVERY — Post-quantum cryptography published in IJVRA 2026",
  "🔥 ON FIRE — Full-stack, AI/ML, Cloud, Research — complete all-rounder",
  "📡 HAWKEYE CONFIRMS — CGPA 8.67 tracking straight to the top",
  "🏆 GOLDEN ARM — Q-Notary: SPHINCS+ × IPFS × Verifiable Credentials",
  "🌟 CLASS OF 2026 — VIT Chennai — Available for new innings",
  "💥 FOUR! Resume Analyzer races to the boundary — ATS compatibility at 100%",
];

const PROJECTS = [
  {format:"T20 · AI/XAI",title:"Gastro-XAI",runs:"83% ACC",desc:"Explainable AI for gastrointestinal disease classification. Grad-CAM visualisations + automated clinical report generation.",tech:["Python","PyTorch","Flask","React","Grad-CAM"],gh:"https://github.com/sarthakpapneja/Gastro-XAI",live:null},
  {format:"TEST · AI/AUDIT",title:"ModelAuditAI",runs:"5-DIM",desc:"Production-grade ML audit — Performance, Fairness, Drift, Overfitting, Leakage. Comprehensive health reports.",tech:["TypeScript","React","Python","FastAPI"],gh:"https://github.com/sarthakpapneja/ML-Auditor",live:null},
  {format:"ODI · NLP/AI",title:"Resume Analyzer",runs:"ATS ✓",desc:"Intelligent resume parsing with skill gap analysis and ATS compatibility scoring.",tech:["TypeScript","React","Python","NLP"],gh:"https://github.com/sarthakpapneja/resume-analyzer",live:null},
  {format:"T20 · FULLSTACK",title:"Finance Track",runs:"MERN",desc:"Finance tracker — transaction management, balance computation, data visualisation and responsive dashboard.",tech:["JavaScript","React","Node.js","MongoDB"],gh:"https://github.com/sarthakpapneja/Finance-Track",live:null},
  {format:"ODI · AI/FINTECH",title:"Regulatory Reporting",runs:"AUTO",desc:"AI-powered regulatory compliance assistant streamlining complex reporting workflows.",tech:["Python","Flask","AI/ML"],gh:"https://github.com/sarthakpapneja/Regulatory-Reporting-Assistant",live:null},
  {format:"T20 · CV",title:"RoadVision VMS",runs:"LIVE",desc:"Vehicle Management System via computer vision — road monitoring, traffic analysis, automated tracking.",tech:["Python","Computer Vision","Deep Learning"],gh:"https://github.com/sarthakpapneja/RoadVision-VMS",live:null},
  {format:"ODI · WEB",title:"School Website",runs:"LIVE",desc:"Full-featured institutional website — dynamic content, event management, video integration.",tech:["JavaScript","React","Vite","CSS"],gh:"https://github.com/sarthakpapneja/school-website-",live:"https://school-website-murex-seven.vercel.app/"},
  {format:"TEST · DB",title:"Bank Security System",runs:"RBAC",desc:"Bank management application with Role-Based Access Control ensuring data segregation.",tech:["Python","MySQL","RBAC"],gh:"https://github.com/sarthakpapneja/banksecuritysystem",live:null},
  {format:"T20 · DATA",title:"Table Detection Model",runs:"OCR",desc:"Encoder-decoder deep learning (TableNet / VGG-19) for table detection with integrated OCR.",tech:["Deep Learning","Python","OCR","VGG-19"],gh:null,live:"https://colab.research.google.com/drive/1xpn7qXNKuUoMzCklZjbyLiv23v8SheIN?usp=sharing"},
];

const SKILLS = [
  {cat:"Core Concepts",tags:["Architecture","AI","DBMS","OS","Networks","OOP"],avg:92},
  {cat:"Languages",tags:["C","C++","Java","JavaScript","Python","TypeScript"],avg:95},
  {cat:"Web & Frameworks",tags:["ReactJS","Next.js","Tailwind","Flask","FastAPI","Node.js"],avg:88},
  {cat:"AI / ML",tags:["PyTorch","Deep Learning","CV","NLP","Grad-CAM","XAI"],avg:90},
  {cat:"Data & Analytics",tags:["SQL","PowerBI","Tableau","MySQL","MongoDB"],avg:83},
  {cat:"Cloud & Infra",tags:["AWS EC2","IAM","VPC","S3","RDS","CloudFront"],avg:78},
];

const EXP = [
  {format:"INTERNSHIP",period:"Jun–Jul 2025",team:"Velocis Systems, Noida",role:"Cloud Intern",bullets:["AWS & GCP: EC2, IAM, VPC, RDS, CloudFront, Load Balancer.","Supported enterprise-grade solutions in fast-paced environments."]},
  {format:"CLUB CRICKET",period:"Jun 2023–Present",team:"Android Club, VIT Chennai",role:"Operations Member",bullets:["Organised technical events; delivered UI/UX seminar session.","Collaborated with teams ensuring timely delivery.","Operational improvements through leadership."]},
  {format:"SEASON",period:"Sep–Nov 2023",team:"Microsoft Innovations Club",role:"UI/UX Member",bullets:["Redesigned event interfaces using advanced UI principles.","Boosted user access 30%; reduced registration time 20%."]},
  {format:"TOURNAMENT",period:"Various",team:"Smart India Hackathon",role:"Core Developer",bullets:["Core developer in national-level competition."]},
];

const RKW=["Post-Quantum Crypto","SPHINCS+","IPFS","Verifiable Credentials","Decentralized Notary","Quantum-Resistant"];

const WAGON_SKILLS = [
  {label:"AI/ML",color:"#f59e0b",pct:0.90,angle:30},
  {label:"Python",color:"#3b82f6",pct:0.95,angle:75},
  {label:"Cloud",color:"#22c55e",pct:0.78,angle:120},
  {label:"React",color:"#06b6d4",pct:0.88,angle:165},
  {label:"Research",color:"#f43f5e",pct:0.85,angle:210},
  {label:"Full-Stack",color:"#a855f7",pct:0.87,angle:255},
  {label:"Data",color:"#f97316",pct:0.83,angle:300},
  {label:"Security",color:"#ef4444",pct:0.80,angle:345},
];

function useCounter(target, dur=1500, go=false){
  const [v,setV]=useState(0);
  useEffect(()=>{
    if(!go) return;
    let cur=0; const step=target/60;
    const i=setInterval(()=>{cur=Math.min(cur+step,target);setV(Math.round(cur));if(cur>=target)clearInterval(i);},dur/60);
    return()=>clearInterval(i);
  },[target,dur,go]);
  return v;
}

function Crowd(){
  const people=Array.from({length:60},(_,i)=>({
    id:i,
    left:`${(i/60)*100}%`,
    h1:12+Math.random()*16,
    h2:24+Math.random()*32,
    dur:`${1.2+Math.random()*1.8}s`,
    del:`${(i/60)*3}s`,
    colors:["#f59e0b","#ef4444","#3b82f6","#22c55e","#a855f7","#f97316","#ffffff"],
  }));
  return(
    <div className="crowd-wrap">
      {people.map(p=>(
        <div key={p.id} className="crowd-person" style={{
          left:p.left,
          "--h1":`${p.h1}px`,
          "--h2":`${p.h2}px`,
          "--dur":p.dur,
          "--del":p.del,
          "--c":p.colors[p.id%p.colors.length],
        }}/>
      ))}
    </div>
  );
}

function TrajectoryCanvas({shoot, onDone}){
  const ref=useRef(null);
  const animRef=useRef(null);
  useEffect(()=>{
    if(!shoot) return;
    const canvas=ref.current;
    if(!canvas) return;
    const ctx=canvas.getContext('2d');
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    const w=canvas.width, h=canvas.height;
    const paths=[
      {sx:w*0.5,sy:h*0.7,ex:w*0.85,ey:h*0.1,color:"#ff3a1a",label:"SIX!"},
      {sx:w*0.5,sy:h*0.7,ex:w*0.15,ey:h*0.15,color:"#f5c518",label:"FOUR!"},
      {sx:w*0.5,sy:h*0.7,ex:w*0.75,ey:h*0.5,color:"#22c55e",label:"SINGLE"},
    ];
    let trail=[];
    let t=0; const dur=90;
    const path=paths[Math.floor(Math.random()*paths.length)];
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      const p=t/dur;
      const x=path.sx+(path.ex-path.sx)*p;
      const y=path.sy+(path.ey-path.sy)*p - Math.sin(p*Math.PI)*h*0.35;
      trail.push({x,y,a:1-p*0.3});
      if(trail.length>30) trail.shift();
      trail.forEach((pt,i)=>{
        const a=pt.a*(i/trail.length)*0.6;
        ctx.beginPath();
        ctx.arc(pt.x,pt.y,3*(i/trail.length)+1,0,Math.PI*2);
        ctx.fillStyle=`rgba(${path.color==='#ff3a1a'?'255,58,26':path.color==='#f5c518'?'245,197,24':'34,197,94'},${a})`;
        ctx.fill();
      });
      const r=8;
      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2);
      const grad=ctx.createRadialGradient(x-2,y-2,1,x,y,r);
      grad.addColorStop(0,'#ff8060');grad.addColorStop(0.5,path.color);grad.addColorStop(1,'#660000');
      ctx.fillStyle=grad;
      ctx.shadowBlur=12;ctx.shadowColor=path.color;
      ctx.fill();
      ctx.shadowBlur=0;
      ctx.beginPath();ctx.arc(x,y,r,0.2,Math.PI-0.2);
      ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1;ctx.stroke();
      if(t===Math.floor(dur*0.4)){
        ctx.font='bold 18px Anton, sans-serif';
        ctx.fillStyle=path.color;
        ctx.shadowBlur=8;ctx.shadowColor=path.color;
        ctx.textAlign='center';
        ctx.fillText(path.label,x,y-20);
        ctx.shadowBlur=0;
      }
      t++;
      if(t<dur+10) animRef.current=requestAnimationFrame(draw);
      else{ ctx.clearRect(0,0,w,h); onDone&&onDone(); }
    };
    animRef.current=requestAnimationFrame(draw);
    return()=>cancelAnimationFrame(animRef.current);
  },[shoot]);
  return <canvas id="traj-canvas" ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:5}}/>;
}

function WagonWheel({visible}){
  const ref=useRef(null);
  const [hovered,setHovered]=useState(null);
  const [drawn,setDrawn]=useState(false);

  useEffect(()=>{
    if(!visible||drawn) return;
    const canvas=ref.current;
    if(!canvas) return;
    const ctx=canvas.getContext('2d');
    const size=300; canvas.width=size; canvas.height=size;
    const cx=size/2, cy=size/2, R=130;
    let frame=0; const totalFrames=90;

    const draw=()=>{
      ctx.clearRect(0,0,size,size);
      const p=Math.min(frame/totalFrames,1);
      ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.strokeStyle='rgba(245,197,24,0.15)';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(cx,cy,R*0.5,0,Math.PI*2);
      ctx.strokeStyle='rgba(245,197,24,0.08)';ctx.stroke();
      WAGON_SKILLS.forEach(s=>{
        const rad=(s.angle-90)*Math.PI/180;
        const len=R*s.pct*p;
        const ex=cx+Math.cos(rad)*len, ey=cy+Math.sin(rad)*len;
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);
        ctx.strokeStyle=s.color+'bb';ctx.lineWidth=hovered===s.label?3:1.5;
        ctx.shadowBlur=hovered===s.label?10:0;ctx.shadowColor=s.color;
        ctx.stroke();ctx.shadowBlur=0;
        if(p>0.9){
          ctx.beginPath();ctx.arc(ex,ey,5,0,Math.PI*2);
          ctx.fillStyle=s.color;
          ctx.shadowBlur=8;ctx.shadowColor=s.color;
          ctx.fill();ctx.shadowBlur=0;
          ctx.font=`bold 9px Share Tech Mono, monospace`;
          ctx.fillStyle=s.color;ctx.textAlign='center';
          const lx=cx+Math.cos(rad)*(len+16), ly=cy+Math.sin(rad)*(len+16);
          ctx.fillText(s.label,lx,ly+3);
        }
      });
      ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);
      ctx.fillStyle='#f5c518';
      ctx.shadowBlur=14;ctx.shadowColor='#f5c518';ctx.fill();ctx.shadowBlur=0;
      frame++;
      if(frame<=totalFrames+10) requestAnimationFrame(draw);
      else setDrawn(true);
    };
    requestAnimationFrame(draw);
  },[visible]);

  return(
    <div className="ww-wrap">
      <div className="ww-title">🏏 WAGON WHEEL — SKILL SHOTS</div>
      <canvas ref={ref} id="wagon-canvas" width={300} height={300}
        style={{borderRadius:'50%',border:'1px solid rgba(245,197,24,0.2)',background:'rgba(0,0,0,0.4)',cursor:'crosshair'}}
        onMouseMove={e=>{
          const r=e.currentTarget.getBoundingClientRect();
          const mx=e.clientX-r.left-150, my=e.clientY-r.top-150;
          const angle=(Math.atan2(my,mx)*180/Math.PI+90+360)%360;
          const found=WAGON_SKILLS.find(s=>Math.abs(s.angle-angle)<18);
          setHovered(found?found.label:null);
        }}
        onMouseLeave={()=>setHovered(null)}
      />
      <div className="ww-legend">
        {WAGON_SKILLS.map(s=>(
          <div key={s.label} className="ww-leg-item">
            <div className="ww-dot" style={{background:s.color,boxShadow:`0 0 6px ${s.color}`}}/>
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stumps({blown}){
  return(
    <div className="stumps-wrap">
      {[0,1].map(side=>(
        <div key={side} className="stump-set">
          {['s1','s2','s3'].map((s,i)=>(
            <div key={i} className={`stump ${s}${blown?' blown':''}`}
              style={blown?{"--r":`${(i-1)*20}deg`,"--tx":`${(i-1)*15}px`,"--ty":'-10px',"--r2":`${(i-1)*80+30}deg`,"--tx2":`${(i-1)*40}px`,"--ty2":`${40+i*10}px`}:{}}
            />
          ))}
          <div className={`bail bail-l${blown?' blown':''}`}/>
          <div className={`bail bail-r${blown?' blown':''}`}/>
        </div>
      ))}
    </div>
  );
}

export default function Portfolio(){
  const [blown,setBlown]=useState(false);
  const [shooting,setShooting]=useState(false);
  const [skillsVis,setSkillsVis]=useState(false);
  const [statsVis,setStatsVis]=useState(false);
  const [skillsFilled,setSkillsFilled]=useState(false);
  const [form,setForm]=useState({name:"",email:"",message:""});
  const [status,setStatus]=useState("");
  const skillsRef=useRef(null);
  const heroRef=useRef(null);

  const projCount=useCounter(9,1400,statsVis);
  const cgpa=useCounter(867,1600,statsVis);
  const runs=useCounter(8670,1800,statsVis);

  useEffect(()=>{
    setTimeout(()=>setBlown(true),1200);
    setTimeout(()=>setBlown(false),2200);
  },[]);

  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){setSkillsVis(true);setTimeout(()=>setSkillsFilled(true),200);}
    },{threshold:0.2});
    const obs2=new IntersectionObserver(([e])=>{if(e.isIntersecting)setStatsVis(true);},{threshold:0.3});
    if(skillsRef.current) obs.observe(skillsRef.current);
    if(heroRef.current) obs2.observe(heroRef.current);
    return()=>{obs.disconnect();obs2.disconnect();};
  },[]);

  const fireShot=()=>{
    if(shooting) return;
    setShooting(true);
    setBlown(true);
    setTimeout(()=>setBlown(false),600);
  };

  const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=async(e)=>{
    e.preventDefault();setStatus("sending");
    try{
      const r=await fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({access_key:"d9743274-bd82-40a7-9d2b-b6b785c6c275",subject:"New Contact from Portfolio",from_name:"Portfolio Contact Form",...form})});
      if(r.ok){setStatus("ok");setForm({name:"",email:"",message:""});}else setStatus("err");
    }catch{setStatus("err");}
  };

  const commStr = COMMENTARY.join("   ◆   ");

  return(<>
    <style>{CSS}</style>
    <Crowd/>

    <div className="ticker">
      <div className="ticker-inner">{commStr}<span className="ticker-sep">◆</span>{commStr}</div>
    </div>

    <div className="ground">
      <nav className="nav">
        <a href="#" className="nav-logo">
          <div className="ball-icon"/>
          SP · CRICKET
        </a>
        <ul className="nav-ul">
          <li><a href="#about">Player</a></li>
          <li><a href="#projects">Matches</a></li>
          <li><a href="#skills">Stats</a></li>
          <li><a href="#experience">Career</a></li>
          <li><a href="#contact">XI</a></li>
          <li><a href="https://drive.google.com/file/d/1u3hQLi61BAbKneym4_QYbEXHYJYvHuio/view?usp=sharing" target="_blank" rel="noreferrer" className="nav-res">Résumé</a></li>
        </ul>
      </nav>

      <div className="pitch">

        <section className="hero" id="hero" ref={heroRef}>
          <TrajectoryCanvas shoot={shooting} onDone={()=>setShooting(false)}/>

          <svg style={{position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',width:'400px',opacity:0.06,pointerEvents:'none'}} viewBox="0 0 400 300">
            <rect x="150" y="10" width="100" height="280" fill="none" stroke="white" strokeWidth="2"/>
            <line x1="0" y1="150" x2="400" y2="150" stroke="white" strokeWidth="1" strokeDasharray="5,5"/>
            <ellipse cx="200" cy="150" rx="80" ry="40" fill="none" stroke="white" strokeWidth="1"/>
          </svg>

          <Stumps blown={blown}/>

          <div style={{animation:"fadeup 0.8s 0.1s ease both"}}>
            <div className="hero-name">SARTHAK<br/><span>PAPNEJA</span></div>
          </div>
          <div className="hero-role" style={{animation:"fadeup 0.8s 0.3s ease both"}}>
            Aspiring Software Engineer · AI · Cloud · Full-Stack
          </div>

          <div className="scoreboard" style={{animation:"fadeup 0.8s 0.6s ease both"}}>
            <div className="sb-item">
              <div className="sb-lbl">Career Runs</div>
              <div className="sb-val">{statsVis?runs:0}</div>
            </div>
            <div className="sb-div"/>
            <div className="sb-item">
              <div className="sb-lbl">Projects</div>
              <div className="sb-val">{statsVis?projCount:0}</div>
            </div>
            <div className="sb-div"/>
            <div className="sb-item">
              <div className="sb-lbl">Average</div>
              <div className="sb-val">{statsVis?(cgpa/100).toFixed(2):0}</div>
            </div>
            <div className="sb-div"/>
            <div className="sb-item">
              <div className="sb-lbl">Status</div>
              <div className="sb-val small"><span className="innings-tag">BATTING</span></div>
            </div>
          </div>

          <button className="hawkeye-btn" onClick={fireShot} disabled={shooting} style={{animation:"fadeup 0.8s 0.9s ease both"}}>
            🎯 {shooting?"TRACKING...":"FIRE HAWKEYE — CLICK ME"}
          </button>

          <div className="ctas">
            <a href="#projects" className="btn btn-red">🏏 View Matches</a>
            <a href="#contact" className="btn btn-gold">📋 Select My XI</a>
          </div>
        </section>

        <section id="about">
          <div className="sec-hdr">
            <div style={{flex:"0 0 auto"}}>
              <div className="sec-num">INNINGS 01</div>
              <div className="sec-title">PLAYER PROFILE</div>
            </div>
            <div className="sec-rule"/>
            <div className="sec-tag">SQUAD RECORD</div>
          </div>
          <div className="panel">
            <div className="player-grid">
              <div className="bio">
                <p>I am a Computer Science Engineering student at <strong>VIT University, Chennai</strong> (2022–2026) with a CGPA of <strong>8.67</strong>. A true all-rounder — comfortable building secure banking systems, creating AI models for data extraction, or shipping full-stack web applications.</p>
                <p>Strong technique in full-stack development, cloud computing (AWS), data analytics, and AI/ML engineering. A published researcher in <strong>post-quantum cryptography</strong> — and I play well under pressure.</p>
                <p>Currently preparing for the <strong>German MSc season</strong> — targeting top research universities in AI/ML and Data Science. IELTS 8.0. APS certified. Ready to bat.</p>
              </div>
              <div>
                <div className="player-card">
                  <div className="pc-banner">
                    <span>🏏 SARTHAK PAPNEJA</span>
                    <span className="pc-flag">🇮🇳</span>
                  </div>
                  <div className="pc-row"><span className="pc-k">Full Name</span><span className="pc-v">Sarthak Papneja</span></div>
                  <div className="pc-row"><span className="pc-k">Team</span><span className="pc-v">VIT Chennai XI</span></div>
                  <div className="pc-row"><span className="pc-k">Role</span><span className="pc-v">All-Rounder (AI+Cloud)</span></div>
                  <div className="pc-row"><span className="pc-k">Batting Avg</span><span className="pc-v gold">8.67 CGPA</span></div>
                  <div className="pc-row"><span className="pc-k">German Grade</span><span className="pc-v gold">≈ 1.80 Bavarian</span></div>
                  <div className="pc-row"><span className="pc-k">IELTS</span><span className="pc-v">8.0 Overall</span></div>
                  <div className="pc-row"><span className="pc-k">APS Certificate</span><span className="pc-v">32486/25</span></div>
                  <div className="pc-row"><span className="pc-k">Debut Year</span><span className="pc-v">2022</span></div>
                  <div className="pc-row"><span className="pc-k">Contract Status</span><span className="pc-v green">◉ AVAILABLE 2026</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects">
          <div className="sec-hdr">
            <div style={{flex:"0 0 auto"}}>
              <div className="sec-num">INNINGS 02</div>
              <div className="sec-title">MATCH RECORD</div>
            </div>
            <div className="sec-rule"/>
            <div className="sec-tag">9 MATCHES · 9 WINS</div>
          </div>
          <div className="panel">
            <div className="matches">
              {PROJECTS.map((p,i)=>(
                <div className="match" key={p.title}>
                  <div className="match-format">{p.format}</div>
                  <div className="match-title">{p.title}</div>
                  <div className="match-runs">⚡ {p.runs}</div>
                  <p className="match-desc">{p.desc}</p>
                  <div className="tech">{p.tech.map(t=><span key={t}>{t}</span>)}</div>
                  <div className="plinks">
                    {p.gh&&<a href={p.gh} target="_blank" rel="noreferrer" className="plink">⌥ GitHub</a>}
                    {p.live&&<a href={p.live} target="_blank" rel="noreferrer" className="plink">↗️ Live</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" ref={skillsRef}>
          <div className="sec-hdr">
            <div style={{flex:"0 0 auto"}}>
              <div className="sec-num">INNINGS 03</div>
              <div className="sec-title">BATTING STATS</div>
            </div>
            <div className="sec-rule"/>
            <div className="sec-tag">FULL SKILL CARD</div>
          </div>
          <div className="panel">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"48px",alignItems:"start"}}>
              <div>
                <div className="stats-table">
                  <div className="st-hdr">
                    <span>Skill Category</span>
                    <span>Proficiency Bar</span>
                    <span>AVG</span>
                  </div>
                  {SKILLS.map(s=>(
                    <div key={s.cat}>
                      <div className="st-row">
                        <div className="st-cat">{s.cat}</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          <div className="st-bar-wrap">
                            <div className="st-bar" style={{width:skillsFilled?`${s.avg}%`:"0%"}}/>
                          </div>
                          <div className="st-tags">{s.tags.map(t=><span key={t} className="st-tag">{t}</span>)}</div>
                        </div>
                        <div className="st-avg">{skillsFilled?s.avg:0}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <WagonWheel visible={skillsVis}/>
            </div>
          </div>
        </section>

        <section id="experience">
          <div className="sec-hdr">
            <div style={{flex:"0 0 auto"}}>
              <div className="sec-num">INNINGS 04</div>
              <div className="sec-title">CAREER LOG & TROPHY CABINET</div>
            </div>
            <div className="sec-rule"/>
            <div className="sec-tag">FIELD RECORD</div>
          </div>
          <div className="panel">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"52px"}}>
              <div>
                <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"var(--gold)",letterSpacing:"0.18em",marginBottom:"18px",opacity:0.75,textTransform:"uppercase"}}>Career History</div>
                <div className="career">
                  {EXP.map(e=>(
                    <div key={e.team} className="career-item">
                      <div className="ci-left">
                        <div className="ci-format">{e.format}</div>
                        <div className="ci-period">{e.period}</div>
                        <div className="ci-team">{e.team}</div>
                      </div>
                      <div className="ci-right">
                        <div className="ci-role">{e.role}</div>
                        <ul className="ci-ul">{e.bullets.map(b=><li key={b}>{b}</li>)}</ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"var(--gold)",letterSpacing:"0.18em",marginBottom:"18px",opacity:0.75,textTransform:"uppercase"}}>🏆 Trophy Cabinet — Published Research</div>
                <div className="trophy">
                  <div className="tr-banner">
                    <div className="tr-title">🏆 WORLD RECORD</div>
                    <div className="tr-trophy">🏆</div>
                  </div>
                  <div className="tr-body">
                    <div className="tr-ptitle">Q-Notary: A Decentralized, Quantum-Resistant Notary for Verifiable Collaborative Workflows</div>
                    <div className="tr-authors">Sarthak Papneja · Romit Gupta · Dr. Neelanarayanan V</div>
                    <div className="tr-meta">
                      <span>IJVRA · Vol 4, Issue 1</span>
                      <span>January 2026</span>
                      <span>DOI: 10.13140/RG.2.2.35802.20169</span>
                    </div>
                    <p className="tr-abs">Quantum computing threatens classical signature schemes. Q-Notary delivers a post-quantum secure notary framework using SPHINCS+, IPFS, and W3C Verifiable Credentials for tamper-evident notarisations and collaborative approvals.</p>
                    <div className="tr-kws">{RKW.map(k=><span key={k} className="tr-kw">{k}</span>)}</div>
                    <a href="https://www.researchgate.net/publication/399985730_Q-Notary_A_Decentralized_Quantum-Resistant_Notary_for_Verifiable_Collaborative_Workflows" target="_blank" rel="noreferrer" className="btn btn-gold" style={{fontSize:"0.76rem",padding:"9px 20px"}}>↗️ View on ResearchGate</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="sec-hdr">
            <div style={{flex:"0 0 auto"}}>
              <div className="sec-num">INNINGS 05</div>
              <div className="sec-title">SELECT YOUR XI</div>
            </div>
            <div className="sec-rule"/>
            <div className="sec-tag">OPEN SELECTION</div>
          </div>
          <div className="panel" style={{borderTopColor:"var(--green)"}}>
            <p className="contact-intro">I'm currently seeking new opportunities — MSc programmes, internships, or engineering roles. Step up to the crease and make your move.</p>
            <div className="contact-grid">
              <form className="cf" onSubmit={submit}>
                <div><label className="cf-lbl">Name</label><input className="fi" placeholder="Your name..." value={form.name} onChange={e=>upd("name",e.target.value)} required/></div>
                <div><label className="cf-lbl">Email</label><input className="fi" type="email" placeholder="your@email.com" value={form.email} onChange={e=>upd("email",e.target.value)} required/></div>
                <div><label className="cf-lbl">Message</label><textarea className="fta" placeholder="Your message..." value={form.message} onChange={e=>upd("message",e.target.value)} required/></div>
                <button type="submit" className="fsub" disabled={status==="sending"}>{status==="sending"?"Sending...":"🏏 Play Shot — Send"}</button>
                {status==="ok"&&<p className="fst-ok">✔ Message received. I'll respond soon!</p>}
                {status==="err"&&<p className="fst-err">✘ Failed. Email me directly.</p>}
              </form>
              <div className="socials">
                <a href="mailto:sarthakpapneja01@gmail.com" className="soc"><span className="soc-ic">✉</span>sarthakpapneja01@gmail.com</a>
                <a href="https://www.linkedin.com/in/sarthak-papneja-485118232/" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic">in</span>LinkedIn</a>
                <a href="https://github.com/sarthakpapneja" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic">GH</span>GitHub</a>
                <a href="https://www.researchgate.net/profile/Sarthak-Papneja" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic" style={{fontSize:"0.54rem"}}>RG</span>ResearchGate</a>
                <a href="https://drive.google.com/file/d/1u3hQLi61BAbKneym4_QYbEXHYJYvHuio/view?usp=sharing" target="_blank" rel="noreferrer" className="soc"><span className="soc-ic">↓</span>Résumé</a>
              </div>
            </div>
          </div>
        </section>

      </div>

      <footer className="foot">
        <div className="foot-stumps">
          {[60,66,60,66,60].map((h,i)=><div key={i} className="foot-stump" style={{height:h}}/>)}
        </div>
        <p>Designed & Built by <span>Sarthak Papneja</span> · VIT Chennai XI · Not Out 🏏</p>
      </footer>
    </div>
  </>);
}
