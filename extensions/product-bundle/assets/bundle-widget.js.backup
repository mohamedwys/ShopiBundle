/* ShopiBundle Widget v1.0.0 - https://shopi-bundle.vercel.app */
"use strict";(()=>{var Gd=Object.create;var Ms=Object.defineProperty;var Yd=Object.getOwnPropertyDescriptor;var Xd=Object.getOwnPropertyNames;var Zd=Object.getPrototypeOf,Jd=Object.prototype.hasOwnProperty;var ut=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var ef=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Xd(t))!Jd.call(e,i)&&i!==n&&Ms(e,i,{get:()=>t[i],enumerable:!(r=Yd(t,i))||r.enumerable});return e};var P=(e,t,n)=>(n=e!=null?Gd(Zd(e)):{},ef(t||!e||!e.__esModule?Ms(n,"default",{value:e,enumerable:!0}):n,e));var Qs=ut(N=>{"use strict";var Dn=Symbol.for("react.element"),tf=Symbol.for("react.portal"),nf=Symbol.for("react.fragment"),rf=Symbol.for("react.strict_mode"),lf=Symbol.for("react.profiler"),of=Symbol.for("react.provider"),sf=Symbol.for("react.context"),uf=Symbol.for("react.forward_ref"),af=Symbol.for("react.suspense"),cf=Symbol.for("react.memo"),df=Symbol.for("react.lazy"),Os=Symbol.iterator;function ff(e){return e===null||typeof e!="object"?null:(e=Os&&e[Os]||e["@@iterator"],typeof e=="function"?e:null)}var As={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Bs=Object.assign,js={};function ln(e,t,n){this.props=e,this.context=t,this.refs=js,this.updater=n||As}ln.prototype.isReactComponent={};ln.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};ln.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Us(){}Us.prototype=ln.prototype;function ul(e,t,n){this.props=e,this.context=t,this.refs=js,this.updater=n||As}var al=ul.prototype=new Us;al.constructor=ul;Bs(al,ln.prototype);al.isPureReactComponent=!0;var Ds=Array.isArray,Vs=Object.prototype.hasOwnProperty,cl={current:null},$s={key:!0,ref:!0,__self:!0,__source:!0};function Ws(e,t,n){var r,i={},l=null,o=null;if(t!=null)for(r in t.ref!==void 0&&(o=t.ref),t.key!==void 0&&(l=""+t.key),t)Vs.call(t,r)&&!$s.hasOwnProperty(r)&&(i[r]=t[r]);var s=arguments.length-2;if(s===1)i.children=n;else if(1<s){for(var u=Array(s),a=0;a<s;a++)u[a]=arguments[a+2];i.children=u}if(e&&e.defaultProps)for(r in s=e.defaultProps,s)i[r]===void 0&&(i[r]=s[r]);return{$$typeof:Dn,type:e,key:l,ref:o,props:i,_owner:cl.current}}function pf(e,t){return{$$typeof:Dn,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function dl(e){return typeof e=="object"&&e!==null&&e.$$typeof===Dn}function mf(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Fs=/\/+/g;function sl(e,t){return typeof e=="object"&&e!==null&&e.key!=null?mf(""+e.key):t.toString(36)}function Ir(e,t,n,r,i){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(l){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case Dn:case tf:o=!0}}if(o)return o=e,i=i(o),e=r===""?"."+sl(o,0):r,Ds(i)?(n="",e!=null&&(n=e.replace(Fs,"$&/")+"/"),Ir(i,t,n,"",function(a){return a})):i!=null&&(dl(i)&&(i=pf(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(Fs,"$&/")+"/")+e)),t.push(i)),1;if(o=0,r=r===""?".":r+":",Ds(e))for(var s=0;s<e.length;s++){l=e[s];var u=r+sl(l,s);o+=Ir(l,t,n,u,i)}else if(u=ff(e),typeof u=="function")for(e=u.call(e),s=0;!(l=e.next()).done;)l=l.value,u=r+sl(l,s++),o+=Ir(l,t,n,u,i);else if(l==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return o}function zr(e,t,n){if(e==null)return e;var r=[],i=0;return Ir(e,r,"","",function(l){return t.call(n,l,i++)}),r}function gf(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var me={current:null},Lr={transition:null},hf={ReactCurrentDispatcher:me,ReactCurrentBatchConfig:Lr,ReactCurrentOwner:cl};function Hs(){throw Error("act(...) is not supported in production builds of React.")}N.Children={map:zr,forEach:function(e,t,n){zr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return zr(e,function(){t++}),t},toArray:function(e){return zr(e,function(t){return t})||[]},only:function(e){if(!dl(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};N.Component=ln;N.Fragment=nf;N.Profiler=lf;N.PureComponent=ul;N.StrictMode=rf;N.Suspense=af;N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=hf;N.act=Hs;N.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Bs({},e.props),i=e.key,l=e.ref,o=e._owner;if(t!=null){if(t.ref!==void 0&&(l=t.ref,o=cl.current),t.key!==void 0&&(i=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(u in t)Vs.call(t,u)&&!$s.hasOwnProperty(u)&&(r[u]=t[u]===void 0&&s!==void 0?s[u]:t[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){s=Array(u);for(var a=0;a<u;a++)s[a]=arguments[a+2];r.children=s}return{$$typeof:Dn,type:e.type,key:i,ref:l,props:r,_owner:o}};N.createContext=function(e){return e={$$typeof:sf,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:of,_context:e},e.Consumer=e};N.createElement=Ws;N.createFactory=function(e){var t=Ws.bind(null,e);return t.type=e,t};N.createRef=function(){return{current:null}};N.forwardRef=function(e){return{$$typeof:uf,render:e}};N.isValidElement=dl;N.lazy=function(e){return{$$typeof:df,_payload:{_status:-1,_result:e},_init:gf}};N.memo=function(e,t){return{$$typeof:cf,type:e,compare:t===void 0?null:t}};N.startTransition=function(e){var t=Lr.transition;Lr.transition={};try{e()}finally{Lr.transition=t}};N.unstable_act=Hs;N.useCallback=function(e,t){return me.current.useCallback(e,t)};N.useContext=function(e){return me.current.useContext(e)};N.useDebugValue=function(){};N.useDeferredValue=function(e){return me.current.useDeferredValue(e)};N.useEffect=function(e,t){return me.current.useEffect(e,t)};N.useId=function(){return me.current.useId()};N.useImperativeHandle=function(e,t,n){return me.current.useImperativeHandle(e,t,n)};N.useInsertionEffect=function(e,t){return me.current.useInsertionEffect(e,t)};N.useLayoutEffect=function(e,t){return me.current.useLayoutEffect(e,t)};N.useMemo=function(e,t){return me.current.useMemo(e,t)};N.useReducer=function(e,t,n){return me.current.useReducer(e,t,n)};N.useRef=function(e){return me.current.useRef(e)};N.useState=function(e){return me.current.useState(e)};N.useSyncExternalStore=function(e,t,n){return me.current.useSyncExternalStore(e,t,n)};N.useTransition=function(){return me.current.useTransition()};N.version="18.3.1"});var we=ut((Um,qs)=>{"use strict";qs.exports=Qs()});var ru=ut(D=>{"use strict";function gl(e,t){var n=e.length;e.push(t);e:for(;0<n;){var r=n-1>>>1,i=e[r];if(0<Mr(i,t))e[r]=t,e[n]=i,n=r;else break e}}function Ve(e){return e.length===0?null:e[0]}function Dr(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var r=0,i=e.length,l=i>>>1;r<l;){var o=2*(r+1)-1,s=e[o],u=o+1,a=e[u];if(0>Mr(s,n))u<i&&0>Mr(a,s)?(e[r]=a,e[u]=n,r=u):(e[r]=s,e[o]=n,r=o);else if(u<i&&0>Mr(a,n))e[r]=a,e[u]=n,r=u;else break e}}return t}function Mr(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}typeof performance=="object"&&typeof performance.now=="function"?(Ks=performance,D.unstable_now=function(){return Ks.now()}):(fl=Date,Gs=fl.now(),D.unstable_now=function(){return fl.now()-Gs});var Ks,fl,Gs,Ze=[],wt=[],vf=1,Me=null,ue=3,Fr=!1,Ut=!1,An=!1,Zs=typeof setTimeout=="function"?setTimeout:null,Js=typeof clearTimeout=="function"?clearTimeout:null,Ys=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function hl(e){for(var t=Ve(wt);t!==null;){if(t.callback===null)Dr(wt);else if(t.startTime<=e)Dr(wt),t.sortIndex=t.expirationTime,gl(Ze,t);else break;t=Ve(wt)}}function vl(e){if(An=!1,hl(e),!Ut)if(Ve(Ze)!==null)Ut=!0,wl(yl);else{var t=Ve(wt);t!==null&&_l(vl,t.startTime-e)}}function yl(e,t){Ut=!1,An&&(An=!1,Js(Bn),Bn=-1),Fr=!0;var n=ue;try{for(hl(t),Me=Ve(Ze);Me!==null&&(!(Me.expirationTime>t)||e&&!nu());){var r=Me.callback;if(typeof r=="function"){Me.callback=null,ue=Me.priorityLevel;var i=r(Me.expirationTime<=t);t=D.unstable_now(),typeof i=="function"?Me.callback=i:Me===Ve(Ze)&&Dr(Ze),hl(t)}else Dr(Ze);Me=Ve(Ze)}if(Me!==null)var l=!0;else{var o=Ve(wt);o!==null&&_l(vl,o.startTime-t),l=!1}return l}finally{Me=null,ue=n,Fr=!1}}var Ar=!1,Or=null,Bn=-1,eu=5,tu=-1;function nu(){return!(D.unstable_now()-tu<eu)}function pl(){if(Or!==null){var e=D.unstable_now();tu=e;var t=!0;try{t=Or(!0,e)}finally{t?Fn():(Ar=!1,Or=null)}}else Ar=!1}var Fn;typeof Ys=="function"?Fn=function(){Ys(pl)}:typeof MessageChannel<"u"?(ml=new MessageChannel,Xs=ml.port2,ml.port1.onmessage=pl,Fn=function(){Xs.postMessage(null)}):Fn=function(){Zs(pl,0)};var ml,Xs;function wl(e){Or=e,Ar||(Ar=!0,Fn())}function _l(e,t){Bn=Zs(function(){e(D.unstable_now())},t)}D.unstable_IdlePriority=5;D.unstable_ImmediatePriority=1;D.unstable_LowPriority=4;D.unstable_NormalPriority=3;D.unstable_Profiling=null;D.unstable_UserBlockingPriority=2;D.unstable_cancelCallback=function(e){e.callback=null};D.unstable_continueExecution=function(){Ut||Fr||(Ut=!0,wl(yl))};D.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):eu=0<e?Math.floor(1e3/e):5};D.unstable_getCurrentPriorityLevel=function(){return ue};D.unstable_getFirstCallbackNode=function(){return Ve(Ze)};D.unstable_next=function(e){switch(ue){case 1:case 2:case 3:var t=3;break;default:t=ue}var n=ue;ue=t;try{return e()}finally{ue=n}};D.unstable_pauseExecution=function(){};D.unstable_requestPaint=function(){};D.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=ue;ue=e;try{return t()}finally{ue=n}};D.unstable_scheduleCallback=function(e,t,n){var r=D.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?r+n:r):n=r,e){case 1:var i=-1;break;case 2:i=250;break;case 5:i=1073741823;break;case 4:i=1e4;break;default:i=5e3}return i=n+i,e={id:vf++,callback:t,priorityLevel:e,startTime:n,expirationTime:i,sortIndex:-1},n>r?(e.sortIndex=n,gl(wt,e),Ve(Ze)===null&&e===Ve(wt)&&(An?(Js(Bn),Bn=-1):An=!0,_l(vl,n-r))):(e.sortIndex=i,gl(Ze,e),Ut||Fr||(Ut=!0,wl(yl))),e};D.unstable_shouldYield=nu;D.unstable_wrapCallback=function(e){var t=ue;return function(){var n=ue;ue=t;try{return e.apply(this,arguments)}finally{ue=n}}}});var lu=ut(($m,iu)=>{"use strict";iu.exports=ru()});var ad=ut(Ie=>{"use strict";var yf=we(),Re=lu();function v(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var fa=new Set,sr={};function en(e,t){Pn(e,t),Pn(e+"Capture",t)}function Pn(e,t){for(sr[e]=t,e=0;e<t.length;e++)fa.add(t[e])}var mt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),$l=Object.prototype.hasOwnProperty,wf=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ou={},su={};function _f(e){return $l.call(su,e)?!0:$l.call(ou,e)?!1:wf.test(e)?su[e]=!0:(ou[e]=!0,!1)}function kf(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Sf(e,t,n,r){if(t===null||typeof t>"u"||kf(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ve(e,t,n,r,i,l,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=o}var oe={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){oe[e]=new ve(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];oe[t]=new ve(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){oe[e]=new ve(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){oe[e]=new ve(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){oe[e]=new ve(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){oe[e]=new ve(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){oe[e]=new ve(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){oe[e]=new ve(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){oe[e]=new ve(e,5,!1,e.toLowerCase(),null,!1,!1)});var Do=/[\-:]([a-z])/g;function Fo(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Do,Fo);oe[t]=new ve(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Do,Fo);oe[t]=new ve(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Do,Fo);oe[t]=new ve(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){oe[e]=new ve(e,1,!1,e.toLowerCase(),null,!1,!1)});oe.xlinkHref=new ve("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){oe[e]=new ve(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ao(e,t,n,r){var i=oe.hasOwnProperty(t)?oe[t]:null;(i!==null?i.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Sf(t,n,i,r)&&(n=null),r||i===null?_f(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):i.mustUseProperty?e[i.propertyName]=n===null?i.type===3?!1:"":n:(t=i.attributeName,r=i.attributeNamespace,n===null?e.removeAttribute(t):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var yt=yf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Br=Symbol.for("react.element"),un=Symbol.for("react.portal"),an=Symbol.for("react.fragment"),Bo=Symbol.for("react.strict_mode"),Wl=Symbol.for("react.profiler"),pa=Symbol.for("react.provider"),ma=Symbol.for("react.context"),jo=Symbol.for("react.forward_ref"),Hl=Symbol.for("react.suspense"),Ql=Symbol.for("react.suspense_list"),Uo=Symbol.for("react.memo"),kt=Symbol.for("react.lazy");Symbol.for("react.scope");Symbol.for("react.debug_trace_mode");var ga=Symbol.for("react.offscreen");Symbol.for("react.legacy_hidden");Symbol.for("react.cache");Symbol.for("react.tracing_marker");var uu=Symbol.iterator;function jn(e){return e===null||typeof e!="object"?null:(e=uu&&e[uu]||e["@@iterator"],typeof e=="function"?e:null)}var H=Object.assign,kl;function Kn(e){if(kl===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);kl=t&&t[1]||""}return`
`+kl+e}var Sl=!1;function xl(e,t){if(!e||Sl)return"";Sl=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(a){var r=a}Reflect.construct(e,[],t)}else{try{t.call()}catch(a){r=a}e.call(t.prototype)}else{try{throw Error()}catch(a){r=a}e()}}catch(a){if(a&&r&&typeof a.stack=="string"){for(var i=a.stack.split(`
`),l=r.stack.split(`
`),o=i.length-1,s=l.length-1;1<=o&&0<=s&&i[o]!==l[s];)s--;for(;1<=o&&0<=s;o--,s--)if(i[o]!==l[s]){if(o!==1||s!==1)do if(o--,s--,0>s||i[o]!==l[s]){var u=`
`+i[o].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=o&&0<=s);break}}}finally{Sl=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Kn(e):""}function xf(e){switch(e.tag){case 5:return Kn(e.type);case 16:return Kn("Lazy");case 13:return Kn("Suspense");case 19:return Kn("SuspenseList");case 0:case 2:case 15:return e=xl(e.type,!1),e;case 11:return e=xl(e.type.render,!1),e;case 1:return e=xl(e.type,!0),e;default:return""}}function ql(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case an:return"Fragment";case un:return"Portal";case Wl:return"Profiler";case Bo:return"StrictMode";case Hl:return"Suspense";case Ql:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case ma:return(e.displayName||"Context")+".Consumer";case pa:return(e._context.displayName||"Context")+".Provider";case jo:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Uo:return t=e.displayName||null,t!==null?t:ql(e.type)||"Memo";case kt:t=e._payload,e=e._init;try{return ql(e(t))}catch{}}return null}function Ef(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ql(t);case 8:return t===Bo?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Ot(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ha(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Cf(e){var t=ha(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,l=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,l.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function jr(e){e._valueTracker||(e._valueTracker=Cf(e))}function va(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=ha(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function mi(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Kl(e,t){var n=t.checked;return H({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function au(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=Ot(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function ya(e,t){t=t.checked,t!=null&&Ao(e,"checked",t,!1)}function Gl(e,t){ya(e,t);var n=Ot(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Yl(e,t.type,n):t.hasOwnProperty("defaultValue")&&Yl(e,t.type,Ot(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function cu(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Yl(e,t,n){(t!=="number"||mi(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Gn=Array.isArray;function _n(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t["$"+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty("$"+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Ot(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Xl(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(v(91));return H({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function du(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(v(92));if(Gn(n)){if(1<n.length)throw Error(v(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Ot(n)}}function wa(e,t){var n=Ot(t.value),r=Ot(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function fu(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function _a(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Zl(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?_a(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Ur,ka=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,i){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,i)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Ur=Ur||document.createElement("div"),Ur.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Ur.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function ur(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Zn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Pf=["Webkit","ms","Moz","O"];Object.keys(Zn).forEach(function(e){Pf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Zn[t]=Zn[e]})});function Sa(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Zn.hasOwnProperty(e)&&Zn[e]?(""+t).trim():t+"px"}function xa(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=Sa(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,i):e[n]=i}}var Nf=H({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Jl(e,t){if(t){if(Nf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(v(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(v(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(v(61))}if(t.style!=null&&typeof t.style!="object")throw Error(v(62))}}function eo(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var to=null;function Vo(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var no=null,kn=null,Sn=null;function pu(e){if(e=Pr(e)){if(typeof no!="function")throw Error(v(280));var t=e.stateNode;t&&(t=Vi(t),no(e.stateNode,e.type,t))}}function Ea(e){kn?Sn?Sn.push(e):Sn=[e]:kn=e}function Ca(){if(kn){var e=kn,t=Sn;if(Sn=kn=null,pu(e),t)for(e=0;e<t.length;e++)pu(t[e])}}function Pa(e,t){return e(t)}function Na(){}var El=!1;function ba(e,t,n){if(El)return e(t,n);El=!0;try{return Pa(e,t,n)}finally{El=!1,(kn!==null||Sn!==null)&&(Na(),Ca())}}function ar(e,t){var n=e.stateNode;if(n===null)return null;var r=Vi(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(v(231,t,typeof n));return n}var ro=!1;if(mt)try{on={},Object.defineProperty(on,"passive",{get:function(){ro=!0}}),window.addEventListener("test",on,on),window.removeEventListener("test",on,on)}catch{ro=!1}var on;function bf(e,t,n,r,i,l,o,s,u){var a=Array.prototype.slice.call(arguments,3);try{t.apply(n,a)}catch(f){this.onError(f)}}var Jn=!1,gi=null,hi=!1,io=null,Tf={onError:function(e){Jn=!0,gi=e}};function Rf(e,t,n,r,i,l,o,s,u){Jn=!1,gi=null,bf.apply(Tf,arguments)}function zf(e,t,n,r,i,l,o,s,u){if(Rf.apply(this,arguments),Jn){if(Jn){var a=gi;Jn=!1,gi=null}else throw Error(v(198));hi||(hi=!0,io=a)}}function tn(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Ta(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function mu(e){if(tn(e)!==e)throw Error(v(188))}function If(e){var t=e.alternate;if(!t){if(t=tn(e),t===null)throw Error(v(188));return t!==e?null:e}for(var n=e,r=t;;){var i=n.return;if(i===null)break;var l=i.alternate;if(l===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===l.child){for(l=i.child;l;){if(l===n)return mu(i),e;if(l===r)return mu(i),t;l=l.sibling}throw Error(v(188))}if(n.return!==r.return)n=i,r=l;else{for(var o=!1,s=i.child;s;){if(s===n){o=!0,n=i,r=l;break}if(s===r){o=!0,r=i,n=l;break}s=s.sibling}if(!o){for(s=l.child;s;){if(s===n){o=!0,n=l,r=i;break}if(s===r){o=!0,r=l,n=i;break}s=s.sibling}if(!o)throw Error(v(189))}}if(n.alternate!==r)throw Error(v(190))}if(n.tag!==3)throw Error(v(188));return n.stateNode.current===n?e:t}function Ra(e){return e=If(e),e!==null?za(e):null}function za(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=za(e);if(t!==null)return t;e=e.sibling}return null}var Ia=Re.unstable_scheduleCallback,gu=Re.unstable_cancelCallback,Lf=Re.unstable_shouldYield,Mf=Re.unstable_requestPaint,K=Re.unstable_now,Of=Re.unstable_getCurrentPriorityLevel,$o=Re.unstable_ImmediatePriority,La=Re.unstable_UserBlockingPriority,vi=Re.unstable_NormalPriority,Df=Re.unstable_LowPriority,Ma=Re.unstable_IdlePriority,Ai=null,nt=null;function Ff(e){if(nt&&typeof nt.onCommitFiberRoot=="function")try{nt.onCommitFiberRoot(Ai,e,void 0,(e.current.flags&128)===128)}catch{}}var qe=Math.clz32?Math.clz32:jf,Af=Math.log,Bf=Math.LN2;function jf(e){return e>>>=0,e===0?32:31-(Af(e)/Bf|0)|0}var Vr=64,$r=4194304;function Yn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function yi(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,i=e.suspendedLanes,l=e.pingedLanes,o=n&268435455;if(o!==0){var s=o&~i;s!==0?r=Yn(s):(l&=o,l!==0&&(r=Yn(l)))}else o=n&~i,o!==0?r=Yn(o):l!==0&&(r=Yn(l));if(r===0)return 0;if(t!==0&&t!==r&&!(t&i)&&(i=r&-r,l=t&-t,i>=l||i===16&&(l&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-qe(t),i=1<<n,r|=e[n],t&=~i;return r}function Uf(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Vf(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,l=e.pendingLanes;0<l;){var o=31-qe(l),s=1<<o,u=i[o];u===-1?(!(s&n)||s&r)&&(i[o]=Uf(s,t)):u<=t&&(e.expiredLanes|=s),l&=~s}}function lo(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Oa(){var e=Vr;return Vr<<=1,!(Vr&4194240)&&(Vr=64),e}function Cl(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Er(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-qe(t),e[t]=n}function $f(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var i=31-qe(n),l=1<<i;t[i]=0,r[i]=-1,e[i]=-1,n&=~l}}function Wo(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-qe(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}var L=0;function Da(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Fa,Ho,Aa,Ba,ja,oo=!1,Wr=[],Nt=null,bt=null,Tt=null,cr=new Map,dr=new Map,xt=[],Wf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function hu(e,t){switch(e){case"focusin":case"focusout":Nt=null;break;case"dragenter":case"dragleave":bt=null;break;case"mouseover":case"mouseout":Tt=null;break;case"pointerover":case"pointerout":cr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":dr.delete(t.pointerId)}}function Un(e,t,n,r,i,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:l,targetContainers:[i]},t!==null&&(t=Pr(t),t!==null&&Ho(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Hf(e,t,n,r,i){switch(t){case"focusin":return Nt=Un(Nt,e,t,n,r,i),!0;case"dragenter":return bt=Un(bt,e,t,n,r,i),!0;case"mouseover":return Tt=Un(Tt,e,t,n,r,i),!0;case"pointerover":var l=i.pointerId;return cr.set(l,Un(cr.get(l)||null,e,t,n,r,i)),!0;case"gotpointercapture":return l=i.pointerId,dr.set(l,Un(dr.get(l)||null,e,t,n,r,i)),!0}return!1}function Ua(e){var t=Wt(e.target);if(t!==null){var n=tn(t);if(n!==null){if(t=n.tag,t===13){if(t=Ta(n),t!==null){e.blockedOn=t,ja(e.priority,function(){Aa(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function ii(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=so(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);to=r,n.target.dispatchEvent(r),to=null}else return t=Pr(n),t!==null&&Ho(t),e.blockedOn=n,!1;t.shift()}return!0}function vu(e,t,n){ii(e)&&n.delete(t)}function Qf(){oo=!1,Nt!==null&&ii(Nt)&&(Nt=null),bt!==null&&ii(bt)&&(bt=null),Tt!==null&&ii(Tt)&&(Tt=null),cr.forEach(vu),dr.forEach(vu)}function Vn(e,t){e.blockedOn===t&&(e.blockedOn=null,oo||(oo=!0,Re.unstable_scheduleCallback(Re.unstable_NormalPriority,Qf)))}function fr(e){function t(i){return Vn(i,e)}if(0<Wr.length){Vn(Wr[0],e);for(var n=1;n<Wr.length;n++){var r=Wr[n];r.blockedOn===e&&(r.blockedOn=null)}}for(Nt!==null&&Vn(Nt,e),bt!==null&&Vn(bt,e),Tt!==null&&Vn(Tt,e),cr.forEach(t),dr.forEach(t),n=0;n<xt.length;n++)r=xt[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<xt.length&&(n=xt[0],n.blockedOn===null);)Ua(n),n.blockedOn===null&&xt.shift()}var xn=yt.ReactCurrentBatchConfig,wi=!0;function qf(e,t,n,r){var i=L,l=xn.transition;xn.transition=null;try{L=1,Qo(e,t,n,r)}finally{L=i,xn.transition=l}}function Kf(e,t,n,r){var i=L,l=xn.transition;xn.transition=null;try{L=4,Qo(e,t,n,r)}finally{L=i,xn.transition=l}}function Qo(e,t,n,r){if(wi){var i=so(e,t,n,r);if(i===null)Il(e,t,r,_i,n),hu(e,r);else if(Hf(i,e,t,n,r))r.stopPropagation();else if(hu(e,r),t&4&&-1<Wf.indexOf(e)){for(;i!==null;){var l=Pr(i);if(l!==null&&Fa(l),l=so(e,t,n,r),l===null&&Il(e,t,r,_i,n),l===i)break;i=l}i!==null&&r.stopPropagation()}else Il(e,t,r,null,n)}}var _i=null;function so(e,t,n,r){if(_i=null,e=Vo(r),e=Wt(e),e!==null)if(t=tn(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Ta(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return _i=e,null}function Va(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Of()){case $o:return 1;case La:return 4;case vi:case Df:return 16;case Ma:return 536870912;default:return 16}default:return 16}}var Ct=null,qo=null,li=null;function $a(){if(li)return li;var e,t=qo,n=t.length,r,i="value"in Ct?Ct.value:Ct.textContent,l=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[l-r];r++);return li=i.slice(e,1<r?1-r:void 0)}function oi(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Hr(){return!0}function yu(){return!1}function ze(e){function t(n,r,i,l,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=l,this.target=o,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(n=e[s],this[s]=n?n(l):l[s]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Hr:yu,this.isPropagationStopped=yu,this}return H(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Hr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Hr)},persist:function(){},isPersistent:Hr}),t}var Ln={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ko=ze(Ln),Cr=H({},Ln,{view:0,detail:0}),Gf=ze(Cr),Pl,Nl,$n,Bi=H({},Cr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Go,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==$n&&($n&&e.type==="mousemove"?(Pl=e.screenX-$n.screenX,Nl=e.screenY-$n.screenY):Nl=Pl=0,$n=e),Pl)},movementY:function(e){return"movementY"in e?e.movementY:Nl}}),wu=ze(Bi),Yf=H({},Bi,{dataTransfer:0}),Xf=ze(Yf),Zf=H({},Cr,{relatedTarget:0}),bl=ze(Zf),Jf=H({},Ln,{animationName:0,elapsedTime:0,pseudoElement:0}),ep=ze(Jf),tp=H({},Ln,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),np=ze(tp),rp=H({},Ln,{data:0}),_u=ze(rp),ip={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},lp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},op={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function sp(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=op[e])?!!t[e]:!1}function Go(){return sp}var up=H({},Cr,{key:function(e){if(e.key){var t=ip[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=oi(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?lp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Go,charCode:function(e){return e.type==="keypress"?oi(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?oi(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),ap=ze(up),cp=H({},Bi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ku=ze(cp),dp=H({},Cr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Go}),fp=ze(dp),pp=H({},Ln,{propertyName:0,elapsedTime:0,pseudoElement:0}),mp=ze(pp),gp=H({},Bi,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),hp=ze(gp),vp=[9,13,27,32],Yo=mt&&"CompositionEvent"in window,er=null;mt&&"documentMode"in document&&(er=document.documentMode);var yp=mt&&"TextEvent"in window&&!er,Wa=mt&&(!Yo||er&&8<er&&11>=er),Su=" ",xu=!1;function Ha(e,t){switch(e){case"keyup":return vp.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Qa(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var cn=!1;function wp(e,t){switch(e){case"compositionend":return Qa(t);case"keypress":return t.which!==32?null:(xu=!0,Su);case"textInput":return e=t.data,e===Su&&xu?null:e;default:return null}}function _p(e,t){if(cn)return e==="compositionend"||!Yo&&Ha(e,t)?(e=$a(),li=qo=Ct=null,cn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Wa&&t.locale!=="ko"?null:t.data;default:return null}}var kp={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Eu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!kp[e.type]:t==="textarea"}function qa(e,t,n,r){Ea(r),t=ki(t,"onChange"),0<t.length&&(n=new Ko("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var tr=null,pr=null;function Sp(e){ic(e,0)}function ji(e){var t=pn(e);if(va(t))return e}function xp(e,t){if(e==="change")return t}var Ka=!1;mt&&(mt?(qr="oninput"in document,qr||(Tl=document.createElement("div"),Tl.setAttribute("oninput","return;"),qr=typeof Tl.oninput=="function"),Qr=qr):Qr=!1,Ka=Qr&&(!document.documentMode||9<document.documentMode));var Qr,qr,Tl;function Cu(){tr&&(tr.detachEvent("onpropertychange",Ga),pr=tr=null)}function Ga(e){if(e.propertyName==="value"&&ji(pr)){var t=[];qa(t,pr,e,Vo(e)),ba(Sp,t)}}function Ep(e,t,n){e==="focusin"?(Cu(),tr=t,pr=n,tr.attachEvent("onpropertychange",Ga)):e==="focusout"&&Cu()}function Cp(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ji(pr)}function Pp(e,t){if(e==="click")return ji(t)}function Np(e,t){if(e==="input"||e==="change")return ji(t)}function bp(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ge=typeof Object.is=="function"?Object.is:bp;function mr(e,t){if(Ge(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!$l.call(t,i)||!Ge(e[i],t[i]))return!1}return!0}function Pu(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Nu(e,t){var n=Pu(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Pu(n)}}function Ya(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Ya(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Xa(){for(var e=window,t=mi();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=mi(e.document)}return t}function Xo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Tp(e){var t=Xa(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Ya(n.ownerDocument.documentElement,n)){if(r!==null&&Xo(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var i=n.textContent.length,l=Math.min(r.start,i);r=r.end===void 0?l:Math.min(r.end,i),!e.extend&&l>r&&(i=r,r=l,l=i),i=Nu(n,l);var o=Nu(n,r);i&&o&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(i.node,i.offset),e.removeAllRanges(),l>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Rp=mt&&"documentMode"in document&&11>=document.documentMode,dn=null,uo=null,nr=null,ao=!1;function bu(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ao||dn==null||dn!==mi(r)||(r=dn,"selectionStart"in r&&Xo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),nr&&mr(nr,r)||(nr=r,r=ki(uo,"onSelect"),0<r.length&&(t=new Ko("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=dn)))}function Kr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var fn={animationend:Kr("Animation","AnimationEnd"),animationiteration:Kr("Animation","AnimationIteration"),animationstart:Kr("Animation","AnimationStart"),transitionend:Kr("Transition","TransitionEnd")},Rl={},Za={};mt&&(Za=document.createElement("div").style,"AnimationEvent"in window||(delete fn.animationend.animation,delete fn.animationiteration.animation,delete fn.animationstart.animation),"TransitionEvent"in window||delete fn.transitionend.transition);function Ui(e){if(Rl[e])return Rl[e];if(!fn[e])return e;var t=fn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Za)return Rl[e]=t[n];return e}var Ja=Ui("animationend"),ec=Ui("animationiteration"),tc=Ui("animationstart"),nc=Ui("transitionend"),rc=new Map,Tu="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Ft(e,t){rc.set(e,t),en(t,[e])}for(Gr=0;Gr<Tu.length;Gr++)Yr=Tu[Gr],Ru=Yr.toLowerCase(),zu=Yr[0].toUpperCase()+Yr.slice(1),Ft(Ru,"on"+zu);var Yr,Ru,zu,Gr;Ft(Ja,"onAnimationEnd");Ft(ec,"onAnimationIteration");Ft(tc,"onAnimationStart");Ft("dblclick","onDoubleClick");Ft("focusin","onFocus");Ft("focusout","onBlur");Ft(nc,"onTransitionEnd");Pn("onMouseEnter",["mouseout","mouseover"]);Pn("onMouseLeave",["mouseout","mouseover"]);Pn("onPointerEnter",["pointerout","pointerover"]);Pn("onPointerLeave",["pointerout","pointerover"]);en("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));en("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));en("onBeforeInput",["compositionend","keypress","textInput","paste"]);en("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));en("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));en("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Xn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),zp=new Set("cancel close invalid load scroll toggle".split(" ").concat(Xn));function Iu(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,zf(r,t,void 0,e),e.currentTarget=null}function ic(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;e:{var l=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],u=s.instance,a=s.currentTarget;if(s=s.listener,u!==l&&i.isPropagationStopped())break e;Iu(i,s,a),l=u}else for(o=0;o<r.length;o++){if(s=r[o],u=s.instance,a=s.currentTarget,s=s.listener,u!==l&&i.isPropagationStopped())break e;Iu(i,s,a),l=u}}}if(hi)throw e=io,hi=!1,io=null,e}function B(e,t){var n=t[go];n===void 0&&(n=t[go]=new Set);var r=e+"__bubble";n.has(r)||(lc(t,e,2,!1),n.add(r))}function zl(e,t,n){var r=0;t&&(r|=4),lc(n,e,r,t)}var Xr="_reactListening"+Math.random().toString(36).slice(2);function gr(e){if(!e[Xr]){e[Xr]=!0,fa.forEach(function(n){n!=="selectionchange"&&(zp.has(n)||zl(n,!1,e),zl(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Xr]||(t[Xr]=!0,zl("selectionchange",!1,t))}}function lc(e,t,n,r){switch(Va(t)){case 1:var i=qf;break;case 4:i=Kf;break;default:i=Qo}n=i.bind(null,t,n,e),i=void 0,!ro||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),r?i!==void 0?e.addEventListener(t,n,{capture:!0,passive:i}):e.addEventListener(t,n,!0):i!==void 0?e.addEventListener(t,n,{passive:i}):e.addEventListener(t,n,!1)}function Il(e,t,n,r,i){var l=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var s=r.stateNode.containerInfo;if(s===i||s.nodeType===8&&s.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;o=o.return}for(;s!==null;){if(o=Wt(s),o===null)return;if(u=o.tag,u===5||u===6){r=l=o;continue e}s=s.parentNode}}r=r.return}ba(function(){var a=l,f=Vo(n),m=[];e:{var d=rc.get(e);if(d!==void 0){var h=Ko,y=e;switch(e){case"keypress":if(oi(n)===0)break e;case"keydown":case"keyup":h=ap;break;case"focusin":y="focus",h=bl;break;case"focusout":y="blur",h=bl;break;case"beforeblur":case"afterblur":h=bl;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":h=wu;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":h=Xf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":h=fp;break;case Ja:case ec:case tc:h=ep;break;case nc:h=mp;break;case"scroll":h=Gf;break;case"wheel":h=hp;break;case"copy":case"cut":case"paste":h=np;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":h=ku}var _=(t&4)!==0,I=!_&&e==="scroll",p=_?d!==null?d+"Capture":null:d;_=[];for(var c=a,g;c!==null;){g=c;var w=g.stateNode;if(g.tag===5&&w!==null&&(g=w,p!==null&&(w=ar(c,p),w!=null&&_.push(hr(c,w,g)))),I)break;c=c.return}0<_.length&&(d=new h(d,y,null,n,f),m.push({event:d,listeners:_}))}}if(!(t&7)){e:{if(d=e==="mouseover"||e==="pointerover",h=e==="mouseout"||e==="pointerout",d&&n!==to&&(y=n.relatedTarget||n.fromElement)&&(Wt(y)||y[gt]))break e;if((h||d)&&(d=f.window===f?f:(d=f.ownerDocument)?d.defaultView||d.parentWindow:window,h?(y=n.relatedTarget||n.toElement,h=a,y=y?Wt(y):null,y!==null&&(I=tn(y),y!==I||y.tag!==5&&y.tag!==6)&&(y=null)):(h=null,y=a),h!==y)){if(_=wu,w="onMouseLeave",p="onMouseEnter",c="mouse",(e==="pointerout"||e==="pointerover")&&(_=ku,w="onPointerLeave",p="onPointerEnter",c="pointer"),I=h==null?d:pn(h),g=y==null?d:pn(y),d=new _(w,c+"leave",h,n,f),d.target=I,d.relatedTarget=g,w=null,Wt(f)===a&&(_=new _(p,c+"enter",y,n,f),_.target=g,_.relatedTarget=I,w=_),I=w,h&&y)t:{for(_=h,p=y,c=0,g=_;g;g=sn(g))c++;for(g=0,w=p;w;w=sn(w))g++;for(;0<c-g;)_=sn(_),c--;for(;0<g-c;)p=sn(p),g--;for(;c--;){if(_===p||p!==null&&_===p.alternate)break t;_=sn(_),p=sn(p)}_=null}else _=null;h!==null&&Lu(m,d,h,_,!1),y!==null&&I!==null&&Lu(m,I,y,_,!0)}}e:{if(d=a?pn(a):window,h=d.nodeName&&d.nodeName.toLowerCase(),h==="select"||h==="input"&&d.type==="file")var S=xp;else if(Eu(d))if(Ka)S=Np;else{S=Cp;var E=Ep}else(h=d.nodeName)&&h.toLowerCase()==="input"&&(d.type==="checkbox"||d.type==="radio")&&(S=Pp);if(S&&(S=S(e,a))){qa(m,S,n,f);break e}E&&E(e,d,a),e==="focusout"&&(E=d._wrapperState)&&E.controlled&&d.type==="number"&&Yl(d,"number",d.value)}switch(E=a?pn(a):window,e){case"focusin":(Eu(E)||E.contentEditable==="true")&&(dn=E,uo=a,nr=null);break;case"focusout":nr=uo=dn=null;break;case"mousedown":ao=!0;break;case"contextmenu":case"mouseup":case"dragend":ao=!1,bu(m,n,f);break;case"selectionchange":if(Rp)break;case"keydown":case"keyup":bu(m,n,f)}var x;if(Yo)e:{switch(e){case"compositionstart":var C="onCompositionStart";break e;case"compositionend":C="onCompositionEnd";break e;case"compositionupdate":C="onCompositionUpdate";break e}C=void 0}else cn?Ha(e,n)&&(C="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(C="onCompositionStart");C&&(Wa&&n.locale!=="ko"&&(cn||C!=="onCompositionStart"?C==="onCompositionEnd"&&cn&&(x=$a()):(Ct=f,qo="value"in Ct?Ct.value:Ct.textContent,cn=!0)),E=ki(a,C),0<E.length&&(C=new _u(C,e,null,n,f),m.push({event:C,listeners:E}),x?C.data=x:(x=Qa(n),x!==null&&(C.data=x)))),(x=yp?wp(e,n):_p(e,n))&&(a=ki(a,"onBeforeInput"),0<a.length&&(f=new _u("onBeforeInput","beforeinput",null,n,f),m.push({event:f,listeners:a}),f.data=x))}ic(m,t)})}function hr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ki(e,t){for(var n=t+"Capture",r=[];e!==null;){var i=e,l=i.stateNode;i.tag===5&&l!==null&&(i=l,l=ar(e,n),l!=null&&r.unshift(hr(e,l,i)),l=ar(e,t),l!=null&&r.push(hr(e,l,i))),e=e.return}return r}function sn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Lu(e,t,n,r,i){for(var l=t._reactName,o=[];n!==null&&n!==r;){var s=n,u=s.alternate,a=s.stateNode;if(u!==null&&u===r)break;s.tag===5&&a!==null&&(s=a,i?(u=ar(n,l),u!=null&&o.unshift(hr(n,u,s))):i||(u=ar(n,l),u!=null&&o.push(hr(n,u,s)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Ip=/\r\n?/g,Lp=/\u0000|\uFFFD/g;function Mu(e){return(typeof e=="string"?e:""+e).replace(Ip,`
`).replace(Lp,"")}function Zr(e,t,n){if(t=Mu(t),Mu(e)!==t&&n)throw Error(v(425))}function Si(){}var co=null,fo=null;function po(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var mo=typeof setTimeout=="function"?setTimeout:void 0,Mp=typeof clearTimeout=="function"?clearTimeout:void 0,Ou=typeof Promise=="function"?Promise:void 0,Op=typeof queueMicrotask=="function"?queueMicrotask:typeof Ou<"u"?function(e){return Ou.resolve(null).then(e).catch(Dp)}:mo;function Dp(e){setTimeout(function(){throw e})}function Ll(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){e.removeChild(i),fr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);fr(t)}function Rt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Du(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Mn=Math.random().toString(36).slice(2),tt="__reactFiber$"+Mn,vr="__reactProps$"+Mn,gt="__reactContainer$"+Mn,go="__reactEvents$"+Mn,Fp="__reactListeners$"+Mn,Ap="__reactHandles$"+Mn;function Wt(e){var t=e[tt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[gt]||n[tt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Du(e);e!==null;){if(n=e[tt])return n;e=Du(e)}return t}e=n,n=e.parentNode}return null}function Pr(e){return e=e[tt]||e[gt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function pn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(v(33))}function Vi(e){return e[vr]||null}var ho=[],mn=-1;function At(e){return{current:e}}function j(e){0>mn||(e.current=ho[mn],ho[mn]=null,mn--)}function F(e,t){mn++,ho[mn]=e.current,e.current=t}var Dt={},fe=At(Dt),Se=At(!1),Gt=Dt;function Nn(e,t){var n=e.type.contextTypes;if(!n)return Dt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var i={},l;for(l in n)i[l]=t[l];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function xe(e){return e=e.childContextTypes,e!=null}function xi(){j(Se),j(fe)}function Fu(e,t,n){if(fe.current!==Dt)throw Error(v(168));F(fe,t),F(Se,n)}function oc(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in t))throw Error(v(108,Ef(e)||"Unknown",i));return H({},n,r)}function Ei(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Dt,Gt=fe.current,F(fe,e),F(Se,Se.current),!0}function Au(e,t,n){var r=e.stateNode;if(!r)throw Error(v(169));n?(e=oc(e,t,Gt),r.__reactInternalMemoizedMergedChildContext=e,j(Se),j(fe),F(fe,e)):j(Se),F(Se,n)}var ct=null,$i=!1,Ml=!1;function sc(e){ct===null?ct=[e]:ct.push(e)}function Bp(e){$i=!0,sc(e)}function Bt(){if(!Ml&&ct!==null){Ml=!0;var e=0,t=L;try{var n=ct;for(L=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}ct=null,$i=!1}catch(i){throw ct!==null&&(ct=ct.slice(e+1)),Ia($o,Bt),i}finally{L=t,Ml=!1}}return null}var gn=[],hn=0,Ci=null,Pi=0,Oe=[],De=0,Yt=null,dt=1,ft="";function Vt(e,t){gn[hn++]=Pi,gn[hn++]=Ci,Ci=e,Pi=t}function uc(e,t,n){Oe[De++]=dt,Oe[De++]=ft,Oe[De++]=Yt,Yt=e;var r=dt;e=ft;var i=32-qe(r)-1;r&=~(1<<i),n+=1;var l=32-qe(t)+i;if(30<l){var o=i-i%5;l=(r&(1<<o)-1).toString(32),r>>=o,i-=o,dt=1<<32-qe(t)+i|n<<i|r,ft=l+e}else dt=1<<l|n<<i|r,ft=e}function Zo(e){e.return!==null&&(Vt(e,1),uc(e,1,0))}function Jo(e){for(;e===Ci;)Ci=gn[--hn],gn[hn]=null,Pi=gn[--hn],gn[hn]=null;for(;e===Yt;)Yt=Oe[--De],Oe[De]=null,ft=Oe[--De],Oe[De]=null,dt=Oe[--De],Oe[De]=null}var Te=null,be=null,V=!1,Qe=null;function ac(e,t){var n=Fe(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Bu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Te=e,be=Rt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Te=e,be=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Yt!==null?{id:dt,overflow:ft}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Fe(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,Te=e,be=null,!0):!1;default:return!1}}function vo(e){return(e.mode&1)!==0&&(e.flags&128)===0}function yo(e){if(V){var t=be;if(t){var n=t;if(!Bu(e,t)){if(vo(e))throw Error(v(418));t=Rt(n.nextSibling);var r=Te;t&&Bu(e,t)?ac(r,n):(e.flags=e.flags&-4097|2,V=!1,Te=e)}}else{if(vo(e))throw Error(v(418));e.flags=e.flags&-4097|2,V=!1,Te=e}}}function ju(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Te=e}function Jr(e){if(e!==Te)return!1;if(!V)return ju(e),V=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!po(e.type,e.memoizedProps)),t&&(t=be)){if(vo(e))throw cc(),Error(v(418));for(;t;)ac(e,t),t=Rt(t.nextSibling)}if(ju(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){be=Rt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}be=null}}else be=Te?Rt(e.stateNode.nextSibling):null;return!0}function cc(){for(var e=be;e;)e=Rt(e.nextSibling)}function bn(){be=Te=null,V=!1}function es(e){Qe===null?Qe=[e]:Qe.push(e)}var jp=yt.ReactCurrentBatchConfig;function Wn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(v(309));var r=n.stateNode}if(!r)throw Error(v(147,e));var i=r,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(o){var s=i.refs;o===null?delete s[l]:s[l]=o},t._stringRef=l,t)}if(typeof e!="string")throw Error(v(284));if(!n._owner)throw Error(v(290,e))}return e}function ei(e,t){throw e=Object.prototype.toString.call(t),Error(v(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Uu(e){var t=e._init;return t(e._payload)}function dc(e){function t(p,c){if(e){var g=p.deletions;g===null?(p.deletions=[c],p.flags|=16):g.push(c)}}function n(p,c){if(!e)return null;for(;c!==null;)t(p,c),c=c.sibling;return null}function r(p,c){for(p=new Map;c!==null;)c.key!==null?p.set(c.key,c):p.set(c.index,c),c=c.sibling;return p}function i(p,c){return p=Mt(p,c),p.index=0,p.sibling=null,p}function l(p,c,g){return p.index=g,e?(g=p.alternate,g!==null?(g=g.index,g<c?(p.flags|=2,c):g):(p.flags|=2,c)):(p.flags|=1048576,c)}function o(p){return e&&p.alternate===null&&(p.flags|=2),p}function s(p,c,g,w){return c===null||c.tag!==6?(c=Ul(g,p.mode,w),c.return=p,c):(c=i(c,g),c.return=p,c)}function u(p,c,g,w){var S=g.type;return S===an?f(p,c,g.props.children,w,g.key):c!==null&&(c.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===kt&&Uu(S)===c.type)?(w=i(c,g.props),w.ref=Wn(p,c,g),w.return=p,w):(w=pi(g.type,g.key,g.props,null,p.mode,w),w.ref=Wn(p,c,g),w.return=p,w)}function a(p,c,g,w){return c===null||c.tag!==4||c.stateNode.containerInfo!==g.containerInfo||c.stateNode.implementation!==g.implementation?(c=Vl(g,p.mode,w),c.return=p,c):(c=i(c,g.children||[]),c.return=p,c)}function f(p,c,g,w,S){return c===null||c.tag!==7?(c=Kt(g,p.mode,w,S),c.return=p,c):(c=i(c,g),c.return=p,c)}function m(p,c,g){if(typeof c=="string"&&c!==""||typeof c=="number")return c=Ul(""+c,p.mode,g),c.return=p,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case Br:return g=pi(c.type,c.key,c.props,null,p.mode,g),g.ref=Wn(p,null,c),g.return=p,g;case un:return c=Vl(c,p.mode,g),c.return=p,c;case kt:var w=c._init;return m(p,w(c._payload),g)}if(Gn(c)||jn(c))return c=Kt(c,p.mode,g,null),c.return=p,c;ei(p,c)}return null}function d(p,c,g,w){var S=c!==null?c.key:null;if(typeof g=="string"&&g!==""||typeof g=="number")return S!==null?null:s(p,c,""+g,w);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Br:return g.key===S?u(p,c,g,w):null;case un:return g.key===S?a(p,c,g,w):null;case kt:return S=g._init,d(p,c,S(g._payload),w)}if(Gn(g)||jn(g))return S!==null?null:f(p,c,g,w,null);ei(p,g)}return null}function h(p,c,g,w,S){if(typeof w=="string"&&w!==""||typeof w=="number")return p=p.get(g)||null,s(c,p,""+w,S);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case Br:return p=p.get(w.key===null?g:w.key)||null,u(c,p,w,S);case un:return p=p.get(w.key===null?g:w.key)||null,a(c,p,w,S);case kt:var E=w._init;return h(p,c,g,E(w._payload),S)}if(Gn(w)||jn(w))return p=p.get(g)||null,f(c,p,w,S,null);ei(c,w)}return null}function y(p,c,g,w){for(var S=null,E=null,x=c,C=c=0,Q=null;x!==null&&C<g.length;C++){x.index>C?(Q=x,x=null):Q=x.sibling;var b=d(p,x,g[C],w);if(b===null){x===null&&(x=Q);break}e&&x&&b.alternate===null&&t(p,x),c=l(b,c,C),E===null?S=b:E.sibling=b,E=b,x=Q}if(C===g.length)return n(p,x),V&&Vt(p,C),S;if(x===null){for(;C<g.length;C++)x=m(p,g[C],w),x!==null&&(c=l(x,c,C),E===null?S=x:E.sibling=x,E=x);return V&&Vt(p,C),S}for(x=r(p,x);C<g.length;C++)Q=h(x,p,C,g[C],w),Q!==null&&(e&&Q.alternate!==null&&x.delete(Q.key===null?C:Q.key),c=l(Q,c,C),E===null?S=Q:E.sibling=Q,E=Q);return e&&x.forEach(function(O){return t(p,O)}),V&&Vt(p,C),S}function _(p,c,g,w){var S=jn(g);if(typeof S!="function")throw Error(v(150));if(g=S.call(g),g==null)throw Error(v(151));for(var E=S=null,x=c,C=c=0,Q=null,b=g.next();x!==null&&!b.done;C++,b=g.next()){x.index>C?(Q=x,x=null):Q=x.sibling;var O=d(p,x,b.value,w);if(O===null){x===null&&(x=Q);break}e&&x&&O.alternate===null&&t(p,x),c=l(O,c,C),E===null?S=O:E.sibling=O,E=O,x=Q}if(b.done)return n(p,x),V&&Vt(p,C),S;if(x===null){for(;!b.done;C++,b=g.next())b=m(p,b.value,w),b!==null&&(c=l(b,c,C),E===null?S=b:E.sibling=b,E=b);return V&&Vt(p,C),S}for(x=r(p,x);!b.done;C++,b=g.next())b=h(x,p,C,b.value,w),b!==null&&(e&&b.alternate!==null&&x.delete(b.key===null?C:b.key),c=l(b,c,C),E===null?S=b:E.sibling=b,E=b);return e&&x.forEach(function(rn){return t(p,rn)}),V&&Vt(p,C),S}function I(p,c,g,w){if(typeof g=="object"&&g!==null&&g.type===an&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case Br:e:{for(var S=g.key,E=c;E!==null;){if(E.key===S){if(S=g.type,S===an){if(E.tag===7){n(p,E.sibling),c=i(E,g.props.children),c.return=p,p=c;break e}}else if(E.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===kt&&Uu(S)===E.type){n(p,E.sibling),c=i(E,g.props),c.ref=Wn(p,E,g),c.return=p,p=c;break e}n(p,E);break}else t(p,E);E=E.sibling}g.type===an?(c=Kt(g.props.children,p.mode,w,g.key),c.return=p,p=c):(w=pi(g.type,g.key,g.props,null,p.mode,w),w.ref=Wn(p,c,g),w.return=p,p=w)}return o(p);case un:e:{for(E=g.key;c!==null;){if(c.key===E)if(c.tag===4&&c.stateNode.containerInfo===g.containerInfo&&c.stateNode.implementation===g.implementation){n(p,c.sibling),c=i(c,g.children||[]),c.return=p,p=c;break e}else{n(p,c);break}else t(p,c);c=c.sibling}c=Vl(g,p.mode,w),c.return=p,p=c}return o(p);case kt:return E=g._init,I(p,c,E(g._payload),w)}if(Gn(g))return y(p,c,g,w);if(jn(g))return _(p,c,g,w);ei(p,g)}return typeof g=="string"&&g!==""||typeof g=="number"?(g=""+g,c!==null&&c.tag===6?(n(p,c.sibling),c=i(c,g),c.return=p,p=c):(n(p,c),c=Ul(g,p.mode,w),c.return=p,p=c),o(p)):n(p,c)}return I}var Tn=dc(!0),fc=dc(!1),Ni=At(null),bi=null,vn=null,ts=null;function ns(){ts=vn=bi=null}function rs(e){var t=Ni.current;j(Ni),e._currentValue=t}function wo(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function En(e,t){bi=e,ts=vn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(ke=!0),e.firstContext=null)}function Be(e){var t=e._currentValue;if(ts!==e)if(e={context:e,memoizedValue:t,next:null},vn===null){if(bi===null)throw Error(v(308));vn=e,bi.dependencies={lanes:0,firstContext:e}}else vn=vn.next=e;return t}var Ht=null;function is(e){Ht===null?Ht=[e]:Ht.push(e)}function pc(e,t,n,r){var i=t.interleaved;return i===null?(n.next=n,is(t)):(n.next=i.next,i.next=n),t.interleaved=n,ht(e,r)}function ht(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var St=!1;function ls(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function mc(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function pt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function zt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,R&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,ht(e,n)}return i=r.interleaved,i===null?(t.next=t,is(r)):(t.next=i.next,i.next=t),r.interleaved=t,ht(e,n)}function si(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Wo(e,n)}}function Vu(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};l===null?i=l=o:l=l.next=o,n=n.next}while(n!==null);l===null?i=l=t:l=l.next=t}else i=l=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:l,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Ti(e,t,n,r){var i=e.updateQueue;St=!1;var l=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var u=s,a=u.next;u.next=null,o===null?l=a:o.next=a,o=u;var f=e.alternate;f!==null&&(f=f.updateQueue,s=f.lastBaseUpdate,s!==o&&(s===null?f.firstBaseUpdate=a:s.next=a,f.lastBaseUpdate=u))}if(l!==null){var m=i.baseState;o=0,f=a=u=null,s=l;do{var d=s.lane,h=s.eventTime;if((r&d)===d){f!==null&&(f=f.next={eventTime:h,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});e:{var y=e,_=s;switch(d=t,h=n,_.tag){case 1:if(y=_.payload,typeof y=="function"){m=y.call(h,m,d);break e}m=y;break e;case 3:y.flags=y.flags&-65537|128;case 0:if(y=_.payload,d=typeof y=="function"?y.call(h,m,d):y,d==null)break e;m=H({},m,d);break e;case 2:St=!0}}s.callback!==null&&s.lane!==0&&(e.flags|=64,d=i.effects,d===null?i.effects=[s]:d.push(s))}else h={eventTime:h,lane:d,tag:s.tag,payload:s.payload,callback:s.callback,next:null},f===null?(a=f=h,u=m):f=f.next=h,o|=d;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;d=s,s=d.next,d.next=null,i.lastBaseUpdate=d,i.shared.pending=null}}while(!0);if(f===null&&(u=m),i.baseState=u,i.firstBaseUpdate=a,i.lastBaseUpdate=f,t=i.shared.interleaved,t!==null){i=t;do o|=i.lane,i=i.next;while(i!==t)}else l===null&&(i.shared.lanes=0);Zt|=o,e.lanes=o,e.memoizedState=m}}function $u(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(v(191,i));i.call(r)}}}var Nr={},rt=At(Nr),yr=At(Nr),wr=At(Nr);function Qt(e){if(e===Nr)throw Error(v(174));return e}function os(e,t){switch(F(wr,t),F(yr,e),F(rt,Nr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Zl(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Zl(t,e)}j(rt),F(rt,t)}function Rn(){j(rt),j(yr),j(wr)}function gc(e){Qt(wr.current);var t=Qt(rt.current),n=Zl(t,e.type);t!==n&&(F(yr,e),F(rt,n))}function ss(e){yr.current===e&&(j(rt),j(yr))}var $=At(0);function Ri(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ol=[];function us(){for(var e=0;e<Ol.length;e++)Ol[e]._workInProgressVersionPrimary=null;Ol.length=0}var ui=yt.ReactCurrentDispatcher,Dl=yt.ReactCurrentBatchConfig,Xt=0,W=null,J=null,te=null,zi=!1,rr=!1,_r=0,Up=0;function ae(){throw Error(v(321))}function as(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ge(e[n],t[n]))return!1;return!0}function cs(e,t,n,r,i,l){if(Xt=l,W=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,ui.current=e===null||e.memoizedState===null?Hp:Qp,e=n(r,i),rr){l=0;do{if(rr=!1,_r=0,25<=l)throw Error(v(301));l+=1,te=J=null,t.updateQueue=null,ui.current=qp,e=n(r,i)}while(rr)}if(ui.current=Ii,t=J!==null&&J.next!==null,Xt=0,te=J=W=null,zi=!1,t)throw Error(v(300));return e}function ds(){var e=_r!==0;return _r=0,e}function et(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return te===null?W.memoizedState=te=e:te=te.next=e,te}function je(){if(J===null){var e=W.alternate;e=e!==null?e.memoizedState:null}else e=J.next;var t=te===null?W.memoizedState:te.next;if(t!==null)te=t,J=e;else{if(e===null)throw Error(v(310));J=e,e={memoizedState:J.memoizedState,baseState:J.baseState,baseQueue:J.baseQueue,queue:J.queue,next:null},te===null?W.memoizedState=te=e:te=te.next=e}return te}function kr(e,t){return typeof t=="function"?t(e):t}function Fl(e){var t=je(),n=t.queue;if(n===null)throw Error(v(311));n.lastRenderedReducer=e;var r=J,i=r.baseQueue,l=n.pending;if(l!==null){if(i!==null){var o=i.next;i.next=l.next,l.next=o}r.baseQueue=i=l,n.pending=null}if(i!==null){l=i.next,r=r.baseState;var s=o=null,u=null,a=l;do{var f=a.lane;if((Xt&f)===f)u!==null&&(u=u.next={lane:0,action:a.action,hasEagerState:a.hasEagerState,eagerState:a.eagerState,next:null}),r=a.hasEagerState?a.eagerState:e(r,a.action);else{var m={lane:f,action:a.action,hasEagerState:a.hasEagerState,eagerState:a.eagerState,next:null};u===null?(s=u=m,o=r):u=u.next=m,W.lanes|=f,Zt|=f}a=a.next}while(a!==null&&a!==l);u===null?o=r:u.next=s,Ge(r,t.memoizedState)||(ke=!0),t.memoizedState=r,t.baseState=o,t.baseQueue=u,n.lastRenderedState=r}if(e=n.interleaved,e!==null){i=e;do l=i.lane,W.lanes|=l,Zt|=l,i=i.next;while(i!==e)}else i===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Al(e){var t=je(),n=t.queue;if(n===null)throw Error(v(311));n.lastRenderedReducer=e;var r=n.dispatch,i=n.pending,l=t.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do l=e(l,o.action),o=o.next;while(o!==i);Ge(l,t.memoizedState)||(ke=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,r]}function hc(){}function vc(e,t){var n=W,r=je(),i=t(),l=!Ge(r.memoizedState,i);if(l&&(r.memoizedState=i,ke=!0),r=r.queue,fs(_c.bind(null,n,r,e),[e]),r.getSnapshot!==t||l||te!==null&&te.memoizedState.tag&1){if(n.flags|=2048,Sr(9,wc.bind(null,n,r,i,t),void 0,null),ne===null)throw Error(v(349));Xt&30||yc(n,t,i)}return i}function yc(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=W.updateQueue,t===null?(t={lastEffect:null,stores:null},W.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function wc(e,t,n,r){t.value=n,t.getSnapshot=r,kc(t)&&Sc(e)}function _c(e,t,n){return n(function(){kc(t)&&Sc(e)})}function kc(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ge(e,n)}catch{return!0}}function Sc(e){var t=ht(e,1);t!==null&&Ke(t,e,1,-1)}function Wu(e){var t=et();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:kr,lastRenderedState:e},t.queue=e,e=e.dispatch=Wp.bind(null,W,e),[t.memoizedState,e]}function Sr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=W.updateQueue,t===null?(t={lastEffect:null,stores:null},W.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function xc(){return je().memoizedState}function ai(e,t,n,r){var i=et();W.flags|=e,i.memoizedState=Sr(1|t,n,void 0,r===void 0?null:r)}function Wi(e,t,n,r){var i=je();r=r===void 0?null:r;var l=void 0;if(J!==null){var o=J.memoizedState;if(l=o.destroy,r!==null&&as(r,o.deps)){i.memoizedState=Sr(t,n,l,r);return}}W.flags|=e,i.memoizedState=Sr(1|t,n,l,r)}function Hu(e,t){return ai(8390656,8,e,t)}function fs(e,t){return Wi(2048,8,e,t)}function Ec(e,t){return Wi(4,2,e,t)}function Cc(e,t){return Wi(4,4,e,t)}function Pc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Nc(e,t,n){return n=n!=null?n.concat([e]):null,Wi(4,4,Pc.bind(null,t,e),n)}function ps(){}function bc(e,t){var n=je();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&as(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Tc(e,t){var n=je();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&as(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Rc(e,t,n){return Xt&21?(Ge(n,t)||(n=Oa(),W.lanes|=n,Zt|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,ke=!0),e.memoizedState=n)}function Vp(e,t){var n=L;L=n!==0&&4>n?n:4,e(!0);var r=Dl.transition;Dl.transition={};try{e(!1),t()}finally{L=n,Dl.transition=r}}function zc(){return je().memoizedState}function $p(e,t,n){var r=Lt(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Ic(e))Lc(t,n);else if(n=pc(e,t,n,r),n!==null){var i=he();Ke(n,e,r,i),Mc(n,t,r)}}function Wp(e,t,n){var r=Lt(e),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ic(e))Lc(t,i);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var o=t.lastRenderedState,s=l(o,n);if(i.hasEagerState=!0,i.eagerState=s,Ge(s,o)){var u=t.interleaved;u===null?(i.next=i,is(t)):(i.next=u.next,u.next=i),t.interleaved=i;return}}catch{}finally{}n=pc(e,t,i,r),n!==null&&(i=he(),Ke(n,e,r,i),Mc(n,t,r))}}function Ic(e){var t=e.alternate;return e===W||t!==null&&t===W}function Lc(e,t){rr=zi=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Mc(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Wo(e,n)}}var Ii={readContext:Be,useCallback:ae,useContext:ae,useEffect:ae,useImperativeHandle:ae,useInsertionEffect:ae,useLayoutEffect:ae,useMemo:ae,useReducer:ae,useRef:ae,useState:ae,useDebugValue:ae,useDeferredValue:ae,useTransition:ae,useMutableSource:ae,useSyncExternalStore:ae,useId:ae,unstable_isNewReconciler:!1},Hp={readContext:Be,useCallback:function(e,t){return et().memoizedState=[e,t===void 0?null:t],e},useContext:Be,useEffect:Hu,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,ai(4194308,4,Pc.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ai(4194308,4,e,t)},useInsertionEffect:function(e,t){return ai(4,2,e,t)},useMemo:function(e,t){var n=et();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=et();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=$p.bind(null,W,e),[r.memoizedState,e]},useRef:function(e){var t=et();return e={current:e},t.memoizedState=e},useState:Wu,useDebugValue:ps,useDeferredValue:function(e){return et().memoizedState=e},useTransition:function(){var e=Wu(!1),t=e[0];return e=Vp.bind(null,e[1]),et().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=W,i=et();if(V){if(n===void 0)throw Error(v(407));n=n()}else{if(n=t(),ne===null)throw Error(v(349));Xt&30||yc(r,t,n)}i.memoizedState=n;var l={value:n,getSnapshot:t};return i.queue=l,Hu(_c.bind(null,r,l,e),[e]),r.flags|=2048,Sr(9,wc.bind(null,r,l,n,t),void 0,null),n},useId:function(){var e=et(),t=ne.identifierPrefix;if(V){var n=ft,r=dt;n=(r&~(1<<32-qe(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=_r++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Up++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Qp={readContext:Be,useCallback:bc,useContext:Be,useEffect:fs,useImperativeHandle:Nc,useInsertionEffect:Ec,useLayoutEffect:Cc,useMemo:Tc,useReducer:Fl,useRef:xc,useState:function(){return Fl(kr)},useDebugValue:ps,useDeferredValue:function(e){var t=je();return Rc(t,J.memoizedState,e)},useTransition:function(){var e=Fl(kr)[0],t=je().memoizedState;return[e,t]},useMutableSource:hc,useSyncExternalStore:vc,useId:zc,unstable_isNewReconciler:!1},qp={readContext:Be,useCallback:bc,useContext:Be,useEffect:fs,useImperativeHandle:Nc,useInsertionEffect:Ec,useLayoutEffect:Cc,useMemo:Tc,useReducer:Al,useRef:xc,useState:function(){return Al(kr)},useDebugValue:ps,useDeferredValue:function(e){var t=je();return J===null?t.memoizedState=e:Rc(t,J.memoizedState,e)},useTransition:function(){var e=Al(kr)[0],t=je().memoizedState;return[e,t]},useMutableSource:hc,useSyncExternalStore:vc,useId:zc,unstable_isNewReconciler:!1};function We(e,t){if(e&&e.defaultProps){t=H({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function _o(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:H({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Hi={isMounted:function(e){return(e=e._reactInternals)?tn(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=he(),i=Lt(e),l=pt(r,i);l.payload=t,n!=null&&(l.callback=n),t=zt(e,l,i),t!==null&&(Ke(t,e,i,r),si(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=he(),i=Lt(e),l=pt(r,i);l.tag=1,l.payload=t,n!=null&&(l.callback=n),t=zt(e,l,i),t!==null&&(Ke(t,e,i,r),si(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=he(),r=Lt(e),i=pt(n,r);i.tag=2,t!=null&&(i.callback=t),t=zt(e,i,r),t!==null&&(Ke(t,e,r,n),si(t,e,r))}};function Qu(e,t,n,r,i,l,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,l,o):t.prototype&&t.prototype.isPureReactComponent?!mr(n,r)||!mr(i,l):!0}function Oc(e,t,n){var r=!1,i=Dt,l=t.contextType;return typeof l=="object"&&l!==null?l=Be(l):(i=xe(t)?Gt:fe.current,r=t.contextTypes,l=(r=r!=null)?Nn(e,i):Dt),t=new t(n,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Hi,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=l),t}function qu(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Hi.enqueueReplaceState(t,t.state,null)}function ko(e,t,n,r){var i=e.stateNode;i.props=n,i.state=e.memoizedState,i.refs={},ls(e);var l=t.contextType;typeof l=="object"&&l!==null?i.context=Be(l):(l=xe(t)?Gt:fe.current,i.context=Nn(e,l)),i.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(_o(e,t,l,n),i.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(t=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),t!==i.state&&Hi.enqueueReplaceState(i,i.state,null),Ti(e,n,i,r),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function zn(e,t){try{var n="",r=t;do n+=xf(r),r=r.return;while(r);var i=n}catch(l){i=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:i,digest:null}}function Bl(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function So(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Kp=typeof WeakMap=="function"?WeakMap:Map;function Dc(e,t,n){n=pt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Mi||(Mi=!0,Io=r),So(e,t)},n}function Fc(e,t,n){n=pt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var i=t.value;n.payload=function(){return r(i)},n.callback=function(){So(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(n.callback=function(){So(e,t),typeof r!="function"&&(It===null?It=new Set([this]):It.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function Ku(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Kp;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(i.add(n),e=um.bind(null,e,t,n),t.then(e,e))}function Gu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Yu(e,t,n,r,i){return e.mode&1?(e.flags|=65536,e.lanes=i,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=pt(-1,1),t.tag=2,zt(n,t,1))),n.lanes|=1),e)}var Gp=yt.ReactCurrentOwner,ke=!1;function ge(e,t,n,r){t.child=e===null?fc(t,null,n,r):Tn(t,e.child,n,r)}function Xu(e,t,n,r,i){n=n.render;var l=t.ref;return En(t,i),r=cs(e,t,n,r,l,i),n=ds(),e!==null&&!ke?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,vt(e,t,i)):(V&&n&&Zo(t),t.flags|=1,ge(e,t,r,i),t.child)}function Zu(e,t,n,r,i){if(e===null){var l=n.type;return typeof l=="function"&&!ks(l)&&l.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=l,Ac(e,t,l,r,i)):(e=pi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!(e.lanes&i)){var o=l.memoizedProps;if(n=n.compare,n=n!==null?n:mr,n(o,r)&&e.ref===t.ref)return vt(e,t,i)}return t.flags|=1,e=Mt(l,r),e.ref=t.ref,e.return=t,t.child=e}function Ac(e,t,n,r,i){if(e!==null){var l=e.memoizedProps;if(mr(l,r)&&e.ref===t.ref)if(ke=!1,t.pendingProps=r=l,(e.lanes&i)!==0)e.flags&131072&&(ke=!0);else return t.lanes=e.lanes,vt(e,t,i)}return xo(e,t,n,r,i)}function Bc(e,t,n){var r=t.pendingProps,i=r.children,l=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},F(wn,Ne),Ne|=n;else{if(!(n&1073741824))return e=l!==null?l.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,F(wn,Ne),Ne|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=l!==null?l.baseLanes:n,F(wn,Ne),Ne|=r}else l!==null?(r=l.baseLanes|n,t.memoizedState=null):r=n,F(wn,Ne),Ne|=r;return ge(e,t,i,n),t.child}function jc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function xo(e,t,n,r,i){var l=xe(n)?Gt:fe.current;return l=Nn(t,l),En(t,i),n=cs(e,t,n,r,l,i),r=ds(),e!==null&&!ke?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,vt(e,t,i)):(V&&r&&Zo(t),t.flags|=1,ge(e,t,n,i),t.child)}function Ju(e,t,n,r,i){if(xe(n)){var l=!0;Ei(t)}else l=!1;if(En(t,i),t.stateNode===null)ci(e,t),Oc(t,n,r),ko(t,n,r,i),r=!0;else if(e===null){var o=t.stateNode,s=t.memoizedProps;o.props=s;var u=o.context,a=n.contextType;typeof a=="object"&&a!==null?a=Be(a):(a=xe(n)?Gt:fe.current,a=Nn(t,a));var f=n.getDerivedStateFromProps,m=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function";m||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(s!==r||u!==a)&&qu(t,o,r,a),St=!1;var d=t.memoizedState;o.state=d,Ti(t,r,o,i),u=t.memoizedState,s!==r||d!==u||Se.current||St?(typeof f=="function"&&(_o(t,n,f,r),u=t.memoizedState),(s=St||Qu(t,n,s,r,d,u,a))?(m||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=u),o.props=r,o.state=u,o.context=a,r=s):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,mc(e,t),s=t.memoizedProps,a=t.type===t.elementType?s:We(t.type,s),o.props=a,m=t.pendingProps,d=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Be(u):(u=xe(n)?Gt:fe.current,u=Nn(t,u));var h=n.getDerivedStateFromProps;(f=typeof h=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(s!==m||d!==u)&&qu(t,o,r,u),St=!1,d=t.memoizedState,o.state=d,Ti(t,r,o,i);var y=t.memoizedState;s!==m||d!==y||Se.current||St?(typeof h=="function"&&(_o(t,n,h,r),y=t.memoizedState),(a=St||Qu(t,n,a,r,d,y,u)||!1)?(f||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,y,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,y,u)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||s===e.memoizedProps&&d===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&d===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=y),o.props=r,o.state=y,o.context=u,r=a):(typeof o.componentDidUpdate!="function"||s===e.memoizedProps&&d===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&d===e.memoizedState||(t.flags|=1024),r=!1)}return Eo(e,t,n,r,l,i)}function Eo(e,t,n,r,i,l){jc(e,t);var o=(t.flags&128)!==0;if(!r&&!o)return i&&Au(t,n,!1),vt(e,t,l);r=t.stateNode,Gp.current=t;var s=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&o?(t.child=Tn(t,e.child,null,l),t.child=Tn(t,null,s,l)):ge(e,t,s,l),t.memoizedState=r.state,i&&Au(t,n,!0),t.child}function Uc(e){var t=e.stateNode;t.pendingContext?Fu(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Fu(e,t.context,!1),os(e,t.containerInfo)}function ea(e,t,n,r,i){return bn(),es(i),t.flags|=256,ge(e,t,n,r),t.child}var Co={dehydrated:null,treeContext:null,retryLane:0};function Po(e){return{baseLanes:e,cachePool:null,transitions:null}}function Vc(e,t,n){var r=t.pendingProps,i=$.current,l=!1,o=(t.flags&128)!==0,s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:(i&2)!==0),s?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),F($,i&1),e===null)return yo(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=r.children,e=r.fallback,l?(r=t.mode,l=t.child,o={mode:"hidden",children:o},!(r&1)&&l!==null?(l.childLanes=0,l.pendingProps=o):l=Ki(o,r,0,null),e=Kt(e,r,n,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=Po(n),t.memoizedState=Co,e):ms(t,o));if(i=e.memoizedState,i!==null&&(s=i.dehydrated,s!==null))return Yp(e,t,o,r,s,i,n);if(l){l=r.fallback,o=t.mode,i=e.child,s=i.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&t.child!==i?(r=t.child,r.childLanes=0,r.pendingProps=u,t.deletions=null):(r=Mt(i,u),r.subtreeFlags=i.subtreeFlags&14680064),s!==null?l=Mt(s,l):(l=Kt(l,o,n,null),l.flags|=2),l.return=t,r.return=t,r.sibling=l,t.child=r,r=l,l=t.child,o=e.child.memoizedState,o=o===null?Po(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},l.memoizedState=o,l.childLanes=e.childLanes&~n,t.memoizedState=Co,r}return l=e.child,e=l.sibling,r=Mt(l,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function ms(e,t){return t=Ki({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function ti(e,t,n,r){return r!==null&&es(r),Tn(t,e.child,null,n),e=ms(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Yp(e,t,n,r,i,l,o){if(n)return t.flags&256?(t.flags&=-257,r=Bl(Error(v(422))),ti(e,t,o,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=r.fallback,i=t.mode,r=Ki({mode:"visible",children:r.children},i,0,null),l=Kt(l,i,o,null),l.flags|=2,r.return=t,l.return=t,r.sibling=l,t.child=r,t.mode&1&&Tn(t,e.child,null,o),t.child.memoizedState=Po(o),t.memoizedState=Co,l);if(!(t.mode&1))return ti(e,t,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var s=r.dgst;return r=s,l=Error(v(419)),r=Bl(l,r,void 0),ti(e,t,o,r)}if(s=(o&e.childLanes)!==0,ke||s){if(r=ne,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==l.retryLane&&(l.retryLane=i,ht(e,i),Ke(r,e,i,-1))}return _s(),r=Bl(Error(v(421))),ti(e,t,o,r)}return i.data==="$?"?(t.flags|=128,t.child=e.child,t=am.bind(null,e),i._reactRetry=t,null):(e=l.treeContext,be=Rt(i.nextSibling),Te=t,V=!0,Qe=null,e!==null&&(Oe[De++]=dt,Oe[De++]=ft,Oe[De++]=Yt,dt=e.id,ft=e.overflow,Yt=t),t=ms(t,r.children),t.flags|=4096,t)}function ta(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),wo(e.return,t,n)}function jl(e,t,n,r,i){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=r,l.tail=n,l.tailMode=i)}function $c(e,t,n){var r=t.pendingProps,i=r.revealOrder,l=r.tail;if(ge(e,t,r.children,n),r=$.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&ta(e,n,t);else if(e.tag===19)ta(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(F($,r),!(t.mode&1))t.memoizedState=null;else switch(i){case"forwards":for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&Ri(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),jl(t,!1,i,n,l);break;case"backwards":for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&Ri(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}jl(t,!0,n,null,l);break;case"together":jl(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ci(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function vt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Zt|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(v(153));if(t.child!==null){for(e=t.child,n=Mt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Mt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Xp(e,t,n){switch(t.tag){case 3:Uc(t),bn();break;case 5:gc(t);break;case 1:xe(t.type)&&Ei(t);break;case 4:os(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,i=t.memoizedProps.value;F(Ni,r._currentValue),r._currentValue=i;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(F($,$.current&1),t.flags|=128,null):n&t.child.childLanes?Vc(e,t,n):(F($,$.current&1),e=vt(e,t,n),e!==null?e.sibling:null);F($,$.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return $c(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),F($,$.current),r)break;return null;case 22:case 23:return t.lanes=0,Bc(e,t,n)}return vt(e,t,n)}var Wc,No,Hc,Qc;Wc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};No=function(){};Hc=function(e,t,n,r){var i=e.memoizedProps;if(i!==r){e=t.stateNode,Qt(rt.current);var l=null;switch(n){case"input":i=Kl(e,i),r=Kl(e,r),l=[];break;case"select":i=H({},i,{value:void 0}),r=H({},r,{value:void 0}),l=[];break;case"textarea":i=Xl(e,i),r=Xl(e,r),l=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Si)}Jl(n,r);var o;n=null;for(a in i)if(!r.hasOwnProperty(a)&&i.hasOwnProperty(a)&&i[a]!=null)if(a==="style"){var s=i[a];for(o in s)s.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else a!=="dangerouslySetInnerHTML"&&a!=="children"&&a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(sr.hasOwnProperty(a)?l||(l=[]):(l=l||[]).push(a,null));for(a in r){var u=r[a];if(s=i!=null?i[a]:void 0,r.hasOwnProperty(a)&&u!==s&&(u!=null||s!=null))if(a==="style")if(s){for(o in s)!s.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&s[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(l||(l=[]),l.push(a,n)),n=u;else a==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,s=s?s.__html:void 0,u!=null&&s!==u&&(l=l||[]).push(a,u)):a==="children"?typeof u!="string"&&typeof u!="number"||(l=l||[]).push(a,""+u):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&(sr.hasOwnProperty(a)?(u!=null&&a==="onScroll"&&B("scroll",e),l||s===u||(l=[])):(l=l||[]).push(a,u))}n&&(l=l||[]).push("style",n);var a=l;(t.updateQueue=a)&&(t.flags|=4)}};Qc=function(e,t,n,r){n!==r&&(t.flags|=4)};function Hn(e,t){if(!V)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function ce(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Zp(e,t,n){var r=t.pendingProps;switch(Jo(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ce(t),null;case 1:return xe(t.type)&&xi(),ce(t),null;case 3:return r=t.stateNode,Rn(),j(Se),j(fe),us(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Jr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Qe!==null&&(Oo(Qe),Qe=null))),No(e,t),ce(t),null;case 5:ss(t);var i=Qt(wr.current);if(n=t.type,e!==null&&t.stateNode!=null)Hc(e,t,n,r,i),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(v(166));return ce(t),null}if(e=Qt(rt.current),Jr(t)){r=t.stateNode,n=t.type;var l=t.memoizedProps;switch(r[tt]=t,r[vr]=l,e=(t.mode&1)!==0,n){case"dialog":B("cancel",r),B("close",r);break;case"iframe":case"object":case"embed":B("load",r);break;case"video":case"audio":for(i=0;i<Xn.length;i++)B(Xn[i],r);break;case"source":B("error",r);break;case"img":case"image":case"link":B("error",r),B("load",r);break;case"details":B("toggle",r);break;case"input":au(r,l),B("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!l.multiple},B("invalid",r);break;case"textarea":du(r,l),B("invalid",r)}Jl(n,l),i=null;for(var o in l)if(l.hasOwnProperty(o)){var s=l[o];o==="children"?typeof s=="string"?r.textContent!==s&&(l.suppressHydrationWarning!==!0&&Zr(r.textContent,s,e),i=["children",s]):typeof s=="number"&&r.textContent!==""+s&&(l.suppressHydrationWarning!==!0&&Zr(r.textContent,s,e),i=["children",""+s]):sr.hasOwnProperty(o)&&s!=null&&o==="onScroll"&&B("scroll",r)}switch(n){case"input":jr(r),cu(r,l,!0);break;case"textarea":jr(r),fu(r);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(r.onclick=Si)}r=i,t.updateQueue=r,r!==null&&(t.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=_a(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(n,{is:r.is}):(e=o.createElement(n),n==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,n),e[tt]=t,e[vr]=r,Wc(e,t,!1,!1),t.stateNode=e;e:{switch(o=eo(n,r),n){case"dialog":B("cancel",e),B("close",e),i=r;break;case"iframe":case"object":case"embed":B("load",e),i=r;break;case"video":case"audio":for(i=0;i<Xn.length;i++)B(Xn[i],e);i=r;break;case"source":B("error",e),i=r;break;case"img":case"image":case"link":B("error",e),B("load",e),i=r;break;case"details":B("toggle",e),i=r;break;case"input":au(e,r),i=Kl(e,r),B("invalid",e);break;case"option":i=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},i=H({},r,{value:void 0}),B("invalid",e);break;case"textarea":du(e,r),i=Xl(e,r),B("invalid",e);break;default:i=r}Jl(n,i),s=i;for(l in s)if(s.hasOwnProperty(l)){var u=s[l];l==="style"?xa(e,u):l==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&ka(e,u)):l==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&ur(e,u):typeof u=="number"&&ur(e,""+u):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(sr.hasOwnProperty(l)?u!=null&&l==="onScroll"&&B("scroll",e):u!=null&&Ao(e,l,u,o))}switch(n){case"input":jr(e),cu(e,r,!1);break;case"textarea":jr(e),fu(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Ot(r.value));break;case"select":e.multiple=!!r.multiple,l=r.value,l!=null?_n(e,!!r.multiple,l,!1):r.defaultValue!=null&&_n(e,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=Si)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return ce(t),null;case 6:if(e&&t.stateNode!=null)Qc(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(v(166));if(n=Qt(wr.current),Qt(rt.current),Jr(t)){if(r=t.stateNode,n=t.memoizedProps,r[tt]=t,(l=r.nodeValue!==n)&&(e=Te,e!==null))switch(e.tag){case 3:Zr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Zr(r.nodeValue,n,(e.mode&1)!==0)}l&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[tt]=t,t.stateNode=r}return ce(t),null;case 13:if(j($),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(V&&be!==null&&t.mode&1&&!(t.flags&128))cc(),bn(),t.flags|=98560,l=!1;else if(l=Jr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!l)throw Error(v(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(v(317));l[tt]=t}else bn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;ce(t),l=!1}else Qe!==null&&(Oo(Qe),Qe=null),l=!0;if(!l)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||$.current&1?ee===0&&(ee=3):_s())),t.updateQueue!==null&&(t.flags|=4),ce(t),null);case 4:return Rn(),No(e,t),e===null&&gr(t.stateNode.containerInfo),ce(t),null;case 10:return rs(t.type._context),ce(t),null;case 17:return xe(t.type)&&xi(),ce(t),null;case 19:if(j($),l=t.memoizedState,l===null)return ce(t),null;if(r=(t.flags&128)!==0,o=l.rendering,o===null)if(r)Hn(l,!1);else{if(ee!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=Ri(e),o!==null){for(t.flags|=128,Hn(l,!1),r=o.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)l=n,e=r,l.flags&=14680066,o=l.alternate,o===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=o.childLanes,l.lanes=o.lanes,l.child=o.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=o.memoizedProps,l.memoizedState=o.memoizedState,l.updateQueue=o.updateQueue,l.type=o.type,e=o.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return F($,$.current&1|2),t.child}e=e.sibling}l.tail!==null&&K()>In&&(t.flags|=128,r=!0,Hn(l,!1),t.lanes=4194304)}else{if(!r)if(e=Ri(o),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Hn(l,!0),l.tail===null&&l.tailMode==="hidden"&&!o.alternate&&!V)return ce(t),null}else 2*K()-l.renderingStartTime>In&&n!==1073741824&&(t.flags|=128,r=!0,Hn(l,!1),t.lanes=4194304);l.isBackwards?(o.sibling=t.child,t.child=o):(n=l.last,n!==null?n.sibling=o:t.child=o,l.last=o)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=K(),t.sibling=null,n=$.current,F($,r?n&1|2:n&1),t):(ce(t),null);case 22:case 23:return ws(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?Ne&1073741824&&(ce(t),t.subtreeFlags&6&&(t.flags|=8192)):ce(t),null;case 24:return null;case 25:return null}throw Error(v(156,t.tag))}function Jp(e,t){switch(Jo(t),t.tag){case 1:return xe(t.type)&&xi(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Rn(),j(Se),j(fe),us(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return ss(t),null;case 13:if(j($),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(v(340));bn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return j($),null;case 4:return Rn(),null;case 10:return rs(t.type._context),null;case 22:case 23:return ws(),null;case 24:return null;default:return null}}var ni=!1,de=!1,em=typeof WeakSet=="function"?WeakSet:Set,k=null;function yn(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){q(e,t,r)}else n.current=null}function bo(e,t,n){try{n()}catch(r){q(e,t,r)}}var na=!1;function tm(e,t){if(co=wi,e=Xa(),Xo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,l=r.focusNode;r=r.focusOffset;try{n.nodeType,l.nodeType}catch{n=null;break e}var o=0,s=-1,u=-1,a=0,f=0,m=e,d=null;t:for(;;){for(var h;m!==n||i!==0&&m.nodeType!==3||(s=o+i),m!==l||r!==0&&m.nodeType!==3||(u=o+r),m.nodeType===3&&(o+=m.nodeValue.length),(h=m.firstChild)!==null;)d=m,m=h;for(;;){if(m===e)break t;if(d===n&&++a===i&&(s=o),d===l&&++f===r&&(u=o),(h=m.nextSibling)!==null)break;m=d,d=m.parentNode}m=h}n=s===-1||u===-1?null:{start:s,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(fo={focusedElem:e,selectionRange:n},wi=!1,k=t;k!==null;)if(t=k,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,k=e;else for(;k!==null;){t=k;try{var y=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(y!==null){var _=y.memoizedProps,I=y.memoizedState,p=t.stateNode,c=p.getSnapshotBeforeUpdate(t.elementType===t.type?_:We(t.type,_),I);p.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var g=t.stateNode.containerInfo;g.nodeType===1?g.textContent="":g.nodeType===9&&g.documentElement&&g.removeChild(g.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(v(163))}}catch(w){q(t,t.return,w)}if(e=t.sibling,e!==null){e.return=t.return,k=e;break}k=t.return}return y=na,na=!1,y}function ir(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&e)===e){var l=i.destroy;i.destroy=void 0,l!==void 0&&bo(t,n,l)}i=i.next}while(i!==r)}}function Qi(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function To(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function qc(e){var t=e.alternate;t!==null&&(e.alternate=null,qc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[tt],delete t[vr],delete t[go],delete t[Fp],delete t[Ap])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Kc(e){return e.tag===5||e.tag===3||e.tag===4}function ra(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Kc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ro(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Si));else if(r!==4&&(e=e.child,e!==null))for(Ro(e,t,n),e=e.sibling;e!==null;)Ro(e,t,n),e=e.sibling}function zo(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(zo(e,t,n),e=e.sibling;e!==null;)zo(e,t,n),e=e.sibling}var ie=null,He=!1;function _t(e,t,n){for(n=n.child;n!==null;)Gc(e,t,n),n=n.sibling}function Gc(e,t,n){if(nt&&typeof nt.onCommitFiberUnmount=="function")try{nt.onCommitFiberUnmount(Ai,n)}catch{}switch(n.tag){case 5:de||yn(n,t);case 6:var r=ie,i=He;ie=null,_t(e,t,n),ie=r,He=i,ie!==null&&(He?(e=ie,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):ie.removeChild(n.stateNode));break;case 18:ie!==null&&(He?(e=ie,n=n.stateNode,e.nodeType===8?Ll(e.parentNode,n):e.nodeType===1&&Ll(e,n),fr(e)):Ll(ie,n.stateNode));break;case 4:r=ie,i=He,ie=n.stateNode.containerInfo,He=!0,_t(e,t,n),ie=r,He=i;break;case 0:case 11:case 14:case 15:if(!de&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var l=i,o=l.destroy;l=l.tag,o!==void 0&&(l&2||l&4)&&bo(n,t,o),i=i.next}while(i!==r)}_t(e,t,n);break;case 1:if(!de&&(yn(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(s){q(n,t,s)}_t(e,t,n);break;case 21:_t(e,t,n);break;case 22:n.mode&1?(de=(r=de)||n.memoizedState!==null,_t(e,t,n),de=r):_t(e,t,n);break;default:_t(e,t,n)}}function ia(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new em),t.forEach(function(r){var i=cm.bind(null,e,r);n.has(r)||(n.add(r),r.then(i,i))})}}function $e(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var l=e,o=t,s=o;e:for(;s!==null;){switch(s.tag){case 5:ie=s.stateNode,He=!1;break e;case 3:ie=s.stateNode.containerInfo,He=!0;break e;case 4:ie=s.stateNode.containerInfo,He=!0;break e}s=s.return}if(ie===null)throw Error(v(160));Gc(l,o,i),ie=null,He=!1;var u=i.alternate;u!==null&&(u.return=null),i.return=null}catch(a){q(i,t,a)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Yc(t,e),t=t.sibling}function Yc(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if($e(t,e),Je(e),r&4){try{ir(3,e,e.return),Qi(3,e)}catch(_){q(e,e.return,_)}try{ir(5,e,e.return)}catch(_){q(e,e.return,_)}}break;case 1:$e(t,e),Je(e),r&512&&n!==null&&yn(n,n.return);break;case 5:if($e(t,e),Je(e),r&512&&n!==null&&yn(n,n.return),e.flags&32){var i=e.stateNode;try{ur(i,"")}catch(_){q(e,e.return,_)}}if(r&4&&(i=e.stateNode,i!=null)){var l=e.memoizedProps,o=n!==null?n.memoizedProps:l,s=e.type,u=e.updateQueue;if(e.updateQueue=null,u!==null)try{s==="input"&&l.type==="radio"&&l.name!=null&&ya(i,l),eo(s,o);var a=eo(s,l);for(o=0;o<u.length;o+=2){var f=u[o],m=u[o+1];f==="style"?xa(i,m):f==="dangerouslySetInnerHTML"?ka(i,m):f==="children"?ur(i,m):Ao(i,f,m,a)}switch(s){case"input":Gl(i,l);break;case"textarea":wa(i,l);break;case"select":var d=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!l.multiple;var h=l.value;h!=null?_n(i,!!l.multiple,h,!1):d!==!!l.multiple&&(l.defaultValue!=null?_n(i,!!l.multiple,l.defaultValue,!0):_n(i,!!l.multiple,l.multiple?[]:"",!1))}i[vr]=l}catch(_){q(e,e.return,_)}}break;case 6:if($e(t,e),Je(e),r&4){if(e.stateNode===null)throw Error(v(162));i=e.stateNode,l=e.memoizedProps;try{i.nodeValue=l}catch(_){q(e,e.return,_)}}break;case 3:if($e(t,e),Je(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{fr(t.containerInfo)}catch(_){q(e,e.return,_)}break;case 4:$e(t,e),Je(e);break;case 13:$e(t,e),Je(e),i=e.child,i.flags&8192&&(l=i.memoizedState!==null,i.stateNode.isHidden=l,!l||i.alternate!==null&&i.alternate.memoizedState!==null||(vs=K())),r&4&&ia(e);break;case 22:if(f=n!==null&&n.memoizedState!==null,e.mode&1?(de=(a=de)||f,$e(t,e),de=a):$e(t,e),Je(e),r&8192){if(a=e.memoizedState!==null,(e.stateNode.isHidden=a)&&!f&&e.mode&1)for(k=e,f=e.child;f!==null;){for(m=k=f;k!==null;){switch(d=k,h=d.child,d.tag){case 0:case 11:case 14:case 15:ir(4,d,d.return);break;case 1:yn(d,d.return);var y=d.stateNode;if(typeof y.componentWillUnmount=="function"){r=d,n=d.return;try{t=r,y.props=t.memoizedProps,y.state=t.memoizedState,y.componentWillUnmount()}catch(_){q(r,n,_)}}break;case 5:yn(d,d.return);break;case 22:if(d.memoizedState!==null){oa(m);continue}}h!==null?(h.return=d,k=h):oa(m)}f=f.sibling}e:for(f=null,m=e;;){if(m.tag===5){if(f===null){f=m;try{i=m.stateNode,a?(l=i.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(s=m.stateNode,u=m.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,s.style.display=Sa("display",o))}catch(_){q(e,e.return,_)}}}else if(m.tag===6){if(f===null)try{m.stateNode.nodeValue=a?"":m.memoizedProps}catch(_){q(e,e.return,_)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===e)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===e)break e;for(;m.sibling===null;){if(m.return===null||m.return===e)break e;f===m&&(f=null),m=m.return}f===m&&(f=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:$e(t,e),Je(e),r&4&&ia(e);break;case 21:break;default:$e(t,e),Je(e)}}function Je(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Kc(n)){var r=n;break e}n=n.return}throw Error(v(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(ur(i,""),r.flags&=-33);var l=ra(e);zo(e,l,i);break;case 3:case 4:var o=r.stateNode.containerInfo,s=ra(e);Ro(e,s,o);break;default:throw Error(v(161))}}catch(u){q(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function nm(e,t,n){k=e,Xc(e,t,n)}function Xc(e,t,n){for(var r=(e.mode&1)!==0;k!==null;){var i=k,l=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||ni;if(!o){var s=i.alternate,u=s!==null&&s.memoizedState!==null||de;s=ni;var a=de;if(ni=o,(de=u)&&!a)for(k=i;k!==null;)o=k,u=o.child,o.tag===22&&o.memoizedState!==null?sa(i):u!==null?(u.return=o,k=u):sa(i);for(;l!==null;)k=l,Xc(l,t,n),l=l.sibling;k=i,ni=s,de=a}la(e,t,n)}else i.subtreeFlags&8772&&l!==null?(l.return=i,k=l):la(e,t,n)}}function la(e){for(;k!==null;){var t=k;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:de||Qi(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!de)if(n===null)r.componentDidMount();else{var i=t.elementType===t.type?n.memoizedProps:We(t.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&$u(t,l,r);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}$u(t,o,n)}break;case 5:var s=t.stateNode;if(n===null&&t.flags&4){n=s;var u=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var a=t.alternate;if(a!==null){var f=a.memoizedState;if(f!==null){var m=f.dehydrated;m!==null&&fr(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(v(163))}de||t.flags&512&&To(t)}catch(d){q(t,t.return,d)}}if(t===e){k=null;break}if(n=t.sibling,n!==null){n.return=t.return,k=n;break}k=t.return}}function oa(e){for(;k!==null;){var t=k;if(t===e){k=null;break}var n=t.sibling;if(n!==null){n.return=t.return,k=n;break}k=t.return}}function sa(e){for(;k!==null;){var t=k;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Qi(4,t)}catch(u){q(t,n,u)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var i=t.return;try{r.componentDidMount()}catch(u){q(t,i,u)}}var l=t.return;try{To(t)}catch(u){q(t,l,u)}break;case 5:var o=t.return;try{To(t)}catch(u){q(t,o,u)}}}catch(u){q(t,t.return,u)}if(t===e){k=null;break}var s=t.sibling;if(s!==null){s.return=t.return,k=s;break}k=t.return}}var rm=Math.ceil,Li=yt.ReactCurrentDispatcher,gs=yt.ReactCurrentOwner,Ae=yt.ReactCurrentBatchConfig,R=0,ne=null,X=null,le=0,Ne=0,wn=At(0),ee=0,xr=null,Zt=0,qi=0,hs=0,lr=null,_e=null,vs=0,In=1/0,at=null,Mi=!1,Io=null,It=null,ri=!1,Pt=null,Oi=0,or=0,Lo=null,di=-1,fi=0;function he(){return R&6?K():di!==-1?di:di=K()}function Lt(e){return e.mode&1?R&2&&le!==0?le&-le:jp.transition!==null?(fi===0&&(fi=Oa()),fi):(e=L,e!==0||(e=window.event,e=e===void 0?16:Va(e.type)),e):1}function Ke(e,t,n,r){if(50<or)throw or=0,Lo=null,Error(v(185));Er(e,n,r),(!(R&2)||e!==ne)&&(e===ne&&(!(R&2)&&(qi|=n),ee===4&&Et(e,le)),Ee(e,r),n===1&&R===0&&!(t.mode&1)&&(In=K()+500,$i&&Bt()))}function Ee(e,t){var n=e.callbackNode;Vf(e,t);var r=yi(e,e===ne?le:0);if(r===0)n!==null&&gu(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&gu(n),t===1)e.tag===0?Bp(ua.bind(null,e)):sc(ua.bind(null,e)),Op(function(){!(R&6)&&Bt()}),n=null;else{switch(Da(r)){case 1:n=$o;break;case 4:n=La;break;case 16:n=vi;break;case 536870912:n=Ma;break;default:n=vi}n=ld(n,Zc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Zc(e,t){if(di=-1,fi=0,R&6)throw Error(v(327));var n=e.callbackNode;if(Cn()&&e.callbackNode!==n)return null;var r=yi(e,e===ne?le:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=Di(e,r);else{t=r;var i=R;R|=2;var l=ed();(ne!==e||le!==t)&&(at=null,In=K()+500,qt(e,t));do try{om();break}catch(s){Jc(e,s)}while(!0);ns(),Li.current=l,R=i,X!==null?t=0:(ne=null,le=0,t=ee)}if(t!==0){if(t===2&&(i=lo(e),i!==0&&(r=i,t=Mo(e,i))),t===1)throw n=xr,qt(e,0),Et(e,r),Ee(e,K()),n;if(t===6)Et(e,r);else{if(i=e.current.alternate,!(r&30)&&!im(i)&&(t=Di(e,r),t===2&&(l=lo(e),l!==0&&(r=l,t=Mo(e,l))),t===1))throw n=xr,qt(e,0),Et(e,r),Ee(e,K()),n;switch(e.finishedWork=i,e.finishedLanes=r,t){case 0:case 1:throw Error(v(345));case 2:$t(e,_e,at);break;case 3:if(Et(e,r),(r&130023424)===r&&(t=vs+500-K(),10<t)){if(yi(e,0)!==0)break;if(i=e.suspendedLanes,(i&r)!==r){he(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=mo($t.bind(null,e,_e,at),t);break}$t(e,_e,at);break;case 4:if(Et(e,r),(r&4194240)===r)break;for(t=e.eventTimes,i=-1;0<r;){var o=31-qe(r);l=1<<o,o=t[o],o>i&&(i=o),r&=~l}if(r=i,r=K()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*rm(r/1960))-r,10<r){e.timeoutHandle=mo($t.bind(null,e,_e,at),r);break}$t(e,_e,at);break;case 5:$t(e,_e,at);break;default:throw Error(v(329))}}}return Ee(e,K()),e.callbackNode===n?Zc.bind(null,e):null}function Mo(e,t){var n=lr;return e.current.memoizedState.isDehydrated&&(qt(e,t).flags|=256),e=Di(e,t),e!==2&&(t=_e,_e=n,t!==null&&Oo(t)),e}function Oo(e){_e===null?_e=e:_e.push.apply(_e,e)}function im(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],l=i.getSnapshot;i=i.value;try{if(!Ge(l(),i))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Et(e,t){for(t&=~hs,t&=~qi,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-qe(t),r=1<<n;e[n]=-1,t&=~r}}function ua(e){if(R&6)throw Error(v(327));Cn();var t=yi(e,0);if(!(t&1))return Ee(e,K()),null;var n=Di(e,t);if(e.tag!==0&&n===2){var r=lo(e);r!==0&&(t=r,n=Mo(e,r))}if(n===1)throw n=xr,qt(e,0),Et(e,t),Ee(e,K()),n;if(n===6)throw Error(v(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,$t(e,_e,at),Ee(e,K()),null}function ys(e,t){var n=R;R|=1;try{return e(t)}finally{R=n,R===0&&(In=K()+500,$i&&Bt())}}function Jt(e){Pt!==null&&Pt.tag===0&&!(R&6)&&Cn();var t=R;R|=1;var n=Ae.transition,r=L;try{if(Ae.transition=null,L=1,e)return e()}finally{L=r,Ae.transition=n,R=t,!(R&6)&&Bt()}}function ws(){Ne=wn.current,j(wn)}function qt(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Mp(n)),X!==null)for(n=X.return;n!==null;){var r=n;switch(Jo(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&xi();break;case 3:Rn(),j(Se),j(fe),us();break;case 5:ss(r);break;case 4:Rn();break;case 13:j($);break;case 19:j($);break;case 10:rs(r.type._context);break;case 22:case 23:ws()}n=n.return}if(ne=e,X=e=Mt(e.current,null),le=Ne=t,ee=0,xr=null,hs=qi=Zt=0,_e=lr=null,Ht!==null){for(t=0;t<Ht.length;t++)if(n=Ht[t],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,l=n.pending;if(l!==null){var o=l.next;l.next=i,r.next=o}n.pending=r}Ht=null}return e}function Jc(e,t){do{var n=X;try{if(ns(),ui.current=Ii,zi){for(var r=W.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}zi=!1}if(Xt=0,te=J=W=null,rr=!1,_r=0,gs.current=null,n===null||n.return===null){ee=1,xr=t,X=null;break}e:{var l=e,o=n.return,s=n,u=t;if(t=le,s.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var a=u,f=s,m=f.tag;if(!(f.mode&1)&&(m===0||m===11||m===15)){var d=f.alternate;d?(f.updateQueue=d.updateQueue,f.memoizedState=d.memoizedState,f.lanes=d.lanes):(f.updateQueue=null,f.memoizedState=null)}var h=Gu(o);if(h!==null){h.flags&=-257,Yu(h,o,s,l,t),h.mode&1&&Ku(l,a,t),t=h,u=a;var y=t.updateQueue;if(y===null){var _=new Set;_.add(u),t.updateQueue=_}else y.add(u);break e}else{if(!(t&1)){Ku(l,a,t),_s();break e}u=Error(v(426))}}else if(V&&s.mode&1){var I=Gu(o);if(I!==null){!(I.flags&65536)&&(I.flags|=256),Yu(I,o,s,l,t),es(zn(u,s));break e}}l=u=zn(u,s),ee!==4&&(ee=2),lr===null?lr=[l]:lr.push(l),l=o;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var p=Dc(l,u,t);Vu(l,p);break e;case 1:s=u;var c=l.type,g=l.stateNode;if(!(l.flags&128)&&(typeof c.getDerivedStateFromError=="function"||g!==null&&typeof g.componentDidCatch=="function"&&(It===null||!It.has(g)))){l.flags|=65536,t&=-t,l.lanes|=t;var w=Fc(l,s,t);Vu(l,w);break e}}l=l.return}while(l!==null)}nd(n)}catch(S){t=S,X===n&&n!==null&&(X=n=n.return);continue}break}while(!0)}function ed(){var e=Li.current;return Li.current=Ii,e===null?Ii:e}function _s(){(ee===0||ee===3||ee===2)&&(ee=4),ne===null||!(Zt&268435455)&&!(qi&268435455)||Et(ne,le)}function Di(e,t){var n=R;R|=2;var r=ed();(ne!==e||le!==t)&&(at=null,qt(e,t));do try{lm();break}catch(i){Jc(e,i)}while(!0);if(ns(),R=n,Li.current=r,X!==null)throw Error(v(261));return ne=null,le=0,ee}function lm(){for(;X!==null;)td(X)}function om(){for(;X!==null&&!Lf();)td(X)}function td(e){var t=id(e.alternate,e,Ne);e.memoizedProps=e.pendingProps,t===null?nd(e):X=t,gs.current=null}function nd(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Jp(n,t),n!==null){n.flags&=32767,X=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{ee=6,X=null;return}}else if(n=Zp(n,t,Ne),n!==null){X=n;return}if(t=t.sibling,t!==null){X=t;return}X=t=e}while(t!==null);ee===0&&(ee=5)}function $t(e,t,n){var r=L,i=Ae.transition;try{Ae.transition=null,L=1,sm(e,t,n,r)}finally{Ae.transition=i,L=r}return null}function sm(e,t,n,r){do Cn();while(Pt!==null);if(R&6)throw Error(v(327));n=e.finishedWork;var i=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(v(177));e.callbackNode=null,e.callbackPriority=0;var l=n.lanes|n.childLanes;if($f(e,l),e===ne&&(X=ne=null,le=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||ri||(ri=!0,ld(vi,function(){return Cn(),null})),l=(n.flags&15990)!==0,n.subtreeFlags&15990||l){l=Ae.transition,Ae.transition=null;var o=L;L=1;var s=R;R|=4,gs.current=null,tm(e,n),Yc(n,e),Tp(fo),wi=!!co,fo=co=null,e.current=n,nm(n,e,i),Mf(),R=s,L=o,Ae.transition=l}else e.current=n;if(ri&&(ri=!1,Pt=e,Oi=i),l=e.pendingLanes,l===0&&(It=null),Ff(n.stateNode,r),Ee(e,K()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)i=t[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(Mi)throw Mi=!1,e=Io,Io=null,e;return Oi&1&&e.tag!==0&&Cn(),l=e.pendingLanes,l&1?e===Lo?or++:(or=0,Lo=e):or=0,Bt(),null}function Cn(){if(Pt!==null){var e=Da(Oi),t=Ae.transition,n=L;try{if(Ae.transition=null,L=16>e?16:e,Pt===null)var r=!1;else{if(e=Pt,Pt=null,Oi=0,R&6)throw Error(v(331));var i=R;for(R|=4,k=e.current;k!==null;){var l=k,o=l.child;if(k.flags&16){var s=l.deletions;if(s!==null){for(var u=0;u<s.length;u++){var a=s[u];for(k=a;k!==null;){var f=k;switch(f.tag){case 0:case 11:case 15:ir(8,f,l)}var m=f.child;if(m!==null)m.return=f,k=m;else for(;k!==null;){f=k;var d=f.sibling,h=f.return;if(qc(f),f===a){k=null;break}if(d!==null){d.return=h,k=d;break}k=h}}}var y=l.alternate;if(y!==null){var _=y.child;if(_!==null){y.child=null;do{var I=_.sibling;_.sibling=null,_=I}while(_!==null)}}k=l}}if(l.subtreeFlags&2064&&o!==null)o.return=l,k=o;else e:for(;k!==null;){if(l=k,l.flags&2048)switch(l.tag){case 0:case 11:case 15:ir(9,l,l.return)}var p=l.sibling;if(p!==null){p.return=l.return,k=p;break e}k=l.return}}var c=e.current;for(k=c;k!==null;){o=k;var g=o.child;if(o.subtreeFlags&2064&&g!==null)g.return=o,k=g;else e:for(o=c;k!==null;){if(s=k,s.flags&2048)try{switch(s.tag){case 0:case 11:case 15:Qi(9,s)}}catch(S){q(s,s.return,S)}if(s===o){k=null;break e}var w=s.sibling;if(w!==null){w.return=s.return,k=w;break e}k=s.return}}if(R=i,Bt(),nt&&typeof nt.onPostCommitFiberRoot=="function")try{nt.onPostCommitFiberRoot(Ai,e)}catch{}r=!0}return r}finally{L=n,Ae.transition=t}}return!1}function aa(e,t,n){t=zn(n,t),t=Dc(e,t,1),e=zt(e,t,1),t=he(),e!==null&&(Er(e,1,t),Ee(e,t))}function q(e,t,n){if(e.tag===3)aa(e,e,n);else for(;t!==null;){if(t.tag===3){aa(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(It===null||!It.has(r))){e=zn(n,e),e=Fc(t,e,1),t=zt(t,e,1),e=he(),t!==null&&(Er(t,1,e),Ee(t,e));break}}t=t.return}}function um(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=he(),e.pingedLanes|=e.suspendedLanes&n,ne===e&&(le&n)===n&&(ee===4||ee===3&&(le&130023424)===le&&500>K()-vs?qt(e,0):hs|=n),Ee(e,t)}function rd(e,t){t===0&&(e.mode&1?(t=$r,$r<<=1,!($r&130023424)&&($r=4194304)):t=1);var n=he();e=ht(e,t),e!==null&&(Er(e,t,n),Ee(e,n))}function am(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),rd(e,n)}function cm(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(v(314))}r!==null&&r.delete(t),rd(e,n)}var id;id=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Se.current)ke=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return ke=!1,Xp(e,t,n);ke=!!(e.flags&131072)}else ke=!1,V&&t.flags&1048576&&uc(t,Pi,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;ci(e,t),e=t.pendingProps;var i=Nn(t,fe.current);En(t,n),i=cs(null,t,r,e,i,n);var l=ds();return t.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,xe(r)?(l=!0,Ei(t)):l=!1,t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,ls(t),i.updater=Hi,t.stateNode=i,i._reactInternals=t,ko(t,r,e,n),t=Eo(null,t,r,!0,l,n)):(t.tag=0,V&&l&&Zo(t),ge(null,t,i,n),t=t.child),t;case 16:r=t.elementType;e:{switch(ci(e,t),e=t.pendingProps,i=r._init,r=i(r._payload),t.type=r,i=t.tag=fm(r),e=We(r,e),i){case 0:t=xo(null,t,r,e,n);break e;case 1:t=Ju(null,t,r,e,n);break e;case 11:t=Xu(null,t,r,e,n);break e;case 14:t=Zu(null,t,r,We(r.type,e),n);break e}throw Error(v(306,r,""))}return t;case 0:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:We(r,i),xo(e,t,r,i,n);case 1:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:We(r,i),Ju(e,t,r,i,n);case 3:e:{if(Uc(t),e===null)throw Error(v(387));r=t.pendingProps,l=t.memoizedState,i=l.element,mc(e,t),Ti(t,r,null,n);var o=t.memoizedState;if(r=o.element,l.isDehydrated)if(l={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){i=zn(Error(v(423)),t),t=ea(e,t,r,n,i);break e}else if(r!==i){i=zn(Error(v(424)),t),t=ea(e,t,r,n,i);break e}else for(be=Rt(t.stateNode.containerInfo.firstChild),Te=t,V=!0,Qe=null,n=fc(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(bn(),r===i){t=vt(e,t,n);break e}ge(e,t,r,n)}t=t.child}return t;case 5:return gc(t),e===null&&yo(t),r=t.type,i=t.pendingProps,l=e!==null?e.memoizedProps:null,o=i.children,po(r,i)?o=null:l!==null&&po(r,l)&&(t.flags|=32),jc(e,t),ge(e,t,o,n),t.child;case 6:return e===null&&yo(t),null;case 13:return Vc(e,t,n);case 4:return os(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Tn(t,null,r,n):ge(e,t,r,n),t.child;case 11:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:We(r,i),Xu(e,t,r,i,n);case 7:return ge(e,t,t.pendingProps,n),t.child;case 8:return ge(e,t,t.pendingProps.children,n),t.child;case 12:return ge(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,i=t.pendingProps,l=t.memoizedProps,o=i.value,F(Ni,r._currentValue),r._currentValue=o,l!==null)if(Ge(l.value,o)){if(l.children===i.children&&!Se.current){t=vt(e,t,n);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var s=l.dependencies;if(s!==null){o=l.child;for(var u=s.firstContext;u!==null;){if(u.context===r){if(l.tag===1){u=pt(-1,n&-n),u.tag=2;var a=l.updateQueue;if(a!==null){a=a.shared;var f=a.pending;f===null?u.next=u:(u.next=f.next,f.next=u),a.pending=u}}l.lanes|=n,u=l.alternate,u!==null&&(u.lanes|=n),wo(l.return,n,t),s.lanes|=n;break}u=u.next}}else if(l.tag===10)o=l.type===t.type?null:l.child;else if(l.tag===18){if(o=l.return,o===null)throw Error(v(341));o.lanes|=n,s=o.alternate,s!==null&&(s.lanes|=n),wo(o,n,t),o=l.sibling}else o=l.child;if(o!==null)o.return=l;else for(o=l;o!==null;){if(o===t){o=null;break}if(l=o.sibling,l!==null){l.return=o.return,o=l;break}o=o.return}l=o}ge(e,t,i.children,n),t=t.child}return t;case 9:return i=t.type,r=t.pendingProps.children,En(t,n),i=Be(i),r=r(i),t.flags|=1,ge(e,t,r,n),t.child;case 14:return r=t.type,i=We(r,t.pendingProps),i=We(r.type,i),Zu(e,t,r,i,n);case 15:return Ac(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:We(r,i),ci(e,t),t.tag=1,xe(r)?(e=!0,Ei(t)):e=!1,En(t,n),Oc(t,r,i),ko(t,r,i,n),Eo(null,t,r,!0,e,n);case 19:return $c(e,t,n);case 22:return Bc(e,t,n)}throw Error(v(156,t.tag))};function ld(e,t){return Ia(e,t)}function dm(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Fe(e,t,n,r){return new dm(e,t,n,r)}function ks(e){return e=e.prototype,!(!e||!e.isReactComponent)}function fm(e){if(typeof e=="function")return ks(e)?1:0;if(e!=null){if(e=e.$$typeof,e===jo)return 11;if(e===Uo)return 14}return 2}function Mt(e,t){var n=e.alternate;return n===null?(n=Fe(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function pi(e,t,n,r,i,l){var o=2;if(r=e,typeof e=="function")ks(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case an:return Kt(n.children,i,l,t);case Bo:o=8,i|=8;break;case Wl:return e=Fe(12,n,t,i|2),e.elementType=Wl,e.lanes=l,e;case Hl:return e=Fe(13,n,t,i),e.elementType=Hl,e.lanes=l,e;case Ql:return e=Fe(19,n,t,i),e.elementType=Ql,e.lanes=l,e;case ga:return Ki(n,i,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case pa:o=10;break e;case ma:o=9;break e;case jo:o=11;break e;case Uo:o=14;break e;case kt:o=16,r=null;break e}throw Error(v(130,e==null?e:typeof e,""))}return t=Fe(o,n,t,i),t.elementType=e,t.type=r,t.lanes=l,t}function Kt(e,t,n,r){return e=Fe(7,e,r,t),e.lanes=n,e}function Ki(e,t,n,r){return e=Fe(22,e,r,t),e.elementType=ga,e.lanes=n,e.stateNode={isHidden:!1},e}function Ul(e,t,n){return e=Fe(6,e,null,t),e.lanes=n,e}function Vl(e,t,n){return t=Fe(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function pm(e,t,n,r,i){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Cl(0),this.expirationTimes=Cl(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Cl(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Ss(e,t,n,r,i,l,o,s,u){return e=new pm(e,t,n,s,u),t===1?(t=1,l===!0&&(t|=8)):t=0,l=Fe(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},ls(l),e}function mm(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:un,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function od(e){if(!e)return Dt;e=e._reactInternals;e:{if(tn(e)!==e||e.tag!==1)throw Error(v(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(xe(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(v(171))}if(e.tag===1){var n=e.type;if(xe(n))return oc(e,n,t)}return t}function sd(e,t,n,r,i,l,o,s,u){return e=Ss(n,r,!0,e,i,l,o,s,u),e.context=od(null),n=e.current,r=he(),i=Lt(n),l=pt(r,i),l.callback=t??null,zt(n,l,i),e.current.lanes=i,Er(e,i,r),Ee(e,r),e}function Gi(e,t,n,r){var i=t.current,l=he(),o=Lt(i);return n=od(n),t.context===null?t.context=n:t.pendingContext=n,t=pt(l,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=zt(i,t,o),e!==null&&(Ke(e,i,o,l),si(e,i,o)),o}function Fi(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function ca(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function xs(e,t){ca(e,t),(e=e.alternate)&&ca(e,t)}function gm(){return null}var ud=typeof reportError=="function"?reportError:function(e){console.error(e)};function Es(e){this._internalRoot=e}Yi.prototype.render=Es.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(v(409));Gi(e,t,null,null)};Yi.prototype.unmount=Es.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Jt(function(){Gi(null,e,null,null)}),t[gt]=null}};function Yi(e){this._internalRoot=e}Yi.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ba();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xt.length&&t!==0&&t<xt[n].priority;n++);xt.splice(n,0,e),n===0&&Ua(e)}};function Cs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Xi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function da(){}function hm(e,t,n,r,i){if(i){if(typeof r=="function"){var l=r;r=function(){var a=Fi(o);l.call(a)}}var o=sd(t,r,e,0,null,!1,!1,"",da);return e._reactRootContainer=o,e[gt]=o.current,gr(e.nodeType===8?e.parentNode:e),Jt(),o}for(;i=e.lastChild;)e.removeChild(i);if(typeof r=="function"){var s=r;r=function(){var a=Fi(u);s.call(a)}}var u=Ss(e,0,!1,null,null,!1,!1,"",da);return e._reactRootContainer=u,e[gt]=u.current,gr(e.nodeType===8?e.parentNode:e),Jt(function(){Gi(t,u,n,r)}),u}function Zi(e,t,n,r,i){var l=n._reactRootContainer;if(l){var o=l;if(typeof i=="function"){var s=i;i=function(){var u=Fi(o);s.call(u)}}Gi(t,o,e,i)}else o=hm(n,t,e,i,r);return Fi(o)}Fa=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Yn(t.pendingLanes);n!==0&&(Wo(t,n|1),Ee(t,K()),!(R&6)&&(In=K()+500,Bt()))}break;case 13:Jt(function(){var r=ht(e,1);if(r!==null){var i=he();Ke(r,e,1,i)}}),xs(e,1)}};Ho=function(e){if(e.tag===13){var t=ht(e,134217728);if(t!==null){var n=he();Ke(t,e,134217728,n)}xs(e,134217728)}};Aa=function(e){if(e.tag===13){var t=Lt(e),n=ht(e,t);if(n!==null){var r=he();Ke(n,e,t,r)}xs(e,t)}};Ba=function(){return L};ja=function(e,t){var n=L;try{return L=e,t()}finally{L=n}};no=function(e,t,n){switch(t){case"input":if(Gl(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var i=Vi(r);if(!i)throw Error(v(90));va(r),Gl(r,i)}}}break;case"textarea":wa(e,n);break;case"select":t=n.value,t!=null&&_n(e,!!n.multiple,t,!1)}};Pa=ys;Na=Jt;var vm={usingClientEntryPoint:!1,Events:[Pr,pn,Vi,Ea,Ca,ys]},Qn={findFiberByHostInstance:Wt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},ym={bundleType:Qn.bundleType,version:Qn.version,rendererPackageName:Qn.rendererPackageName,rendererConfig:Qn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:yt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ra(e),e===null?null:e.stateNode},findFiberByHostInstance:Qn.findFiberByHostInstance||gm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(qn=__REACT_DEVTOOLS_GLOBAL_HOOK__,!qn.isDisabled&&qn.supportsFiber))try{Ai=qn.inject(ym),nt=qn}catch{}var qn;Ie.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=vm;Ie.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Cs(t))throw Error(v(200));return mm(e,t,null,n)};Ie.createRoot=function(e,t){if(!Cs(e))throw Error(v(299));var n=!1,r="",i=ud;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(i=t.onRecoverableError)),t=Ss(e,1,!1,null,null,n,!1,r,i),e[gt]=t.current,gr(e.nodeType===8?e.parentNode:e),new Es(t)};Ie.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(v(188)):(e=Object.keys(e).join(","),Error(v(268,e)));return e=Ra(t),e=e===null?null:e.stateNode,e};Ie.flushSync=function(e){return Jt(e)};Ie.hydrate=function(e,t,n){if(!Xi(t))throw Error(v(200));return Zi(null,e,t,!0,n)};Ie.hydrateRoot=function(e,t,n){if(!Cs(e))throw Error(v(405));var r=n!=null&&n.hydratedSources||null,i=!1,l="",o=ud;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=sd(t,null,e,1,n??null,i,!1,l,o),e[gt]=t.current,gr(e),r)for(e=0;e<r.length;e++)n=r[e],i=n._getVersion,i=i(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,i]:t.mutableSourceEagerHydrationData.push(n,i);return new Yi(t)};Ie.render=function(e,t,n){if(!Xi(t))throw Error(v(200));return Zi(null,e,t,!1,n)};Ie.unmountComponentAtNode=function(e){if(!Xi(e))throw Error(v(40));return e._reactRootContainer?(Jt(function(){Zi(null,null,e,!1,function(){e._reactRootContainer=null,e[gt]=null})}),!0):!1};Ie.unstable_batchedUpdates=ys;Ie.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Xi(n))throw Error(v(200));if(e==null||e._reactInternals===void 0)throw Error(v(38));return Zi(e,t,n,!1,r)};Ie.version="18.3.1-next-f1338f8080-20240426"});var fd=ut((Hm,dd)=>{"use strict";function cd(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(cd)}catch(e){console.error(e)}}cd(),dd.exports=ad()});var md=ut(Ps=>{"use strict";var pd=fd();Ps.createRoot=pd.createRoot,Ps.hydrateRoot=pd.hydrateRoot;var Qm});var Cd=ut(el=>{"use strict";var Cm=we(),Pm=Symbol.for("react.element"),Nm=Symbol.for("react.fragment"),bm=Object.prototype.hasOwnProperty,Tm=Cm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Rm={key:!0,ref:!0,__self:!0,__source:!0};function Ed(e,t,n){var r,i={},l=null,o=null;n!==void 0&&(l=""+n),t.key!==void 0&&(l=""+t.key),t.ref!==void 0&&(o=t.ref);for(r in t)bm.call(t,r)&&!Rm.hasOwnProperty(r)&&(i[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)i[r]===void 0&&(i[r]=t[r]);return{$$typeof:Pm,type:e,key:l,ref:o,props:i,_owner:Tm.current}}el.Fragment=Nm;el.jsx=Ed;el.jsxs=Ed});var M=ut((eg,Pd)=>{"use strict";Pd.exports=Cd()});var jt=P(we()),Ud=P(md());var U=P(we());function hd(e,t,n){switch(n){case"volume":return wm(e,t);case"bogo":return _m(e,t);case"fbt":case"mix-match":case"build-your-own":case"fixed":case"subscription":return gd(e,t);case"free-gift":case"gift":return km(e,t);default:return gd(e,t)}}function wm(e,t){let n=t[0];if(!n)return Ji();let r=n.price,i=e.quantity,l=r*i,o,s=0;switch(e.discountType){case"percentage":o=l*(1-e.discountValue/100);break;case"fixed":o=Math.max(0,l-e.discountValue);break;case"fixed_price":o=e.discountValue;break;case"free":s=1,o=r*(i-1);break;default:o=l}o=pe(o);let u=pe(l-o),a=l>0?Math.round(u/l*100):0,f=pe(o/i),m=[],d=n.variantId||"";for(let h=0;h<i;h++)m.push({variantId:d,quantity:1,price:h<i-s?f:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:`${a}%`}});return{originalPrice:l,bundlePrice:o,savingsAmount:u,savingsPercent:a,perUnitPrice:f,freeItemsCount:s,lineItems:m}}function _m(e,t){let n=t[0];if(!n)return Ji();let r=n.price,i=e.quantity,l=e.discountType==="free"?Math.floor(e.discountValue):0,o=i+l,s=pe(r*o),u=pe(r*i),a=pe(s-u),f=s>0?Math.round(a/s*100):0,m=pe(u/o),d=[],h=n.variantId||"";for(let y=0;y<o;y++)d.push({variantId:h,quantity:1,price:y<i?r:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:y>=i?"FREE":""}});return{originalPrice:s,bundlePrice:u,savingsAmount:a,savingsPercent:f,perUnitPrice:m,freeItemsCount:l,lineItems:d}}function gd(e,t){if(t.length===0)return Ji();let n=pe(t.reduce((a,f)=>a+f.price*f.quantity,0)),r;switch(e.discountType){case"percentage":r=n*(1-e.discountValue/100);break;case"fixed":r=Math.max(0,n-e.discountValue);break;case"fixed_price":r=e.discountValue;break;default:r=n}r=pe(r);let i=pe(n-r),l=n>0?Math.round(i/n*100):0,o=t.reduce((a,f)=>a+f.quantity,0),s=o>0?pe(r/o):0,u=t.map(a=>{let f=a.price*a.quantity,m=n>0?f/n:0,d=i*m;return{variantId:a.variantId||"",quantity:a.quantity,price:pe(f-d),properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:`${l}%`}}});return{originalPrice:n,bundlePrice:r,savingsAmount:i,savingsPercent:l,perUnitPrice:s,freeItemsCount:0,lineItems:u}}function km(e,t){if(t.length===0)return Ji();let n=t.slice(0,-1),r=t[t.length-1],i=pe(t.reduce((m,d)=>m+d.price*d.quantity,0)),l=pe(n.reduce((m,d)=>m+d.price*d.quantity,0)),o=pe(r?r.price*r.quantity:0),s=i>0?Math.round(o/i*100):0,u=t.reduce((m,d)=>m+d.quantity,0),a=u>0?pe(l/u):0,f=t.map((m,d)=>({variantId:m.variantId||"",quantity:m.quantity,price:d<t.length-1?m.price*m.quantity:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:d===t.length-1?"FREE GIFT":""}}));return{originalPrice:i,bundlePrice:l,savingsAmount:o,savingsPercent:s,perUnitPrice:a,freeItemsCount:r?r.quantity:0,lineItems:f}}function Ji(){return{originalPrice:0,bundlePrice:0,savingsAmount:0,savingsPercent:0,perUnitPrice:0,freeItemsCount:0,lineItems:[]}}function pe(e){return Math.round(e*100)/100}function Sm(e,t="${{amount}}"){let n=e/100,r={amount:n.toFixed(2),amount_no_decimals:Math.round(n).toString(),amount_with_comma_separator:n.toFixed(2).replace(".",",").replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1."),amount_no_decimals_with_comma_separator:Math.round(n).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1."),amount_with_apostrophe_separator:n.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1'"),amount_no_decimals_with_space_separator:Math.round(n).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1 "),amount_with_space_separator:n.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1 ")},i=t;for(let[l,o]of Object.entries(r))i=i.replace(`{{${l}}}`,o),i=i.replace(`{{ ${l} }}`,o);return i}function ye(e,t="${{amount}}"){return Sm(Math.round(e*100),t)}function vd(e){return e<=0?"":`${Math.round(e)}% OFF`}function yd(e,t){return`${ye(e,t)} each`}function wd(){if(typeof window>"u")return"desktop";let e=window.innerWidth;return e<768?"mobile":e<1024?"tablet":"desktop"}function _d(){if(typeof sessionStorage>"u")return"ssr_"+Math.random().toString(36).substring(2,11);let e="shopi_bundle_session",t=sessionStorage.getItem(e);return t||(t="sb_"+Math.random().toString(36).substring(2,11)+"_"+Date.now(),sessionStorage.setItem(e,t)),t}async function kd(e){let t=await fetch("/cart/add.js",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:e.items.map(n=>({id:n.variantId,quantity:n.quantity,properties:n.properties,...n.selling_plan?{selling_plan:n.selling_plan}:{}}))})});if(!t.ok){let n=await t.text(),r="Failed to add to cart";try{let i=JSON.parse(n);r=i.description||i.message||r}catch{}throw new Error(r)}return t.json()}function xm(){document.dispatchEvent(new CustomEvent("cart:updated")),document.dispatchEvent(new CustomEvent("cart:refresh",{bubbles:!0}))}function Sd(e){switch(xm(),e){case"redirect":window.location.href="/cart";break;case"drawer":document.dispatchEvent(new CustomEvent("cart:open")),document.dispatchEvent(new CustomEvent("theme:cart:open"));let t=document.querySelector('a[href="/cart"], .cart-icon-bubble, .site-header__cart, [data-cart-toggle]');t&&t.click();break;case"stay":break}}var Ye=P(we());function xd(e){let t=(0,Ye.useRef)(_d()),n=(0,Ye.useRef)(!1),r=(0,Ye.useCallback)(f=>{var h;if(!e.analytics.enabled)return;let m=e.analytics.trackingEndpoint||"/apps/proxy/ai/events/track";fetch(m,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shop:((h=window.Shopify)==null?void 0:h.shop)||"",bundleId:f.bundleId,productId:f.productId||"",eventType:Em(f.eventName),sessionId:f.sessionId,metadata:{bundleType:f.bundleType,tierId:f.tierId,tierLabel:f.tierLabel,discountType:f.discountType,discountValue:f.discountValue,originalPrice:f.originalPrice,bundlePrice:f.bundlePrice,savingsAmount:f.savingsAmount,quantity:f.quantity,experimentId:f.experimentId,experimentVariant:f.experimentVariant,deviceType:f.deviceType}})}).catch(()=>{});let d=window.dataLayer;d&&d.push({event:`shopibundle_${f.eventName}`,bundle_id:f.bundleId,bundle_type:f.bundleType,tier_id:f.tierId,bundle_price:f.bundlePrice,savings_amount:f.savingsAmount})},[e.analytics]),i=(0,Ye.useCallback)((f,m,d)=>({eventName:f,bundleId:e.id,bundleType:e.type,tierId:m==null?void 0:m.id,tierLabel:m==null?void 0:m.label,discountType:m==null?void 0:m.discountType,discountValue:m==null?void 0:m.discountValue,originalPrice:d==null?void 0:d.originalPrice,bundlePrice:d==null?void 0:d.bundlePrice,savingsAmount:d==null?void 0:d.savingsAmount,quantity:m==null?void 0:m.quantity,experimentId:e.analytics.experimentId,experimentVariant:e.analytics.experimentVariant,timestamp:Date.now(),sessionId:t.current,deviceType:wd()}),[e]),l=(0,Ye.useCallback)(()=>{n.current||(n.current=!0,r(i("bundle_viewed")))},[i,r]),o=(0,Ye.useCallback)((f,m)=>{r(i("tier_selected",f,m))},[i,r]),s=(0,Ye.useCallback)((f,m)=>{r(i("add_to_cart_clicked",f,m))},[i,r]),u=(0,Ye.useCallback)((f,m)=>{r(i("add_to_cart_success",f,m))},[i,r]),a=(0,Ye.useCallback)((f,m)=>{let d=i("add_to_cart_failed",f);d.error=m,r(d)},[i,r]);return{trackView:l,trackTierSelect:o,trackAddToCart:s,trackAddToCartSuccess:u,trackAddToCartFailed:a}}function Em(e){return{bundle_viewed:"impression",tier_selected:"click",variant_changed:"click",add_to_cart_clicked:"add_to_cart",add_to_cart_success:"add_to_cart",add_to_cart_failed:"add_to_cart"}[e]||e}var Ns=P(we());var br=P(M());function Nd({savingsAmount:e,savingsPercent:t,moneyFormat:n,style:r="pill"}){if(e<=0)return null;let i=ye(e,n),l=vd(t);return(0,br.jsxs)("span",{className:`sb-savings-badge sb-savings-badge--${r}`,"aria-label":`Save ${i} (${l})`,children:[(0,br.jsx)("span",{className:"sb-savings-badge__percent",children:l}),(0,br.jsxs)("span",{className:"sb-savings-badge__amount",children:["Save ",i]})]})}var G=P(M());function bd({tier:e,selected:t,disabled:n,moneyFormat:r,locale:i,visual:l,pricing:o,onSelect:s}){let u=(0,Ns.useCallback)(()=>{n||s(e.id)},[e.id,n,s]),a=(0,Ns.useCallback)(h=>{(h.key==="Enter"||h.key===" ")&&!n&&(h.preventDefault(),s(e.id))},[e.id,n,s]),f=o.savingsAmount>0,m=e.badge||(e.isDefault?"Most Popular":""),d=e.badgeColor||(e.isDefault?"#ff6b35":"#4CAF50");return(0,G.jsxs)("div",{role:"radio","aria-checked":t,"aria-label":`${e.label}: ${ye(o.bundlePrice,r)}${f?`, save ${ye(o.savingsAmount,r)}`:""}`,tabIndex:0,className:["sb-offer",t&&"sb-offer--selected",n&&"sb-offer--disabled",e.isDefault&&"sb-offer--default",f&&"sb-offer--has-savings"].filter(Boolean).join(" "),onClick:u,onKeyDown:a,style:t&&l.primaryColor?{"--sb-primary":l.primaryColor}:void 0,children:[m&&(0,G.jsx)("div",{className:`sb-offer__badge sb-offer__badge--${l.badgeStyle}`,style:{backgroundColor:d},children:m}),(0,G.jsx)("div",{className:"sb-offer__radio",children:(0,G.jsx)("div",{className:"sb-offer__radio-dot"})}),(0,G.jsxs)("div",{className:"sb-offer__content",children:[(0,G.jsxs)("div",{className:"sb-offer__header",children:[(0,G.jsx)("span",{className:"sb-offer__label",children:e.label}),e.subtitle&&(0,G.jsx)("span",{className:"sb-offer__subtitle",children:e.subtitle})]}),(0,G.jsxs)("div",{className:"sb-offer__pricing",children:[(0,G.jsx)("span",{className:"sb-offer__price",children:ye(o.bundlePrice,r)}),l.showCompareAtPrice&&f&&(0,G.jsx)("span",{className:"sb-offer__compare-price",children:ye(o.originalPrice,r)}),l.showPerUnitPrice&&e.quantity>1&&(0,G.jsx)("span",{className:"sb-offer__per-unit",children:yd(o.perUnitPrice,r)})]}),f&&(l.showSavingsAmount||l.showSavingsPercent)&&(0,G.jsx)("div",{className:"sb-offer__savings",children:(0,G.jsx)(Nd,{savingsAmount:o.savingsAmount,savingsPercent:o.savingsPercent,currency:"",moneyFormat:r,locale:i,style:l.badgeStyle})}),o.freeItemsCount>0&&(0,G.jsxs)("div",{className:"sb-offer__free-tag",children:["+",o.freeItemsCount," FREE"]})]}),t&&(0,G.jsx)("div",{className:"sb-offer__check","aria-hidden":"true",children:(0,G.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[(0,G.jsx)("circle",{cx:"10",cy:"10",r:"10",fill:"currentColor"}),(0,G.jsx)("path",{d:"M6 10l3 3 5-6",stroke:"#fff",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})})]})}var nl=P(we());var tl=P(we()),it=P(M());function Td({variants:e,selectedVariantId:t,onSelect:n,layout:r="dropdown"}){if(!e||e.length<=1)return null;let i=(0,tl.useCallback)(u=>{n(u.target.value)},[n]),l=(0,tl.useCallback)(u=>{n(u)},[n]),o=(0,tl.useCallback)((u,a)=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),n(a))},[n]),s=zm(e);return r==="swatches"&&s.length>0?(0,it.jsx)("div",{className:"sb-variant-selector sb-variant-selector--swatches",children:s.map(u=>(0,it.jsxs)("div",{className:"sb-variant-group",children:[(0,it.jsx)("span",{className:"sb-variant-group__label",children:u.name}),(0,it.jsx)("div",{className:"sb-variant-group__options",role:"radiogroup","aria-label":u.name,children:u.values.map(a=>{let f=e.find(h=>h.options.some(y=>y.name===u.name&&y.value===a)),m=(f==null?void 0:f.id)===t,d=(f==null?void 0:f.available)!==!1;return(0,it.jsx)("button",{type:"button",role:"radio","aria-checked":m,"aria-label":`${u.name}: ${a}`,className:["sb-swatch",m&&"sb-swatch--selected",!d&&"sb-swatch--unavailable"].filter(Boolean).join(" "),onClick:()=>f&&l(f.id),onKeyDown:h=>f&&o(h,f.id),disabled:!d,children:a},a)})})]},u.name))}):(0,it.jsx)("div",{className:"sb-variant-selector sb-variant-selector--dropdown",children:(0,it.jsx)("select",{className:"sb-variant-select",value:t||"",onChange:i,"aria-label":"Select variant",children:e.map(u=>(0,it.jsxs)("option",{value:u.id,disabled:!u.available,children:[u.title,u.available?"":" (Sold out)"]},u.id))})})}function zm(e){let t=new Map;for(let n of e)for(let r of n.options)t.has(r.name)||t.set(r.name,new Set),t.get(r.name).add(r.value);return Array.from(t.entries()).map(([n,r])=>({name:n,values:Array.from(r)}))}var Le=P(M());function Rd({product:e,size:t,showPrice:n,onVariantChange:r}){var a,f;let[i,l]=(0,nl.useState)(e.variantId||((f=(a=e.variants)==null?void 0:a[0])==null?void 0:f.id)),o=(0,nl.useCallback)(m=>{l(m),r==null||r(e.productId,m)},[e.productId,r]),s=!e.available,u=t==="small"?80:t==="medium"?120:180;return(0,Le.jsxs)("div",{className:`sb-product sb-product--${t} ${s?"sb-product--oos":""}`,children:[e.imageUrl&&(0,Le.jsxs)("div",{className:"sb-product__image-wrap",children:[(0,Le.jsx)("img",{className:"sb-product__image",src:e.imageUrl,alt:e.imageAlt||e.title,width:u,height:u,loading:"lazy"}),s&&(0,Le.jsx)("span",{className:"sb-product__oos-overlay",children:"Sold out"})]}),(0,Le.jsxs)("div",{className:"sb-product__info",children:[(0,Le.jsx)("p",{className:"sb-product__title",children:e.title}),n&&(0,Le.jsxs)("p",{className:"sb-product__price",children:[e.compareAtPrice&&e.compareAtPrice>e.price&&(0,Le.jsxs)("span",{className:"sb-product__compare-price",children:["$",e.compareAtPrice.toFixed(2)]}),(0,Le.jsxs)("span",{children:["$",e.price.toFixed(2)]})]}),e.quantity>1&&(0,Le.jsxs)("span",{className:"sb-product__qty",children:["\xD7",e.quantity]})]}),r&&e.variants&&e.variants.length>1&&(0,Le.jsx)(Td,{variants:e.variants,selectedVariantId:i,onSelect:o,layout:"swatches"})]})}var nn=P(M());function zd({current:e,target:t,label:n,color:r}){if(t<=0)return null;let i=Math.min(100,Math.round(e/t*100)),l=t-e;return(0,nn.jsxs)("div",{className:"sb-progress",role:"progressbar","aria-valuenow":i,"aria-valuemin":0,"aria-valuemax":100,"aria-label":n,children:[(0,nn.jsx)("div",{className:"sb-progress__label",children:n}),(0,nn.jsx)("div",{className:"sb-progress__track",children:(0,nn.jsx)("div",{className:"sb-progress__fill",style:{width:`${i}%`,backgroundColor:r||void 0}})}),l>0&&(0,nn.jsxs)("div",{className:"sb-progress__hint",children:["Add ",l," more to unlock!"]})]})}var Id=P(we());var Z=P(M());function Ld({products:e,selectedProducts:t,minSelect:n,maxSelect:r,onToggle:i,onQuantityChange:l,currency:o,moneyFormat:s,showPrice:u}){let a=Array.from(t.values()).reduce((d,h)=>d+h,0),f=a<r,m=(0,Id.useCallback)(d=>{t.has(d)?i(d,!1):f&&i(d,!0)},[t,f,i]);return(0,Z.jsxs)("div",{className:"sb-selector",role:"group","aria-label":"Select products for your bundle",children:[(0,Z.jsxs)("div",{className:"sb-selector__header",children:[(0,Z.jsxs)("span",{className:"sb-selector__count",children:[a," of ",r," selected",n>0&&` (min ${n})`]}),!f&&(0,Z.jsx)("span",{className:"sb-selector__limit",children:"Maximum reached"})]}),(0,Z.jsx)("div",{className:"sb-selector__grid",children:e.map(d=>{let h=t.has(d.productId),y=t.get(d.productId)||0,_=!d.available||!h&&!f;return(0,Z.jsxs)("div",{className:`sb-selector__item ${h?"sb-selector__item--selected":""} ${_?"sb-selector__item--disabled":""}`,role:"checkbox","aria-checked":h,"aria-disabled":_,tabIndex:_?-1:0,onClick:()=>!_&&m(d.productId),onKeyDown:I=>{(I.key==="Enter"||I.key===" ")&&!_&&(I.preventDefault(),m(d.productId))},children:[d.imageUrl&&(0,Z.jsx)("img",{className:"sb-selector__image",src:d.imageUrl,alt:d.imageAlt||d.title,loading:"lazy",width:"80",height:"80"}),(0,Z.jsxs)("div",{className:"sb-selector__info",children:[(0,Z.jsx)("span",{className:"sb-selector__title",children:d.title}),u&&(0,Z.jsx)("span",{className:"sb-selector__price",children:ye(d.price,s)}),!d.available&&(0,Z.jsx)("span",{className:"sb-selector__oos",children:"Out of stock"})]}),h&&(0,Z.jsx)("div",{className:"sb-selector__check","aria-hidden":"true",children:(0,Z.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:(0,Z.jsx)("path",{d:"M13.5 4.5L6.5 11.5L2.5 7.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})}),h&&y>0&&(0,Z.jsxs)("div",{className:"sb-selector__qty",onClick:I=>I.stopPropagation(),children:[(0,Z.jsx)("button",{type:"button",className:"sb-selector__qty-btn",onClick:()=>l(d.productId,Math.max(1,y-1)),"aria-label":`Decrease quantity for ${d.title}`,children:"-"}),(0,Z.jsx)("span",{className:"sb-selector__qty-value",children:y}),(0,Z.jsx)("button",{type:"button",className:"sb-selector__qty-btn",onClick:()=>{a-y+(y+1)<=r&&l(d.productId,y+1)},disabled:a>=r,"aria-label":`Increase quantity for ${d.title}`,children:"+"})]})]},d.productId)})})]})}var bs=P(we()),lt=P(M());function Md({value:e,min:t,max:n,onChange:r,disabled:i=!1,size:l="medium"}){let o=(0,bs.useCallback)(()=>{e>t&&r(e-1)},[e,t,r]),s=(0,bs.useCallback)(()=>{e<n&&r(e+1)},[e,n,r]);return(0,lt.jsxs)("div",{className:`sb-qty sb-qty--${l}`,role:"group","aria-label":"Quantity selector",children:[(0,lt.jsx)("button",{type:"button",className:"sb-qty__btn sb-qty__btn--minus",onClick:o,disabled:i||e<=t,"aria-label":"Decrease quantity",children:(0,lt.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:(0,lt.jsx)("path",{d:"M2 6H10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}),(0,lt.jsx)("span",{className:"sb-qty__value","aria-live":"polite","aria-atomic":"true",children:e}),(0,lt.jsx)("button",{type:"button",className:"sb-qty__btn sb-qty__btn--plus",onClick:s,disabled:i||e>=n,"aria-label":"Increase quantity",children:(0,lt.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:(0,lt.jsx)("path",{d:"M6 2V10M2 6H10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})})]})}var re=P(M());function Tr({title:e,description:t,icon:n="bundle"}){return(0,re.jsxs)("div",{className:"sb-empty",role:"status",children:[(0,re.jsx)("div",{className:"sb-empty__icon",children:{bundle:(0,re.jsxs)("svg",{width:"48",height:"48",viewBox:"0 0 48 48",fill:"none","aria-hidden":"true",children:[(0,re.jsx)("rect",{x:"8",y:"16",width:"32",height:"24",rx:"3",stroke:"currentColor",strokeWidth:"2"}),(0,re.jsx)("path",{d:"M8 22H40",stroke:"currentColor",strokeWidth:"2"}),(0,re.jsx)("path",{d:"M20 16V40M28 16V40",stroke:"currentColor",strokeWidth:"2"}),(0,re.jsx)("path",{d:"M16 8L24 16L32 8",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}),search:(0,re.jsxs)("svg",{width:"48",height:"48",viewBox:"0 0 48 48",fill:"none","aria-hidden":"true",children:[(0,re.jsx)("circle",{cx:"22",cy:"22",r:"12",stroke:"currentColor",strokeWidth:"2"}),(0,re.jsx)("path",{d:"M31 31L40 40",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}),error:(0,re.jsxs)("svg",{width:"48",height:"48",viewBox:"0 0 48 48",fill:"none","aria-hidden":"true",children:[(0,re.jsx)("circle",{cx:"24",cy:"24",r:"18",stroke:"currentColor",strokeWidth:"2"}),(0,re.jsx)("path",{d:"M24 16V28",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),(0,re.jsx)("circle",{cx:"24",cy:"34",r:"1.5",fill:"currentColor"})]})}[n]}),(0,re.jsx)("p",{className:"sb-empty__title",children:e}),t&&(0,re.jsx)("p",{className:"sb-empty__desc",children:t})]})}var Ce=P(M());function Od({message:e,onDismiss:t,retryAction:n}){return(0,Ce.jsxs)("div",{className:"sb-error",role:"alert",children:[(0,Ce.jsxs)("div",{className:"sb-error__content",children:[(0,Ce.jsxs)("svg",{className:"sb-error__icon",width:"16",height:"16",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:[(0,Ce.jsx)("circle",{cx:"8",cy:"8",r:"7",stroke:"currentColor",strokeWidth:"1.5"}),(0,Ce.jsx)("path",{d:"M8 4.5V9",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),(0,Ce.jsx)("circle",{cx:"8",cy:"11.5",r:"0.75",fill:"currentColor"})]}),(0,Ce.jsx)("span",{className:"sb-error__message",children:e})]}),(0,Ce.jsxs)("div",{className:"sb-error__actions",children:[n&&(0,Ce.jsx)("button",{type:"button",className:"sb-error__retry",onClick:n,children:"Retry"}),t&&(0,Ce.jsx)("button",{type:"button",className:"sb-error__dismiss",onClick:t,"aria-label":"Dismiss error",children:(0,Ce.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:(0,Ce.jsx)("path",{d:"M2 2L10 10M10 2L2 10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})})]})]})}var On=P(we());var se=P(M());function Dd({allowMessage:e,maxMessageLength:t,allowWrapping:n,wrappingOptions:r,moneyFormat:i,onGiftMessageChange:l,onWrappingChange:o}){let[s,u]=(0,On.useState)(""),[a,f]=(0,On.useState)(null),m=(0,On.useCallback)(h=>{let y=h.target.value.slice(0,t);u(y),l(y)},[t,l]),d=(0,On.useCallback)(h=>{f(h),o(h)},[o]);return(0,se.jsxs)("div",{className:"sb-gift",role:"group","aria-label":"Gift options",children:[e&&(0,se.jsxs)("div",{className:"sb-gift__message",children:[(0,se.jsx)("label",{className:"sb-gift__label",htmlFor:"sb-gift-message",children:"Gift Message"}),(0,se.jsx)("textarea",{id:"sb-gift-message",className:"sb-gift__textarea",value:s,onChange:m,placeholder:"Write a personal message...",maxLength:t,rows:3}),(0,se.jsxs)("span",{className:"sb-gift__char-count",children:[s.length,"/",t]})]}),n&&r.length>0&&(0,se.jsxs)("div",{className:"sb-gift__wrapping",children:[(0,se.jsx)("span",{className:"sb-gift__label",children:"Gift Wrapping"}),(0,se.jsxs)("div",{className:"sb-gift__wrapping-options",role:"radiogroup","aria-label":"Gift wrapping options",children:[(0,se.jsxs)("div",{className:`sb-gift__wrapping-option ${a===null?"sb-gift__wrapping-option--selected":""}`,role:"radio","aria-checked":a===null,tabIndex:0,onClick:()=>d(null),onKeyDown:h=>{(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),d(null))},children:[(0,se.jsx)("span",{className:"sb-gift__wrapping-name",children:"No wrapping"}),(0,se.jsx)("span",{className:"sb-gift__wrapping-price",children:"Free"})]}),r.map(h=>(0,se.jsxs)("div",{className:`sb-gift__wrapping-option ${a===h.id?"sb-gift__wrapping-option--selected":""}`,role:"radio","aria-checked":a===h.id,tabIndex:0,onClick:()=>d(h.id),onKeyDown:y=>{(y.key==="Enter"||y.key===" ")&&(y.preventDefault(),d(h.id))},children:[h.imageUrl&&(0,se.jsx)("img",{className:"sb-gift__wrapping-img",src:h.imageUrl,alt:h.name,width:"40",height:"40",loading:"lazy"}),(0,se.jsx)("span",{className:"sb-gift__wrapping-name",children:h.name}),(0,se.jsxs)("span",{className:"sb-gift__wrapping-price",children:["+",ye(h.price,i)]})]},h.id))]})]})]})}var rl=P(we()),ot=P(M());function Fd({frequencies:e,defaultFrequency:t,discountPercent:n,onChange:r}){let[i,l]=(0,rl.useState)(t),o=(0,rl.useCallback)(s=>{l(s),r(s)},[r]);return(0,ot.jsxs)("div",{className:"sb-freq",role:"group","aria-label":"Delivery frequency",children:[(0,ot.jsxs)("div",{className:"sb-freq__header",children:[(0,ot.jsx)("span",{className:"sb-freq__label",children:"Delivery Frequency"}),n>0&&(0,ot.jsxs)("span",{className:"sb-freq__discount",children:["Save ",n,"% with subscription"]})]}),(0,ot.jsx)("div",{className:"sb-freq__options",role:"radiogroup",children:e.map(s=>(0,ot.jsxs)("div",{className:`sb-freq__option ${i===s.value?"sb-freq__option--selected":""}`,role:"radio","aria-checked":i===s.value,tabIndex:0,onClick:()=>o(s.value),onKeyDown:u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),o(s.value))},children:[(0,ot.jsx)("span",{className:"sb-freq__radio-dot","aria-hidden":"true"}),(0,ot.jsx)("span",{className:"sb-freq__option-label",children:s.label})]},s.value))})]})}var z=P(M());function Ts({config:e,onAddToCart:t,className:n}){var Is;let{tiers:r,products:i,visual:l,settings:o}=e,s=xd(e),u=(0,U.useMemo)(()=>r.find(T=>T.isDefault)||r[0],[r]),[a,f]=(0,U.useState)((u==null?void 0:u.id)||""),[m,d]=(0,U.useState)("idle"),[h,y]=(0,U.useState)(""),[_,I]=(0,U.useState)(()=>{let T={};for(let A of i)A.variantId&&(T[A.productId]=A.variantId);return T}),[p,c]=(0,U.useState)(()=>new Map),[g,w]=(0,U.useState)(1),[S,E]=(0,U.useState)(""),[x,C]=(0,U.useState)(null),[Q,b]=(0,U.useState)(((Is=e.subscriptionSettings)==null?void 0:Is.defaultFrequency)||""),O=(0,U.useMemo)(()=>r.find(T=>T.id===a)||u,[r,a,u]),rn=(0,U.useMemo)(()=>{let T={};for(let A of r)T[A.id]=hd(A,i,e.type);return T},[r,i,e.type]),Xe=O?rn[O.id]:void 0;(0,U.useEffect)(()=>{s.trackView()},[s]);let Rr=(0,U.useMemo)(()=>{if(!O)return null;let T=r.findIndex(A=>A.id===O.id);return T<r.length-1?r[T+1]:null},[r,O]),Vd=(0,U.useCallback)(T=>{f(T),d("idle"),y("");let A=r.find(Y=>Y.id===T);A&&s.trackTierSelect(A,rn[T])},[r,rn,s]),$d=(0,U.useCallback)((T,A)=>{I(Y=>({...Y,[T]:A}))},[]),Wd=(0,U.useCallback)((T,A)=>{c(Y=>{let Pe=new Map(Y);return A?Pe.set(T,1):Pe.delete(T),Pe})},[]),Hd=(0,U.useCallback)((T,A)=>{c(Y=>{let Pe=new Map(Y);return A<=0?Pe.delete(T):Pe.set(T,A),Pe})},[]),zs=(0,U.useCallback)(async()=>{if(!O||!Xe)return;d("loading"),y(""),s.trackAddToCart(O,Xe);let A={items:Xe.lineItems.map(Y=>{var Ls;let Pe=Object.entries(_).find(([,ol])=>ol);return{...Y,variantId:_[((Ls=i.find(ol=>ol.variantId===Y.variantId))==null?void 0:Ls.productId)||""]||Y.variantId,properties:{...Y.properties,_bundle_id:e.id,...O!=null&&O.id?{_bundle_tier:O.id}:{},...S?{_gift_message:S}:{},...x?{_gift_wrapping:x}:{},...Q?{_subscription_frequency:Q}:{}}}}).map(Y=>({...Y,variantId:Lm(Y.variantId)}))};try{t?await t(A):await kd(A),d("success"),s.trackAddToCartSuccess(O,Xe),setTimeout(()=>{Sd(o.addToCartBehavior)},600)}catch(Y){let Pe=Y instanceof Error?Y.message:"Failed to add to cart";y(Pe),d("error"),s.trackAddToCartFailed(O,Pe),setTimeout(()=>{d("idle"),y("")},3e3)}},[O,Xe,_,i,e.id,o.addToCartBehavior,t,s,S,x,Q]);if(!r.length&&!i.length)return(0,z.jsx)(Tr,{title:"No bundle available",description:"This bundle is not currently active."});if(!i.length)return(0,z.jsx)(Tr,{title:"No products found",description:"The products in this bundle are unavailable.",icon:"search"});let Qd=(e.type==="fbt"||e.type==="mix-match"||e.type==="build-your-own"||e.type==="fixed"||e.type==="free-gift"||e.type==="gift")&&l.showProductImages,qd=(e.type==="mix-match"||e.type==="build-your-own")&&e.selectionRules,Kd=Im(m,Xe,o.currency);return(0,z.jsxs)("div",{className:`sb-widget sb-widget--${l.layout} sb-widget--${l.colorScheme} ${n||""}`,role:"group","aria-label":e.title,children:[(0,z.jsxs)("div",{className:"sb-widget__header",children:[(0,z.jsx)("h3",{className:"sb-widget__title",children:e.title}),e.subtitle&&(0,z.jsx)("p",{className:"sb-widget__subtitle",children:e.subtitle})]}),Qd&&(0,z.jsx)("div",{className:"sb-widget__products",children:i.map((T,A)=>(0,z.jsxs)(U.default.Fragment,{children:[A>0&&(0,z.jsx)("span",{className:"sb-widget__plus","aria-hidden":"true",children:"+"}),(0,z.jsx)(Rd,{product:T,size:l.imageSize,showPrice:e.type!=="volume",onVariantChange:o.allowVariantSelection?$d:void 0})]},T.productId))}),qd&&e.selectionRules&&(0,z.jsx)(Ld,{products:e.selectionRules.productPool||i,selectedProducts:p,minSelect:e.selectionRules.minProducts,maxSelect:e.selectionRules.maxProducts,onToggle:Wd,onQuantityChange:Hd,currency:o.currency,moneyFormat:o.moneyFormat,showPrice:!0}),o.showQuantitySelector&&(0,z.jsxs)("div",{className:"sb-widget__quantity",children:[(0,z.jsx)("span",{className:"sb-widget__quantity-label",children:"Quantity:"}),(0,z.jsx)(Md,{value:g,min:o.minQuantity||1,max:o.maxQuantity,onChange:w})]}),e.type==="gift"&&e.giftSettings&&(0,z.jsx)(Dd,{allowMessage:e.giftSettings.allowMessage,maxMessageLength:e.giftSettings.maxMessageLength,allowWrapping:e.giftSettings.allowWrapping,wrappingOptions:e.giftSettings.wrappingOptions||[],moneyFormat:o.moneyFormat,onGiftMessageChange:E,onWrappingChange:C}),e.type==="subscription"&&e.subscriptionSettings&&(0,z.jsx)(Fd,{frequencies:e.subscriptionSettings.frequencies,defaultFrequency:e.subscriptionSettings.defaultFrequency,discountPercent:e.subscriptionSettings.discountPercent,onChange:b}),(0,z.jsx)("div",{className:"sb-widget__offers",role:"radiogroup","aria-label":"Select bundle option",children:r.map(T=>{let A=rn[T.id],Y=!i.every(Pe=>Pe.available)&&o.outOfStockBehavior==="disable";return(0,z.jsx)(bd,{tier:T,products:i,selected:T.id===a,disabled:Y,currency:o.currency,moneyFormat:o.moneyFormat,locale:o.locale,visual:l,pricing:A,onSelect:Vd},T.id)})}),l.showProgressBar&&Rr&&O&&(0,z.jsx)(zd,{current:O.quantity,target:Rr.quantity,label:`Add ${Rr.quantity-O.quantity} more for ${Rr.badge||"extra savings"}!`,color:l.accentColor}),(0,z.jsxs)("div",{className:"sb-widget__footer",children:[Xe&&(0,z.jsxs)("div",{className:"sb-widget__total",children:[(0,z.jsx)("span",{className:"sb-widget__total-label",children:"Total:"}),(0,z.jsxs)("div",{className:"sb-widget__total-prices",children:[Xe.savingsAmount>0&&(0,z.jsx)("span",{className:"sb-widget__total-original",children:ye(Xe.originalPrice,o.moneyFormat)}),(0,z.jsx)("span",{className:"sb-widget__total-price",children:ye(Xe.bundlePrice,o.moneyFormat)})]})]}),(0,z.jsxs)("button",{type:"button",className:`sb-widget__cta sb-widget__cta--${m}`,onClick:zs,disabled:m==="loading"||m==="success","aria-busy":m==="loading",children:[m==="loading"&&(0,z.jsx)("span",{className:"sb-spinner","aria-hidden":"true"}),Kd]}),h&&(0,z.jsx)(Od,{message:h,onDismiss:()=>{y(""),d("idle")},retryAction:zs})]})]})}function Im(e,t,n){switch(e){case"loading":return"Adding...";case"success":return"Added to Cart!";case"error":return"Try Again";default:return t&&t.savingsAmount>0?`Add to Cart \u2014 Save $${t.savingsAmount.toFixed(2)}`:"Add to Cart"}}function Lm(e){if(e.startsWith("gid://")){let t=e.split("/");return t[t.length-1]}return e}var Ue=P(M());function Rs(){return(0,Ue.jsxs)("div",{className:"sb-skeleton",role:"status","aria-label":"Loading bundle offers",children:[(0,Ue.jsx)("div",{className:"sb-skeleton__title"}),(0,Ue.jsx)("div",{className:"sb-skeleton__cards",children:[0,1,2].map(e=>(0,Ue.jsxs)("div",{className:"sb-skeleton__card",children:[(0,Ue.jsx)("div",{className:"sb-skeleton__badge"}),(0,Ue.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--short"}),(0,Ue.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--medium"}),(0,Ue.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--long"}),(0,Ue.jsx)("div",{className:"sb-skeleton__btn"})]},e))}),(0,Ue.jsx)("span",{className:"sb-sr-only",children:"Loading..."})]})}var Ad=P(we()),il=class extends Ad.Component{constructor(t){super(t),this.state={hasError:!1,error:null}}static getDerivedStateFromError(t){return{hasError:!0,error:t}}componentDidCatch(t,n){var r,i,l;console.error("[ShopiBundle] Widget error:",t,n);try{let o=((r=window.Shopify)==null?void 0:r.shop)||"";o&&fetch("/apps/proxy/ai/events/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shop:o,bundleId:"widget-error",productId:"",eventType:"error",metadata:{message:t.message,stack:(i=t.stack)==null?void 0:i.substring(0,500),componentStack:(l=n.componentStack)==null?void 0:l.substring(0,500)}})}).catch(()=>{})}catch{}}render(){return this.state.hasError?this.props.fallback||null:this.props.children}};var Bd=`/**
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
`;var st=P(M()),jd=!1;function Om(){if(jd||typeof document>"u")return;jd=!0;let e=document.createElement("style");e.setAttribute("data-shopibundle",""),e.textContent=Bd,document.head.appendChild(e)}Om();function Dm({mountConfig:e}){let[t,n]=(0,jt.useState)(null),[r,i]=(0,jt.useState)(!0),[l,o]=(0,jt.useState)(null);return(0,jt.useEffect)(()=>{Fm(e).then(s=>{n(s),i(!1)}).catch(s=>{console.warn("[ShopiBundle] Failed to load bundle:",s),o(s.message),i(!1)})},[e]),r?(0,st.jsx)(Rs,{}):l?(0,st.jsx)(Tr,{title:"Unable to load bundle",description:l,icon:"error"}):t?(0,st.jsx)(Ts,{config:t}):(0,st.jsx)(st.Fragment,{})}async function Fm(e){let t=new URLSearchParams;e.bundleHandle&&t.set("handle",e.bundleHandle),e.productId&&t.set("product_id",e.productId),t.set("shop",e.shopDomain),e.locale&&t.set("locale",e.locale),e.currency&&t.set("currency",e.currency);let n=e.proxyPath||"/apps/proxy",r=await fetch(`${n}/bundle-widget?${t.toString()}`);if(!r.ok)throw new Error(`HTTP ${r.status}`);let i=await r.json();if(!i.success||!i.config)throw new Error(i.error||"No bundle config returned");if(e.moneyFormat&&i.config.settings&&(i.config.settings.moneyFormat=e.moneyFormat),e.locale&&i.config.settings&&(i.config.settings.locale=e.locale),e.currency&&i.config.settings&&(i.config.settings.currency=e.currency),e.abTest&&i.config){if(e.abTest.defaultTierId)for(let l of i.config.tiers)l.isDefault=l.id===e.abTest.defaultTierId;e.abTest.colorScheme&&(i.config.visual.colorScheme=e.abTest.colorScheme),e.abTest.layoutVariant&&(i.config.analytics.experimentVariant=e.abTest.variant,i.config.analytics.experimentId=e.abTest.experimentId)}return i.config}function Am(e){var t;return{containerId:e.id,bundleHandle:e.dataset.bundleHandle||void 0,productId:e.dataset.productId||void 0,shopDomain:e.dataset.shop||((t=window.Shopify)==null?void 0:t.shop)||"",proxyPath:e.dataset.proxyPath||"/apps/proxy",locale:e.dataset.locale||document.documentElement.lang||"en",currency:e.dataset.currency||void 0,moneyFormat:e.dataset.moneyFormat||"${{amount}}"}}function ll(){document.querySelectorAll("[data-shopibundle-widget], #shopibundle-widget").forEach(t=>{if(t.dataset.mounted==="true")return;t.dataset.mounted="true";let n=Am(t);if(!n.shopDomain){console.warn("[ShopiBundle] No shop domain found, skipping widget mount");return}if(!n.bundleHandle&&!n.productId){console.warn("[ShopiBundle] No bundle handle or product ID found");return}(0,Ud.createRoot)(t).render((0,st.jsx)(jt.default.StrictMode,{children:(0,st.jsx)(il,{children:(0,st.jsx)(Dm,{mountConfig:n})})}))})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ll):ll();typeof MutationObserver<"u"&&new MutationObserver(t=>{let n=!1;t.forEach(r=>{r.addedNodes.forEach(i=>{var l;i instanceof HTMLElement&&(i.hasAttribute("data-shopibundle-widget")||(l=i.querySelector)!=null&&l.call(i,"[data-shopibundle-widget]"))&&(n=!0)})}),n&&ll()}).observe(document.body||document.documentElement,{childList:!0,subtree:!0});window.ShopiBundle={mount:ll,BundleWidget:Ts,SkeletonLoader:Rs};})();
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
