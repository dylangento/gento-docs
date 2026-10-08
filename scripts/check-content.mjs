import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const zhRoot=path.join(root,'i18n/zh-CN/docusaurus-plugin-content-docs/current');
const enRoot=path.join(root,'docs');
// review/ is kept locally only (gitignored). Without it, review-record checks are skipped.
const statusPath=path.join(root,'review/page-status.json');
const haveReview=fs.existsSync(statusPath);
const statuses=haveReview?JSON.parse(fs.readFileSync(statusPath,'utf8')):[];
if(process.argv.includes('--release')&&!haveReview){console.error('--release needs review/page-status.json (kept locally).');process.exit(1);}
const errors=[];
const body=s=>s.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'').trim();
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]).filter(x=>x.endsWith('.mdx'));
const enFiles=walk(enRoot).map(p=>path.relative(enRoot,p));
const zhFiles=walk(zhRoot).map(p=>path.relative(zhRoot,p));
for(const name of new Set([...enFiles,...zhFiles])) {
  if(!enFiles.includes(name)||!zhFiles.includes(name)){errors.push(`Missing locale counterpart: ${name}`);continue;}
  const en=fs.readFileSync(path.join(enRoot,name),'utf8');
  const zh=fs.readFileSync(path.join(zhRoot,name),'utf8');
  const hash=crypto.createHash('sha256').update(body(zh)).digest('hex');
  const recorded=en.match(/^source_zh_sha256: (\w+)$/m)?.[1];
  const status=statuses.find(p=>p.page===name.replace(/\.mdx$/,''));
  if(hash!==recorded)errors.push(`English translation needs synchronization: ${name}`);
  if(haveReview&&(!status||status.chinese_body_sha256!==hash))errors.push(`Review record missing or stale: ${name}`);
  if(!/^source_ids:/m.test(en)||!/^source_ids:/m.test(zh))errors.push(`Source provenance missing: ${name}`);
  for(const [lang,text] of [['en',en],['zh-CN',zh]]) {
    for(const m of text.matchAll(/!\[[^\]]*\]\((\/img\/[^)]+)\)/g))
      if(!fs.existsSync(path.join(root,'static',m[1])))errors.push(`Missing image ${lang}/${name}: ${m[1]}`);
  }
  if(process.argv.includes('--release')) {
    for(const field of ['technical_review','translation_review','public_release'])
      if(status?.[field]!=='approved'||!status?.[field+'_by']||!status?.[field+'_date'])errors.push(`${name}: ${field} pending or reviewer/date missing`);
  }
}
if(haveReview&&statuses.length!==enFiles.length)errors.push('Review record count does not match pages');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Verified ${enFiles.length} English/Chinese page pairs, translation fingerprints, and image references.`);
if(!haveReview)console.log('review/ not present (kept locally), so review records were not checked.');
