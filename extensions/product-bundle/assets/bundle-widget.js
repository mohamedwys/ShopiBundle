/* ShopiBundle Widget v1.0.0 - https://shopi-bundle.vercel.app */
"use strict";(()=>{var Dd=Object.create;var Ns=Object.defineProperty;var Fd=Object.getOwnPropertyDescriptor;var Ad=Object.getOwnPropertyNames;var Bd=Object.getPrototypeOf,jd=Object.prototype.hasOwnProperty;var ot=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var Ud=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of Ad(t))!jd.call(e,l)&&l!==n&&Ns(e,l,{get:()=>t[l],enumerable:!(r=Fd(t,l))||r.enumerable});return e};var T=(e,t,n)=>(n=e!=null?Dd(Bd(e)):{},Ud(t||!e||!e.__esModule?Ns(n,"default",{value:e,enumerable:!0}):n,e));var Bs=ot(P=>{"use strict";var zn=Symbol.for("react.element"),Vd=Symbol.for("react.portal"),$d=Symbol.for("react.fragment"),Wd=Symbol.for("react.strict_mode"),Hd=Symbol.for("react.profiler"),Qd=Symbol.for("react.provider"),Kd=Symbol.for("react.context"),qd=Symbol.for("react.forward_ref"),Yd=Symbol.for("react.suspense"),Gd=Symbol.for("react.memo"),Xd=Symbol.for("react.lazy"),Ts=Symbol.iterator;function Zd(e){return e===null||typeof e!="object"?null:(e=Ts&&e[Ts]||e["@@iterator"],typeof e=="function"?e:null)}var zs={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Ls=Object.assign,Is={};function en(e,t,n){this.props=e,this.context=t,this.refs=Is,this.updater=n||zs}en.prototype.isReactComponent={};en.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};en.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Ms(){}Ms.prototype=en.prototype;function no(e,t,n){this.props=e,this.context=t,this.refs=Is,this.updater=n||zs}var ro=no.prototype=new Ms;ro.constructor=no;Ls(ro,en.prototype);ro.isPureReactComponent=!0;var Rs=Array.isArray,Os=Object.prototype.hasOwnProperty,lo={current:null},Ds={key:!0,ref:!0,__self:!0,__source:!0};function Fs(e,t,n){var r,l={},o=null,i=null;if(t!=null)for(r in t.ref!==void 0&&(i=t.ref),t.key!==void 0&&(o=""+t.key),t)Os.call(t,r)&&!Ds.hasOwnProperty(r)&&(l[r]=t[r]);var s=arguments.length-2;if(s===1)l.children=n;else if(1<s){for(var u=Array(s),a=0;a<s;a++)u[a]=arguments[a+2];l.children=u}if(e&&e.defaultProps)for(r in s=e.defaultProps,s)l[r]===void 0&&(l[r]=s[r]);return{$$typeof:zn,type:e,key:o,ref:i,props:l,_owner:lo.current}}function Jd(e,t){return{$$typeof:zn,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function oo(e){return typeof e=="object"&&e!==null&&e.$$typeof===zn}function ef(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var bs=/\/+/g;function to(e,t){return typeof e=="object"&&e!==null&&e.key!=null?ef(""+e.key):t.toString(36)}function Pr(e,t,n,r,l){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(o){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case zn:case Vd:i=!0}}if(i)return i=e,l=l(i),e=r===""?"."+to(i,0):r,Rs(l)?(n="",e!=null&&(n=e.replace(bs,"$&/")+"/"),Pr(l,t,n,"",function(a){return a})):l!=null&&(oo(l)&&(l=Jd(l,n+(!l.key||i&&i.key===l.key?"":(""+l.key).replace(bs,"$&/")+"/")+e)),t.push(l)),1;if(i=0,r=r===""?".":r+":",Rs(e))for(var s=0;s<e.length;s++){o=e[s];var u=r+to(o,s);i+=Pr(o,t,n,u,l)}else if(u=Zd(e),typeof u=="function")for(e=u.call(e),s=0;!(o=e.next()).done;)o=o.value,u=r+to(o,s++),i+=Pr(o,t,n,u,l);else if(o==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function Cr(e,t,n){if(e==null)return e;var r=[],l=0;return Pr(e,r,"","",function(o){return t.call(n,o,l++)}),r}function tf(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var fe={current:null},Nr={transition:null},nf={ReactCurrentDispatcher:fe,ReactCurrentBatchConfig:Nr,ReactCurrentOwner:lo};function As(){throw Error("act(...) is not supported in production builds of React.")}P.Children={map:Cr,forEach:function(e,t,n){Cr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Cr(e,function(){t++}),t},toArray:function(e){return Cr(e,function(t){return t})||[]},only:function(e){if(!oo(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};P.Component=en;P.Fragment=$d;P.Profiler=Hd;P.PureComponent=no;P.StrictMode=Wd;P.Suspense=Yd;P.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=nf;P.act=As;P.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Ls({},e.props),l=e.key,o=e.ref,i=e._owner;if(t!=null){if(t.ref!==void 0&&(o=t.ref,i=lo.current),t.key!==void 0&&(l=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(u in t)Os.call(t,u)&&!Ds.hasOwnProperty(u)&&(r[u]=t[u]===void 0&&s!==void 0?s[u]:t[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){s=Array(u);for(var a=0;a<u;a++)s[a]=arguments[a+2];r.children=s}return{$$typeof:zn,type:e.type,key:l,ref:o,props:r,_owner:i}};P.createContext=function(e){return e={$$typeof:Kd,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Qd,_context:e},e.Consumer=e};P.createElement=Fs;P.createFactory=function(e){var t=Fs.bind(null,e);return t.type=e,t};P.createRef=function(){return{current:null}};P.forwardRef=function(e){return{$$typeof:qd,render:e}};P.isValidElement=oo;P.lazy=function(e){return{$$typeof:Xd,_payload:{_status:-1,_result:e},_init:tf}};P.memo=function(e,t){return{$$typeof:Gd,type:e,compare:t===void 0?null:t}};P.startTransition=function(e){var t=Nr.transition;Nr.transition={};try{e()}finally{Nr.transition=t}};P.unstable_act=As;P.useCallback=function(e,t){return fe.current.useCallback(e,t)};P.useContext=function(e){return fe.current.useContext(e)};P.useDebugValue=function(){};P.useDeferredValue=function(e){return fe.current.useDeferredValue(e)};P.useEffect=function(e,t){return fe.current.useEffect(e,t)};P.useId=function(){return fe.current.useId()};P.useImperativeHandle=function(e,t,n){return fe.current.useImperativeHandle(e,t,n)};P.useInsertionEffect=function(e,t){return fe.current.useInsertionEffect(e,t)};P.useLayoutEffect=function(e,t){return fe.current.useLayoutEffect(e,t)};P.useMemo=function(e,t){return fe.current.useMemo(e,t)};P.useReducer=function(e,t,n){return fe.current.useReducer(e,t,n)};P.useRef=function(e){return fe.current.useRef(e)};P.useState=function(e){return fe.current.useState(e)};P.useSyncExternalStore=function(e,t,n){return fe.current.useSyncExternalStore(e,t,n)};P.useTransition=function(){return fe.current.useTransition()};P.version="18.3.1"});var ze=ot((Tm,js)=>{"use strict";js.exports=Bs()});var Gs=ot(M=>{"use strict";function ao(e,t){var n=e.length;e.push(t);e:for(;0<n;){var r=n-1>>>1,l=e[r];if(0<Tr(l,t))e[r]=t,e[n]=l,n=r;else break e}}function je(e){return e.length===0?null:e[0]}function br(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var r=0,l=e.length,o=l>>>1;r<o;){var i=2*(r+1)-1,s=e[i],u=i+1,a=e[u];if(0>Tr(s,n))u<l&&0>Tr(a,s)?(e[r]=a,e[u]=n,r=u):(e[r]=s,e[i]=n,r=i);else if(u<l&&0>Tr(a,n))e[r]=a,e[u]=n,r=u;else break e}}return t}function Tr(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}typeof performance=="object"&&typeof performance.now=="function"?(Us=performance,M.unstable_now=function(){return Us.now()}):(io=Date,Vs=io.now(),M.unstable_now=function(){return io.now()-Vs});var Us,io,Vs,Ge=[],ht=[],rf=1,Le=null,ie=3,zr=!1,At=!1,In=!1,Hs=typeof setTimeout=="function"?setTimeout:null,Qs=typeof clearTimeout=="function"?clearTimeout:null,$s=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function co(e){for(var t=je(ht);t!==null;){if(t.callback===null)br(ht);else if(t.startTime<=e)br(ht),t.sortIndex=t.expirationTime,ao(Ge,t);else break;t=je(ht)}}function fo(e){if(In=!1,co(e),!At)if(je(Ge)!==null)At=!0,mo(po);else{var t=je(ht);t!==null&&go(fo,t.startTime-e)}}function po(e,t){At=!1,In&&(In=!1,Qs(Mn),Mn=-1),zr=!0;var n=ie;try{for(co(t),Le=je(Ge);Le!==null&&(!(Le.expirationTime>t)||e&&!Ys());){var r=Le.callback;if(typeof r=="function"){Le.callback=null,ie=Le.priorityLevel;var l=r(Le.expirationTime<=t);t=M.unstable_now(),typeof l=="function"?Le.callback=l:Le===je(Ge)&&br(Ge),co(t)}else br(Ge);Le=je(Ge)}if(Le!==null)var o=!0;else{var i=je(ht);i!==null&&go(fo,i.startTime-t),o=!1}return o}finally{Le=null,ie=n,zr=!1}}var Lr=!1,Rr=null,Mn=-1,Ks=5,qs=-1;function Ys(){return!(M.unstable_now()-qs<Ks)}function so(){if(Rr!==null){var e=M.unstable_now();qs=e;var t=!0;try{t=Rr(!0,e)}finally{t?Ln():(Lr=!1,Rr=null)}}else Lr=!1}var Ln;typeof $s=="function"?Ln=function(){$s(so)}:typeof MessageChannel<"u"?(uo=new MessageChannel,Ws=uo.port2,uo.port1.onmessage=so,Ln=function(){Ws.postMessage(null)}):Ln=function(){Hs(so,0)};var uo,Ws;function mo(e){Rr=e,Lr||(Lr=!0,Ln())}function go(e,t){Mn=Hs(function(){e(M.unstable_now())},t)}M.unstable_IdlePriority=5;M.unstable_ImmediatePriority=1;M.unstable_LowPriority=4;M.unstable_NormalPriority=3;M.unstable_Profiling=null;M.unstable_UserBlockingPriority=2;M.unstable_cancelCallback=function(e){e.callback=null};M.unstable_continueExecution=function(){At||zr||(At=!0,mo(po))};M.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Ks=0<e?Math.floor(1e3/e):5};M.unstable_getCurrentPriorityLevel=function(){return ie};M.unstable_getFirstCallbackNode=function(){return je(Ge)};M.unstable_next=function(e){switch(ie){case 1:case 2:case 3:var t=3;break;default:t=ie}var n=ie;ie=t;try{return e()}finally{ie=n}};M.unstable_pauseExecution=function(){};M.unstable_requestPaint=function(){};M.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=ie;ie=e;try{return t()}finally{ie=n}};M.unstable_scheduleCallback=function(e,t,n){var r=M.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?r+n:r):n=r,e){case 1:var l=-1;break;case 2:l=250;break;case 5:l=1073741823;break;case 4:l=1e4;break;default:l=5e3}return l=n+l,e={id:rf++,callback:t,priorityLevel:e,startTime:n,expirationTime:l,sortIndex:-1},n>r?(e.sortIndex=n,ao(ht,e),je(Ge)===null&&e===je(ht)&&(In?(Qs(Mn),Mn=-1):In=!0,go(fo,n-r))):(e.sortIndex=l,ao(Ge,e),At||zr||(At=!0,mo(po))),e};M.unstable_shouldYield=Ys;M.unstable_wrapCallback=function(e){var t=ie;return function(){var n=ie;ie=t;try{return e.apply(this,arguments)}finally{ie=n}}}});var Zs=ot((bm,Xs)=>{"use strict";Xs.exports=Gs()});var nd=ot(Te=>{"use strict";var lf=ze(),Pe=Zs();function v(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var oa=new Set,nr={};function Xt(e,t){Sn(e,t),Sn(e+"Capture",t)}function Sn(e,t){for(nr[e]=t,e=0;e<t.length;e++)oa.add(t[e])}var dt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ao=Object.prototype.hasOwnProperty,of=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Js={},eu={};function sf(e){return Ao.call(eu,e)?!0:Ao.call(Js,e)?!1:of.test(e)?eu[e]=!0:(Js[e]=!0,!1)}function uf(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function af(e,t,n,r){if(t===null||typeof t>"u"||uf(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ge(e,t,n,r,l,o,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=o,this.removeEmptyString=i}var oe={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){oe[e]=new ge(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];oe[t]=new ge(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){oe[e]=new ge(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){oe[e]=new ge(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){oe[e]=new ge(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){oe[e]=new ge(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){oe[e]=new ge(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){oe[e]=new ge(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){oe[e]=new ge(e,5,!1,e.toLowerCase(),null,!1,!1)});var bi=/[\-:]([a-z])/g;function zi(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(bi,zi);oe[t]=new ge(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(bi,zi);oe[t]=new ge(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(bi,zi);oe[t]=new ge(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){oe[e]=new ge(e,1,!1,e.toLowerCase(),null,!1,!1)});oe.xlinkHref=new ge("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){oe[e]=new ge(e,1,!1,e.toLowerCase(),null,!0,!0)});function Li(e,t,n,r){var l=oe.hasOwnProperty(t)?oe[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(af(t,n,l,r)&&(n=null),r||l===null?sf(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var gt=lf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ir=Symbol.for("react.element"),rn=Symbol.for("react.portal"),ln=Symbol.for("react.fragment"),Ii=Symbol.for("react.strict_mode"),Bo=Symbol.for("react.profiler"),ia=Symbol.for("react.provider"),sa=Symbol.for("react.context"),Mi=Symbol.for("react.forward_ref"),jo=Symbol.for("react.suspense"),Uo=Symbol.for("react.suspense_list"),Oi=Symbol.for("react.memo"),yt=Symbol.for("react.lazy");Symbol.for("react.scope");Symbol.for("react.debug_trace_mode");var ua=Symbol.for("react.offscreen");Symbol.for("react.legacy_hidden");Symbol.for("react.cache");Symbol.for("react.tracing_marker");var tu=Symbol.iterator;function On(e){return e===null||typeof e!="object"?null:(e=tu&&e[tu]||e["@@iterator"],typeof e=="function"?e:null)}var $=Object.assign,ho;function $n(e){if(ho===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);ho=t&&t[1]||""}return`
`+ho+e}var vo=!1;function yo(e,t){if(!e||vo)return"";vo=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(a){var r=a}Reflect.construct(e,[],t)}else{try{t.call()}catch(a){r=a}e.call(t.prototype)}else{try{throw Error()}catch(a){r=a}e()}}catch(a){if(a&&r&&typeof a.stack=="string"){for(var l=a.stack.split(`
`),o=r.stack.split(`
`),i=l.length-1,s=o.length-1;1<=i&&0<=s&&l[i]!==o[s];)s--;for(;1<=i&&0<=s;i--,s--)if(l[i]!==o[s]){if(i!==1||s!==1)do if(i--,s--,0>s||l[i]!==o[s]){var u=`
`+l[i].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=i&&0<=s);break}}}finally{vo=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?$n(e):""}function cf(e){switch(e.tag){case 5:return $n(e.type);case 16:return $n("Lazy");case 13:return $n("Suspense");case 19:return $n("SuspenseList");case 0:case 2:case 15:return e=yo(e.type,!1),e;case 11:return e=yo(e.type.render,!1),e;case 1:return e=yo(e.type,!0),e;default:return""}}function Vo(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ln:return"Fragment";case rn:return"Portal";case Bo:return"Profiler";case Ii:return"StrictMode";case jo:return"Suspense";case Uo:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case sa:return(e.displayName||"Context")+".Consumer";case ia:return(e._context.displayName||"Context")+".Provider";case Mi:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Oi:return t=e.displayName||null,t!==null?t:Vo(e.type)||"Memo";case yt:t=e._payload,e=e._init;try{return Vo(e(t))}catch{}}return null}function df(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Vo(t);case 8:return t===Ii?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Lt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function aa(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function ff(e){var t=aa(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,o=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(i){r=""+i,o.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Mr(e){e._valueTracker||(e._valueTracker=ff(e))}function ca(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=aa(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function ul(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function $o(e,t){var n=t.checked;return $({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function nu(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=Lt(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function da(e,t){t=t.checked,t!=null&&Li(e,"checked",t,!1)}function Wo(e,t){da(e,t);var n=Lt(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Ho(e,t.type,n):t.hasOwnProperty("defaultValue")&&Ho(e,t.type,Lt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function ru(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Ho(e,t,n){(t!=="number"||ul(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Wn=Array.isArray;function hn(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Lt(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function Qo(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(v(91));return $({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function lu(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(v(92));if(Wn(n)){if(1<n.length)throw Error(v(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Lt(n)}}function fa(e,t){var n=Lt(t.value),r=Lt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function ou(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function pa(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ko(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?pa(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Or,ma=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Or=Or||document.createElement("div"),Or.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Or.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function rr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Kn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},pf=["Webkit","ms","Moz","O"];Object.keys(Kn).forEach(function(e){pf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Kn[t]=Kn[e]})});function ga(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Kn.hasOwnProperty(e)&&Kn[e]?(""+t).trim():t+"px"}function ha(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=ga(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var mf=$({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function qo(e,t){if(t){if(mf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(v(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(v(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(v(61))}if(t.style!=null&&typeof t.style!="object")throw Error(v(62))}}function Yo(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Go=null;function Di(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Xo=null,vn=null,yn=null;function iu(e){if(e=kr(e)){if(typeof Xo!="function")throw Error(v(280));var t=e.stateNode;t&&(t=Dl(t),Xo(e.stateNode,e.type,t))}}function va(e){vn?yn?yn.push(e):yn=[e]:vn=e}function ya(){if(vn){var e=vn,t=yn;if(yn=vn=null,iu(e),t)for(e=0;e<t.length;e++)iu(t[e])}}function wa(e,t){return e(t)}function _a(){}var wo=!1;function ka(e,t,n){if(wo)return e(t,n);wo=!0;try{return wa(e,t,n)}finally{wo=!1,(vn!==null||yn!==null)&&(_a(),ya())}}function lr(e,t){var n=e.stateNode;if(n===null)return null;var r=Dl(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(v(231,t,typeof n));return n}var Zo=!1;if(dt)try{tn={},Object.defineProperty(tn,"passive",{get:function(){Zo=!0}}),window.addEventListener("test",tn,tn),window.removeEventListener("test",tn,tn)}catch{Zo=!1}var tn;function gf(e,t,n,r,l,o,i,s,u){var a=Array.prototype.slice.call(arguments,3);try{t.apply(n,a)}catch(d){this.onError(d)}}var qn=!1,al=null,cl=!1,Jo=null,hf={onError:function(e){qn=!0,al=e}};function vf(e,t,n,r,l,o,i,s,u){qn=!1,al=null,gf.apply(hf,arguments)}function yf(e,t,n,r,l,o,i,s,u){if(vf.apply(this,arguments),qn){if(qn){var a=al;qn=!1,al=null}else throw Error(v(198));cl||(cl=!0,Jo=a)}}function Zt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Sa(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function su(e){if(Zt(e)!==e)throw Error(v(188))}function wf(e){var t=e.alternate;if(!t){if(t=Zt(e),t===null)throw Error(v(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var o=l.alternate;if(o===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===o.child){for(o=l.child;o;){if(o===n)return su(l),e;if(o===r)return su(l),t;o=o.sibling}throw Error(v(188))}if(n.return!==r.return)n=l,r=o;else{for(var i=!1,s=l.child;s;){if(s===n){i=!0,n=l,r=o;break}if(s===r){i=!0,r=l,n=o;break}s=s.sibling}if(!i){for(s=o.child;s;){if(s===n){i=!0,n=o,r=l;break}if(s===r){i=!0,r=o,n=l;break}s=s.sibling}if(!i)throw Error(v(189))}}if(n.alternate!==r)throw Error(v(190))}if(n.tag!==3)throw Error(v(188));return n.stateNode.current===n?e:t}function xa(e){return e=wf(e),e!==null?Ea(e):null}function Ea(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Ea(e);if(t!==null)return t;e=e.sibling}return null}var Ca=Pe.unstable_scheduleCallback,uu=Pe.unstable_cancelCallback,_f=Pe.unstable_shouldYield,kf=Pe.unstable_requestPaint,Q=Pe.unstable_now,Sf=Pe.unstable_getCurrentPriorityLevel,Fi=Pe.unstable_ImmediatePriority,Pa=Pe.unstable_UserBlockingPriority,dl=Pe.unstable_NormalPriority,xf=Pe.unstable_LowPriority,Na=Pe.unstable_IdlePriority,Ll=null,et=null;function Ef(e){if(et&&typeof et.onCommitFiberRoot=="function")try{et.onCommitFiberRoot(Ll,e,void 0,(e.current.flags&128)===128)}catch{}}var He=Math.clz32?Math.clz32:Nf,Cf=Math.log,Pf=Math.LN2;function Nf(e){return e>>>=0,e===0?32:31-(Cf(e)/Pf|0)|0}var Dr=64,Fr=4194304;function Hn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function fl(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,o=e.pingedLanes,i=n&268435455;if(i!==0){var s=i&~l;s!==0?r=Hn(s):(o&=i,o!==0&&(r=Hn(o)))}else i=n&~l,i!==0?r=Hn(i):o!==0&&(r=Hn(o));if(r===0)return 0;if(t!==0&&t!==r&&!(t&l)&&(l=r&-r,o=t&-t,l>=o||l===16&&(o&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-He(t),l=1<<n,r|=e[n],t&=~l;return r}function Tf(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Rf(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,o=e.pendingLanes;0<o;){var i=31-He(o),s=1<<i,u=l[i];u===-1?(!(s&n)||s&r)&&(l[i]=Tf(s,t)):u<=t&&(e.expiredLanes|=s),o&=~s}}function ei(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Ta(){var e=Dr;return Dr<<=1,!(Dr&4194240)&&(Dr=64),e}function _o(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function wr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-He(t),e[t]=n}function bf(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-He(n),o=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~o}}function Ai(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-He(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var L=0;function Ra(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var ba,Bi,za,La,Ia,ti=!1,Ar=[],Et=null,Ct=null,Pt=null,or=new Map,ir=new Map,_t=[],zf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function au(e,t){switch(e){case"focusin":case"focusout":Et=null;break;case"dragenter":case"dragleave":Ct=null;break;case"mouseover":case"mouseout":Pt=null;break;case"pointerover":case"pointerout":or.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":ir.delete(t.pointerId)}}function Dn(e,t,n,r,l,o){return e===null||e.nativeEvent!==o?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:o,targetContainers:[l]},t!==null&&(t=kr(t),t!==null&&Bi(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function Lf(e,t,n,r,l){switch(t){case"focusin":return Et=Dn(Et,e,t,n,r,l),!0;case"dragenter":return Ct=Dn(Ct,e,t,n,r,l),!0;case"mouseover":return Pt=Dn(Pt,e,t,n,r,l),!0;case"pointerover":var o=l.pointerId;return or.set(o,Dn(or.get(o)||null,e,t,n,r,l)),!0;case"gotpointercapture":return o=l.pointerId,ir.set(o,Dn(ir.get(o)||null,e,t,n,r,l)),!0}return!1}function Ma(e){var t=Ut(e.target);if(t!==null){var n=Zt(t);if(n!==null){if(t=n.tag,t===13){if(t=Sa(n),t!==null){e.blockedOn=t,Ia(e.priority,function(){za(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Zr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=ni(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Go=r,n.target.dispatchEvent(r),Go=null}else return t=kr(n),t!==null&&Bi(t),e.blockedOn=n,!1;t.shift()}return!0}function cu(e,t,n){Zr(e)&&n.delete(t)}function If(){ti=!1,Et!==null&&Zr(Et)&&(Et=null),Ct!==null&&Zr(Ct)&&(Ct=null),Pt!==null&&Zr(Pt)&&(Pt=null),or.forEach(cu),ir.forEach(cu)}function Fn(e,t){e.blockedOn===t&&(e.blockedOn=null,ti||(ti=!0,Pe.unstable_scheduleCallback(Pe.unstable_NormalPriority,If)))}function sr(e){function t(l){return Fn(l,e)}if(0<Ar.length){Fn(Ar[0],e);for(var n=1;n<Ar.length;n++){var r=Ar[n];r.blockedOn===e&&(r.blockedOn=null)}}for(Et!==null&&Fn(Et,e),Ct!==null&&Fn(Ct,e),Pt!==null&&Fn(Pt,e),or.forEach(t),ir.forEach(t),n=0;n<_t.length;n++)r=_t[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<_t.length&&(n=_t[0],n.blockedOn===null);)Ma(n),n.blockedOn===null&&_t.shift()}var wn=gt.ReactCurrentBatchConfig,pl=!0;function Mf(e,t,n,r){var l=L,o=wn.transition;wn.transition=null;try{L=1,ji(e,t,n,r)}finally{L=l,wn.transition=o}}function Of(e,t,n,r){var l=L,o=wn.transition;wn.transition=null;try{L=4,ji(e,t,n,r)}finally{L=l,wn.transition=o}}function ji(e,t,n,r){if(pl){var l=ni(e,t,n,r);if(l===null)No(e,t,r,ml,n),au(e,r);else if(Lf(l,e,t,n,r))r.stopPropagation();else if(au(e,r),t&4&&-1<zf.indexOf(e)){for(;l!==null;){var o=kr(l);if(o!==null&&ba(o),o=ni(e,t,n,r),o===null&&No(e,t,r,ml,n),o===l)break;l=o}l!==null&&r.stopPropagation()}else No(e,t,r,null,n)}}var ml=null;function ni(e,t,n,r){if(ml=null,e=Di(r),e=Ut(e),e!==null)if(t=Zt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Sa(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return ml=e,null}function Oa(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Sf()){case Fi:return 1;case Pa:return 4;case dl:case xf:return 16;case Na:return 536870912;default:return 16}default:return 16}}var St=null,Ui=null,Jr=null;function Da(){if(Jr)return Jr;var e,t=Ui,n=t.length,r,l="value"in St?St.value:St.textContent,o=l.length;for(e=0;e<n&&t[e]===l[e];e++);var i=n-e;for(r=1;r<=i&&t[n-r]===l[o-r];r++);return Jr=l.slice(e,1<r?1-r:void 0)}function el(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Br(){return!0}function du(){return!1}function Ne(e){function t(n,r,l,o,i){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=o,this.target=i,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(n=e[s],this[s]=n?n(o):o[s]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?Br:du,this.isPropagationStopped=du,this}return $(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Br)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Br)},persist:function(){},isPersistent:Br}),t}var Rn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Vi=Ne(Rn),_r=$({},Rn,{view:0,detail:0}),Df=Ne(_r),ko,So,An,Il=$({},_r,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:$i,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==An&&(An&&e.type==="mousemove"?(ko=e.screenX-An.screenX,So=e.screenY-An.screenY):So=ko=0,An=e),ko)},movementY:function(e){return"movementY"in e?e.movementY:So}}),fu=Ne(Il),Ff=$({},Il,{dataTransfer:0}),Af=Ne(Ff),Bf=$({},_r,{relatedTarget:0}),xo=Ne(Bf),jf=$({},Rn,{animationName:0,elapsedTime:0,pseudoElement:0}),Uf=Ne(jf),Vf=$({},Rn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),$f=Ne(Vf),Wf=$({},Rn,{data:0}),pu=Ne(Wf),Hf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Qf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Kf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function qf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Kf[e])?!!t[e]:!1}function $i(){return qf}var Yf=$({},_r,{key:function(e){if(e.key){var t=Hf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=el(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Qf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:$i,charCode:function(e){return e.type==="keypress"?el(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?el(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Gf=Ne(Yf),Xf=$({},Il,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),mu=Ne(Xf),Zf=$({},_r,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:$i}),Jf=Ne(Zf),ep=$({},Rn,{propertyName:0,elapsedTime:0,pseudoElement:0}),tp=Ne(ep),np=$({},Il,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),rp=Ne(np),lp=[9,13,27,32],Wi=dt&&"CompositionEvent"in window,Yn=null;dt&&"documentMode"in document&&(Yn=document.documentMode);var op=dt&&"TextEvent"in window&&!Yn,Fa=dt&&(!Wi||Yn&&8<Yn&&11>=Yn),gu=" ",hu=!1;function Aa(e,t){switch(e){case"keyup":return lp.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ba(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var on=!1;function ip(e,t){switch(e){case"compositionend":return Ba(t);case"keypress":return t.which!==32?null:(hu=!0,gu);case"textInput":return e=t.data,e===gu&&hu?null:e;default:return null}}function sp(e,t){if(on)return e==="compositionend"||!Wi&&Aa(e,t)?(e=Da(),Jr=Ui=St=null,on=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Fa&&t.locale!=="ko"?null:t.data;default:return null}}var up={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function vu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!up[e.type]:t==="textarea"}function ja(e,t,n,r){va(r),t=gl(t,"onChange"),0<t.length&&(n=new Vi("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Gn=null,ur=null;function ap(e){Xa(e,0)}function Ml(e){var t=an(e);if(ca(t))return e}function cp(e,t){if(e==="change")return t}var Ua=!1;dt&&(dt?(Ur="oninput"in document,Ur||(Eo=document.createElement("div"),Eo.setAttribute("oninput","return;"),Ur=typeof Eo.oninput=="function"),jr=Ur):jr=!1,Ua=jr&&(!document.documentMode||9<document.documentMode));var jr,Ur,Eo;function yu(){Gn&&(Gn.detachEvent("onpropertychange",Va),ur=Gn=null)}function Va(e){if(e.propertyName==="value"&&Ml(ur)){var t=[];ja(t,ur,e,Di(e)),ka(ap,t)}}function dp(e,t,n){e==="focusin"?(yu(),Gn=t,ur=n,Gn.attachEvent("onpropertychange",Va)):e==="focusout"&&yu()}function fp(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ml(ur)}function pp(e,t){if(e==="click")return Ml(t)}function mp(e,t){if(e==="input"||e==="change")return Ml(t)}function gp(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ke=typeof Object.is=="function"?Object.is:gp;function ar(e,t){if(Ke(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!Ao.call(t,l)||!Ke(e[l],t[l]))return!1}return!0}function wu(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function _u(e,t){var n=wu(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=wu(n)}}function $a(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?$a(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Wa(){for(var e=window,t=ul();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=ul(e.document)}return t}function Hi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function hp(e){var t=Wa(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&$a(n.ownerDocument.documentElement,n)){if(r!==null&&Hi(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,o=Math.min(r.start,l);r=r.end===void 0?o:Math.min(r.end,l),!e.extend&&o>r&&(l=r,r=o,o=l),l=_u(n,o);var i=_u(n,r);l&&i&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),o>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var vp=dt&&"documentMode"in document&&11>=document.documentMode,sn=null,ri=null,Xn=null,li=!1;function ku(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;li||sn==null||sn!==ul(r)||(r=sn,"selectionStart"in r&&Hi(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Xn&&ar(Xn,r)||(Xn=r,r=gl(ri,"onSelect"),0<r.length&&(t=new Vi("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=sn)))}function Vr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var un={animationend:Vr("Animation","AnimationEnd"),animationiteration:Vr("Animation","AnimationIteration"),animationstart:Vr("Animation","AnimationStart"),transitionend:Vr("Transition","TransitionEnd")},Co={},Ha={};dt&&(Ha=document.createElement("div").style,"AnimationEvent"in window||(delete un.animationend.animation,delete un.animationiteration.animation,delete un.animationstart.animation),"TransitionEvent"in window||delete un.transitionend.transition);function Ol(e){if(Co[e])return Co[e];if(!un[e])return e;var t=un[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Ha)return Co[e]=t[n];return e}var Qa=Ol("animationend"),Ka=Ol("animationiteration"),qa=Ol("animationstart"),Ya=Ol("transitionend"),Ga=new Map,Su="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Mt(e,t){Ga.set(e,t),Xt(t,[e])}for($r=0;$r<Su.length;$r++)Wr=Su[$r],xu=Wr.toLowerCase(),Eu=Wr[0].toUpperCase()+Wr.slice(1),Mt(xu,"on"+Eu);var Wr,xu,Eu,$r;Mt(Qa,"onAnimationEnd");Mt(Ka,"onAnimationIteration");Mt(qa,"onAnimationStart");Mt("dblclick","onDoubleClick");Mt("focusin","onFocus");Mt("focusout","onBlur");Mt(Ya,"onTransitionEnd");Sn("onMouseEnter",["mouseout","mouseover"]);Sn("onMouseLeave",["mouseout","mouseover"]);Sn("onPointerEnter",["pointerout","pointerover"]);Sn("onPointerLeave",["pointerout","pointerover"]);Xt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Xt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Xt("onBeforeInput",["compositionend","keypress","textInput","paste"]);Xt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Xt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Xt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Qn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),yp=new Set("cancel close invalid load scroll toggle".split(" ").concat(Qn));function Cu(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,yf(r,t,void 0,e),e.currentTarget=null}function Xa(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var o=void 0;if(t)for(var i=r.length-1;0<=i;i--){var s=r[i],u=s.instance,a=s.currentTarget;if(s=s.listener,u!==o&&l.isPropagationStopped())break e;Cu(l,s,a),o=u}else for(i=0;i<r.length;i++){if(s=r[i],u=s.instance,a=s.currentTarget,s=s.listener,u!==o&&l.isPropagationStopped())break e;Cu(l,s,a),o=u}}}if(cl)throw e=Jo,cl=!1,Jo=null,e}function F(e,t){var n=t[ai];n===void 0&&(n=t[ai]=new Set);var r=e+"__bubble";n.has(r)||(Za(t,e,2,!1),n.add(r))}function Po(e,t,n){var r=0;t&&(r|=4),Za(n,e,r,t)}var Hr="_reactListening"+Math.random().toString(36).slice(2);function cr(e){if(!e[Hr]){e[Hr]=!0,oa.forEach(function(n){n!=="selectionchange"&&(yp.has(n)||Po(n,!1,e),Po(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Hr]||(t[Hr]=!0,Po("selectionchange",!1,t))}}function Za(e,t,n,r){switch(Oa(t)){case 1:var l=Mf;break;case 4:l=Of;break;default:l=ji}n=l.bind(null,t,n,e),l=void 0,!Zo||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function No(e,t,n,r,l){var o=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var s=r.stateNode.containerInfo;if(s===l||s.nodeType===8&&s.parentNode===l)break;if(i===4)for(i=r.return;i!==null;){var u=i.tag;if((u===3||u===4)&&(u=i.stateNode.containerInfo,u===l||u.nodeType===8&&u.parentNode===l))return;i=i.return}for(;s!==null;){if(i=Ut(s),i===null)return;if(u=i.tag,u===5||u===6){r=o=i;continue e}s=s.parentNode}}r=r.return}ka(function(){var a=o,d=Di(n),m=[];e:{var f=Ga.get(e);if(f!==void 0){var h=Vi,w=e;switch(e){case"keypress":if(el(n)===0)break e;case"keydown":case"keyup":h=Gf;break;case"focusin":w="focus",h=xo;break;case"focusout":w="blur",h=xo;break;case"beforeblur":case"afterblur":h=xo;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":h=fu;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":h=Af;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":h=Jf;break;case Qa:case Ka:case qa:h=Uf;break;case Ya:h=tp;break;case"scroll":h=Df;break;case"wheel":h=rp;break;case"copy":case"cut":case"paste":h=$f;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":h=mu}var k=(t&4)!==0,z=!k&&e==="scroll",p=k?f!==null?f+"Capture":null:f;k=[];for(var c=a,g;c!==null;){g=c;var y=g.stateNode;if(g.tag===5&&y!==null&&(g=y,p!==null&&(y=lr(c,p),y!=null&&k.push(dr(c,y,g)))),z)break;c=c.return}0<k.length&&(f=new h(f,w,null,n,d),m.push({event:f,listeners:k}))}}if(!(t&7)){e:{if(f=e==="mouseover"||e==="pointerover",h=e==="mouseout"||e==="pointerout",f&&n!==Go&&(w=n.relatedTarget||n.fromElement)&&(Ut(w)||w[ft]))break e;if((h||f)&&(f=d.window===d?d:(f=d.ownerDocument)?f.defaultView||f.parentWindow:window,h?(w=n.relatedTarget||n.toElement,h=a,w=w?Ut(w):null,w!==null&&(z=Zt(w),w!==z||w.tag!==5&&w.tag!==6)&&(w=null)):(h=null,w=a),h!==w)){if(k=fu,y="onMouseLeave",p="onMouseEnter",c="mouse",(e==="pointerout"||e==="pointerover")&&(k=mu,y="onPointerLeave",p="onPointerEnter",c="pointer"),z=h==null?f:an(h),g=w==null?f:an(w),f=new k(y,c+"leave",h,n,d),f.target=z,f.relatedTarget=g,y=null,Ut(d)===a&&(k=new k(p,c+"enter",w,n,d),k.target=g,k.relatedTarget=z,y=k),z=y,h&&w)t:{for(k=h,p=w,c=0,g=k;g;g=nn(g))c++;for(g=0,y=p;y;y=nn(y))g++;for(;0<c-g;)k=nn(k),c--;for(;0<g-c;)p=nn(p),g--;for(;c--;){if(k===p||p!==null&&k===p.alternate)break t;k=nn(k),p=nn(p)}k=null}else k=null;h!==null&&Pu(m,f,h,k,!1),w!==null&&z!==null&&Pu(m,z,w,k,!0)}}e:{if(f=a?an(a):window,h=f.nodeName&&f.nodeName.toLowerCase(),h==="select"||h==="input"&&f.type==="file")var _=cp;else if(vu(f))if(Ua)_=mp;else{_=fp;var E=dp}else(h=f.nodeName)&&h.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(_=pp);if(_&&(_=_(e,a))){ja(m,_,n,d);break e}E&&E(e,f,a),e==="focusout"&&(E=f._wrapperState)&&E.controlled&&f.type==="number"&&Ho(f,"number",f.value)}switch(E=a?an(a):window,e){case"focusin":(vu(E)||E.contentEditable==="true")&&(sn=E,ri=a,Xn=null);break;case"focusout":Xn=ri=sn=null;break;case"mousedown":li=!0;break;case"contextmenu":case"mouseup":case"dragend":li=!1,ku(m,n,d);break;case"selectionchange":if(vp)break;case"keydown":case"keyup":ku(m,n,d)}var x;if(Wi)e:{switch(e){case"compositionstart":var C="onCompositionStart";break e;case"compositionend":C="onCompositionEnd";break e;case"compositionupdate":C="onCompositionUpdate";break e}C=void 0}else on?Aa(e,n)&&(C="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(C="onCompositionStart");C&&(Fa&&n.locale!=="ko"&&(on||C!=="onCompositionStart"?C==="onCompositionEnd"&&on&&(x=Da()):(St=d,Ui="value"in St?St.value:St.textContent,on=!0)),E=gl(a,C),0<E.length&&(C=new pu(C,e,null,n,d),m.push({event:C,listeners:E}),x?C.data=x:(x=Ba(n),x!==null&&(C.data=x)))),(x=op?ip(e,n):sp(e,n))&&(a=gl(a,"onBeforeInput"),0<a.length&&(d=new pu("onBeforeInput","beforeinput",null,n,d),m.push({event:d,listeners:a}),d.data=x))}Xa(m,t)})}function dr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function gl(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,o=l.stateNode;l.tag===5&&o!==null&&(l=o,o=lr(e,n),o!=null&&r.unshift(dr(e,o,l)),o=lr(e,t),o!=null&&r.push(dr(e,o,l))),e=e.return}return r}function nn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Pu(e,t,n,r,l){for(var o=t._reactName,i=[];n!==null&&n!==r;){var s=n,u=s.alternate,a=s.stateNode;if(u!==null&&u===r)break;s.tag===5&&a!==null&&(s=a,l?(u=lr(n,o),u!=null&&i.unshift(dr(n,u,s))):l||(u=lr(n,o),u!=null&&i.push(dr(n,u,s)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var wp=/\r\n?/g,_p=/\u0000|\uFFFD/g;function Nu(e){return(typeof e=="string"?e:""+e).replace(wp,`
`).replace(_p,"")}function Qr(e,t,n){if(t=Nu(t),Nu(e)!==t&&n)throw Error(v(425))}function hl(){}var oi=null,ii=null;function si(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ui=typeof setTimeout=="function"?setTimeout:void 0,kp=typeof clearTimeout=="function"?clearTimeout:void 0,Tu=typeof Promise=="function"?Promise:void 0,Sp=typeof queueMicrotask=="function"?queueMicrotask:typeof Tu<"u"?function(e){return Tu.resolve(null).then(e).catch(xp)}:ui;function xp(e){setTimeout(function(){throw e})}function To(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),sr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);sr(t)}function Nt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Ru(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var bn=Math.random().toString(36).slice(2),Je="__reactFiber$"+bn,fr="__reactProps$"+bn,ft="__reactContainer$"+bn,ai="__reactEvents$"+bn,Ep="__reactListeners$"+bn,Cp="__reactHandles$"+bn;function Ut(e){var t=e[Je];if(t)return t;for(var n=e.parentNode;n;){if(t=n[ft]||n[Je]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Ru(e);e!==null;){if(n=e[Je])return n;e=Ru(e)}return t}e=n,n=e.parentNode}return null}function kr(e){return e=e[Je]||e[ft],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function an(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(v(33))}function Dl(e){return e[fr]||null}var ci=[],cn=-1;function Ot(e){return{current:e}}function A(e){0>cn||(e.current=ci[cn],ci[cn]=null,cn--)}function O(e,t){cn++,ci[cn]=e.current,e.current=t}var It={},ce=Ot(It),ye=Ot(!1),Qt=It;function xn(e,t){var n=e.type.contextTypes;if(!n)return It;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},o;for(o in n)l[o]=t[o];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function we(e){return e=e.childContextTypes,e!=null}function vl(){A(ye),A(ce)}function bu(e,t,n){if(ce.current!==It)throw Error(v(168));O(ce,t),O(ye,n)}function Ja(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(v(108,df(e)||"Unknown",l));return $({},n,r)}function yl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||It,Qt=ce.current,O(ce,e),O(ye,ye.current),!0}function zu(e,t,n){var r=e.stateNode;if(!r)throw Error(v(169));n?(e=Ja(e,t,Qt),r.__reactInternalMemoizedMergedChildContext=e,A(ye),A(ce),O(ce,e)):A(ye),O(ye,n)}var st=null,Fl=!1,Ro=!1;function ec(e){st===null?st=[e]:st.push(e)}function Pp(e){Fl=!0,ec(e)}function Dt(){if(!Ro&&st!==null){Ro=!0;var e=0,t=L;try{var n=st;for(L=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}st=null,Fl=!1}catch(l){throw st!==null&&(st=st.slice(e+1)),Ca(Fi,Dt),l}finally{L=t,Ro=!1}}return null}var dn=[],fn=0,wl=null,_l=0,Ie=[],Me=0,Kt=null,ut=1,at="";function Bt(e,t){dn[fn++]=_l,dn[fn++]=wl,wl=e,_l=t}function tc(e,t,n){Ie[Me++]=ut,Ie[Me++]=at,Ie[Me++]=Kt,Kt=e;var r=ut;e=at;var l=32-He(r)-1;r&=~(1<<l),n+=1;var o=32-He(t)+l;if(30<o){var i=l-l%5;o=(r&(1<<i)-1).toString(32),r>>=i,l-=i,ut=1<<32-He(t)+l|n<<l|r,at=o+e}else ut=1<<o|n<<l|r,at=e}function Qi(e){e.return!==null&&(Bt(e,1),tc(e,1,0))}function Ki(e){for(;e===wl;)wl=dn[--fn],dn[fn]=null,_l=dn[--fn],dn[fn]=null;for(;e===Kt;)Kt=Ie[--Me],Ie[Me]=null,at=Ie[--Me],Ie[Me]=null,ut=Ie[--Me],Ie[Me]=null}var Ce=null,Ee=null,j=!1,We=null;function nc(e,t){var n=Oe(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Lu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Ce=e,Ee=Nt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Ce=e,Ee=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Kt!==null?{id:ut,overflow:at}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Oe(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,Ce=e,Ee=null,!0):!1;default:return!1}}function di(e){return(e.mode&1)!==0&&(e.flags&128)===0}function fi(e){if(j){var t=Ee;if(t){var n=t;if(!Lu(e,t)){if(di(e))throw Error(v(418));t=Nt(n.nextSibling);var r=Ce;t&&Lu(e,t)?nc(r,n):(e.flags=e.flags&-4097|2,j=!1,Ce=e)}}else{if(di(e))throw Error(v(418));e.flags=e.flags&-4097|2,j=!1,Ce=e}}}function Iu(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Ce=e}function Kr(e){if(e!==Ce)return!1;if(!j)return Iu(e),j=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!si(e.type,e.memoizedProps)),t&&(t=Ee)){if(di(e))throw rc(),Error(v(418));for(;t;)nc(e,t),t=Nt(t.nextSibling)}if(Iu(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){Ee=Nt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}Ee=null}}else Ee=Ce?Nt(e.stateNode.nextSibling):null;return!0}function rc(){for(var e=Ee;e;)e=Nt(e.nextSibling)}function En(){Ee=Ce=null,j=!1}function qi(e){We===null?We=[e]:We.push(e)}var Np=gt.ReactCurrentBatchConfig;function Bn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(v(309));var r=n.stateNode}if(!r)throw Error(v(147,e));var l=r,o=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===o?t.ref:(t=function(i){var s=l.refs;i===null?delete s[o]:s[o]=i},t._stringRef=o,t)}if(typeof e!="string")throw Error(v(284));if(!n._owner)throw Error(v(290,e))}return e}function qr(e,t){throw e=Object.prototype.toString.call(t),Error(v(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Mu(e){var t=e._init;return t(e._payload)}function lc(e){function t(p,c){if(e){var g=p.deletions;g===null?(p.deletions=[c],p.flags|=16):g.push(c)}}function n(p,c){if(!e)return null;for(;c!==null;)t(p,c),c=c.sibling;return null}function r(p,c){for(p=new Map;c!==null;)c.key!==null?p.set(c.key,c):p.set(c.index,c),c=c.sibling;return p}function l(p,c){return p=zt(p,c),p.index=0,p.sibling=null,p}function o(p,c,g){return p.index=g,e?(g=p.alternate,g!==null?(g=g.index,g<c?(p.flags|=2,c):g):(p.flags|=2,c)):(p.flags|=1048576,c)}function i(p){return e&&p.alternate===null&&(p.flags|=2),p}function s(p,c,g,y){return c===null||c.tag!==6?(c=Do(g,p.mode,y),c.return=p,c):(c=l(c,g),c.return=p,c)}function u(p,c,g,y){var _=g.type;return _===ln?d(p,c,g.props.children,y,g.key):c!==null&&(c.elementType===_||typeof _=="object"&&_!==null&&_.$$typeof===yt&&Mu(_)===c.type)?(y=l(c,g.props),y.ref=Bn(p,c,g),y.return=p,y):(y=sl(g.type,g.key,g.props,null,p.mode,y),y.ref=Bn(p,c,g),y.return=p,y)}function a(p,c,g,y){return c===null||c.tag!==4||c.stateNode.containerInfo!==g.containerInfo||c.stateNode.implementation!==g.implementation?(c=Fo(g,p.mode,y),c.return=p,c):(c=l(c,g.children||[]),c.return=p,c)}function d(p,c,g,y,_){return c===null||c.tag!==7?(c=Ht(g,p.mode,y,_),c.return=p,c):(c=l(c,g),c.return=p,c)}function m(p,c,g){if(typeof c=="string"&&c!==""||typeof c=="number")return c=Do(""+c,p.mode,g),c.return=p,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case Ir:return g=sl(c.type,c.key,c.props,null,p.mode,g),g.ref=Bn(p,null,c),g.return=p,g;case rn:return c=Fo(c,p.mode,g),c.return=p,c;case yt:var y=c._init;return m(p,y(c._payload),g)}if(Wn(c)||On(c))return c=Ht(c,p.mode,g,null),c.return=p,c;qr(p,c)}return null}function f(p,c,g,y){var _=c!==null?c.key:null;if(typeof g=="string"&&g!==""||typeof g=="number")return _!==null?null:s(p,c,""+g,y);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Ir:return g.key===_?u(p,c,g,y):null;case rn:return g.key===_?a(p,c,g,y):null;case yt:return _=g._init,f(p,c,_(g._payload),y)}if(Wn(g)||On(g))return _!==null?null:d(p,c,g,y,null);qr(p,g)}return null}function h(p,c,g,y,_){if(typeof y=="string"&&y!==""||typeof y=="number")return p=p.get(g)||null,s(c,p,""+y,_);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Ir:return p=p.get(y.key===null?g:y.key)||null,u(c,p,y,_);case rn:return p=p.get(y.key===null?g:y.key)||null,a(c,p,y,_);case yt:var E=y._init;return h(p,c,g,E(y._payload),_)}if(Wn(y)||On(y))return p=p.get(g)||null,d(c,p,y,_,null);qr(c,y)}return null}function w(p,c,g,y){for(var _=null,E=null,x=c,C=c=0,q=null;x!==null&&C<g.length;C++){x.index>C?(q=x,x=null):q=x.sibling;var N=f(p,x,g[C],y);if(N===null){x===null&&(x=q);break}e&&x&&N.alternate===null&&t(p,x),c=o(N,c,C),E===null?_=N:E.sibling=N,E=N,x=q}if(C===g.length)return n(p,x),j&&Bt(p,C),_;if(x===null){for(;C<g.length;C++)x=m(p,g[C],y),x!==null&&(c=o(x,c,C),E===null?_=x:E.sibling=x,E=x);return j&&Bt(p,C),_}for(x=r(p,x);C<g.length;C++)q=h(x,p,C,g[C],y),q!==null&&(e&&q.alternate!==null&&x.delete(q.key===null?C:q.key),c=o(q,c,C),E===null?_=q:E.sibling=q,E=q);return e&&x.forEach(function(Ye){return t(p,Ye)}),j&&Bt(p,C),_}function k(p,c,g,y){var _=On(g);if(typeof _!="function")throw Error(v(150));if(g=_.call(g),g==null)throw Error(v(151));for(var E=_=null,x=c,C=c=0,q=null,N=g.next();x!==null&&!N.done;C++,N=g.next()){x.index>C?(q=x,x=null):q=x.sibling;var Ye=f(p,x,N.value,y);if(Ye===null){x===null&&(x=q);break}e&&x&&Ye.alternate===null&&t(p,x),c=o(Ye,c,C),E===null?_=Ye:E.sibling=Ye,E=Ye,x=q}if(N.done)return n(p,x),j&&Bt(p,C),_;if(x===null){for(;!N.done;C++,N=g.next())N=m(p,N.value,y),N!==null&&(c=o(N,c,C),E===null?_=N:E.sibling=N,E=N);return j&&Bt(p,C),_}for(x=r(p,x);!N.done;C++,N=g.next())N=h(x,p,C,N.value,y),N!==null&&(e&&N.alternate!==null&&x.delete(N.key===null?C:N.key),c=o(N,c,C),E===null?_=N:E.sibling=N,E=N);return e&&x.forEach(function(Jl){return t(p,Jl)}),j&&Bt(p,C),_}function z(p,c,g,y){if(typeof g=="object"&&g!==null&&g.type===ln&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case Ir:e:{for(var _=g.key,E=c;E!==null;){if(E.key===_){if(_=g.type,_===ln){if(E.tag===7){n(p,E.sibling),c=l(E,g.props.children),c.return=p,p=c;break e}}else if(E.elementType===_||typeof _=="object"&&_!==null&&_.$$typeof===yt&&Mu(_)===E.type){n(p,E.sibling),c=l(E,g.props),c.ref=Bn(p,E,g),c.return=p,p=c;break e}n(p,E);break}else t(p,E);E=E.sibling}g.type===ln?(c=Ht(g.props.children,p.mode,y,g.key),c.return=p,p=c):(y=sl(g.type,g.key,g.props,null,p.mode,y),y.ref=Bn(p,c,g),y.return=p,p=y)}return i(p);case rn:e:{for(E=g.key;c!==null;){if(c.key===E)if(c.tag===4&&c.stateNode.containerInfo===g.containerInfo&&c.stateNode.implementation===g.implementation){n(p,c.sibling),c=l(c,g.children||[]),c.return=p,p=c;break e}else{n(p,c);break}else t(p,c);c=c.sibling}c=Fo(g,p.mode,y),c.return=p,p=c}return i(p);case yt:return E=g._init,z(p,c,E(g._payload),y)}if(Wn(g))return w(p,c,g,y);if(On(g))return k(p,c,g,y);qr(p,g)}return typeof g=="string"&&g!==""||typeof g=="number"?(g=""+g,c!==null&&c.tag===6?(n(p,c.sibling),c=l(c,g),c.return=p,p=c):(n(p,c),c=Do(g,p.mode,y),c.return=p,p=c),i(p)):n(p,c)}return z}var Cn=lc(!0),oc=lc(!1),kl=Ot(null),Sl=null,pn=null,Yi=null;function Gi(){Yi=pn=Sl=null}function Xi(e){var t=kl.current;A(kl),e._currentValue=t}function pi(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function _n(e,t){Sl=e,Yi=pn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(ve=!0),e.firstContext=null)}function Fe(e){var t=e._currentValue;if(Yi!==e)if(e={context:e,memoizedValue:t,next:null},pn===null){if(Sl===null)throw Error(v(308));pn=e,Sl.dependencies={lanes:0,firstContext:e}}else pn=pn.next=e;return t}var Vt=null;function Zi(e){Vt===null?Vt=[e]:Vt.push(e)}function ic(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,Zi(t)):(n.next=l.next,l.next=n),t.interleaved=n,pt(e,r)}function pt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var wt=!1;function Ji(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function sc(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function ct(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Tt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,b&2){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,pt(e,n)}return l=r.interleaved,l===null?(t.next=t,Zi(r)):(t.next=l.next,l.next=t),r.interleaved=t,pt(e,n)}function tl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ai(e,n)}}function Ou(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,o=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};o===null?l=o=i:o=o.next=i,n=n.next}while(n!==null);o===null?l=o=t:o=o.next=t}else l=o=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:o,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function xl(e,t,n,r){var l=e.updateQueue;wt=!1;var o=l.firstBaseUpdate,i=l.lastBaseUpdate,s=l.shared.pending;if(s!==null){l.shared.pending=null;var u=s,a=u.next;u.next=null,i===null?o=a:i.next=a,i=u;var d=e.alternate;d!==null&&(d=d.updateQueue,s=d.lastBaseUpdate,s!==i&&(s===null?d.firstBaseUpdate=a:s.next=a,d.lastBaseUpdate=u))}if(o!==null){var m=l.baseState;i=0,d=a=u=null,s=o;do{var f=s.lane,h=s.eventTime;if((r&f)===f){d!==null&&(d=d.next={eventTime:h,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});e:{var w=e,k=s;switch(f=t,h=n,k.tag){case 1:if(w=k.payload,typeof w=="function"){m=w.call(h,m,f);break e}m=w;break e;case 3:w.flags=w.flags&-65537|128;case 0:if(w=k.payload,f=typeof w=="function"?w.call(h,m,f):w,f==null)break e;m=$({},m,f);break e;case 2:wt=!0}}s.callback!==null&&s.lane!==0&&(e.flags|=64,f=l.effects,f===null?l.effects=[s]:f.push(s))}else h={eventTime:h,lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},d===null?(a=d=h,u=m):d=d.next=h,i|=f;if(s=s.next,s===null){if(s=l.shared.pending,s===null)break;f=s,s=f.next,f.next=null,l.lastBaseUpdate=f,l.shared.pending=null}}while(!0);if(d===null&&(u=m),l.baseState=u,l.firstBaseUpdate=a,l.lastBaseUpdate=d,t=l.shared.interleaved,t!==null){l=t;do i|=l.lane,l=l.next;while(l!==t)}else o===null&&(l.shared.lanes=0);Yt|=i,e.lanes=i,e.memoizedState=m}}function Du(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(v(191,l));l.call(r)}}}var Sr={},tt=Ot(Sr),pr=Ot(Sr),mr=Ot(Sr);function $t(e){if(e===Sr)throw Error(v(174));return e}function es(e,t){switch(O(mr,t),O(pr,e),O(tt,Sr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Ko(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Ko(t,e)}A(tt),O(tt,t)}function Pn(){A(tt),A(pr),A(mr)}function uc(e){$t(mr.current);var t=$t(tt.current),n=Ko(t,e.type);t!==n&&(O(pr,e),O(tt,n))}function ts(e){pr.current===e&&(A(tt),A(pr))}var U=Ot(0);function El(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var bo=[];function ns(){for(var e=0;e<bo.length;e++)bo[e]._workInProgressVersionPrimary=null;bo.length=0}var nl=gt.ReactCurrentDispatcher,zo=gt.ReactCurrentBatchConfig,qt=0,V=null,Z=null,ee=null,Cl=!1,Zn=!1,gr=0,Tp=0;function se(){throw Error(v(321))}function rs(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ke(e[n],t[n]))return!1;return!0}function ls(e,t,n,r,l,o){if(qt=o,V=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,nl.current=e===null||e.memoizedState===null?Lp:Ip,e=n(r,l),Zn){o=0;do{if(Zn=!1,gr=0,25<=o)throw Error(v(301));o+=1,ee=Z=null,t.updateQueue=null,nl.current=Mp,e=n(r,l)}while(Zn)}if(nl.current=Pl,t=Z!==null&&Z.next!==null,qt=0,ee=Z=V=null,Cl=!1,t)throw Error(v(300));return e}function os(){var e=gr!==0;return gr=0,e}function Ze(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ee===null?V.memoizedState=ee=e:ee=ee.next=e,ee}function Ae(){if(Z===null){var e=V.alternate;e=e!==null?e.memoizedState:null}else e=Z.next;var t=ee===null?V.memoizedState:ee.next;if(t!==null)ee=t,Z=e;else{if(e===null)throw Error(v(310));Z=e,e={memoizedState:Z.memoizedState,baseState:Z.baseState,baseQueue:Z.baseQueue,queue:Z.queue,next:null},ee===null?V.memoizedState=ee=e:ee=ee.next=e}return ee}function hr(e,t){return typeof t=="function"?t(e):t}function Lo(e){var t=Ae(),n=t.queue;if(n===null)throw Error(v(311));n.lastRenderedReducer=e;var r=Z,l=r.baseQueue,o=n.pending;if(o!==null){if(l!==null){var i=l.next;l.next=o.next,o.next=i}r.baseQueue=l=o,n.pending=null}if(l!==null){o=l.next,r=r.baseState;var s=i=null,u=null,a=o;do{var d=a.lane;if((qt&d)===d)u!==null&&(u=u.next={lane:0,action:a.action,hasEagerState:a.hasEagerState,eagerState:a.eagerState,next:null}),r=a.hasEagerState?a.eagerState:e(r,a.action);else{var m={lane:d,action:a.action,hasEagerState:a.hasEagerState,eagerState:a.eagerState,next:null};u===null?(s=u=m,i=r):u=u.next=m,V.lanes|=d,Yt|=d}a=a.next}while(a!==null&&a!==o);u===null?i=r:u.next=s,Ke(r,t.memoizedState)||(ve=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=u,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do o=l.lane,V.lanes|=o,Yt|=o,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Io(e){var t=Ae(),n=t.queue;if(n===null)throw Error(v(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,o=t.memoizedState;if(l!==null){n.pending=null;var i=l=l.next;do o=e(o,i.action),i=i.next;while(i!==l);Ke(o,t.memoizedState)||(ve=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function ac(){}function cc(e,t){var n=V,r=Ae(),l=t(),o=!Ke(r.memoizedState,l);if(o&&(r.memoizedState=l,ve=!0),r=r.queue,is(pc.bind(null,n,r,e),[e]),r.getSnapshot!==t||o||ee!==null&&ee.memoizedState.tag&1){if(n.flags|=2048,vr(9,fc.bind(null,n,r,l,t),void 0,null),te===null)throw Error(v(349));qt&30||dc(n,t,l)}return l}function dc(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=V.updateQueue,t===null?(t={lastEffect:null,stores:null},V.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function fc(e,t,n,r){t.value=n,t.getSnapshot=r,mc(t)&&gc(e)}function pc(e,t,n){return n(function(){mc(t)&&gc(e)})}function mc(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ke(e,n)}catch{return!0}}function gc(e){var t=pt(e,1);t!==null&&Qe(t,e,1,-1)}function Fu(e){var t=Ze();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:hr,lastRenderedState:e},t.queue=e,e=e.dispatch=zp.bind(null,V,e),[t.memoizedState,e]}function vr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=V.updateQueue,t===null?(t={lastEffect:null,stores:null},V.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function hc(){return Ae().memoizedState}function rl(e,t,n,r){var l=Ze();V.flags|=e,l.memoizedState=vr(1|t,n,void 0,r===void 0?null:r)}function Al(e,t,n,r){var l=Ae();r=r===void 0?null:r;var o=void 0;if(Z!==null){var i=Z.memoizedState;if(o=i.destroy,r!==null&&rs(r,i.deps)){l.memoizedState=vr(t,n,o,r);return}}V.flags|=e,l.memoizedState=vr(1|t,n,o,r)}function Au(e,t){return rl(8390656,8,e,t)}function is(e,t){return Al(2048,8,e,t)}function vc(e,t){return Al(4,2,e,t)}function yc(e,t){return Al(4,4,e,t)}function wc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function _c(e,t,n){return n=n!=null?n.concat([e]):null,Al(4,4,wc.bind(null,t,e),n)}function ss(){}function kc(e,t){var n=Ae();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&rs(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Sc(e,t){var n=Ae();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&rs(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function xc(e,t,n){return qt&21?(Ke(n,t)||(n=Ta(),V.lanes|=n,Yt|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,ve=!0),e.memoizedState=n)}function Rp(e,t){var n=L;L=n!==0&&4>n?n:4,e(!0);var r=zo.transition;zo.transition={};try{e(!1),t()}finally{L=n,zo.transition=r}}function Ec(){return Ae().memoizedState}function bp(e,t,n){var r=bt(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Cc(e))Pc(t,n);else if(n=ic(e,t,n,r),n!==null){var l=me();Qe(n,e,r,l),Nc(n,t,r)}}function zp(e,t,n){var r=bt(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Cc(e))Pc(t,l);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=t.lastRenderedReducer,o!==null))try{var i=t.lastRenderedState,s=o(i,n);if(l.hasEagerState=!0,l.eagerState=s,Ke(s,i)){var u=t.interleaved;u===null?(l.next=l,Zi(t)):(l.next=u.next,u.next=l),t.interleaved=l;return}}catch{}finally{}n=ic(e,t,l,r),n!==null&&(l=me(),Qe(n,e,r,l),Nc(n,t,r))}}function Cc(e){var t=e.alternate;return e===V||t!==null&&t===V}function Pc(e,t){Zn=Cl=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Nc(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ai(e,n)}}var Pl={readContext:Fe,useCallback:se,useContext:se,useEffect:se,useImperativeHandle:se,useInsertionEffect:se,useLayoutEffect:se,useMemo:se,useReducer:se,useRef:se,useState:se,useDebugValue:se,useDeferredValue:se,useTransition:se,useMutableSource:se,useSyncExternalStore:se,useId:se,unstable_isNewReconciler:!1},Lp={readContext:Fe,useCallback:function(e,t){return Ze().memoizedState=[e,t===void 0?null:t],e},useContext:Fe,useEffect:Au,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,rl(4194308,4,wc.bind(null,t,e),n)},useLayoutEffect:function(e,t){return rl(4194308,4,e,t)},useInsertionEffect:function(e,t){return rl(4,2,e,t)},useMemo:function(e,t){var n=Ze();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ze();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=bp.bind(null,V,e),[r.memoizedState,e]},useRef:function(e){var t=Ze();return e={current:e},t.memoizedState=e},useState:Fu,useDebugValue:ss,useDeferredValue:function(e){return Ze().memoizedState=e},useTransition:function(){var e=Fu(!1),t=e[0];return e=Rp.bind(null,e[1]),Ze().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=V,l=Ze();if(j){if(n===void 0)throw Error(v(407));n=n()}else{if(n=t(),te===null)throw Error(v(349));qt&30||dc(r,t,n)}l.memoizedState=n;var o={value:n,getSnapshot:t};return l.queue=o,Au(pc.bind(null,r,o,e),[e]),r.flags|=2048,vr(9,fc.bind(null,r,o,n,t),void 0,null),n},useId:function(){var e=Ze(),t=te.identifierPrefix;if(j){var n=at,r=ut;n=(r&~(1<<32-He(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=gr++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Tp++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Ip={readContext:Fe,useCallback:kc,useContext:Fe,useEffect:is,useImperativeHandle:_c,useInsertionEffect:vc,useLayoutEffect:yc,useMemo:Sc,useReducer:Lo,useRef:hc,useState:function(){return Lo(hr)},useDebugValue:ss,useDeferredValue:function(e){var t=Ae();return xc(t,Z.memoizedState,e)},useTransition:function(){var e=Lo(hr)[0],t=Ae().memoizedState;return[e,t]},useMutableSource:ac,useSyncExternalStore:cc,useId:Ec,unstable_isNewReconciler:!1},Mp={readContext:Fe,useCallback:kc,useContext:Fe,useEffect:is,useImperativeHandle:_c,useInsertionEffect:vc,useLayoutEffect:yc,useMemo:Sc,useReducer:Io,useRef:hc,useState:function(){return Io(hr)},useDebugValue:ss,useDeferredValue:function(e){var t=Ae();return Z===null?t.memoizedState=e:xc(t,Z.memoizedState,e)},useTransition:function(){var e=Io(hr)[0],t=Ae().memoizedState;return[e,t]},useMutableSource:ac,useSyncExternalStore:cc,useId:Ec,unstable_isNewReconciler:!1};function Ve(e,t){if(e&&e.defaultProps){t=$({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function mi(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:$({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Bl={isMounted:function(e){return(e=e._reactInternals)?Zt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=me(),l=bt(e),o=ct(r,l);o.payload=t,n!=null&&(o.callback=n),t=Tt(e,o,l),t!==null&&(Qe(t,e,l,r),tl(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=me(),l=bt(e),o=ct(r,l);o.tag=1,o.payload=t,n!=null&&(o.callback=n),t=Tt(e,o,l),t!==null&&(Qe(t,e,l,r),tl(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=me(),r=bt(e),l=ct(n,r);l.tag=2,t!=null&&(l.callback=t),t=Tt(e,l,r),t!==null&&(Qe(t,e,r,n),tl(t,e,r))}};function Bu(e,t,n,r,l,o,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,o,i):t.prototype&&t.prototype.isPureReactComponent?!ar(n,r)||!ar(l,o):!0}function Tc(e,t,n){var r=!1,l=It,o=t.contextType;return typeof o=="object"&&o!==null?o=Fe(o):(l=we(t)?Qt:ce.current,r=t.contextTypes,o=(r=r!=null)?xn(e,l):It),t=new t(n,o),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Bl,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=o),t}function ju(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Bl.enqueueReplaceState(t,t.state,null)}function gi(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},Ji(e);var o=t.contextType;typeof o=="object"&&o!==null?l.context=Fe(o):(o=we(t)?Qt:ce.current,l.context=xn(e,o)),l.state=e.memoizedState,o=t.getDerivedStateFromProps,typeof o=="function"&&(mi(e,t,o,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&Bl.enqueueReplaceState(l,l.state,null),xl(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function Nn(e,t){try{var n="",r=t;do n+=cf(r),r=r.return;while(r);var l=n}catch(o){l=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:t,stack:l,digest:null}}function Mo(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function hi(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Op=typeof WeakMap=="function"?WeakMap:Map;function Rc(e,t,n){n=ct(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Tl||(Tl=!0,Pi=r),hi(e,t)},n}function bc(e,t,n){n=ct(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){hi(e,t)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(n.callback=function(){hi(e,t),typeof r!="function"&&(Rt===null?Rt=new Set([this]):Rt.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function Uu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Op;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Yp.bind(null,e,t,n),t.then(e,e))}function Vu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function $u(e,t,n,r,l){return e.mode&1?(e.flags|=65536,e.lanes=l,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=ct(-1,1),t.tag=2,Tt(n,t,1))),n.lanes|=1),e)}var Dp=gt.ReactCurrentOwner,ve=!1;function pe(e,t,n,r){t.child=e===null?oc(t,null,n,r):Cn(t,e.child,n,r)}function Wu(e,t,n,r,l){n=n.render;var o=t.ref;return _n(t,l),r=ls(e,t,n,r,o,l),n=os(),e!==null&&!ve?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,mt(e,t,l)):(j&&n&&Qi(t),t.flags|=1,pe(e,t,r,l),t.child)}function Hu(e,t,n,r,l){if(e===null){var o=n.type;return typeof o=="function"&&!gs(o)&&o.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=o,zc(e,t,o,r,l)):(e=sl(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(o=e.child,!(e.lanes&l)){var i=o.memoizedProps;if(n=n.compare,n=n!==null?n:ar,n(i,r)&&e.ref===t.ref)return mt(e,t,l)}return t.flags|=1,e=zt(o,r),e.ref=t.ref,e.return=t,t.child=e}function zc(e,t,n,r,l){if(e!==null){var o=e.memoizedProps;if(ar(o,r)&&e.ref===t.ref)if(ve=!1,t.pendingProps=r=o,(e.lanes&l)!==0)e.flags&131072&&(ve=!0);else return t.lanes=e.lanes,mt(e,t,l)}return vi(e,t,n,r,l)}function Lc(e,t,n){var r=t.pendingProps,l=r.children,o=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},O(gn,xe),xe|=n;else{if(!(n&1073741824))return e=o!==null?o.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,O(gn,xe),xe|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=o!==null?o.baseLanes:n,O(gn,xe),xe|=r}else o!==null?(r=o.baseLanes|n,t.memoizedState=null):r=n,O(gn,xe),xe|=r;return pe(e,t,l,n),t.child}function Ic(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function vi(e,t,n,r,l){var o=we(n)?Qt:ce.current;return o=xn(t,o),_n(t,l),n=ls(e,t,n,r,o,l),r=os(),e!==null&&!ve?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,mt(e,t,l)):(j&&r&&Qi(t),t.flags|=1,pe(e,t,n,l),t.child)}function Qu(e,t,n,r,l){if(we(n)){var o=!0;yl(t)}else o=!1;if(_n(t,l),t.stateNode===null)ll(e,t),Tc(t,n,r),gi(t,n,r,l),r=!0;else if(e===null){var i=t.stateNode,s=t.memoizedProps;i.props=s;var u=i.context,a=n.contextType;typeof a=="object"&&a!==null?a=Fe(a):(a=we(n)?Qt:ce.current,a=xn(t,a));var d=n.getDerivedStateFromProps,m=typeof d=="function"||typeof i.getSnapshotBeforeUpdate=="function";m||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(s!==r||u!==a)&&ju(t,i,r,a),wt=!1;var f=t.memoizedState;i.state=f,xl(t,r,i,l),u=t.memoizedState,s!==r||f!==u||ye.current||wt?(typeof d=="function"&&(mi(t,n,d,r),u=t.memoizedState),(s=wt||Bu(t,n,s,r,f,u,a))?(m||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=u),i.props=r,i.state=u,i.context=a,r=s):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{i=t.stateNode,sc(e,t),s=t.memoizedProps,a=t.type===t.elementType?s:Ve(t.type,s),i.props=a,m=t.pendingProps,f=i.context,u=n.contextType,typeof u=="object"&&u!==null?u=Fe(u):(u=we(n)?Qt:ce.current,u=xn(t,u));var h=n.getDerivedStateFromProps;(d=typeof h=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(s!==m||f!==u)&&ju(t,i,r,u),wt=!1,f=t.memoizedState,i.state=f,xl(t,r,i,l);var w=t.memoizedState;s!==m||f!==w||ye.current||wt?(typeof h=="function"&&(mi(t,n,h,r),w=t.memoizedState),(a=wt||Bu(t,n,a,r,f,w,u)||!1)?(d||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,w,u),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,w,u)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=w),i.props=r,i.state=w,i.context=u,r=a):(typeof i.componentDidUpdate!="function"||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return yi(e,t,n,r,o,l)}function yi(e,t,n,r,l,o){Ic(e,t);var i=(t.flags&128)!==0;if(!r&&!i)return l&&zu(t,n,!1),mt(e,t,o);r=t.stateNode,Dp.current=t;var s=i&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&i?(t.child=Cn(t,e.child,null,o),t.child=Cn(t,null,s,o)):pe(e,t,s,o),t.memoizedState=r.state,l&&zu(t,n,!0),t.child}function Mc(e){var t=e.stateNode;t.pendingContext?bu(e,t.pendingContext,t.pendingContext!==t.context):t.context&&bu(e,t.context,!1),es(e,t.containerInfo)}function Ku(e,t,n,r,l){return En(),qi(l),t.flags|=256,pe(e,t,n,r),t.child}var wi={dehydrated:null,treeContext:null,retryLane:0};function _i(e){return{baseLanes:e,cachePool:null,transitions:null}}function Oc(e,t,n){var r=t.pendingProps,l=U.current,o=!1,i=(t.flags&128)!==0,s;if((s=i)||(s=e!==null&&e.memoizedState===null?!1:(l&2)!==0),s?(o=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),O(U,l&1),e===null)return fi(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(i=r.children,e=r.fallback,o?(r=t.mode,o=t.child,i={mode:"hidden",children:i},!(r&1)&&o!==null?(o.childLanes=0,o.pendingProps=i):o=Vl(i,r,0,null),e=Ht(e,r,n,null),o.return=t,e.return=t,o.sibling=e,t.child=o,t.child.memoizedState=_i(n),t.memoizedState=wi,e):us(t,i));if(l=e.memoizedState,l!==null&&(s=l.dehydrated,s!==null))return Fp(e,t,i,r,s,l,n);if(o){o=r.fallback,i=t.mode,l=e.child,s=l.sibling;var u={mode:"hidden",children:r.children};return!(i&1)&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=u,t.deletions=null):(r=zt(l,u),r.subtreeFlags=l.subtreeFlags&14680064),s!==null?o=zt(s,o):(o=Ht(o,i,n,null),o.flags|=2),o.return=t,r.return=t,r.sibling=o,t.child=r,r=o,o=t.child,i=e.child.memoizedState,i=i===null?_i(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},o.memoizedState=i,o.childLanes=e.childLanes&~n,t.memoizedState=wi,r}return o=e.child,e=o.sibling,r=zt(o,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function us(e,t){return t=Vl({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Yr(e,t,n,r){return r!==null&&qi(r),Cn(t,e.child,null,n),e=us(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Fp(e,t,n,r,l,o,i){if(n)return t.flags&256?(t.flags&=-257,r=Mo(Error(v(422))),Yr(e,t,i,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(o=r.fallback,l=t.mode,r=Vl({mode:"visible",children:r.children},l,0,null),o=Ht(o,l,i,null),o.flags|=2,r.return=t,o.return=t,r.sibling=o,t.child=r,t.mode&1&&Cn(t,e.child,null,i),t.child.memoizedState=_i(i),t.memoizedState=wi,o);if(!(t.mode&1))return Yr(e,t,i,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var s=r.dgst;return r=s,o=Error(v(419)),r=Mo(o,r,void 0),Yr(e,t,i,r)}if(s=(i&e.childLanes)!==0,ve||s){if(r=te,r!==null){switch(i&-i){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=l&(r.suspendedLanes|i)?0:l,l!==0&&l!==o.retryLane&&(o.retryLane=l,pt(e,l),Qe(r,e,l,-1))}return ms(),r=Mo(Error(v(421))),Yr(e,t,i,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Gp.bind(null,e),l._reactRetry=t,null):(e=o.treeContext,Ee=Nt(l.nextSibling),Ce=t,j=!0,We=null,e!==null&&(Ie[Me++]=ut,Ie[Me++]=at,Ie[Me++]=Kt,ut=e.id,at=e.overflow,Kt=t),t=us(t,r.children),t.flags|=4096,t)}function qu(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),pi(e.return,t,n)}function Oo(e,t,n,r,l){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=l)}function Dc(e,t,n){var r=t.pendingProps,l=r.revealOrder,o=r.tail;if(pe(e,t,r.children,n),r=U.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&qu(e,n,t);else if(e.tag===19)qu(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(O(U,r),!(t.mode&1))t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&El(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Oo(t,!1,l,n,o);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&El(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Oo(t,!0,n,null,o);break;case"together":Oo(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ll(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function mt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Yt|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(v(153));if(t.child!==null){for(e=t.child,n=zt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=zt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Ap(e,t,n){switch(t.tag){case 3:Mc(t),En();break;case 5:uc(t);break;case 1:we(t.type)&&yl(t);break;case 4:es(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;O(kl,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(O(U,U.current&1),t.flags|=128,null):n&t.child.childLanes?Oc(e,t,n):(O(U,U.current&1),e=mt(e,t,n),e!==null?e.sibling:null);O(U,U.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return Dc(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),O(U,U.current),r)break;return null;case 22:case 23:return t.lanes=0,Lc(e,t,n)}return mt(e,t,n)}var Fc,ki,Ac,Bc;Fc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};ki=function(){};Ac=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,$t(tt.current);var o=null;switch(n){case"input":l=$o(e,l),r=$o(e,r),o=[];break;case"select":l=$({},l,{value:void 0}),r=$({},r,{value:void 0}),o=[];break;case"textarea":l=Qo(e,l),r=Qo(e,r),o=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=hl)}qo(n,r);var i;n=null;for(a in l)if(!r.hasOwnProperty(a)&&l.hasOwnProperty(a)&&l[a]!=null)if(a==="style"){var s=l[a];for(i in s)s.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else a!=="dangerouslySetInnerHTML"&&a!=="children"&&a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(nr.hasOwnProperty(a)?o||(o=[]):(o=o||[]).push(a,null));for(a in r){var u=r[a];if(s=l!=null?l[a]:void 0,r.hasOwnProperty(a)&&u!==s&&(u!=null||s!=null))if(a==="style")if(s){for(i in s)!s.hasOwnProperty(i)||u&&u.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in u)u.hasOwnProperty(i)&&s[i]!==u[i]&&(n||(n={}),n[i]=u[i])}else n||(o||(o=[]),o.push(a,n)),n=u;else a==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,s=s?s.__html:void 0,u!=null&&s!==u&&(o=o||[]).push(a,u)):a==="children"?typeof u!="string"&&typeof u!="number"||(o=o||[]).push(a,""+u):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&(nr.hasOwnProperty(a)?(u!=null&&a==="onScroll"&&F("scroll",e),o||s===u||(o=[])):(o=o||[]).push(a,u))}n&&(o=o||[]).push("style",n);var a=o;(t.updateQueue=a)&&(t.flags|=4)}};Bc=function(e,t,n,r){n!==r&&(t.flags|=4)};function jn(e,t){if(!j)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function ue(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Bp(e,t,n){var r=t.pendingProps;switch(Ki(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ue(t),null;case 1:return we(t.type)&&vl(),ue(t),null;case 3:return r=t.stateNode,Pn(),A(ye),A(ce),ns(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Kr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,We!==null&&(Ri(We),We=null))),ki(e,t),ue(t),null;case 5:ts(t);var l=$t(mr.current);if(n=t.type,e!==null&&t.stateNode!=null)Ac(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(v(166));return ue(t),null}if(e=$t(tt.current),Kr(t)){r=t.stateNode,n=t.type;var o=t.memoizedProps;switch(r[Je]=t,r[fr]=o,e=(t.mode&1)!==0,n){case"dialog":F("cancel",r),F("close",r);break;case"iframe":case"object":case"embed":F("load",r);break;case"video":case"audio":for(l=0;l<Qn.length;l++)F(Qn[l],r);break;case"source":F("error",r);break;case"img":case"image":case"link":F("error",r),F("load",r);break;case"details":F("toggle",r);break;case"input":nu(r,o),F("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!o.multiple},F("invalid",r);break;case"textarea":lu(r,o),F("invalid",r)}qo(n,o),l=null;for(var i in o)if(o.hasOwnProperty(i)){var s=o[i];i==="children"?typeof s=="string"?r.textContent!==s&&(o.suppressHydrationWarning!==!0&&Qr(r.textContent,s,e),l=["children",s]):typeof s=="number"&&r.textContent!==""+s&&(o.suppressHydrationWarning!==!0&&Qr(r.textContent,s,e),l=["children",""+s]):nr.hasOwnProperty(i)&&s!=null&&i==="onScroll"&&F("scroll",r)}switch(n){case"input":Mr(r),ru(r,o,!0);break;case"textarea":Mr(r),ou(r);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(r.onclick=hl)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{i=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=pa(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(n,{is:r.is}):(e=i.createElement(n),n==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,n),e[Je]=t,e[fr]=r,Fc(e,t,!1,!1),t.stateNode=e;e:{switch(i=Yo(n,r),n){case"dialog":F("cancel",e),F("close",e),l=r;break;case"iframe":case"object":case"embed":F("load",e),l=r;break;case"video":case"audio":for(l=0;l<Qn.length;l++)F(Qn[l],e);l=r;break;case"source":F("error",e),l=r;break;case"img":case"image":case"link":F("error",e),F("load",e),l=r;break;case"details":F("toggle",e),l=r;break;case"input":nu(e,r),l=$o(e,r),F("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=$({},r,{value:void 0}),F("invalid",e);break;case"textarea":lu(e,r),l=Qo(e,r),F("invalid",e);break;default:l=r}qo(n,l),s=l;for(o in s)if(s.hasOwnProperty(o)){var u=s[o];o==="style"?ha(e,u):o==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&ma(e,u)):o==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&rr(e,u):typeof u=="number"&&rr(e,""+u):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(nr.hasOwnProperty(o)?u!=null&&o==="onScroll"&&F("scroll",e):u!=null&&Li(e,o,u,i))}switch(n){case"input":Mr(e),ru(e,r,!1);break;case"textarea":Mr(e),ou(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Lt(r.value));break;case"select":e.multiple=!!r.multiple,o=r.value,o!=null?hn(e,!!r.multiple,o,!1):r.defaultValue!=null&&hn(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=hl)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return ue(t),null;case 6:if(e&&t.stateNode!=null)Bc(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(v(166));if(n=$t(mr.current),$t(tt.current),Kr(t)){if(r=t.stateNode,n=t.memoizedProps,r[Je]=t,(o=r.nodeValue!==n)&&(e=Ce,e!==null))switch(e.tag){case 3:Qr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Qr(r.nodeValue,n,(e.mode&1)!==0)}o&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Je]=t,t.stateNode=r}return ue(t),null;case 13:if(A(U),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(j&&Ee!==null&&t.mode&1&&!(t.flags&128))rc(),En(),t.flags|=98560,o=!1;else if(o=Kr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!o)throw Error(v(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(v(317));o[Je]=t}else En(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;ue(t),o=!1}else We!==null&&(Ri(We),We=null),o=!0;if(!o)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||U.current&1?J===0&&(J=3):ms())),t.updateQueue!==null&&(t.flags|=4),ue(t),null);case 4:return Pn(),ki(e,t),e===null&&cr(t.stateNode.containerInfo),ue(t),null;case 10:return Xi(t.type._context),ue(t),null;case 17:return we(t.type)&&vl(),ue(t),null;case 19:if(A(U),o=t.memoizedState,o===null)return ue(t),null;if(r=(t.flags&128)!==0,i=o.rendering,i===null)if(r)jn(o,!1);else{if(J!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(i=El(e),i!==null){for(t.flags|=128,jn(o,!1),r=i.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)o=n,e=r,o.flags&=14680066,i=o.alternate,i===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=i.childLanes,o.lanes=i.lanes,o.child=i.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=i.memoizedProps,o.memoizedState=i.memoizedState,o.updateQueue=i.updateQueue,o.type=i.type,e=i.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return O(U,U.current&1|2),t.child}e=e.sibling}o.tail!==null&&Q()>Tn&&(t.flags|=128,r=!0,jn(o,!1),t.lanes=4194304)}else{if(!r)if(e=El(i),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),jn(o,!0),o.tail===null&&o.tailMode==="hidden"&&!i.alternate&&!j)return ue(t),null}else 2*Q()-o.renderingStartTime>Tn&&n!==1073741824&&(t.flags|=128,r=!0,jn(o,!1),t.lanes=4194304);o.isBackwards?(i.sibling=t.child,t.child=i):(n=o.last,n!==null?n.sibling=i:t.child=i,o.last=i)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=Q(),t.sibling=null,n=U.current,O(U,r?n&1|2:n&1),t):(ue(t),null);case 22:case 23:return ps(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?xe&1073741824&&(ue(t),t.subtreeFlags&6&&(t.flags|=8192)):ue(t),null;case 24:return null;case 25:return null}throw Error(v(156,t.tag))}function jp(e,t){switch(Ki(t),t.tag){case 1:return we(t.type)&&vl(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Pn(),A(ye),A(ce),ns(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return ts(t),null;case 13:if(A(U),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(v(340));En()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return A(U),null;case 4:return Pn(),null;case 10:return Xi(t.type._context),null;case 22:case 23:return ps(),null;case 24:return null;default:return null}}var Gr=!1,ae=!1,Up=typeof WeakSet=="function"?WeakSet:Set,S=null;function mn(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){W(e,t,r)}else n.current=null}function Si(e,t,n){try{n()}catch(r){W(e,t,r)}}var Yu=!1;function Vp(e,t){if(oi=pl,e=Wa(),Hi(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break e}var i=0,s=-1,u=-1,a=0,d=0,m=e,f=null;t:for(;;){for(var h;m!==n||l!==0&&m.nodeType!==3||(s=i+l),m!==o||r!==0&&m.nodeType!==3||(u=i+r),m.nodeType===3&&(i+=m.nodeValue.length),(h=m.firstChild)!==null;)f=m,m=h;for(;;){if(m===e)break t;if(f===n&&++a===l&&(s=i),f===o&&++d===r&&(u=i),(h=m.nextSibling)!==null)break;m=f,f=m.parentNode}m=h}n=s===-1||u===-1?null:{start:s,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(ii={focusedElem:e,selectionRange:n},pl=!1,S=t;S!==null;)if(t=S,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,S=e;else for(;S!==null;){t=S;try{var w=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(w!==null){var k=w.memoizedProps,z=w.memoizedState,p=t.stateNode,c=p.getSnapshotBeforeUpdate(t.elementType===t.type?k:Ve(t.type,k),z);p.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var g=t.stateNode.containerInfo;g.nodeType===1?g.textContent="":g.nodeType===9&&g.documentElement&&g.removeChild(g.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(v(163))}}catch(y){W(t,t.return,y)}if(e=t.sibling,e!==null){e.return=t.return,S=e;break}S=t.return}return w=Yu,Yu=!1,w}function Jn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var o=l.destroy;l.destroy=void 0,o!==void 0&&Si(t,n,o)}l=l.next}while(l!==r)}}function jl(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function xi(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function jc(e){var t=e.alternate;t!==null&&(e.alternate=null,jc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Je],delete t[fr],delete t[ai],delete t[Ep],delete t[Cp])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Uc(e){return e.tag===5||e.tag===3||e.tag===4}function Gu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Uc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ei(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=hl));else if(r!==4&&(e=e.child,e!==null))for(Ei(e,t,n),e=e.sibling;e!==null;)Ei(e,t,n),e=e.sibling}function Ci(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Ci(e,t,n),e=e.sibling;e!==null;)Ci(e,t,n),e=e.sibling}var re=null,$e=!1;function vt(e,t,n){for(n=n.child;n!==null;)Vc(e,t,n),n=n.sibling}function Vc(e,t,n){if(et&&typeof et.onCommitFiberUnmount=="function")try{et.onCommitFiberUnmount(Ll,n)}catch{}switch(n.tag){case 5:ae||mn(n,t);case 6:var r=re,l=$e;re=null,vt(e,t,n),re=r,$e=l,re!==null&&($e?(e=re,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):re.removeChild(n.stateNode));break;case 18:re!==null&&($e?(e=re,n=n.stateNode,e.nodeType===8?To(e.parentNode,n):e.nodeType===1&&To(e,n),sr(e)):To(re,n.stateNode));break;case 4:r=re,l=$e,re=n.stateNode.containerInfo,$e=!0,vt(e,t,n),re=r,$e=l;break;case 0:case 11:case 14:case 15:if(!ae&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var o=l,i=o.destroy;o=o.tag,i!==void 0&&(o&2||o&4)&&Si(n,t,i),l=l.next}while(l!==r)}vt(e,t,n);break;case 1:if(!ae&&(mn(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(s){W(n,t,s)}vt(e,t,n);break;case 21:vt(e,t,n);break;case 22:n.mode&1?(ae=(r=ae)||n.memoizedState!==null,vt(e,t,n),ae=r):vt(e,t,n);break;default:vt(e,t,n)}}function Xu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Up),t.forEach(function(r){var l=Xp.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Ue(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var o=e,i=t,s=i;e:for(;s!==null;){switch(s.tag){case 5:re=s.stateNode,$e=!1;break e;case 3:re=s.stateNode.containerInfo,$e=!0;break e;case 4:re=s.stateNode.containerInfo,$e=!0;break e}s=s.return}if(re===null)throw Error(v(160));Vc(o,i,l),re=null,$e=!1;var u=l.alternate;u!==null&&(u.return=null),l.return=null}catch(a){W(l,t,a)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)$c(t,e),t=t.sibling}function $c(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Ue(t,e),Xe(e),r&4){try{Jn(3,e,e.return),jl(3,e)}catch(k){W(e,e.return,k)}try{Jn(5,e,e.return)}catch(k){W(e,e.return,k)}}break;case 1:Ue(t,e),Xe(e),r&512&&n!==null&&mn(n,n.return);break;case 5:if(Ue(t,e),Xe(e),r&512&&n!==null&&mn(n,n.return),e.flags&32){var l=e.stateNode;try{rr(l,"")}catch(k){W(e,e.return,k)}}if(r&4&&(l=e.stateNode,l!=null)){var o=e.memoizedProps,i=n!==null?n.memoizedProps:o,s=e.type,u=e.updateQueue;if(e.updateQueue=null,u!==null)try{s==="input"&&o.type==="radio"&&o.name!=null&&da(l,o),Yo(s,i);var a=Yo(s,o);for(i=0;i<u.length;i+=2){var d=u[i],m=u[i+1];d==="style"?ha(l,m):d==="dangerouslySetInnerHTML"?ma(l,m):d==="children"?rr(l,m):Li(l,d,m,a)}switch(s){case"input":Wo(l,o);break;case"textarea":fa(l,o);break;case"select":var f=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!o.multiple;var h=o.value;h!=null?hn(l,!!o.multiple,h,!1):f!==!!o.multiple&&(o.defaultValue!=null?hn(l,!!o.multiple,o.defaultValue,!0):hn(l,!!o.multiple,o.multiple?[]:"",!1))}l[fr]=o}catch(k){W(e,e.return,k)}}break;case 6:if(Ue(t,e),Xe(e),r&4){if(e.stateNode===null)throw Error(v(162));l=e.stateNode,o=e.memoizedProps;try{l.nodeValue=o}catch(k){W(e,e.return,k)}}break;case 3:if(Ue(t,e),Xe(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{sr(t.containerInfo)}catch(k){W(e,e.return,k)}break;case 4:Ue(t,e),Xe(e);break;case 13:Ue(t,e),Xe(e),l=e.child,l.flags&8192&&(o=l.memoizedState!==null,l.stateNode.isHidden=o,!o||l.alternate!==null&&l.alternate.memoizedState!==null||(ds=Q())),r&4&&Xu(e);break;case 22:if(d=n!==null&&n.memoizedState!==null,e.mode&1?(ae=(a=ae)||d,Ue(t,e),ae=a):Ue(t,e),Xe(e),r&8192){if(a=e.memoizedState!==null,(e.stateNode.isHidden=a)&&!d&&e.mode&1)for(S=e,d=e.child;d!==null;){for(m=S=d;S!==null;){switch(f=S,h=f.child,f.tag){case 0:case 11:case 14:case 15:Jn(4,f,f.return);break;case 1:mn(f,f.return);var w=f.stateNode;if(typeof w.componentWillUnmount=="function"){r=f,n=f.return;try{t=r,w.props=t.memoizedProps,w.state=t.memoizedState,w.componentWillUnmount()}catch(k){W(r,n,k)}}break;case 5:mn(f,f.return);break;case 22:if(f.memoizedState!==null){Ju(m);continue}}h!==null?(h.return=f,S=h):Ju(m)}d=d.sibling}e:for(d=null,m=e;;){if(m.tag===5){if(d===null){d=m;try{l=m.stateNode,a?(o=l.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(s=m.stateNode,u=m.memoizedProps.style,i=u!=null&&u.hasOwnProperty("display")?u.display:null,s.style.display=ga("display",i))}catch(k){W(e,e.return,k)}}}else if(m.tag===6){if(d===null)try{m.stateNode.nodeValue=a?"":m.memoizedProps}catch(k){W(e,e.return,k)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===e)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===e)break e;for(;m.sibling===null;){if(m.return===null||m.return===e)break e;d===m&&(d=null),m=m.return}d===m&&(d=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Ue(t,e),Xe(e),r&4&&Xu(e);break;case 21:break;default:Ue(t,e),Xe(e)}}function Xe(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Uc(n)){var r=n;break e}n=n.return}throw Error(v(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(rr(l,""),r.flags&=-33);var o=Gu(e);Ci(e,o,l);break;case 3:case 4:var i=r.stateNode.containerInfo,s=Gu(e);Ei(e,s,i);break;default:throw Error(v(161))}}catch(u){W(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function $p(e,t,n){S=e,Wc(e,t,n)}function Wc(e,t,n){for(var r=(e.mode&1)!==0;S!==null;){var l=S,o=l.child;if(l.tag===22&&r){var i=l.memoizedState!==null||Gr;if(!i){var s=l.alternate,u=s!==null&&s.memoizedState!==null||ae;s=Gr;var a=ae;if(Gr=i,(ae=u)&&!a)for(S=l;S!==null;)i=S,u=i.child,i.tag===22&&i.memoizedState!==null?ea(l):u!==null?(u.return=i,S=u):ea(l);for(;o!==null;)S=o,Wc(o,t,n),o=o.sibling;S=l,Gr=s,ae=a}Zu(e,t,n)}else l.subtreeFlags&8772&&o!==null?(o.return=l,S=o):Zu(e,t,n)}}function Zu(e){for(;S!==null;){var t=S;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:ae||jl(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!ae)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Ve(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var o=t.updateQueue;o!==null&&Du(t,o,r);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Du(t,i,n)}break;case 5:var s=t.stateNode;if(n===null&&t.flags&4){n=s;var u=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var a=t.alternate;if(a!==null){var d=a.memoizedState;if(d!==null){var m=d.dehydrated;m!==null&&sr(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(v(163))}ae||t.flags&512&&xi(t)}catch(f){W(t,t.return,f)}}if(t===e){S=null;break}if(n=t.sibling,n!==null){n.return=t.return,S=n;break}S=t.return}}function Ju(e){for(;S!==null;){var t=S;if(t===e){S=null;break}var n=t.sibling;if(n!==null){n.return=t.return,S=n;break}S=t.return}}function ea(e){for(;S!==null;){var t=S;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{jl(4,t)}catch(u){W(t,n,u)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(u){W(t,l,u)}}var o=t.return;try{xi(t)}catch(u){W(t,o,u)}break;case 5:var i=t.return;try{xi(t)}catch(u){W(t,i,u)}}}catch(u){W(t,t.return,u)}if(t===e){S=null;break}var s=t.sibling;if(s!==null){s.return=t.return,S=s;break}S=t.return}}var Wp=Math.ceil,Nl=gt.ReactCurrentDispatcher,as=gt.ReactCurrentOwner,De=gt.ReactCurrentBatchConfig,b=0,te=null,G=null,le=0,xe=0,gn=Ot(0),J=0,yr=null,Yt=0,Ul=0,cs=0,er=null,he=null,ds=0,Tn=1/0,it=null,Tl=!1,Pi=null,Rt=null,Xr=!1,xt=null,Rl=0,tr=0,Ni=null,ol=-1,il=0;function me(){return b&6?Q():ol!==-1?ol:ol=Q()}function bt(e){return e.mode&1?b&2&&le!==0?le&-le:Np.transition!==null?(il===0&&(il=Ta()),il):(e=L,e!==0||(e=window.event,e=e===void 0?16:Oa(e.type)),e):1}function Qe(e,t,n,r){if(50<tr)throw tr=0,Ni=null,Error(v(185));wr(e,n,r),(!(b&2)||e!==te)&&(e===te&&(!(b&2)&&(Ul|=n),J===4&&kt(e,le)),_e(e,r),n===1&&b===0&&!(t.mode&1)&&(Tn=Q()+500,Fl&&Dt()))}function _e(e,t){var n=e.callbackNode;Rf(e,t);var r=fl(e,e===te?le:0);if(r===0)n!==null&&uu(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&uu(n),t===1)e.tag===0?Pp(ta.bind(null,e)):ec(ta.bind(null,e)),Sp(function(){!(b&6)&&Dt()}),n=null;else{switch(Ra(r)){case 1:n=Fi;break;case 4:n=Pa;break;case 16:n=dl;break;case 536870912:n=Na;break;default:n=dl}n=Zc(n,Hc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Hc(e,t){if(ol=-1,il=0,b&6)throw Error(v(327));var n=e.callbackNode;if(kn()&&e.callbackNode!==n)return null;var r=fl(e,e===te?le:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=bl(e,r);else{t=r;var l=b;b|=2;var o=Kc();(te!==e||le!==t)&&(it=null,Tn=Q()+500,Wt(e,t));do try{Kp();break}catch(s){Qc(e,s)}while(!0);Gi(),Nl.current=o,b=l,G!==null?t=0:(te=null,le=0,t=J)}if(t!==0){if(t===2&&(l=ei(e),l!==0&&(r=l,t=Ti(e,l))),t===1)throw n=yr,Wt(e,0),kt(e,r),_e(e,Q()),n;if(t===6)kt(e,r);else{if(l=e.current.alternate,!(r&30)&&!Hp(l)&&(t=bl(e,r),t===2&&(o=ei(e),o!==0&&(r=o,t=Ti(e,o))),t===1))throw n=yr,Wt(e,0),kt(e,r),_e(e,Q()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(v(345));case 2:jt(e,he,it);break;case 3:if(kt(e,r),(r&130023424)===r&&(t=ds+500-Q(),10<t)){if(fl(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){me(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=ui(jt.bind(null,e,he,it),t);break}jt(e,he,it);break;case 4:if(kt(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var i=31-He(r);o=1<<i,i=t[i],i>l&&(l=i),r&=~o}if(r=l,r=Q()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Wp(r/1960))-r,10<r){e.timeoutHandle=ui(jt.bind(null,e,he,it),r);break}jt(e,he,it);break;case 5:jt(e,he,it);break;default:throw Error(v(329))}}}return _e(e,Q()),e.callbackNode===n?Hc.bind(null,e):null}function Ti(e,t){var n=er;return e.current.memoizedState.isDehydrated&&(Wt(e,t).flags|=256),e=bl(e,t),e!==2&&(t=he,he=n,t!==null&&Ri(t)),e}function Ri(e){he===null?he=e:he.push.apply(he,e)}function Hp(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],o=l.getSnapshot;l=l.value;try{if(!Ke(o(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function kt(e,t){for(t&=~cs,t&=~Ul,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-He(t),r=1<<n;e[n]=-1,t&=~r}}function ta(e){if(b&6)throw Error(v(327));kn();var t=fl(e,0);if(!(t&1))return _e(e,Q()),null;var n=bl(e,t);if(e.tag!==0&&n===2){var r=ei(e);r!==0&&(t=r,n=Ti(e,r))}if(n===1)throw n=yr,Wt(e,0),kt(e,t),_e(e,Q()),n;if(n===6)throw Error(v(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,jt(e,he,it),_e(e,Q()),null}function fs(e,t){var n=b;b|=1;try{return e(t)}finally{b=n,b===0&&(Tn=Q()+500,Fl&&Dt())}}function Gt(e){xt!==null&&xt.tag===0&&!(b&6)&&kn();var t=b;b|=1;var n=De.transition,r=L;try{if(De.transition=null,L=1,e)return e()}finally{L=r,De.transition=n,b=t,!(b&6)&&Dt()}}function ps(){xe=gn.current,A(gn)}function Wt(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,kp(n)),G!==null)for(n=G.return;n!==null;){var r=n;switch(Ki(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&vl();break;case 3:Pn(),A(ye),A(ce),ns();break;case 5:ts(r);break;case 4:Pn();break;case 13:A(U);break;case 19:A(U);break;case 10:Xi(r.type._context);break;case 22:case 23:ps()}n=n.return}if(te=e,G=e=zt(e.current,null),le=xe=t,J=0,yr=null,cs=Ul=Yt=0,he=er=null,Vt!==null){for(t=0;t<Vt.length;t++)if(n=Vt[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,o=n.pending;if(o!==null){var i=o.next;o.next=l,r.next=i}n.pending=r}Vt=null}return e}function Qc(e,t){do{var n=G;try{if(Gi(),nl.current=Pl,Cl){for(var r=V.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}Cl=!1}if(qt=0,ee=Z=V=null,Zn=!1,gr=0,as.current=null,n===null||n.return===null){J=1,yr=t,G=null;break}e:{var o=e,i=n.return,s=n,u=t;if(t=le,s.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var a=u,d=s,m=d.tag;if(!(d.mode&1)&&(m===0||m===11||m===15)){var f=d.alternate;f?(d.updateQueue=f.updateQueue,d.memoizedState=f.memoizedState,d.lanes=f.lanes):(d.updateQueue=null,d.memoizedState=null)}var h=Vu(i);if(h!==null){h.flags&=-257,$u(h,i,s,o,t),h.mode&1&&Uu(o,a,t),t=h,u=a;var w=t.updateQueue;if(w===null){var k=new Set;k.add(u),t.updateQueue=k}else w.add(u);break e}else{if(!(t&1)){Uu(o,a,t),ms();break e}u=Error(v(426))}}else if(j&&s.mode&1){var z=Vu(i);if(z!==null){!(z.flags&65536)&&(z.flags|=256),$u(z,i,s,o,t),qi(Nn(u,s));break e}}o=u=Nn(u,s),J!==4&&(J=2),er===null?er=[o]:er.push(o),o=i;do{switch(o.tag){case 3:o.flags|=65536,t&=-t,o.lanes|=t;var p=Rc(o,u,t);Ou(o,p);break e;case 1:s=u;var c=o.type,g=o.stateNode;if(!(o.flags&128)&&(typeof c.getDerivedStateFromError=="function"||g!==null&&typeof g.componentDidCatch=="function"&&(Rt===null||!Rt.has(g)))){o.flags|=65536,t&=-t,o.lanes|=t;var y=bc(o,s,t);Ou(o,y);break e}}o=o.return}while(o!==null)}Yc(n)}catch(_){t=_,G===n&&n!==null&&(G=n=n.return);continue}break}while(!0)}function Kc(){var e=Nl.current;return Nl.current=Pl,e===null?Pl:e}function ms(){(J===0||J===3||J===2)&&(J=4),te===null||!(Yt&268435455)&&!(Ul&268435455)||kt(te,le)}function bl(e,t){var n=b;b|=2;var r=Kc();(te!==e||le!==t)&&(it=null,Wt(e,t));do try{Qp();break}catch(l){Qc(e,l)}while(!0);if(Gi(),b=n,Nl.current=r,G!==null)throw Error(v(261));return te=null,le=0,J}function Qp(){for(;G!==null;)qc(G)}function Kp(){for(;G!==null&&!_f();)qc(G)}function qc(e){var t=Xc(e.alternate,e,xe);e.memoizedProps=e.pendingProps,t===null?Yc(e):G=t,as.current=null}function Yc(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=jp(n,t),n!==null){n.flags&=32767,G=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{J=6,G=null;return}}else if(n=Bp(n,t,xe),n!==null){G=n;return}if(t=t.sibling,t!==null){G=t;return}G=t=e}while(t!==null);J===0&&(J=5)}function jt(e,t,n){var r=L,l=De.transition;try{De.transition=null,L=1,qp(e,t,n,r)}finally{De.transition=l,L=r}return null}function qp(e,t,n,r){do kn();while(xt!==null);if(b&6)throw Error(v(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(v(177));e.callbackNode=null,e.callbackPriority=0;var o=n.lanes|n.childLanes;if(bf(e,o),e===te&&(G=te=null,le=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Xr||(Xr=!0,Zc(dl,function(){return kn(),null})),o=(n.flags&15990)!==0,n.subtreeFlags&15990||o){o=De.transition,De.transition=null;var i=L;L=1;var s=b;b|=4,as.current=null,Vp(e,n),$c(n,e),hp(ii),pl=!!oi,ii=oi=null,e.current=n,$p(n,e,l),kf(),b=s,L=i,De.transition=o}else e.current=n;if(Xr&&(Xr=!1,xt=e,Rl=l),o=e.pendingLanes,o===0&&(Rt=null),Ef(n.stateNode,r),_e(e,Q()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(Tl)throw Tl=!1,e=Pi,Pi=null,e;return Rl&1&&e.tag!==0&&kn(),o=e.pendingLanes,o&1?e===Ni?tr++:(tr=0,Ni=e):tr=0,Dt(),null}function kn(){if(xt!==null){var e=Ra(Rl),t=De.transition,n=L;try{if(De.transition=null,L=16>e?16:e,xt===null)var r=!1;else{if(e=xt,xt=null,Rl=0,b&6)throw Error(v(331));var l=b;for(b|=4,S=e.current;S!==null;){var o=S,i=o.child;if(S.flags&16){var s=o.deletions;if(s!==null){for(var u=0;u<s.length;u++){var a=s[u];for(S=a;S!==null;){var d=S;switch(d.tag){case 0:case 11:case 15:Jn(8,d,o)}var m=d.child;if(m!==null)m.return=d,S=m;else for(;S!==null;){d=S;var f=d.sibling,h=d.return;if(jc(d),d===a){S=null;break}if(f!==null){f.return=h,S=f;break}S=h}}}var w=o.alternate;if(w!==null){var k=w.child;if(k!==null){w.child=null;do{var z=k.sibling;k.sibling=null,k=z}while(k!==null)}}S=o}}if(o.subtreeFlags&2064&&i!==null)i.return=o,S=i;else e:for(;S!==null;){if(o=S,o.flags&2048)switch(o.tag){case 0:case 11:case 15:Jn(9,o,o.return)}var p=o.sibling;if(p!==null){p.return=o.return,S=p;break e}S=o.return}}var c=e.current;for(S=c;S!==null;){i=S;var g=i.child;if(i.subtreeFlags&2064&&g!==null)g.return=i,S=g;else e:for(i=c;S!==null;){if(s=S,s.flags&2048)try{switch(s.tag){case 0:case 11:case 15:jl(9,s)}}catch(_){W(s,s.return,_)}if(s===i){S=null;break e}var y=s.sibling;if(y!==null){y.return=s.return,S=y;break e}S=s.return}}if(b=l,Dt(),et&&typeof et.onPostCommitFiberRoot=="function")try{et.onPostCommitFiberRoot(Ll,e)}catch{}r=!0}return r}finally{L=n,De.transition=t}}return!1}function na(e,t,n){t=Nn(n,t),t=Rc(e,t,1),e=Tt(e,t,1),t=me(),e!==null&&(wr(e,1,t),_e(e,t))}function W(e,t,n){if(e.tag===3)na(e,e,n);else for(;t!==null;){if(t.tag===3){na(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Rt===null||!Rt.has(r))){e=Nn(n,e),e=bc(t,e,1),t=Tt(t,e,1),e=me(),t!==null&&(wr(t,1,e),_e(t,e));break}}t=t.return}}function Yp(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=me(),e.pingedLanes|=e.suspendedLanes&n,te===e&&(le&n)===n&&(J===4||J===3&&(le&130023424)===le&&500>Q()-ds?Wt(e,0):cs|=n),_e(e,t)}function Gc(e,t){t===0&&(e.mode&1?(t=Fr,Fr<<=1,!(Fr&130023424)&&(Fr=4194304)):t=1);var n=me();e=pt(e,t),e!==null&&(wr(e,t,n),_e(e,n))}function Gp(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Gc(e,n)}function Xp(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(v(314))}r!==null&&r.delete(t),Gc(e,n)}var Xc;Xc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ye.current)ve=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return ve=!1,Ap(e,t,n);ve=!!(e.flags&131072)}else ve=!1,j&&t.flags&1048576&&tc(t,_l,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;ll(e,t),e=t.pendingProps;var l=xn(t,ce.current);_n(t,n),l=ls(null,t,r,e,l,n);var o=os();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,we(r)?(o=!0,yl(t)):o=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,Ji(t),l.updater=Bl,t.stateNode=l,l._reactInternals=t,gi(t,r,e,n),t=yi(null,t,r,!0,o,n)):(t.tag=0,j&&o&&Qi(t),pe(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(ll(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Jp(r),e=Ve(r,e),l){case 0:t=vi(null,t,r,e,n);break e;case 1:t=Qu(null,t,r,e,n);break e;case 11:t=Wu(null,t,r,e,n);break e;case 14:t=Hu(null,t,r,Ve(r.type,e),n);break e}throw Error(v(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ve(r,l),vi(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ve(r,l),Qu(e,t,r,l,n);case 3:e:{if(Mc(t),e===null)throw Error(v(387));r=t.pendingProps,o=t.memoizedState,l=o.element,sc(e,t),xl(t,r,null,n);var i=t.memoizedState;if(r=i.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){l=Nn(Error(v(423)),t),t=Ku(e,t,r,n,l);break e}else if(r!==l){l=Nn(Error(v(424)),t),t=Ku(e,t,r,n,l);break e}else for(Ee=Nt(t.stateNode.containerInfo.firstChild),Ce=t,j=!0,We=null,n=oc(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(En(),r===l){t=mt(e,t,n);break e}pe(e,t,r,n)}t=t.child}return t;case 5:return uc(t),e===null&&fi(t),r=t.type,l=t.pendingProps,o=e!==null?e.memoizedProps:null,i=l.children,si(r,l)?i=null:o!==null&&si(r,o)&&(t.flags|=32),Ic(e,t),pe(e,t,i,n),t.child;case 6:return e===null&&fi(t),null;case 13:return Oc(e,t,n);case 4:return es(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Cn(t,null,r,n):pe(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ve(r,l),Wu(e,t,r,l,n);case 7:return pe(e,t,t.pendingProps,n),t.child;case 8:return pe(e,t,t.pendingProps.children,n),t.child;case 12:return pe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,o=t.memoizedProps,i=l.value,O(kl,r._currentValue),r._currentValue=i,o!==null)if(Ke(o.value,i)){if(o.children===l.children&&!ye.current){t=mt(e,t,n);break e}}else for(o=t.child,o!==null&&(o.return=t);o!==null;){var s=o.dependencies;if(s!==null){i=o.child;for(var u=s.firstContext;u!==null;){if(u.context===r){if(o.tag===1){u=ct(-1,n&-n),u.tag=2;var a=o.updateQueue;if(a!==null){a=a.shared;var d=a.pending;d===null?u.next=u:(u.next=d.next,d.next=u),a.pending=u}}o.lanes|=n,u=o.alternate,u!==null&&(u.lanes|=n),pi(o.return,n,t),s.lanes|=n;break}u=u.next}}else if(o.tag===10)i=o.type===t.type?null:o.child;else if(o.tag===18){if(i=o.return,i===null)throw Error(v(341));i.lanes|=n,s=i.alternate,s!==null&&(s.lanes|=n),pi(i,n,t),i=o.sibling}else i=o.child;if(i!==null)i.return=o;else for(i=o;i!==null;){if(i===t){i=null;break}if(o=i.sibling,o!==null){o.return=i.return,i=o;break}i=i.return}o=i}pe(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,_n(t,n),l=Fe(l),r=r(l),t.flags|=1,pe(e,t,r,n),t.child;case 14:return r=t.type,l=Ve(r,t.pendingProps),l=Ve(r.type,l),Hu(e,t,r,l,n);case 15:return zc(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ve(r,l),ll(e,t),t.tag=1,we(r)?(e=!0,yl(t)):e=!1,_n(t,n),Tc(t,r,l),gi(t,r,l,n),yi(null,t,r,!0,e,n);case 19:return Dc(e,t,n);case 22:return Lc(e,t,n)}throw Error(v(156,t.tag))};function Zc(e,t){return Ca(e,t)}function Zp(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Oe(e,t,n,r){return new Zp(e,t,n,r)}function gs(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Jp(e){if(typeof e=="function")return gs(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Mi)return 11;if(e===Oi)return 14}return 2}function zt(e,t){var n=e.alternate;return n===null?(n=Oe(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function sl(e,t,n,r,l,o){var i=2;if(r=e,typeof e=="function")gs(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case ln:return Ht(n.children,l,o,t);case Ii:i=8,l|=8;break;case Bo:return e=Oe(12,n,t,l|2),e.elementType=Bo,e.lanes=o,e;case jo:return e=Oe(13,n,t,l),e.elementType=jo,e.lanes=o,e;case Uo:return e=Oe(19,n,t,l),e.elementType=Uo,e.lanes=o,e;case ua:return Vl(n,l,o,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case ia:i=10;break e;case sa:i=9;break e;case Mi:i=11;break e;case Oi:i=14;break e;case yt:i=16,r=null;break e}throw Error(v(130,e==null?e:typeof e,""))}return t=Oe(i,n,t,l),t.elementType=e,t.type=r,t.lanes=o,t}function Ht(e,t,n,r){return e=Oe(7,e,r,t),e.lanes=n,e}function Vl(e,t,n,r){return e=Oe(22,e,r,t),e.elementType=ua,e.lanes=n,e.stateNode={isHidden:!1},e}function Do(e,t,n){return e=Oe(6,e,null,t),e.lanes=n,e}function Fo(e,t,n){return t=Oe(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function em(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=_o(0),this.expirationTimes=_o(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=_o(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function hs(e,t,n,r,l,o,i,s,u){return e=new em(e,t,n,s,u),t===1?(t=1,o===!0&&(t|=8)):t=0,o=Oe(3,null,null,t),e.current=o,o.stateNode=e,o.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ji(o),e}function tm(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:rn,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Jc(e){if(!e)return It;e=e._reactInternals;e:{if(Zt(e)!==e||e.tag!==1)throw Error(v(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(we(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(v(171))}if(e.tag===1){var n=e.type;if(we(n))return Ja(e,n,t)}return t}function ed(e,t,n,r,l,o,i,s,u){return e=hs(n,r,!0,e,l,o,i,s,u),e.context=Jc(null),n=e.current,r=me(),l=bt(n),o=ct(r,l),o.callback=t??null,Tt(n,o,l),e.current.lanes=l,wr(e,l,r),_e(e,r),e}function $l(e,t,n,r){var l=t.current,o=me(),i=bt(l);return n=Jc(n),t.context===null?t.context=n:t.pendingContext=n,t=ct(o,i),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=Tt(l,t,i),e!==null&&(Qe(e,l,i,o),tl(e,l,i)),i}function zl(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function ra(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function vs(e,t){ra(e,t),(e=e.alternate)&&ra(e,t)}function nm(){return null}var td=typeof reportError=="function"?reportError:function(e){console.error(e)};function ys(e){this._internalRoot=e}Wl.prototype.render=ys.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(v(409));$l(e,t,null,null)};Wl.prototype.unmount=ys.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Gt(function(){$l(null,e,null,null)}),t[ft]=null}};function Wl(e){this._internalRoot=e}Wl.prototype.unstable_scheduleHydration=function(e){if(e){var t=La();e={blockedOn:null,target:e,priority:t};for(var n=0;n<_t.length&&t!==0&&t<_t[n].priority;n++);_t.splice(n,0,e),n===0&&Ma(e)}};function ws(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Hl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function la(){}function rm(e,t,n,r,l){if(l){if(typeof r=="function"){var o=r;r=function(){var a=zl(i);o.call(a)}}var i=ed(t,r,e,0,null,!1,!1,"",la);return e._reactRootContainer=i,e[ft]=i.current,cr(e.nodeType===8?e.parentNode:e),Gt(),i}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var s=r;r=function(){var a=zl(u);s.call(a)}}var u=hs(e,0,!1,null,null,!1,!1,"",la);return e._reactRootContainer=u,e[ft]=u.current,cr(e.nodeType===8?e.parentNode:e),Gt(function(){$l(t,u,n,r)}),u}function Ql(e,t,n,r,l){var o=n._reactRootContainer;if(o){var i=o;if(typeof l=="function"){var s=l;l=function(){var u=zl(i);s.call(u)}}$l(t,i,e,l)}else i=rm(n,t,e,l,r);return zl(i)}ba=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Hn(t.pendingLanes);n!==0&&(Ai(t,n|1),_e(t,Q()),!(b&6)&&(Tn=Q()+500,Dt()))}break;case 13:Gt(function(){var r=pt(e,1);if(r!==null){var l=me();Qe(r,e,1,l)}}),vs(e,1)}};Bi=function(e){if(e.tag===13){var t=pt(e,134217728);if(t!==null){var n=me();Qe(t,e,134217728,n)}vs(e,134217728)}};za=function(e){if(e.tag===13){var t=bt(e),n=pt(e,t);if(n!==null){var r=me();Qe(n,e,t,r)}vs(e,t)}};La=function(){return L};Ia=function(e,t){var n=L;try{return L=e,t()}finally{L=n}};Xo=function(e,t,n){switch(t){case"input":if(Wo(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=Dl(r);if(!l)throw Error(v(90));ca(r),Wo(r,l)}}}break;case"textarea":fa(e,n);break;case"select":t=n.value,t!=null&&hn(e,!!n.multiple,t,!1)}};wa=fs;_a=Gt;var lm={usingClientEntryPoint:!1,Events:[kr,an,Dl,va,ya,fs]},Un={findFiberByHostInstance:Ut,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},om={bundleType:Un.bundleType,version:Un.version,rendererPackageName:Un.rendererPackageName,rendererConfig:Un.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:gt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=xa(e),e===null?null:e.stateNode},findFiberByHostInstance:Un.findFiberByHostInstance||nm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Vn=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Vn.isDisabled&&Vn.supportsFiber))try{Ll=Vn.inject(om),et=Vn}catch{}var Vn;Te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=lm;Te.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ws(t))throw Error(v(200));return tm(e,t,null,n)};Te.createRoot=function(e,t){if(!ws(e))throw Error(v(299));var n=!1,r="",l=td;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=hs(e,1,!1,null,null,n,!1,r,l),e[ft]=t.current,cr(e.nodeType===8?e.parentNode:e),new ys(t)};Te.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(v(188)):(e=Object.keys(e).join(","),Error(v(268,e)));return e=xa(t),e=e===null?null:e.stateNode,e};Te.flushSync=function(e){return Gt(e)};Te.hydrate=function(e,t,n){if(!Hl(t))throw Error(v(200));return Ql(null,e,t,!0,n)};Te.hydrateRoot=function(e,t,n){if(!ws(e))throw Error(v(405));var r=n!=null&&n.hydratedSources||null,l=!1,o="",i=td;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=ed(t,null,e,1,n??null,l,!1,o,i),e[ft]=t.current,cr(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new Wl(t)};Te.render=function(e,t,n){if(!Hl(t))throw Error(v(200));return Ql(null,e,t,!1,n)};Te.unmountComponentAtNode=function(e){if(!Hl(e))throw Error(v(40));return e._reactRootContainer?(Gt(function(){Ql(null,null,e,!1,function(){e._reactRootContainer=null,e[ft]=null})}),!0):!1};Te.unstable_batchedUpdates=fs;Te.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Hl(n))throw Error(v(200));if(e==null||e._reactInternals===void 0)throw Error(v(38));return Ql(e,t,n,!1,r)};Te.version="18.3.1-next-f1338f8080-20240426"});var od=ot((Lm,ld)=>{"use strict";function rd(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(rd)}catch(e){console.error(e)}}rd(),ld.exports=nd()});var sd=ot(_s=>{"use strict";var id=od();_s.createRoot=id.createRoot,_s.hydrateRoot=id.hydrateRoot;var Im});var yd=ot(ql=>{"use strict";var fm=ze(),pm=Symbol.for("react.element"),mm=Symbol.for("react.fragment"),gm=Object.prototype.hasOwnProperty,hm=fm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,vm={key:!0,ref:!0,__self:!0,__source:!0};function vd(e,t,n){var r,l={},o=null,i=null;n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),t.ref!==void 0&&(i=t.ref);for(r in t)gm.call(t,r)&&!vm.hasOwnProperty(r)&&(l[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)l[r]===void 0&&(l[r]=t[r]);return{$$typeof:pm,type:e,key:o,ref:i,props:l,_owner:hm.current}}ql.Fragment=mm;ql.jsx=vd;ql.jsxs=vd});var B=ot((Um,wd)=>{"use strict";wd.exports=yd()});var Ft=T(ze()),Ld=T(sd());var H=T(ze());function ad(e,t,n){switch(n){case"volume":return im(e,t);case"bogo":return sm(e,t);case"fbt":case"mix-match":case"build-your-own":case"fixed":case"subscription":return ud(e,t);case"free-gift":case"gift":return um(e,t);default:return ud(e,t)}}function im(e,t){let n=t[0];if(!n)return Kl();let r=n.price,l=e.quantity,o=r*l,i,s=0;switch(e.discountType){case"percentage":i=o*(1-e.discountValue/100);break;case"fixed":i=Math.max(0,o-e.discountValue);break;case"fixed_price":i=e.discountValue;break;case"free":s=1,i=r*(l-1);break;default:i=o}i=de(i);let u=de(o-i),a=o>0?Math.round(u/o*100):0,d=de(i/l),m=[],f=n.variantId||"";for(let h=0;h<l;h++)m.push({variantId:f,quantity:1,price:h<l-s?d:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:`${a}%`}});return{originalPrice:o,bundlePrice:i,savingsAmount:u,savingsPercent:a,perUnitPrice:d,freeItemsCount:s,lineItems:m}}function sm(e,t){let n=t[0];if(!n)return Kl();let r=n.price,l=e.quantity,o=e.discountType==="free"?Math.floor(e.discountValue):0,i=l+o,s=de(r*i),u=de(r*l),a=de(s-u),d=s>0?Math.round(a/s*100):0,m=de(u/i),f=[],h=n.variantId||"";for(let w=0;w<i;w++)f.push({variantId:h,quantity:1,price:w<l?r:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:w>=l?"FREE":""}});return{originalPrice:s,bundlePrice:u,savingsAmount:a,savingsPercent:d,perUnitPrice:m,freeItemsCount:o,lineItems:f}}function ud(e,t){if(t.length===0)return Kl();let n=de(t.reduce((a,d)=>a+d.price*d.quantity,0)),r;switch(e.discountType){case"percentage":r=n*(1-e.discountValue/100);break;case"fixed":r=Math.max(0,n-e.discountValue);break;case"fixed_price":r=e.discountValue;break;default:r=n}r=de(r);let l=de(n-r),o=n>0?Math.round(l/n*100):0,i=t.reduce((a,d)=>a+d.quantity,0),s=i>0?de(r/i):0,u=t.map(a=>{let d=a.price*a.quantity,m=n>0?d/n:0,f=l*m;return{variantId:a.variantId||"",quantity:a.quantity,price:de(d-f),properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:`${o}%`}}});return{originalPrice:n,bundlePrice:r,savingsAmount:l,savingsPercent:o,perUnitPrice:s,freeItemsCount:0,lineItems:u}}function um(e,t){if(t.length===0)return Kl();let n=t.slice(0,-1),r=t[t.length-1],l=de(t.reduce((m,f)=>m+f.price*f.quantity,0)),o=de(n.reduce((m,f)=>m+f.price*f.quantity,0)),i=de(r?r.price*r.quantity:0),s=l>0?Math.round(i/l*100):0,u=t.reduce((m,f)=>m+f.quantity,0),a=u>0?de(o/u):0,d=t.map((m,f)=>({variantId:m.variantId||"",quantity:m.quantity,price:f<t.length-1?m.price*m.quantity:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:f===t.length-1?"FREE GIFT":""}}));return{originalPrice:l,bundlePrice:o,savingsAmount:i,savingsPercent:s,perUnitPrice:a,freeItemsCount:r?r.quantity:0,lineItems:d}}function Kl(){return{originalPrice:0,bundlePrice:0,savingsAmount:0,savingsPercent:0,perUnitPrice:0,freeItemsCount:0,lineItems:[]}}function de(e){return Math.round(e*100)/100}function am(e,t="${{amount}}"){let n=e/100,r={amount:n.toFixed(2),amount_no_decimals:Math.round(n).toString(),amount_with_comma_separator:n.toFixed(2).replace(".",",").replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1."),amount_no_decimals_with_comma_separator:Math.round(n).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1."),amount_with_apostrophe_separator:n.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1'"),amount_no_decimals_with_space_separator:Math.round(n).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1 "),amount_with_space_separator:n.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1 ")},l=t;for(let[o,i]of Object.entries(r))l=l.replace(`{{${o}}}`,i),l=l.replace(`{{ ${o} }}`,i);return l}function Re(e,t="${{amount}}"){return am(Math.round(e*100),t)}function cd(e){return e<=0?"":`${Math.round(e)}% OFF`}function dd(e,t){return`${Re(e,t)} each`}function fd(){if(typeof window>"u")return"desktop";let e=window.innerWidth;return e<768?"mobile":e<1024?"tablet":"desktop"}function pd(){if(typeof sessionStorage>"u")return"ssr_"+Math.random().toString(36).substring(2,11);let e="shopi_bundle_session",t=sessionStorage.getItem(e);return t||(t="sb_"+Math.random().toString(36).substring(2,11)+"_"+Date.now(),sessionStorage.setItem(e,t)),t}async function md(e){let t=await fetch("/cart/add.js",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:e.items})});if(!t.ok){let n=await t.text(),r="Failed to add to cart";try{let l=JSON.parse(n);r=l.description||l.message||r}catch{}throw new Error(r)}return t.json()}function cm(){document.dispatchEvent(new CustomEvent("cart:updated")),document.dispatchEvent(new CustomEvent("cart:refresh",{bubbles:!0}))}function gd(e){switch(cm(),e){case"redirect":window.location.href="/cart";break;case"drawer":document.dispatchEvent(new CustomEvent("cart:open")),document.dispatchEvent(new CustomEvent("theme:cart:open"));let t=document.querySelector('a[href="/cart"], .cart-icon-bubble, .site-header__cart, [data-cart-toggle]');t&&t.click();break;case"stay":break}}var qe=T(ze());function hd(e){let t=(0,qe.useRef)(pd()),n=(0,qe.useRef)(!1),r=(0,qe.useCallback)(d=>{var h;if(!e.analytics.enabled)return;let m=e.analytics.trackingEndpoint||"/apps/proxy/ai/events/track";fetch(m,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shop:((h=window.Shopify)==null?void 0:h.shop)||"",bundleId:d.bundleId,productId:d.productId||"",eventType:dm(d.eventName),sessionId:d.sessionId,metadata:{bundleType:d.bundleType,tierId:d.tierId,tierLabel:d.tierLabel,discountType:d.discountType,discountValue:d.discountValue,originalPrice:d.originalPrice,bundlePrice:d.bundlePrice,savingsAmount:d.savingsAmount,quantity:d.quantity,experimentId:d.experimentId,experimentVariant:d.experimentVariant,deviceType:d.deviceType}})}).catch(()=>{});let f=window.dataLayer;f&&f.push({event:`shopibundle_${d.eventName}`,bundle_id:d.bundleId,bundle_type:d.bundleType,tier_id:d.tierId,bundle_price:d.bundlePrice,savings_amount:d.savingsAmount})},[e.analytics]),l=(0,qe.useCallback)((d,m,f)=>({eventName:d,bundleId:e.id,bundleType:e.type,tierId:m==null?void 0:m.id,tierLabel:m==null?void 0:m.label,discountType:m==null?void 0:m.discountType,discountValue:m==null?void 0:m.discountValue,originalPrice:f==null?void 0:f.originalPrice,bundlePrice:f==null?void 0:f.bundlePrice,savingsAmount:f==null?void 0:f.savingsAmount,quantity:m==null?void 0:m.quantity,experimentId:e.analytics.experimentId,experimentVariant:e.analytics.experimentVariant,timestamp:Date.now(),sessionId:t.current,deviceType:fd()}),[e]),o=(0,qe.useCallback)(()=>{n.current||(n.current=!0,r(l("bundle_viewed")))},[l,r]),i=(0,qe.useCallback)((d,m)=>{r(l("tier_selected",d,m))},[l,r]),s=(0,qe.useCallback)((d,m)=>{r(l("add_to_cart_clicked",d,m))},[l,r]),u=(0,qe.useCallback)((d,m)=>{r(l("add_to_cart_success",d,m))},[l,r]),a=(0,qe.useCallback)((d,m)=>{let f=l("add_to_cart_failed",d);f.error=m,r(f)},[l,r]);return{trackView:o,trackTierSelect:i,trackAddToCart:s,trackAddToCartSuccess:u,trackAddToCartFailed:a}}function dm(e){return{bundle_viewed:"impression",tier_selected:"click",variant_changed:"click",add_to_cart_clicked:"add_to_cart",add_to_cart_success:"add_to_cart",add_to_cart_failed:"add_to_cart"}[e]||e}var ks=T(ze());var xr=T(B());function _d({savingsAmount:e,savingsPercent:t,moneyFormat:n,style:r="pill"}){if(e<=0)return null;let l=Re(e,n),o=cd(t);return(0,xr.jsxs)("span",{className:`sb-savings-badge sb-savings-badge--${r}`,"aria-label":`Save ${l} (${o})`,children:[(0,xr.jsx)("span",{className:"sb-savings-badge__percent",children:o}),(0,xr.jsxs)("span",{className:"sb-savings-badge__amount",children:["Save ",l]})]})}var K=T(B());function kd({tier:e,selected:t,disabled:n,moneyFormat:r,locale:l,visual:o,pricing:i,onSelect:s}){let u=(0,ks.useCallback)(()=>{n||s(e.id)},[e.id,n,s]),a=(0,ks.useCallback)(h=>{(h.key==="Enter"||h.key===" ")&&!n&&(h.preventDefault(),s(e.id))},[e.id,n,s]),d=i.savingsAmount>0,m=e.badge||(e.isDefault?"Most Popular":""),f=e.badgeColor||(e.isDefault?"#ff6b35":"#4CAF50");return(0,K.jsxs)("div",{role:"radio","aria-checked":t,"aria-label":`${e.label}: ${Re(i.bundlePrice,r)}${d?`, save ${Re(i.savingsAmount,r)}`:""}`,tabIndex:0,className:["sb-offer",t&&"sb-offer--selected",n&&"sb-offer--disabled",e.isDefault&&"sb-offer--default",d&&"sb-offer--has-savings"].filter(Boolean).join(" "),onClick:u,onKeyDown:a,style:t&&o.primaryColor?{"--sb-primary":o.primaryColor}:void 0,children:[m&&(0,K.jsx)("div",{className:`sb-offer__badge sb-offer__badge--${o.badgeStyle}`,style:{backgroundColor:f},children:m}),(0,K.jsx)("div",{className:"sb-offer__radio",children:(0,K.jsx)("div",{className:"sb-offer__radio-dot"})}),(0,K.jsxs)("div",{className:"sb-offer__content",children:[(0,K.jsxs)("div",{className:"sb-offer__header",children:[(0,K.jsx)("span",{className:"sb-offer__label",children:e.label}),e.subtitle&&(0,K.jsx)("span",{className:"sb-offer__subtitle",children:e.subtitle})]}),(0,K.jsxs)("div",{className:"sb-offer__pricing",children:[(0,K.jsx)("span",{className:"sb-offer__price",children:Re(i.bundlePrice,r)}),o.showCompareAtPrice&&d&&(0,K.jsx)("span",{className:"sb-offer__compare-price",children:Re(i.originalPrice,r)}),o.showPerUnitPrice&&e.quantity>1&&(0,K.jsx)("span",{className:"sb-offer__per-unit",children:dd(i.perUnitPrice,r)})]}),d&&(o.showSavingsAmount||o.showSavingsPercent)&&(0,K.jsx)("div",{className:"sb-offer__savings",children:(0,K.jsx)(_d,{savingsAmount:i.savingsAmount,savingsPercent:i.savingsPercent,currency:"",moneyFormat:r,locale:l,style:o.badgeStyle})}),i.freeItemsCount>0&&(0,K.jsxs)("div",{className:"sb-offer__free-tag",children:["+",i.freeItemsCount," FREE"]})]}),t&&(0,K.jsx)("div",{className:"sb-offer__check","aria-hidden":"true",children:(0,K.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[(0,K.jsx)("circle",{cx:"10",cy:"10",r:"10",fill:"currentColor"}),(0,K.jsx)("path",{d:"M6 10l3 3 5-6",stroke:"#fff",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})})]})}var Gl=T(ze());var Yl=T(ze()),nt=T(B());function Sd({variants:e,selectedVariantId:t,onSelect:n,layout:r="dropdown"}){if(!e||e.length<=1)return null;let l=(0,Yl.useCallback)(u=>{n(u.target.value)},[n]),o=(0,Yl.useCallback)(u=>{n(u)},[n]),i=(0,Yl.useCallback)((u,a)=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),n(a))},[n]),s=ym(e);return r==="swatches"&&s.length>0?(0,nt.jsx)("div",{className:"sb-variant-selector sb-variant-selector--swatches",children:s.map(u=>(0,nt.jsxs)("div",{className:"sb-variant-group",children:[(0,nt.jsx)("span",{className:"sb-variant-group__label",children:u.name}),(0,nt.jsx)("div",{className:"sb-variant-group__options",role:"radiogroup","aria-label":u.name,children:u.values.map(a=>{let d=e.find(h=>h.options.some(w=>w.name===u.name&&w.value===a)),m=(d==null?void 0:d.id)===t,f=(d==null?void 0:d.available)!==!1;return(0,nt.jsx)("button",{type:"button",role:"radio","aria-checked":m,"aria-label":`${u.name}: ${a}`,className:["sb-swatch",m&&"sb-swatch--selected",!f&&"sb-swatch--unavailable"].filter(Boolean).join(" "),onClick:()=>d&&o(d.id),onKeyDown:h=>d&&i(h,d.id),disabled:!f,children:a},a)})})]},u.name))}):(0,nt.jsx)("div",{className:"sb-variant-selector sb-variant-selector--dropdown",children:(0,nt.jsx)("select",{className:"sb-variant-select",value:t||"",onChange:l,"aria-label":"Select variant",children:e.map(u=>(0,nt.jsxs)("option",{value:u.id,disabled:!u.available,children:[u.title,u.available?"":" (Sold out)"]},u.id))})})}function ym(e){let t=new Map;for(let n of e)for(let r of n.options)t.has(r.name)||t.set(r.name,new Set),t.get(r.name).add(r.value);return Array.from(t.entries()).map(([n,r])=>({name:n,values:Array.from(r)}))}var be=T(B());function xd({product:e,size:t,showPrice:n,onVariantChange:r}){var a,d;let[l,o]=(0,Gl.useState)(e.variantId||((d=(a=e.variants)==null?void 0:a[0])==null?void 0:d.id)),i=(0,Gl.useCallback)(m=>{o(m),r==null||r(e.productId,m)},[e.productId,r]),s=!e.available,u=t==="small"?80:t==="medium"?120:180;return(0,be.jsxs)("div",{className:`sb-product sb-product--${t} ${s?"sb-product--oos":""}`,children:[e.imageUrl&&(0,be.jsxs)("div",{className:"sb-product__image-wrap",children:[(0,be.jsx)("img",{className:"sb-product__image",src:e.imageUrl,alt:e.imageAlt||e.title,width:u,height:u,loading:"lazy"}),s&&(0,be.jsx)("span",{className:"sb-product__oos-overlay",children:"Sold out"})]}),(0,be.jsxs)("div",{className:"sb-product__info",children:[(0,be.jsx)("p",{className:"sb-product__title",children:e.title}),n&&(0,be.jsxs)("p",{className:"sb-product__price",children:[e.compareAtPrice&&e.compareAtPrice>e.price&&(0,be.jsxs)("span",{className:"sb-product__compare-price",children:["$",e.compareAtPrice.toFixed(2)]}),(0,be.jsxs)("span",{children:["$",e.price.toFixed(2)]})]}),e.quantity>1&&(0,be.jsxs)("span",{className:"sb-product__qty",children:["\xD7",e.quantity]})]}),r&&e.variants&&e.variants.length>1&&(0,be.jsx)(Sd,{variants:e.variants,selectedVariantId:l,onSelect:i,layout:"swatches"})]})}var Jt=T(B());function Ed({current:e,target:t,label:n,color:r}){if(t<=0)return null;let l=Math.min(100,Math.round(e/t*100)),o=t-e;return(0,Jt.jsxs)("div",{className:"sb-progress",role:"progressbar","aria-valuenow":l,"aria-valuemin":0,"aria-valuemax":100,"aria-label":n,children:[(0,Jt.jsx)("div",{className:"sb-progress__label",children:n}),(0,Jt.jsx)("div",{className:"sb-progress__track",children:(0,Jt.jsx)("div",{className:"sb-progress__fill",style:{width:`${l}%`,backgroundColor:r||void 0}})}),o>0&&(0,Jt.jsxs)("div",{className:"sb-progress__hint",children:["Add ",o," more to unlock!"]})]})}var Cd=T(ze());var X=T(B());function Pd({products:e,selectedProducts:t,minSelect:n,maxSelect:r,onToggle:l,onQuantityChange:o,currency:i,moneyFormat:s,showPrice:u}){let a=Array.from(t.values()).reduce((f,h)=>f+h,0),d=a<r,m=(0,Cd.useCallback)(f=>{t.has(f)?l(f,!1):d&&l(f,!0)},[t,d,l]);return(0,X.jsxs)("div",{className:"sb-selector",role:"group","aria-label":"Select products for your bundle",children:[(0,X.jsxs)("div",{className:"sb-selector__header",children:[(0,X.jsxs)("span",{className:"sb-selector__count",children:[a," of ",r," selected",n>0&&` (min ${n})`]}),!d&&(0,X.jsx)("span",{className:"sb-selector__limit",children:"Maximum reached"})]}),(0,X.jsx)("div",{className:"sb-selector__grid",children:e.map(f=>{let h=t.has(f.productId),w=t.get(f.productId)||0,k=!f.available||!h&&!d;return(0,X.jsxs)("div",{className:`sb-selector__item ${h?"sb-selector__item--selected":""} ${k?"sb-selector__item--disabled":""}`,role:"checkbox","aria-checked":h,"aria-disabled":k,tabIndex:k?-1:0,onClick:()=>!k&&m(f.productId),onKeyDown:z=>{(z.key==="Enter"||z.key===" ")&&!k&&(z.preventDefault(),m(f.productId))},children:[f.imageUrl&&(0,X.jsx)("img",{className:"sb-selector__image",src:f.imageUrl,alt:f.imageAlt||f.title,loading:"lazy",width:"80",height:"80"}),(0,X.jsxs)("div",{className:"sb-selector__info",children:[(0,X.jsx)("span",{className:"sb-selector__title",children:f.title}),u&&(0,X.jsx)("span",{className:"sb-selector__price",children:Re(f.price,s)}),!f.available&&(0,X.jsx)("span",{className:"sb-selector__oos",children:"Out of stock"})]}),h&&(0,X.jsx)("div",{className:"sb-selector__check","aria-hidden":"true",children:(0,X.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:(0,X.jsx)("path",{d:"M13.5 4.5L6.5 11.5L2.5 7.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})}),h&&w>0&&(0,X.jsxs)("div",{className:"sb-selector__qty",onClick:z=>z.stopPropagation(),children:[(0,X.jsx)("button",{type:"button",className:"sb-selector__qty-btn",onClick:()=>o(f.productId,Math.max(1,w-1)),"aria-label":`Decrease quantity for ${f.title}`,children:"-"}),(0,X.jsx)("span",{className:"sb-selector__qty-value",children:w}),(0,X.jsx)("button",{type:"button",className:"sb-selector__qty-btn",onClick:()=>{a-w+(w+1)<=r&&o(f.productId,w+1)},disabled:a>=r,"aria-label":`Increase quantity for ${f.title}`,children:"+"})]})]},f.productId)})})]})}var Ss=T(ze()),rt=T(B());function Nd({value:e,min:t,max:n,onChange:r,disabled:l=!1,size:o="medium"}){let i=(0,Ss.useCallback)(()=>{e>t&&r(e-1)},[e,t,r]),s=(0,Ss.useCallback)(()=>{e<n&&r(e+1)},[e,n,r]);return(0,rt.jsxs)("div",{className:`sb-qty sb-qty--${o}`,role:"group","aria-label":"Quantity selector",children:[(0,rt.jsx)("button",{type:"button",className:"sb-qty__btn sb-qty__btn--minus",onClick:i,disabled:l||e<=t,"aria-label":"Decrease quantity",children:(0,rt.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:(0,rt.jsx)("path",{d:"M2 6H10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}),(0,rt.jsx)("span",{className:"sb-qty__value","aria-live":"polite","aria-atomic":"true",children:e}),(0,rt.jsx)("button",{type:"button",className:"sb-qty__btn sb-qty__btn--plus",onClick:s,disabled:l||e>=n,"aria-label":"Increase quantity",children:(0,rt.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:(0,rt.jsx)("path",{d:"M6 2V10M2 6H10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]})}var ne=T(B());function Er({title:e,description:t,icon:n="bundle"}){return(0,ne.jsxs)("div",{className:"sb-empty",role:"status",children:[(0,ne.jsx)("div",{className:"sb-empty__icon",children:{bundle:(0,ne.jsxs)("svg",{width:"48",height:"48",viewBox:"0 0 48 48",fill:"none","aria-hidden":"true",children:[(0,ne.jsx)("rect",{x:"8",y:"16",width:"32",height:"24",rx:"3",stroke:"currentColor",strokeWidth:"2"}),(0,ne.jsx)("path",{d:"M8 22H40",stroke:"currentColor",strokeWidth:"2"}),(0,ne.jsx)("path",{d:"M20 16V40M28 16V40",stroke:"currentColor",strokeWidth:"2"}),(0,ne.jsx)("path",{d:"M16 8L24 16L32 8",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}),search:(0,ne.jsxs)("svg",{width:"48",height:"48",viewBox:"0 0 48 48",fill:"none","aria-hidden":"true",children:[(0,ne.jsx)("circle",{cx:"22",cy:"22",r:"12",stroke:"currentColor",strokeWidth:"2"}),(0,ne.jsx)("path",{d:"M31 31L40 40",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}),error:(0,ne.jsxs)("svg",{width:"48",height:"48",viewBox:"0 0 48 48",fill:"none","aria-hidden":"true",children:[(0,ne.jsx)("circle",{cx:"24",cy:"24",r:"18",stroke:"currentColor",strokeWidth:"2"}),(0,ne.jsx)("path",{d:"M24 16V28",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),(0,ne.jsx)("circle",{cx:"24",cy:"34",r:"1.5",fill:"currentColor"})]})}[n]}),(0,ne.jsx)("p",{className:"sb-empty__title",children:e}),t&&(0,ne.jsx)("p",{className:"sb-empty__desc",children:t})]})}var ke=T(B());function Td({message:e,onDismiss:t,retryAction:n}){return(0,ke.jsxs)("div",{className:"sb-error",role:"alert",children:[(0,ke.jsxs)("div",{className:"sb-error__content",children:[(0,ke.jsxs)("svg",{className:"sb-error__icon",width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:[(0,ke.jsx)("circle",{cx:"8",cy:"8",r:"7",stroke:"currentColor",strokeWidth:"1.5"}),(0,ke.jsx)("path",{d:"M8 4.5V9",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),(0,ke.jsx)("circle",{cx:"8",cy:"11.5",r:"0.75",fill:"currentColor"})]}),(0,ke.jsx)("span",{className:"sb-error__message",children:e})]}),(0,ke.jsxs)("div",{className:"sb-error__actions",children:[n&&(0,ke.jsx)("button",{type:"button",className:"sb-error__retry",onClick:n,children:"Retry"}),t&&(0,ke.jsx)("button",{type:"button",className:"sb-error__dismiss",onClick:t,"aria-label":"Dismiss error",children:(0,ke.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:(0,ke.jsx)("path",{d:"M2 2L10 10M10 2L2 10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})})]})]})}var I=T(B());function xs({config:e,onAddToCart:t,className:n}){let{tiers:r,products:l,visual:o,settings:i}=e,s=hd(e),u=(0,H.useMemo)(()=>r.find(R=>R.isDefault)||r[0],[r]),[a,d]=(0,H.useState)((u==null?void 0:u.id)||""),[m,f]=(0,H.useState)("idle"),[h,w]=(0,H.useState)(""),[k,z]=(0,H.useState)(()=>{let R={};for(let D of l)D.variantId&&(R[D.productId]=D.variantId);return R}),[p,c]=(0,H.useState)(()=>new Map),[g,y]=(0,H.useState)(1),_=(0,H.useMemo)(()=>r.find(R=>R.id===a)||u,[r,a,u]),E=(0,H.useMemo)(()=>{let R={};for(let D of r)R[D.id]=ad(D,l,e.type);return R},[r,l,e.type]),x=_?E[_.id]:void 0;(0,H.useEffect)(()=>{s.trackView()},[s]);let C=(0,H.useMemo)(()=>{if(!_)return null;let R=r.findIndex(D=>D.id===_.id);return R<r.length-1?r[R+1]:null},[r,_]),q=(0,H.useCallback)(R=>{d(R),f("idle"),w("");let D=r.find(Y=>Y.id===R);D&&s.trackTierSelect(D,E[R])},[r,E,s]),N=(0,H.useCallback)((R,D)=>{z(Y=>({...Y,[R]:D}))},[]),Ye=(0,H.useCallback)((R,D)=>{c(Y=>{let Se=new Map(Y);return D?Se.set(R,1):Se.delete(R),Se})},[]),Jl=(0,H.useCallback)((R,D)=>{c(Y=>{let Se=new Map(Y);return D<=0?Se.delete(R):Se.set(R,D),Se})},[]),Cs=(0,H.useCallback)(async()=>{if(!_||!x)return;f("loading"),w(""),s.trackAddToCart(_,x);let D={items:x.lineItems.map(Y=>{var Ps;let Se=Object.entries(k).find(([,eo])=>eo);return{...Y,variantId:k[((Ps=l.find(eo=>eo.variantId===Y.variantId))==null?void 0:Ps.productId)||""]||Y.variantId,properties:{...Y.properties,_bundle_id:e.id,..._!=null&&_.id?{_bundle_tier:_.id}:{}}}}).map(Y=>({...Y,variantId:_m(Y.variantId)}))};try{t?await t(D):await md(D),f("success"),s.trackAddToCartSuccess(_,x),setTimeout(()=>{gd(i.addToCartBehavior)},600)}catch(Y){let Se=Y instanceof Error?Y.message:"Failed to add to cart";w(Se),f("error"),s.trackAddToCartFailed(_,Se),setTimeout(()=>{f("idle"),w("")},3e3)}},[_,x,k,l,e.id,i.addToCartBehavior,t,s]);if(!r.length&&!l.length)return(0,I.jsx)(Er,{title:"No bundle available",description:"This bundle is not currently active."});if(!l.length)return(0,I.jsx)(Er,{title:"No products found",description:"The products in this bundle are unavailable.",icon:"search"});let Id=(e.type==="fbt"||e.type==="mix-match"||e.type==="build-your-own"||e.type==="fixed"||e.type==="free-gift"||e.type==="gift")&&o.showProductImages,Md=(e.type==="mix-match"||e.type==="build-your-own")&&e.selectionRules,Od=wm(m,x,i.currency);return(0,I.jsxs)("div",{className:`sb-widget sb-widget--${o.layout} sb-widget--${o.colorScheme} ${n||""}`,role:"group","aria-label":e.title,children:[(0,I.jsxs)("div",{className:"sb-widget__header",children:[(0,I.jsx)("h3",{className:"sb-widget__title",children:e.title}),e.subtitle&&(0,I.jsx)("p",{className:"sb-widget__subtitle",children:e.subtitle})]}),Id&&(0,I.jsx)("div",{className:"sb-widget__products",children:l.map((R,D)=>(0,I.jsxs)(H.default.Fragment,{children:[D>0&&(0,I.jsx)("span",{className:"sb-widget__plus","aria-hidden":"true",children:"+"}),(0,I.jsx)(xd,{product:R,size:o.imageSize,showPrice:e.type!=="volume",onVariantChange:i.allowVariantSelection?N:void 0})]},R.productId))}),Md&&e.selectionRules&&(0,I.jsx)(Pd,{products:e.selectionRules.productPool||l,selectedProducts:p,minSelect:e.selectionRules.minProducts,maxSelect:e.selectionRules.maxProducts,onToggle:Ye,onQuantityChange:Jl,currency:i.currency,moneyFormat:i.moneyFormat,showPrice:!0}),i.showQuantitySelector&&(0,I.jsxs)("div",{className:"sb-widget__quantity",children:[(0,I.jsx)("span",{className:"sb-widget__quantity-label",children:"Quantity:"}),(0,I.jsx)(Nd,{value:g,min:i.minQuantity||1,max:i.maxQuantity,onChange:y})]}),(0,I.jsx)("div",{className:"sb-widget__offers",role:"radiogroup","aria-label":"Select bundle option",children:r.map(R=>{let D=E[R.id],Y=!l.every(Se=>Se.available)&&i.outOfStockBehavior==="disable";return(0,I.jsx)(kd,{tier:R,products:l,selected:R.id===a,disabled:Y,currency:i.currency,moneyFormat:i.moneyFormat,locale:i.locale,visual:o,pricing:D,onSelect:q},R.id)})}),o.showProgressBar&&C&&_&&(0,I.jsx)(Ed,{current:_.quantity,target:C.quantity,label:`Add ${C.quantity-_.quantity} more for ${C.badge||"extra savings"}!`,color:o.accentColor}),(0,I.jsxs)("div",{className:"sb-widget__footer",children:[x&&(0,I.jsxs)("div",{className:"sb-widget__total",children:[(0,I.jsx)("span",{className:"sb-widget__total-label",children:"Total:"}),(0,I.jsxs)("div",{className:"sb-widget__total-prices",children:[x.savingsAmount>0&&(0,I.jsx)("span",{className:"sb-widget__total-original",children:Re(x.originalPrice,i.moneyFormat)}),(0,I.jsx)("span",{className:"sb-widget__total-price",children:Re(x.bundlePrice,i.moneyFormat)})]})]}),(0,I.jsxs)("button",{type:"button",className:`sb-widget__cta sb-widget__cta--${m}`,onClick:Cs,disabled:m==="loading"||m==="success","aria-busy":m==="loading",children:[m==="loading"&&(0,I.jsx)("span",{className:"sb-spinner","aria-hidden":"true"}),Od]}),h&&(0,I.jsx)(Td,{message:h,onDismiss:()=>{w(""),f("idle")},retryAction:Cs})]})]})}function wm(e,t,n){switch(e){case"loading":return"Adding...";case"success":return"Added to Cart!";case"error":return"Try Again";default:return t&&t.savingsAmount>0?`Add to Cart \u2014 Save $${t.savingsAmount.toFixed(2)}`:"Add to Cart"}}function _m(e){if(e.startsWith("gid://")){let t=e.split("/");return t[t.length-1]}return e}var Be=T(B());function Es(){return(0,Be.jsxs)("div",{className:"sb-skeleton",role:"status","aria-label":"Loading bundle offers",children:[(0,Be.jsx)("div",{className:"sb-skeleton__title"}),(0,Be.jsx)("div",{className:"sb-skeleton__cards",children:[0,1,2].map(e=>(0,Be.jsxs)("div",{className:"sb-skeleton__card",children:[(0,Be.jsx)("div",{className:"sb-skeleton__badge"}),(0,Be.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--short"}),(0,Be.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--medium"}),(0,Be.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--long"}),(0,Be.jsx)("div",{className:"sb-skeleton__btn"})]},e))}),(0,Be.jsx)("span",{className:"sb-sr-only",children:"Loading..."})]})}var Rd=T(ze()),Xl=class extends Rd.Component{constructor(t){super(t),this.state={hasError:!1,error:null}}static getDerivedStateFromError(t){return{hasError:!0,error:t}}componentDidCatch(t,n){var r,l,o;console.error("[ShopiBundle] Widget error:",t,n);try{let i=((r=window.Shopify)==null?void 0:r.shop)||"";i&&fetch("/apps/proxy/ai/events/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shop:i,bundleId:"widget-error",productId:"",eventType:"error",metadata:{message:t.message,stack:(l=t.stack)==null?void 0:l.substring(0,500),componentStack:(o=n.componentStack)==null?void 0:o.substring(0,500)}})}).catch(()=>{})}catch{}}render(){return this.state.hasError?this.props.fallback||null:this.props.children}};var bd=`/**
 * ShopiBundle React Widget - Rapi-Style CSS
 *
 * Design principles:
 * - Mobile-first responsive
 * - Strong savings emphasis (color, size, badges)
 * - Clear visual hierarchy for tier selection
 * - Zero layout shift (fixed dimensions where possible)
 * - Touch-friendly targets (min 44px)
 * - WCAG 2.1 AA compliant contrast
 * - Scoped with sb- prefix to prevent conflicts
 */

/* ============================================
   CSS CUSTOM PROPERTIES
   ============================================ */

.sb-widget {
  --sb-primary: #2c6ecb;
  --sb-primary-hover: #1a5bb5;
  --sb-accent: #ff6b35;
  --sb-success: #008060;
  --sb-error: #d72c0d;
  --sb-savings: #008060;
  --sb-text: #1a1a1a;
  --sb-text-muted: #6b7280;
  --sb-text-light: #9ca3af;
  --sb-bg: #ffffff;
  --sb-bg-selected: #f0f7ff;
  --sb-bg-hover: #f9fafb;
  --sb-border: #e5e7eb;
  --sb-border-selected: var(--sb-primary);
  --sb-radius: 12px;
  --sb-radius-sm: 8px;
  --sb-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  --sb-shadow-selected: 0 0 0 2px var(--sb-primary), 0 4px 12px rgba(44, 110, 203, 0.15);
  --sb-font: inherit;
  --sb-transition: 0.2s ease;
}

/* High contrast color scheme */
.sb-widget--high-contrast {
  --sb-primary: #000000;
  --sb-primary-hover: #333333;
  --sb-border-selected: #000000;
  --sb-bg-selected: #f5f5f5;
  --sb-savings: #d72c0d;
  --sb-shadow-selected: 0 0 0 3px #000000;
}

/* Minimal color scheme */
.sb-widget--minimal {
  --sb-primary: #6b7280;
  --sb-border: #f3f4f6;
  --sb-shadow: none;
  --sb-shadow-selected: 0 0 0 2px var(--sb-primary);
  --sb-radius: 8px;
}

/* ============================================
   WIDGET CONTAINER
   ============================================ */

.sb-widget {
  box-sizing: border-box;
  font-family: var(--sb-font);
  color: var(--sb-text);
  max-width: 680px;
  margin: 1.5rem 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.sb-widget *,
.sb-widget *::before,
.sb-widget *::after {
  box-sizing: border-box;
}

/* ============================================
   HEADER
   ============================================ */

.sb-widget__header {
  margin-bottom: 1rem;
}

.sb-widget__title {
  font-size: clamp(1.125rem, 3vw, 1.375rem);
  font-weight: 700;
  color: var(--sb-text);
  margin: 0 0 0.25rem;
  line-height: 1.3;
}

.sb-widget__subtitle {
  font-size: 0.875rem;
  color: var(--sb-text-muted);
  margin: 0;
  line-height: 1.4;
}

/* ============================================
   PRODUCT THUMBNAILS (FBT / Mix-Match)
   ============================================ */

.sb-widget__products {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.sb-widget__plus {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--sb-text-muted);
  flex-shrink: 0;
  line-height: 1;
}

.sb-product {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  text-align: center;
  position: relative;
}

.sb-product--small { max-width: 90px; }
.sb-product--medium { max-width: 130px; }
.sb-product--large { max-width: 180px; }

.sb-product__image-wrap {
  position: relative;
  border-radius: var(--sb-radius-sm);
  overflow: hidden;
  background: #f9fafb;
}

.sb-product__image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform var(--sb-transition);
}

.sb-product:hover .sb-product__image {
  transform: scale(1.05);
}

.sb-product--oos {
  opacity: 0.5;
}

.sb-product__oos-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sb-product__info {
  width: 100%;
}

.sb-product__title {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--sb-text);
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sb-product__price {
  font-size: 0.75rem;
  color: var(--sb-text-muted);
  margin: 0;
}

.sb-product__compare-price {
  text-decoration: line-through;
  color: var(--sb-text-light);
  margin-right: 0.25rem;
}

.sb-product__qty {
  font-size: 0.6875rem;
  color: var(--sb-text-muted);
  font-weight: 600;
}

/* ============================================
   OFFER CARDS (Tier Selection)
   ============================================ */

.sb-widget__offers {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.sb-offer {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 2px solid var(--sb-border);
  border-radius: var(--sb-radius);
  background: var(--sb-bg);
  cursor: pointer;
  transition: all var(--sb-transition);
  min-height: 56px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.sb-offer:hover:not(.sb-offer--disabled) {
  border-color: var(--sb-primary);
  background: var(--sb-bg-hover);
  box-shadow: var(--sb-shadow);
}

.sb-offer--selected {
  border-color: var(--sb-border-selected);
  background: var(--sb-bg-selected);
  box-shadow: var(--sb-shadow-selected);
}

.sb-offer--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sb-offer--default {
  order: -1;
}

/* Focus visible for keyboard navigation */
.sb-offer:focus-visible {
  outline: 2px solid var(--sb-primary);
  outline-offset: 2px;
}

/* ============================================
   OFFER BADGE
   ============================================ */

.sb-offer__badge {
  position: absolute;
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1;
  white-space: nowrap;
}

.sb-offer__badge--pill {
  top: -0.625rem;
  left: 1rem;
  padding: 0.25rem 0.625rem;
  border-radius: 100px;
}

.sb-offer__badge--ribbon {
  top: 0;
  right: 0;
  padding: 0.25rem 0.75rem 0.25rem 0.5rem;
  border-radius: 0 var(--sb-radius) 0 var(--sb-radius-sm);
}

.sb-offer__badge--banner {
  top: -1px;
  left: -1px;
  right: -1px;
  text-align: center;
  padding: 0.3rem 0.5rem;
  border-radius: var(--sb-radius) var(--sb-radius) 0 0;
  font-size: 0.75rem;
}

/* When banner badge, add top padding to card */
.sb-offer:has(.sb-offer__badge--banner) {
  padding-top: 2rem;
}

/* ============================================
   RADIO INDICATOR
   ============================================ */

.sb-offer__radio {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: 2px solid var(--sb-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--sb-transition);
}

.sb-offer--selected .sb-offer__radio {
  border-color: var(--sb-primary);
}

.sb-offer__radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
  transition: background var(--sb-transition);
}

.sb-offer--selected .sb-offer__radio-dot {
  background: var(--sb-primary);
}

/* ============================================
   OFFER CONTENT
   ============================================ */

.sb-offer__content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 0.75rem;
  min-width: 0;
}

.sb-offer__header {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 80px;
}

.sb-offer__label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--sb-text);
  line-height: 1.2;
}

.sb-offer__subtitle {
  font-size: 0.75rem;
  color: var(--sb-text-muted);
  line-height: 1.2;
}

.sb-offer__pricing {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-left: auto;
}

.sb-offer__price {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--sb-text);
}

.sb-offer--has-savings .sb-offer__price {
  color: var(--sb-savings);
}

.sb-offer__compare-price {
  font-size: 0.8125rem;
  color: var(--sb-text-light);
  text-decoration: line-through;
}

.sb-offer__per-unit {
  font-size: 0.75rem;
  color: var(--sb-text-muted);
}

/* ============================================
   SAVINGS BADGE
   ============================================ */

.sb-offer__savings {
  flex-basis: 100%;
}

.sb-savings-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

.sb-savings-badge--pill {
  background: linear-gradient(135deg, var(--sb-savings), #00a67e);
  color: #fff;
  padding: 0.25rem 0.625rem;
  border-radius: 100px;
}

.sb-savings-badge--ribbon {
  background: var(--sb-savings);
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.sb-savings-badge--banner {
  color: var(--sb-savings);
  background: none;
  padding: 0;
}

.sb-savings-badge__percent {
  font-weight: 700;
}

.sb-savings-badge__amount {
  font-weight: 500;
}

/* ============================================
   FREE TAG
   ============================================ */

.sb-offer__free-tag {
  background: var(--sb-accent);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

/* ============================================
   CHECK MARK
   ============================================ */

.sb-offer__check {
  flex-shrink: 0;
  color: var(--sb-primary);
  display: flex;
  align-items: center;
}

/* ============================================
   PROGRESS BAR
   ============================================ */

.sb-progress {
  margin-bottom: 1rem;
  text-align: center;
}

.sb-progress__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--sb-text-muted);
  margin-bottom: 0.375rem;
}

.sb-progress__track {
  width: 100%;
  height: 8px;
  background: var(--sb-border);
  border-radius: 100px;
  overflow: hidden;
}

.sb-progress__fill {
  height: 100%;
  background: var(--sb-accent);
  border-radius: 100px;
  transition: width 0.4s ease;
}

.sb-progress__hint {
  font-size: 0.75rem;
  color: var(--sb-accent);
  font-weight: 600;
  margin-top: 0.25rem;
}

/* ============================================
   FOOTER (Total + CTA)
   ============================================ */

.sb-widget__footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sb-widget__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.25rem;
}

.sb-widget__total-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--sb-text);
}

.sb-widget__total-prices {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.sb-widget__total-original {
  font-size: 0.875rem;
  color: var(--sb-text-light);
  text-decoration: line-through;
}

.sb-widget__total-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--sb-savings);
}

/* ============================================
   CTA BUTTON
   ============================================ */

.sb-widget__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  min-height: 52px;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: var(--sb-radius-sm);
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--sb-font);
  cursor: pointer;
  transition: all var(--sb-transition);
  -webkit-tap-highlight-color: transparent;
}

.sb-widget__cta--idle {
  background: var(--sb-primary);
  color: #fff;
}

.sb-widget__cta--idle:hover {
  background: var(--sb-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44, 110, 203, 0.25);
}

.sb-widget__cta--idle:active {
  transform: translateY(0);
}

.sb-widget__cta--loading {
  background: var(--sb-primary);
  color: #fff;
  opacity: 0.85;
  cursor: wait;
}

.sb-widget__cta--success {
  background: var(--sb-success);
  color: #fff;
  cursor: default;
}

.sb-widget__cta--error {
  background: var(--sb-error);
  color: #fff;
}

.sb-widget__cta:focus-visible {
  outline: 2px solid var(--sb-primary);
  outline-offset: 2px;
}

.sb-widget__cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Spinner */
.sb-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: sb-spin 0.6s linear infinite;
}

@keyframes sb-spin {
  to { transform: rotate(360deg); }
}

/* Error message */
.sb-widget__error {
  font-size: 0.8125rem;
  color: var(--sb-error);
  margin: 0;
  text-align: center;
}

/* ============================================
   VARIANT SELECTOR
   ============================================ */

.sb-variant-selector {
  width: 100%;
  margin-top: 0.25rem;
}

.sb-variant-group {
  margin-bottom: 0.25rem;
}

.sb-variant-group__label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--sb-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.25rem;
}

.sb-variant-group__options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.sb-swatch {
  min-width: 28px;
  min-height: 28px;
  padding: 0.125rem 0.375rem;
  border: 1.5px solid var(--sb-border);
  border-radius: 6px;
  background: var(--sb-bg);
  font-size: 0.6875rem;
  font-weight: 500;
  font-family: var(--sb-font);
  cursor: pointer;
  transition: all var(--sb-transition);
  color: var(--sb-text);
}

.sb-swatch:hover:not(:disabled) {
  border-color: var(--sb-primary);
}

.sb-swatch--selected {
  border-color: var(--sb-primary);
  background: var(--sb-bg-selected);
  font-weight: 600;
}

.sb-swatch--unavailable {
  opacity: 0.4;
  text-decoration: line-through;
  cursor: not-allowed;
}

.sb-variant-select {
  width: 100%;
  padding: 0.375rem 0.5rem;
  border: 1.5px solid var(--sb-border);
  border-radius: 6px;
  font-size: 0.75rem;
  font-family: var(--sb-font);
  color: var(--sb-text);
  background: var(--sb-bg);
  cursor: pointer;
}

/* ============================================
   SKELETON LOADER
   ============================================ */

.sb-skeleton {
  max-width: 680px;
  margin: 1.5rem 0;
}

.sb-skeleton__title {
  height: 24px;
  width: 60%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: sb-shimmer 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.sb-skeleton__cards {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.sb-skeleton__card {
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 1rem;
}

.sb-skeleton__badge {
  height: 16px;
  width: 80px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: sb-shimmer 1.5s infinite;
  border-radius: 100px;
  margin-bottom: 0.5rem;
}

.sb-skeleton__line {
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: sb-shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.375rem;
}

.sb-skeleton__line--short { width: 30%; }
.sb-skeleton__line--medium { width: 50%; }
.sb-skeleton__line--long { width: 70%; }

.sb-skeleton__btn {
  height: 48px;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: sb-shimmer 1.5s infinite;
  border-radius: 8px;
  margin-top: 0.5rem;
}

@keyframes sb-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Screen reader only */
.sb-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 640px) {
  .sb-widget {
    margin: 1rem 0;
  }

  .sb-offer {
    padding: 0.75rem;
    gap: 0.625rem;
  }

  .sb-offer__content {
    gap: 0.25rem 0.5rem;
  }

  .sb-offer__label {
    font-size: 0.875rem;
  }

  .sb-offer__price {
    font-size: 1rem;
  }

  .sb-widget__cta {
    min-height: 48px;
    font-size: 0.9375rem;
  }

  .sb-widget__products {
    gap: 0.375rem;
  }

  .sb-product--medium { max-width: 100px; }
  .sb-product--large { max-width: 140px; }
}

@media (max-width: 380px) {
  .sb-offer__pricing {
    flex-direction: column;
    gap: 0.125rem;
    align-items: flex-end;
  }

  .sb-offer__per-unit {
    font-size: 0.6875rem;
  }
}

/* ============================================
   CARDS LAYOUT VARIANT
   ============================================ */

.sb-widget--cards .sb-widget__offers {
  flex-direction: row;
  flex-wrap: wrap;
}

.sb-widget--cards .sb-offer {
  flex: 1 1 calc(33.333% - 0.5rem);
  min-width: 160px;
  flex-direction: column;
  text-align: center;
  padding: 1.25rem 1rem;
}

.sb-widget--cards .sb-offer__radio {
  display: none;
}

.sb-widget--cards .sb-offer__content {
  flex-direction: column;
  align-items: center;
}

.sb-widget--cards .sb-offer__pricing {
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0;
}

.sb-widget--cards .sb-offer__price {
  font-size: 1.25rem;
}

@media (max-width: 640px) {
  .sb-widget--cards .sb-widget__offers {
    flex-direction: column;
  }

  .sb-widget--cards .sb-offer {
    flex-direction: row;
    text-align: left;
    padding: 0.75rem;
  }

  .sb-widget--cards .sb-offer__radio {
    display: flex;
  }

  .sb-widget--cards .sb-offer__content {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .sb-widget--cards .sb-offer__pricing {
    flex-direction: row;
    margin-left: auto;
  }

  .sb-widget--cards .sb-offer__price {
    font-size: 1rem;
  }
}

/* ============================================
   COMPACT LAYOUT VARIANT
   ============================================ */

.sb-widget--compact .sb-offer {
  padding: 0.625rem 0.75rem;
  min-height: 44px;
  border-radius: var(--sb-radius-sm);
}

.sb-widget--compact .sb-offer__badge--pill {
  font-size: 0.625rem;
  padding: 0.125rem 0.5rem;
  top: -0.5rem;
}

.sb-widget--compact .sb-offer__label {
  font-size: 0.8125rem;
}

.sb-widget--compact .sb-offer__price {
  font-size: 0.9375rem;
}

.sb-widget--compact .sb-widget__cta {
  min-height: 44px;
  font-size: 0.875rem;
}
`;var lt=T(B()),zd=!1;function Sm(){if(zd||typeof document>"u")return;zd=!0;let e=document.createElement("style");e.setAttribute("data-shopibundle",""),e.textContent=bd,document.head.appendChild(e)}Sm();function xm({mountConfig:e}){let[t,n]=(0,Ft.useState)(null),[r,l]=(0,Ft.useState)(!0),[o,i]=(0,Ft.useState)(null);return(0,Ft.useEffect)(()=>{Em(e).then(s=>{n(s),l(!1)}).catch(s=>{console.warn("[ShopiBundle] Failed to load bundle:",s),i(s.message),l(!1)})},[e]),r?(0,lt.jsx)(Es,{}):o?(0,lt.jsx)(Er,{title:"Unable to load bundle",description:o,icon:"error"}):t?(0,lt.jsx)(xs,{config:t}):(0,lt.jsx)(lt.Fragment,{})}async function Em(e){let t=new URLSearchParams;e.bundleHandle&&t.set("handle",e.bundleHandle),e.productId&&t.set("product_id",e.productId),t.set("shop",e.shopDomain),e.locale&&t.set("locale",e.locale),e.currency&&t.set("currency",e.currency);let n=e.proxyPath||"/apps/proxy",r=await fetch(`${n}/bundle-widget?${t.toString()}`);if(!r.ok)throw new Error(`HTTP ${r.status}`);let l=await r.json();if(!l.success||!l.config)throw new Error(l.error||"No bundle config returned");if(e.moneyFormat&&l.config.settings&&(l.config.settings.moneyFormat=e.moneyFormat),e.locale&&l.config.settings&&(l.config.settings.locale=e.locale),e.currency&&l.config.settings&&(l.config.settings.currency=e.currency),e.abTest&&l.config){if(e.abTest.defaultTierId)for(let o of l.config.tiers)o.isDefault=o.id===e.abTest.defaultTierId;e.abTest.colorScheme&&(l.config.visual.colorScheme=e.abTest.colorScheme),e.abTest.layoutVariant&&(l.config.analytics.experimentVariant=e.abTest.variant,l.config.analytics.experimentId=e.abTest.experimentId)}return l.config}function Cm(e){var t;return{containerId:e.id,bundleHandle:e.dataset.bundleHandle||void 0,productId:e.dataset.productId||void 0,shopDomain:e.dataset.shop||((t=window.Shopify)==null?void 0:t.shop)||"",proxyPath:e.dataset.proxyPath||"/apps/proxy",locale:e.dataset.locale||document.documentElement.lang||"en",currency:e.dataset.currency||void 0,moneyFormat:e.dataset.moneyFormat||"${{amount}}"}}function Zl(){document.querySelectorAll("[data-shopibundle-widget], #shopibundle-widget").forEach(t=>{if(t.dataset.mounted==="true")return;t.dataset.mounted="true";let n=Cm(t);if(!n.shopDomain){console.warn("[ShopiBundle] No shop domain found, skipping widget mount");return}if(!n.bundleHandle&&!n.productId){console.warn("[ShopiBundle] No bundle handle or product ID found");return}(0,Ld.createRoot)(t).render((0,lt.jsx)(Ft.default.StrictMode,{children:(0,lt.jsx)(Xl,{children:(0,lt.jsx)(xm,{mountConfig:n})})}))})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Zl):Zl();typeof MutationObserver<"u"&&new MutationObserver(t=>{let n=!1;t.forEach(r=>{r.addedNodes.forEach(l=>{var o;l instanceof HTMLElement&&(l.hasAttribute("data-shopibundle-widget")||(o=l.querySelector)!=null&&o.call(l,"[data-shopibundle-widget]"))&&(n=!0)})}),n&&Zl()}).observe(document.body||document.documentElement,{childList:!0,subtree:!0});window.ShopiBundle={mount:Zl,BundleWidget:xs,SkeletonLoader:Es};})();
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.min.js:
  (**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.min.js:
  (**
   * @license React
   * react-dom.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
