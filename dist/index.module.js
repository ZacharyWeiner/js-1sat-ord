import{P2PKH as t,LockingScript as n,Utils as r,fromUtxo as e,SatoshisPerKilobyte as o,Transaction as i}from"@bsv/sdk";import{Sigma as s}from"sigma-protocol";function a(t,n){(null==n||n>t.length)&&(n=t.length);for(var r=0,e=Array(n);r<n;r++)e[r]=t[r];return e}function u(t,n){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(r)return(r=r.call(t)).next.bind(r);if(Array.isArray(t)||(r=function(t,n){if(t){if("string"==typeof t)return a(t,n);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?a(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){r&&(t=r);var e=0;return function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(){return c=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var e in r)({}).hasOwnProperty.call(r,e)&&(t[e]=r[e])}return t},c.apply(null,arguments)}function f(t,n){return f=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t},f(t,n)}var d=function(t){return Buffer.from(t).toString("hex")},h=/*#__PURE__*/function(r){function e(){return r.apply(this,arguments)||this}var o,i;return i=r,(o=e).prototype=Object.create(i.prototype),o.prototype.constructor=o,f(o,i),e.prototype.lock=function(r,e,o,i){var s="";if(void 0!==e&&void 0!==o){var a=d("ord"),u=Buffer.from(e,"base64").toString("hex").trim();if(!u)throw new Error("Invalid file data");var c=d(o);if(!c)throw new Error("Invalid media type");s="OP_0 OP_IF "+a+" OP_1 "+c+" OP_0 "+u+" OP_ENDIF"}var f=(s?s+" ":"")+(new t).lock(r).toASM();if(i&&(!i.app||!i.type))throw new Error("MAP.app and MAP.type are required fields");if(null!=i&&i.app&&null!=i&&i.type){f=f+" OP_RETURN "+d("1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5")+" "+d("SET");for(var h=0,l=Object.entries(i);h<l.length;h++){var v=l[h],p=v[0],m=v[1];"cmd"!==p&&(f=f+" "+d(p)+" "+d(m))}}return n.fromASM(f)},e}(t),l=r.fromBase58Check,v=function(t,n){var r=e(c({},t,{script:Buffer.from(t.script,"base64").toString("hex")}),n);return r.sourceTXID=t.txid,r},p=function(n){try{var r="https://ordinals.gorillapool.io/api/txos/address/"+n+"/unspent?bsv20=false";return console.log({payUrl:r}),Promise.resolve(fetch(r)).then(function(r){if(!r.ok)throw new Error("Error fetching pay utxos");return Promise.resolve(r.json()).then(function(r){r=r.filter(function(t){return 1!==t.satoshis});var e=l(n),o=(new t).lock(e.data);return r.map(function(t){return{txid:t.txid,vout:t.vout,satoshis:t.satoshis,script:Buffer.from(o.toBinary()).toString("base64")}})})})}catch(t){return Promise.reject(t)}},m=function(t,n){try{var r,e=function(t){if(r)return t;throw new Error("Signer must be a LocalSigner or RemoteSigner")},o=null==n?void 0:n.idKey,i=null==n?void 0:n.keyHost;if(o){var a=new s(t).sign(o);return Promise.resolve(a.signedTx)}var u=function(){if(i){var e=null==n?void 0:n.authToken,o=new s(t);return function(t,n){try{var s=Promise.resolve(o.remoteSign(i,e)).then(function(t){return r=1,t.signedTx})}catch(t){return n(t)}return s&&s.then?s.then(void 0,n):s}(0,function(t){throw console.log(t),new Error("Remote signing to "+i+" failed")})}}();return Promise.resolve(u&&u.then?u.then(e):e(u))}catch(t){return Promise.reject(t)}},g=function(n){try{for(var r,e=n.utxos,s=n.destinations,a=n.paymentPk,c=n.changeAddress,f=n.satsPerKb,d=n.metaData,l=n.signer,p=n.additionalPayments,g=void 0===p?[]:p,y=new o(void 0===f?10:f),w=new i,b=u(e);!(r=b()).done;){var P=v(r.value,(new t).unlock(a));w.addInput(P)}s.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(var S,x=u(s);!(S=x()).done;){var k=S.value;if(!k.inscription)throw new Error("Inscription is required for all destinations");w.addOutput({satoshis:1,lockingScript:(new h).lock(k.address,k.inscription.dataB64,k.inscription.contentType,d)})}for(var O,B=u(g);!(O=B()).done;){var I=O.value;w.addOutput({satoshis:I.amount,lockingScript:(new t).lock(I.to)})}var A=e.reduce(function(t,n){return t+BigInt(n.satoshis)},0n),E=w.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n);return Promise.resolve(y.computeFee(w)).then(function(n){function r(){return Promise.resolve(w.fee(y)).then(function(){return Promise.resolve(w.sign()).then(function(){return o&&(o.satoshis=w.outputs[w.outputs.length-1].satoshis,o.txid=w.hash("hex")),{tx:w,spentOutpoints:e.map(function(t){return t.txid+"_"+t.vout}),payChange:o}})})}var o;if(A>E+BigInt(n)){var i=(new t).lock(c||a.toAddress().toString()),s={lockingScript:i,change:!0};o={txid:"",vout:w.outputs.length,satoshis:0,script:Buffer.from(i.toHex(),"hex").toString("base64")},w.addOutput(s)}var u=function(){if(l)return Promise.resolve(m(w,l)).then(function(t){w=t})}();return u&&u.then?u.then(r):r()})}catch(t){return Promise.reject(t)}};const y="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function w(t,n,r){if(!t.s){if(r instanceof b){if(!r.s)return void(r.o=w.bind(null,t,n));1&n&&(n=r.s),r=r.v}if(r&&r.then)return void r.then(w.bind(null,t,n),w.bind(null,t,2));t.s=n,t.v=r;var e=t.o;e&&e(t)}}var b=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,r){var e=new t,o=this.s;if(o){var i=1&o?n:r;if(i){try{w(e,1,i(this.v))}catch(t){w(e,2,t)}return e}return this}return this.o=function(t){try{var o=t.v;1&t.s?w(e,1,n?n(o):o):r?w(e,1,r(o)):w(e,2,o)}catch(t){w(e,2,t)}},e},t}();function P(t){return t instanceof b&&1&t.s}var S=function(n){try{var r,e=function(){function r(){return Promise.resolve(c.fee(a)).then(function(){return Promise.resolve(c.sign()).then(function(){return e&&(e.satoshis=c.outputs[c.outputs.length-1].satoshis,e.txid=c.hash("hex")),{tx:c,spentOutpoints:f,payChange:e}})})}if(j<T)throw new Error("Not enough ordinals to send");var e;if(j>T+BigInt(_)){var o=(new t).lock(n.changeAddress||n.paymentPk.toAddress().toString()),i={lockingScript:o,change:!0};e={txid:"",vout:c.outputs.length,satoshis:0,script:Buffer.from(o.toHex(),"hex").toString("base64")},c.addOutput(i)}var s=function(){if(n.signer)return Promise.resolve(m(c,n.signer)).then(function(t){c=t})}();return s&&s.then?s.then(r):r()};n.satsPerKb||(n.satsPerKb=10),n.additionalPayments||(n.additionalPayments=[]),void 0===n.enforceUniformSend&&(n.enforceUniformSend=!0);for(var s,a=new o(n.satsPerKb),c=new i,f=[],d=u(n.ordinals);!(s=d()).done;){var l=s.value;if(1!==l.satoshis)throw new Error("1Sat Ordinal utxos must have exactly 1 satoshi");var p=v(l,(new h).unlock(n.ordPk));f.push(l.txid+"_"+l.vout),c.addInput(p)}if(n.enforceUniformSend&&n.destinations.length!==n.ordinals.length)throw new Error("Number of destinations must match number of ordinals being sent");for(var g,S=u(n.destinations);!(g=S()).done;){var x,k,O,B=g.value;O=null!=(x=B.inscription)&&x.dataB64&&null!=(k=B.inscription)&&k.contentType?(new h).lock(B.address,B.inscription.dataB64,B.inscription.contentType,n.metaData):(new t).lock(B.address),c.addOutput({satoshis:1,lockingScript:O})}for(var I,A=u(n.additionalPayments);!(I=A()).done;){var E=I.value;c.addOutput({satoshis:E.amount,lockingScript:(new t).lock(E.to)})}var j=0n,T=c.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n),_=0,C=function(t,n,r){if("function"==typeof t[y]){var e,o,i,s=t[y]();if(function t(a){try{for(;!((e=s.next()).done||r&&r());)if((a=n(e.value))&&a.then){if(!P(a))return void a.then(t,i||(i=w.bind(null,o=new b,2)));a=a.v}o?w(o,1,a):o=a}catch(t){w(o||(o=new b),2,t)}}(),s.return){var a=function(t){try{e.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(a,function(t){throw a(t)});a()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<t.length;c++)u.push(t[c]);return function(t,n,r){var e,o,i=-1;return function s(a){try{for(;++i<t.length&&(!r||!r());)if((a=n(i))&&a.then){if(!P(a))return void a.then(s,o||(o=w.bind(null,e=new b,2)));a=a.v}e?w(e,1,a):e=a}catch(t){w(e||(e=new b),2,t)}}(),e}(u,function(t){return n(u[t])},r)}(n.paymentUtxos,function(e){var o=v(e,(new t).unlock(n.paymentPk));return f.push(e.txid+"_"+e.vout),c.addInput(o),j+=BigInt(e.satoshis),Promise.resolve(a.computeFee(c)).then(function(t){_=t,j>=T+BigInt(_)&&(r=1)})},function(){return r});return Promise.resolve(C&&C.then?C.then(e):e())}catch(t){return Promise.reject(t)}};const x="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function k(t,n,r){if(!t.s){if(r instanceof O){if(!r.s)return void(r.o=k.bind(null,t,n));1&n&&(n=r.s),r=r.v}if(r&&r.then)return void r.then(k.bind(null,t,n),k.bind(null,t,2));t.s=n,t.v=r;var e=t.o;e&&e(t)}}var O=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,r){var e=new t,o=this.s;if(o){var i=1&o?n:r;if(i){try{k(e,1,i(this.v))}catch(t){k(e,2,t)}return e}return this}return this.o=function(t){try{var o=t.v;1&t.s?k(e,1,n?n(o):o):r?k(e,1,r(o)):k(e,2,o)}catch(t){k(e,2,t)}},e},t}();function B(t){return t instanceof O&&1&t.s}var I,A=function(n){try{for(var r,e,s=function(){if(P<S+I)throw new Error("Not enough funds to send. Total sats in: "+P+", Total sats out: "+S+", Fee: "+I);var n;if(P>S+I){var r=(new t).lock(p),e={lockingScript:r,change:!0};n={txid:"",vout:g.outputs.length,satoshis:0,script:Buffer.from(r.toHex(),"hex").toString("base64")},g.addOutput(e)}else P<S+I&&console.log("No change needed");return Promise.resolve(g.fee(m)).then(function(){return Promise.resolve(g.sign()).then(function(){return n&&(n.satoshis=g.outputs[g.outputs.length-1].satoshis,n.txid=g.hash("hex")),{tx:g,spentOutpoints:a.map(function(t){return t.txid+"_"+t.vout}),payChange:n}})})},a=n.utxos,c=n.paymentPk,f=n.payments,d=n.satsPerKb,h=void 0===d?10:d,l=n.changeAddress,p=void 0===l?c.toAddress().toString():l,m=new o(h),g=new i,y=u(f);!(e=y()).done;){var w=e.value,b={satoshis:w.amount,lockingScript:(new t).lock(w.to)};g.addOutput(b)}var P=0n,S=g.outputs.reduce(function(t,n){return t+(n.satoshis||0)},0),I=0,A=function(t,n,r){if("function"==typeof t[x]){var e,o,i,s=t[x]();if(function t(a){try{for(;!((e=s.next()).done||r&&r());)if((a=n(e.value))&&a.then){if(!B(a))return void a.then(t,i||(i=k.bind(null,o=new O,2)));a=a.v}o?k(o,1,a):o=a}catch(t){k(o||(o=new O),2,t)}}(),s.return){var a=function(t){try{e.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(a,function(t){throw a(t)});a()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<t.length;c++)u.push(t[c]);return function(t,n,r){var e,o,i=-1;return function s(a){try{for(;++i<t.length&&(!r||!r());)if((a=n(i))&&a.then){if(!B(a))return void a.then(s,o||(o=k.bind(null,e=new O,2)));a=a.v}e?k(e,1,a):e=a}catch(t){k(e||(e=new O),2,t)}}(),e}(u,function(t){return n(u[t])},r)}(a,function(n){var e=v(n,(new t).unlock(c));return g.addInput(e),P+=BigInt(n.satoshis),Promise.resolve(m.computeFee(g)).then(function(t){P>=S+(I=t)&&(r=1)})},function(){return r});return Promise.resolve(A&&A.then?A.then(s):s())}catch(t){return Promise.reject(t)}};!function(t){t.BSV20="bsv20",t.BSV21="bsv21"}(I||(I={}));var E=function(t){try{var n=t.protocol,r=t.tokenID,e=t.utxos,o=t.inputTokens,i=t.distributions,s=t.paymentPk,a=t.ordPk,f=t.changeAddress,d=t.tokenChangeAddress,h=t.satsPerKb,l=void 0===h?10:h,v=t.metaData,p=t.signer,m=t.additionalPayments,g=void 0===m?[]:m,y=0n,w=0n,b=0n;if(!o.every(function(t){return t.id===r}))throw new Error("Input tokens do not match the provided tokenID");for(var P,x=u(o);!(P=x()).done;)w+=BigInt(P.value.amt);for(var k,O=u(i);!(k=O()).done;)b+=BigInt(k.value.amt);if(w<b)throw new Error("Not enough tokens to send");if((y=w-b)>0n){var B={address:d||a.toAddress().toString(),amt:y.toString()};i.push(B)}var A=i.map(function(t){var e,o={p:"bsv-20",op:"transfer",amt:t.amt};if(n===I.BSV20)e=c({},o,{tick:r});else{if(n!==I.BSV21)throw new Error("Invalid protocol");e=c({},o,{id:r})}return{address:t.address,inscription:{dataB64:Buffer.from(JSON.stringify(e)).toString("base64"),contentType:"application/bsv-20"}}}),E={paymentUtxos:e,ordinals:o,paymentPk:s,ordPk:a,destinations:A,changeAddress:f||s.toAddress().toString(),satsPerKb:l,metaData:v,signer:p,additionalPayments:g,enforceUniformSend:!1};return Promise.resolve(S(E)).then(function(t){var n,e=t.tx,o=t.spentOutpoints,i=t.payChange,s=A.findIndex(function(t){return t.address===(d||a.toAddress().toString())});return-1!==s&&(n={id:r,amt:y.toString(),satoshis:1,txid:e.id("hex"),vout:s,script:Buffer.from(e.outputs[s].lockingScript.toHex(),"hex").toString("base64")}),{tx:e,spentOutpoints:o,payChange:i,tokenChange:n}})}catch(t){return Promise.reject(t)}};export{I as TokenType,g as createOrdinals,p as fetchPayUtxos,S as sendOrdinals,A as sendUtxos,E as transferOrdTokens};
//# sourceMappingURL=index.module.js.map
