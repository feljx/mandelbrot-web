const t=(e=[15,26,56],n=[255,240,200],function(t){const o=n[0]-e[0],r=n[1]-e[1],s=n[2]-e[2],[f,l,c]=[o*t+e[0],r*t+e[1],s*t+e[2]];return[f,l,c,255]});var e,n;let o;function r(e){const n=e.data,r=function(e,n,o,r,s,f,l,c){const a=(c-f)*(l-s);let i=!0;for(let t=s;t<l;t+=3){const s=[f,c-1];for(const f of s){let s=0,l=0,c=0,a=0;const u=(f+.5-e/2)*o,b=(n/2-t+.5)*o;let g=0;for(;c+a<=4&&g!=r;)l*=s,l+=l,l+=b,s=c-a+u,c=s*s,a=l*l,g+=1;if(g<r){i=!1;break}}}for(let t=f;t<c;t+=3){const f=[s,l-1];for(const s of f){let f=0,l=0,c=0,a=0;const u=(t+.5-e/2)*o,b=(n/2-s+.5)*o;let g=0;for(;c+a<=4&&g!=r;)l*=f,l+=l,l+=b,f=c-a+u,c=f*f,a=l*l,g+=1;if(g<r){i=!1;break}}}if(i){const t=new Uint32Array(a).fill(4278190080);return new Uint8ClampedArray(t.buffer)}const u=new Uint8ClampedArray(4*a);let b=0;for(let a=s;a<l;a++)for(let s=f;s<c;s++){let f=0,l=0,c=0,i=0;const g=(s+.5-e/2)*o,d=(n/2-a+.5)*o;let h=0;for(;c+i<=4&&h!=r;)l*=f,l+=l,l+=d,f=c-i+g,c=f*f,i=l*l,h+=1;const p=h>=r?[0,0,0,255]:t(h/r*40);u[4*b]=p[0],u[4*b+1]=p[1],u[4*b+2]=p[2],u[4*b+3]=p[3],b+=1}return u}(o.real_width,o.real_height,n.pixel_length,o.iterations,n.top,n.left,n.bot,n.right);n.bytes=r,self.postMessage(n,[n.bytes.buffer])}self.onmessage=function(t){const e=t.data;o=e,self.onmessage=r};
//# sourceMappingURL=worker.4dc13bfc.js.map
