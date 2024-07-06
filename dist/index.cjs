var t=require("@bsv/sdk"),n=require("sigma-protocol");function e(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=Array(n);e<n;e++)r[e]=t[e];return r}function r(t,n){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(r)return(r=r.call(t)).next.bind(r);if(Array.isArray(t)||(r=function(t,n){if(t){if("string"==typeof t)return e(t,n);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?e(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){r&&(t=r);var o=0;return function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function o(){return o=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var r in e)({}).hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t},o.apply(null,arguments)}function i(t,n){return i=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t},i(t,n)}var s=function(t){return Buffer.from(t).toString("hex")},a=/*#__PURE__*/function(n){function e(){return n.apply(this,arguments)||this}var r,o;return o=n,(r=e).prototype=Object.create(o.prototype),r.prototype.constructor=r,i(r,o),e.prototype.lock=function(n,e,r,o){var i="";if(void 0!==e&&void 0!==r){var a=s("ord"),u=Buffer.from(e,"base64").toString("hex").trim();if(!u)throw new Error("Invalid file data");var c=s(r);if(!c)throw new Error("Invalid media type");i="OP_0 OP_IF "+a+" OP_1 "+c+" OP_0 "+u+" OP_ENDIF"}var d=(i?i+" ":"")+(new t.P2PKH).lock(n).toASM();if(o&&(!o.app||!o.type))throw new Error("MAP.app and MAP.type are required fields");if(null!=o&&o.app&&null!=o&&o.type){d=d+" OP_RETURN "+s("1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5")+" "+s("SET");for(var f=0,l=Object.entries(o);f<l.length;f++){var p=l[f],h=p[0],v=p[1];"cmd"!==h&&(d=d+" "+s(h)+" "+s(v))}}return t.LockingScript.fromASM(d)},e}(t.P2PKH),u=t.Utils.fromBase58Check,c=function(n,e){var r=t.fromUtxo(o({},n,{script:Buffer.from(n.script,"base64").toString("hex")}),e);return r.sourceTXID=n.txid,r},d=function(t,e){try{var r,o=function(t){if(r)return t;throw new Error("Signer must be a LocalSigner or RemoteSigner")},i=null==e?void 0:e.idKey,s=null==e?void 0:e.keyHost;if(i){var a=new n.Sigma(t).sign(i);return Promise.resolve(a.signedTx)}var u=function(){if(s){var o=null==e?void 0:e.authToken,i=new n.Sigma(t);return function(t,n){try{var e=Promise.resolve(i.remoteSign(s,o)).then(function(t){return r=1,t.signedTx})}catch(t){return n(t)}return e&&e.then?e.then(void 0,n):e}(0,function(t){throw console.log(t),new Error("Remote signing to "+s+" failed")})}}();return Promise.resolve(u&&u.then?u.then(o):o(u))}catch(t){return Promise.reject(t)}},f=function(n){try{n.satsPerKb||(n.satsPerKb=10),n.additionalPayments||(n.additionalPayments=[]),void 0===n.enforceUniformSend&&(n.enforceUniformSend=!0);for(var e,o,i=new t.SatoshisPerKilobyte(n.satsPerKb),s=new t.Transaction,u=[],f=r(n.ordinals);!(o=f()).done;){var l=o.value;if(1!==l.satoshis)throw new Error("1Sat Ordinal utxos must have exactly 1 satoshi");var p=c(l,(new a).unlock(n.ordPk));u.push(l.txid+"_"+l.vout),s.addInput(p)}if(n.enforceUniformSend&&n.destinations.length!==n.ordinals.length)throw new Error("Number of destinations must match number of ordinals being sent");for(var h,v=r(n.destinations);!(h=v()).done;){var m,g,y,P=h.value;y=null!=(m=P.inscription)&&m.dataB64&&null!=(g=P.inscription)&&g.contentType?(new a).lock(P.address,P.inscription.dataB64,P.inscription.contentType,n.metaData):(new t.P2PKH).lock(P.address),s.addOutput({satoshis:1,lockingScript:y})}for(var w,b=r(n.additionalPayments);!(w=b()).done;){var k=w.value;console.log("Additional payment",k),s.addOutput({satoshis:k.amount,lockingScript:(new t.P2PKH).lock(k.to)})}for(var S,x=r(n.paymentUtxos);!(S=x()).done;){var O=S.value,T=c(O,(new t.P2PKH).unlock(n.paymentPk));u.push(O.txid+"_"+O.vout),s.addInput(T)}return Promise.resolve(i.computeFee(s)).then(function(r){function o(){return Promise.resolve(s.fee(i)).then(function(){return Promise.resolve(s.sign()).then(function(){return{tx:s,spentOutpoints:u,payChangeVout:e}})})}var a=n.paymentUtxos.reduce(function(t,n){return t+BigInt(n.satoshis)},0n),c=s.outputs.reduce(function(t,n){return t+(n.satoshis||0)},0);if(a<c)throw new Error("Not enough ordinals to send");if(a>c+r){var f=(new t.P2PKH).lock(n.changeAddress||n.paymentPk.toAddress().toString());e=s.outputs.length,s.addOutput({lockingScript:f,change:!0})}var l=function(){if(n.signer)return Promise.resolve(d(s,n.signer)).then(function(t){s=t})}();return l&&l.then?l.then(o):o()})}catch(t){return Promise.reject(t)}};const l="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function p(t,n,e){if(!t.s){if(e instanceof v){if(!e.s)return void(e.o=p.bind(null,t,n));1&n&&(n=e.s),e=e.v}if(e&&e.then)return void e.then(p.bind(null,t,n),p.bind(null,t,2));t.s=n,t.v=e;var r=t.o;r&&r(t)}}var h,v=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,e){var r=new t,o=this.s;if(o){var i=1&o?n:e;if(i){try{p(r,1,i(this.v))}catch(t){p(r,2,t)}return r}return this}return this.o=function(t){try{var o=t.v;1&t.s?p(r,1,n?n(o):o):e?p(r,1,e(o)):p(r,2,o)}catch(t){p(r,2,t)}},r},t}();function m(t){return t instanceof v&&1&t.s}exports.TokenType=void 0,(h=exports.TokenType||(exports.TokenType={})).BSV20="bsv20",h.BSV21="bsv21",exports.createOrdinals=function(n){try{for(var e,o,i=n.utxos,s=n.destinations,u=n.paymentPk,f=n.changeAddress,l=n.satsPerKb,p=n.metaData,h=n.signer,v=n.additionalPayments,m=void 0===v?[]:v,g=new t.SatoshisPerKilobyte(void 0===l?10:l),y=new t.Transaction,P=r(i);!(e=P()).done;){var w=c(e.value,(new t.P2PKH).unlock(u));y.addInput(w)}s.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(var b,k=r(s);!(b=k()).done;){var S=b.value;if(!S.inscription)throw new Error("Inscription is required for all destinations");y.addOutput({satoshis:1,lockingScript:(new a).lock(S.address,S.inscription.dataB64,S.inscription.contentType,p)})}for(var x,O=r(m);!(x=O()).done;){var T=x.value;y.addOutput({satoshis:T.amount,lockingScript:(new t.P2PKH).lock(T.to)})}var K=i.reduce(function(t,n){return t+BigInt(n.satoshis)},0n),I=y.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n);return Promise.resolve(g.computeFee(y)).then(function(n){function e(){return Promise.resolve(y.fee(g)).then(function(){return Promise.resolve(y.sign()).then(function(){return{tx:y,spentOutpoints:i.map(function(t){return t.txid+"_"+t.vout}),payChangeVout:o}})})}K>I+BigInt(n)&&(y.addOutput({lockingScript:(new t.P2PKH).lock(f||u.toAddress().toString()),change:!0}),o=y.outputs.length-1);var r=function(){if(h)return Promise.resolve(d(y,h)).then(function(t){y=t})}();return r&&r.then?r.then(e):e()})}catch(t){return Promise.reject(t)}},exports.fetchPayUtxos=function(n){try{var e="https://ordinals.gorillapool.io/api/txos/address/"+n+"/unspent?bsv20=false";return console.log({payUrl:e}),Promise.resolve(fetch(e)).then(function(e){if(!e.ok)throw new Error("Error fetching pay utxos");return Promise.resolve(e.json()).then(function(e){e=e.filter(function(t){return 1!==t.satoshis});var r=u(n),o=(new t.P2PKH).lock(r.data);return e.map(function(t){return{txid:t.txid,vout:t.vout,satoshis:t.satoshis,script:Buffer.from(o.toBinary()).toString("base64")}})})})}catch(t){return Promise.reject(t)}},exports.sendOrdinals=f,exports.sendUtxos=function(n){try{for(var e,o,i=function(){if(S<x+O)throw new Error("Not enough funds to send. Total sats in: "+S+", Total sats out: "+x+", Fee: "+O);var n;if(S>x+O){var e=(new t.P2PKH).lock(g);n=P.outputs.length,P.addOutput({lockingScript:e,change:!0})}else S<x+O&&console.log("No change needed");return Promise.resolve(P.fee(y)).then(function(){return Promise.resolve(P.sign()).then(function(){return{tx:P,spentOutpoints:s.map(function(t){return t.txid+"_"+t.vout}),payChangeVout:n}})})},s=n.utxos,a=n.paymentPk,u=n.payments,d=n.satsPerKb,f=void 0===d?10:d,h=n.changeAddress,g=void 0===h?a.toAddress().toString():h,y=new t.SatoshisPerKilobyte(f),P=new t.Transaction,w=r(u);!(o=w()).done;){var b=o.value,k={satoshis:b.amount,lockingScript:(new t.P2PKH).lock(b.to)};P.addOutput(k)}var S=0n,x=P.outputs.reduce(function(t,n){return t+(n.satoshis||0)},0),O=0,T=function(t,n,e){if("function"==typeof t[l]){var r,o,i,s=t[l]();if(function t(a){try{for(;!((r=s.next()).done||e&&e());)if((a=n(r.value))&&a.then){if(!m(a))return void a.then(t,i||(i=p.bind(null,o=new v,2)));a=a.v}o?p(o,1,a):o=a}catch(t){p(o||(o=new v),2,t)}}(),s.return){var a=function(t){try{r.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(a,function(t){throw a(t)});a()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<t.length;c++)u.push(t[c]);return function(t,n,e){var r,o,i=-1;return function s(a){try{for(;++i<t.length&&(!e||!e());)if((a=n(i))&&a.then){if(!m(a))return void a.then(s,o||(o=p.bind(null,r=new v,2)));a=a.v}r?p(r,1,a):r=a}catch(t){p(r||(r=new v),2,t)}}(),r}(u,function(t){return n(u[t])},e)}(s,function(n){var r=c(n,(new t.P2PKH).unlock(a));return P.addInput(r),S+=BigInt(n.satoshis),Promise.resolve(y.computeFee(P)).then(function(t){S>=x+(O=t)&&(e=1)})},function(){return e});return Promise.resolve(T&&T.then?T.then(i):i())}catch(t){return Promise.reject(t)}},exports.transferOrdTokens=function(t){try{var n=t.protocol,e=t.tokenID,i=t.utxos,s=t.inputTokens,a=t.distributions,u=t.paymentPk,c=t.ordPk,d=t.changeAddress,l=t.tokenChangeAddress,p=t.satsPerKb,h=void 0===p?10:p,v=t.metaData,m=t.signer,g=t.additionalPayments,y=void 0===g?[]:g,P=0n,w=0n,b=0n;if(!s.every(function(t){return t.id===e}))throw new Error("Input tokens do not match the provided tokenID");for(var k,S=r(s);!(k=S()).done;)w+=BigInt(k.value.amt);for(var x,O=r(a);!(x=O()).done;)b+=BigInt(x.value.amt);if(w<b)throw new Error("Not enough tokens to send");if((P=w-b)>0n){var T={address:l||c.toAddress().toString(),amt:P.toString()};a.push(T)}var K=a.map(function(t){var r,i={p:"bsv-20",op:"transfer",amt:t.amt};if(n===exports.TokenType.BSV20)r=o({},i,{tick:e});else{if(n!==exports.TokenType.BSV21)throw new Error("Invalid protocol");r=o({},i,{id:e})}return{address:t.address,inscription:{dataB64:Buffer.from(JSON.stringify(r)).toString("base64"),contentType:"application/bsv-20"}}}),I={paymentUtxos:i,ordinals:s,paymentPk:u,ordPk:c,destinations:K,changeAddress:d||u.toAddress().toString(),satsPerKb:h,metaData:v,signer:m,additionalPayments:y,enforceUniformSend:!1};return Promise.resolve(f(I)).then(function(t){return{tx:t.tx,spentOutpoints:t.spentOutpoints,payChangeVout:t.payChangeVout,tokenChangeVout:K.findIndex(function(t){return t.address===(l||c.toAddress().toString())})}})}catch(t){return Promise.reject(t)}};
//# sourceMappingURL=index.cjs.map
