(function(vt){"use strict";var Rt;const yt='*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:var(--un-default-border-color, #e5e7eb)}:before,:after{--un-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}';/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Z=globalThis,Q=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,tt=Symbol(),xt=new WeakMap;let wt=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==tt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Q&&t===void 0){const o=e!==void 0&&e.length===1;o&&(t=xt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&xt.set(e,t))}return t}toString(){return this.cssText}};const et=i=>new wt(typeof i=="string"?i:i+"",void 0,tt),M=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((o,r,s)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[s+1],i[0]);return new wt(e,i,tt)},qt=(i,t)=>{if(Q)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const o=document.createElement("style"),r=Z.litNonce;r!==void 0&&o.setAttribute("nonce",r),o.textContent=e.cssText,i.appendChild(o)}},$t=Q?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return et(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Wt,defineProperty:Yt,getOwnPropertyDescriptor:Zt,getOwnPropertyNames:Kt,getOwnPropertySymbols:Xt,getPrototypeOf:Jt}=Object,k=globalThis,kt=k.trustedTypes,Gt=kt?kt.emptyScript:"",ot=k.reactiveElementPolyfillSupport,H=(i,t)=>i,K={toAttribute(i,t){switch(t){case Boolean:i=i?Gt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},rt=(i,t)=>!Wt(i,t),_t={attribute:!0,type:String,converter:K,reflect:!1,useDefault:!1,hasChanged:rt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),k.litPropertyMetadata??(k.litPropertyMetadata=new WeakMap);let P=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_t){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const o=Symbol(),r=this.getPropertyDescriptor(t,o,e);r!==void 0&&Yt(this.prototype,t,r)}}static getPropertyDescriptor(t,e,o){const{get:r,set:s}=Zt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const l=r==null?void 0:r.call(this);s==null||s.call(this,n),this.requestUpdate(t,l,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_t}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;const t=Jt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){const e=this.properties,o=[...Kt(e),...Xt(e)];for(const r of o)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[o,r]of e)this.elementProperties.set(o,r)}this._$Eh=new Map;for(const[e,o]of this.elementProperties){const r=this._$Eu(e,o);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const r of o)e.unshift($t(r))}else t!==void 0&&e.push($t(t));return e}static _$Eu(t,e){const o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return qt(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var o;return(o=e.hostConnected)==null?void 0:o.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var o;return(o=e.hostDisconnected)==null?void 0:o.call(e)})}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){var s;const o=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,o);if(r!==void 0&&o.reflect===!0){const n=(((s=o.converter)==null?void 0:s.toAttribute)!==void 0?o.converter:K).toAttribute(e,o.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){var s,n;const o=this.constructor,r=o._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const l=o.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((s=l.converter)==null?void 0:s.fromAttribute)!==void 0?l.converter:K;this._$Em=r;const d=a.fromAttribute(e,l.type);this[r]=d??((n=this._$Ej)==null?void 0:n.get(r))??d,this._$Em=null}}requestUpdate(t,e,o){var r;if(t!==void 0){const s=this.constructor,n=this[t];if(o??(o=s.getPropertyOptions(t)),!((o.hasChanged??rt)(n,e)||o.useDefault&&o.reflect&&n===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(s._$Eu(t,o))))return;this.C(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:r,wrapped:s},n){o&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),s!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[s,n]of r){const{wrapped:l}=n,a=this[s];l!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(o=this._$EO)==null||o.forEach(r=>{var s;return(s=r.hostUpdate)==null?void 0:s.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(o=>{var r;return(r=o.hostUpdated)==null?void 0:r.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};P.elementStyles=[],P.shadowRootOptions={mode:"open"},P[H("elementProperties")]=new Map,P[H("finalized")]=new Map,ot==null||ot({ReactiveElement:P}),(k.reactiveElementVersions??(k.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const N=globalThis,X=N.trustedTypes,At=X?X.createPolicy("lit-html",{createHTML:i=>i}):void 0,Et="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,St="?"+_,Qt=`<${St}>`,E=document,V=()=>E.createComment(""),R=i=>i===null||typeof i!="object"&&typeof i!="function",st=Array.isArray,te=i=>st(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",it=`[ 	
\f\r]`,B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ct=/-->/g,zt=/>/g,S=RegExp(`>|${it}(?:([^\\s"'>=/]+)(${it}*=${it}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Dt=/'/g,Ot=/"/g,Mt=/^(?:script|style|textarea|title)$/i,ee=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),c=ee(1),A=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Pt=new WeakMap,C=E.createTreeWalker(E,129);function Ut(i,t){if(!st(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return At!==void 0?At.createHTML(t):t}const oe=(i,t)=>{const e=i.length-1,o=[];let r,s=t===2?"<svg>":t===3?"<math>":"",n=B;for(let l=0;l<e;l++){const a=i[l];let d,h,u=-1,f=0;for(;f<a.length&&(n.lastIndex=f,h=n.exec(a),h!==null);)f=n.lastIndex,n===B?h[1]==="!--"?n=Ct:h[1]!==void 0?n=zt:h[2]!==void 0?(Mt.test(h[2])&&(r=RegExp("</"+h[2],"g")),n=S):h[3]!==void 0&&(n=S):n===S?h[0]===">"?(n=r??B,u=-1):h[1]===void 0?u=-2:(u=n.lastIndex-h[2].length,d=h[1],n=h[3]===void 0?S:h[3]==='"'?Ot:Dt):n===Ot||n===Dt?n=S:n===Ct||n===zt?n=B:(n=S,r=void 0);const g=n===S&&i[l+1].startsWith("/>")?" ":"";s+=n===B?a+Qt:u>=0?(o.push(d),a.slice(0,u)+Et+a.slice(u)+_+g):a+_+(u===-2?l:g)}return[Ut(i,s+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]};class I{constructor({strings:t,_$litType$:e},o){let r;this.parts=[];let s=0,n=0;const l=t.length-1,a=this.parts,[d,h]=oe(t,e);if(this.el=I.createElement(d,o),C.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=C.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Et)){const f=h[n++],g=r.getAttribute(u).split(_),$=/([.?@])?(.*)/.exec(f);a.push({type:1,index:s,name:$[2],strings:g,ctor:$[1]==="."?se:$[1]==="?"?ie:$[1]==="@"?ne:J}),r.removeAttribute(u)}else u.startsWith(_)&&(a.push({type:6,index:s}),r.removeAttribute(u));if(Mt.test(r.tagName)){const u=r.textContent.split(_),f=u.length-1;if(f>0){r.textContent=X?X.emptyScript:"";for(let g=0;g<f;g++)r.append(u[g],V()),C.nextNode(),a.push({type:2,index:++s});r.append(u[f],V())}}}else if(r.nodeType===8)if(r.data===St)a.push({type:2,index:s});else{let u=-1;for(;(u=r.data.indexOf(_,u+1))!==-1;)a.push({type:7,index:s}),u+=_.length-1}s++}}static createElement(t,e){const o=E.createElement("template");return o.innerHTML=t,o}}function U(i,t,e=i,o){var n,l;if(t===A)return t;let r=o!==void 0?(n=e._$Co)==null?void 0:n[o]:e._$Cl;const s=R(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==s&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),s===void 0?r=void 0:(r=new s(i),r._$AT(i,e,o)),o!==void 0?(e._$Co??(e._$Co=[]))[o]=r:e._$Cl=r),r!==void 0&&(t=U(i,r._$AS(i,t.values),r,o)),t}class re{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,r=((t==null?void 0:t.creationScope)??E).importNode(e,!0);C.currentNode=r;let s=C.nextNode(),n=0,l=0,a=o[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new F(s,s.nextSibling,this,t):a.type===1?d=new a.ctor(s,a.name,a.strings,this,t):a.type===6&&(d=new ae(s,this,t)),this._$AV.push(d),a=o[++l]}n!==(a==null?void 0:a.index)&&(s=C.nextNode(),n++)}return C.currentNode=E,r}p(t){let e=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class F{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,o,r){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=U(this,t,e),R(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):te(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){var s;const{values:e,_$litType$:o}=t,r=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=I.createElement(Ut(o.h,o.h[0]),this.options)),o);if(((s=this._$AH)==null?void 0:s._$AD)===r)this._$AH.p(e);else{const n=new re(r,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=Pt.get(t.strings);return e===void 0&&Pt.set(t.strings,e=new I(t)),e}k(t){st(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,r=0;for(const s of t)r===e.length?e.push(o=new F(this.O(V()),this.O(V()),this,this.options)):o=e[r],o._$AI(s),r++;r<e.length&&(this._$AR(o&&o._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,e);t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class J{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,r,s){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=p}_$AI(t,e=this,o,r){const s=this.strings;let n=!1;if(s===void 0)t=U(this,t,e,0),n=!R(t)||t!==this._$AH&&t!==A,n&&(this._$AH=t);else{const l=t;let a,d;for(t=s[0],a=0;a<s.length-1;a++)d=U(this,l[o+a],e,a),d===A&&(d=this._$AH[a]),n||(n=!R(d)||d!==this._$AH[a]),d===p?t=p:t!==p&&(t+=(d??"")+s[a+1]),this._$AH[a]=d}n&&!r&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class se extends J{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}}class ie extends J{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}}class ne extends J{constructor(t,e,o,r,s){super(t,e,o,r,s),this.type=5}_$AI(t,e=this){if((t=U(this,t,e,0)??p)===A)return;const o=this._$AH,r=t===p&&o!==p||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==p&&(o===p||r);r&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class ae{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){U(this,t)}}const nt=N.litHtmlPolyfillSupport;nt==null||nt(I,F),(N.litHtmlVersions??(N.litHtmlVersions=[])).push("3.3.1");const le=(i,t,e)=>{const o=(e==null?void 0:e.renderBefore)??t;let r=o._$litPart$;if(r===void 0){const s=(e==null?void 0:e.renderBefore)??null;o._$litPart$=r=new F(t.insertBefore(V(),s),s,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const z=globalThis;let v=class extends P{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=le(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return A}};v._$litElement$=!0,v.finalized=!0,(Rt=z.litElementHydrateSupport)==null||Rt.call(z,{LitElement:v});const at=z.litElementPolyfillSupport;at==null||at({LitElement:v}),(z.litElementVersions??(z.litElementVersions=[])).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ce={attribute:!0,type:String,converter:K,reflect:!1,hasChanged:rt},de=(i=ce,t,e)=>{const{kind:o,metadata:r}=e;let s=globalThis.litPropertyMetadata.get(r);if(s===void 0&&globalThis.litPropertyMetadata.set(r,s=new Map),o==="setter"&&((i=Object.create(i)).wrapped=!0),s.set(e.name,i),o==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(o==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+o)};function D(i){return(t,e)=>typeof e=="object"?de(i,t,e):((o,r,s)=>{const n=r.hasOwnProperty(s);return r.constructor.createProperty(s,o),n?Object.getOwnPropertyDescriptor(r,s):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function w(i){return D({...i,state:!0,attribute:!1})}const dt=class dt extends v{render(){return c`
      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle
          style="opacity: 0.25;"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          style="opacity: 0.75;"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          fill="currentColor"
        ></path>
      </svg>
    `}};dt.styles=M`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1em;
    }
    svg {
      height: 1.25em;
      width: 1.25em;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;let lt=dt;customElements.get("loading-bar")||customElements.define("loading-bar",lt);const ut=class ut extends v{render(){return c`<svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle
        style="opacity: 0.25;"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        style="opacity: 0.75;"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
      ></path>
    </svg>`}};ut.styles=M`
    :host {
      display: inline-flex;
    }
    svg {
      height: 1.25em;
      width: 1.25em;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;let ct=ut;customElements.get("icon-loading")||customElements.define("icon-loading",ct);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jt={ATTRIBUTE:1},Tt=i=>(...t)=>({_$litDirective$:i,values:t});let Lt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ue=Tt(class extends Lt{constructor(i){var t;if(super(i),i.type!==jt.ATTRIBUTE||i.name!=="class"||((t=i.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(i){return" "+Object.keys(i).filter(t=>i[t]).join(" ")+" "}update(i,[t]){var o,r;if(this.st===void 0){this.st=new Set,i.strings!==void 0&&(this.nt=new Set(i.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(const s in t)t[s]&&!((o=this.nt)!=null&&o.has(s))&&this.st.add(s);return this.render(t)}const e=i.element.classList;for(const s of this.st)s in t||(e.remove(s),this.st.delete(s));for(const s in t){const n=!!t[s];n===this.st.has(s)||(r=this.nt)!=null&&r.has(s)||(n?(e.add(s),this.st.add(s)):(e.remove(s),this.st.delete(s)))}return A}});var he=Object.defineProperty,Ht=(i,t,e,o)=>{for(var r=void 0,s=i.length-1,n;s>=0;s--)(n=i[s])&&(r=n(t,e,r)||r);return r&&he(t,e,r),r};const ht=class ht extends v{constructor(){super(...arguments),this.message="",this.type="success"}render(){return c`<div
      class="toast ${ue({"toast--error":this.type==="error","toast--success":this.type==="success","toast--warn":this.type==="warn"})}"
    >
      ${this.type==="success"?c`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0" />
              <path d="m9 12l2 2l4-4" />
            </g>
          </svg>`:c`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01"
            />
          </svg>`} <span>${this.message}</span>
    </div>`}};ht.styles=[M`
      .toast {
        border-radius: 0.4rem;
        font-size: 0.875em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5em 0.625em;
        justify-content: space-between;
        overflow: hidden;
        color: #fff;
        gap: 0.5em;
        box-shadow:
          0 0 #0000,
          0 0 #0000,
          0 1px 3px 0 rgb(0 0 0 / 0.1),
          0 1px 2px -1px rgb(0 0 0 / 0.1);

        animation: slideInDown 0.3s ease-out forwards;
      }

      .toast--exit {
        animation: slideOutUp 0.3s ease-in forwards;
      }

      .toast--error {
        background-color: #d71d1d;
      }

      .toast--success {
        background-color: #4ccba0;
      }

      .toast--warn {
        background-color: #f5a623;
      }

      @keyframes slideInDown {
        from {
          transform: translateY(0);
          opacity: 0;
        }
        to {
          transform: translateY(100%);
          opacity: 1;
        }
      }

      @keyframes slideOutUp {
        from {
          transform: translateY(100%);
          opacity: 1;
        }
        to {
          transform: translateY(0);
          opacity: 0;
        }
      }
    `];let j=ht;Ht([D({type:String})],j.prototype,"message"),Ht([D({type:String})],j.prototype,"type");const pt=class pt extends v{render(){return c`<slot></slot>`}};pt.styles=[M`
      :host {
        position: fixed;
        top: 1em;
        z-index: 1000;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 0.5em;
      }
    `];let G=pt;customElements.get("vote-toast")||customElements.define("vote-toast",j),customElements.get("vote-toast-container")||customElements.define("vote-toast-container",G);class pe{constructor(){this.body=document.body;const t=this.body.querySelector("vote-toast-container");t?this.toastContainer=t:(this.toastContainer=new G,this.body.appendChild(this.toastContainer))}show(t,e){const o=new j;o.message=t,o.type=e,this.toastContainer.appendChild(o),setTimeout(()=>{o.classList.add("toast--exit"),setTimeout(()=>{var r;(r=this.toastContainer)==null||r.removeChild(o)},300)},3e3)}success(t){this.show(t,"success")}error(t){this.show(t,"error")}warn(t){this.show(t,"warn")}}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt="important",fe=" !"+Nt,ge=Tt(class extends Lt{constructor(i){var t;if(super(i),i.type!==jt.ATTRIBUTE||i.name!=="style"||((t=i.strings)==null?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(i){return Object.keys(i).reduce((t,e)=>{const o=i[e];return o==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(i,[t]){const{style:e}=i.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(const o of this.ft)t[o]==null&&(this.ft.delete(o),o.includes("-")?e.removeProperty(o):e[o]=null);for(const o in t){const r=t[o];if(r!=null){this.ft.add(o);const s=typeof r=="string"&&r.endsWith(fe);o.includes("-")||s?e.setProperty(o,s?r.slice(0,-11):r,s?Nt:""):e[o]=r}}return A}});/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function*Vt(i,t){if(i!==void 0){let e=0;for(const o of i)yield t(o,e++)}}var me=Object.defineProperty,T=(i,t,e,o)=>{for(var r=void 0,s=i.length-1,n;s>=0;s--)(n=i[s])&&(r=n(t,e,r)||r);return r&&me(t,e,r),r};const ft=class ft extends v{constructor(){super(...arguments),this.open=!1,this.voteName="",this.options=[],this._userListData=[],this._isLoading=!1,this._error=null}updated(t){(t.has("voteName")||t.has("open"))&&this.voteName&&this.open&&!this._userListData.length&&this._fetchUserListData()}async _fetchUserListData(){this._isLoading=!0,this._error=null;try{const t=`/apis/api.vote.kunkunyu.com/v1alpha1/votes/${this.voteName}/user-list`,e=await fetch(t);if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);this._userListData=await e.json()}catch(t){console.error("Error fetching user list data:",t),this._error=t instanceof Error?t.message:"Failed to load data."}finally{this._isLoading=!1}}_findUsersForOption(t){const e=this._userListData.find(o=>o.id===t);return(e==null?void 0:e.userList)||[]}render(){return c`
      <div class="modal__wrapper" style="${ge({display:this.open?"flex":"none"})}">
        <div class="modal__layer backdrop-blur-sm bg-gray-800/40" @click="${this.close}"></div>
          <div class="fixed top-0 right-0 bottom-0 left-0 overflow-y-auto">
              <div class="min-h-full flex items-center justify-center p-4 text-center">
                  <div class="max-w-36rem w-full transform overflow-hidden rounded-lg bg-primary p-6 text-left align-middle shadow-default transition-all ease-in-out duration-150">
                      <div class="flex flex-row-reverse items-center justify-between">
                          <button type="button" tabindex="0" class="text-xl text-icon" @click="${this.close}">
                              <span class="i-carbon-close block w-1em h-1em"></span>
                          </button>
                          <h2 class="text-lg text-title font-semibold">投票数据统计</h2>
                      </div>
                      <div class="mt-6 border-default max-h-[60vh] overflow-y-auto">
                          ${this._isLoading?c`<div class="text-center text-description py-4">加载中...</div>`:this._error?c`<div class="text-center text-error py-4">加载失败: ${this._error}</div>`:c`
                                    <div class="space-y-4">
                                        ${this.options.length===0?c`<div class="text-center text-description">没有投票选项。</div>`:Vt(this.options,t=>{const e=this._findUsersForOption(t.id);return c`
                                                    <div class="border border-default rounded-md p-3">
                                                        <h3 class="font-medium text-title mb-2">${t.title}</h3>
                                                        ${e.length>0?c`
                                                                <div class="flex flex-wrap gap-1">
                                                                    ${Vt(e,o=>c`
                                                                        <span class="bg-tag text-description text-xs font-medium px-2 py-0.5 rounded-full border border-default">
                                                                            ${o.displayName||o.name}
                                                                        </span>
                                                                    `)}
                                                                </div>
                                                            `:c`<span class="text-sm text-description">-</span>`}
                                                    </div>
                                                `})}
                                    </div>
                                  `}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `}close(){this.open=!1}};ft.styles=[et(yt),M`
        :host {
            display: block;
        }
        .modal__wrapper {
            position: fixed;
            left: 0px;
            top: 0px;
            display: flex;
            height: 100%;
            width: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding-top: 2.5em;
            padding-bottom: 2.5em;
            z-index: 999;
        }
        .modal__layer {
            position: absolute;
            top: 0px;
            left: 0px;
            height: 100%;
            width: 100%;
            flex: none;
            animation: fadeIn 0.15s both;
        }
        .vote-shadow-default {
           box-shadow: var(--vote-shadow,0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1));
        }
        /* layer: preflights */
*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}
/* layer: icons */
.i-carbon-close{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}
/* layer: shortcuts */
.border-default{border-color:var(--vote-border-color,#e5e7eb);}
.bg-primary{background-color:var(--vote-background-primary-color,#ffffff);}
.bg-tag{background-color:var(--vote-background-tag-color,#f3f4f6);}
.text-description{color:var(--vote-text-description-color,#71717a);}
.text-error{color:var(--vote-text-error-color,#ef4444);}
.text-icon{color:var(--vote-icon-color,#71717a);}
.text-title{color:var(--vote-text-title-color,#18181b);}
/* layer: default */
.absolute{position:absolute;}
.fixed{position:fixed;}
.static{position:static;}
.bottom-0{bottom:0;}
.left-0{left:0;}
.right-0{right:0;}
.top-0{top:0;}
.mb-2{margin-bottom:0.5rem;}
.mt-6{margin-top:1.5rem;}
.block{display:block;}
.h-1em{height:1em;}
.max-h-\\[60vh\\]{max-height:60vh;}
.max-w-36rem{max-width:36rem;}
.min-h-full{min-height:100%;}
.w-1em{width:1em;}
.w-full{width:100%;}
.flex{display:flex;}
.flex-row-reverse{flex-direction:row-reverse;}
.flex-wrap{flex-wrap:wrap;}
.transform{transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}
.items-center{align-items:center;}
.justify-center{justify-content:center;}
.justify-between{justify-content:space-between;}
.gap-1{gap:0.25rem;}
.space-y-4>:not([hidden])~:not([hidden]){--un-space-y-reverse:0;margin-top:calc(1rem * calc(1 - var(--un-space-y-reverse)));margin-bottom:calc(1rem * var(--un-space-y-reverse));}
.overflow-hidden{overflow:hidden;}
.overflow-y-auto{overflow-y:auto;}
.border{border-width:1px;}
.rounded-full{border-radius:9999px;}
.rounded-lg{border-radius:0.5rem;}
.rounded-md{border-radius:0.375rem;}
.bg-gray-800\\/40{background-color:rgb(31 41 55 / 0.4);}
.p-3{padding:0.75rem;}
.p-4{padding:1rem;}
.p-6{padding:1.5rem;}
.px-2{padding-left:0.5rem;padding-right:0.5rem;}
.py-0\\.5{padding-top:0.125rem;padding-bottom:0.125rem;}
.py-4{padding-top:1rem;padding-bottom:1rem;}
.text-center{text-align:center;}
.text-left{text-align:left;}
.align-middle{vertical-align:middle;}
.text-lg{font-size:1.125rem;line-height:1.75rem;}
.text-sm{font-size:0.875rem;line-height:1.25rem;}
.text-xl{font-size:1.25rem;line-height:1.75rem;}
.text-xs{font-size:0.75rem;line-height:1rem;}
.font-medium{font-weight:500;}
.font-semibold{font-weight:600;}
.backdrop-blur-sm{--un-backdrop-blur:blur(4px);-webkit-backdrop-filter:var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia);backdrop-filter:var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia);}
.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}
.duration-150{transition-duration:150ms;}
.ease-in-out{transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);}
            `];let y=ft;T([D({type:Boolean})],y.prototype,"open"),T([D({type:String})],y.prototype,"voteName"),T([D({type:Array})],y.prototype,"options"),T([w()],y.prototype,"_userListData"),T([w()],y.prototype,"_isLoading"),T([w()],y.prototype,"_error"),customElements.get("vote-user-modal")||customElements.define("vote-user-modal",y);var be=Object.defineProperty,O=(i,t,e,o)=>{for(var r=void 0,s=i.length-1,n;s>=0;s--)(n=i[s])&&(r=n(t,e,r)||r);return r&&be(t,e,r),r};const gt=class gt extends v{constructor(){super(...arguments),this.name="",this.loading=!1,this.submitting=!1,this.voteDetail=null,this.error=null,this.selectedOptions=new Set,this.toastManager=new pe}connectedCallback(){super.connectedCallback(),this.name&&this.fetchVoteDetail()}handleOpenVoteUserModal(){var e;const t=document.body.querySelector("vote-user-modal");if(t)t.open=!0;else{const o=new y;o.open=!0,o.voteName=this.name,o.options=((e=this.voteDetail)==null?void 0:e.vote.spec.options)||[],document.body.appendChild(o)}}async fetchVoteDetail(){try{this.loading=!0;const t=await fetch(`/apis/api.vote.kunkunyu.com/v1alpha1/votes/${this.name}/detail`);if(!t.ok)throw new Error("Failed to fetch vote data");this.voteDetail=await t.json(),this.voteDetail.userVoteData&&this.voteDetail.userVoteData.length>0&&(this.selectedOptions=new Set(this.voteDetail.userVoteData))}catch(t){console.error(t),this.error="Failed to load vote data"}finally{this.loading=!1}}handleOptionClick(t){if(!this.voteDetail||this.hasVoted()||this.voteDetail.vote.spec.hasEnded){this.toastManager.warn("您已经投票或投票已结束");return}const e=this.voteDetail.vote.spec.type,o=this.voteDetail.vote.spec.maxVotes||1;if(e==="single"||e==="pk")this.selectedOptions.clear(),this.selectedOptions.add(t);else if(e==="multiple")if(this.selectedOptions.has(t))this.selectedOptions.delete(t);else{if(this.selectedOptions.size>=o){this.toastManager.warn(`最多只能选择${o}项`);return}this.selectedOptions.add(t)}this.requestUpdate()}async submitVote(){if(this.voteDetail){if(this.hasVoted()){this.toastManager.warn("您已经完成投票，请勿重复提交");return}if(this.selectedOptions.size===0){this.toastManager.warn("请至少选择一个选项");return}try{this.submitting=!0;const t=await fetch(`/apis/api.vote.kunkunyu.com/v1alpha1/votes/${this.name}/submit`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({voteData:Array.from(this.selectedOptions)})});if(!t.ok){const{detail:e}=await t.json();this.toastManager.error(e);return}this.toastManager.success("投票成功"),await this.fetchVoteDetail()}catch(t){t instanceof Error&&this.toastManager.error(t.message)}finally{this.submitting=!1}}}hasVoted(){return!!(this.voteDetail&&this.voteDetail.userVoteData&&this.voteDetail.userVoteData.length>0)}calculatePercentage(t){return!this.voteDetail||this.voteDetail.voteCount===0?"0":Math.round(t/this.voteDetail.voteCount*100).toString()}isOptionSelected(t){return this.hasVoted()?this.voteDetail.userVoteData.includes(t):this.selectedOptions.has(t)}getVoteTypeText(){if(!this.voteDetail)return"";const t=this.voteDetail.vote.spec.type;return t==="single"?"单选":t==="pk"?"双选PK":t==="multiple"?`多选(最多${this.voteDetail.vote.spec.maxVotes}项)`:t}getTimeLimitText(){if(!this.voteDetail)return"";if(this.voteDetail.vote.spec.hasEnded)return"已结束";if(this.voteDetail.vote.spec.endDate)try{const t=new Date(this.voteDetail.vote.spec.endDate),e=t.getFullYear(),o=String(t.getMonth()+1).padStart(2,"0"),r=String(t.getDate()).padStart(2,"0"),s=String(t.getHours()).padStart(2,"0"),n=String(t.getMinutes()).padStart(2,"0");return`${e}-${o}-${r} ${s}:${n} 结束`}catch{return this.voteDetail.vote.spec.endDate+" 结束"}else return"长期有效"}_renderSubmitAndFooter(t,e,o){return c`
      ${!t&&!e&&this.selectedOptions.size>0?c`
          <div class="flex justify-center mt-4">
            <button
              class="bg-button ${this.submitting||this.selectedOptions.size===0?"opacity-50 cursor-not-allowed":"bg-button-hover"} text-button py-2 px-6 rounded-full shadow transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              ?disabled=${this.submitting||this.selectedOptions.size===0}
              @click=${this.submitVote}
            >
              ${this.submitting?"提交中...":"提交投票"}
            </button>
          </div>
        `:c``}
      <div class="mt-6 pt-4 border-t border-default flex justify-between items-center">
        <div class="flex flex-wrap gap-2 text-sm">
          <span class="bg-tag px-2 py-1 rounded-full text-description">${this.getVoteTypeText()}</span>
          <span class="bg-tag px-2 py-1 rounded-full text-description">${this.getTimeLimitText()}</span>
        </div>
        <div class="flex flex-wrap gap-2 text-sm">
          <span class="bg-tag px-2 py-1 rounded-full text-description">${o}人已参与</span>
          ${t?c`<span class="bg-voted-tag text-voted px-2 py-1 rounded-full">您已完成投票</span>`:e?c`<span class="bg-tag px-2 py-1 rounded-full text-description">投票已结束</span>`:""}
        </div>
      </div>
    `}render(){if(this.loading)return c`<loading-bar></loading-bar>`;if(this.error)return c`<div class="p-4 text-error">${this.error}</div>`;if(!this.voteDetail)return c`<div class="p-4 text-description">No vote data available for ID: ${this.name}</div>`;const{vote:t,voteDataList:e,voteUser:o}=this.voteDetail,{spec:r}=t,s=this.hasVoted(),n=r.hasEnded,l=r.canSeeVoters;if(r.type==="pk"&&r.options.length===2){const a=r.options[0],d=r.options[1],h=e.find(bt=>bt.id===a.id),u=e.find(bt=>bt.id===d.id),f=h?h.voteCount:0,g=u?u.voteCount:0,$=f+g,b=$===0?50:Math.round(f/$*100),x=100-b,q=this.isOptionSelected(a.id),W=this.isOptionSelected(d.id),Y=s&&this.voteDetail.userVoteData.includes(a.id),mt=s&&this.voteDetail.userVoteData.includes(d.id),ve=Y?"bg-voted":q&&!s?"bg-selected":"pk-option1-bg",ye=mt?"bg-voted":W&&!s?"bg-selected":"pk-option2-bg",xe=Y||q&&!s?"text-voted":"pk-progress-text",we=mt||W&&!s?"text-voted":"pk-progress-text",$e=Y?"text-voted font-medium":q&&!s?"text-selected font-medium":"text-description",ke=mt?"text-voted font-medium":W&&!s?"text-selected font-medium":"text-description",L="1.5rem",Bt=b>=98||x>=98,It=Bt?b>=98?"100%":L:b<=2?L:"auto",Ft=Bt?x>=98?"100%":L:x<=2?L:"auto",_e=Math.max(b,b<=2?0:1),Ae=Math.max(x,x<=2?0:1);return c`
        <div class="items-center justify-center">
          <div class="w-full bg-primary rounded-xl p-6 vote-shadow-default">
            <div class="flex items-center gap-2 mb-4">
              <h1 class="text-xl font-medium text-title">${r.title}</h1>
              <div class="flex items-center gap-2 ml-auto">
                 ${l?c`
                    <svg class="w-6 h-6 text-icon cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" 
                        @click=${this.handleOpenVoteUserModal}>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  `:c``}
              </div>
            </div>
            
            <!-- PK Progress Bar with min-width -->
            <div class="mb-2 flex w-full h-10 rounded-full overflow-hidden ${s||n?"cursor-default pointer-events-none":""}">
              <div 
                class="flex items-center justify-center ${ve} ${s||n?"":"cursor-pointer hover:opacity-90"} transition-all duration-500 ease-in-out" 
                style="flex-grow: ${_e}; min-width: ${b<=2?L:"0"}; ${It!=="auto"?`width: ${It};`:""}" 
                @click=${()=>this.handleOptionClick(a.id)}
              >
                <span class="text-sm ${xe} ${b<=5?"opacity-0":""}">${b}%</span>
              </div>
              <div 
                class="flex items-center justify-center ${ye} ${s||n?"":"cursor-pointer hover:opacity-90"} transition-all duration-500 ease-in-out" 
                style="flex-grow: ${Ae}; min-width: ${x<=2?L:"0"}; ${Ft!=="auto"?`width: ${Ft};`:""}" 
                @click=${()=>this.handleOptionClick(d.id)}
              >
                <span class="text-sm ${we} ${x<=5?"opacity-0":""}">${x}%</span>
              </div>
            </div>

            <!-- PK Labels -->
            <div class="flex justify-between px-2 mb-4">
              <span 
                class="text-sm ${$e} ${s||n?"cursor-default pointer-events-none":"cursor-pointer"}" 
                @click=${()=>this.handleOptionClick(a.id)}
              >
                ${a.title}
              </span>
              <span 
                class="text-sm ${ke} ${s||n?"cursor-default pointer-events-none":"cursor-pointer"}" 
                @click=${()=>this.handleOptionClick(d.id)}
              >
                ${d.title}
              </span>
            </div>

            <!-- Submit Button & Footer -->
            ${this._renderSubmitAndFooter(s,n,o)}
            
          </div>
        </div>
      `}return c`
      <div class="items-center justify-center">
        <div class="w-full bg-primary rounded-xl p-6 vote-shadow-default">
          <div class="flex items-center gap-2 mb-4">
            <h1 class="text-xl font-medium text-title">${r.title}</h1>
            <div class="flex items-center gap-2 ml-auto">
              ${l?c`
                  <svg class="w-6 h-6 text-icon cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" 
                      @click=${this.handleOpenVoteUserModal}>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                `:c``}
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            ${r.options.map(a=>{const d=e.find(Y=>Y.id===a.id),h=d?d.voteCount:0,u=this.calculatePercentage(h),f=this.isOptionSelected(a.id),g=this.hasVoted()&&this.voteDetail.userVoteData.includes(a.id),$=g?"bg-voted":f&&!s?"bg-selected":"bg-secondary",b=g?"border-voted":f&&!s?"border-selected":"border-transparent",x=g?"text-voted":f&&!s?"text-selected":"",q=g?"bg-progress-voted":"bg-progress",W=g?c`<span class="text-voted i-carbon-checkmark-filled block w-4 h-4"></span>`:f&&!s?c`<span class="text-selected i-carbon-checkbox-checked block w-4 h-4"></span>`:"";return c`
                <div 
                  class="vote-option relative ${$} border ${b} p-4 rounded-lg ${s||n?"cursor-default pointer-events-none":"cursor-pointer hover:bg-tertiary"} transition-all"
                  @click=${()=>this.handleOptionClick(a.id)}
                >
                  <div class="flex justify-between items-center">
                    <div class="z-10 relative flex items-center gap-2">
                      ${W}
                      <span class="${x} font-medium">${a.title}</span>
                    </div>
                    <span class="text-description font-medium">${u}%</span>
                  </div>
                  <div class="absolute left-0 top-0 h-full ${q} rounded-lg progress-bar" style="width: ${u}%"></div>
                </div>
              `})}
          </div>
            
            <!-- Submit Button & Footer -->
            ${this._renderSubmitAndFooter(s,n,o)}
            
        </div>
      </div>
    `}};gt.styles=[et(yt),M`
      :host {
        display: inline-block;
        width: 100%;
      }
      .vote-option {
        transition: all 0.3s ease;
      }
      .progress-bar {
        transition: width 0.5s ease-in-out;
      }
      .vote-shadow-default {
        box-shadow: var(--vote-shadow, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1));
      }
      /* layer: preflights */
*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}
/* layer: icons */
.i-carbon-checkbox-checked{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M6 26V6h20v20Z'/%3E%3Cpath fill='currentColor' d='m14 21.5l-5-4.96L10.59 15L14 18.35L21.41 11L23 12.58z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}
.i-carbon-checkmark-filled{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z'/%3E%3Cpath fill='none' d='m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}
/* layer: shortcuts */
.container{width:100%;}
.border-default{border-color:var(--vote-border-color,#e5e7eb);}
.border-selected{border-color:var(--vote-border-selected-color,#c628287a);}
.border-voted{border-color:var(--vote-border-voted-color,#60a5fa);}
.bg-button{background-color:var(--vote-background-button-color,#3b82f6);}
.bg-primary{background-color:var(--vote-background-primary-color,#ffffff);}
.bg-progress{background-color:var(--vote-background-progress-color,rgba(229,231,235,0.6));}
.bg-progress-voted{background-color:var(--vote-background-progress-voted-color,rgba(191,219,254,0.4));}
.bg-secondary{background-color:var(--vote-background-secondary-color,#f9fafb);}
.bg-selected{background-color:var(--vote-background-selected-color,#f0444475);}
.bg-tag{background-color:var(--vote-background-tag-color,#f3f4f6);}
.bg-voted{background-color:var(--vote-background-voted-color,#eff6ff);}
.bg-voted-tag{background-color:var(--vote-background-voted-tag-color,#dbeafe);}
.pk-option1-bg{background-color:var(--vote-pk-option1-bg,#3b82f6);}
.pk-option2-bg{background-color:var(--vote-pk-option2-bg,#f97316);}
.bg-button-hover:hover{background-color:var(--vote-background-button-hover-color,#2563eb);}
.hover\\:bg-tertiary:hover{background-color:var(--vote-background-tertiary-color,#f3f4f6);}
.pk-progress-text{color:var(--vote-pk-progress-text-color,#ffffff);}
.text-button{color:var(--vote-text-button-color,#ffffff);}
.text-description{color:var(--vote-text-description-color,#71717a);}
.text-error{color:var(--vote-text-error-color,#ef4444);}
.text-icon{color:var(--vote-icon-color,#71717a);}
.text-selected{color:var(--vote-text-selected-color,#f0444475);}
.text-title{color:var(--vote-text-title-color,#18181b);}
.text-voted{color:var(--vote-text-voted-color,#1d4ed8);}
@media (min-width: 640px){
.container{max-width:640px;}
}
@media (min-width: 768px){
.container{max-width:768px;}
}
@media (min-width: 1024px){
.container{max-width:1024px;}
}
@media (min-width: 1280px){
.container{max-width:1280px;}
}
@media (min-width: 1536px){
.container{max-width:1536px;}
}
/* layer: default */
.pointer-events-none{pointer-events:none;}
.absolute{position:absolute;}
.relative{position:relative;}
.static{position:static;}
.left-0{left:0;}
.top-0{top:0;}
.z-10{z-index:10;}
.grid{display:grid;}
.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr));}
.mb-2{margin-bottom:0.5rem;}
.mb-4{margin-bottom:1rem;}
.ml-auto{margin-left:auto;}
.mt-4{margin-top:1rem;}
.mt-6{margin-top:1.5rem;}
.block{display:block;}
.inline-block{display:inline-block;}
.h-10{height:2.5rem;}
.h-4{height:1rem;}
.h-6{height:1.5rem;}
.h-full{height:100%;}
.w-4{width:1rem;}
.w-6{width:1.5rem;}
.w-full{width:100%;}
.flex{display:flex;}
.flex-grow{flex-grow:1;}
.flex-wrap{flex-wrap:wrap;}
.cursor-default{cursor:default;}
.cursor-pointer{cursor:pointer;}
.cursor-not-allowed{cursor:not-allowed;}
.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed;}
.items-center{align-items:center;}
.justify-center{justify-content:center;}
.justify-between{justify-content:space-between;}
.gap-2{gap:0.5rem;}
.gap-3{gap:0.75rem;}
.overflow-hidden{overflow:hidden;}
.border{border-width:1px;}
.border-t{border-top-width:1px;}
.border-transparent{border-color:transparent;}
.rounded-full{border-radius:9999px;}
.rounded-lg{border-radius:0.5rem;}
.rounded-xl{border-radius:0.75rem;}
.disabled\\:bg-gray-300:disabled{--un-bg-opacity:1;background-color:rgb(209 213 219 / var(--un-bg-opacity));}
.p-4{padding:1rem;}
.p-6{padding:1.5rem;}
.px-2{padding-left:0.5rem;padding-right:0.5rem;}
.px-6{padding-left:1.5rem;padding-right:1.5rem;}
.py-1{padding-top:0.25rem;padding-bottom:0.25rem;}
.py-2{padding-top:0.5rem;padding-bottom:0.5rem;}
.pt-4{padding-top:1rem;}
.text-sm{font-size:0.875rem;line-height:1.25rem;}
.text-xl{font-size:1.25rem;line-height:1.75rem;}
.font-medium{font-weight:500;}
.opacity-0{opacity:0;}
.opacity-50{opacity:0.5;}
.hover\\:opacity-90:hover{opacity:0.9;}
.shadow{--un-shadow:var(--un-shadow-inset) 0 1px 3px 0 var(--un-shadow-color, rgb(0 0 0 / 0.1)),var(--un-shadow-inset) 0 1px 2px -1px var(--un-shadow-color, rgb(0 0 0 / 0.1));box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);}
.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}
.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}
.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}
.duration-500{transition-duration:500ms;}
.ease,
.ease-in-out{transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);}
@media (min-width: 768px){
.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr));}
};
    `];let m=gt;O([D({type:String,attribute:"id"})],m.prototype,"name"),O([w()],m.prototype,"loading"),O([w()],m.prototype,"submitting"),O([w()],m.prototype,"voteDetail"),O([w()],m.prototype,"error"),O([w()],m.prototype,"selectedOptions"),O([w()],m.prototype,"toastManager"),customElements.get("vote-block")||customElements.define("vote-block",m),vt.VoteBlock=m,Object.defineProperty(vt,Symbol.toStringTag,{value:"Module"})})(this.vote=this.vote||{});
