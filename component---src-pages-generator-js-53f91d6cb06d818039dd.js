(self.webpackChunklenia_stockmouton_com=self.webpackChunklenia_stockmouton_com||[]).push([[17],{72644:function(a,t){window.leniaEngine={},window.leniaEngine.init=function(a,e,r,n,f){void 0===n&&(n=1),void 0===f&&(f=30);var o,i,c,s=!1,l=0,u=0,h=null,p=null,d=1,m=1,v=1,g=1;function b(a,t){console.assert(2==a.length);var e=a[0],r=a[1];return(I(e)>=I("À")?I(e)-I("À")+(I("Z")-I("A"))+(I("z")-I("a")):I(e)>=I("a")?I(e)-I("a")+(I("Z")-I("A")):I(e)-I("A"))*t+(I(r)>=I("À")?I(r)-I("À")+(I("Z")-I("A"))+(I("z")-I("a")):I(r)>=I("a")?I(r)-I("a")+(I("Z")-I("A")):I(r)-I("A"))}function w(a,t){var e;(e=null==a?document.createElement("canvas"):document.getElementById(a)).width=e.height=t;var r=e.getContext("2d"),n=r.createImageData(e.width,e.height),f=e.getBoundingClientRect();return{can:e,ctx:r,img:n,left:f.left,top:f.top}}function M(a,t,e,r,n,f){for(var o=t.arr[0],i=t.shape[1],c=t.shape[2],s=Math.sin(f/180*Math.PI),l=Math.cos(f/180*Math.PI),u=(Math.abs(i*l)+Math.abs(c*s)+1)*n-1,h=(Math.abs(c*l)+Math.abs(i*s)+1)*n-1,p=0;p<u;p++)for(var v=0;v<h;v++){var g=Math.round((-(v-h/2)*s+(p-u/2)*l)/n+i/2),b=Math.round((+(v-h/2)*l+(p-u/2)*s)/n+c/2),w=x(v+e,d),M=x(p+r,d),y=g>=0&&b>=0&&g<i&&b<o[g].length?o[g][b]:0;y>0&&(a[8*m+M*d+w]=y)}}function y(a,t,e,r){var n,f=r[0].k_id,o=r[0].q,i=r[0].r,c=r[0].b,s=function(a){for(var t=Array(a),e=0;e<a;e++)t[e]=new Float32Array(a).fill(0);return t}(d);if("string"==typeof c){n=[];for(var l=c.split(","),u=0;u<l.length;u++){var h=l[u].split("/");2==h.length?n.push(parseInt(h[0],10)/parseInt(h[1],10)):n.push(parseFloat(h[0]))}}else n=r[0].b;for(var p=0,v=d/2,g=0;g<d;g++)for(var b=0;b<d;b++){var w=(g+v)%d-v,M=(b+v)%d-v,y=F(f,o,n,i,Math.sqrt(w*w+M*M)/e);p+=y,s[g][b]=y,w=d-(g+d/2)%d-1,M=(b+d/2)%d}for(var x=0;x<d;x++)for(var A=0;A<d;A++)s[x][A]/=p;for(var _=0;_<d;_++){a.set(s[_],6*m+_*d);var I=new Float32Array(d).fill(0);a.set(I,7*m+_*d)}t(1,6,7)}function F(a,t,e,r,n){var f=e.length,o=f*n,i=e[Math.min(parseInt(Math.floor(o),10),f-1)],c=(n<1)*function(a,t,e){var r;switch(a){case 0:return Math.pow(4*e*(1-e),t);case 1:return r=t-1/(e*(1-e)),Math.exp(t*r);case 2:return e>=t&&e<=1-t?1:0;case 3:return(e>=t&&e<=1-t?1:0)+.5*(e<t);case 4:return r=Math.pow((e-t)/(.3*t),2),Math.exp(-r/2)}}(a,t,o%1)*i;return c}function x(a,t){return(a%t+t)%t}function A(a){i=parseInt(Math.min(Math.max(a,1),4),10),d=_(i),m=Math.pow(d,2),g=Math.round(d*v),h=w(null,g),(p=w("RENDERING_CANVAS",2*g)).ctx.scale(2,2)}function _(a){return 1<<(a<=1?7:a<=2?8:9)}function I(a){return a.charCodeAt(0)}function E(a,t){for(var e=0;e<d;e++)for(var r=0;r<d;r++)a[8*m+e*d+r]=t}function k(a){for(var t={x:d,y:d,xm:0,ym:0},e=0;e<d;e++)for(var r=0;r<d;r++){a[8*m+e*d+r]>0&&(t.x=Math.min(r,t.x),t.y=Math.min(e,t.y),t.xm=Math.max(r,t.xm),t.ym=Math.max(e,t.ym))}for(var n={arr:[[]],shape:[1,t.ym-t.y,t.xm-t.x]},f=t.y;f<t.ym;f++){for(var o=new Float32Array(n.shape[2]),i=t.x,c=0;i<t.xm;i++,c++)o[c]=a[8*m+f*d+i];n.arr[0].push(o)}return n}function z(a){var t=a.target.getBoundingClientRect();l=(a.clientX-t.left)/2,u=(a.clientY-t.top)/2,s=!0}!function(r,n,f){n=parseInt(Math.min(Math.max(n-1,0),5),10),v=1<<n,r.config.world_params.scale=parseInt(Math.min(Math.max(r.config.world_params.scale,1),4),10);var w,F,x,N=(w=r.config.world_params.scale,F=_(w),x=(65535+(10*Math.pow(F,2)<<2)&-65536)>>>16,new WebAssembly.Memory({initial:x})),R={env:{memory:N},Math:Math};R[e]={GF_ID:r.config.kernels_params[0].gf_id,GF_M:r.config.kernels_params[0].m,GF_S:r.config.kernels_params[0].s,T:r.config.world_params.T},WebAssembly.instantiateStreaming(fetch(a),R).then((function(a){var e=a.instance;t=e.exports,c=t.updateFn;var n=new Float32Array(N.buffer);!function(a,t,e){var r=t.config,n=r.world_params.R;i=1;var f=function(a){var t=I("Z")-I("A")+(I("z")-I("a"))+(I("þ")-I("À")),e=a.split("::");console.assert(2==e.length&&e[0].length%2==0);for(var r=Math.pow(t,2)-1,n=e[1].split(";"),f=[],o=0;o<n.length;o++)f.push(parseInt(n[o],10));for(var i=[],c=0;c<e[0].length;c+=2){var s=b(e[0][c]+e[0][c+1],t)/r;i.push(s)}return function(a,t){console.assert(3==t.length);for(var e=t[0],r=t[1],n=t[2],f=new Array(e),o=0;o<e;o++){for(var i=new Array(r),c=0;c<r;c++){for(var s=new Float32Array(n),l=0;l<n;l++)s[l]=a[o*(r+n)+c*n+l];i[c]=s}f[o]=i}return{arr:f,shape:t}}(i,f)}(r.cells),s=!1,l=r.world_params.scale;for(;l>1||!s;){s=!0;var u=Math.min(l,2);A(i*u),e.setWorldSize(d),n=Math.round(n*u),y(a,e.FFT2D,n,r.kernels_params);var h=Math.floor(d/2-f.shape[2]/2*u),p=Math.floor(d/2-f.shape[1]/2*u),v=0;E(a,0),M(a,f,h,p,u,v);for(var g=20,w=0;w<g;w++)a.copyWithin(0*m,8*m,9*m),c();f=k(a),l/=u}o=f}(n,r,t),function(a,t){!function e(){if(setTimeout(e,1e3/t),a.copyWithin(0*m,8*m,9*m),c(),s){var r=Math.floor(l/v-o.shape[2]/2/i),n=Math.floor(u/v-o.shape[1]/2/i);M(a,o,r,n,1,0),s=!1}}()}(n,f),function(a,t){for(var e,r=0;r<t.length;r++){var n=t[r];"Colormap"===n.trait_type&&(e=n.value.trim().toLocaleLowerCase().replace(" ","-"))}!function t(){window.requestAnimationFrame(t),function(a,t,e,r){for(var n,f=C[r].length,o=a.img.data,i=0,c=0;c<g;c++)for(var s=Math.floor(c/v),l=0;l<g;l++){var u=Math.floor(l/v),h=t[8*m+s*d+u]*e,b=Math.floor(h*f);b=Math.max(b,0),b=Math.min(b,f-1),n=C[r][b];for(var w=0;w<3;w++)o[i++]=n[w];o[i++]=255}a.ctx.putImageData(a.img,0,0),p.ctx.drawImage(a.can,0,0)}(h,a,1,e)}()}(n,r.attributes),function(a){document.body.addEventListener("keydown",(function(t){32==t.keyCode&&E(a,0)})),document.getElementById("RENDERING_CANVAS").addEventListener("click",z)}(n)})).catch((function(a){console.log(a)}))}(r,n,f);var C={alizarin:N("d6c3c9",["f9c784","e7e7e7","485696","19180a","3f220f","772014","af4319","e71d36"]),"black-white":N("000000",["1f2123","393b41","555860","737780","9497a1","b6b9c1","d9dbe1","ffffff"]),"carmine-blue":N("#006eb8",["#006eb8","#fff200","#cc1236"]),cinnamon:N("#a7d4e4",["#a7d4e4","#71502f","#fdc57e"]),city:N("F93943",["23005c","3a0099","66daff","e6f9ff","004b63","ffca66","fff6e6","ffa600"]),golden:N("#b6bfc1",["#b6bfc1","#253122","#f3a257"]),laurel:N("381d2a",["60b9bf","bffbff","96ff80","eaffe6","71bf60","ff80b0","ffe6ef","ffbfd7"]),msdos:N("#0c0786",["#0c0786","#7500a8","#c03b80","#f79241","#fcfea4"]),"pink-beach":N("f4777f",["93003a","cf3759","ffbcaf","ffffe0","a5d5d8","73a2c6","4771b2","00429d"]),rainbow:N("#000000",["#FF0000","#FF7F00","#FFFF00","#00FF00","#0000FF","#2E2B5F","#8B00FF"]),"river-leaf":N("80ab82",["7dcd85","c5d6d8","99f7ab","2f52e0","bced09","f9cb40","ff715b","4c5b5c"]),salvia:N("#b6bfc1",["#b6bfc1","#051230","#97acc8"]),summer:N("ffe000",["ffbf66","fff4e6","995900","ff9400","6695ff","e6edff","002577","003dc7"]),"white-black":N("#ffffff",["#ffffff","#000000"])};function N(a,t){for(var e=Math.floor(254/(t.length-1)),r=[],n=0;n<t.length-1;n++){var f=W(R(t[n]).slice(0,3),R(t[n+1]).slice(0,3),e);r=r.concat(f)}var o=(""===a?[0,0,0,0]:R(a)).splice(0,3);return r.unshift(o),r}function R(a){return a=a.replace("#",""),rgbaList=[],[0,2,4].forEach((function(t){var e=a.substring(t,t+2);rgbaList.push(parseInt(e,16))})),rgbaList.push(255),rgbaList}function W(a,t,e){for(var r=.43,n=L(a),f=Z(n,r),o=L(t),i=Z(o,r),c=[],s=0;s<e;s++){for(var l=Math.pow(D(f,i,s/e),1/r),u=D(n,o,s/e),h=0,p=0;p<u.length;p++)h+=u[p];if(0!==h){for(var d=[],m=0;m<u.length;m++){var v=u[m];d.push(v*l/h)}u=d}u=S(u),c.push(u)}return c}function D(a,t,e){if(a instanceof Array){for(var r=[],n=0;n<a.length;n++){var f=a[n],o=t[n];r.push(f*(1-e)+o*e)}return r}return a*(1-e)+t*e}function L(a){for(var t=[],e=0;e<a.length;e++){var r=a[e]/255,n=void 0;n=r<=.04045?r/12.92:Math.pow((r+.055)/1.055,2.4),t.push(n)}return t}function S(a){for(var t,e=[],r=0;r<a.length;r++){var n=a[r];e.push(parseInt(255.9999*((t=n)<=.0031308?t*=12.92:t=1.055*Math.pow(t,1/2.4)-.055,t),10))}return e}function Z(a,t){for(var e=0,r=0;r<a.length;r++)e+=a[r];return Math.pow(e,t)}}},25577:function(a,t,e){"use strict";e.r(t),e.d(t,{default:function(){return p}});var r=e(67294),n=e(19339),f=e(15861),o=e(87757),i=e.n(o),c=e(50009),s=function(){var a=(0,f.Z)(i().mark((function a(){return i().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.abrupt("return",WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11])));case 1:case"end":return a.stop()}}),a)})));return function(){return a.apply(this,arguments)}}(),l=e(96633);"undefined"!=typeof window&&e(72644);var u=c.default.div.withConfig({displayName:"generator__StyledDiv",componentId:"sc-f8scat-0"})(["position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"]),h=function(a){var t=a.zoom,e=a.fps,n=a.scale,o=a.lenia_id,c=(0,r.useRef)(null);return(0,r.useEffect)((0,f.Z)(i().mark((function a(){var r,f,c,u,h;return i().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,s();case 2:return r=a.sent,f=r?"/optimized-simd.wasm":"/optimized.wasm",c=r?"engine-simd":"engine",a.next=7,l.get("/metadata/"+o+".json");case 7:u=a.sent,(h=u.data).config.world_params.scale=n,window.leniaEngine.init(f,c,h,t,e);case 11:case"end":return a.stop()}}),a)})))),r.createElement(u,{ref:c},r.createElement("canvas",{id:"RENDERING_CANVAS"}))},p=function(){var a=(0,n.Wd)("id",n.yz)[0],t=(0,n.Wd)("scale",n.yz)[0],e=(0,n.Wd)("fps",n.yz)[0],f=(0,n.Wd)("zoom",n.yz)[0];return r.createElement(h,{zoom:f||1,fps:e||26,scale:t||2,lenia_id:a||0})}}}]);
//# sourceMappingURL=component---src-pages-generator-js-53f91d6cb06d818039dd.js.map