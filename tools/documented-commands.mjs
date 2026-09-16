import {execFile, spawn} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,writeFile,mkdir,access,readdir} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const exec=promisify(execFile);
const pm=process.env.TEST_PM || 'npm';
const project=path.join(process.env.RUNNER_TEMP,'documented-consumer');
const evidence=path.resolve('command-evidence');
await mkdir(evidence,{recursive:true});
const results=[];
const scripts=new Set();
let passed=false;
async function command(bin,args,{cwd=project,env={},failure=false}={}) {
  const label=[bin,...args].join(' ');
  console.log('RUN '+label);
  let result;
  try {result=await exec(bin,args,{cwd,env:{...process.env,...env},timeout:600000,maxBuffer:50*1024*1024});}
  catch(error) {result=error;}
  await writeFile(path.join(evidence,`${results.length}.log`),(result.stdout||'')+'\n'+(result.stderr||''));
  const code=result.code ?? 0;
  const ok=failure ? Number.isInteger(code)&&code!==0 : code===0;
  results.push({command:label,env,status:ok?(failure?'expected-rejection':'passed'):'failed',exitCode:code});
  assert.ok(ok,label+'\n'+result.stdout+'\n'+result.stderr);
  if(bin===pm&&args[0]==='run'&&!failure) scripts.add(args[1]);
  return (result.stdout||'')+(result.stderr||'');
}
const run=(name,args=[],options={})=>command(pm,['run',name,...(args.length?(pm==='npm'?['--',...args]:args):[])],options);
const file=relative=>path.join(project,relative);
async function postLocales(slug,expected) {
  const actual=[];
  for(const lang of await readdir(file('src/content/blog'))) {
    try {await access(file(`src/content/blog/${lang}/${slug}.md`));actual.push(lang);} catch {}
  }
  assert.deepEqual(actual.sort(),[...expected].sort(),slug+' locales');
}
async function server(mode,port,routes) {
  const args=pm==='npm'?['run',mode,'--','--host','127.0.0.1','--port',String(port)]:[mode,'--host','127.0.0.1','--port',String(port)];
  const child=spawn(pm,args,{cwd:project,detached:true,env:{...process.env,ASTRO_DEV_BACKGROUND:'1',ASTRO_PREVIEW_BACKGROUND:'1'},stdio:['ignore','pipe','pipe']});
  let log='';child.stdout.on('data',d=>log+=d);child.stderr.on('data',d=>log+=d);
  try {
    let ready=false;
    for(let i=0;i<180;i++) {
      if(child.exitCode!==null) throw Error(log);
      try {if((await fetch(`http://127.0.0.1:${port}/en/`,{signal:AbortSignal.timeout(2000)})).ok){ready=true;break;}}catch{}
      await new Promise(r=>setTimeout(r,500));
    }
    assert.ok(ready,log);
    for(const route of routes) {
      const response=await fetch(`http://127.0.0.1:${port}${route}`,{signal:AbortSignal.timeout(30000)});
      assert.equal(response.status,200,mode+' '+route);
      assert.match(await response.text(),/<html/i,route);
    }
    scripts.add(mode);results.push({command:[pm,...args].join(' '),status:'passed',routes});
  } finally {
    if(child.exitCode===null) {
      const stopped=new Promise(resolve=>child.once('exit',resolve));
      process.kill(-child.pid,'SIGTERM');
      const timer=setTimeout(()=>{try{process.kill(-child.pid,'SIGKILL');}catch{}},5000);
      await stopped;clearTimeout(timer);
    }
    await writeFile(path.join(evidence,mode+'.log'),log);
  }
}
try {
  await command('npm',['create','astro@latest','--',project,'--template','anglefeint/astro-theme-anglefeint#starter','--yes','--no-install','--no-git'],{cwd:process.env.RUNNER_TEMP});
  await command(pm,['install']);
  const pkg=JSON.parse(await readFile(file('package.json'),'utf8'));
  const version=JSON.parse(await readFile(file('node_modules/@anglefeint/astro-theme/package.json'),'utf8')).version;
  results.push({status:'passed',themeVersion:version,packageManager:pm,node:process.version});
  await command(pm,['audit','--audit-level=low']);
  for(const name of ['new-post','new-page']) assert.match(await run(name,['--help']),/Usage:/i);
  await run('new-post',['default-locales']);
  await postLocales('default-locales',['en','ja','ko','es','zh']);
  await run('new-post',['explicit-locales','--locales','en,fr']);
  await postLocales('explicit-locales',['en','fr']);
  await run('new-post',['environment-locales'],{env:{ANGLEFEINT_LOCALES:'en,fr'}});
  await postLocales('environment-locales',['en','fr']);
  await run('new-post',['priority-locales','--locales','zh'],{env:{ANGLEFEINT_LOCALES:'en,fr'}});
  await postLocales('priority-locales',['zh']);
  const article=file('src/content/blog/en/default-locales.md');
  const text=(await readFile(article,'utf8'))+'\nUser content sentinel\n';
  await writeFile(article,text);
  await run('new-post',['default-locales']);assert.equal(await readFile(article,'utf8'),text);
  const routes=['/en/','/zh/','/en/blog/default-locales/'];
  for(const theme of ['base','ai','cyber','hacker','matrix']) {
    await run('new-page',['projects-'+theme,'--theme',theme]);
    for(const locale of ['en','ja','ko','es','zh']) routes.push(`/${locale}/projects-${theme}/`);
  }
  await run('new-page',['projects/labs','--theme','base']);routes.push('/en/projects/labs/');
  const pageFile=file('src/pages/[lang]/projects-base.astro');
  const pageText=await readFile(pageFile,'utf8');
  await run('new-page',['projects-base','--theme','ai'],{failure:true});assert.equal(await readFile(pageFile,'utf8'),pageText);
  await run('new-post',['INVALID_name'],{failure:true});
  await run('new-page',['INVALID_name'],{failure:true});
  await run('new-page',['bad-theme','--theme','unknown'],{failure:true});
  await command('npx',['--no-install','anglefeint-new-post','direct-post']);await postLocales('direct-post',['en','ja','ko','es','zh']);
  await command('npx',['--no-install','anglefeint-new-page','direct-page','--theme','matrix']);routes.push('/en/direct-page/');
  // Also exercise the installed package bins exactly as named in its README.
  await command(file('node_modules/.bin/anglefeint-new-post'),['bin-post','--locales','en,fr']);await postLocales('bin-post',['en','fr']);
  await command(file('node_modules/.bin/anglefeint-new-page'),['bin-page','--theme','base']);routes.push('/en/bin-page/');
  const adapter=file('src/config/theme.ts');const original=await readFile(adapter,'utf8');
  await writeFile(adapter,original+'\n// deliberate acceptance drift\n');
  await run('check:adapters',[],{failure:true});await run('doctor',[],{failure:true});
  await run('sync-adapters');assert.equal(await readFile(adapter,'utf8'),original);
  for(const name of ['check:adapters','check:scaffold','check:no-build','check:about-runtime','check','doctor','build']) await run(name);
  assert.match(await run('check:workspace-link'),/skipped/);
  results.push({command:'check:workspace-link',status:'not-applicable',reason:'consumer mode: guard intentionally skips workspace validation'});
  await run('astro',['--version']);
  await server('dev',4381,routes);await server('preview',4382,routes);
  assert.deepEqual(Object.keys(pkg.scripts).filter(name=>!scripts.has(name)),[]);
  if(pm==='npm') {
    // Package-only update on this compatible skeleton; not a historical-starter migration claim.
    const config=file('src/site.config.ts');const configText=await readFile(config,'utf8');
    await command('npm',['install','@anglefeint/astro-theme@0.5.0']);
    assert.equal(JSON.parse(await readFile(file('node_modules/@anglefeint/astro-theme/package.json'),'utf8')).version,'0.5.0');
    await command('npm',['update','@anglefeint/astro-theme']);
    await command('npm',['install']);
    assert.equal(JSON.parse(await readFile(file('node_modules/@anglefeint/astro-theme/package.json'),'utf8')).version,version);
    await command('npm',['install','@anglefeint/astro-theme@latest']);
    await command('npm',['pkg','set','scripts.new-post=anglefeint-new-post']);
    await command('npm',['pkg','set','scripts.new-page=anglefeint-new-page']);
    await command('npm',['install']);
    for(const name of ['new-post','new-page']) await run(name,['--help']);
    for(const name of ['doctor','check','build']) await run(name);
    assert.equal(await readFile(config,'utf8'),configText);assert.equal(await readFile(article,'utf8'),text);
    await server('preview',4383,routes);
  }
  passed=true;
} catch(error) {
  results.push({status:'failed',error:error.stack});throw error;
} finally {
  await writeFile(path.join(evidence,'report.json'),JSON.stringify({passed,pm,node:process.version,scripts:[...scripts],results},null,2));
}
