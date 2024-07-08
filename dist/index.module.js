import{P2PKH as t,LockingScript as n,Utils as r,fromUtxo as e,SatoshisPerKilobyte as o,Transaction as i}from"@bsv/sdk";import{Sigma as s}from"sigma-protocol";function u(t,n){(null==n||n>t.length)&&(n=t.length);for(var r=0,e=Array(n);r<n;r++)e[r]=t[r];return e}function a(t,n){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(r)return(r=r.call(t)).next.bind(r);if(Array.isArray(t)||(r=function(t,n){if(t){if("string"==typeof t)return u(t,n);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?u(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){r&&(t=r);var e=0;return function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(){return c=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var e in r)({}).hasOwnProperty.call(r,e)&&(t[e]=r[e])}return t},c.apply(null,arguments)}function f(t,n){return f=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t},f(t,n)}var d,l=function(t){return Buffer.from(t).toString("hex")},h="https://ordinals.gorillapool.io/api",v=/*#__PURE__*/function(r){function e(){return r.apply(this,arguments)||this}var o,i;return i=r,(o=e).prototype=Object.create(i.prototype),o.prototype.constructor=o,f(o,i),e.prototype.lock=function(r,e,o,i){var s="";if(void 0!==e&&void 0!==o){var u=l("ord"),a=Buffer.from(e,"base64").toString("hex").trim();if(!a)throw new Error("Invalid file data");var c=l(o);if(!c)throw new Error("Invalid media type");s="OP_0 OP_IF "+u+" OP_1 "+c+" OP_0 "+a+" OP_ENDIF"}var f=(s?s+" ":"")+(new t).lock(r).toASM();if(i&&(!i.app||!i.type))throw new Error("MAP.app and MAP.type are required fields");if(null!=i&&i.app&&null!=i&&i.type){f=f+" OP_RETURN "+l("1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5")+" "+l("SET");for(var d=0,h=Object.entries(i);d<h.length;d++){var v=h[d],p=v[0],m=v[1];"cmd"!==p&&(f=f+" "+l(p)+" "+l(m))}}return n.fromASM(f)},e}(t);!function(t){t.BSV20="bsv20",t.BSV21="bsv21"}(d||(d={}));var p=r.fromBase58Check,m=function(t,n){var r=e(c({},t,{script:Buffer.from(t.script,"base64").toString("hex")}),n);return r.sourceTXID=t.txid,r},g=function(n){try{var r=h+"/txos/address/"+n+"/unspent?bsv20=false";return console.log({payUrl:r}),Promise.resolve(fetch(r)).then(function(r){if(!r.ok)throw new Error("Error fetching pay utxos");return Promise.resolve(r.json()).then(function(r){r=r.filter(function(t){return 1!==t.satoshis});var e=p(n),o=(new t).lock(e.data);return r.map(function(t){return{txid:t.txid,vout:t.vout,satoshis:t.satoshis,script:Buffer.from(o.toBinary()).toString("base64")}})})})}catch(t){return Promise.reject(t)}},y=function(t,n,r,e){void 0===r&&(r=10),void 0===e&&(e=0);try{var o=h+"/txos/address/"+t+"/unspent?limit="+r+"&offset="+e+"&";return n&&(o+="q="+Buffer.from(JSON.stringify({map:{subTypeData:{collectionId:n}}})).toString("base64")),console.log({url:o}),Promise.resolve(fetch(o)).then(function(r){if(!r.ok)throw new Error("Error fetching NFT utxos for "+t);return Promise.resolve(r.json()).then(function(r){var e=(r=r.filter(function(t){var n;return 1===t.satoshis&&!(null!=(n=t.data)&&n.list)})).map(function(t){return t.txid+"_"+t.vout});return Promise.resolve(fetch(h+"/txos/outpoints?script=true",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify([].concat(e))})).then(function(e){if(!e.ok)throw new Error("Error fetching NFT scripts for "+t);return Promise.resolve(e.json()).then(function(t){return r=t.map(function(t){var r={origin:t.origin.outpoint,script:t.script,vout:t.vout,txid:t.txid,satoshis:1};return n&&(r.collectionId=n),r})})})})})}catch(t){return Promise.reject(t)}},w=function(t,n,r){try{var e=h+"/bsv20/"+r+"/"+(t===d.BSV20?"tick":"id")+"/"+n+"?bsv20=true&listing=false";return console.log({url:e}),Promise.resolve(fetch(e)).then(function(r){if(!r.ok)throw new Error("Error fetching "+t+" utxos");return Promise.resolve(r.json()).then(function(t){return t.map(function(t){return{amt:t.amt,script:t.script,vout:t.vout,txid:t.txid,id:n,satoshis:1}})})})}catch(t){return Promise.reject(t)}},b=function(t,n){try{var r,e=function(t){if(r)return t;throw new Error("Signer must be a LocalSigner or RemoteSigner")},o=null==n?void 0:n.idKey,i=null==n?void 0:n.keyHost;if(o){var u=new s(t).sign(o);return Promise.resolve(u.signedTx)}var a=function(){if(i){var e=null==n?void 0:n.authToken,o=new s(t);return function(t,n){try{var s=Promise.resolve(o.remoteSign(i,e)).then(function(t){return r=1,t.signedTx})}catch(t){return n(t)}return s&&s.then?s.then(void 0,n):s}(0,function(t){throw console.log(t),new Error("Remote signing to "+i+" failed")})}}();return Promise.resolve(a&&a.then?a.then(e):e(a))}catch(t){return Promise.reject(t)}},P=function(n){try{for(var r,e=n.utxos,s=n.destinations,u=n.paymentPk,c=n.changeAddress,f=n.satsPerKb,d=n.metaData,l=n.signer,h=n.additionalPayments,p=void 0===h?[]:h,g=new o(void 0===f?10:f),y=new i,w=a(e);!(r=w()).done;){var P=m(r.value,(new t).unlock(u));y.addInput(P)}s.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(var S,x=a(s);!(S=x()).done;){var k=S.value;if(!k.inscription)throw new Error("Inscription is required for all destinations");y.addOutput({satoshis:1,lockingScript:(new v).lock(k.address,k.inscription.dataB64,k.inscription.contentType,d)})}for(var O,B=a(p);!(O=B()).done;){var I=O.value;y.addOutput({satoshis:I.amount,lockingScript:(new t).lock(I.to)})}var E=e.reduce(function(t,n){return t+BigInt(n.satoshis)},0n),j=y.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n);return Promise.resolve(g.computeFee(y)).then(function(n){function r(){return Promise.resolve(y.fee(g)).then(function(){return Promise.resolve(y.sign()).then(function(){return o&&(o.satoshis=y.outputs[y.outputs.length-1].satoshis,o.txid=y.id("hex")),{tx:y,spentOutpoints:e.map(function(t){return t.txid+"_"+t.vout}),payChange:o}})})}var o;if(E>j+BigInt(n)){var i=(new t).lock(c||u.toAddress().toString()),s={lockingScript:i,change:!0};o={txid:"",vout:y.outputs.length,satoshis:0,script:Buffer.from(i.toHex(),"hex").toString("base64")},y.addOutput(s)}var a=function(){if(l)return Promise.resolve(b(y,l)).then(function(t){y=t})}();return a&&a.then?a.then(r):r()})}catch(t){return Promise.reject(t)}};const S="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function x(t,n,r){if(!t.s){if(r instanceof k){if(!r.s)return void(r.o=x.bind(null,t,n));1&n&&(n=r.s),r=r.v}if(r&&r.then)return void r.then(x.bind(null,t,n),x.bind(null,t,2));t.s=n,t.v=r;var e=t.o;e&&e(t)}}var k=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,r){var e=new t,o=this.s;if(o){var i=1&o?n:r;if(i){try{x(e,1,i(this.v))}catch(t){x(e,2,t)}return e}return this}return this.o=function(t){try{var o=t.v;1&t.s?x(e,1,n?n(o):o):r?x(e,1,r(o)):x(e,2,o)}catch(t){x(e,2,t)}},e},t}();function O(t){return t instanceof k&&1&t.s}var B=function(n){try{var r,e=function(){function r(){return Promise.resolve(c.fee(u)).then(function(){return Promise.resolve(c.sign()).then(function(){return e&&(e.satoshis=c.outputs[c.outputs.length-1].satoshis,e.txid=c.id("hex")),{tx:c,spentOutpoints:f,payChange:e}})})}if(A<T)throw new Error("Not enough ordinals to send");var e;if(A>T+BigInt(_)){var o=(new t).lock(n.changeAddress||n.paymentPk.toAddress().toString()),i={lockingScript:o,change:!0};e={txid:"",vout:c.outputs.length,satoshis:0,script:Buffer.from(o.toHex(),"hex").toString("base64")},c.addOutput(i)}var s=function(){if(n.signer)return Promise.resolve(b(c,n.signer)).then(function(t){c=t})}();return s&&s.then?s.then(r):r()};n.satsPerKb||(n.satsPerKb=10),n.additionalPayments||(n.additionalPayments=[]),void 0===n.enforceUniformSend&&(n.enforceUniformSend=!0);for(var s,u=new o(n.satsPerKb),c=new i,f=[],d=a(n.ordinals);!(s=d()).done;){var l=s.value;if(1!==l.satoshis)throw new Error("1Sat Ordinal utxos must have exactly 1 satoshi");var h=m(l,(new v).unlock(n.ordPk));f.push(l.txid+"_"+l.vout),c.addInput(h)}if(n.enforceUniformSend&&n.destinations.length!==n.ordinals.length)throw new Error("Number of destinations must match number of ordinals being sent");for(var p,g=a(n.destinations);!(p=g()).done;){var y,w,P,B=p.value;P=null!=(y=B.inscription)&&y.dataB64&&null!=(w=B.inscription)&&w.contentType?(new v).lock(B.address,B.inscription.dataB64,B.inscription.contentType,n.metaData):(new t).lock(B.address),c.addOutput({satoshis:1,lockingScript:P})}for(var I,E=a(n.additionalPayments);!(I=E()).done;){var j=I.value;c.addOutput({satoshis:j.amount,lockingScript:(new t).lock(j.to)})}var A=0n,T=c.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n),_=0,C=function(t,n,r){if("function"==typeof t[S]){var e,o,i,s=t[S]();if(function t(u){try{for(;!((e=s.next()).done||r&&r());)if((u=n(e.value))&&u.then){if(!O(u))return void u.then(t,i||(i=x.bind(null,o=new k,2)));u=u.v}o?x(o,1,u):o=u}catch(t){x(o||(o=new k),2,t)}}(),s.return){var u=function(t){try{e.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(u,function(t){throw u(t)});u()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var a=[],c=0;c<t.length;c++)a.push(t[c]);return function(t,n,r){var e,o,i=-1;return function s(u){try{for(;++i<t.length&&(!r||!r());)if((u=n(i))&&u.then){if(!O(u))return void u.then(s,o||(o=x.bind(null,e=new k,2)));u=u.v}e?x(e,1,u):e=u}catch(t){x(e||(e=new k),2,t)}}(),e}(a,function(t){return n(a[t])},r)}(n.paymentUtxos,function(e){var o=m(e,(new t).unlock(n.paymentPk));return f.push(e.txid+"_"+e.vout),c.addInput(o),A+=BigInt(e.satoshis),Promise.resolve(u.computeFee(c)).then(function(t){_=t,A>=T+BigInt(_)&&(r=1)})},function(){return r});return Promise.resolve(C&&C.then?C.then(e):e())}catch(t){return Promise.reject(t)}};const I="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function E(t,n,r){if(!t.s){if(r instanceof j){if(!r.s)return void(r.o=E.bind(null,t,n));1&n&&(n=r.s),r=r.v}if(r&&r.then)return void r.then(E.bind(null,t,n),E.bind(null,t,2));t.s=n,t.v=r;var e=t.o;e&&e(t)}}var j=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,r){var e=new t,o=this.s;if(o){var i=1&o?n:r;if(i){try{E(e,1,i(this.v))}catch(t){E(e,2,t)}return e}return this}return this.o=function(t){try{var o=t.v;1&t.s?E(e,1,n?n(o):o):r?E(e,1,r(o)):E(e,2,o)}catch(t){E(e,2,t)}},e},t}();function A(t){return t instanceof j&&1&t.s}var T=function(n){try{for(var r,e,s=function(){if(P<S+x)throw new Error("Not enough funds to send. Total sats in: "+P+", Total sats out: "+S+", Fee: "+x);var n;if(P>S+x){var r=(new t).lock(v),e={lockingScript:r,change:!0};n={txid:"",vout:g.outputs.length,satoshis:0,script:Buffer.from(r.toHex(),"hex").toString("base64")},g.addOutput(e)}else P<S+x&&console.log("No change needed");return Promise.resolve(g.fee(p)).then(function(){return Promise.resolve(g.sign()).then(function(){return n&&(n.satoshis=g.outputs[g.outputs.length-1].satoshis,n.txid=g.id("hex")),{tx:g,spentOutpoints:u.map(function(t){return t.txid+"_"+t.vout}),payChange:n}})})},u=n.utxos,c=n.paymentPk,f=n.payments,d=n.satsPerKb,l=void 0===d?10:d,h=n.changeAddress,v=void 0===h?c.toAddress().toString():h,p=new o(l),g=new i,y=a(f);!(e=y()).done;){var w=e.value,b={satoshis:w.amount,lockingScript:(new t).lock(w.to)};g.addOutput(b)}var P=0n,S=g.outputs.reduce(function(t,n){return t+(n.satoshis||0)},0),x=0,k=function(t,n,r){if("function"==typeof t[I]){var e,o,i,s=t[I]();if(function t(u){try{for(;!((e=s.next()).done||r&&r());)if((u=n(e.value))&&u.then){if(!A(u))return void u.then(t,i||(i=E.bind(null,o=new j,2)));u=u.v}o?E(o,1,u):o=u}catch(t){E(o||(o=new j),2,t)}}(),s.return){var u=function(t){try{e.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(u,function(t){throw u(t)});u()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var a=[],c=0;c<t.length;c++)a.push(t[c]);return function(t,n,r){var e,o,i=-1;return function s(u){try{for(;++i<t.length&&(!r||!r());)if((u=n(i))&&u.then){if(!A(u))return void u.then(s,o||(o=E.bind(null,e=new j,2)));u=u.v}e?E(e,1,u):e=u}catch(t){E(e||(e=new j),2,t)}}(),e}(a,function(t){return n(a[t])},r)}(u,function(n){var e=m(n,(new t).unlock(c));return g.addInput(e),P+=BigInt(n.satoshis),Promise.resolve(p.computeFee(g)).then(function(t){P>=S+(x=t)&&(r=1)})},function(){return r});return Promise.resolve(k&&k.then?k.then(s):s())}catch(t){return Promise.reject(t)}},_=function(t){try{var n=t.protocol,r=t.tokenID,e=t.utxos,o=t.inputTokens,i=t.distributions,s=t.paymentPk,u=t.ordPk,f=t.changeAddress,l=t.tokenChangeAddress,h=t.satsPerKb,v=void 0===h?10:h,p=t.metaData,m=t.signer,g=t.additionalPayments,y=void 0===g?[]:g,w=0n,b=0n,P=0n;if(!o.every(function(t){return t.id===r}))throw new Error("Input tokens do not match the provided tokenID");for(var S,x=a(o);!(S=x()).done;)b+=BigInt(S.value.amt);for(var k,O=a(i);!(k=O()).done;)P+=BigInt(k.value.amt);if(b<P)throw new Error("Not enough tokens to send");if((w=b-P)>0n){var I={address:l||u.toAddress().toString(),amt:w.toString()};i.push(I)}var E=i.map(function(t){var e,o={p:"bsv-20",op:"transfer",amt:t.amt};if(n===d.BSV20)e=c({},o,{tick:r});else{if(n!==d.BSV21)throw new Error("Invalid protocol");e=c({},o,{id:r})}return{address:t.address,inscription:{dataB64:Buffer.from(JSON.stringify(e)).toString("base64"),contentType:"application/bsv-20"}}}),j={paymentUtxos:e,ordinals:o,paymentPk:s,ordPk:u,destinations:E,changeAddress:f||s.toAddress().toString(),satsPerKb:v,metaData:p,signer:m,additionalPayments:y,enforceUniformSend:!1};return Promise.resolve(B(j)).then(function(t){var n,e=t.tx,o=t.spentOutpoints,i=t.payChange,s=E.findIndex(function(t){return t.address===(l||u.toAddress().toString())});return-1!==s&&(n={id:r,amt:w.toString(),satoshis:1,txid:e.id("hex"),vout:s,script:Buffer.from(e.outputs[s].lockingScript.toHex(),"hex").toString("base64")}),{tx:e,spentOutpoints:o,payChange:i,tokenChange:n}})}catch(t){return Promise.reject(t)}};export{d as TokenType,P as createOrdinals,y as fetchNftUtxos,g as fetchPayUtxos,w as fetchTokenUtxos,B as sendOrdinals,T as sendUtxos,_ as transferOrdTokens};
//# sourceMappingURL=index.module.js.map
