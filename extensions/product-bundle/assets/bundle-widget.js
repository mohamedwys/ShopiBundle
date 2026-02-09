/* ShopiBundle Widget v1.0.0 - https://shopi-bundle.vercel.app */
"use strict";(()=>{var wd=Object.create;var vu=Object.defineProperty;var _d=Object.getOwnPropertyDescriptor;var kd=Object.getOwnPropertyNames;var Sd=Object.getPrototypeOf,xd=Object.prototype.hasOwnProperty;var qe=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var Ed=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of kd(t))!xd.call(e,l)&&l!==n&&vu(e,l,{get:()=>t[l],enumerable:!(r=_d(t,l))||r.enumerable});return e};var F=(e,t,n)=>(n=e!=null?wd(Sd(e)):{},Ed(t||!e||!e.__esModule?vu(n,"default",{value:e,enumerable:!0}):n,e));var Ru=qe(N=>{"use strict";var Cn=Symbol.for("react.element"),Cd=Symbol.for("react.portal"),Pd=Symbol.for("react.fragment"),Nd=Symbol.for("react.strict_mode"),Td=Symbol.for("react.profiler"),Rd=Symbol.for("react.provider"),zd=Symbol.for("react.context"),Id=Symbol.for("react.forward_ref"),Ld=Symbol.for("react.suspense"),Od=Symbol.for("react.memo"),Md=Symbol.for("react.lazy"),yu=Symbol.iterator;function Dd(e){return e===null||typeof e!="object"?null:(e=yu&&e[yu]||e["@@iterator"],typeof e=="function"?e:null)}var ku={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Su=Object.assign,xu={};function Kt(e,t,n){this.props=e,this.context=t,this.refs=xu,this.updater=n||ku}Kt.prototype.isReactComponent={};Kt.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Kt.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Eu(){}Eu.prototype=Kt.prototype;function Kl(e,t,n){this.props=e,this.context=t,this.refs=xu,this.updater=n||ku}var Yl=Kl.prototype=new Eu;Yl.constructor=Kl;Su(Yl,Kt.prototype);Yl.isPureReactComponent=!0;var wu=Array.isArray,Cu=Object.prototype.hasOwnProperty,Gl={current:null},Pu={key:!0,ref:!0,__self:!0,__source:!0};function Nu(e,t,n){var r,l={},i=null,o=null;if(t!=null)for(r in t.ref!==void 0&&(o=t.ref),t.key!==void 0&&(i=""+t.key),t)Cu.call(t,r)&&!Pu.hasOwnProperty(r)&&(l[r]=t[r]);var u=arguments.length-2;if(u===1)l.children=n;else if(1<u){for(var s=Array(u),a=0;a<u;a++)s[a]=arguments[a+2];l.children=s}if(e&&e.defaultProps)for(r in u=e.defaultProps,u)l[r]===void 0&&(l[r]=u[r]);return{$$typeof:Cn,type:e,key:i,ref:o,props:l,_owner:Gl.current}}function Fd(e,t){return{$$typeof:Cn,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Xl(e){return typeof e=="object"&&e!==null&&e.$$typeof===Cn}function Ad(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var _u=/\/+/g;function Ql(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Ad(""+e.key):t.toString(36)}function wr(e,t,n,r,l){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(i){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case Cn:case Cd:o=!0}}if(o)return o=e,l=l(o),e=r===""?"."+Ql(o,0):r,wu(l)?(n="",e!=null&&(n=e.replace(_u,"$&/")+"/"),wr(l,t,n,"",function(a){return a})):l!=null&&(Xl(l)&&(l=Fd(l,n+(!l.key||o&&o.key===l.key?"":(""+l.key).replace(_u,"$&/")+"/")+e)),t.push(l)),1;if(o=0,r=r===""?".":r+":",wu(e))for(var u=0;u<e.length;u++){i=e[u];var s=r+Ql(i,u);o+=wr(i,t,n,s,l)}else if(s=Dd(e),typeof s=="function")for(e=s.call(e),u=0;!(i=e.next()).done;)i=i.value,s=r+Ql(i,u++),o+=wr(i,t,n,s,l);else if(i==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return o}function yr(e,t,n){if(e==null)return e;var r=[],l=0;return wr(e,r,"","",function(i){return t.call(n,i,l++)}),r}function bd(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var ae={current:null},_r={transition:null},jd={ReactCurrentDispatcher:ae,ReactCurrentBatchConfig:_r,ReactCurrentOwner:Gl};function Tu(){throw Error("act(...) is not supported in production builds of React.")}N.Children={map:yr,forEach:function(e,t,n){yr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return yr(e,function(){t++}),t},toArray:function(e){return yr(e,function(t){return t})||[]},only:function(e){if(!Xl(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};N.Component=Kt;N.Fragment=Pd;N.Profiler=Td;N.PureComponent=Kl;N.StrictMode=Nd;N.Suspense=Ld;N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=jd;N.act=Tu;N.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Su({},e.props),l=e.key,i=e.ref,o=e._owner;if(t!=null){if(t.ref!==void 0&&(i=t.ref,o=Gl.current),t.key!==void 0&&(l=""+t.key),e.type&&e.type.defaultProps)var u=e.type.defaultProps;for(s in t)Cu.call(t,s)&&!Pu.hasOwnProperty(s)&&(r[s]=t[s]===void 0&&u!==void 0?u[s]:t[s])}var s=arguments.length-2;if(s===1)r.children=n;else if(1<s){u=Array(s);for(var a=0;a<s;a++)u[a]=arguments[a+2];r.children=u}return{$$typeof:Cn,type:e.type,key:l,ref:i,props:r,_owner:o}};N.createContext=function(e){return e={$$typeof:zd,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Rd,_context:e},e.Consumer=e};N.createElement=Nu;N.createFactory=function(e){var t=Nu.bind(null,e);return t.type=e,t};N.createRef=function(){return{current:null}};N.forwardRef=function(e){return{$$typeof:Id,render:e}};N.isValidElement=Xl;N.lazy=function(e){return{$$typeof:Md,_payload:{_status:-1,_result:e},_init:bd}};N.memo=function(e,t){return{$$typeof:Od,type:e,compare:t===void 0?null:t}};N.startTransition=function(e){var t=_r.transition;_r.transition={};try{e()}finally{_r.transition=t}};N.unstable_act=Tu;N.useCallback=function(e,t){return ae.current.useCallback(e,t)};N.useContext=function(e){return ae.current.useContext(e)};N.useDebugValue=function(){};N.useDeferredValue=function(e){return ae.current.useDeferredValue(e)};N.useEffect=function(e,t){return ae.current.useEffect(e,t)};N.useId=function(){return ae.current.useId()};N.useImperativeHandle=function(e,t,n){return ae.current.useImperativeHandle(e,t,n)};N.useInsertionEffect=function(e,t){return ae.current.useInsertionEffect(e,t)};N.useLayoutEffect=function(e,t){return ae.current.useLayoutEffect(e,t)};N.useMemo=function(e,t){return ae.current.useMemo(e,t)};N.useReducer=function(e,t,n){return ae.current.useReducer(e,t,n)};N.useRef=function(e){return ae.current.useRef(e)};N.useState=function(e){return ae.current.useState(e)};N.useSyncExternalStore=function(e,t,n){return ae.current.useSyncExternalStore(e,t,n)};N.useTransition=function(){return ae.current.useTransition()};N.version="18.3.1"});var $e=qe((dm,zu)=>{"use strict";zu.exports=Ru()});var Bu=qe(I=>{"use strict";function ei(e,t){var n=e.length;e.push(t);e:for(;0<n;){var r=n-1>>>1,l=e[r];if(0<kr(l,t))e[r]=t,e[n]=l,n=r;else break e}}function Oe(e){return e.length===0?null:e[0]}function xr(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var r=0,l=e.length,i=l>>>1;r<i;){var o=2*(r+1)-1,u=e[o],s=o+1,a=e[s];if(0>kr(u,n))s<l&&0>kr(a,u)?(e[r]=a,e[s]=n,r=s):(e[r]=u,e[o]=n,r=o);else if(s<l&&0>kr(a,n))e[r]=a,e[s]=n,r=s;else break e}}return t}function kr(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}typeof performance=="object"&&typeof performance.now=="function"?(Iu=performance,I.unstable_now=function(){return Iu.now()}):(ql=Date,Lu=ql.now(),I.unstable_now=function(){return ql.now()-Lu});var Iu,ql,Lu,We=[],at=[],Bd=1,Ce=null,re=3,Er=!1,It=!1,Nn=!1,Du=typeof setTimeout=="function"?setTimeout:null,Fu=typeof clearTimeout=="function"?clearTimeout:null,Ou=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ti(e){for(var t=Oe(at);t!==null;){if(t.callback===null)xr(at);else if(t.startTime<=e)xr(at),t.sortIndex=t.expirationTime,ei(We,t);else break;t=Oe(at)}}function ni(e){if(Nn=!1,ti(e),!It)if(Oe(We)!==null)It=!0,li(ri);else{var t=Oe(at);t!==null&&ii(ni,t.startTime-e)}}function ri(e,t){It=!1,Nn&&(Nn=!1,Fu(Tn),Tn=-1),Er=!0;var n=re;try{for(ti(t),Ce=Oe(We);Ce!==null&&(!(Ce.expirationTime>t)||e&&!ju());){var r=Ce.callback;if(typeof r=="function"){Ce.callback=null,re=Ce.priorityLevel;var l=r(Ce.expirationTime<=t);t=I.unstable_now(),typeof l=="function"?Ce.callback=l:Ce===Oe(We)&&xr(We),ti(t)}else xr(We);Ce=Oe(We)}if(Ce!==null)var i=!0;else{var o=Oe(at);o!==null&&ii(ni,o.startTime-t),i=!1}return i}finally{Ce=null,re=n,Er=!1}}var Cr=!1,Sr=null,Tn=-1,Au=5,bu=-1;function ju(){return!(I.unstable_now()-bu<Au)}function Zl(){if(Sr!==null){var e=I.unstable_now();bu=e;var t=!0;try{t=Sr(!0,e)}finally{t?Pn():(Cr=!1,Sr=null)}}else Cr=!1}var Pn;typeof Ou=="function"?Pn=function(){Ou(Zl)}:typeof MessageChannel<"u"?(Jl=new MessageChannel,Mu=Jl.port2,Jl.port1.onmessage=Zl,Pn=function(){Mu.postMessage(null)}):Pn=function(){Du(Zl,0)};var Jl,Mu;function li(e){Sr=e,Cr||(Cr=!0,Pn())}function ii(e,t){Tn=Du(function(){e(I.unstable_now())},t)}I.unstable_IdlePriority=5;I.unstable_ImmediatePriority=1;I.unstable_LowPriority=4;I.unstable_NormalPriority=3;I.unstable_Profiling=null;I.unstable_UserBlockingPriority=2;I.unstable_cancelCallback=function(e){e.callback=null};I.unstable_continueExecution=function(){It||Er||(It=!0,li(ri))};I.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Au=0<e?Math.floor(1e3/e):5};I.unstable_getCurrentPriorityLevel=function(){return re};I.unstable_getFirstCallbackNode=function(){return Oe(We)};I.unstable_next=function(e){switch(re){case 1:case 2:case 3:var t=3;break;default:t=re}var n=re;re=t;try{return e()}finally{re=n}};I.unstable_pauseExecution=function(){};I.unstable_requestPaint=function(){};I.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=re;re=e;try{return t()}finally{re=n}};I.unstable_scheduleCallback=function(e,t,n){var r=I.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?r+n:r):n=r,e){case 1:var l=-1;break;case 2:l=250;break;case 5:l=1073741823;break;case 4:l=1e4;break;default:l=5e3}return l=n+l,e={id:Bd++,callback:t,priorityLevel:e,startTime:n,expirationTime:l,sortIndex:-1},n>r?(e.sortIndex=n,ei(at,e),Oe(We)===null&&e===Oe(at)&&(Nn?(Fu(Tn),Tn=-1):Nn=!0,ii(ni,n-r))):(e.sortIndex=l,ei(We,e),It||Er||(It=!0,li(ri))),e};I.unstable_shouldYield=ju;I.unstable_wrapCallback=function(e){var t=re;return function(){var n=re;re=t;try{return e.apply(this,arguments)}finally{re=n}}}});var Vu=qe((pm,Uu)=>{"use strict";Uu.exports=Bu()});var Qc=qe(xe=>{"use strict";var Ud=$e(),ke=Vu();function v(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Gs=new Set,Xn={};function Wt(e,t){gn(e,t),gn(e+"Capture",t)}function gn(e,t){for(Xn[e]=t,e=0;e<t.length;e++)Gs.add(t[e])}var rt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ti=Object.prototype.hasOwnProperty,Vd=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,$u={},Wu={};function $d(e){return Ti.call(Wu,e)?!0:Ti.call($u,e)?!1:Vd.test(e)?Wu[e]=!0:($u[e]=!0,!1)}function Wd(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Hd(e,t,n,r){if(t===null||typeof t>"u"||Wd(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function fe(e,t,n,r,l,i,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=i,this.removeEmptyString=o}var te={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){te[e]=new fe(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];te[t]=new fe(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){te[e]=new fe(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){te[e]=new fe(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){te[e]=new fe(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){te[e]=new fe(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){te[e]=new fe(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){te[e]=new fe(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){te[e]=new fe(e,5,!1,e.toLowerCase(),null,!1,!1)});var ko=/[\-:]([a-z])/g;function So(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(ko,So);te[t]=new fe(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(ko,So);te[t]=new fe(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(ko,So);te[t]=new fe(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){te[e]=new fe(e,1,!1,e.toLowerCase(),null,!1,!1)});te.xlinkHref=new fe("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){te[e]=new fe(e,1,!1,e.toLowerCase(),null,!0,!0)});function xo(e,t,n,r){var l=te.hasOwnProperty(t)?te[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Hd(t,n,l,r)&&(n=null),r||l===null?$d(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var ut=Ud.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Pr=Symbol.for("react.element"),Xt=Symbol.for("react.portal"),qt=Symbol.for("react.fragment"),Eo=Symbol.for("react.strict_mode"),Ri=Symbol.for("react.profiler"),Xs=Symbol.for("react.provider"),qs=Symbol.for("react.context"),Co=Symbol.for("react.forward_ref"),zi=Symbol.for("react.suspense"),Ii=Symbol.for("react.suspense_list"),Po=Symbol.for("react.memo"),dt=Symbol.for("react.lazy");Symbol.for("react.scope");Symbol.for("react.debug_trace_mode");var Zs=Symbol.for("react.offscreen");Symbol.for("react.legacy_hidden");Symbol.for("react.cache");Symbol.for("react.tracing_marker");var Hu=Symbol.iterator;function Rn(e){return e===null||typeof e!="object"?null:(e=Hu&&e[Hu]||e["@@iterator"],typeof e=="function"?e:null)}var U=Object.assign,oi;function An(e){if(oi===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);oi=t&&t[1]||""}return`
`+oi+e}var ui=!1;function si(e,t){if(!e||ui)return"";ui=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(a){var r=a}Reflect.construct(e,[],t)}else{try{t.call()}catch(a){r=a}e.call(t.prototype)}else{try{throw Error()}catch(a){r=a}e()}}catch(a){if(a&&r&&typeof a.stack=="string"){for(var l=a.stack.split(`
`),i=r.stack.split(`
`),o=l.length-1,u=i.length-1;1<=o&&0<=u&&l[o]!==i[u];)u--;for(;1<=o&&0<=u;o--,u--)if(l[o]!==i[u]){if(o!==1||u!==1)do if(o--,u--,0>u||l[o]!==i[u]){var s=`
`+l[o].replace(" at new "," at ");return e.displayName&&s.includes("<anonymous>")&&(s=s.replace("<anonymous>",e.displayName)),s}while(1<=o&&0<=u);break}}}finally{ui=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?An(e):""}function Qd(e){switch(e.tag){case 5:return An(e.type);case 16:return An("Lazy");case 13:return An("Suspense");case 19:return An("SuspenseList");case 0:case 2:case 15:return e=si(e.type,!1),e;case 11:return e=si(e.type.render,!1),e;case 1:return e=si(e.type,!0),e;default:return""}}function Li(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case qt:return"Fragment";case Xt:return"Portal";case Ri:return"Profiler";case Eo:return"StrictMode";case zi:return"Suspense";case Ii:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case qs:return(e.displayName||"Context")+".Consumer";case Xs:return(e._context.displayName||"Context")+".Provider";case Co:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Po:return t=e.displayName||null,t!==null?t:Li(e.type)||"Memo";case dt:t=e._payload,e=e._init;try{return Li(e(t))}catch{}}return null}function Kd(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Li(t);case 8:return t===Eo?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Ct(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Js(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Yd(e){var t=Js(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(o){r=""+o,i.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Nr(e){e._valueTracker||(e._valueTracker=Yd(e))}function ea(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Js(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function tl(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Oi(e,t){var n=t.checked;return U({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Qu(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=Ct(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function ta(e,t){t=t.checked,t!=null&&xo(e,"checked",t,!1)}function Mi(e,t){ta(e,t);var n=Ct(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Di(e,t.type,n):t.hasOwnProperty("defaultValue")&&Di(e,t.type,Ct(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ku(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Di(e,t,n){(t!=="number"||tl(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var bn=Array.isArray;function an(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Ct(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function Fi(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(v(91));return U({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Yu(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(v(92));if(bn(n)){if(1<n.length)throw Error(v(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Ct(n)}}function na(e,t){var n=Ct(t.value),r=Ct(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Gu(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function ra(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ai(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?ra(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Tr,la=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Tr=Tr||document.createElement("div"),Tr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Tr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function qn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Un={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Gd=["Webkit","ms","Moz","O"];Object.keys(Un).forEach(function(e){Gd.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Un[t]=Un[e]})});function ia(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Un.hasOwnProperty(e)&&Un[e]?(""+t).trim():t+"px"}function oa(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=ia(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var Xd=U({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function bi(e,t){if(t){if(Xd[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(v(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(v(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(v(61))}if(t.style!=null&&typeof t.style!="object")throw Error(v(62))}}function ji(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Bi=null;function No(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ui=null,cn=null,dn=null;function Xu(e){if(e=gr(e)){if(typeof Ui!="function")throw Error(v(280));var t=e.stateNode;t&&(t=Rl(t),Ui(e.stateNode,e.type,t))}}function ua(e){cn?dn?dn.push(e):dn=[e]:cn=e}function sa(){if(cn){var e=cn,t=dn;if(dn=cn=null,Xu(e),t)for(e=0;e<t.length;e++)Xu(t[e])}}function aa(e,t){return e(t)}function ca(){}var ai=!1;function da(e,t,n){if(ai)return e(t,n);ai=!0;try{return aa(e,t,n)}finally{ai=!1,(cn!==null||dn!==null)&&(ca(),sa())}}function Zn(e,t){var n=e.stateNode;if(n===null)return null;var r=Rl(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(v(231,t,typeof n));return n}var Vi=!1;if(rt)try{Yt={},Object.defineProperty(Yt,"passive",{get:function(){Vi=!0}}),window.addEventListener("test",Yt,Yt),window.removeEventListener("test",Yt,Yt)}catch{Vi=!1}var Yt;function qd(e,t,n,r,l,i,o,u,s){var a=Array.prototype.slice.call(arguments,3);try{t.apply(n,a)}catch(f){this.onError(f)}}var Vn=!1,nl=null,rl=!1,$i=null,Zd={onError:function(e){Vn=!0,nl=e}};function Jd(e,t,n,r,l,i,o,u,s){Vn=!1,nl=null,qd.apply(Zd,arguments)}function ef(e,t,n,r,l,i,o,u,s){if(Jd.apply(this,arguments),Vn){if(Vn){var a=nl;Vn=!1,nl=null}else throw Error(v(198));rl||(rl=!0,$i=a)}}function Ht(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function fa(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function qu(e){if(Ht(e)!==e)throw Error(v(188))}function tf(e){var t=e.alternate;if(!t){if(t=Ht(e),t===null)throw Error(v(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var i=l.alternate;if(i===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===i.child){for(i=l.child;i;){if(i===n)return qu(l),e;if(i===r)return qu(l),t;i=i.sibling}throw Error(v(188))}if(n.return!==r.return)n=l,r=i;else{for(var o=!1,u=l.child;u;){if(u===n){o=!0,n=l,r=i;break}if(u===r){o=!0,r=l,n=i;break}u=u.sibling}if(!o){for(u=i.child;u;){if(u===n){o=!0,n=i,r=l;break}if(u===r){o=!0,r=i,n=l;break}u=u.sibling}if(!o)throw Error(v(189))}}if(n.alternate!==r)throw Error(v(190))}if(n.tag!==3)throw Error(v(188));return n.stateNode.current===n?e:t}function pa(e){return e=tf(e),e!==null?ma(e):null}function ma(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=ma(e);if(t!==null)return t;e=e.sibling}return null}var ga=ke.unstable_scheduleCallback,Zu=ke.unstable_cancelCallback,nf=ke.unstable_shouldYield,rf=ke.unstable_requestPaint,$=ke.unstable_now,lf=ke.unstable_getCurrentPriorityLevel,To=ke.unstable_ImmediatePriority,ha=ke.unstable_UserBlockingPriority,ll=ke.unstable_NormalPriority,of=ke.unstable_LowPriority,va=ke.unstable_IdlePriority,Cl=null,Ye=null;function uf(e){if(Ye&&typeof Ye.onCommitFiberRoot=="function")try{Ye.onCommitFiberRoot(Cl,e,void 0,(e.current.flags&128)===128)}catch{}}var be=Math.clz32?Math.clz32:cf,sf=Math.log,af=Math.LN2;function cf(e){return e>>>=0,e===0?32:31-(sf(e)/af|0)|0}var Rr=64,zr=4194304;function jn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function il(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,i=e.pingedLanes,o=n&268435455;if(o!==0){var u=o&~l;u!==0?r=jn(u):(i&=o,i!==0&&(r=jn(i)))}else o=n&~l,o!==0?r=jn(o):i!==0&&(r=jn(i));if(r===0)return 0;if(t!==0&&t!==r&&!(t&l)&&(l=r&-r,i=t&-t,l>=i||l===16&&(i&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-be(t),l=1<<n,r|=e[n],t&=~l;return r}function df(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ff(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,i=e.pendingLanes;0<i;){var o=31-be(i),u=1<<o,s=l[o];s===-1?(!(u&n)||u&r)&&(l[o]=df(u,t)):s<=t&&(e.expiredLanes|=u),i&=~u}}function Wi(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function ya(){var e=Rr;return Rr<<=1,!(Rr&4194240)&&(Rr=64),e}function ci(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function pr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-be(t),e[t]=n}function pf(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-be(n),i=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~i}}function Ro(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-be(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var z=0;function wa(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var _a,zo,ka,Sa,xa,Hi=!1,Ir=[],vt=null,yt=null,wt=null,Jn=new Map,er=new Map,pt=[],mf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ju(e,t){switch(e){case"focusin":case"focusout":vt=null;break;case"dragenter":case"dragleave":yt=null;break;case"mouseover":case"mouseout":wt=null;break;case"pointerover":case"pointerout":Jn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":er.delete(t.pointerId)}}function zn(e,t,n,r,l,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:i,targetContainers:[l]},t!==null&&(t=gr(t),t!==null&&zo(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function gf(e,t,n,r,l){switch(t){case"focusin":return vt=zn(vt,e,t,n,r,l),!0;case"dragenter":return yt=zn(yt,e,t,n,r,l),!0;case"mouseover":return wt=zn(wt,e,t,n,r,l),!0;case"pointerover":var i=l.pointerId;return Jn.set(i,zn(Jn.get(i)||null,e,t,n,r,l)),!0;case"gotpointercapture":return i=l.pointerId,er.set(i,zn(er.get(i)||null,e,t,n,r,l)),!0}return!1}function Ea(e){var t=Mt(e.target);if(t!==null){var n=Ht(t);if(n!==null){if(t=n.tag,t===13){if(t=fa(n),t!==null){e.blockedOn=t,xa(e.priority,function(){ka(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Hr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Qi(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Bi=r,n.target.dispatchEvent(r),Bi=null}else return t=gr(n),t!==null&&zo(t),e.blockedOn=n,!1;t.shift()}return!0}function es(e,t,n){Hr(e)&&n.delete(t)}function hf(){Hi=!1,vt!==null&&Hr(vt)&&(vt=null),yt!==null&&Hr(yt)&&(yt=null),wt!==null&&Hr(wt)&&(wt=null),Jn.forEach(es),er.forEach(es)}function In(e,t){e.blockedOn===t&&(e.blockedOn=null,Hi||(Hi=!0,ke.unstable_scheduleCallback(ke.unstable_NormalPriority,hf)))}function tr(e){function t(l){return In(l,e)}if(0<Ir.length){In(Ir[0],e);for(var n=1;n<Ir.length;n++){var r=Ir[n];r.blockedOn===e&&(r.blockedOn=null)}}for(vt!==null&&In(vt,e),yt!==null&&In(yt,e),wt!==null&&In(wt,e),Jn.forEach(t),er.forEach(t),n=0;n<pt.length;n++)r=pt[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<pt.length&&(n=pt[0],n.blockedOn===null);)Ea(n),n.blockedOn===null&&pt.shift()}var fn=ut.ReactCurrentBatchConfig,ol=!0;function vf(e,t,n,r){var l=z,i=fn.transition;fn.transition=null;try{z=1,Io(e,t,n,r)}finally{z=l,fn.transition=i}}function yf(e,t,n,r){var l=z,i=fn.transition;fn.transition=null;try{z=4,Io(e,t,n,r)}finally{z=l,fn.transition=i}}function Io(e,t,n,r){if(ol){var l=Qi(e,t,n,r);if(l===null)vi(e,t,r,ul,n),Ju(e,r);else if(gf(l,e,t,n,r))r.stopPropagation();else if(Ju(e,r),t&4&&-1<mf.indexOf(e)){for(;l!==null;){var i=gr(l);if(i!==null&&_a(i),i=Qi(e,t,n,r),i===null&&vi(e,t,r,ul,n),i===l)break;l=i}l!==null&&r.stopPropagation()}else vi(e,t,r,null,n)}}var ul=null;function Qi(e,t,n,r){if(ul=null,e=No(r),e=Mt(e),e!==null)if(t=Ht(e),t===null)e=null;else if(n=t.tag,n===13){if(e=fa(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return ul=e,null}function Ca(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(lf()){case To:return 1;case ha:return 4;case ll:case of:return 16;case va:return 536870912;default:return 16}default:return 16}}var gt=null,Lo=null,Qr=null;function Pa(){if(Qr)return Qr;var e,t=Lo,n=t.length,r,l="value"in gt?gt.value:gt.textContent,i=l.length;for(e=0;e<n&&t[e]===l[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===l[i-r];r++);return Qr=l.slice(e,1<r?1-r:void 0)}function Kr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Lr(){return!0}function ts(){return!1}function Se(e){function t(n,r,l,i,o){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=i,this.target=o,this.currentTarget=null;for(var u in e)e.hasOwnProperty(u)&&(n=e[u],this[u]=n?n(i):i[u]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?Lr:ts,this.isPropagationStopped=ts,this}return U(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Lr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Lr)},persist:function(){},isPersistent:Lr}),t}var Sn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Oo=Se(Sn),mr=U({},Sn,{view:0,detail:0}),wf=Se(mr),di,fi,Ln,Pl=U({},mr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Mo,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ln&&(Ln&&e.type==="mousemove"?(di=e.screenX-Ln.screenX,fi=e.screenY-Ln.screenY):fi=di=0,Ln=e),di)},movementY:function(e){return"movementY"in e?e.movementY:fi}}),ns=Se(Pl),_f=U({},Pl,{dataTransfer:0}),kf=Se(_f),Sf=U({},mr,{relatedTarget:0}),pi=Se(Sf),xf=U({},Sn,{animationName:0,elapsedTime:0,pseudoElement:0}),Ef=Se(xf),Cf=U({},Sn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Pf=Se(Cf),Nf=U({},Sn,{data:0}),rs=Se(Nf),Tf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Rf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},zf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function If(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=zf[e])?!!t[e]:!1}function Mo(){return If}var Lf=U({},mr,{key:function(e){if(e.key){var t=Tf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Kr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Rf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Mo,charCode:function(e){return e.type==="keypress"?Kr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Kr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Of=Se(Lf),Mf=U({},Pl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ls=Se(Mf),Df=U({},mr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Mo}),Ff=Se(Df),Af=U({},Sn,{propertyName:0,elapsedTime:0,pseudoElement:0}),bf=Se(Af),jf=U({},Pl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Bf=Se(jf),Uf=[9,13,27,32],Do=rt&&"CompositionEvent"in window,$n=null;rt&&"documentMode"in document&&($n=document.documentMode);var Vf=rt&&"TextEvent"in window&&!$n,Na=rt&&(!Do||$n&&8<$n&&11>=$n),is=" ",os=!1;function Ta(e,t){switch(e){case"keyup":return Uf.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ra(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Zt=!1;function $f(e,t){switch(e){case"compositionend":return Ra(t);case"keypress":return t.which!==32?null:(os=!0,is);case"textInput":return e=t.data,e===is&&os?null:e;default:return null}}function Wf(e,t){if(Zt)return e==="compositionend"||!Do&&Ta(e,t)?(e=Pa(),Qr=Lo=gt=null,Zt=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Na&&t.locale!=="ko"?null:t.data;default:return null}}var Hf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function us(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Hf[e.type]:t==="textarea"}function za(e,t,n,r){ua(r),t=sl(t,"onChange"),0<t.length&&(n=new Oo("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Wn=null,nr=null;function Qf(e){Ua(e,0)}function Nl(e){var t=tn(e);if(ea(t))return e}function Kf(e,t){if(e==="change")return t}var Ia=!1;rt&&(rt?(Mr="oninput"in document,Mr||(mi=document.createElement("div"),mi.setAttribute("oninput","return;"),Mr=typeof mi.oninput=="function"),Or=Mr):Or=!1,Ia=Or&&(!document.documentMode||9<document.documentMode));var Or,Mr,mi;function ss(){Wn&&(Wn.detachEvent("onpropertychange",La),nr=Wn=null)}function La(e){if(e.propertyName==="value"&&Nl(nr)){var t=[];za(t,nr,e,No(e)),da(Qf,t)}}function Yf(e,t,n){e==="focusin"?(ss(),Wn=t,nr=n,Wn.attachEvent("onpropertychange",La)):e==="focusout"&&ss()}function Gf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Nl(nr)}function Xf(e,t){if(e==="click")return Nl(t)}function qf(e,t){if(e==="input"||e==="change")return Nl(t)}function Zf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Be=typeof Object.is=="function"?Object.is:Zf;function rr(e,t){if(Be(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!Ti.call(t,l)||!Be(e[l],t[l]))return!1}return!0}function as(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function cs(e,t){var n=as(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=as(n)}}function Oa(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Oa(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ma(){for(var e=window,t=tl();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=tl(e.document)}return t}function Fo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Jf(e){var t=Ma(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Oa(n.ownerDocument.documentElement,n)){if(r!==null&&Fo(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,i=Math.min(r.start,l);r=r.end===void 0?i:Math.min(r.end,l),!e.extend&&i>r&&(l=r,r=i,i=l),l=cs(n,i);var o=cs(n,r);l&&o&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),i>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var ep=rt&&"documentMode"in document&&11>=document.documentMode,Jt=null,Ki=null,Hn=null,Yi=!1;function ds(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Yi||Jt==null||Jt!==tl(r)||(r=Jt,"selectionStart"in r&&Fo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Hn&&rr(Hn,r)||(Hn=r,r=sl(Ki,"onSelect"),0<r.length&&(t=new Oo("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Jt)))}function Dr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var en={animationend:Dr("Animation","AnimationEnd"),animationiteration:Dr("Animation","AnimationIteration"),animationstart:Dr("Animation","AnimationStart"),transitionend:Dr("Transition","TransitionEnd")},gi={},Da={};rt&&(Da=document.createElement("div").style,"AnimationEvent"in window||(delete en.animationend.animation,delete en.animationiteration.animation,delete en.animationstart.animation),"TransitionEvent"in window||delete en.transitionend.transition);function Tl(e){if(gi[e])return gi[e];if(!en[e])return e;var t=en[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Da)return gi[e]=t[n];return e}var Fa=Tl("animationend"),Aa=Tl("animationiteration"),ba=Tl("animationstart"),ja=Tl("transitionend"),Ba=new Map,fs="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Nt(e,t){Ba.set(e,t),Wt(t,[e])}for(Fr=0;Fr<fs.length;Fr++)Ar=fs[Fr],ps=Ar.toLowerCase(),ms=Ar[0].toUpperCase()+Ar.slice(1),Nt(ps,"on"+ms);var Ar,ps,ms,Fr;Nt(Fa,"onAnimationEnd");Nt(Aa,"onAnimationIteration");Nt(ba,"onAnimationStart");Nt("dblclick","onDoubleClick");Nt("focusin","onFocus");Nt("focusout","onBlur");Nt(ja,"onTransitionEnd");gn("onMouseEnter",["mouseout","mouseover"]);gn("onMouseLeave",["mouseout","mouseover"]);gn("onPointerEnter",["pointerout","pointerover"]);gn("onPointerLeave",["pointerout","pointerover"]);Wt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Wt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Wt("onBeforeInput",["compositionend","keypress","textInput","paste"]);Wt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Wt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Wt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Bn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),tp=new Set("cancel close invalid load scroll toggle".split(" ").concat(Bn));function gs(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,ef(r,t,void 0,e),e.currentTarget=null}function Ua(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var i=void 0;if(t)for(var o=r.length-1;0<=o;o--){var u=r[o],s=u.instance,a=u.currentTarget;if(u=u.listener,s!==i&&l.isPropagationStopped())break e;gs(l,u,a),i=s}else for(o=0;o<r.length;o++){if(u=r[o],s=u.instance,a=u.currentTarget,u=u.listener,s!==i&&l.isPropagationStopped())break e;gs(l,u,a),i=s}}}if(rl)throw e=$i,rl=!1,$i=null,e}function O(e,t){var n=t[Ji];n===void 0&&(n=t[Ji]=new Set);var r=e+"__bubble";n.has(r)||(Va(t,e,2,!1),n.add(r))}function hi(e,t,n){var r=0;t&&(r|=4),Va(n,e,r,t)}var br="_reactListening"+Math.random().toString(36).slice(2);function lr(e){if(!e[br]){e[br]=!0,Gs.forEach(function(n){n!=="selectionchange"&&(tp.has(n)||hi(n,!1,e),hi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[br]||(t[br]=!0,hi("selectionchange",!1,t))}}function Va(e,t,n,r){switch(Ca(t)){case 1:var l=vf;break;case 4:l=yf;break;default:l=Io}n=l.bind(null,t,n,e),l=void 0,!Vi||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function vi(e,t,n,r,l){var i=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var u=r.stateNode.containerInfo;if(u===l||u.nodeType===8&&u.parentNode===l)break;if(o===4)for(o=r.return;o!==null;){var s=o.tag;if((s===3||s===4)&&(s=o.stateNode.containerInfo,s===l||s.nodeType===8&&s.parentNode===l))return;o=o.return}for(;u!==null;){if(o=Mt(u),o===null)return;if(s=o.tag,s===5||s===6){r=i=o;continue e}u=u.parentNode}}r=r.return}da(function(){var a=i,f=No(n),m=[];e:{var g=Ba.get(e);if(g!==void 0){var y=Oo,w=e;switch(e){case"keypress":if(Kr(n)===0)break e;case"keydown":case"keyup":y=Of;break;case"focusin":w="focus",y=pi;break;case"focusout":w="blur",y=pi;break;case"beforeblur":case"afterblur":y=pi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":y=ns;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":y=kf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":y=Ff;break;case Fa:case Aa:case ba:y=Ef;break;case ja:y=bf;break;case"scroll":y=wf;break;case"wheel":y=Bf;break;case"copy":case"cut":case"paste":y=Pf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":y=ls}var _=(t&4)!==0,b=!_&&e==="scroll",d=_?g!==null?g+"Capture":null:g;_=[];for(var c=a,p;c!==null;){p=c;var h=p.stateNode;if(p.tag===5&&h!==null&&(p=h,d!==null&&(h=Zn(c,d),h!=null&&_.push(ir(c,h,p)))),b)break;c=c.return}0<_.length&&(g=new y(g,w,null,n,f),m.push({event:g,listeners:_}))}}if(!(t&7)){e:{if(g=e==="mouseover"||e==="pointerover",y=e==="mouseout"||e==="pointerout",g&&n!==Bi&&(w=n.relatedTarget||n.fromElement)&&(Mt(w)||w[lt]))break e;if((y||g)&&(g=f.window===f?f:(g=f.ownerDocument)?g.defaultView||g.parentWindow:window,y?(w=n.relatedTarget||n.toElement,y=a,w=w?Mt(w):null,w!==null&&(b=Ht(w),w!==b||w.tag!==5&&w.tag!==6)&&(w=null)):(y=null,w=a),y!==w)){if(_=ns,h="onMouseLeave",d="onMouseEnter",c="mouse",(e==="pointerout"||e==="pointerover")&&(_=ls,h="onPointerLeave",d="onPointerEnter",c="pointer"),b=y==null?g:tn(y),p=w==null?g:tn(w),g=new _(h,c+"leave",y,n,f),g.target=b,g.relatedTarget=p,h=null,Mt(f)===a&&(_=new _(d,c+"enter",w,n,f),_.target=p,_.relatedTarget=b,h=_),b=h,y&&w)t:{for(_=y,d=w,c=0,p=_;p;p=Gt(p))c++;for(p=0,h=d;h;h=Gt(h))p++;for(;0<c-p;)_=Gt(_),c--;for(;0<p-c;)d=Gt(d),p--;for(;c--;){if(_===d||d!==null&&_===d.alternate)break t;_=Gt(_),d=Gt(d)}_=null}else _=null;y!==null&&hs(m,g,y,_,!1),w!==null&&b!==null&&hs(m,b,w,_,!0)}}e:{if(g=a?tn(a):window,y=g.nodeName&&g.nodeName.toLowerCase(),y==="select"||y==="input"&&g.type==="file")var S=Kf;else if(us(g))if(Ia)S=qf;else{S=Gf;var E=Yf}else(y=g.nodeName)&&y.toLowerCase()==="input"&&(g.type==="checkbox"||g.type==="radio")&&(S=Xf);if(S&&(S=S(e,a))){za(m,S,n,f);break e}E&&E(e,g,a),e==="focusout"&&(E=g._wrapperState)&&E.controlled&&g.type==="number"&&Di(g,"number",g.value)}switch(E=a?tn(a):window,e){case"focusin":(us(E)||E.contentEditable==="true")&&(Jt=E,Ki=a,Hn=null);break;case"focusout":Hn=Ki=Jt=null;break;case"mousedown":Yi=!0;break;case"contextmenu":case"mouseup":case"dragend":Yi=!1,ds(m,n,f);break;case"selectionchange":if(ep)break;case"keydown":case"keyup":ds(m,n,f)}var C;if(Do)e:{switch(e){case"compositionstart":var P="onCompositionStart";break e;case"compositionend":P="onCompositionEnd";break e;case"compositionupdate":P="onCompositionUpdate";break e}P=void 0}else Zt?Ta(e,n)&&(P="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(P="onCompositionStart");P&&(Na&&n.locale!=="ko"&&(Zt||P!=="onCompositionStart"?P==="onCompositionEnd"&&Zt&&(C=Pa()):(gt=f,Lo="value"in gt?gt.value:gt.textContent,Zt=!0)),E=sl(a,P),0<E.length&&(P=new rs(P,e,null,n,f),m.push({event:P,listeners:E}),C?P.data=C:(C=Ra(n),C!==null&&(P.data=C)))),(C=Vf?$f(e,n):Wf(e,n))&&(a=sl(a,"onBeforeInput"),0<a.length&&(f=new rs("onBeforeInput","beforeinput",null,n,f),m.push({event:f,listeners:a}),f.data=C))}Ua(m,t)})}function ir(e,t,n){return{instance:e,listener:t,currentTarget:n}}function sl(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,i=l.stateNode;l.tag===5&&i!==null&&(l=i,i=Zn(e,n),i!=null&&r.unshift(ir(e,i,l)),i=Zn(e,t),i!=null&&r.push(ir(e,i,l))),e=e.return}return r}function Gt(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function hs(e,t,n,r,l){for(var i=t._reactName,o=[];n!==null&&n!==r;){var u=n,s=u.alternate,a=u.stateNode;if(s!==null&&s===r)break;u.tag===5&&a!==null&&(u=a,l?(s=Zn(n,i),s!=null&&o.unshift(ir(n,s,u))):l||(s=Zn(n,i),s!=null&&o.push(ir(n,s,u)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var np=/\r\n?/g,rp=/\u0000|\uFFFD/g;function vs(e){return(typeof e=="string"?e:""+e).replace(np,`
`).replace(rp,"")}function jr(e,t,n){if(t=vs(t),vs(e)!==t&&n)throw Error(v(425))}function al(){}var Gi=null,Xi=null;function qi(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Zi=typeof setTimeout=="function"?setTimeout:void 0,lp=typeof clearTimeout=="function"?clearTimeout:void 0,ys=typeof Promise=="function"?Promise:void 0,ip=typeof queueMicrotask=="function"?queueMicrotask:typeof ys<"u"?function(e){return ys.resolve(null).then(e).catch(op)}:Zi;function op(e){setTimeout(function(){throw e})}function yi(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),tr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);tr(t)}function _t(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function ws(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var xn=Math.random().toString(36).slice(2),Ke="__reactFiber$"+xn,or="__reactProps$"+xn,lt="__reactContainer$"+xn,Ji="__reactEvents$"+xn,up="__reactListeners$"+xn,sp="__reactHandles$"+xn;function Mt(e){var t=e[Ke];if(t)return t;for(var n=e.parentNode;n;){if(t=n[lt]||n[Ke]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ws(e);e!==null;){if(n=e[Ke])return n;e=ws(e)}return t}e=n,n=e.parentNode}return null}function gr(e){return e=e[Ke]||e[lt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function tn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(v(33))}function Rl(e){return e[or]||null}var eo=[],nn=-1;function Tt(e){return{current:e}}function M(e){0>nn||(e.current=eo[nn],eo[nn]=null,nn--)}function L(e,t){nn++,eo[nn]=e.current,e.current=t}var Pt={},ue=Tt(Pt),ge=Tt(!1),jt=Pt;function hn(e,t){var n=e.type.contextTypes;if(!n)return Pt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},i;for(i in n)l[i]=t[i];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function he(e){return e=e.childContextTypes,e!=null}function cl(){M(ge),M(ue)}function _s(e,t,n){if(ue.current!==Pt)throw Error(v(168));L(ue,t),L(ge,n)}function $a(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(v(108,Kd(e)||"Unknown",l));return U({},n,r)}function dl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Pt,jt=ue.current,L(ue,e),L(ge,ge.current),!0}function ks(e,t,n){var r=e.stateNode;if(!r)throw Error(v(169));n?(e=$a(e,t,jt),r.__reactInternalMemoizedMergedChildContext=e,M(ge),M(ue),L(ue,e)):M(ge),L(ge,n)}var Je=null,zl=!1,wi=!1;function Wa(e){Je===null?Je=[e]:Je.push(e)}function ap(e){zl=!0,Wa(e)}function Rt(){if(!wi&&Je!==null){wi=!0;var e=0,t=z;try{var n=Je;for(z=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Je=null,zl=!1}catch(l){throw Je!==null&&(Je=Je.slice(e+1)),ga(To,Rt),l}finally{z=t,wi=!1}}return null}var rn=[],ln=0,fl=null,pl=0,Pe=[],Ne=0,Bt=null,et=1,tt="";function Lt(e,t){rn[ln++]=pl,rn[ln++]=fl,fl=e,pl=t}function Ha(e,t,n){Pe[Ne++]=et,Pe[Ne++]=tt,Pe[Ne++]=Bt,Bt=e;var r=et;e=tt;var l=32-be(r)-1;r&=~(1<<l),n+=1;var i=32-be(t)+l;if(30<i){var o=l-l%5;i=(r&(1<<o)-1).toString(32),r>>=o,l-=o,et=1<<32-be(t)+l|n<<l|r,tt=i+e}else et=1<<i|n<<l|r,tt=e}function Ao(e){e.return!==null&&(Lt(e,1),Ha(e,1,0))}function bo(e){for(;e===fl;)fl=rn[--ln],rn[ln]=null,pl=rn[--ln],rn[ln]=null;for(;e===Bt;)Bt=Pe[--Ne],Pe[Ne]=null,tt=Pe[--Ne],Pe[Ne]=null,et=Pe[--Ne],Pe[Ne]=null}var _e=null,we=null,A=!1,Ae=null;function Qa(e,t){var n=Te(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Ss(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,_e=e,we=_t(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,_e=e,we=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Bt!==null?{id:et,overflow:tt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Te(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,_e=e,we=null,!0):!1;default:return!1}}function to(e){return(e.mode&1)!==0&&(e.flags&128)===0}function no(e){if(A){var t=we;if(t){var n=t;if(!Ss(e,t)){if(to(e))throw Error(v(418));t=_t(n.nextSibling);var r=_e;t&&Ss(e,t)?Qa(r,n):(e.flags=e.flags&-4097|2,A=!1,_e=e)}}else{if(to(e))throw Error(v(418));e.flags=e.flags&-4097|2,A=!1,_e=e}}}function xs(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;_e=e}function Br(e){if(e!==_e)return!1;if(!A)return xs(e),A=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!qi(e.type,e.memoizedProps)),t&&(t=we)){if(to(e))throw Ka(),Error(v(418));for(;t;)Qa(e,t),t=_t(t.nextSibling)}if(xs(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){we=_t(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}we=null}}else we=_e?_t(e.stateNode.nextSibling):null;return!0}function Ka(){for(var e=we;e;)e=_t(e.nextSibling)}function vn(){we=_e=null,A=!1}function jo(e){Ae===null?Ae=[e]:Ae.push(e)}var cp=ut.ReactCurrentBatchConfig;function On(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(v(309));var r=n.stateNode}if(!r)throw Error(v(147,e));var l=r,i=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===i?t.ref:(t=function(o){var u=l.refs;o===null?delete u[i]:u[i]=o},t._stringRef=i,t)}if(typeof e!="string")throw Error(v(284));if(!n._owner)throw Error(v(290,e))}return e}function Ur(e,t){throw e=Object.prototype.toString.call(t),Error(v(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Es(e){var t=e._init;return t(e._payload)}function Ya(e){function t(d,c){if(e){var p=d.deletions;p===null?(d.deletions=[c],d.flags|=16):p.push(c)}}function n(d,c){if(!e)return null;for(;c!==null;)t(d,c),c=c.sibling;return null}function r(d,c){for(d=new Map;c!==null;)c.key!==null?d.set(c.key,c):d.set(c.index,c),c=c.sibling;return d}function l(d,c){return d=Et(d,c),d.index=0,d.sibling=null,d}function i(d,c,p){return d.index=p,e?(p=d.alternate,p!==null?(p=p.index,p<c?(d.flags|=2,c):p):(d.flags|=2,c)):(d.flags|=1048576,c)}function o(d){return e&&d.alternate===null&&(d.flags|=2),d}function u(d,c,p,h){return c===null||c.tag!==6?(c=Pi(p,d.mode,h),c.return=d,c):(c=l(c,p),c.return=d,c)}function s(d,c,p,h){var S=p.type;return S===qt?f(d,c,p.props.children,h,p.key):c!==null&&(c.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===dt&&Es(S)===c.type)?(h=l(c,p.props),h.ref=On(d,c,p),h.return=d,h):(h=el(p.type,p.key,p.props,null,d.mode,h),h.ref=On(d,c,p),h.return=d,h)}function a(d,c,p,h){return c===null||c.tag!==4||c.stateNode.containerInfo!==p.containerInfo||c.stateNode.implementation!==p.implementation?(c=Ni(p,d.mode,h),c.return=d,c):(c=l(c,p.children||[]),c.return=d,c)}function f(d,c,p,h,S){return c===null||c.tag!==7?(c=bt(p,d.mode,h,S),c.return=d,c):(c=l(c,p),c.return=d,c)}function m(d,c,p){if(typeof c=="string"&&c!==""||typeof c=="number")return c=Pi(""+c,d.mode,p),c.return=d,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case Pr:return p=el(c.type,c.key,c.props,null,d.mode,p),p.ref=On(d,null,c),p.return=d,p;case Xt:return c=Ni(c,d.mode,p),c.return=d,c;case dt:var h=c._init;return m(d,h(c._payload),p)}if(bn(c)||Rn(c))return c=bt(c,d.mode,p,null),c.return=d,c;Ur(d,c)}return null}function g(d,c,p,h){var S=c!==null?c.key:null;if(typeof p=="string"&&p!==""||typeof p=="number")return S!==null?null:u(d,c,""+p,h);if(typeof p=="object"&&p!==null){switch(p.$$typeof){case Pr:return p.key===S?s(d,c,p,h):null;case Xt:return p.key===S?a(d,c,p,h):null;case dt:return S=p._init,g(d,c,S(p._payload),h)}if(bn(p)||Rn(p))return S!==null?null:f(d,c,p,h,null);Ur(d,p)}return null}function y(d,c,p,h,S){if(typeof h=="string"&&h!==""||typeof h=="number")return d=d.get(p)||null,u(c,d,""+h,S);if(typeof h=="object"&&h!==null){switch(h.$$typeof){case Pr:return d=d.get(h.key===null?p:h.key)||null,s(c,d,h,S);case Xt:return d=d.get(h.key===null?p:h.key)||null,a(c,d,h,S);case dt:var E=h._init;return y(d,c,p,E(h._payload),S)}if(bn(h)||Rn(h))return d=d.get(p)||null,f(c,d,h,S,null);Ur(c,h)}return null}function w(d,c,p,h){for(var S=null,E=null,C=c,P=c=0,H=null;C!==null&&P<p.length;P++){C.index>P?(H=C,C=null):H=C.sibling;var x=g(d,C,p[P],h);if(x===null){C===null&&(C=H);break}e&&C&&x.alternate===null&&t(d,C),c=i(x,c,P),E===null?S=x:E.sibling=x,E=x,C=H}if(P===p.length)return n(d,C),A&&Lt(d,P),S;if(C===null){for(;P<p.length;P++)C=m(d,p[P],h),C!==null&&(c=i(C,c,P),E===null?S=C:E.sibling=C,E=C);return A&&Lt(d,P),S}for(C=r(d,C);P<p.length;P++)H=y(C,d,P,p[P],h),H!==null&&(e&&H.alternate!==null&&C.delete(H.key===null?P:H.key),c=i(H,c,P),E===null?S=H:E.sibling=H,E=H);return e&&C.forEach(function(R){return t(d,R)}),A&&Lt(d,P),S}function _(d,c,p,h){var S=Rn(p);if(typeof S!="function")throw Error(v(150));if(p=S.call(p),p==null)throw Error(v(151));for(var E=S=null,C=c,P=c=0,H=null,x=p.next();C!==null&&!x.done;P++,x=p.next()){C.index>P?(H=C,C=null):H=C.sibling;var R=g(d,C,x.value,h);if(R===null){C===null&&(C=H);break}e&&C&&R.alternate===null&&t(d,C),c=i(R,c,P),E===null?S=R:E.sibling=R,E=R,C=H}if(x.done)return n(d,C),A&&Lt(d,P),S;if(C===null){for(;!x.done;P++,x=p.next())x=m(d,x.value,h),x!==null&&(c=i(x,c,P),E===null?S=x:E.sibling=x,E=x);return A&&Lt(d,P),S}for(C=r(d,C);!x.done;P++,x=p.next())x=y(C,d,P,x.value,h),x!==null&&(e&&x.alternate!==null&&C.delete(x.key===null?P:x.key),c=i(x,c,P),E===null?S=x:E.sibling=x,E=x);return e&&C.forEach(function(G){return t(d,G)}),A&&Lt(d,P),S}function b(d,c,p,h){if(typeof p=="object"&&p!==null&&p.type===qt&&p.key===null&&(p=p.props.children),typeof p=="object"&&p!==null){switch(p.$$typeof){case Pr:e:{for(var S=p.key,E=c;E!==null;){if(E.key===S){if(S=p.type,S===qt){if(E.tag===7){n(d,E.sibling),c=l(E,p.props.children),c.return=d,d=c;break e}}else if(E.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===dt&&Es(S)===E.type){n(d,E.sibling),c=l(E,p.props),c.ref=On(d,E,p),c.return=d,d=c;break e}n(d,E);break}else t(d,E);E=E.sibling}p.type===qt?(c=bt(p.props.children,d.mode,h,p.key),c.return=d,d=c):(h=el(p.type,p.key,p.props,null,d.mode,h),h.ref=On(d,c,p),h.return=d,d=h)}return o(d);case Xt:e:{for(E=p.key;c!==null;){if(c.key===E)if(c.tag===4&&c.stateNode.containerInfo===p.containerInfo&&c.stateNode.implementation===p.implementation){n(d,c.sibling),c=l(c,p.children||[]),c.return=d,d=c;break e}else{n(d,c);break}else t(d,c);c=c.sibling}c=Ni(p,d.mode,h),c.return=d,d=c}return o(d);case dt:return E=p._init,b(d,c,E(p._payload),h)}if(bn(p))return w(d,c,p,h);if(Rn(p))return _(d,c,p,h);Ur(d,p)}return typeof p=="string"&&p!==""||typeof p=="number"?(p=""+p,c!==null&&c.tag===6?(n(d,c.sibling),c=l(c,p),c.return=d,d=c):(n(d,c),c=Pi(p,d.mode,h),c.return=d,d=c),o(d)):n(d,c)}return b}var yn=Ya(!0),Ga=Ya(!1),ml=Tt(null),gl=null,on=null,Bo=null;function Uo(){Bo=on=gl=null}function Vo(e){var t=ml.current;M(ml),e._currentValue=t}function ro(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function pn(e,t){gl=e,Bo=on=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(me=!0),e.firstContext=null)}function ze(e){var t=e._currentValue;if(Bo!==e)if(e={context:e,memoizedValue:t,next:null},on===null){if(gl===null)throw Error(v(308));on=e,gl.dependencies={lanes:0,firstContext:e}}else on=on.next=e;return t}var Dt=null;function $o(e){Dt===null?Dt=[e]:Dt.push(e)}function Xa(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,$o(t)):(n.next=l.next,l.next=n),t.interleaved=n,it(e,r)}function it(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var ft=!1;function Wo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function qa(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function nt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function kt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,T&2){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,it(e,n)}return l=r.interleaved,l===null?(t.next=t,$o(r)):(t.next=l.next,l.next=t),r.interleaved=t,it(e,n)}function Yr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ro(e,n)}}function Cs(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};i===null?l=i=o:i=i.next=o,n=n.next}while(n!==null);i===null?l=i=t:i=i.next=t}else l=i=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:i,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function hl(e,t,n,r){var l=e.updateQueue;ft=!1;var i=l.firstBaseUpdate,o=l.lastBaseUpdate,u=l.shared.pending;if(u!==null){l.shared.pending=null;var s=u,a=s.next;s.next=null,o===null?i=a:o.next=a,o=s;var f=e.alternate;f!==null&&(f=f.updateQueue,u=f.lastBaseUpdate,u!==o&&(u===null?f.firstBaseUpdate=a:u.next=a,f.lastBaseUpdate=s))}if(i!==null){var m=l.baseState;o=0,f=a=s=null,u=i;do{var g=u.lane,y=u.eventTime;if((r&g)===g){f!==null&&(f=f.next={eventTime:y,lane:0,tag:u.tag,payload:u.payload,callback:u.callback,next:null});e:{var w=e,_=u;switch(g=t,y=n,_.tag){case 1:if(w=_.payload,typeof w=="function"){m=w.call(y,m,g);break e}m=w;break e;case 3:w.flags=w.flags&-65537|128;case 0:if(w=_.payload,g=typeof w=="function"?w.call(y,m,g):w,g==null)break e;m=U({},m,g);break e;case 2:ft=!0}}u.callback!==null&&u.lane!==0&&(e.flags|=64,g=l.effects,g===null?l.effects=[u]:g.push(u))}else y={eventTime:y,lane:g,tag:u.tag,payload:u.payload,callback:u.callback,next:null},f===null?(a=f=y,s=m):f=f.next=y,o|=g;if(u=u.next,u===null){if(u=l.shared.pending,u===null)break;g=u,u=g.next,g.next=null,l.lastBaseUpdate=g,l.shared.pending=null}}while(!0);if(f===null&&(s=m),l.baseState=s,l.firstBaseUpdate=a,l.lastBaseUpdate=f,t=l.shared.interleaved,t!==null){l=t;do o|=l.lane,l=l.next;while(l!==t)}else i===null&&(l.shared.lanes=0);Vt|=o,e.lanes=o,e.memoizedState=m}}function Ps(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(v(191,l));l.call(r)}}}var hr={},Ge=Tt(hr),ur=Tt(hr),sr=Tt(hr);function Ft(e){if(e===hr)throw Error(v(174));return e}function Ho(e,t){switch(L(sr,t),L(ur,e),L(Ge,hr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Ai(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Ai(t,e)}M(Ge),L(Ge,t)}function wn(){M(Ge),M(ur),M(sr)}function Za(e){Ft(sr.current);var t=Ft(Ge.current),n=Ai(t,e.type);t!==n&&(L(ur,e),L(Ge,n))}function Qo(e){ur.current===e&&(M(Ge),M(ur))}var j=Tt(0);function vl(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var _i=[];function Ko(){for(var e=0;e<_i.length;e++)_i[e]._workInProgressVersionPrimary=null;_i.length=0}var Gr=ut.ReactCurrentDispatcher,ki=ut.ReactCurrentBatchConfig,Ut=0,B=null,K=null,X=null,yl=!1,Qn=!1,ar=0,dp=0;function le(){throw Error(v(321))}function Yo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Be(e[n],t[n]))return!1;return!0}function Go(e,t,n,r,l,i){if(Ut=i,B=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Gr.current=e===null||e.memoizedState===null?gp:hp,e=n(r,l),Qn){i=0;do{if(Qn=!1,ar=0,25<=i)throw Error(v(301));i+=1,X=K=null,t.updateQueue=null,Gr.current=vp,e=n(r,l)}while(Qn)}if(Gr.current=wl,t=K!==null&&K.next!==null,Ut=0,X=K=B=null,yl=!1,t)throw Error(v(300));return e}function Xo(){var e=ar!==0;return ar=0,e}function Qe(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return X===null?B.memoizedState=X=e:X=X.next=e,X}function Ie(){if(K===null){var e=B.alternate;e=e!==null?e.memoizedState:null}else e=K.next;var t=X===null?B.memoizedState:X.next;if(t!==null)X=t,K=e;else{if(e===null)throw Error(v(310));K=e,e={memoizedState:K.memoizedState,baseState:K.baseState,baseQueue:K.baseQueue,queue:K.queue,next:null},X===null?B.memoizedState=X=e:X=X.next=e}return X}function cr(e,t){return typeof t=="function"?t(e):t}function Si(e){var t=Ie(),n=t.queue;if(n===null)throw Error(v(311));n.lastRenderedReducer=e;var r=K,l=r.baseQueue,i=n.pending;if(i!==null){if(l!==null){var o=l.next;l.next=i.next,i.next=o}r.baseQueue=l=i,n.pending=null}if(l!==null){i=l.next,r=r.baseState;var u=o=null,s=null,a=i;do{var f=a.lane;if((Ut&f)===f)s!==null&&(s=s.next={lane:0,action:a.action,hasEagerState:a.hasEagerState,eagerState:a.eagerState,next:null}),r=a.hasEagerState?a.eagerState:e(r,a.action);else{var m={lane:f,action:a.action,hasEagerState:a.hasEagerState,eagerState:a.eagerState,next:null};s===null?(u=s=m,o=r):s=s.next=m,B.lanes|=f,Vt|=f}a=a.next}while(a!==null&&a!==i);s===null?o=r:s.next=u,Be(r,t.memoizedState)||(me=!0),t.memoizedState=r,t.baseState=o,t.baseQueue=s,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do i=l.lane,B.lanes|=i,Vt|=i,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function xi(e){var t=Ie(),n=t.queue;if(n===null)throw Error(v(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,i=t.memoizedState;if(l!==null){n.pending=null;var o=l=l.next;do i=e(i,o.action),o=o.next;while(o!==l);Be(i,t.memoizedState)||(me=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,r]}function Ja(){}function ec(e,t){var n=B,r=Ie(),l=t(),i=!Be(r.memoizedState,l);if(i&&(r.memoizedState=l,me=!0),r=r.queue,qo(rc.bind(null,n,r,e),[e]),r.getSnapshot!==t||i||X!==null&&X.memoizedState.tag&1){if(n.flags|=2048,dr(9,nc.bind(null,n,r,l,t),void 0,null),q===null)throw Error(v(349));Ut&30||tc(n,t,l)}return l}function tc(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=B.updateQueue,t===null?(t={lastEffect:null,stores:null},B.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function nc(e,t,n,r){t.value=n,t.getSnapshot=r,lc(t)&&ic(e)}function rc(e,t,n){return n(function(){lc(t)&&ic(e)})}function lc(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Be(e,n)}catch{return!0}}function ic(e){var t=it(e,1);t!==null&&je(t,e,1,-1)}function Ns(e){var t=Qe();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:cr,lastRenderedState:e},t.queue=e,e=e.dispatch=mp.bind(null,B,e),[t.memoizedState,e]}function dr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=B.updateQueue,t===null?(t={lastEffect:null,stores:null},B.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function oc(){return Ie().memoizedState}function Xr(e,t,n,r){var l=Qe();B.flags|=e,l.memoizedState=dr(1|t,n,void 0,r===void 0?null:r)}function Il(e,t,n,r){var l=Ie();r=r===void 0?null:r;var i=void 0;if(K!==null){var o=K.memoizedState;if(i=o.destroy,r!==null&&Yo(r,o.deps)){l.memoizedState=dr(t,n,i,r);return}}B.flags|=e,l.memoizedState=dr(1|t,n,i,r)}function Ts(e,t){return Xr(8390656,8,e,t)}function qo(e,t){return Il(2048,8,e,t)}function uc(e,t){return Il(4,2,e,t)}function sc(e,t){return Il(4,4,e,t)}function ac(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function cc(e,t,n){return n=n!=null?n.concat([e]):null,Il(4,4,ac.bind(null,t,e),n)}function Zo(){}function dc(e,t){var n=Ie();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Yo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function fc(e,t){var n=Ie();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Yo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function pc(e,t,n){return Ut&21?(Be(n,t)||(n=ya(),B.lanes|=n,Vt|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,me=!0),e.memoizedState=n)}function fp(e,t){var n=z;z=n!==0&&4>n?n:4,e(!0);var r=ki.transition;ki.transition={};try{e(!1),t()}finally{z=n,ki.transition=r}}function mc(){return Ie().memoizedState}function pp(e,t,n){var r=xt(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},gc(e))hc(t,n);else if(n=Xa(e,t,n,r),n!==null){var l=de();je(n,e,r,l),vc(n,t,r)}}function mp(e,t,n){var r=xt(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(gc(e))hc(t,l);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var o=t.lastRenderedState,u=i(o,n);if(l.hasEagerState=!0,l.eagerState=u,Be(u,o)){var s=t.interleaved;s===null?(l.next=l,$o(t)):(l.next=s.next,s.next=l),t.interleaved=l;return}}catch{}finally{}n=Xa(e,t,l,r),n!==null&&(l=de(),je(n,e,r,l),vc(n,t,r))}}function gc(e){var t=e.alternate;return e===B||t!==null&&t===B}function hc(e,t){Qn=yl=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function vc(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ro(e,n)}}var wl={readContext:ze,useCallback:le,useContext:le,useEffect:le,useImperativeHandle:le,useInsertionEffect:le,useLayoutEffect:le,useMemo:le,useReducer:le,useRef:le,useState:le,useDebugValue:le,useDeferredValue:le,useTransition:le,useMutableSource:le,useSyncExternalStore:le,useId:le,unstable_isNewReconciler:!1},gp={readContext:ze,useCallback:function(e,t){return Qe().memoizedState=[e,t===void 0?null:t],e},useContext:ze,useEffect:Ts,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Xr(4194308,4,ac.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Xr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Xr(4,2,e,t)},useMemo:function(e,t){var n=Qe();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Qe();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=pp.bind(null,B,e),[r.memoizedState,e]},useRef:function(e){var t=Qe();return e={current:e},t.memoizedState=e},useState:Ns,useDebugValue:Zo,useDeferredValue:function(e){return Qe().memoizedState=e},useTransition:function(){var e=Ns(!1),t=e[0];return e=fp.bind(null,e[1]),Qe().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=B,l=Qe();if(A){if(n===void 0)throw Error(v(407));n=n()}else{if(n=t(),q===null)throw Error(v(349));Ut&30||tc(r,t,n)}l.memoizedState=n;var i={value:n,getSnapshot:t};return l.queue=i,Ts(rc.bind(null,r,i,e),[e]),r.flags|=2048,dr(9,nc.bind(null,r,i,n,t),void 0,null),n},useId:function(){var e=Qe(),t=q.identifierPrefix;if(A){var n=tt,r=et;n=(r&~(1<<32-be(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=ar++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=dp++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},hp={readContext:ze,useCallback:dc,useContext:ze,useEffect:qo,useImperativeHandle:cc,useInsertionEffect:uc,useLayoutEffect:sc,useMemo:fc,useReducer:Si,useRef:oc,useState:function(){return Si(cr)},useDebugValue:Zo,useDeferredValue:function(e){var t=Ie();return pc(t,K.memoizedState,e)},useTransition:function(){var e=Si(cr)[0],t=Ie().memoizedState;return[e,t]},useMutableSource:Ja,useSyncExternalStore:ec,useId:mc,unstable_isNewReconciler:!1},vp={readContext:ze,useCallback:dc,useContext:ze,useEffect:qo,useImperativeHandle:cc,useInsertionEffect:uc,useLayoutEffect:sc,useMemo:fc,useReducer:xi,useRef:oc,useState:function(){return xi(cr)},useDebugValue:Zo,useDeferredValue:function(e){var t=Ie();return K===null?t.memoizedState=e:pc(t,K.memoizedState,e)},useTransition:function(){var e=xi(cr)[0],t=Ie().memoizedState;return[e,t]},useMutableSource:Ja,useSyncExternalStore:ec,useId:mc,unstable_isNewReconciler:!1};function De(e,t){if(e&&e.defaultProps){t=U({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function lo(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:U({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ll={isMounted:function(e){return(e=e._reactInternals)?Ht(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=de(),l=xt(e),i=nt(r,l);i.payload=t,n!=null&&(i.callback=n),t=kt(e,i,l),t!==null&&(je(t,e,l,r),Yr(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=de(),l=xt(e),i=nt(r,l);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=kt(e,i,l),t!==null&&(je(t,e,l,r),Yr(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=de(),r=xt(e),l=nt(n,r);l.tag=2,t!=null&&(l.callback=t),t=kt(e,l,r),t!==null&&(je(t,e,r,n),Yr(t,e,r))}};function Rs(e,t,n,r,l,i,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,i,o):t.prototype&&t.prototype.isPureReactComponent?!rr(n,r)||!rr(l,i):!0}function yc(e,t,n){var r=!1,l=Pt,i=t.contextType;return typeof i=="object"&&i!==null?i=ze(i):(l=he(t)?jt:ue.current,r=t.contextTypes,i=(r=r!=null)?hn(e,l):Pt),t=new t(n,i),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ll,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=i),t}function zs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Ll.enqueueReplaceState(t,t.state,null)}function io(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},Wo(e);var i=t.contextType;typeof i=="object"&&i!==null?l.context=ze(i):(i=he(t)?jt:ue.current,l.context=hn(e,i)),l.state=e.memoizedState,i=t.getDerivedStateFromProps,typeof i=="function"&&(lo(e,t,i,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&Ll.enqueueReplaceState(l,l.state,null),hl(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function _n(e,t){try{var n="",r=t;do n+=Qd(r),r=r.return;while(r);var l=n}catch(i){l=`
Error generating stack: `+i.message+`
`+i.stack}return{value:e,source:t,stack:l,digest:null}}function Ei(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function oo(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var yp=typeof WeakMap=="function"?WeakMap:Map;function wc(e,t,n){n=nt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){kl||(kl=!0,vo=r),oo(e,t)},n}function _c(e,t,n){n=nt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){oo(e,t)}}var i=e.stateNode;return i!==null&&typeof i.componentDidCatch=="function"&&(n.callback=function(){oo(e,t),typeof r!="function"&&(St===null?St=new Set([this]):St.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function Is(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new yp;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Lp.bind(null,e,t,n),t.then(e,e))}function Ls(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Os(e,t,n,r,l){return e.mode&1?(e.flags|=65536,e.lanes=l,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=nt(-1,1),t.tag=2,kt(n,t,1))),n.lanes|=1),e)}var wp=ut.ReactCurrentOwner,me=!1;function ce(e,t,n,r){t.child=e===null?Ga(t,null,n,r):yn(t,e.child,n,r)}function Ms(e,t,n,r,l){n=n.render;var i=t.ref;return pn(t,l),r=Go(e,t,n,r,i,l),n=Xo(),e!==null&&!me?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,ot(e,t,l)):(A&&n&&Ao(t),t.flags|=1,ce(e,t,r,l),t.child)}function Ds(e,t,n,r,l){if(e===null){var i=n.type;return typeof i=="function"&&!ou(i)&&i.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=i,kc(e,t,i,r,l)):(e=el(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!(e.lanes&l)){var o=i.memoizedProps;if(n=n.compare,n=n!==null?n:rr,n(o,r)&&e.ref===t.ref)return ot(e,t,l)}return t.flags|=1,e=Et(i,r),e.ref=t.ref,e.return=t,t.child=e}function kc(e,t,n,r,l){if(e!==null){var i=e.memoizedProps;if(rr(i,r)&&e.ref===t.ref)if(me=!1,t.pendingProps=r=i,(e.lanes&l)!==0)e.flags&131072&&(me=!0);else return t.lanes=e.lanes,ot(e,t,l)}return uo(e,t,n,r,l)}function Sc(e,t,n){var r=t.pendingProps,l=r.children,i=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},L(sn,ye),ye|=n;else{if(!(n&1073741824))return e=i!==null?i.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,L(sn,ye),ye|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=i!==null?i.baseLanes:n,L(sn,ye),ye|=r}else i!==null?(r=i.baseLanes|n,t.memoizedState=null):r=n,L(sn,ye),ye|=r;return ce(e,t,l,n),t.child}function xc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function uo(e,t,n,r,l){var i=he(n)?jt:ue.current;return i=hn(t,i),pn(t,l),n=Go(e,t,n,r,i,l),r=Xo(),e!==null&&!me?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,ot(e,t,l)):(A&&r&&Ao(t),t.flags|=1,ce(e,t,n,l),t.child)}function Fs(e,t,n,r,l){if(he(n)){var i=!0;dl(t)}else i=!1;if(pn(t,l),t.stateNode===null)qr(e,t),yc(t,n,r),io(t,n,r,l),r=!0;else if(e===null){var o=t.stateNode,u=t.memoizedProps;o.props=u;var s=o.context,a=n.contextType;typeof a=="object"&&a!==null?a=ze(a):(a=he(n)?jt:ue.current,a=hn(t,a));var f=n.getDerivedStateFromProps,m=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function";m||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(u!==r||s!==a)&&zs(t,o,r,a),ft=!1;var g=t.memoizedState;o.state=g,hl(t,r,o,l),s=t.memoizedState,u!==r||g!==s||ge.current||ft?(typeof f=="function"&&(lo(t,n,f,r),s=t.memoizedState),(u=ft||Rs(t,n,u,r,g,s,a))?(m||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=s),o.props=r,o.state=s,o.context=a,r=u):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,qa(e,t),u=t.memoizedProps,a=t.type===t.elementType?u:De(t.type,u),o.props=a,m=t.pendingProps,g=o.context,s=n.contextType,typeof s=="object"&&s!==null?s=ze(s):(s=he(n)?jt:ue.current,s=hn(t,s));var y=n.getDerivedStateFromProps;(f=typeof y=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(u!==m||g!==s)&&zs(t,o,r,s),ft=!1,g=t.memoizedState,o.state=g,hl(t,r,o,l);var w=t.memoizedState;u!==m||g!==w||ge.current||ft?(typeof y=="function"&&(lo(t,n,y,r),w=t.memoizedState),(a=ft||Rs(t,n,a,r,g,w,s)||!1)?(f||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,w,s),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,w,s)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=w),o.props=r,o.state=w,o.context=s,r=a):(typeof o.componentDidUpdate!="function"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),r=!1)}return so(e,t,n,r,i,l)}function so(e,t,n,r,l,i){xc(e,t);var o=(t.flags&128)!==0;if(!r&&!o)return l&&ks(t,n,!1),ot(e,t,i);r=t.stateNode,wp.current=t;var u=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&o?(t.child=yn(t,e.child,null,i),t.child=yn(t,null,u,i)):ce(e,t,u,i),t.memoizedState=r.state,l&&ks(t,n,!0),t.child}function Ec(e){var t=e.stateNode;t.pendingContext?_s(e,t.pendingContext,t.pendingContext!==t.context):t.context&&_s(e,t.context,!1),Ho(e,t.containerInfo)}function As(e,t,n,r,l){return vn(),jo(l),t.flags|=256,ce(e,t,n,r),t.child}var ao={dehydrated:null,treeContext:null,retryLane:0};function co(e){return{baseLanes:e,cachePool:null,transitions:null}}function Cc(e,t,n){var r=t.pendingProps,l=j.current,i=!1,o=(t.flags&128)!==0,u;if((u=o)||(u=e!==null&&e.memoizedState===null?!1:(l&2)!==0),u?(i=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),L(j,l&1),e===null)return no(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=r.children,e=r.fallback,i?(r=t.mode,i=t.child,o={mode:"hidden",children:o},!(r&1)&&i!==null?(i.childLanes=0,i.pendingProps=o):i=Dl(o,r,0,null),e=bt(e,r,n,null),i.return=t,e.return=t,i.sibling=e,t.child=i,t.child.memoizedState=co(n),t.memoizedState=ao,e):Jo(t,o));if(l=e.memoizedState,l!==null&&(u=l.dehydrated,u!==null))return _p(e,t,o,r,u,l,n);if(i){i=r.fallback,o=t.mode,l=e.child,u=l.sibling;var s={mode:"hidden",children:r.children};return!(o&1)&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=s,t.deletions=null):(r=Et(l,s),r.subtreeFlags=l.subtreeFlags&14680064),u!==null?i=Et(u,i):(i=bt(i,o,n,null),i.flags|=2),i.return=t,r.return=t,r.sibling=i,t.child=r,r=i,i=t.child,o=e.child.memoizedState,o=o===null?co(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},i.memoizedState=o,i.childLanes=e.childLanes&~n,t.memoizedState=ao,r}return i=e.child,e=i.sibling,r=Et(i,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Jo(e,t){return t=Dl({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Vr(e,t,n,r){return r!==null&&jo(r),yn(t,e.child,null,n),e=Jo(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function _p(e,t,n,r,l,i,o){if(n)return t.flags&256?(t.flags&=-257,r=Ei(Error(v(422))),Vr(e,t,o,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(i=r.fallback,l=t.mode,r=Dl({mode:"visible",children:r.children},l,0,null),i=bt(i,l,o,null),i.flags|=2,r.return=t,i.return=t,r.sibling=i,t.child=r,t.mode&1&&yn(t,e.child,null,o),t.child.memoizedState=co(o),t.memoizedState=ao,i);if(!(t.mode&1))return Vr(e,t,o,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var u=r.dgst;return r=u,i=Error(v(419)),r=Ei(i,r,void 0),Vr(e,t,o,r)}if(u=(o&e.childLanes)!==0,me||u){if(r=q,r!==null){switch(o&-o){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=l&(r.suspendedLanes|o)?0:l,l!==0&&l!==i.retryLane&&(i.retryLane=l,it(e,l),je(r,e,l,-1))}return iu(),r=Ei(Error(v(421))),Vr(e,t,o,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Op.bind(null,e),l._reactRetry=t,null):(e=i.treeContext,we=_t(l.nextSibling),_e=t,A=!0,Ae=null,e!==null&&(Pe[Ne++]=et,Pe[Ne++]=tt,Pe[Ne++]=Bt,et=e.id,tt=e.overflow,Bt=t),t=Jo(t,r.children),t.flags|=4096,t)}function bs(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ro(e.return,t,n)}function Ci(e,t,n,r,l){var i=e.memoizedState;i===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(i.isBackwards=t,i.rendering=null,i.renderingStartTime=0,i.last=r,i.tail=n,i.tailMode=l)}function Pc(e,t,n){var r=t.pendingProps,l=r.revealOrder,i=r.tail;if(ce(e,t,r.children,n),r=j.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&bs(e,n,t);else if(e.tag===19)bs(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(L(j,r),!(t.mode&1))t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&vl(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Ci(t,!1,l,n,i);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&vl(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Ci(t,!0,n,null,i);break;case"together":Ci(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function qr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function ot(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Vt|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(v(153));if(t.child!==null){for(e=t.child,n=Et(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Et(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function kp(e,t,n){switch(t.tag){case 3:Ec(t),vn();break;case 5:Za(t);break;case 1:he(t.type)&&dl(t);break;case 4:Ho(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;L(ml,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(L(j,j.current&1),t.flags|=128,null):n&t.child.childLanes?Cc(e,t,n):(L(j,j.current&1),e=ot(e,t,n),e!==null?e.sibling:null);L(j,j.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return Pc(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),L(j,j.current),r)break;return null;case 22:case 23:return t.lanes=0,Sc(e,t,n)}return ot(e,t,n)}var Nc,fo,Tc,Rc;Nc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};fo=function(){};Tc=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,Ft(Ge.current);var i=null;switch(n){case"input":l=Oi(e,l),r=Oi(e,r),i=[];break;case"select":l=U({},l,{value:void 0}),r=U({},r,{value:void 0}),i=[];break;case"textarea":l=Fi(e,l),r=Fi(e,r),i=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=al)}bi(n,r);var o;n=null;for(a in l)if(!r.hasOwnProperty(a)&&l.hasOwnProperty(a)&&l[a]!=null)if(a==="style"){var u=l[a];for(o in u)u.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else a!=="dangerouslySetInnerHTML"&&a!=="children"&&a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(Xn.hasOwnProperty(a)?i||(i=[]):(i=i||[]).push(a,null));for(a in r){var s=r[a];if(u=l!=null?l[a]:void 0,r.hasOwnProperty(a)&&s!==u&&(s!=null||u!=null))if(a==="style")if(u){for(o in u)!u.hasOwnProperty(o)||s&&s.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in s)s.hasOwnProperty(o)&&u[o]!==s[o]&&(n||(n={}),n[o]=s[o])}else n||(i||(i=[]),i.push(a,n)),n=s;else a==="dangerouslySetInnerHTML"?(s=s?s.__html:void 0,u=u?u.__html:void 0,s!=null&&u!==s&&(i=i||[]).push(a,s)):a==="children"?typeof s!="string"&&typeof s!="number"||(i=i||[]).push(a,""+s):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&(Xn.hasOwnProperty(a)?(s!=null&&a==="onScroll"&&O("scroll",e),i||u===s||(i=[])):(i=i||[]).push(a,s))}n&&(i=i||[]).push("style",n);var a=i;(t.updateQueue=a)&&(t.flags|=4)}};Rc=function(e,t,n,r){n!==r&&(t.flags|=4)};function Mn(e,t){if(!A)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function ie(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Sp(e,t,n){var r=t.pendingProps;switch(bo(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ie(t),null;case 1:return he(t.type)&&cl(),ie(t),null;case 3:return r=t.stateNode,wn(),M(ge),M(ue),Ko(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Br(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Ae!==null&&(_o(Ae),Ae=null))),fo(e,t),ie(t),null;case 5:Qo(t);var l=Ft(sr.current);if(n=t.type,e!==null&&t.stateNode!=null)Tc(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(v(166));return ie(t),null}if(e=Ft(Ge.current),Br(t)){r=t.stateNode,n=t.type;var i=t.memoizedProps;switch(r[Ke]=t,r[or]=i,e=(t.mode&1)!==0,n){case"dialog":O("cancel",r),O("close",r);break;case"iframe":case"object":case"embed":O("load",r);break;case"video":case"audio":for(l=0;l<Bn.length;l++)O(Bn[l],r);break;case"source":O("error",r);break;case"img":case"image":case"link":O("error",r),O("load",r);break;case"details":O("toggle",r);break;case"input":Qu(r,i),O("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!i.multiple},O("invalid",r);break;case"textarea":Yu(r,i),O("invalid",r)}bi(n,i),l=null;for(var o in i)if(i.hasOwnProperty(o)){var u=i[o];o==="children"?typeof u=="string"?r.textContent!==u&&(i.suppressHydrationWarning!==!0&&jr(r.textContent,u,e),l=["children",u]):typeof u=="number"&&r.textContent!==""+u&&(i.suppressHydrationWarning!==!0&&jr(r.textContent,u,e),l=["children",""+u]):Xn.hasOwnProperty(o)&&u!=null&&o==="onScroll"&&O("scroll",r)}switch(n){case"input":Nr(r),Ku(r,i,!0);break;case"textarea":Nr(r),Gu(r);break;case"select":case"option":break;default:typeof i.onClick=="function"&&(r.onclick=al)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{o=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=ra(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(n,{is:r.is}):(e=o.createElement(n),n==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,n),e[Ke]=t,e[or]=r,Nc(e,t,!1,!1),t.stateNode=e;e:{switch(o=ji(n,r),n){case"dialog":O("cancel",e),O("close",e),l=r;break;case"iframe":case"object":case"embed":O("load",e),l=r;break;case"video":case"audio":for(l=0;l<Bn.length;l++)O(Bn[l],e);l=r;break;case"source":O("error",e),l=r;break;case"img":case"image":case"link":O("error",e),O("load",e),l=r;break;case"details":O("toggle",e),l=r;break;case"input":Qu(e,r),l=Oi(e,r),O("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=U({},r,{value:void 0}),O("invalid",e);break;case"textarea":Yu(e,r),l=Fi(e,r),O("invalid",e);break;default:l=r}bi(n,l),u=l;for(i in u)if(u.hasOwnProperty(i)){var s=u[i];i==="style"?oa(e,s):i==="dangerouslySetInnerHTML"?(s=s?s.__html:void 0,s!=null&&la(e,s)):i==="children"?typeof s=="string"?(n!=="textarea"||s!=="")&&qn(e,s):typeof s=="number"&&qn(e,""+s):i!=="suppressContentEditableWarning"&&i!=="suppressHydrationWarning"&&i!=="autoFocus"&&(Xn.hasOwnProperty(i)?s!=null&&i==="onScroll"&&O("scroll",e):s!=null&&xo(e,i,s,o))}switch(n){case"input":Nr(e),Ku(e,r,!1);break;case"textarea":Nr(e),Gu(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Ct(r.value));break;case"select":e.multiple=!!r.multiple,i=r.value,i!=null?an(e,!!r.multiple,i,!1):r.defaultValue!=null&&an(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=al)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return ie(t),null;case 6:if(e&&t.stateNode!=null)Rc(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(v(166));if(n=Ft(sr.current),Ft(Ge.current),Br(t)){if(r=t.stateNode,n=t.memoizedProps,r[Ke]=t,(i=r.nodeValue!==n)&&(e=_e,e!==null))switch(e.tag){case 3:jr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&jr(r.nodeValue,n,(e.mode&1)!==0)}i&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Ke]=t,t.stateNode=r}return ie(t),null;case 13:if(M(j),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(A&&we!==null&&t.mode&1&&!(t.flags&128))Ka(),vn(),t.flags|=98560,i=!1;else if(i=Br(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(v(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(v(317));i[Ke]=t}else vn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;ie(t),i=!1}else Ae!==null&&(_o(Ae),Ae=null),i=!0;if(!i)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||j.current&1?Y===0&&(Y=3):iu())),t.updateQueue!==null&&(t.flags|=4),ie(t),null);case 4:return wn(),fo(e,t),e===null&&lr(t.stateNode.containerInfo),ie(t),null;case 10:return Vo(t.type._context),ie(t),null;case 17:return he(t.type)&&cl(),ie(t),null;case 19:if(M(j),i=t.memoizedState,i===null)return ie(t),null;if(r=(t.flags&128)!==0,o=i.rendering,o===null)if(r)Mn(i,!1);else{if(Y!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=vl(e),o!==null){for(t.flags|=128,Mn(i,!1),r=o.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)i=n,e=r,i.flags&=14680066,o=i.alternate,o===null?(i.childLanes=0,i.lanes=e,i.child=null,i.subtreeFlags=0,i.memoizedProps=null,i.memoizedState=null,i.updateQueue=null,i.dependencies=null,i.stateNode=null):(i.childLanes=o.childLanes,i.lanes=o.lanes,i.child=o.child,i.subtreeFlags=0,i.deletions=null,i.memoizedProps=o.memoizedProps,i.memoizedState=o.memoizedState,i.updateQueue=o.updateQueue,i.type=o.type,e=o.dependencies,i.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return L(j,j.current&1|2),t.child}e=e.sibling}i.tail!==null&&$()>kn&&(t.flags|=128,r=!0,Mn(i,!1),t.lanes=4194304)}else{if(!r)if(e=vl(o),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Mn(i,!0),i.tail===null&&i.tailMode==="hidden"&&!o.alternate&&!A)return ie(t),null}else 2*$()-i.renderingStartTime>kn&&n!==1073741824&&(t.flags|=128,r=!0,Mn(i,!1),t.lanes=4194304);i.isBackwards?(o.sibling=t.child,t.child=o):(n=i.last,n!==null?n.sibling=o:t.child=o,i.last=o)}return i.tail!==null?(t=i.tail,i.rendering=t,i.tail=t.sibling,i.renderingStartTime=$(),t.sibling=null,n=j.current,L(j,r?n&1|2:n&1),t):(ie(t),null);case 22:case 23:return lu(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?ye&1073741824&&(ie(t),t.subtreeFlags&6&&(t.flags|=8192)):ie(t),null;case 24:return null;case 25:return null}throw Error(v(156,t.tag))}function xp(e,t){switch(bo(t),t.tag){case 1:return he(t.type)&&cl(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return wn(),M(ge),M(ue),Ko(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return Qo(t),null;case 13:if(M(j),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(v(340));vn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return M(j),null;case 4:return wn(),null;case 10:return Vo(t.type._context),null;case 22:case 23:return lu(),null;case 24:return null;default:return null}}var $r=!1,oe=!1,Ep=typeof WeakSet=="function"?WeakSet:Set,k=null;function un(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){V(e,t,r)}else n.current=null}function po(e,t,n){try{n()}catch(r){V(e,t,r)}}var js=!1;function Cp(e,t){if(Gi=ol,e=Ma(),Fo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,i=r.focusNode;r=r.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var o=0,u=-1,s=-1,a=0,f=0,m=e,g=null;t:for(;;){for(var y;m!==n||l!==0&&m.nodeType!==3||(u=o+l),m!==i||r!==0&&m.nodeType!==3||(s=o+r),m.nodeType===3&&(o+=m.nodeValue.length),(y=m.firstChild)!==null;)g=m,m=y;for(;;){if(m===e)break t;if(g===n&&++a===l&&(u=o),g===i&&++f===r&&(s=o),(y=m.nextSibling)!==null)break;m=g,g=m.parentNode}m=y}n=u===-1||s===-1?null:{start:u,end:s}}else n=null}n=n||{start:0,end:0}}else n=null;for(Xi={focusedElem:e,selectionRange:n},ol=!1,k=t;k!==null;)if(t=k,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,k=e;else for(;k!==null;){t=k;try{var w=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(w!==null){var _=w.memoizedProps,b=w.memoizedState,d=t.stateNode,c=d.getSnapshotBeforeUpdate(t.elementType===t.type?_:De(t.type,_),b);d.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var p=t.stateNode.containerInfo;p.nodeType===1?p.textContent="":p.nodeType===9&&p.documentElement&&p.removeChild(p.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(v(163))}}catch(h){V(t,t.return,h)}if(e=t.sibling,e!==null){e.return=t.return,k=e;break}k=t.return}return w=js,js=!1,w}function Kn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var i=l.destroy;l.destroy=void 0,i!==void 0&&po(t,n,i)}l=l.next}while(l!==r)}}function Ol(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function mo(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function zc(e){var t=e.alternate;t!==null&&(e.alternate=null,zc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ke],delete t[or],delete t[Ji],delete t[up],delete t[sp])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Ic(e){return e.tag===5||e.tag===3||e.tag===4}function Bs(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Ic(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function go(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=al));else if(r!==4&&(e=e.child,e!==null))for(go(e,t,n),e=e.sibling;e!==null;)go(e,t,n),e=e.sibling}function ho(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(ho(e,t,n),e=e.sibling;e!==null;)ho(e,t,n),e=e.sibling}var J=null,Fe=!1;function ct(e,t,n){for(n=n.child;n!==null;)Lc(e,t,n),n=n.sibling}function Lc(e,t,n){if(Ye&&typeof Ye.onCommitFiberUnmount=="function")try{Ye.onCommitFiberUnmount(Cl,n)}catch{}switch(n.tag){case 5:oe||un(n,t);case 6:var r=J,l=Fe;J=null,ct(e,t,n),J=r,Fe=l,J!==null&&(Fe?(e=J,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):J.removeChild(n.stateNode));break;case 18:J!==null&&(Fe?(e=J,n=n.stateNode,e.nodeType===8?yi(e.parentNode,n):e.nodeType===1&&yi(e,n),tr(e)):yi(J,n.stateNode));break;case 4:r=J,l=Fe,J=n.stateNode.containerInfo,Fe=!0,ct(e,t,n),J=r,Fe=l;break;case 0:case 11:case 14:case 15:if(!oe&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var i=l,o=i.destroy;i=i.tag,o!==void 0&&(i&2||i&4)&&po(n,t,o),l=l.next}while(l!==r)}ct(e,t,n);break;case 1:if(!oe&&(un(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(u){V(n,t,u)}ct(e,t,n);break;case 21:ct(e,t,n);break;case 22:n.mode&1?(oe=(r=oe)||n.memoizedState!==null,ct(e,t,n),oe=r):ct(e,t,n);break;default:ct(e,t,n)}}function Us(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Ep),t.forEach(function(r){var l=Mp.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Me(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var i=e,o=t,u=o;e:for(;u!==null;){switch(u.tag){case 5:J=u.stateNode,Fe=!1;break e;case 3:J=u.stateNode.containerInfo,Fe=!0;break e;case 4:J=u.stateNode.containerInfo,Fe=!0;break e}u=u.return}if(J===null)throw Error(v(160));Lc(i,o,l),J=null,Fe=!1;var s=l.alternate;s!==null&&(s.return=null),l.return=null}catch(a){V(l,t,a)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Oc(t,e),t=t.sibling}function Oc(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Me(t,e),He(e),r&4){try{Kn(3,e,e.return),Ol(3,e)}catch(_){V(e,e.return,_)}try{Kn(5,e,e.return)}catch(_){V(e,e.return,_)}}break;case 1:Me(t,e),He(e),r&512&&n!==null&&un(n,n.return);break;case 5:if(Me(t,e),He(e),r&512&&n!==null&&un(n,n.return),e.flags&32){var l=e.stateNode;try{qn(l,"")}catch(_){V(e,e.return,_)}}if(r&4&&(l=e.stateNode,l!=null)){var i=e.memoizedProps,o=n!==null?n.memoizedProps:i,u=e.type,s=e.updateQueue;if(e.updateQueue=null,s!==null)try{u==="input"&&i.type==="radio"&&i.name!=null&&ta(l,i),ji(u,o);var a=ji(u,i);for(o=0;o<s.length;o+=2){var f=s[o],m=s[o+1];f==="style"?oa(l,m):f==="dangerouslySetInnerHTML"?la(l,m):f==="children"?qn(l,m):xo(l,f,m,a)}switch(u){case"input":Mi(l,i);break;case"textarea":na(l,i);break;case"select":var g=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!i.multiple;var y=i.value;y!=null?an(l,!!i.multiple,y,!1):g!==!!i.multiple&&(i.defaultValue!=null?an(l,!!i.multiple,i.defaultValue,!0):an(l,!!i.multiple,i.multiple?[]:"",!1))}l[or]=i}catch(_){V(e,e.return,_)}}break;case 6:if(Me(t,e),He(e),r&4){if(e.stateNode===null)throw Error(v(162));l=e.stateNode,i=e.memoizedProps;try{l.nodeValue=i}catch(_){V(e,e.return,_)}}break;case 3:if(Me(t,e),He(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{tr(t.containerInfo)}catch(_){V(e,e.return,_)}break;case 4:Me(t,e),He(e);break;case 13:Me(t,e),He(e),l=e.child,l.flags&8192&&(i=l.memoizedState!==null,l.stateNode.isHidden=i,!i||l.alternate!==null&&l.alternate.memoizedState!==null||(nu=$())),r&4&&Us(e);break;case 22:if(f=n!==null&&n.memoizedState!==null,e.mode&1?(oe=(a=oe)||f,Me(t,e),oe=a):Me(t,e),He(e),r&8192){if(a=e.memoizedState!==null,(e.stateNode.isHidden=a)&&!f&&e.mode&1)for(k=e,f=e.child;f!==null;){for(m=k=f;k!==null;){switch(g=k,y=g.child,g.tag){case 0:case 11:case 14:case 15:Kn(4,g,g.return);break;case 1:un(g,g.return);var w=g.stateNode;if(typeof w.componentWillUnmount=="function"){r=g,n=g.return;try{t=r,w.props=t.memoizedProps,w.state=t.memoizedState,w.componentWillUnmount()}catch(_){V(r,n,_)}}break;case 5:un(g,g.return);break;case 22:if(g.memoizedState!==null){$s(m);continue}}y!==null?(y.return=g,k=y):$s(m)}f=f.sibling}e:for(f=null,m=e;;){if(m.tag===5){if(f===null){f=m;try{l=m.stateNode,a?(i=l.style,typeof i.setProperty=="function"?i.setProperty("display","none","important"):i.display="none"):(u=m.stateNode,s=m.memoizedProps.style,o=s!=null&&s.hasOwnProperty("display")?s.display:null,u.style.display=ia("display",o))}catch(_){V(e,e.return,_)}}}else if(m.tag===6){if(f===null)try{m.stateNode.nodeValue=a?"":m.memoizedProps}catch(_){V(e,e.return,_)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===e)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===e)break e;for(;m.sibling===null;){if(m.return===null||m.return===e)break e;f===m&&(f=null),m=m.return}f===m&&(f=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Me(t,e),He(e),r&4&&Us(e);break;case 21:break;default:Me(t,e),He(e)}}function He(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Ic(n)){var r=n;break e}n=n.return}throw Error(v(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(qn(l,""),r.flags&=-33);var i=Bs(e);ho(e,i,l);break;case 3:case 4:var o=r.stateNode.containerInfo,u=Bs(e);go(e,u,o);break;default:throw Error(v(161))}}catch(s){V(e,e.return,s)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Pp(e,t,n){k=e,Mc(e,t,n)}function Mc(e,t,n){for(var r=(e.mode&1)!==0;k!==null;){var l=k,i=l.child;if(l.tag===22&&r){var o=l.memoizedState!==null||$r;if(!o){var u=l.alternate,s=u!==null&&u.memoizedState!==null||oe;u=$r;var a=oe;if($r=o,(oe=s)&&!a)for(k=l;k!==null;)o=k,s=o.child,o.tag===22&&o.memoizedState!==null?Ws(l):s!==null?(s.return=o,k=s):Ws(l);for(;i!==null;)k=i,Mc(i,t,n),i=i.sibling;k=l,$r=u,oe=a}Vs(e,t,n)}else l.subtreeFlags&8772&&i!==null?(i.return=l,k=i):Vs(e,t,n)}}function Vs(e){for(;k!==null;){var t=k;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:oe||Ol(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!oe)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:De(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var i=t.updateQueue;i!==null&&Ps(t,i,r);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Ps(t,o,n)}break;case 5:var u=t.stateNode;if(n===null&&t.flags&4){n=u;var s=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":s.autoFocus&&n.focus();break;case"img":s.src&&(n.src=s.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var a=t.alternate;if(a!==null){var f=a.memoizedState;if(f!==null){var m=f.dehydrated;m!==null&&tr(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(v(163))}oe||t.flags&512&&mo(t)}catch(g){V(t,t.return,g)}}if(t===e){k=null;break}if(n=t.sibling,n!==null){n.return=t.return,k=n;break}k=t.return}}function $s(e){for(;k!==null;){var t=k;if(t===e){k=null;break}var n=t.sibling;if(n!==null){n.return=t.return,k=n;break}k=t.return}}function Ws(e){for(;k!==null;){var t=k;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ol(4,t)}catch(s){V(t,n,s)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(s){V(t,l,s)}}var i=t.return;try{mo(t)}catch(s){V(t,i,s)}break;case 5:var o=t.return;try{mo(t)}catch(s){V(t,o,s)}}}catch(s){V(t,t.return,s)}if(t===e){k=null;break}var u=t.sibling;if(u!==null){u.return=t.return,k=u;break}k=t.return}}var Np=Math.ceil,_l=ut.ReactCurrentDispatcher,eu=ut.ReactCurrentOwner,Re=ut.ReactCurrentBatchConfig,T=0,q=null,Q=null,ee=0,ye=0,sn=Tt(0),Y=0,fr=null,Vt=0,Ml=0,tu=0,Yn=null,pe=null,nu=0,kn=1/0,Ze=null,kl=!1,vo=null,St=null,Wr=!1,ht=null,Sl=0,Gn=0,yo=null,Zr=-1,Jr=0;function de(){return T&6?$():Zr!==-1?Zr:Zr=$()}function xt(e){return e.mode&1?T&2&&ee!==0?ee&-ee:cp.transition!==null?(Jr===0&&(Jr=ya()),Jr):(e=z,e!==0||(e=window.event,e=e===void 0?16:Ca(e.type)),e):1}function je(e,t,n,r){if(50<Gn)throw Gn=0,yo=null,Error(v(185));pr(e,n,r),(!(T&2)||e!==q)&&(e===q&&(!(T&2)&&(Ml|=n),Y===4&&mt(e,ee)),ve(e,r),n===1&&T===0&&!(t.mode&1)&&(kn=$()+500,zl&&Rt()))}function ve(e,t){var n=e.callbackNode;ff(e,t);var r=il(e,e===q?ee:0);if(r===0)n!==null&&Zu(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Zu(n),t===1)e.tag===0?ap(Hs.bind(null,e)):Wa(Hs.bind(null,e)),ip(function(){!(T&6)&&Rt()}),n=null;else{switch(wa(r)){case 1:n=To;break;case 4:n=ha;break;case 16:n=ll;break;case 536870912:n=va;break;default:n=ll}n=Vc(n,Dc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Dc(e,t){if(Zr=-1,Jr=0,T&6)throw Error(v(327));var n=e.callbackNode;if(mn()&&e.callbackNode!==n)return null;var r=il(e,e===q?ee:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=xl(e,r);else{t=r;var l=T;T|=2;var i=Ac();(q!==e||ee!==t)&&(Ze=null,kn=$()+500,At(e,t));do try{zp();break}catch(u){Fc(e,u)}while(!0);Uo(),_l.current=i,T=l,Q!==null?t=0:(q=null,ee=0,t=Y)}if(t!==0){if(t===2&&(l=Wi(e),l!==0&&(r=l,t=wo(e,l))),t===1)throw n=fr,At(e,0),mt(e,r),ve(e,$()),n;if(t===6)mt(e,r);else{if(l=e.current.alternate,!(r&30)&&!Tp(l)&&(t=xl(e,r),t===2&&(i=Wi(e),i!==0&&(r=i,t=wo(e,i))),t===1))throw n=fr,At(e,0),mt(e,r),ve(e,$()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(v(345));case 2:Ot(e,pe,Ze);break;case 3:if(mt(e,r),(r&130023424)===r&&(t=nu+500-$(),10<t)){if(il(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){de(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=Zi(Ot.bind(null,e,pe,Ze),t);break}Ot(e,pe,Ze);break;case 4:if(mt(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var o=31-be(r);i=1<<o,o=t[o],o>l&&(l=o),r&=~i}if(r=l,r=$()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Np(r/1960))-r,10<r){e.timeoutHandle=Zi(Ot.bind(null,e,pe,Ze),r);break}Ot(e,pe,Ze);break;case 5:Ot(e,pe,Ze);break;default:throw Error(v(329))}}}return ve(e,$()),e.callbackNode===n?Dc.bind(null,e):null}function wo(e,t){var n=Yn;return e.current.memoizedState.isDehydrated&&(At(e,t).flags|=256),e=xl(e,t),e!==2&&(t=pe,pe=n,t!==null&&_o(t)),e}function _o(e){pe===null?pe=e:pe.push.apply(pe,e)}function Tp(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],i=l.getSnapshot;l=l.value;try{if(!Be(i(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function mt(e,t){for(t&=~tu,t&=~Ml,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-be(t),r=1<<n;e[n]=-1,t&=~r}}function Hs(e){if(T&6)throw Error(v(327));mn();var t=il(e,0);if(!(t&1))return ve(e,$()),null;var n=xl(e,t);if(e.tag!==0&&n===2){var r=Wi(e);r!==0&&(t=r,n=wo(e,r))}if(n===1)throw n=fr,At(e,0),mt(e,t),ve(e,$()),n;if(n===6)throw Error(v(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Ot(e,pe,Ze),ve(e,$()),null}function ru(e,t){var n=T;T|=1;try{return e(t)}finally{T=n,T===0&&(kn=$()+500,zl&&Rt())}}function $t(e){ht!==null&&ht.tag===0&&!(T&6)&&mn();var t=T;T|=1;var n=Re.transition,r=z;try{if(Re.transition=null,z=1,e)return e()}finally{z=r,Re.transition=n,T=t,!(T&6)&&Rt()}}function lu(){ye=sn.current,M(sn)}function At(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,lp(n)),Q!==null)for(n=Q.return;n!==null;){var r=n;switch(bo(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&cl();break;case 3:wn(),M(ge),M(ue),Ko();break;case 5:Qo(r);break;case 4:wn();break;case 13:M(j);break;case 19:M(j);break;case 10:Vo(r.type._context);break;case 22:case 23:lu()}n=n.return}if(q=e,Q=e=Et(e.current,null),ee=ye=t,Y=0,fr=null,tu=Ml=Vt=0,pe=Yn=null,Dt!==null){for(t=0;t<Dt.length;t++)if(n=Dt[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,i=n.pending;if(i!==null){var o=i.next;i.next=l,r.next=o}n.pending=r}Dt=null}return e}function Fc(e,t){do{var n=Q;try{if(Uo(),Gr.current=wl,yl){for(var r=B.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}yl=!1}if(Ut=0,X=K=B=null,Qn=!1,ar=0,eu.current=null,n===null||n.return===null){Y=1,fr=t,Q=null;break}e:{var i=e,o=n.return,u=n,s=t;if(t=ee,u.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){var a=s,f=u,m=f.tag;if(!(f.mode&1)&&(m===0||m===11||m===15)){var g=f.alternate;g?(f.updateQueue=g.updateQueue,f.memoizedState=g.memoizedState,f.lanes=g.lanes):(f.updateQueue=null,f.memoizedState=null)}var y=Ls(o);if(y!==null){y.flags&=-257,Os(y,o,u,i,t),y.mode&1&&Is(i,a,t),t=y,s=a;var w=t.updateQueue;if(w===null){var _=new Set;_.add(s),t.updateQueue=_}else w.add(s);break e}else{if(!(t&1)){Is(i,a,t),iu();break e}s=Error(v(426))}}else if(A&&u.mode&1){var b=Ls(o);if(b!==null){!(b.flags&65536)&&(b.flags|=256),Os(b,o,u,i,t),jo(_n(s,u));break e}}i=s=_n(s,u),Y!==4&&(Y=2),Yn===null?Yn=[i]:Yn.push(i),i=o;do{switch(i.tag){case 3:i.flags|=65536,t&=-t,i.lanes|=t;var d=wc(i,s,t);Cs(i,d);break e;case 1:u=s;var c=i.type,p=i.stateNode;if(!(i.flags&128)&&(typeof c.getDerivedStateFromError=="function"||p!==null&&typeof p.componentDidCatch=="function"&&(St===null||!St.has(p)))){i.flags|=65536,t&=-t,i.lanes|=t;var h=_c(i,u,t);Cs(i,h);break e}}i=i.return}while(i!==null)}jc(n)}catch(S){t=S,Q===n&&n!==null&&(Q=n=n.return);continue}break}while(!0)}function Ac(){var e=_l.current;return _l.current=wl,e===null?wl:e}function iu(){(Y===0||Y===3||Y===2)&&(Y=4),q===null||!(Vt&268435455)&&!(Ml&268435455)||mt(q,ee)}function xl(e,t){var n=T;T|=2;var r=Ac();(q!==e||ee!==t)&&(Ze=null,At(e,t));do try{Rp();break}catch(l){Fc(e,l)}while(!0);if(Uo(),T=n,_l.current=r,Q!==null)throw Error(v(261));return q=null,ee=0,Y}function Rp(){for(;Q!==null;)bc(Q)}function zp(){for(;Q!==null&&!nf();)bc(Q)}function bc(e){var t=Uc(e.alternate,e,ye);e.memoizedProps=e.pendingProps,t===null?jc(e):Q=t,eu.current=null}function jc(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=xp(n,t),n!==null){n.flags&=32767,Q=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Y=6,Q=null;return}}else if(n=Sp(n,t,ye),n!==null){Q=n;return}if(t=t.sibling,t!==null){Q=t;return}Q=t=e}while(t!==null);Y===0&&(Y=5)}function Ot(e,t,n){var r=z,l=Re.transition;try{Re.transition=null,z=1,Ip(e,t,n,r)}finally{Re.transition=l,z=r}return null}function Ip(e,t,n,r){do mn();while(ht!==null);if(T&6)throw Error(v(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(v(177));e.callbackNode=null,e.callbackPriority=0;var i=n.lanes|n.childLanes;if(pf(e,i),e===q&&(Q=q=null,ee=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Wr||(Wr=!0,Vc(ll,function(){return mn(),null})),i=(n.flags&15990)!==0,n.subtreeFlags&15990||i){i=Re.transition,Re.transition=null;var o=z;z=1;var u=T;T|=4,eu.current=null,Cp(e,n),Oc(n,e),Jf(Xi),ol=!!Gi,Xi=Gi=null,e.current=n,Pp(n,e,l),rf(),T=u,z=o,Re.transition=i}else e.current=n;if(Wr&&(Wr=!1,ht=e,Sl=l),i=e.pendingLanes,i===0&&(St=null),uf(n.stateNode,r),ve(e,$()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(kl)throw kl=!1,e=vo,vo=null,e;return Sl&1&&e.tag!==0&&mn(),i=e.pendingLanes,i&1?e===yo?Gn++:(Gn=0,yo=e):Gn=0,Rt(),null}function mn(){if(ht!==null){var e=wa(Sl),t=Re.transition,n=z;try{if(Re.transition=null,z=16>e?16:e,ht===null)var r=!1;else{if(e=ht,ht=null,Sl=0,T&6)throw Error(v(331));var l=T;for(T|=4,k=e.current;k!==null;){var i=k,o=i.child;if(k.flags&16){var u=i.deletions;if(u!==null){for(var s=0;s<u.length;s++){var a=u[s];for(k=a;k!==null;){var f=k;switch(f.tag){case 0:case 11:case 15:Kn(8,f,i)}var m=f.child;if(m!==null)m.return=f,k=m;else for(;k!==null;){f=k;var g=f.sibling,y=f.return;if(zc(f),f===a){k=null;break}if(g!==null){g.return=y,k=g;break}k=y}}}var w=i.alternate;if(w!==null){var _=w.child;if(_!==null){w.child=null;do{var b=_.sibling;_.sibling=null,_=b}while(_!==null)}}k=i}}if(i.subtreeFlags&2064&&o!==null)o.return=i,k=o;else e:for(;k!==null;){if(i=k,i.flags&2048)switch(i.tag){case 0:case 11:case 15:Kn(9,i,i.return)}var d=i.sibling;if(d!==null){d.return=i.return,k=d;break e}k=i.return}}var c=e.current;for(k=c;k!==null;){o=k;var p=o.child;if(o.subtreeFlags&2064&&p!==null)p.return=o,k=p;else e:for(o=c;k!==null;){if(u=k,u.flags&2048)try{switch(u.tag){case 0:case 11:case 15:Ol(9,u)}}catch(S){V(u,u.return,S)}if(u===o){k=null;break e}var h=u.sibling;if(h!==null){h.return=u.return,k=h;break e}k=u.return}}if(T=l,Rt(),Ye&&typeof Ye.onPostCommitFiberRoot=="function")try{Ye.onPostCommitFiberRoot(Cl,e)}catch{}r=!0}return r}finally{z=n,Re.transition=t}}return!1}function Qs(e,t,n){t=_n(n,t),t=wc(e,t,1),e=kt(e,t,1),t=de(),e!==null&&(pr(e,1,t),ve(e,t))}function V(e,t,n){if(e.tag===3)Qs(e,e,n);else for(;t!==null;){if(t.tag===3){Qs(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(St===null||!St.has(r))){e=_n(n,e),e=_c(t,e,1),t=kt(t,e,1),e=de(),t!==null&&(pr(t,1,e),ve(t,e));break}}t=t.return}}function Lp(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=de(),e.pingedLanes|=e.suspendedLanes&n,q===e&&(ee&n)===n&&(Y===4||Y===3&&(ee&130023424)===ee&&500>$()-nu?At(e,0):tu|=n),ve(e,t)}function Bc(e,t){t===0&&(e.mode&1?(t=zr,zr<<=1,!(zr&130023424)&&(zr=4194304)):t=1);var n=de();e=it(e,t),e!==null&&(pr(e,t,n),ve(e,n))}function Op(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Bc(e,n)}function Mp(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(v(314))}r!==null&&r.delete(t),Bc(e,n)}var Uc;Uc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ge.current)me=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return me=!1,kp(e,t,n);me=!!(e.flags&131072)}else me=!1,A&&t.flags&1048576&&Ha(t,pl,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;qr(e,t),e=t.pendingProps;var l=hn(t,ue.current);pn(t,n),l=Go(null,t,r,e,l,n);var i=Xo();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,he(r)?(i=!0,dl(t)):i=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,Wo(t),l.updater=Ll,t.stateNode=l,l._reactInternals=t,io(t,r,e,n),t=so(null,t,r,!0,i,n)):(t.tag=0,A&&i&&Ao(t),ce(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(qr(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Fp(r),e=De(r,e),l){case 0:t=uo(null,t,r,e,n);break e;case 1:t=Fs(null,t,r,e,n);break e;case 11:t=Ms(null,t,r,e,n);break e;case 14:t=Ds(null,t,r,De(r.type,e),n);break e}throw Error(v(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:De(r,l),uo(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:De(r,l),Fs(e,t,r,l,n);case 3:e:{if(Ec(t),e===null)throw Error(v(387));r=t.pendingProps,i=t.memoizedState,l=i.element,qa(e,t),hl(t,r,null,n);var o=t.memoizedState;if(r=o.element,i.isDehydrated)if(i={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){l=_n(Error(v(423)),t),t=As(e,t,r,n,l);break e}else if(r!==l){l=_n(Error(v(424)),t),t=As(e,t,r,n,l);break e}else for(we=_t(t.stateNode.containerInfo.firstChild),_e=t,A=!0,Ae=null,n=Ga(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(vn(),r===l){t=ot(e,t,n);break e}ce(e,t,r,n)}t=t.child}return t;case 5:return Za(t),e===null&&no(t),r=t.type,l=t.pendingProps,i=e!==null?e.memoizedProps:null,o=l.children,qi(r,l)?o=null:i!==null&&qi(r,i)&&(t.flags|=32),xc(e,t),ce(e,t,o,n),t.child;case 6:return e===null&&no(t),null;case 13:return Cc(e,t,n);case 4:return Ho(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=yn(t,null,r,n):ce(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:De(r,l),Ms(e,t,r,l,n);case 7:return ce(e,t,t.pendingProps,n),t.child;case 8:return ce(e,t,t.pendingProps.children,n),t.child;case 12:return ce(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,i=t.memoizedProps,o=l.value,L(ml,r._currentValue),r._currentValue=o,i!==null)if(Be(i.value,o)){if(i.children===l.children&&!ge.current){t=ot(e,t,n);break e}}else for(i=t.child,i!==null&&(i.return=t);i!==null;){var u=i.dependencies;if(u!==null){o=i.child;for(var s=u.firstContext;s!==null;){if(s.context===r){if(i.tag===1){s=nt(-1,n&-n),s.tag=2;var a=i.updateQueue;if(a!==null){a=a.shared;var f=a.pending;f===null?s.next=s:(s.next=f.next,f.next=s),a.pending=s}}i.lanes|=n,s=i.alternate,s!==null&&(s.lanes|=n),ro(i.return,n,t),u.lanes|=n;break}s=s.next}}else if(i.tag===10)o=i.type===t.type?null:i.child;else if(i.tag===18){if(o=i.return,o===null)throw Error(v(341));o.lanes|=n,u=o.alternate,u!==null&&(u.lanes|=n),ro(o,n,t),o=i.sibling}else o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===t){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}ce(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,pn(t,n),l=ze(l),r=r(l),t.flags|=1,ce(e,t,r,n),t.child;case 14:return r=t.type,l=De(r,t.pendingProps),l=De(r.type,l),Ds(e,t,r,l,n);case 15:return kc(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:De(r,l),qr(e,t),t.tag=1,he(r)?(e=!0,dl(t)):e=!1,pn(t,n),yc(t,r,l),io(t,r,l,n),so(null,t,r,!0,e,n);case 19:return Pc(e,t,n);case 22:return Sc(e,t,n)}throw Error(v(156,t.tag))};function Vc(e,t){return ga(e,t)}function Dp(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Te(e,t,n,r){return new Dp(e,t,n,r)}function ou(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Fp(e){if(typeof e=="function")return ou(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Co)return 11;if(e===Po)return 14}return 2}function Et(e,t){var n=e.alternate;return n===null?(n=Te(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function el(e,t,n,r,l,i){var o=2;if(r=e,typeof e=="function")ou(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case qt:return bt(n.children,l,i,t);case Eo:o=8,l|=8;break;case Ri:return e=Te(12,n,t,l|2),e.elementType=Ri,e.lanes=i,e;case zi:return e=Te(13,n,t,l),e.elementType=zi,e.lanes=i,e;case Ii:return e=Te(19,n,t,l),e.elementType=Ii,e.lanes=i,e;case Zs:return Dl(n,l,i,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Xs:o=10;break e;case qs:o=9;break e;case Co:o=11;break e;case Po:o=14;break e;case dt:o=16,r=null;break e}throw Error(v(130,e==null?e:typeof e,""))}return t=Te(o,n,t,l),t.elementType=e,t.type=r,t.lanes=i,t}function bt(e,t,n,r){return e=Te(7,e,r,t),e.lanes=n,e}function Dl(e,t,n,r){return e=Te(22,e,r,t),e.elementType=Zs,e.lanes=n,e.stateNode={isHidden:!1},e}function Pi(e,t,n){return e=Te(6,e,null,t),e.lanes=n,e}function Ni(e,t,n){return t=Te(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Ap(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ci(0),this.expirationTimes=ci(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ci(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function uu(e,t,n,r,l,i,o,u,s){return e=new Ap(e,t,n,u,s),t===1?(t=1,i===!0&&(t|=8)):t=0,i=Te(3,null,null,t),e.current=i,i.stateNode=e,i.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Wo(i),e}function bp(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Xt,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function $c(e){if(!e)return Pt;e=e._reactInternals;e:{if(Ht(e)!==e||e.tag!==1)throw Error(v(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(he(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(v(171))}if(e.tag===1){var n=e.type;if(he(n))return $a(e,n,t)}return t}function Wc(e,t,n,r,l,i,o,u,s){return e=uu(n,r,!0,e,l,i,o,u,s),e.context=$c(null),n=e.current,r=de(),l=xt(n),i=nt(r,l),i.callback=t??null,kt(n,i,l),e.current.lanes=l,pr(e,l,r),ve(e,r),e}function Fl(e,t,n,r){var l=t.current,i=de(),o=xt(l);return n=$c(n),t.context===null?t.context=n:t.pendingContext=n,t=nt(i,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=kt(l,t,o),e!==null&&(je(e,l,o,i),Yr(e,l,o)),o}function El(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Ks(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function su(e,t){Ks(e,t),(e=e.alternate)&&Ks(e,t)}function jp(){return null}var Hc=typeof reportError=="function"?reportError:function(e){console.error(e)};function au(e){this._internalRoot=e}Al.prototype.render=au.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(v(409));Fl(e,t,null,null)};Al.prototype.unmount=au.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;$t(function(){Fl(null,e,null,null)}),t[lt]=null}};function Al(e){this._internalRoot=e}Al.prototype.unstable_scheduleHydration=function(e){if(e){var t=Sa();e={blockedOn:null,target:e,priority:t};for(var n=0;n<pt.length&&t!==0&&t<pt[n].priority;n++);pt.splice(n,0,e),n===0&&Ea(e)}};function cu(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function bl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ys(){}function Bp(e,t,n,r,l){if(l){if(typeof r=="function"){var i=r;r=function(){var a=El(o);i.call(a)}}var o=Wc(t,r,e,0,null,!1,!1,"",Ys);return e._reactRootContainer=o,e[lt]=o.current,lr(e.nodeType===8?e.parentNode:e),$t(),o}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var u=r;r=function(){var a=El(s);u.call(a)}}var s=uu(e,0,!1,null,null,!1,!1,"",Ys);return e._reactRootContainer=s,e[lt]=s.current,lr(e.nodeType===8?e.parentNode:e),$t(function(){Fl(t,s,n,r)}),s}function jl(e,t,n,r,l){var i=n._reactRootContainer;if(i){var o=i;if(typeof l=="function"){var u=l;l=function(){var s=El(o);u.call(s)}}Fl(t,o,e,l)}else o=Bp(n,t,e,l,r);return El(o)}_a=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=jn(t.pendingLanes);n!==0&&(Ro(t,n|1),ve(t,$()),!(T&6)&&(kn=$()+500,Rt()))}break;case 13:$t(function(){var r=it(e,1);if(r!==null){var l=de();je(r,e,1,l)}}),su(e,1)}};zo=function(e){if(e.tag===13){var t=it(e,134217728);if(t!==null){var n=de();je(t,e,134217728,n)}su(e,134217728)}};ka=function(e){if(e.tag===13){var t=xt(e),n=it(e,t);if(n!==null){var r=de();je(n,e,t,r)}su(e,t)}};Sa=function(){return z};xa=function(e,t){var n=z;try{return z=e,t()}finally{z=n}};Ui=function(e,t,n){switch(t){case"input":if(Mi(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=Rl(r);if(!l)throw Error(v(90));ea(r),Mi(r,l)}}}break;case"textarea":na(e,n);break;case"select":t=n.value,t!=null&&an(e,!!n.multiple,t,!1)}};aa=ru;ca=$t;var Up={usingClientEntryPoint:!1,Events:[gr,tn,Rl,ua,sa,ru]},Dn={findFiberByHostInstance:Mt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Vp={bundleType:Dn.bundleType,version:Dn.version,rendererPackageName:Dn.rendererPackageName,rendererConfig:Dn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ut.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=pa(e),e===null?null:e.stateNode},findFiberByHostInstance:Dn.findFiberByHostInstance||jp,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Fn=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Fn.isDisabled&&Fn.supportsFiber))try{Cl=Fn.inject(Vp),Ye=Fn}catch{}var Fn;xe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Up;xe.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!cu(t))throw Error(v(200));return bp(e,t,null,n)};xe.createRoot=function(e,t){if(!cu(e))throw Error(v(299));var n=!1,r="",l=Hc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=uu(e,1,!1,null,null,n,!1,r,l),e[lt]=t.current,lr(e.nodeType===8?e.parentNode:e),new au(t)};xe.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(v(188)):(e=Object.keys(e).join(","),Error(v(268,e)));return e=pa(t),e=e===null?null:e.stateNode,e};xe.flushSync=function(e){return $t(e)};xe.hydrate=function(e,t,n){if(!bl(t))throw Error(v(200));return jl(null,e,t,!0,n)};xe.hydrateRoot=function(e,t,n){if(!cu(e))throw Error(v(405));var r=n!=null&&n.hydratedSources||null,l=!1,i="",o=Hc;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=Wc(t,null,e,1,n??null,l,!1,i,o),e[lt]=t.current,lr(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new Al(t)};xe.render=function(e,t,n){if(!bl(t))throw Error(v(200));return jl(null,e,t,!1,n)};xe.unmountComponentAtNode=function(e){if(!bl(e))throw Error(v(40));return e._reactRootContainer?($t(function(){jl(null,null,e,!1,function(){e._reactRootContainer=null,e[lt]=null})}),!0):!1};xe.unstable_batchedUpdates=ru;xe.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!bl(n))throw Error(v(200));if(e==null||e._reactInternals===void 0)throw Error(v(38));return jl(e,t,n,!1,r)};xe.version="18.3.1-next-f1338f8080-20240426"});var Gc=qe((gm,Yc)=>{"use strict";function Kc(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Kc)}catch(e){console.error(e)}}Kc(),Yc.exports=Qc()});var qc=qe(du=>{"use strict";var Xc=Gc();du.createRoot=Xc.createRoot,du.hydrateRoot=Xc.hydrateRoot;var hm});var sd=qe(Ul=>{"use strict";var Gp=$e(),Xp=Symbol.for("react.element"),qp=Symbol.for("react.fragment"),Zp=Object.prototype.hasOwnProperty,Jp=Gp.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,em={key:!0,ref:!0,__self:!0,__source:!0};function ud(e,t,n){var r,l={},i=null,o=null;n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(o=t.ref);for(r in t)Zp.call(t,r)&&!em.hasOwnProperty(r)&&(l[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)l[r]===void 0&&(l[r]=t[r]);return{$$typeof:Xp,type:e,key:i,ref:o,props:l,_owner:Jp.current}}Ul.Fragment=qp;Ul.jsx=ud;Ul.jsxs=ud});var ne=qe((Em,ad)=>{"use strict";ad.exports=sd()});var zt=F($e()),yd=F(qc());var Z=F($e());function Jc(e,t,n){switch(n){case"volume":return $p(e,t);case"bogo":return Wp(e,t);case"fbt":case"mix-match":case"fixed":return Zc(e,t);case"free-gift":return Hp(e,t);default:return Zc(e,t)}}function $p(e,t){let n=t[0];if(!n)return Bl();let r=n.price,l=e.quantity,i=r*l,o,u=0;switch(e.discountType){case"percentage":o=i*(1-e.discountValue/100);break;case"fixed":o=Math.max(0,i-e.discountValue);break;case"fixed_price":o=e.discountValue;break;case"free":u=1,o=r*(l-1);break;default:o=i}o=se(o);let s=se(i-o),a=i>0?Math.round(s/i*100):0,f=se(o/l),m=[],g=n.variantId||"";for(let y=0;y<l;y++)m.push({variantId:g,quantity:1,price:y<l-u?f:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:`${a}%`}});return{originalPrice:i,bundlePrice:o,savingsAmount:s,savingsPercent:a,perUnitPrice:f,freeItemsCount:u,lineItems:m}}function Wp(e,t){let n=t[0];if(!n)return Bl();let r=n.price,l=e.quantity,i=e.discountType==="free"?Math.floor(e.discountValue):0,o=l+i,u=se(r*o),s=se(r*l),a=se(u-s),f=u>0?Math.round(a/u*100):0,m=se(s/o),g=[],y=n.variantId||"";for(let w=0;w<o;w++)g.push({variantId:y,quantity:1,price:w<l?r:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:w>=l?"FREE":""}});return{originalPrice:u,bundlePrice:s,savingsAmount:a,savingsPercent:f,perUnitPrice:m,freeItemsCount:i,lineItems:g}}function Zc(e,t){if(t.length===0)return Bl();let n=se(t.reduce((a,f)=>a+f.price*f.quantity,0)),r;switch(e.discountType){case"percentage":r=n*(1-e.discountValue/100);break;case"fixed":r=Math.max(0,n-e.discountValue);break;case"fixed_price":r=e.discountValue;break;default:r=n}r=se(r);let l=se(n-r),i=n>0?Math.round(l/n*100):0,o=t.reduce((a,f)=>a+f.quantity,0),u=o>0?se(r/o):0,s=t.map(a=>{let f=a.price*a.quantity,m=n>0?f/n:0,g=l*m;return{variantId:a.variantId||"",quantity:a.quantity,price:se(f-g),properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:`${i}%`}}});return{originalPrice:n,bundlePrice:r,savingsAmount:l,savingsPercent:i,perUnitPrice:u,freeItemsCount:0,lineItems:s}}function Hp(e,t){if(t.length===0)return Bl();let n=t.slice(0,-1),r=t[t.length-1],l=se(t.reduce((m,g)=>m+g.price*g.quantity,0)),i=se(n.reduce((m,g)=>m+g.price*g.quantity,0)),o=se(r?r.price*r.quantity:0),u=l>0?Math.round(o/l*100):0,s=t.reduce((m,g)=>m+g.quantity,0),a=s>0?se(i/s):0,f=t.map((m,g)=>({variantId:m.variantId||"",quantity:m.quantity,price:g<t.length-1?m.price*m.quantity:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:g===t.length-1?"FREE GIFT":""}}));return{originalPrice:l,bundlePrice:i,savingsAmount:o,savingsPercent:u,perUnitPrice:a,freeItemsCount:r?r.quantity:0,lineItems:f}}function Bl(){return{originalPrice:0,bundlePrice:0,savingsAmount:0,savingsPercent:0,perUnitPrice:0,freeItemsCount:0,lineItems:[]}}function se(e){return Math.round(e*100)/100}function Qp(e,t="${{amount}}"){let n=e/100,r={amount:n.toFixed(2),amount_no_decimals:Math.round(n).toString(),amount_with_comma_separator:n.toFixed(2).replace(".",",").replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1."),amount_no_decimals_with_comma_separator:Math.round(n).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1."),amount_with_apostrophe_separator:n.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1'"),amount_no_decimals_with_space_separator:Math.round(n).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1 "),amount_with_space_separator:n.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1 ")},l=t;for(let[i,o]of Object.entries(r))l=l.replace(`{{${i}}}`,o),l=l.replace(`{{ ${i} }}`,o);return l}function Ue(e,t="${{amount}}"){return Qp(Math.round(e*100),t)}function ed(e){return e<=0?"":`${Math.round(e)}% OFF`}function td(e,t){return`${Ue(e,t)} each`}function nd(){if(typeof window>"u")return"desktop";let e=window.innerWidth;return e<768?"mobile":e<1024?"tablet":"desktop"}function rd(){if(typeof sessionStorage>"u")return"ssr_"+Math.random().toString(36).substring(2,11);let e="shopi_bundle_session",t=sessionStorage.getItem(e);return t||(t="sb_"+Math.random().toString(36).substring(2,11)+"_"+Date.now(),sessionStorage.setItem(e,t)),t}async function ld(e){let t=await fetch("/cart/add.js",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:e.items})});if(!t.ok){let n=await t.text(),r="Failed to add to cart";try{let l=JSON.parse(n);r=l.description||l.message||r}catch{}throw new Error(r)}return t.json()}function Kp(){document.dispatchEvent(new CustomEvent("cart:updated")),document.dispatchEvent(new CustomEvent("cart:refresh",{bubbles:!0}))}function id(e){switch(Kp(),e){case"redirect":window.location.href="/cart";break;case"drawer":document.dispatchEvent(new CustomEvent("cart:open")),document.dispatchEvent(new CustomEvent("theme:cart:open"));let t=document.querySelector('a[href="/cart"], .cart-icon-bubble, .site-header__cart, [data-cart-toggle]');t&&t.click();break;case"stay":break}}var Ve=F($e());function od(e){let t=(0,Ve.useRef)(rd()),n=(0,Ve.useRef)(!1),r=(0,Ve.useCallback)(f=>{var y;if(!e.analytics.enabled)return;let m=e.analytics.trackingEndpoint||"/apps/proxy/ai/events/track";fetch(m,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shop:((y=window.Shopify)==null?void 0:y.shop)||"",bundleId:f.bundleId,productId:f.productId||"",eventType:Yp(f.eventName),sessionId:f.sessionId,metadata:{bundleType:f.bundleType,tierId:f.tierId,tierLabel:f.tierLabel,discountType:f.discountType,discountValue:f.discountValue,originalPrice:f.originalPrice,bundlePrice:f.bundlePrice,savingsAmount:f.savingsAmount,quantity:f.quantity,experimentId:f.experimentId,experimentVariant:f.experimentVariant,deviceType:f.deviceType}})}).catch(()=>{});let g=window.dataLayer;g&&g.push({event:`shopibundle_${f.eventName}`,bundle_id:f.bundleId,bundle_type:f.bundleType,tier_id:f.tierId,bundle_price:f.bundlePrice,savings_amount:f.savingsAmount})},[e.analytics]),l=(0,Ve.useCallback)((f,m,g)=>({eventName:f,bundleId:e.id,bundleType:e.type,tierId:m==null?void 0:m.id,tierLabel:m==null?void 0:m.label,discountType:m==null?void 0:m.discountType,discountValue:m==null?void 0:m.discountValue,originalPrice:g==null?void 0:g.originalPrice,bundlePrice:g==null?void 0:g.bundlePrice,savingsAmount:g==null?void 0:g.savingsAmount,quantity:m==null?void 0:m.quantity,experimentId:e.analytics.experimentId,experimentVariant:e.analytics.experimentVariant,timestamp:Date.now(),sessionId:t.current,deviceType:nd()}),[e]),i=(0,Ve.useCallback)(()=>{n.current||(n.current=!0,r(l("bundle_viewed")))},[l,r]),o=(0,Ve.useCallback)((f,m)=>{r(l("tier_selected",f,m))},[l,r]),u=(0,Ve.useCallback)((f,m)=>{r(l("add_to_cart_clicked",f,m))},[l,r]),s=(0,Ve.useCallback)((f,m)=>{r(l("add_to_cart_success",f,m))},[l,r]),a=(0,Ve.useCallback)((f,m)=>{let g=l("add_to_cart_failed",f);g.error=m,r(g)},[l,r]);return{trackView:i,trackTierSelect:o,trackAddToCart:u,trackAddToCartSuccess:s,trackAddToCartFailed:a}}function Yp(e){return{bundle_viewed:"impression",tier_selected:"click",variant_changed:"click",add_to_cart_clicked:"add_to_cart",add_to_cart_success:"add_to_cart",add_to_cart_failed:"add_to_cart"}[e]||e}var fu=F($e());var vr=F(ne());function cd({savingsAmount:e,savingsPercent:t,moneyFormat:n,style:r="pill"}){if(e<=0)return null;let l=Ue(e,n),i=ed(t);return(0,vr.jsxs)("span",{className:`sb-savings-badge sb-savings-badge--${r}`,"aria-label":`Save ${l} (${i})`,children:[(0,vr.jsx)("span",{className:"sb-savings-badge__percent",children:i}),(0,vr.jsxs)("span",{className:"sb-savings-badge__amount",children:["Save ",l]})]})}var W=F(ne());function dd({tier:e,selected:t,disabled:n,moneyFormat:r,locale:l,visual:i,pricing:o,onSelect:u}){let s=(0,fu.useCallback)(()=>{n||u(e.id)},[e.id,n,u]),a=(0,fu.useCallback)(y=>{(y.key==="Enter"||y.key===" ")&&!n&&(y.preventDefault(),u(e.id))},[e.id,n,u]),f=o.savingsAmount>0,m=e.badge||(e.isDefault?"Most Popular":""),g=e.badgeColor||(e.isDefault?"#ff6b35":"#4CAF50");return(0,W.jsxs)("div",{role:"radio","aria-checked":t,"aria-label":`${e.label}: ${Ue(o.bundlePrice,r)}${f?`, save ${Ue(o.savingsAmount,r)}`:""}`,tabIndex:0,className:["sb-offer",t&&"sb-offer--selected",n&&"sb-offer--disabled",e.isDefault&&"sb-offer--default",f&&"sb-offer--has-savings"].filter(Boolean).join(" "),onClick:s,onKeyDown:a,style:t&&i.primaryColor?{"--sb-primary":i.primaryColor}:void 0,children:[m&&(0,W.jsx)("div",{className:`sb-offer__badge sb-offer__badge--${i.badgeStyle}`,style:{backgroundColor:g},children:m}),(0,W.jsx)("div",{className:"sb-offer__radio",children:(0,W.jsx)("div",{className:"sb-offer__radio-dot"})}),(0,W.jsxs)("div",{className:"sb-offer__content",children:[(0,W.jsxs)("div",{className:"sb-offer__header",children:[(0,W.jsx)("span",{className:"sb-offer__label",children:e.label}),e.subtitle&&(0,W.jsx)("span",{className:"sb-offer__subtitle",children:e.subtitle})]}),(0,W.jsxs)("div",{className:"sb-offer__pricing",children:[(0,W.jsx)("span",{className:"sb-offer__price",children:Ue(o.bundlePrice,r)}),i.showCompareAtPrice&&f&&(0,W.jsx)("span",{className:"sb-offer__compare-price",children:Ue(o.originalPrice,r)}),i.showPerUnitPrice&&e.quantity>1&&(0,W.jsx)("span",{className:"sb-offer__per-unit",children:td(o.perUnitPrice,r)})]}),f&&(i.showSavingsAmount||i.showSavingsPercent)&&(0,W.jsx)("div",{className:"sb-offer__savings",children:(0,W.jsx)(cd,{savingsAmount:o.savingsAmount,savingsPercent:o.savingsPercent,currency:"",moneyFormat:r,locale:l,style:i.badgeStyle})}),o.freeItemsCount>0&&(0,W.jsxs)("div",{className:"sb-offer__free-tag",children:["+",o.freeItemsCount," FREE"]})]}),t&&(0,W.jsx)("div",{className:"sb-offer__check","aria-hidden":"true",children:(0,W.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[(0,W.jsx)("circle",{cx:"10",cy:"10",r:"10",fill:"currentColor"}),(0,W.jsx)("path",{d:"M6 10l3 3 5-6",stroke:"#fff",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})})]})}var $l=F($e());var Vl=F($e()),Xe=F(ne());function fd({variants:e,selectedVariantId:t,onSelect:n,layout:r="dropdown"}){if(!e||e.length<=1)return null;let l=(0,Vl.useCallback)(s=>{n(s.target.value)},[n]),i=(0,Vl.useCallback)(s=>{n(s)},[n]),o=(0,Vl.useCallback)((s,a)=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),n(a))},[n]),u=tm(e);return r==="swatches"&&u.length>0?(0,Xe.jsx)("div",{className:"sb-variant-selector sb-variant-selector--swatches",children:u.map(s=>(0,Xe.jsxs)("div",{className:"sb-variant-group",children:[(0,Xe.jsx)("span",{className:"sb-variant-group__label",children:s.name}),(0,Xe.jsx)("div",{className:"sb-variant-group__options",role:"radiogroup","aria-label":s.name,children:s.values.map(a=>{let f=e.find(y=>y.options.some(w=>w.name===s.name&&w.value===a)),m=(f==null?void 0:f.id)===t,g=(f==null?void 0:f.available)!==!1;return(0,Xe.jsx)("button",{type:"button",role:"radio","aria-checked":m,"aria-label":`${s.name}: ${a}`,className:["sb-swatch",m&&"sb-swatch--selected",!g&&"sb-swatch--unavailable"].filter(Boolean).join(" "),onClick:()=>f&&i(f.id),onKeyDown:y=>f&&o(y,f.id),disabled:!g,children:a},a)})})]},s.name))}):(0,Xe.jsx)("div",{className:"sb-variant-selector sb-variant-selector--dropdown",children:(0,Xe.jsx)("select",{className:"sb-variant-select",value:t||"",onChange:l,"aria-label":"Select variant",children:e.map(s=>(0,Xe.jsxs)("option",{value:s.id,disabled:!s.available,children:[s.title,s.available?"":" (Sold out)"]},s.id))})})}function tm(e){let t=new Map;for(let n of e)for(let r of n.options)t.has(r.name)||t.set(r.name,new Set),t.get(r.name).add(r.value);return Array.from(t.entries()).map(([n,r])=>({name:n,values:Array.from(r)}))}var Ee=F(ne());function pd({product:e,size:t,showPrice:n,onVariantChange:r}){var a,f;let[l,i]=(0,$l.useState)(e.variantId||((f=(a=e.variants)==null?void 0:a[0])==null?void 0:f.id)),o=(0,$l.useCallback)(m=>{i(m),r==null||r(e.productId,m)},[e.productId,r]),u=!e.available,s=t==="small"?80:t==="medium"?120:180;return(0,Ee.jsxs)("div",{className:`sb-product sb-product--${t} ${u?"sb-product--oos":""}`,children:[e.imageUrl&&(0,Ee.jsxs)("div",{className:"sb-product__image-wrap",children:[(0,Ee.jsx)("img",{className:"sb-product__image",src:e.imageUrl,alt:e.imageAlt||e.title,width:s,height:s,loading:"lazy"}),u&&(0,Ee.jsx)("span",{className:"sb-product__oos-overlay",children:"Sold out"})]}),(0,Ee.jsxs)("div",{className:"sb-product__info",children:[(0,Ee.jsx)("p",{className:"sb-product__title",children:e.title}),n&&(0,Ee.jsxs)("p",{className:"sb-product__price",children:[e.compareAtPrice&&e.compareAtPrice>e.price&&(0,Ee.jsxs)("span",{className:"sb-product__compare-price",children:["$",e.compareAtPrice.toFixed(2)]}),(0,Ee.jsxs)("span",{children:["$",e.price.toFixed(2)]})]}),e.quantity>1&&(0,Ee.jsxs)("span",{className:"sb-product__qty",children:["\xD7",e.quantity]})]}),r&&e.variants&&e.variants.length>1&&(0,Ee.jsx)(fd,{variants:e.variants,selectedVariantId:l,onSelect:o,layout:"swatches"})]})}var Qt=F(ne());function md({current:e,target:t,label:n,color:r}){if(t<=0)return null;let l=Math.min(100,Math.round(e/t*100)),i=t-e;return(0,Qt.jsxs)("div",{className:"sb-progress",role:"progressbar","aria-valuenow":l,"aria-valuemin":0,"aria-valuemax":100,"aria-label":n,children:[(0,Qt.jsx)("div",{className:"sb-progress__label",children:n}),(0,Qt.jsx)("div",{className:"sb-progress__track",children:(0,Qt.jsx)("div",{className:"sb-progress__fill",style:{width:`${l}%`,backgroundColor:r||void 0}})}),i>0&&(0,Qt.jsxs)("div",{className:"sb-progress__hint",children:["Add ",i," more to unlock!"]})]})}var D=F(ne());function pu({config:e,onAddToCart:t,className:n}){let{tiers:r,products:l,visual:i,settings:o}=e,u=od(e),s=(0,Z.useMemo)(()=>r.find(x=>x.isDefault)||r[0],[r]),[a,f]=(0,Z.useState)((s==null?void 0:s.id)||""),[m,g]=(0,Z.useState)("idle"),[y,w]=(0,Z.useState)(""),[_,b]=(0,Z.useState)(()=>{let x={};for(let R of l)R.variantId&&(x[R.productId]=R.variantId);return x}),d=(0,Z.useMemo)(()=>r.find(x=>x.id===a)||s,[r,a,s]),c=(0,Z.useMemo)(()=>{let x={};for(let R of r)x[R.id]=Jc(R,l,e.type);return x},[r,l,e.type]),p=d?c[d.id]:void 0;(0,Z.useEffect)(()=>{u.trackView()},[u]);let h=(0,Z.useMemo)(()=>{if(!d)return null;let x=r.findIndex(R=>R.id===d.id);return x<r.length-1?r[x+1]:null},[r,d]),S=(0,Z.useCallback)(x=>{f(x),g("idle"),w("");let R=r.find(G=>G.id===x);R&&u.trackTierSelect(R,c[x])},[r,c,u]),E=(0,Z.useCallback)((x,R)=>{b(G=>({...G,[x]:R}))},[]),C=(0,Z.useCallback)(async()=>{if(!d||!p)return;g("loading"),w(""),u.trackAddToCart(d,p);let R={items:p.lineItems.map(G=>{var hu;let En=Object.entries(_).find(([,Hl])=>Hl);return{...G,variantId:_[((hu=l.find(Hl=>Hl.variantId===G.variantId))==null?void 0:hu.productId)||""]||G.variantId,properties:{...G.properties,_bundle_id:e.id}}}).map(G=>({...G,variantId:rm(G.variantId)}))};try{t?await t(R):await ld(R),g("success"),u.trackAddToCartSuccess(d,p),setTimeout(()=>{id(o.addToCartBehavior)},600)}catch(G){let En=G instanceof Error?G.message:"Failed to add to cart";w(En),g("error"),u.trackAddToCartFailed(d,En),setTimeout(()=>{g("idle"),w("")},3e3)}},[d,p,_,l,e.id,o.addToCartBehavior,t,u]);if(!r.length||!l.length)return(0,D.jsx)(D.Fragment,{});let P=(e.type==="fbt"||e.type==="mix-match"||e.type==="fixed"||e.type==="free-gift")&&i.showProductImages,H=nm(m,p,o.currency);return(0,D.jsxs)("div",{className:`sb-widget sb-widget--${i.layout} sb-widget--${i.colorScheme} ${n||""}`,role:"group","aria-label":e.title,children:[(0,D.jsxs)("div",{className:"sb-widget__header",children:[(0,D.jsx)("h3",{className:"sb-widget__title",children:e.title}),e.subtitle&&(0,D.jsx)("p",{className:"sb-widget__subtitle",children:e.subtitle})]}),P&&(0,D.jsx)("div",{className:"sb-widget__products",children:l.map((x,R)=>(0,D.jsxs)(Z.default.Fragment,{children:[R>0&&(0,D.jsx)("span",{className:"sb-widget__plus","aria-hidden":"true",children:"+"}),(0,D.jsx)(pd,{product:x,size:i.imageSize,showPrice:e.type!=="volume",onVariantChange:o.allowVariantSelection?E:void 0})]},x.productId))}),(0,D.jsx)("div",{className:"sb-widget__offers",role:"radiogroup","aria-label":"Select bundle option",children:r.map(x=>{let R=c[x.id],G=!l.every(En=>En.available)&&o.outOfStockBehavior==="disable";return(0,D.jsx)(dd,{tier:x,products:l,selected:x.id===a,disabled:G,currency:o.currency,moneyFormat:o.moneyFormat,locale:o.locale,visual:i,pricing:R,onSelect:S},x.id)})}),i.showProgressBar&&h&&d&&(0,D.jsx)(md,{current:d.quantity,target:h.quantity,label:`Add ${h.quantity-d.quantity} more for ${h.badge||"extra savings"}!`,color:i.accentColor}),(0,D.jsxs)("div",{className:"sb-widget__footer",children:[p&&(0,D.jsxs)("div",{className:"sb-widget__total",children:[(0,D.jsx)("span",{className:"sb-widget__total-label",children:"Total:"}),(0,D.jsxs)("div",{className:"sb-widget__total-prices",children:[p.savingsAmount>0&&(0,D.jsx)("span",{className:"sb-widget__total-original",children:Ue(p.originalPrice,o.moneyFormat)}),(0,D.jsx)("span",{className:"sb-widget__total-price",children:Ue(p.bundlePrice,o.moneyFormat)})]})]}),(0,D.jsxs)("button",{type:"button",className:`sb-widget__cta sb-widget__cta--${m}`,onClick:C,disabled:m==="loading"||m==="success","aria-busy":m==="loading",children:[m==="loading"&&(0,D.jsx)("span",{className:"sb-spinner","aria-hidden":"true"}),H]}),y&&(0,D.jsx)("p",{className:"sb-widget__error",role:"alert",children:y})]})]})}function nm(e,t,n){switch(e){case"loading":return"Adding...";case"success":return"Added to Cart!";case"error":return"Try Again";default:return t&&t.savingsAmount>0?`Add to Cart \u2014 Save $${t.savingsAmount.toFixed(2)}`:"Add to Cart"}}function rm(e){if(e.startsWith("gid://")){let t=e.split("/");return t[t.length-1]}return e}var Le=F(ne());function mu(){return(0,Le.jsxs)("div",{className:"sb-skeleton",role:"status","aria-label":"Loading bundle offers",children:[(0,Le.jsx)("div",{className:"sb-skeleton__title"}),(0,Le.jsx)("div",{className:"sb-skeleton__cards",children:[0,1,2].map(e=>(0,Le.jsxs)("div",{className:"sb-skeleton__card",children:[(0,Le.jsx)("div",{className:"sb-skeleton__badge"}),(0,Le.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--short"}),(0,Le.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--medium"}),(0,Le.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--long"}),(0,Le.jsx)("div",{className:"sb-skeleton__btn"})]},e))}),(0,Le.jsx)("span",{className:"sb-sr-only",children:"Loading..."})]})}var gd=F($e()),Wl=class extends gd.Component{constructor(t){super(t),this.state={hasError:!1,error:null}}static getDerivedStateFromError(t){return{hasError:!0,error:t}}componentDidCatch(t,n){var r,l,i;console.error("[ShopiBundle] Widget error:",t,n);try{let o=((r=window.Shopify)==null?void 0:r.shop)||"";o&&fetch("/apps/proxy/ai/events/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shop:o,bundleId:"widget-error",productId:"",eventType:"error",metadata:{message:t.message,stack:(l=t.stack)==null?void 0:l.substring(0,500),componentStack:(i=n.componentStack)==null?void 0:i.substring(0,500)}})}).catch(()=>{})}catch{}}render(){return this.state.hasError?this.props.fallback||null:this.props.children}};var hd=`/**
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
`;var st=F(ne()),vd=!1;function im(){if(vd||typeof document>"u")return;vd=!0;let e=document.createElement("style");e.setAttribute("data-shopibundle",""),e.textContent=hd,document.head.appendChild(e)}im();function om({mountConfig:e}){let[t,n]=(0,zt.useState)(null),[r,l]=(0,zt.useState)(!0),[i,o]=(0,zt.useState)(null);return(0,zt.useEffect)(()=>{um(e).then(u=>{n(u),l(!1)}).catch(u=>{console.warn("[ShopiBundle] Failed to load bundle:",u),o(u.message),l(!1)})},[e]),r?(0,st.jsx)(mu,{}):i||!t?(0,st.jsx)(st.Fragment,{}):(0,st.jsx)(pu,{config:t})}async function um(e){let t=new URLSearchParams;e.bundleHandle&&t.set("handle",e.bundleHandle),e.productId&&t.set("product_id",e.productId),t.set("shop",e.shopDomain),e.locale&&t.set("locale",e.locale),e.currency&&t.set("currency",e.currency);let n=e.proxyPath||"/apps/proxy",r=await fetch(`${n}/bundle-widget?${t.toString()}`);if(!r.ok)throw new Error(`HTTP ${r.status}`);let l=await r.json();if(!l.success||!l.config)throw new Error(l.error||"No bundle config returned");if(e.moneyFormat&&l.config.settings&&(l.config.settings.moneyFormat=e.moneyFormat),e.locale&&l.config.settings&&(l.config.settings.locale=e.locale),e.currency&&l.config.settings&&(l.config.settings.currency=e.currency),e.abTest&&l.config){if(e.abTest.defaultTierId)for(let i of l.config.tiers)i.isDefault=i.id===e.abTest.defaultTierId;e.abTest.colorScheme&&(l.config.visual.colorScheme=e.abTest.colorScheme),e.abTest.layoutVariant&&(l.config.analytics.experimentVariant=e.abTest.variant,l.config.analytics.experimentId=e.abTest.experimentId)}return l.config}function sm(e){var t;return{containerId:e.id,bundleHandle:e.dataset.bundleHandle||void 0,productId:e.dataset.productId||void 0,shopDomain:e.dataset.shop||((t=window.Shopify)==null?void 0:t.shop)||"",proxyPath:e.dataset.proxyPath||"/apps/proxy",locale:e.dataset.locale||document.documentElement.lang||"en",currency:e.dataset.currency||void 0,moneyFormat:e.dataset.moneyFormat||"${{amount}}"}}function gu(){document.querySelectorAll("[data-shopibundle-widget], #shopibundle-widget").forEach(t=>{if(t.dataset.mounted==="true")return;t.dataset.mounted="true";let n=sm(t);if(!n.shopDomain){console.warn("[ShopiBundle] No shop domain found, skipping widget mount");return}if(!n.bundleHandle&&!n.productId){console.warn("[ShopiBundle] No bundle handle or product ID found");return}(0,yd.createRoot)(t).render((0,st.jsx)(zt.default.StrictMode,{children:(0,st.jsx)(Wl,{children:(0,st.jsx)(om,{mountConfig:n})})}))})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",gu):gu();window.ShopiBundle={mount:gu,BundleWidget:pu,SkeletonLoader:mu};})();
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
