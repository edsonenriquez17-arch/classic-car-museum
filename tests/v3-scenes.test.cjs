const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'):'playwright');
const root=path.resolve(__dirname,'..');
test('V3-01 scene, menu and playback behavior',{timeout:180000},async t=>{
  const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.mp4':'video/mp4'};
  const server=http.createServer((req,res)=>{
    const name=decodeURIComponent(req.url.split('?')[0]),file=path.join(root,name==='/'?'index.html':name);
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);return res.end();}
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  const base=`http://127.0.0.1:${server.address().port}/`;
  const browser=await chromium.launch({headless:true,...(process.env.ARTECH_BROWSER_PATH?{executablePath:process.env.ARTECH_BROWSER_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--no-zygote']}:{})});
  t.after(()=>browser.close());
  async function page(options={}){
    const context=await browser.newContext({locale:'es-PE',viewport:{width:1440,height:900},reducedMotion:'no-preference',...options});
    await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
    const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
    await p.goto(base);if(await p.locator('#plSkip').isVisible())await p.locator('#plSkip').click();
    await p.locator('#top h1').waitFor();
    return {p,context,errors};
  }
  async function scroll(p,progress){
    await p.evaluate(value=>{const root=document.getElementById('v3Opening');scrollTo({top:root.getBoundingClientRect().top+scrollY+innerHeight*1.55*value,behavior:'instant'});},progress);
    await p.waitForTimeout(60);
    return p.locator('.v3-scene').evaluateAll(nodes=>nodes.map(n=>Number(getComputedStyle(n).opacity)));
  }
  await t.test('Scene exits fully to black, enters next, and reverses at the same scroll position',async()=>{
    const {p,context,errors}=await page();
    await p.waitForFunction(()=>document.getElementById('v3Opening').classList.contains('v3-enhanced'));
    const middle=await scroll(p,.79);assert.ok(middle[0]>.35&&middle[0]<.65);assert.equal(middle[1],0);
    assert.deepEqual(await scroll(p,.95),[0,0,0]);
    assert.deepEqual(await scroll(p,1.35),[0,1,0]);
    const reverse=await scroll(p,.79);assert.ok(Math.abs(reverse[0]-middle[0])<.01);
    assert.deepEqual(await scroll(p,0),[1,0,0]);
    assert.equal(await p.locator('.motion-bars,.motion-spotlight-plane,.pin-spacer').count(),0);
    assert.equal(await p.locator('#top img').evaluate(el=>getComputedStyle(el).filter),'none');
    assert.equal(await p.locator('#top img').evaluate(el=>getComputedStyle(el).maskImage),'none');
    assert.deepEqual(errors,[]);await context.close();
  });
  await t.test('Black-to-paper scene uses the same fade and restores all content in reduced motion',async()=>{
    const {p,context,errors}=await page();
    // Exercise the shared contract for the paper scenes added in later page milestones.
    await p.evaluate(()=>{document.querySelectorAll('.v3-scene')[1].classList.add('v3-scene--paper');window.ArtechMotion.refresh();});
    await scroll(p,.95);assert.deepEqual(await scroll(p,1.35),[0,1,0]);
    assert.equal(await p.locator('.v3-scene').nth(1).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(242, 240, 235)');
    await p.emulateMedia({reducedMotion:'reduce'});
    await p.waitForFunction(()=>!document.getElementById('v3Opening').classList.contains('v3-enhanced'));
    assert.deepEqual(await p.locator('.v3-scene').evaluateAll(nodes=>nodes.map(n=>[getComputedStyle(n).opacity,n.inert])),[['1',false],['1',false],['1',false]]);
    assert.equal(await p.locator('#v3Opening').evaluate(el=>el.style.height),'');
    assert.deepEqual(errors,[]);await context.close();
  });
  await t.test('Menu traps focus, updates its image and closes with Escape',async()=>{
    const {p,context,errors}=await page();await p.locator('#burger').click();
    assert.equal(await p.locator('#v3MenuPanel').isVisible(),true);
    assert.equal(await p.locator('#main-content').evaluate(el=>el.inert),true);
    const workshop=p.locator('#navlinks a[href="#p-workshops"]');await workshop.focus();
    await p.waitForFunction(()=>document.getElementById('v3MenuPhoto').getAttribute('src')==='assets/cars/cxj-330/d1.jpg');
    await p.locator('#navlinks a[href="#p-collection"]').focus();await workshop.focus();await p.waitForTimeout(650);
    assert.equal(await p.locator('#v3MenuPhoto').getAttribute('src'),'assets/cars/cxj-330/d1.jpg');
    assert.equal(await p.locator('#v3MenuPhoto').evaluate(el=>getComputedStyle(el).filter),'none');
    await p.locator('#burger').focus();await p.keyboard.press('Tab');
    assert.equal(await p.evaluate(()=>document.activeElement.closest('#header')!==null),true);
    await p.keyboard.press('Escape');assert.equal(await p.locator('#v3MenuPanel').isVisible(),false);
    assert.equal(await p.evaluate(()=>document.activeElement.id),'burger');
    assert.equal(await p.locator('#main-content').evaluate(el=>el.inert),false);
    assert.deepEqual(errors,[]);await context.close();
  });
  await t.test('Play is an icon, video waits for the user and pauses when leaving the scene',async()=>{
    const {p,context,errors}=await page();
    assert.equal(await p.locator('#heroVid').getAttribute('src'),null);
    assert.equal((await p.locator('#homeVideoToggle').innerText()).trim(),'');
    assert.equal(await p.locator('#homeVideoToggle svg').count(),2);
    assert.equal(await p.locator('#homeBrandsToggle').count(),0);
    assert.equal(await p.locator('#homeBrandTrack').evaluate(el=>getComputedStyle(el).animationName),'none');
    await p.locator('#homeVideoToggle').click();
    await p.waitForFunction(()=>!document.getElementById('heroVid').paused&&document.getElementById('heroVid').currentTime>0,null,{timeout:15000});
    assert.equal(await p.locator('#homeVideoToggle').getAttribute('aria-pressed'),'true');
    await scroll(p,1.35);assert.equal(await p.locator('#heroVid').evaluate(el=>el.paused),true);
    await p.goto(base+'#p-collection');await p.locator('#carGrid a').first().waitFor();
    assert.equal(await p.locator('#heroVid').evaluate(el=>el.paused),true);
    assert.deepEqual(errors,[]);await context.close();
  });
  await t.test('Keyboard scene controls and mobile layouts work at 320 and 390px',async()=>{
    for(const width of [320,390]){
      const {p,context,errors}=await page({viewport:{width,height:844}});
      await p.waitForFunction(()=>document.getElementById('v3Opening').classList.contains('v3-enhanced'));
      await p.locator('#top [data-next-scene]').click();
      assert.equal(await p.locator('[data-scene="home-02"]').getAttribute('aria-hidden'),'false');
      await p.locator('[data-scene="home-02"] [data-next-scene]').click();
      assert.equal(await p.locator('[data-scene="home-03"]').getAttribute('aria-hidden'),'false');
      assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await p.locator('#burger').click();await p.locator('[data-lang="en"]').click();
      assert.equal(await p.locator('#v3MenuPanel').isVisible(),true);
      assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await p.keyboard.press('Escape');
      await p.setViewportSize({width:844,height:390});
      await p.waitForFunction(()=>!document.getElementById('v3Opening').classList.contains('v3-enhanced'));
      assert.deepEqual(errors,[]);await context.close();
    }
  });
  await t.test('Returning from a route leaves no old pins and direct links skip the intro',async()=>{
    const {p,context,errors}=await page();
    await p.goto(base+'#p-vehicle/cxj-330');await p.locator('#vhName').waitFor();
    assert.equal(await p.locator('#preloader').isVisible(),false);
    await p.locator('#header .logo').click();
    await p.waitForFunction(()=>!document.body.classList.contains('page-open'));
    await p.waitForFunction(()=>document.getElementById('v3Opening').classList.contains('v3-enhanced'));
    assert.equal(await p.locator('.pin-spacer').count(),0);
    await p.reload();assert.equal(await p.locator('#preloader').isVisible(),false);
    assert.deepEqual(errors,[]);await context.close();
  });
  await t.test('Booking route fades through black, clears its curtain and supports browser Back',async()=>{
    const {p,context,errors}=await page();
    await p.locator('#top a[href="#p-tickets"]').click();
    await p.waitForURL('**/#p-tickets');
    await p.waitForFunction(()=>document.querySelector('.v3-route-curtain').hidden);
    assert.equal(await p.locator('#page-tickets').isVisible(),true);
    assert.equal(await p.locator('#visitIntro h1').first().evaluate(el=>el.classList.contains('v3-letter-light')),true);
    await p.goBack();await p.waitForFunction(()=>!document.body.classList.contains('page-open'));
    await p.waitForFunction(()=>document.querySelector('.v3-route-curtain').hidden);
    assert.equal(await p.locator('#top').isVisible(),true);
    assert.deepEqual(errors,[]);await context.close();
  });
  await t.test('New logo intro completes automatically and does not inherit the previous intro flag',async()=>{
    const context=await browser.newContext({locale:'es-PE',viewport:{width:1440,height:900},reducedMotion:'no-preference'});
    await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
    await context.addInitScript(()=>sessionStorage.setItem('artech_intro_seen','1'));
    const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
    await p.goto(base);assert.equal(await p.locator('#preloader').isVisible(),true);
    assert.equal(await p.locator('#main-content').evaluate(el=>el.inert),true);
    await p.waitForFunction(()=>document.getElementById('preloader').hidden,null,{timeout:7000});
    assert.equal(await p.locator('#main-content').evaluate(el=>el.inert),false);
    await p.reload();assert.equal(await p.locator('#preloader').isVisible(),false);
    assert.deepEqual(errors,[]);await context.close();
  });
});
