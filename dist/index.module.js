import{P2PKH as t,LockingScript as n,Script as e,Utils as r,fromUtxo as o,SatoshisPerKilobyte as i,Transaction as s,OP as u,BigNumber as a,UnlockingScript as c,TransactionSignature as f}from"@bsv/sdk";import{Sigma as d}from"sigma-protocol";function l(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=Array(n);e<n;e++)r[e]=t[e];return r}function h(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(e)return(e=e.call(t)).next.bind(e);if(Array.isArray(t)||(e=function(t,n){if(t){if("string"==typeof t)return l(t,n);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?l(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0;return function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function v(){return v=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var r in e)({}).hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t},v.apply(null,arguments)}function p(t,n){return p=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t},p(t,n)}var m,g,y=function(t){return Buffer.from(t).toString("hex")},b=10,w="https://ordinals.gorillapool.io/api",S=/*#__PURE__*/function(e){function r(){return e.apply(this,arguments)||this}var o,i;return i=e,(o=r).prototype=Object.create(i.prototype),o.prototype.constructor=o,p(o,i),r.prototype.lock=function(e,r,o,i){var s="";if(void 0!==r&&void 0!==o){var u=y("ord"),a=Buffer.from(r,"base64").toString("hex").trim();if(!a)throw new Error("Invalid file data");var c=y(o);if(!c)throw new Error("Invalid media type");s="OP_0 OP_IF "+u+" OP_1 "+c+" OP_0 "+a+" OP_ENDIF"}var f=(s?s+" ":"")+(new t).lock(e).toASM();if(i&&(!i.app||!i.type))throw new Error("MAP.app and MAP.type are required fields");if(null!=i&&i.app&&null!=i&&i.type){f=f+" OP_RETURN "+y("1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5")+" "+y("SET");for(var d=0,l=Object.entries(i);d<l.length;d++){var h=l[d],v=h[0],p=h[1];"cmd"!==v&&(f=f+" "+y(v)+" "+y(p))}}return n.fromASM(f)},r}(t);!function(t){t.BSV20="bsv20",t.BSV21="bsv21"}(m||(m={})),function(t){t.Paymail="paymail",t.Address="address",t.Script="script"}(g||(g={}));var x=r.fromBase58Check,P=function(t,n){return o(v({},t,{script:Buffer.from(t.script,"base64").toString("hex")}),n)},k=function(n,e){void 0===e&&(e="base64");try{var r=w+"/txos/address/"+n+"/unspent?bsv20=false";return console.log({payUrl:r}),Promise.resolve(fetch(r)).then(function(r){if(!r.ok)throw new Error("Error fetching pay utxos");return Promise.resolve(r.json()).then(function(r){r=r.filter(function(t){return 1!==t.satoshis});var o=x(n),i=(new t).lock(o.data);return r.map(function(t){return{txid:t.txid,vout:t.vout,satoshis:t.satoshis,script:"hex"===e||"base64"===e?Buffer.from(i.toBinary()).toString(e):i.toASM()}})})})}catch(t){return Promise.reject(t)}},I=function(t,n,r,o,i){void 0===r&&(r=10),void 0===o&&(o=0),void 0===i&&(i="base64");try{var s=w+"/txos/address/"+t+"/unspent?limit="+r+"&offset="+o+"&";return n&&(s+="q="+Buffer.from(JSON.stringify({map:{subTypeData:{collectionId:n}}})).toString("base64")),Promise.resolve(fetch(s)).then(function(r){if(!r.ok)throw new Error("Error fetching NFT utxos for "+t);return Promise.resolve(r.json()).then(function(r){var o=(r=r.filter(function(t){var n;return 1===t.satoshis&&!(null!=(n=t.data)&&n.list)})).map(function(t){return t.txid+"_"+t.vout});return Promise.resolve(fetch(w+"/txos/outpoints?script=true",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify([].concat(o))})).then(function(o){if(!o.ok)throw new Error("Error fetching NFT scripts for "+t);return Promise.resolve(o.json()).then(function(t){return r=t.map(function(t){var r=t.script;"hex"===i?r=Buffer.from(r,"base64").toString("hex"):"asm"===i&&(r=e.fromHex(Buffer.from(r,"base64").toString("hex")).toASM());var o={origin:t.origin.outpoint,script:r,vout:t.vout,txid:t.txid,satoshis:1};return n&&(o.collectionId=n),o})})})})})}catch(t){return Promise.reject(t)}},O=function(t,n,e){try{return Promise.resolve(fetch(w+"/bsv20/"+e+"/"+(t===m.BSV20?"tick":"id")+"/"+n+"?bsv20=true&listing=false")).then(function(e){if(!e.ok)throw new Error("Error fetching "+t+" utxos");return Promise.resolve(e.json()).then(function(t){return t.map(function(t){return{amt:t.amt,script:t.script,vout:t.vout,txid:t.txid,id:n,satoshis:1}})})})}catch(t){return Promise.reject(t)}},B=function(t,n){try{var e,r=function(t){if(e)return t;throw new Error("Signer must be a LocalSigner or RemoteSigner")},o=null==n?void 0:n.idKey,i=null==n?void 0:n.keyHost;if(o){var s=new d(t).sign(o);return Promise.resolve(s.signedTx)}var u=function(){if(i){var r=null==n?void 0:n.authToken,o=new d(t);return function(t,n){try{var s=Promise.resolve(o.remoteSign(i,r)).then(function(t){return e=1,t.signedTx})}catch(t){return n(t)}return s&&s.then?s.then(void 0,n):s}(0,function(t){throw console.log(t),new Error("Remote signing to "+i+" failed")})}}();return Promise.resolve(u&&u.then?u.then(r):r(u))}catch(t){return Promise.reject(t)}},A=function(t){if(t){for(var n={app:t.app,type:t.type},e=0,r=Object.entries(t);e<r.length;e++){var o=r[e],i=o[1];void 0!==i&&(n[o[0]]="string"==typeof i?i:Array.isArray(i)||"object"==typeof i?JSON.stringify(i):String(i))}return n}},E=function(n){try{for(var e,r=n.utxos,o=n.destinations,u=n.paymentPk,a=n.changeAddress,c=n.satsPerKb,f=n.metaData,d=n.signer,l=n.additionalPayments,v=void 0===l?[]:l,p=new i(void 0===c?b:c),m=new s,g=h(r);!(e=g()).done;){var y=P(e.value,(new t).unlock(u));m.addInput(y)}o.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(var w,x=h(o);!(w=x()).done;){var k=w.value;if(!k.inscription)throw new Error("Inscription is required for all destinations");if(f)for(var I=0,O=Object.keys(f);I<O.length;I++){var E=O[I];void 0===f[E]&&delete f[E]}m.addOutput({satoshis:1,lockingScript:(new S).lock(k.address,k.inscription.dataB64,k.inscription.contentType,A(f))})}for(var T,j=h(v);!(T=j()).done;){var C=T.value;m.addOutput({satoshis:C.amount,lockingScript:(new t).lock(C.to)})}var N=r.reduce(function(t,n){return t+BigInt(n.satoshis)},0n),_=m.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n);return Promise.resolve(p.computeFee(m)).then(function(n){function e(){return Promise.resolve(m.fee(p)).then(function(){return Promise.resolve(m.sign()).then(function(){return o&&(o.satoshis=m.outputs[m.outputs.length-1].satoshis,o.txid=m.id("hex")),{tx:m,spentOutpoints:r.map(function(t){return t.txid+"_"+t.vout}),payChange:o}})})}var o;if(N>_+BigInt(n)){var i=(new t).lock(a||u.toAddress().toString()),s={lockingScript:i,change:!0};o={txid:"",vout:m.outputs.length,satoshis:0,script:Buffer.from(i.toHex(),"hex").toString("base64")},m.addOutput(s)}var c=function(){if(d)return Promise.resolve(B(m,d)).then(function(t){m=t})}();return c&&c.then?c.then(e):e()})}catch(t){return Promise.reject(t)}};const T="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function j(t,n,e){if(!t.s){if(e instanceof C){if(!e.s)return void(e.o=j.bind(null,t,n));1&n&&(n=e.s),e=e.v}if(e&&e.then)return void e.then(j.bind(null,t,n),j.bind(null,t,2));t.s=n,t.v=e;var r=t.o;r&&r(t)}}var C=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,e){var r=new t,o=this.s;if(o){var i=1&o?n:e;if(i){try{j(r,1,i(this.v))}catch(t){j(r,2,t)}return r}return this}return this.o=function(t){try{var o=t.v;1&t.s?j(r,1,n?n(o):o):e?j(r,1,e(o)):j(r,2,o)}catch(t){j(r,2,t)}},r},t}();function N(t){return t instanceof C&&1&t.s}var _=function(n){try{var e,r=function(){function e(){return Promise.resolve(a.fee(u)).then(function(){return Promise.resolve(a.sign()).then(function(){return r&&(r.satoshis=a.outputs[a.outputs.length-1].satoshis,r.txid=a.id("hex")),{tx:a,spentOutpoints:c,payChange:r}})})}if(O<E)throw new Error("Not enough ordinals to send");var r;if(O>E+BigInt(_)){var o=(new t).lock(n.changeAddress||n.paymentPk.toAddress().toString()),i={lockingScript:o,change:!0};r={txid:"",vout:a.outputs.length,satoshis:0,script:Buffer.from(o.toHex(),"hex").toString("base64")},a.addOutput(i)}var s=function(){if(n.signer)return Promise.resolve(B(a,n.signer)).then(function(t){a=t})}();return s&&s.then?s.then(e):e()};n.satsPerKb||(n.satsPerKb=b),n.additionalPayments||(n.additionalPayments=[]),void 0===n.enforceUniformSend&&(n.enforceUniformSend=!0);for(var o,u=new i(n.satsPerKb),a=new s,c=[],f=h(n.ordinals);!(o=f()).done;){var d=o.value;if(1!==d.satoshis)throw new Error("1Sat Ordinal utxos must have exactly 1 satoshi");var l=P(d,(new S).unlock(n.ordPk));c.push(d.txid+"_"+d.vout),a.addInput(l)}if(n.enforceUniformSend&&n.destinations.length!==n.ordinals.length)throw new Error("Number of destinations must match number of ordinals being sent");for(var v,p=h(n.destinations);!(v=p()).done;){var m,g,y,w=v.value;y=null!=(m=w.inscription)&&m.dataB64&&null!=(g=w.inscription)&&g.contentType?(new S).lock(w.address,w.inscription.dataB64,w.inscription.contentType,A(n.metaData)):(new t).lock(w.address),a.addOutput({satoshis:1,lockingScript:y})}for(var x,k=h(n.additionalPayments);!(x=k()).done;){var I=x.value;a.addOutput({satoshis:I.amount,lockingScript:(new t).lock(I.to)})}var O=0n,E=a.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n),_=0,U=function(t,n,e){if("function"==typeof t[T]){var r,o,i,s=t[T]();if(function t(u){try{for(;!((r=s.next()).done||e&&e());)if((u=n(r.value))&&u.then){if(!N(u))return void u.then(t,i||(i=j.bind(null,o=new C,2)));u=u.v}o?j(o,1,u):o=u}catch(t){j(o||(o=new C),2,t)}}(),s.return){var u=function(t){try{r.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(u,function(t){throw u(t)});u()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var a=[],c=0;c<t.length;c++)a.push(t[c]);return function(t,n,e){var r,o,i=-1;return function s(u){try{for(;++i<t.length&&(!e||!e());)if((u=n(i))&&u.then){if(!N(u))return void u.then(s,o||(o=j.bind(null,r=new C,2)));u=u.v}r?j(r,1,u):r=u}catch(t){j(r||(r=new C),2,t)}}(),r}(a,function(t){return n(a[t])},e)}(n.paymentUtxos,function(r){var o=P(r,(new t).unlock(n.paymentPk));return c.push(r.txid+"_"+r.vout),a.addInput(o),O+=BigInt(r.satoshis),Promise.resolve(u.computeFee(a)).then(function(t){_=t,O>=E+BigInt(_)&&(e=1)})},function(){return e});return Promise.resolve(U&&U.then?U.then(r):r())}catch(t){return Promise.reject(t)}};const U="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function L(t,n,e){if(!t.s){if(e instanceof D){if(!e.s)return void(e.o=L.bind(null,t,n));1&n&&(n=e.s),e=e.v}if(e&&e.then)return void e.then(L.bind(null,t,n),L.bind(null,t,2));t.s=n,t.v=e;var r=t.o;r&&r(t)}}var D=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,e){var r=new t,o=this.s;if(o){var i=1&o?n:e;if(i){try{L(r,1,i(this.v))}catch(t){L(r,2,t)}return r}return this}return this.o=function(t){try{var o=t.v;1&t.s?L(r,1,n?n(o):o):e?L(r,1,e(o)):L(r,2,o)}catch(t){L(r,2,t)}},r},t}();function H(t){return t instanceof D&&1&t.s}var F=function(n){try{for(var e,r,o=function(){if(S<x+k)throw new Error("Not enough funds to send. Total sats in: "+S+", Total sats out: "+x+", Fee: "+k);var n;if(S>x+k){var e=(new t).lock(v),r={lockingScript:e,change:!0};n={txid:"",vout:m.outputs.length,satoshis:0,script:Buffer.from(e.toHex(),"hex").toString("base64")},m.addOutput(r)}else S<x+k&&console.log("No change needed");return Promise.resolve(m.fee(p)).then(function(){return Promise.resolve(m.sign()).then(function(){return n&&(n.satoshis=m.outputs[m.outputs.length-1].satoshis,n.txid=m.id("hex")),{tx:m,spentOutpoints:u.map(function(t){return t.txid+"_"+t.vout}),payChange:n}})})},u=n.utxos,a=n.paymentPk,c=n.payments,f=n.satsPerKb,d=void 0===f?b:f,l=n.changeAddress,v=void 0===l?a.toAddress().toString():l,p=new i(d),m=new s,g=h(c);!(r=g()).done;){var y=r.value,w={satoshis:y.amount,lockingScript:(new t).lock(y.to)};m.addOutput(w)}var S=0n,x=m.outputs.reduce(function(t,n){return t+(n.satoshis||0)},0),k=0,I=function(t,n,e){if("function"==typeof t[U]){var r,o,i,s=t[U]();if(function t(u){try{for(;!((r=s.next()).done||e&&e());)if((u=n(r.value))&&u.then){if(!H(u))return void u.then(t,i||(i=L.bind(null,o=new D,2)));u=u.v}o?L(o,1,u):o=u}catch(t){L(o||(o=new D),2,t)}}(),s.return){var u=function(t){try{r.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(u,function(t){throw u(t)});u()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var a=[],c=0;c<t.length;c++)a.push(t[c]);return function(t,n,e){var r,o,i=-1;return function s(u){try{for(;++i<t.length&&(!e||!e());)if((u=n(i))&&u.then){if(!H(u))return void u.then(s,o||(o=L.bind(null,r=new D,2)));u=u.v}r?L(r,1,u):r=u}catch(t){L(r||(r=new D),2,t)}}(),r}(a,function(t){return n(a[t])},e)}(u,function(n){var r=P(n,(new t).unlock(a));return m.addInput(r),S+=BigInt(n.satoshis),Promise.resolve(p.computeFee(m)).then(function(t){S>=x+(k=t)&&(e=1)})},function(){return e});return Promise.resolve(I&&I.then?I.then(o):o())}catch(t){return Promise.reject(t)}},K=function(t){try{var n=t.protocol,e=t.tokenID,r=t.utxos,o=t.inputTokens,i=t.distributions,s=t.paymentPk,u=t.ordPk,a=t.changeAddress,c=t.tokenChangeAddress,f=t.satsPerKb,d=void 0===f?b:f,l=t.metaData,p=t.signer,g=t.additionalPayments,y=void 0===g?[]:g,w=t.burn,S=void 0!==w&&w,x=0n,P=0n,k=0n;if(!o.every(function(t){return t.id===e}))throw new Error("Input tokens do not match the provided tokenID");for(var I,O=h(o);!(I=O()).done;)P+=BigInt(I.value.amt);for(var B,A=h(i);!(B=A()).done;)k+=BigInt(B.value.amt);if(P<k)throw new Error("Not enough tokens to send");if((x=P-k)>0n){var E={address:c||u.toAddress().toString(),amt:x.toString()};i.push(E)}var T=i.map(function(t){var r,o={p:"bsv-20",op:S?"burn":"transfer",amt:t.amt};if(n===m.BSV20)r=v({},o,{tick:e});else{if(n!==m.BSV21)throw new Error("Invalid protocol");r=v({},o,{id:e})}return{address:t.address,inscription:{dataB64:Buffer.from(JSON.stringify(r)).toString("base64"),contentType:"application/bsv-20"}}}),j={paymentUtxos:r,ordinals:o,paymentPk:s,ordPk:u,destinations:T,changeAddress:a||s.toAddress().toString(),satsPerKb:d,metaData:l,signer:p,additionalPayments:y,enforceUniformSend:!1};return Promise.resolve(_(j)).then(function(t){var n,r=t.tx,o=t.spentOutpoints,i=t.payChange,s=T.findIndex(function(t){return t.address===(c||u.toAddress().toString())});return-1!==s&&(n={id:e,amt:x.toString(),satoshis:1,txid:r.id("hex"),vout:s,script:Buffer.from(r.outputs[s].lockingScript.toHex(),"hex").toString("base64")}),{tx:r,spentOutpoints:o,payChange:i,tokenChange:n}})}catch(t){return Promise.reject(t)}},q=function(t,n){try{if("collection"===t){var e=n;if(!e.description)return new Error("Collection description is required");if(!e.quantity)return new Error("Collection quantity is required");if(e.rarityLabels){if(!Array.isArray(e.rarityLabels))return new Error("Rarity labels must be an array");if(!e.rarityLabels.every(function(t){return Object.values(t).every(function(t){return"string"==typeof t})}))return new Error("Invalid rarity labels "+e.rarityLabels)}if(e.traits){if("object"!=typeof e.traits)return new Error("Collection traits must be an object");if(e.traits&&!Object.keys(e.traits).every(function(t){return"string"==typeof t&&"object"==typeof e.traits[t]}))return new Error("Collection traits must be a valid CollectionTraits object")}}if("collectionItem"===t){var r=n;if(!r.collectionId)return new Error("Collection id is required");if(!r.collectionId.includes("_"))return new Error("Collection id must be a valid outpoint");if(64!==r.collectionId.split("_")[0].length)return new Error("Collection id must contain a valid txid");if(Number.isNaN(Number.parseInt(r.collectionId.split("_")[1])))return new Error("Collection id must contain a valid vout");if(r.mintNumber&&"number"!=typeof r.mintNumber)return new Error("Mint number must be a number");if(r.rank&&"number"!=typeof r.rank)return new Error("Rank must be a number");if(r.rarityLabel&&"string"!=typeof r.rarityLabel)return new Error("Rarity label must be a string");if(r.traits&&"object"!=typeof r.traits)return new Error("Traits must be an object");if(r.attachments&&!Array.isArray(r.attachments))return new Error("Attachments must be an array")}return}catch(t){return new Error("Invalid JSON data")}},M=/*#__PURE__*/function(){function n(){}var o=n.prototype;return o.lock=function(o,i,s){var u=r.fromBase58Check(o).data,a=r.fromBase58Check(i).data;return e.fromHex("2097dfd76851bf465e8f715593b217714858bbe9570ff3bd5e33840a34e20ff0262102ba79df5f8ae7604a9830f03c7933028186aede0675a16f025dc4f8be8eec0382201008ce7480da41702918d1ec8e6849ba32b4d65b1e40dc669c31a1e6306b266c0000").writeBin(u).writeBin(n.buildOutput(s,(new t).lock(a).toBinary())).writeScript(e.fromHex("615179547a75537a537a537a0079537a75527a527a7575615579008763567901c161517957795779210ac407f0e4bd44bfc207355a778b046225a7068fc59ee7eda43ad905aadbffc800206c266b30e6a1319c66dc401e5bd6b432ba49688eecd118297041da8074ce081059795679615679aa0079610079517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01007e81517a75615779567956795679567961537956795479577995939521414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff00517951796151795179970079009f63007952799367007968517a75517a75517a7561527a75517a517951795296a0630079527994527a75517a6853798277527982775379012080517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01205279947f7754537993527993013051797e527e54797e58797e527e53797e52797e57797e0079517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a756100795779ac517a75517a75517a75517a75517a75517a75517a75517a75517a7561517a75517a756169587951797e58797eaa577961007982775179517958947f7551790128947f77517a75517a75618777777777777777777767557951876351795779a9876957795779ac777777777777777767006868"))},o.cancelListing=function(n,e,r,o,i){void 0===e&&(e="all"),void 0===r&&(r=!1);var s=(new t).unlock(n,e,r,o,i);return{sign:function(t,n){try{return Promise.resolve(s.sign(t,n)).then(function(t){return t.writeOpCode(u.OP_1)})}catch(t){return Promise.reject(t)}},estimateLength:function(){return Promise.resolve(107)}}},o.purchaseListing=function(t,e){var o={sign:function(o,i){try{if(o.outputs.length<2)throw new Error("Malformed transaction");var s=(new c).writeBin(n.buildOutput(o.outputs[0].satoshis||0,o.outputs[0].lockingScript.toBinary()));if(o.outputs.length>2){for(var a,d=new r.Writer,l=h(o.outputs.slice(2));!(a=l()).done;){var v=a.value;d.write(n.buildOutput(v.satoshis||0,v.lockingScript.toBinary()))}s.writeBin(d.toArray())}else s.writeOpCode(u.OP_0);var p=o.inputs[i],m=f.format({sourceTXID:p.sourceTXID||p.sourceTransaction.id("hex"),sourceOutputIndex:p.sourceOutputIndex,sourceSatoshis:t||p.sourceTransaction.outputs[p.sourceOutputIndex].satoshis,transactionVersion:o.version,otherInputs:[],inputIndex:i,outputs:o.outputs,inputSequence:p.sequence,subscript:e||p.sourceTransaction.outputs[p.sourceOutputIndex].lockingScript,lockTime:o.lockTime,scope:f.SIGHASH_ALL|f.SIGHASH_ANYONECANPAY|f.SIGHASH_FORKID});return Promise.resolve(s.writeBin(m).writeOpCode(u.OP_0))}catch(t){return Promise.reject(t)}},estimateLength:function(t,n){try{return Promise.resolve(o.sign(t,n)).then(function(t){return t.toBinary().length})}catch(t){return Promise.reject(t)}}};return o},n.buildOutput=function(t,n){var e=new r.Writer;return e.writeUInt64LEBn(new a(t)),e.writeVarIntNum(n.length),e.write(n),e.toArray()},n}(),R="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function V(t,n,e){if(!t.s){if(e instanceof X){if(!e.s)return void(e.o=V.bind(null,t,n));1&n&&(n=e.s),e=e.v}if(e&&e.then)return void e.then(V.bind(null,t,n),V.bind(null,t,2));t.s=n,t.v=e;var r=t.o;r&&r(t)}}var X=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,e){var r=new t,o=this.s;if(o){var i=1&o?n:e;if(i){try{V(r,1,i(this.v))}catch(t){V(r,2,t)}return r}return this}return this.o=function(t){try{var o=t.v;1&t.s?V(r,1,n?n(o):o):e?V(r,1,e(o)):V(r,2,o)}catch(t){V(r,2,t)}},r},t}();function J(t){return t instanceof X&&1&t.s}var W=r.toArray,G=function(n){try{var r,o,u=function(){if(j<C+BigInt(N))throw new Error("Not enough funds to purchase listing. Total sats in: "+j+", Total sats out: "+C+", Fee: "+N);return Promise.resolve(y.fee(g)).then(function(){return Promise.resolve(y.sign()).then(function(){var t=y.outputs.findIndex(function(t){return t.change});if(-1!==t){var n=y.outputs[t];o={satoshis:n.satoshis,txid:y.id("hex"),vout:t,script:Buffer.from(n.lockingScript.toBinary()).toString("base64")}}return o&&(o.satoshis=y.outputs[y.outputs.length-1].satoshis,o.txid=y.id("hex")),{tx:y,spentOutpoints:y.inputs.map(function(t){return t.sourceTXID+"_"+t.sourceOutputIndex}),payChange:o}})})},a=n.utxos,c=n.listings,f=n.paymentPk,d=n.ordPk,l=n.changeAddress,v=n.satsPerKb,p=n.additionalPayments,m=void 0===p?[]:p,g=new i(void 0===v?b:v),y=new s;c.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(var w,x=h(c);!(w=x()).done;){var k=w.value;y.addOutput({satoshis:1,lockingScript:(new M).lock(k.payAddress,k.ordAddress,k.price)});var I=W(k.listingUtxo.script,"base64"),O=e.fromBinary(I);y.addInput({unlockingScriptTemplate:(new S).unlock(d,"all",!0,k.listingUtxo.satoshis,O),sourceTXID:k.listingUtxo.txid,sourceOutputIndex:k.listingUtxo.vout,sequence:4294967295})}for(var B,A=h(m);!(B=A()).done;){var E=B.value;y.addOutput({satoshis:E.amount,lockingScript:(new t).lock(E.to)})}var T=(new t).lock(l||f.toAddress().toString());y.addOutput({lockingScript:T,change:!0});var j=0n,C=y.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n),N=0,_=function(t,n,e){if("function"==typeof t[R]){var r,o,i,s=t[R]();if(function t(u){try{for(;!((r=s.next()).done||e&&e());)if((u=n(r.value))&&u.then){if(!J(u))return void u.then(t,i||(i=V.bind(null,o=new X,2)));u=u.v}o?V(o,1,u):o=u}catch(t){V(o||(o=new X),2,t)}}(),s.return){var u=function(t){try{r.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(u,function(t){throw u(t)});u()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var a=[],c=0;c<t.length;c++)a.push(t[c]);return function(t,n,e){var r,o,i=-1;return function s(u){try{for(;++i<t.length&&(!e||!e());)if((u=n(i))&&u.then){if(!J(u))return void u.then(s,o||(o=V.bind(null,r=new X,2)));u=u.v}r?V(r,1,u):r=u}catch(t){V(r||(r=new X),2,t)}}(),r}(a,function(t){return n(a[t])},e)}(a,function(n){var e=P(n,(new t).unlock(f));return y.addInput(e),j+=BigInt(n.satoshis),Promise.resolve(g.computeFee(y)).then(function(t){N=t,j>=C+BigInt(N)&&(r=1)})},function(){return r});return Promise.resolve(_&&_.then?_.then(u):u())}catch(t){return Promise.reject(t)}};const Y="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function Q(t,n,e){if(!t.s){if(e instanceof $){if(!e.s)return void(e.o=Q.bind(null,t,n));1&n&&(n=e.s),e=e.v}if(e&&e.then)return void e.then(Q.bind(null,t,n),Q.bind(null,t,2));t.s=n,t.v=e;var r=t.o;r&&r(t)}}var $=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,e){var r=new t,o=this.s;if(o){var i=1&o?n:e;if(i){try{Q(r,1,i(this.v))}catch(t){Q(r,2,t)}return r}return this}return this.o=function(t){try{var o=t.v;1&t.s?Q(r,1,n?n(o):o):e?Q(r,1,e(o)):Q(r,2,o)}catch(t){Q(r,2,t)}},r},t}();function z(t){return t instanceof $&&1&t.s}var Z=function(n){try{for(var r,o,u,a=function(){if(A<E+BigInt(T))throw new Error("Not enough funds to purchase listing. Total sats in: "+A+", Total sats out: "+E+", Fee: "+T);return Promise.resolve(y.fee(g)).then(function(){return Promise.resolve(y.sign()).then(function(){var t=y.outputs.findIndex(function(t){return t.change});if(-1!==t){var n=y.outputs[t];u={satoshis:n.satoshis,txid:y.id("hex"),vout:t,script:Buffer.from(n.lockingScript.toBinary()).toString("base64")}}return u&&(u.satoshis=y.outputs[y.outputs.length-1].satoshis,u.txid=y.id("hex")),{tx:y,spentOutpoints:y.inputs.map(function(t){return t.sourceTXID+"_"+t.sourceOutputIndex}),payChange:u}})})},c=n.utxos,f=n.listingUtxos,d=n.ordPk,l=n.paymentPk,v=n.changeAddress,p=n.additionalPayments,m=n.satsPerKb,g=new i(void 0===m?b:m),y=new s,w=h(f);!(o=w()).done;){var S=o.value;y.addInput({unlockingScript:e.fromHex(Buffer.from(S.script,"base64").toString("hex")),unlockingScriptTemplate:(new M).cancelListing(d),sourceOutputIndex:S.vout,sequence:4294967295}),y.addOutput({satoshis:1,lockingScript:(new t).lock(d.toAddress().toString())})}for(var x,k=h(p);!(x=k()).done;){var I=x.value;y.addOutput({satoshis:I.amount,lockingScript:(new t).lock(I.to)})}f.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");var O=v||l.toAddress().toString(),B=(new t).lock(O);y.addOutput({lockingScript:B,change:!0});var A=0n,E=y.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n),T=0,j=function(t,n,e){if("function"==typeof t[Y]){var r,o,i,s=t[Y]();if(function t(u){try{for(;!((r=s.next()).done||e&&e());)if((u=n(r.value))&&u.then){if(!z(u))return void u.then(t,i||(i=Q.bind(null,o=new $,2)));u=u.v}o?Q(o,1,u):o=u}catch(t){Q(o||(o=new $),2,t)}}(),s.return){var u=function(t){try{r.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(u,function(t){throw u(t)});u()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var a=[],c=0;c<t.length;c++)a.push(t[c]);return function(t,n,e){var r,o,i=-1;return function s(u){try{for(;++i<t.length&&(!e||!e());)if((u=n(i))&&u.then){if(!z(u))return void u.then(s,o||(o=Q.bind(null,r=new $,2)));u=u.v}r?Q(r,1,u):r=u}catch(t){Q(r||(r=new $),2,t)}}(),r}(a,function(t){return n(a[t])},e)}(c,function(n){var e=P(n,(new t).unlock(l));return y.addInput(e),A+=BigInt(n.satoshis),Promise.resolve(g.computeFee(y)).then(function(t){T=t,A>=E+BigInt(T)&&(r=1)})},function(){return r});return Promise.resolve(j&&j.then?j.then(a):a())}catch(t){return Promise.reject(t)}};const tt="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function nt(t,n,e){if(!t.s){if(e instanceof et){if(!e.s)return void(e.o=nt.bind(null,t,n));1&n&&(n=e.s),e=e.v}if(e&&e.then)return void e.then(nt.bind(null,t,n),nt.bind(null,t,2));t.s=n,t.v=e;var r=t.o;r&&r(t)}}var et=/*#__PURE__*/function(){function t(){}return t.prototype.then=function(n,e){var r=new t,o=this.s;if(o){var i=1&o?n:e;if(i){try{nt(r,1,i(this.v))}catch(t){nt(r,2,t)}return r}return this}return this.o=function(t){try{var o=t.v;1&t.s?nt(r,1,n?n(o):o):e?nt(r,1,e(o)):nt(r,2,o)}catch(t){nt(r,2,t)}},r},t}();function rt(t){return t instanceof et&&1&t.s}var ot=function(n){try{var r,o,u=function(){if(O<B+BigInt(A))throw new Error("Not enough funds to purchase listing. Total sats in: "+O+", Total sats out: "+B+", Fee: "+A);return Promise.resolve(y.fee(g)).then(function(){return Promise.resolve(y.sign()).then(function(){var t=y.outputs.findIndex(function(t){return t.change});if(-1!==t){var n=y.outputs[t];o={satoshis:n.satoshis,txid:y.id("hex"),vout:t,script:Buffer.from(n.lockingScript.toBinary()).toString("base64")}}return o&&(o.satoshis=y.outputs[y.outputs.length-1].satoshis,o.txid=y.id("hex")),{tx:y,spentOutpoints:y.inputs.map(function(t){return t.sourceTXID+"_"+t.sourceOutputIndex}),payChange:o}})})},a=n.utxos,c=n.paymentPk,f=n.listingUtxo,d=n.ordAddress,l=n.changeAddress,v=n.additionalPayments,p=void 0===v?[]:v,m=n.satsPerKb,g=new i(void 0===m?b:m),y=new s;y.addInput({unlockingScriptTemplate:(new M).purchaseListing(1,e.fromHex(Buffer.from(f.script,"base64").toString("hex"))),sourceTXID:f.txid,sourceOutputIndex:f.vout,sequence:4294967295}),y.addOutput({satoshis:1,lockingScript:(new t).lock(d)});for(var w,S=h(p);!(w=S()).done;){var x=w.value;y.addOutput({satoshis:x.amount,lockingScript:(new t).lock(x.to)})}var k=l||c.toAddress().toString(),I=(new t).lock(k);y.addOutput({lockingScript:I,change:!0});var O=0n,B=y.outputs.reduce(function(t,n){return t+BigInt(n.satoshis||0)},0n),A=0,E=function(t,n,e){if("function"==typeof t[tt]){var r,o,i,s=t[tt]();if(function t(u){try{for(;!((r=s.next()).done||e&&e());)if((u=n(r.value))&&u.then){if(!rt(u))return void u.then(t,i||(i=nt.bind(null,o=new et,2)));u=u.v}o?nt(o,1,u):o=u}catch(t){nt(o||(o=new et),2,t)}}(),s.return){var u=function(t){try{r.done||s.return()}catch(t){}return t};if(o&&o.then)return o.then(u,function(t){throw u(t)});u()}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var a=[],c=0;c<t.length;c++)a.push(t[c]);return function(t,n,e){var r,o,i=-1;return function s(u){try{for(;++i<t.length&&(!e||!e());)if((u=n(i))&&u.then){if(!rt(u))return void u.then(s,o||(o=nt.bind(null,r=new et,2)));u=u.v}r?nt(r,1,u):r=u}catch(t){nt(r||(r=new et),2,t)}}(),r}(a,function(t){return n(a[t])},e)}(a,function(n){var e=P(n,(new t).unlock(c));return y.addInput(e),O+=BigInt(n.satoshis),Promise.resolve(g.computeFee(y)).then(function(t){A=t,O>=B+BigInt(A)&&(r=1)})},function(){return r});return Promise.resolve(E&&E.then?E.then(u):u())}catch(t){return Promise.reject(t)}};export{M as OrdLock,S as OrdP2PKH,g as RoytaltyType,m as TokenType,Z as cancelOrdListings,G as createOrdListings,E as createOrdinals,I as fetchNftUtxos,k as fetchPayUtxos,O as fetchTokenUtxos,ot as purchaseOrdListings,_ as sendOrdinals,F as sendUtxos,A as stringifyMetaData,K as transferOrdTokens,q as validateSubTypeData};
//# sourceMappingURL=index.module.js.map
