import{P2PKH as t,LockingScript as o,Script as s,Utils as n,fromUtxo as e,SatoshisPerKilobyte as i,Transaction as r,OP as a,BigNumber as c,UnlockingScript as u,TransactionSignature as d}from"@bsv/sdk";import{Sigma as f}from"sigma-protocol";import p from"jimp";const l=t=>Buffer.from(t).toString("hex"),h=10,g="https://ordinals.gorillapool.io/api";class w extends t{lock(s,n,e){let i="";if(void 0!==(null==n?void 0:n.dataB64)&&void 0!==(null==n?void 0:n.contentType)){const t=l("ord"),o=Buffer.from(n.dataB64,"base64").toString("hex").trim();if(!o)throw new Error("Invalid file data");const s=l(n.contentType);if(!s)throw new Error("Invalid media type");i=`OP_0 OP_IF ${t} OP_1 ${s} OP_0 ${o} OP_ENDIF`}let r=`${i?`${i} `:""}${(new t).lock(s).toASM()}`;if(e&&(!e.app||!e.type))throw new Error("MAP.app and MAP.type are required fields");if(null!=e&&e.app&&null!=e&&e.type){r=`${r} OP_RETURN ${l("1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5")} ${l("SET")}`;for(const[t,o]of Object.entries(e))"cmd"!==t&&(r=`${r} ${l(t)} ${l(o)}`)}return o.fromASM(r)}}function m(){return m=Object.assign?Object.assign.bind():function(t){for(var o=1;o<arguments.length;o++){var s=arguments[o];for(var n in s)({}).hasOwnProperty.call(s,n)&&(t[n]=s[n])}return t},m.apply(null,arguments)}var y,b;!function(t){t.BSV20="bsv20",t.BSV21="bsv21"}(y||(y={})),function(t){t.Paymail="paymail",t.Address="address",t.Script="script"}(b||(b={}));const{fromBase58Check:k}=n,S=(t,o)=>e(m({},t,{script:Buffer.from(t.script,"base64").toString("hex")}),o),B=async(o,s="base64")=>{const n=`${g}/txos/address/${o}/unspent?bsv20=false`;console.log({payUrl:n});const e=await fetch(n);if(!e.ok)throw new Error("Error fetching pay utxos");let i=await e.json();i=i.filter(t=>1!==t.satoshis);const r=k(o),a=(new t).lock(r.data);return i=i.map(t=>({txid:t.txid,vout:t.vout,satoshis:t.satoshis,script:"hex"===s||"base64"===s?Buffer.from(a.toBinary()).toString(s):a.toASM()})),i},I=async(t,o,n=10,e=0,i="base64")=>{let r=`${g}/txos/address/${t}/unspent?limit=${n}&offset=${e}&`;o&&(r+=`q=${Buffer.from(JSON.stringify({map:{subTypeData:{collectionId:o}}})).toString("base64")}`);const a=await fetch(r);if(!a.ok)throw new Error(`Error fetching NFT utxos for ${t}`);let c=await a.json();c=c.filter(t=>{var o;return 1===t.satoshis&&!(null!=(o=t.data)&&o.list)});const u=c.map(t=>`${t.txid}_${t.vout}`),d=await fetch(`${g}/txos/outpoints?script=true`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify([...u])});if(!d.ok)throw new Error(`Error fetching NFT scripts for ${t}`);return c=(await d.json()||[]).map(t=>{let n=t.script;"hex"===i?n=Buffer.from(n,"base64").toString("hex"):"asm"===i&&(n=s.fromHex(Buffer.from(n,"base64").toString("hex")).toASM());const e={origin:t.origin.outpoint,script:n,vout:t.vout,txid:t.txid,satoshis:1};return o&&(e.collectionId=o),e}),c},x=async(t,o,s)=>{const n=`${g}/bsv20/${s}/${t===y.BSV20?"tick":"id"}/${o}?bsv20=true&listing=false`,e=await fetch(n);if(!e.ok)throw new Error(`Error fetching ${t} utxos`);let i=await e.json();return i=i.map(t=>({amt:t.amt,script:t.script,vout:t.vout,txid:t.txid,id:o,satoshis:1})),i},v=async(t,o)=>{const s=null==o?void 0:o.idKey,n=null==o?void 0:o.keyHost;if(s){const o=new f(t),{signedTx:n}=o.sign(s);return n}if(n){const s=null==o?void 0:o.authToken,e=new f(t);try{const{signedTx:t}=await e.remoteSign(n,s);return t}catch(t){throw console.log(t),new Error(`Remote signing to ${n} failed`)}}throw new Error("Signer must be a LocalSigner or RemoteSigner")},O=t=>{if(!t)return;const o={app:t.app,type:t.type};for(const[s,n]of Object.entries(t))void 0!==n&&(o[s]="string"==typeof n?n:Array.isArray(n)||"object"==typeof n?JSON.stringify(n):String(n));return o},$=async o=>{const{utxos:e,destinations:a,paymentPk:c,changeAddress:u,satsPerKb:d=h,metaData:f,signer:p,additionalPayments:l=[]}=o;a.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");const g=new i(d);let m,y=new r;for(const t of a){if(!t.inscription)throw new Error("Inscription is required for all destinations");if(f)for(const t of Object.keys(f))void 0===f[t]&&delete f[t];y.addOutput({satoshis:1,lockingScript:(new w).lock(t.address,t.inscription,O(f))})}for(const o of l)y.addOutput({satoshis:o.amount,lockingScript:(new t).lock(o.to)});const b=u||c.toAddress().toString(),k=(new t).lock(b);y.addOutput({lockingScript:k,change:!0});let B=0n;const I=y.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n);if(p){const o=e.pop();y.addInput(S(o,(new t).unlock(c,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))))),B+=BigInt(o.satoshis),y=await v(y,p)}let x=0;for(const o of e){if(B>=I+BigInt(x))break;const e=S(o,(new t).unlock(c,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))));y.addInput(e),B+=BigInt(o.satoshis),x=await g.computeFee(y)}if(B<I+BigInt(x))throw new Error(`Not enough funds to purchase listing. Total sats in: ${B}, Total sats out: ${I}, Fee: ${x}`);await y.fee(g),await y.sign();const $=y.outputs.findIndex(t=>t.change);if(-1!==$){const t=y.outputs[$];m={satoshis:t.satoshis,txid:y.id("hex"),vout:$,script:Buffer.from(t.lockingScript.toBinary()).toString("base64")}}return m&&(m.satoshis=y.outputs[y.outputs.length-1].satoshis,m.txid=y.id("hex")),{tx:y,spentOutpoints:e.map(t=>`${t.txid}_${t.vout}`),payChange:m}},A=async o=>{o.satsPerKb||(o.satsPerKb=h),o.additionalPayments||(o.additionalPayments=[]),void 0===o.enforceUniformSend&&(o.enforceUniformSend=!0);const e=new i(o.satsPerKb);let a=new r;const c=[];for(const t of o.ordinals){if(1!==t.satoshis)throw new Error("1Sat Ordinal utxos must have exactly 1 satoshi");const e=S(t,(new w).unlock(o.ordPk,"all",!0,t.satoshis,s.fromBinary(n.toArray(t.script,"base64"))));c.push(`${t.txid}_${t.vout}`),a.addInput(e)}if(o.enforceUniformSend&&o.destinations.length!==o.ordinals.length)throw new Error("Number of destinations must match number of ordinals being sent");for(const s of o.destinations){var u,d;let n;n=null!=(u=s.inscription)&&u.dataB64&&null!=(d=s.inscription)&&d.contentType?(new w).lock(s.address,s.inscription,O(o.metaData)):(new t).lock(s.address),a.addOutput({satoshis:1,lockingScript:n})}for(const s of o.additionalPayments)a.addOutput({satoshis:s.amount,lockingScript:(new t).lock(s.to)});let f;const p=o.changeAddress||o.paymentPk.toAddress().toString(),l=(new t).lock(p);a.addOutput({lockingScript:l,change:!0});let g=0n;const m=a.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n);let y=0;for(const i of o.paymentUtxos){const r=S(i,(new t).unlock(o.paymentPk,"all",!0,i.satoshis,s.fromBinary(n.toArray(i.script,"base64"))));if(c.push(`${i.txid}_${i.vout}`),a.addInput(r),g+=BigInt(i.satoshis),y=await e.computeFee(a),g>=m+BigInt(y))break}if(g<m)throw new Error("Not enough ordinals to send");o.signer&&(a=await v(a,o.signer)),await a.fee(e),await a.sign();const b=a.outputs.findIndex(t=>t.change);if(-1!==b){const t=a.outputs[b];f={satoshis:t.satoshis,txid:a.id("hex"),vout:b,script:Buffer.from(t.lockingScript.toBinary()).toString("base64")}}return f&&(f.satoshis=a.outputs[a.outputs.length-1].satoshis,f.txid=a.id("hex")),{tx:a,spentOutpoints:c,payChange:f}},E=async o=>{const{utxos:e,paymentPk:a,payments:c,satsPerKb:u=h,changeAddress:d=a.toAddress().toString()}=o,f=new i(u),p=new r;for(const o of c){const s={satoshis:o.amount,lockingScript:(new t).lock(o.to)};p.addOutput(s)}let l=0n;const g=p.outputs.reduce((t,o)=>t+(o.satoshis||0),0);let w,m=0;for(const o of e){const e=S(o,(new t).unlock(a,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))));if(p.addInput(e),l+=BigInt(o.satoshis),m=await f.computeFee(p),l>=g+m)break}if(l<g+m)throw new Error(`Not enough funds to send. Total sats in: ${l}, Total sats out: ${g}, Fee: ${m}`);if(l>g+m){const o=(new t).lock(d),s={lockingScript:o,change:!0};w={txid:"",vout:p.outputs.length,satoshis:0,script:Buffer.from(o.toHex(),"hex").toString("base64")},p.addOutput(s)}else l<g+m&&console.log("No change needed");await p.fee(f),await p.sign();const y=p.outputs.findIndex(t=>t.change);if(-1!==y){const t=p.outputs[y];w={satoshis:t.satoshis,txid:p.id("hex"),vout:y,script:Buffer.from(t.lockingScript.toBinary()).toString("base64")}}return w&&(w.satoshis=p.outputs[p.outputs.length-1].satoshis,w.txid=p.id("hex")),{tx:p,spentOutpoints:e.map(t=>`${t.txid}_${t.vout}`),payChange:w}},P=async o=>{const{protocol:e,tokenID:a,utxos:c,inputTokens:u,distributions:d,paymentPk:f,ordPk:p,changeAddress:l,tokenChangeAddress:g,satsPerKb:b=h,additionalPayments:k=[],burn:B=!1}=o;let I=0n,x=0n,v=0n;if(!u.every(t=>t.id===a))throw new Error("Input tokens do not match the provided tokenID");const O=new i(b),$=new r;for(const t of u){const o=n.toArray(t.script,"base64"),e=s.fromBinary(o);$.addInput(S(t,(new w).unlock(p,"all",!0,t.satoshis,e))),x+=BigInt(t.amt)}for(const t of d){const o={p:"bsv-20",op:B?"burn":"transfer",amt:t.amt};let s;if(e===y.BSV20)s=m({},o,{tick:a});else{if(e!==y.BSV21)throw new Error("Invalid protocol");s=m({},o,{id:a})}$.addOutput({satoshis:1,lockingScript:(new w).lock(t.address,{dataB64:Buffer.from(JSON.stringify(s)).toString("base64"),contentType:"application/bsv20"})}),v+=BigInt(t.amt)}let A,E;if(I=x-v,I<0n)throw new Error("Not enough tokens to send");if(I>0n){const t={p:"bsv-20",op:"transfer",amt:I.toString()};let o;if(e===y.BSV20)o=m({},t,{tick:a});else{if(e!==y.BSV21)throw new Error("Invalid protocol");o=m({},t,{id:a})}const s=(new w).lock(g||p.toAddress().toString(),{dataB64:Buffer.from(JSON.stringify(o)).toString("base64"),contentType:"application/bsv-20"}),n=$.outputs.length;$.addOutput({lockingScript:s,satoshis:1}),A={id:a,satoshis:1,script:Buffer.from(s.toBinary()).toString("base64"),txid:"",vout:n,amt:I.toString()}}for(const o of k)$.addOutput({satoshis:o.amount,lockingScript:(new t).lock(o.to)});const P=l||f.toAddress().toString(),T=(new t).lock(P);$.addOutput({lockingScript:T,change:!0});let N=0n;const C=$.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n);let _=0;for(const o of c){const e=S(o,(new t).unlock(f,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))));if($.addInput(e),N+=BigInt(o.satoshis),_=await O.computeFee($),N>=C+BigInt(_))break}if(N<C+BigInt(_))throw new Error(`Not enough funds to purchase listing. Total sats in: ${N}, Total sats out: ${C}, Fee: ${_}`);await $.fee(O),await $.sign();const F=$.id("hex");A&&(A.txid=F);const D=$.outputs.findIndex(t=>t.change);if(-1!==D){const t=$.outputs[D];E={satoshis:t.satoshis,txid:F,vout:D,script:Buffer.from(t.lockingScript.toBinary()).toString("base64")}}return E&&(E.satoshis=$.outputs[$.outputs.length-1].satoshis,E.txid=$.id("hex")),{tx:$,spentOutpoints:$.inputs.map(t=>`${t.sourceTXID}_${t.sourceOutputIndex}`),payChange:E,tokenChange:A}},T=(t,o)=>{try{if("collection"===t){const t=o;if(!t.description)return new Error("Collection description is required");if(!t.quantity)return new Error("Collection quantity is required");if(t.rarityLabels){if(!Array.isArray(t.rarityLabels))return new Error("Rarity labels must be an array");if(!t.rarityLabels.every(t=>Object.values(t).every(t=>"string"==typeof t)))return new Error(`Invalid rarity labels ${t.rarityLabels}`)}if(t.traits){if("object"!=typeof t.traits)return new Error("Collection traits must be an object");if(t.traits&&!Object.keys(t.traits).every(o=>"string"==typeof o&&"object"==typeof t.traits[o]))return new Error("Collection traits must be a valid CollectionTraits object")}}if("collectionItem"===t){const t=o;if(!t.collectionId)return new Error("Collection id is required");if(!t.collectionId.includes("_"))return new Error("Collection id must be a valid outpoint");if(64!==t.collectionId.split("_")[0].length)return new Error("Collection id must contain a valid txid");if(Number.isNaN(Number.parseInt(t.collectionId.split("_")[1])))return new Error("Collection id must contain a valid vout");if(t.mintNumber&&"number"!=typeof t.mintNumber)return new Error("Mint number must be a number");if(t.rank&&"number"!=typeof t.rank)return new Error("Rank must be a number");if(t.rarityLabel&&"string"!=typeof t.rarityLabel)return new Error("Rarity label must be a string");if(t.traits&&"object"!=typeof t.traits)return new Error("Traits must be an object");if(t.attachments&&!Array.isArray(t.attachments))return new Error("Attachments must be an array")}return}catch(t){return new Error("Invalid JSON data")}};class N{lock(o,e,i,r){const a=n.fromBase58Check(o).data,c=n.fromBase58Check(e).data;let u=new s;if(void 0!==(null==r?void 0:r.dataB64)&&void 0!==(null==r?void 0:r.contentType)){const t=l("ord"),o=Buffer.from(r.dataB64,"base64").toString("hex").trim();if(!o)throw new Error("Invalid file data");const n=l(r.contentType);if(!n)throw new Error("Invalid media type");u=s.fromASM(`OP_0 OP_IF ${t} OP_1 ${n} OP_0 ${o} OP_ENDIF`)}return u.writeScript(s.fromHex("2097dfd76851bf465e8f715593b217714858bbe9570ff3bd5e33840a34e20ff0262102ba79df5f8ae7604a9830f03c7933028186aede0675a16f025dc4f8be8eec0382201008ce7480da41702918d1ec8e6849ba32b4d65b1e40dc669c31a1e6306b266c0000")).writeBin(a).writeBin(N.buildOutput(i,(new t).lock(c).toBinary())).writeScript(s.fromHex("615179547a75537a537a537a0079537a75527a527a7575615579008763567901c161517957795779210ac407f0e4bd44bfc207355a778b046225a7068fc59ee7eda43ad905aadbffc800206c266b30e6a1319c66dc401e5bd6b432ba49688eecd118297041da8074ce081059795679615679aa0079610079517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01007e81517a75615779567956795679567961537956795479577995939521414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff00517951796151795179970079009f63007952799367007968517a75517a75517a7561527a75517a517951795296a0630079527994527a75517a6853798277527982775379012080517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01205279947f7754537993527993013051797e527e54797e58797e527e53797e52797e57797e0079517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a756100795779ac517a75517a75517a75517a75517a75517a75517a75517a75517a7561517a75517a756169587951797e58797eaa577961007982775179517958947f7551790128947f77517a75517a75618777777777777777777767557951876351795779a9876957795779ac777777777777777767006868"))}cancelListing(o,s="all",n=!1,e,i){const r=(new t).unlock(o,s,n,e,i);return{sign:async function(t,o){return(await r.sign(t,o)).writeOpCode(a.OP_1)},estimateLength:async function(){return 107}}}purchaseListing(t,o){const s={sign:async function(s,e){var i;if(s.outputs.length<2)throw new Error("Malformed transaction");const r=(new u).writeBin(N.buildOutput(s.outputs[0].satoshis||0,s.outputs[0].lockingScript.toBinary()));if(s.outputs.length>2){const t=new n.Writer;for(const o of s.outputs.slice(2))t.write(N.buildOutput(o.satoshis||0,o.lockingScript.toBinary()));r.writeBin(t.toArray())}else r.writeOpCode(a.OP_0);const c=s.inputs[e];let f=t;if(!f&&c.sourceTransaction)f=c.sourceTransaction.outputs[c.sourceOutputIndex].satoshis;else if(!t)throw new Error("sourceTransaction or sourceSatoshis is required");const p=c.sourceTXID||(null==(i=c.sourceTransaction)?void 0:i.id("hex"));let l=o;var h;l||(l=null==(h=c.sourceTransaction)?void 0:h.outputs[c.sourceOutputIndex].lockingScript);const g=d.format({sourceTXID:p,sourceOutputIndex:c.sourceOutputIndex,sourceSatoshis:f,transactionVersion:s.version,otherInputs:[],inputIndex:e,outputs:s.outputs,inputSequence:c.sequence,subscript:l,lockTime:s.lockTime,scope:d.SIGHASH_ALL|d.SIGHASH_ANYONECANPAY|d.SIGHASH_FORKID});return r.writeBin(g).writeOpCode(a.OP_0)},estimateLength:async function(t,o){return(await s.sign(t,o)).toBinary().length}};return s}static buildOutput(t,o){const s=new n.Writer;return s.writeUInt64LEBn(new c(t)),s.writeVarIntNum(o.length),s.write(o),s.toArray()}}const{toArray:C}=n,_=async o=>{const{utxos:e,listings:a,paymentPk:c,ordPk:u,changeAddress:d,satsPerKb:f=h,additionalPayments:p=[]}=o,l=new i(f),g=new r;a.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");for(const t of a){g.addOutput({satoshis:1,lockingScript:(new N).lock(t.ordAddress,t.payAddress,t.price)});const o=C(t.listingUtxo.script,"base64"),n=s.fromBinary(o);g.addInput(S(t.listingUtxo,(new w).unlock(u,"all",!0,t.listingUtxo.satoshis,n)))}for(const o of p)g.addOutput({satoshis:o.amount,lockingScript:(new t).lock(o.to)});let m;const y=(new t).lock(d||c.toAddress().toString());g.addOutput({lockingScript:y,change:!0});let b=0n;const k=g.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n);let B=0;for(const o of e){const e=S(o,(new t).unlock(c,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))));if(g.addInput(e),b+=BigInt(o.satoshis),B=await l.computeFee(g),b>=k+BigInt(B))break}if(b<k+BigInt(B))throw new Error(`Not enough funds to purchase listing. Total sats in: ${b}, Total sats out: ${k}, Fee: ${B}`);await g.fee(l),await g.sign();const I=g.outputs.findIndex(t=>t.change);if(-1!==I){const t=g.outputs[I];m={satoshis:t.satoshis,txid:g.id("hex"),vout:I,script:Buffer.from(t.lockingScript.toBinary()).toString("base64")}}return m&&(m.satoshis=g.outputs[g.outputs.length-1].satoshis,m.txid=g.id("hex")),{tx:g,spentOutpoints:g.inputs.map(t=>`${t.sourceTXID}_${t.sourceOutputIndex}`),payChange:m}},F=async o=>{const{utxos:e,protocol:a,tokenID:c,ordPk:u,paymentPk:d,additionalPayments:f=[],changeAddress:p,tokenChangeAddress:l,inputTokens:g,listings:b,satsPerKb:k=h}=o;if(b.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead."),!g.every(t=>t.id===c))throw new Error("Input tokens do not match the provided tokenID");let B=0n,I=0n,x=0n;if(!g.every(t=>t.id===c))throw new Error("Input tokens do not match the provided tokenID");const v=new i(k),O=new r;for(const t of b){const o={p:"bsv-20",op:"transfer",amt:t.amt.toString()};let s;if(a===y.BSV20)s=m({},o,{tick:c});else{if(a!==y.BSV21)throw new Error("Invalid protocol");s=m({},o,{id:c})}O.addOutput({satoshis:1,lockingScript:(new N).lock(t.payAddress,t.ordAddress,t.price,{dataB64:Buffer.from(JSON.stringify(s)).toString("base64"),contentType:"application/bsv20"})}),x+=t.amt}for(const t of g){const o=C(t.script,"base64"),n=s.fromBinary(o);O.addInput(S(t,(new w).unlock(u,"all",!0,t.satoshis,n))),I+=BigInt(t.amt)}let $,A;if(B=I-x,B<0n)throw new Error("Not enough tokens to send");if(B>0n){const t={p:"bsv-20",op:"transfer",amt:B.toString()};let o;if(a===y.BSV20)o=m({},t,{tick:c});else{if(a!==y.BSV21)throw new Error("Invalid protocol");o=m({},t,{id:c})}const s=(new w).lock(l,{dataB64:Buffer.from(JSON.stringify(o)).toString("base64"),contentType:"application/bsv-20"}),n=O.outputs.length;O.addOutput({lockingScript:s,satoshis:1}),$={id:c,satoshis:1,script:Buffer.from(s.toBinary()).toString("base64"),txid:"",vout:n,amt:B.toString()}}for(const o of f)O.addOutput({satoshis:o.amount,lockingScript:(new t).lock(o.to)});const E=p||d.toAddress().toString(),P=(new t).lock(E);O.addOutput({lockingScript:P,change:!0});let T=0n;const _=O.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n);let F=0;for(const o of e){const e=S(o,(new t).unlock(d,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))));if(O.addInput(e),T+=BigInt(o.satoshis),F=await v.computeFee(O),T>=_+BigInt(F))break}if(T<_+BigInt(F))throw new Error(`Not enough funds to purchase listing. Total sats in: ${T}, Total sats out: ${_}, Fee: ${F}`);await O.fee(v),await O.sign();const D=O.id("hex");$&&($.txid=D);const L=O.outputs.findIndex(t=>t.change);if(-1!==L){const t=O.outputs[L];A={satoshis:t.satoshis,txid:D,vout:L,script:Buffer.from(t.lockingScript.toBinary()).toString("base64")}}return A&&(A.satoshis=O.outputs[O.outputs.length-1].satoshis,A.txid=O.id("hex")),{tx:O,spentOutpoints:O.inputs.map(t=>`${t.sourceTXID}_${t.sourceOutputIndex}`),payChange:A,tokenChange:$}},D=async o=>{const{utxos:e,listingUtxos:a,ordPk:c,paymentPk:u,changeAddress:d,additionalPayments:f=[],satsPerKb:p=h}=o;a.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead.");const l=new i(p),g=new r;for(const o of a)g.addInput(S(o,(new N).cancelListing(c,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))))),g.addOutput({satoshis:1,lockingScript:(new t).lock(c.toAddress().toString())});for(const o of f)g.addOutput({satoshis:o.amount,lockingScript:(new t).lock(o.to)});let w;const m=d||u.toAddress().toString(),y=(new t).lock(m);g.addOutput({lockingScript:y,change:!0});let b=0n;const k=g.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n);let B=0;for(const o of e){const e=S(o,(new t).unlock(u,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))));if(g.addInput(e),b+=BigInt(o.satoshis),B=await l.computeFee(g),b>=k+BigInt(B))break}if(b<k+BigInt(B))throw new Error(`Not enough funds to purchase listing. Total sats in: ${b}, Total sats out: ${k}, Fee: ${B}`);await g.fee(l),await g.sign();const I=g.outputs.findIndex(t=>t.change);if(-1!==I){const t=g.outputs[I];w={satoshis:t.satoshis,txid:g.id("hex"),vout:I,script:Buffer.from(t.lockingScript.toBinary()).toString("base64")}}return w&&(w.satoshis=g.outputs[g.outputs.length-1].satoshis,w.txid=g.id("hex")),{tx:g,spentOutpoints:g.inputs.map(t=>`${t.sourceTXID}_${t.sourceOutputIndex}`),payChange:w}},L=async o=>{const{protocol:e,tokenID:a,ordAddress:c,changeAddress:u,paymentPk:d,ordPk:f,additionalPayments:p,listingUtxos:l,utxos:g,satsPerKb:b=h}=o;let k=0;if(l.length>100&&console.warn("Creating many inscriptions at once can be slow. Consider using multiple transactions instead."),!l.every(t=>t.id===a))throw new Error("Input tokens do not match the provided tokenID");const B=new i(b),I=new r;for(const t of l)I.addInput(S(t,(new N).cancelListing(f,"all",!0,t.satoshis,s.fromBinary(n.toArray(t.script,"base64"))))),k+=Number.parseInt(t.amt);const x={p:"bsv-20",op:"transfer",amt:k.toString()};let v;if(e===y.BSV20)v=m({},x,{tick:a});else{if(e!==y.BSV21)throw new Error("Invalid protocol");v=m({},x,{id:a})}const O={address:c||f.toAddress().toString(),inscription:{dataB64:Buffer.from(JSON.stringify(v)).toString("base64"),contentType:"application/bsv-20"}};I.addOutput({satoshis:1,lockingScript:(new w).lock(O.address,O.inscription)});for(const o of p)I.addOutput({satoshis:o.amount,lockingScript:(new t).lock(o.to)});let $;const A=u||d.toAddress().toString(),E=(new t).lock(A);I.addOutput({lockingScript:E,change:!0});let P=0n;const T=I.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n);let C=0;for(const o of g){const e=S(o,(new t).unlock(d,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))));if(I.addInput(e),P+=BigInt(o.satoshis),C=await B.computeFee(I),P>=T+BigInt(C))break}if(P<T+BigInt(C))throw new Error(`Not enough funds to purchase listing. Total sats in: ${P}, Total sats out: ${T}, Fee: ${C}`);await I.fee(B),await I.sign();const _=I.outputs.findIndex(t=>t.change);if(-1!==_){const t=I.outputs[_];$={satoshis:t.satoshis,txid:I.id("hex"),vout:_,script:Buffer.from(t.lockingScript.toBinary()).toString("base64")}}return $&&($.satoshis=I.outputs[I.outputs.length-1].satoshis,$.txid=I.id("hex")),{tx:I,spentOutpoints:I.inputs.map(t=>`${t.sourceTXID}_${t.sourceOutputIndex}`),payChange:$}},j=async e=>{const{utxos:a,paymentPk:c,listing:u,ordAddress:d,changeAddress:f,additionalPayments:p=[],satsPerKb:l=h}=e,g=new i(l),w=new r;w.addInput(S(u.listingUtxo,(new N).purchaseListing(1,s.fromBinary(n.toArray(u.listingUtxo.script,"base64"))))),w.addOutput({satoshis:1,lockingScript:(new t).lock(d)});const m=new n.Reader(n.toArray(u.payout,"base64")),y=m.readUInt64LEBn().toNumber(),b=m.readVarIntNum(),k=m.read(b),B=o.fromBinary(k);w.addOutput({satoshis:y,lockingScript:B});for(const o of p)w.addOutput({satoshis:o.amount,lockingScript:(new t).lock(o.to)});let I;const x=f||c.toAddress().toString(),v=(new t).lock(x);w.addOutput({lockingScript:v,change:!0});let O=0n;const $=w.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n);let A=0;for(const o of a){const e=S(o,(new t).unlock(c,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))));if(w.addInput(e),O+=BigInt(o.satoshis),A=await g.computeFee(w),O>=$+BigInt(A))break}if(O<$+BigInt(A))throw new Error(`Not enough funds to purchase listing. Total sats in: ${O}, Total sats out: ${$}, Fee: ${A}`);await w.fee(g),await w.sign();const E=w.outputs.findIndex(t=>t.change);if(-1!==E){const t=w.outputs[E];I={satoshis:t.satoshis,txid:w.id("hex"),vout:E,script:Buffer.from(t.lockingScript.toBinary()).toString("base64")}}return I&&(I.satoshis=w.outputs[w.outputs.length-1].satoshis,I.txid=w.id("hex")),{tx:w,spentOutpoints:w.inputs.map(t=>`${t.sourceTXID}_${t.sourceOutputIndex}`),payChange:I}},U=async e=>{const{protocol:a,tokenID:c,utxos:u,paymentPk:d,listingUtxo:f,ordAddress:p,changeAddress:l,satsPerKb:g=h,additionalPayments:b=[]}=e,k=new i(g),B=new r;B.addInput(S(f,(new N).purchaseListing(1,s.fromBinary(n.toArray(f.script,"base64")))));const I={p:"bsv-20",op:"transfer",amt:f.amt};let x;if(a===y.BSV20)x=m({},I,{tick:c});else{if(a!==y.BSV21)throw new Error("Invalid protocol");x=m({},I,{id:c})}const v=Buffer.from(JSON.stringify(x)).toString("base64");B.addOutput({satoshis:1,lockingScript:(new w).lock(p,{dataB64:v,contentType:"bsv-20"})});const O=new n.Reader(n.toArray(f.payout,"base64")),$=O.readUInt64LEBn().toNumber(),A=O.readVarIntNum(),E=O.read(A),P=o.fromBinary(E);B.addOutput({satoshis:$,lockingScript:P});for(const o of b)B.addOutput({satoshis:o.amount,lockingScript:(new t).lock(o.to)});let T;const C=l||d.toAddress().toString(),_=(new t).lock(C);B.addOutput({lockingScript:_,change:!0});let F=0n;const D=B.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n);let L=0;for(const o of u){const e=S(o,(new t).unlock(d,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))));if(B.addInput(e),F+=BigInt(o.satoshis),L=await k.computeFee(B),F>=D+BigInt(L))break}if(F<D+BigInt(L))throw new Error(`Not enough funds to purchase token listing. Total sats in: ${F}, Total sats out: ${D}, Fee: ${L}`);await B.fee(k),await B.sign();const j=B.outputs.findIndex(t=>t.change);if(-1!==j){const t=B.outputs[j];T={satoshis:t.satoshis,txid:B.id("hex"),vout:j,script:Buffer.from(t.lockingScript.toBinary()).toString("base64")}}return T&&(T.satoshis=B.outputs[B.outputs.length-1].satoshis,T.txid=B.id("hex")),{tx:B,spentOutpoints:B.inputs.map(t=>`${t.sourceTXID}_${t.sourceOutputIndex}`),payChange:T}},V=new Error("Image must be a square image with dimensions <= 400x400"),K=new Error("Image must be a square image"),M=new Error("Error processing image"),q=new Error("Image dimensions are undefined"),H=async o=>{const{symbol:e,icon:a,decimals:c,utxos:u,initialDistribution:d,paymentPk:f,destinationAddress:l,changeAddress:g,satsPerKb:m=h,additionalPayments:y=[]}=o,b=new i(m),k=new r;let B;if("string"==typeof a)B=a;else{const t=await(async t=>{const{dataB64:o,contentType:s}=t;if("image/svg+xml"===s)return(t=>{const o=Buffer.from(t,"base64").toString("utf-8"),s=o.match(/<svg[^>]*\s+width="([^"]+)"/),n=o.match(/<svg[^>]*\s+height="([^"]+)"/);if(console.log({widthMatch:s,heightMatch:n}),!s||!n)return q;const e=Number.parseInt(s[1],10),i=Number.parseInt(n[1],10);return Number.isNaN(e)||Number.isNaN(i)?q:e!==i?K:e>400||i>400?V:null})(o);if((n=s)!=n)return M;var n;try{const t=Buffer.from(o,"base64"),s=await p.read(t),n=s.getWidth(),e=s.getHeight();return void 0===n||void 0===e?q:n!==e?K:n>400||e>400?V:null}catch(t){return M}})(a);if(t)throw t;const o=(new w).lock(l,a);k.addOutput({satoshis:1,lockingScript:o}),B="_0"}if(!(t=>{if(!t.includes("_")||t.endsWith("_"))return!1;const o=Number.parseInt(t.split("_")[1]);return!(Number.isNaN(o)||!t.startsWith("_")&&64!==t.split("_")[0].length)})(B))throw new Error("Invalid icon format. Must be either outpoint (format: txid_vout) or relative output index of the icon (format _vout). examples: ecb483eda58f26da1b1f8f15b782b1186abdf9c6399a1c3e63e0d429d5092a41_0 or _1");c&&(d.amt+="0".repeat(c));const I={p:"bsv-20",op:"deploy+mint",sym:e,icon:B,amt:d.amt};c&&(I.dec=c.toString());const x=Buffer.from(JSON.stringify(I)).toString("base64"),v={satoshis:1,lockingScript:(new w).lock(l,{dataB64:x,contentType:"application/bsv-20"})};k.addOutput(v);for(const o of y){const s={satoshis:o.amount,lockingScript:(new t).lock(o.to)};k.addOutput(s)}let O=0n;const $=k.outputs.reduce((t,o)=>t+BigInt(o.satoshis||0),0n);let A,E=0;for(const o of u){const e=S(o,(new t).unlock(f,"all",!0,o.satoshis,s.fromBinary(n.toArray(o.script,"base64"))));if(k.addInput(e),O+=BigInt(o.satoshis),E=await b.computeFee(k),O>=$+BigInt(E))break}if(O<$+BigInt(E))throw new Error(`Not enough funds to deploy token. Total sats in: ${O}, Total sats out: ${$}, Fee: ${E}`);const P=g||f.toAddress().toString(),T=(new t).lock(P);k.addOutput({lockingScript:T,change:!0}),await k.fee(b),await k.sign();const N=k.outputs.findIndex(t=>t.change);if(-1!==N){const t=k.outputs[N];A={satoshis:t.satoshis,txid:k.id("hex"),vout:N,script:Buffer.from(t.lockingScript.toBinary()).toString("base64")}}return{tx:k,spentOutpoints:k.inputs.map(t=>`${t.sourceTXID}_${t.sourceOutputIndex}`),payChange:A}};export{N as OrdLock,w as OrdP2PKH,b as RoytaltyType,y as TokenType,D as cancelOrdListings,L as cancelOrdTokenListings,_ as createOrdListings,F as createOrdTokenListings,$ as createOrdinals,H as deployBsv21Token,I as fetchNftUtxos,B as fetchPayUtxos,x as fetchTokenUtxos,j as purchaseOrdListing,U as purchaseOrdTokenListing,A as sendOrdinals,E as sendUtxos,O as stringifyMetaData,P as transferOrdTokens,T as validateSubTypeData};
//# sourceMappingURL=index.modern.js.map
