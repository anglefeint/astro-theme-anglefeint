import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile, mkdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const exec = promisify(execFile);
const root = process.cwd();
const project = path.join(process.env.RUNNER_TEMP, 'anglefeint-consumer');
const evidence = path.join(root, 'cloud-evidence');
await mkdir(evidence, {recursive:true});
const results = [];
const commands = new Set();
async function run(args, cwd=project) {
  console.log('RUN npm '+args.join(' '));
  try {
    const result = await exec('npm',args,{cwd, maxBuffer:40*1024*1024, timeout:300000});
    console.log(result.stdout);
    results.push({command:'npm '+args.join(' '),passed:true});
    if(args[0]==='run') commands.add(args[1]);
    return result.stdout;
  } catch(error) {
    console.error(error.stdout,error.stderr);
    results.push({command:'npm '+args.join(' '),passed:false});
    throw error;
  }
}
const require = createRequire(path.join(process.env.RUNNER_TEMP,'browser-harness/package.json'));
const {chromium} = require('playwright');
async function serve(mode,port) {
  const child=spawn('npm',['run',mode,'--','--host','127.0.0.1','--port',String(port)],{
    cwd:project, detached:true, env:{...process.env,ASTRO_DEV_BACKGROUND:'1',ASTRO_PREVIEW_BACKGROUND:'1'}, stdio:['ignore','pipe','pipe']
  });
  let log=''; child.stdout.on('data',d=>log+=d); child.stderr.on('data',d=>log+=d);
  let browser;
  const base=`http://127.0.0.1:${port}`;
  try {
    let ready=false;
    for(let i=0;i<120;i++) {
      if(child.exitCode!==null) throw Error(log);
      try { if((await fetch(base+'/en/')).ok) {ready=true;break;} } catch {}
      await new Promise(r=>setTimeout(r,500));
    }
    assert.ok(ready,log);
    for(const route of ['/','/en/','/zh/','/en/blog/','/zh/tags/','/en/about/','/zh/rss.xml','/en/cloud-project/','/zh/blog/cloud-acceptance/']) {
      assert.equal((await fetch(base+route)).status,200,mode+' '+route);
    }
    browser=await chromium.launch();
    const context=await browser.newContext({viewport:{width:1440,height:900}, permissions:['clipboard-read','clipboard-write']});
    const page=await context.newPage();
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/en/blog/cloud-acceptance/');
    await page.locator('#lang-select').selectOption({label:'简体中文'});
    await page.waitForURL('**/zh/blog/cloud-acceptance/');
    assert.equal((await page.locator('#lang-select option:checked').innerText()).trim(),'简体中文');
    assert.equal(await page.locator('.ai-article-toc a').count(),3);
    await page.locator('.code-copy').click();
    await page.waitForFunction(()=>document.querySelector('.code-copy')?.classList.contains('is-copied'));
    assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/cloud acceptance/);
    await page.locator('.ai-prose-body img').click();
    await page.locator('dialog.article-image-preview[open]').waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog.article-image-preview[open]').count(),0);
    const og=await page.locator('meta[property="og:image"]').getAttribute('content');
    const png=Buffer.from(await (await fetch(base+new URL(og).pathname)).arrayBuffer());
    assert.equal(png.readUInt32BE(16),1200); assert.equal(png.readUInt32BE(20),630);
    if(mode==='preview') {
      await page.locator('[data-search-open]').click();
      await page.locator('#article-search-input').fill('CloudAcceptanceNeedle');
      await page.locator('#article-search a[href*="cloud-acceptance"]').first().waitFor();
      await page.keyboard.press('Escape');
      for(const route of ['/sitemap-index.xml','/pagefind/anglefeint.json']) assert.equal((await fetch(base+route)).status,200);
      await page.goto(base+'/zh/tags/');
      await page.getByRole('link',{name:/CloudTest/}).click();
      await page.locator('a[href*="/blog/cloud-acceptance/"]').first().waitFor();
    }
    for(const width of [1440,390]) {
      await page.setViewportSize({width,height:900});
      await page.goto(base+'/zh/');
      await page.locator('#lang-select').waitFor();
      const box=await page.locator('#lang-select').boundingBox();
      assert.ok(box && box.width>60 && box.x>=0 && box.x+box.width<=width,'language select fits viewport');
      await page.screenshot({path:path.join(evidence,`${mode}-${width}.png`)});
      await page.locator('#lang-select').selectOption({label:'English'});
      await page.waitForURL('**/en/');
    }
    assert.deepEqual(errors,[],'browser uncaught errors');
    commands.add(mode); results.push({command:'npm run '+mode,passed:true,browser:'desktop + mobile, language navigation, TOC, copy, image preview, OG'+(mode==='preview'?', Pagefind and tags':'')});
  } finally {
    await browser?.close();
    if(child.exitCode===null) {
      const stopped=new Promise(r=>child.once('exit',r));
      process.kill(-child.pid,'SIGTERM'); await stopped;
    }
    await writeFile(path.join(evidence,mode+'.log'),log);
  }
}
let passed=false;
try {
  await run(['create','astro@latest','--',project,'--template','anglefeint/astro-theme-anglefeint#starter','--yes','--no-install','--no-git'],process.env.RUNNER_TEMP);
  await run(['install','--prefer-online']);
  await run(['ci']);
  const pkg=JSON.parse(await readFile(path.join(project,'package.json'),'utf8'));
  const theme=JSON.parse(await readFile(path.join(project,'node_modules/@anglefeint/astro-theme/package.json'),'utf8'));
  assert.equal(theme.version,'0.5.1');
  assert.equal((await lstat(path.join(project,'node_modules/@anglefeint/astro-theme'))).isSymbolicLink(),false);
  await run(['audit','--audit-level=low','--prefer-online']);
  await run(['run','astro','--','--version']);
  await run(['run','new-post','--','cloud-acceptance','--locales','en,zh']);
  for(const locale of ['en','zh']) {
    const file=path.join(project,`src/content/blog/${locale}/cloud-acceptance.md`);
    const original=await readFile(file,'utf8');
    await writeFile(file,original.replace(/^---\r?\n/,"---\ntags: ['CloudTest']\n")+'\n## CloudAcceptanceNeedle\n\nCloud acceptance article.\n\n### Details\n\n```js\nconsole.log("cloud acceptance");\n```\n\n## Image\n\n![Cloud image](/favicon.svg)\n');
  }
  const fixture=path.join(project,'src/content/blog/zh/cloud-acceptance.md');
  const before=await readFile(fixture,'utf8');
  await run(['run','new-post','--','cloud-acceptance','--locales','en,zh']);
  assert.equal(await readFile(fixture,'utf8'),before);
  await run(['run','new-page','--','cloud-project','--theme','ai']);
  for(const command of ['sync-adapters','check:workspace-link','check:adapters','check:scaffold','check:no-build','check:about-runtime','check','doctor','build']) await run(['run',command]);
  await serve('dev',4367);
  await serve('preview',4368);
  assert.deepEqual(Object.keys(pkg.scripts).filter(name=>!commands.has(name)),[],'all starter scripts exercised');
  passed=true;
} finally {
  await writeFile(path.join(evidence,'report.json'),JSON.stringify({node:process.version,platform:process.platform,passed,commands:[...commands],results},null,2));
  console.log(JSON.stringify({node:process.version,passed,commands:[...commands]}));
}
