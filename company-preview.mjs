import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('dist-company');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.txt':'text/plain','.xml':'application/xml','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
  try{
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(path==='/__qa/mobile'||path==='/__qa/tablet'){
      const width=path.endsWith('/tablet')?768:375;
      res.writeHead(200,{'Content-Type':types['.html']});
      return res.end(`<!doctype html><html lang="en"><head><title>MEKreflect responsive QA ${width}px</title><style>body{margin:16px;background:#ddd;font:14px Arial}iframe{width:${width}px;height:812px;border:1px solid #888}nav{margin-bottom:15px}a{margin-right:20px}</style></head><body><nav>Responsive frame ${width}px <a href="/" target="site">Home</a><a href="/research/" target="site">Research</a><a href="/case-studies/current-fields-at-a-handoff/" target="site">Case</a></nav><iframe title="Responsive MEKreflect" name="site" src="/"></iframe></body></html>`);
    }
    let target=resolve(root,'.'+path);
    if(target!==root&&!target.startsWith(root+sep)){res.writeHead(403);return res.end();}
    if(!extname(target))target=resolve(target,'index.html');
    const data=await readFile(target);res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream'});res.end(data);
  }catch{res.writeHead(404,{'Content-Type':types['.html']});res.end(await readFile(resolve(root,'404.html')));}
}).listen(Number(process.env.PORT||4222),'127.0.0.1',()=>console.log(`MEKreflect company preview: http://127.0.0.1:${process.env.PORT||4222}`));
