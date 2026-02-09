/* ShopiBundle Widget v1.0.0 - https://shopi-bundle.vercel.app */
"use strict";(()=>{var vd=Object.create;var hu=Object.defineProperty;var yd=Object.getOwnPropertyDescriptor;var wd=Object.getOwnPropertyNames;var _d=Object.getPrototypeOf,kd=Object.prototype.hasOwnProperty;var Xe=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var Sd=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of wd(t))!kd.call(e,l)&&l!==n&&hu(e,l,{get:()=>t[l],enumerable:!(r=yd(t,l))||r.enumerable});return e};var b=(e,t,n)=>(n=e!=null?vd(_d(e)):{},Sd(t||!e||!e.__esModule?hu(n,"default",{value:e,enumerable:!0}):n,e));var Tu=Xe(N=>{"use strict";var Cn=Symbol.for("react.element"),xd=Symbol.for("react.portal"),Ed=Symbol.for("react.fragment"),Cd=Symbol.for("react.strict_mode"),Pd=Symbol.for("react.profiler"),Nd=Symbol.for("react.provider"),Td=Symbol.for("react.context"),zd=Symbol.for("react.forward_ref"),Rd=Symbol.for("react.suspense"),Id=Symbol.for("react.memo"),Ld=Symbol.for("react.lazy"),vu=Symbol.iterator;function Od(e){return e===null||typeof e!="object"?null:(e=vu&&e[vu]||e["@@iterator"],typeof e=="function"?e:null)}var _u={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ku=Object.assign,Su={};function Kt(e,t,n){this.props=e,this.context=t,this.refs=Su,this.updater=n||_u}Kt.prototype.isReactComponent={};Kt.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Kt.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function xu(){}xu.prototype=Kt.prototype;function Ql(e,t,n){this.props=e,this.context=t,this.refs=Su,this.updater=n||_u}var Kl=Ql.prototype=new xu;Kl.constructor=Ql;ku(Kl,Kt.prototype);Kl.isPureReactComponent=!0;var yu=Array.isArray,Eu=Object.prototype.hasOwnProperty,Yl={current:null},Cu={key:!0,ref:!0,__self:!0,__source:!0};function Pu(e,t,n){var r,l={},i=null,o=null;if(t!=null)for(r in t.ref!==void 0&&(o=t.ref),t.key!==void 0&&(i=""+t.key),t)Eu.call(t,r)&&!Cu.hasOwnProperty(r)&&(l[r]=t[r]);var u=arguments.length-2;if(u===1)l.children=n;else if(1<u){for(var s=Array(u),a=0;a<u;a++)s[a]=arguments[a+2];l.children=s}if(e&&e.defaultProps)for(r in u=e.defaultProps,u)l[r]===void 0&&(l[r]=u[r]);return{$$typeof:Cn,type:e,key:i,ref:o,props:l,_owner:Yl.current}}function Md(e,t){return{$$typeof:Cn,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Gl(e){return typeof e=="object"&&e!==null&&e.$$typeof===Cn}function Dd(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var wu=/\/+/g;function Hl(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Dd(""+e.key):t.toString(36)}function wr(e,t,n,r,l){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(i){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case Cn:case xd:o=!0}}if(o)return o=e,l=l(o),e=r===""?"."+Hl(o,0):r,yu(l)?(n="",e!=null&&(n=e.replace(wu,"$&/")+"/"),wr(l,t,n,"",function(a){return a})):l!=null&&(Gl(l)&&(l=Md(l,n+(!l.key||o&&o.key===l.key?"":(""+l.key).replace(wu,"$&/")+"/")+e)),t.push(l)),1;if(o=0,r=r===""?".":r+":",yu(e))for(var u=0;u<e.length;u++){i=e[u];var s=r+Hl(i,u);o+=wr(i,t,n,s,l)}else if(s=Od(e),typeof s=="function")for(e=s.call(e),u=0;!(i=e.next()).done;)i=i.value,s=r+Hl(i,u++),o+=wr(i,t,n,s,l);else if(i==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return o}function yr(e,t,n){if(e==null)return e;var r=[],l=0;return wr(e,r,"","",function(i){return t.call(n,i,l++)}),r}function Fd(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var ae={current:null},_r={transition:null},Ad={ReactCurrentDispatcher:ae,ReactCurrentBatchConfig:_r,ReactCurrentOwner:Yl};function Nu(){throw Error("act(...) is not supported in production builds of React.")}N.Children={map:yr,forEach:function(e,t,n){yr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return yr(e,function(){t++}),t},toArray:function(e){return yr(e,function(t){return t})||[]},only:function(e){if(!Gl(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};N.Component=Kt;N.Fragment=Ed;N.Profiler=Pd;N.PureComponent=Ql;N.StrictMode=Cd;N.Suspense=Rd;N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ad;N.act=Nu;N.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=ku({},e.props),l=e.key,i=e.ref,o=e._owner;if(t!=null){if(t.ref!==void 0&&(i=t.ref,o=Yl.current),t.key!==void 0&&(l=""+t.key),e.type&&e.type.defaultProps)var u=e.type.defaultProps;for(s in t)Eu.call(t,s)&&!Cu.hasOwnProperty(s)&&(r[s]=t[s]===void 0&&u!==void 0?u[s]:t[s])}var s=arguments.length-2;if(s===1)r.children=n;else if(1<s){u=Array(s);for(var a=0;a<s;a++)u[a]=arguments[a+2];r.children=u}return{$$typeof:Cn,type:e.type,key:l,ref:i,props:r,_owner:o}};N.createContext=function(e){return e={$$typeof:Td,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Nd,_context:e},e.Consumer=e};N.createElement=Pu;N.createFactory=function(e){var t=Pu.bind(null,e);return t.type=e,t};N.createRef=function(){return{current:null}};N.forwardRef=function(e){return{$$typeof:zd,render:e}};N.isValidElement=Gl;N.lazy=function(e){return{$$typeof:Ld,_payload:{_status:-1,_result:e},_init:Fd}};N.memo=function(e,t){return{$$typeof:Id,type:e,compare:t===void 0?null:t}};N.startTransition=function(e){var t=_r.transition;_r.transition={};try{e()}finally{_r.transition=t}};N.unstable_act=Nu;N.useCallback=function(e,t){return ae.current.useCallback(e,t)};N.useContext=function(e){return ae.current.useContext(e)};N.useDebugValue=function(){};N.useDeferredValue=function(e){return ae.current.useDeferredValue(e)};N.useEffect=function(e,t){return ae.current.useEffect(e,t)};N.useId=function(){return ae.current.useId()};N.useImperativeHandle=function(e,t,n){return ae.current.useImperativeHandle(e,t,n)};N.useInsertionEffect=function(e,t){return ae.current.useInsertionEffect(e,t)};N.useLayoutEffect=function(e,t){return ae.current.useLayoutEffect(e,t)};N.useMemo=function(e,t){return ae.current.useMemo(e,t)};N.useReducer=function(e,t,n){return ae.current.useReducer(e,t,n)};N.useRef=function(e){return ae.current.useRef(e)};N.useState=function(e){return ae.current.useState(e)};N.useSyncExternalStore=function(e,t,n){return ae.current.useSyncExternalStore(e,t,n)};N.useTransition=function(){return ae.current.useTransition()};N.version="18.3.1"});var qe=Xe((am,zu)=>{"use strict";zu.exports=Tu()});var ju=Xe(I=>{"use strict";function Jl(e,t){var n=e.length;e.push(t);e:for(;0<n;){var r=n-1>>>1,l=e[r];if(0<kr(l,t))e[r]=t,e[n]=l,n=r;else break e}}function Oe(e){return e.length===0?null:e[0]}function xr(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var r=0,l=e.length,i=l>>>1;r<i;){var o=2*(r+1)-1,u=e[o],s=o+1,a=e[s];if(0>kr(u,n))s<l&&0>kr(a,u)?(e[r]=a,e[s]=n,r=s):(e[r]=u,e[o]=n,r=o);else if(s<l&&0>kr(a,n))e[r]=a,e[s]=n,r=s;else break e}}return t}function kr(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}typeof performance=="object"&&typeof performance.now=="function"?(Ru=performance,I.unstable_now=function(){return Ru.now()}):(Xl=Date,Iu=Xl.now(),I.unstable_now=function(){return Xl.now()-Iu});var Ru,Xl,Iu,$e=[],st=[],bd=1,Ce=null,re=3,Er=!1,It=!1,Nn=!1,Mu=typeof setTimeout=="function"?setTimeout:null,Du=typeof clearTimeout=="function"?clearTimeout:null,Lu=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ei(e){for(var t=Oe(st);t!==null;){if(t.callback===null)xr(st);else if(t.startTime<=e)xr(st),t.sortIndex=t.expirationTime,Jl($e,t);else break;t=Oe(st)}}function ti(e){if(Nn=!1,ei(e),!It)if(Oe($e)!==null)It=!0,ri(ni);else{var t=Oe(st);t!==null&&li(ti,t.startTime-e)}}function ni(e,t){It=!1,Nn&&(Nn=!1,Du(Tn),Tn=-1),Er=!0;var n=re;try{for(ei(t),Ce=Oe($e);Ce!==null&&(!(Ce.expirationTime>t)||e&&!bu());){var r=Ce.callback;if(typeof r=="function"){Ce.callback=null,re=Ce.priorityLevel;var l=r(Ce.expirationTime<=t);t=I.unstable_now(),typeof l=="function"?Ce.callback=l:Ce===Oe($e)&&xr($e),ei(t)}else xr($e);Ce=Oe($e)}if(Ce!==null)var i=!0;else{var o=Oe(st);o!==null&&li(ti,o.startTime-t),i=!1}return i}finally{Ce=null,re=n,Er=!1}}var Cr=!1,Sr=null,Tn=-1,Fu=5,Au=-1;function bu(){return!(I.unstable_now()-Au<Fu)}function ql(){if(Sr!==null){var e=I.unstable_now();Au=e;var t=!0;try{t=Sr(!0,e)}finally{t?Pn():(Cr=!1,Sr=null)}}else Cr=!1}var Pn;typeof Lu=="function"?Pn=function(){Lu(ql)}:typeof MessageChannel<"u"?(Zl=new MessageChannel,Ou=Zl.port2,Zl.port1.onmessage=ql,Pn=function(){Ou.postMessage(null)}):Pn=function(){Mu(ql,0)};var Zl,Ou;function ri(e){Sr=e,Cr||(Cr=!0,Pn())}function li(e,t){Tn=Mu(function(){e(I.unstable_now())},t)}I.unstable_IdlePriority=5;I.unstable_ImmediatePriority=1;I.unstable_LowPriority=4;I.unstable_NormalPriority=3;I.unstable_Profiling=null;I.unstable_UserBlockingPriority=2;I.unstable_cancelCallback=function(e){e.callback=null};I.unstable_continueExecution=function(){It||Er||(It=!0,ri(ni))};I.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Fu=0<e?Math.floor(1e3/e):5};I.unstable_getCurrentPriorityLevel=function(){return re};I.unstable_getFirstCallbackNode=function(){return Oe($e)};I.unstable_next=function(e){switch(re){case 1:case 2:case 3:var t=3;break;default:t=re}var n=re;re=t;try{return e()}finally{re=n}};I.unstable_pauseExecution=function(){};I.unstable_requestPaint=function(){};I.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=re;re=e;try{return t()}finally{re=n}};I.unstable_scheduleCallback=function(e,t,n){var r=I.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?r+n:r):n=r,e){case 1:var l=-1;break;case 2:l=250;break;case 5:l=1073741823;break;case 4:l=1e4;break;default:l=5e3}return l=n+l,e={id:bd++,callback:t,priorityLevel:e,startTime:n,expirationTime:l,sortIndex:-1},n>r?(e.sortIndex=n,Jl(st,e),Oe($e)===null&&e===Oe(st)&&(Nn?(Du(Tn),Tn=-1):Nn=!0,li(ti,n-r))):(e.sortIndex=l,Jl($e,e),It||Er||(It=!0,ri(ni))),e};I.unstable_shouldYield=bu;I.unstable_wrapCallback=function(e){var t=re;return function(){var n=re;re=t;try{return e.apply(this,arguments)}finally{re=n}}}});var Bu=Xe((dm,Uu)=>{"use strict";Uu.exports=ju()});var Hc=Xe(xe=>{"use strict";var jd=qe(),ke=Bu();function v(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Ys=new Set,Xn={};function Wt(e,t){gn(e,t),gn(e+"Capture",t)}function gn(e,t){for(Xn[e]=t,e=0;e<t.length;e++)Ys.add(t[e])}var rt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ni=Object.prototype.hasOwnProperty,Ud=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Vu={},$u={};function Bd(e){return Ni.call($u,e)?!0:Ni.call(Vu,e)?!1:Ud.test(e)?$u[e]=!0:(Vu[e]=!0,!1)}function Vd(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function $d(e,t,n,r){if(t===null||typeof t>"u"||Vd(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function fe(e,t,n,r,l,i,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=i,this.removeEmptyString=o}var te={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){te[e]=new fe(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];te[t]=new fe(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){te[e]=new fe(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){te[e]=new fe(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){te[e]=new fe(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){te[e]=new fe(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){te[e]=new fe(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){te[e]=new fe(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){te[e]=new fe(e,5,!1,e.toLowerCase(),null,!1,!1)});var _o=/[\-:]([a-z])/g;function ko(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(_o,ko);te[t]=new fe(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(_o,ko);te[t]=new fe(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(_o,ko);te[t]=new fe(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){te[e]=new fe(e,1,!1,e.toLowerCase(),null,!1,!1)});te.xlinkHref=new fe("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){te[e]=new fe(e,1,!1,e.toLowerCase(),null,!0,!0)});function So(e,t,n,r){var l=te.hasOwnProperty(t)?te[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&($d(t,n,l,r)&&(n=null),r||l===null?Bd(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var ut=jd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Pr=Symbol.for("react.element"),Xt=Symbol.for("react.portal"),qt=Symbol.for("react.fragment"),xo=Symbol.for("react.strict_mode"),Ti=Symbol.for("react.profiler"),Gs=Symbol.for("react.provider"),Xs=Symbol.for("react.context"),Eo=Symbol.for("react.forward_ref"),zi=Symbol.for("react.suspense"),Ri=Symbol.for("react.suspense_list"),Co=Symbol.for("react.memo"),ct=Symbol.for("react.lazy");Symbol.for("react.scope");Symbol.for("react.debug_trace_mode");var qs=Symbol.for("react.offscreen");Symbol.for("react.legacy_hidden");Symbol.for("react.cache");Symbol.for("react.tracing_marker");var Wu=Symbol.iterator;function zn(e){return e===null||typeof e!="object"?null:(e=Wu&&e[Wu]||e["@@iterator"],typeof e=="function"?e:null)}var B=Object.assign,ii;function An(e){if(ii===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);ii=t&&t[1]||""}return`
`+ii+e}var oi=!1;function ui(e,t){if(!e||oi)return"";oi=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(a){var r=a}Reflect.construct(e,[],t)}else{try{t.call()}catch(a){r=a}e.call(t.prototype)}else{try{throw Error()}catch(a){r=a}e()}}catch(a){if(a&&r&&typeof a.stack=="string"){for(var l=a.stack.split(`
`),i=r.stack.split(`
`),o=l.length-1,u=i.length-1;1<=o&&0<=u&&l[o]!==i[u];)u--;for(;1<=o&&0<=u;o--,u--)if(l[o]!==i[u]){if(o!==1||u!==1)do if(o--,u--,0>u||l[o]!==i[u]){var s=`
`+l[o].replace(" at new "," at ");return e.displayName&&s.includes("<anonymous>")&&(s=s.replace("<anonymous>",e.displayName)),s}while(1<=o&&0<=u);break}}}finally{oi=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?An(e):""}function Wd(e){switch(e.tag){case 5:return An(e.type);case 16:return An("Lazy");case 13:return An("Suspense");case 19:return An("SuspenseList");case 0:case 2:case 15:return e=ui(e.type,!1),e;case 11:return e=ui(e.type.render,!1),e;case 1:return e=ui(e.type,!0),e;default:return""}}function Ii(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case qt:return"Fragment";case Xt:return"Portal";case Ti:return"Profiler";case xo:return"StrictMode";case zi:return"Suspense";case Ri:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Xs:return(e.displayName||"Context")+".Consumer";case Gs:return(e._context.displayName||"Context")+".Provider";case Eo:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Co:return t=e.displayName||null,t!==null?t:Ii(e.type)||"Memo";case ct:t=e._payload,e=e._init;try{return Ii(e(t))}catch{}}return null}function Hd(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ii(t);case 8:return t===xo?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Et(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Zs(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Qd(e){var t=Zs(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(o){r=""+o,i.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Nr(e){e._valueTracker||(e._valueTracker=Qd(e))}function Js(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Zs(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function tl(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Li(e,t){var n=t.checked;return B({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Hu(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=Et(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function ea(e,t){t=t.checked,t!=null&&So(e,"checked",t,!1)}function Oi(e,t){ea(e,t);var n=Et(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Mi(e,t.type,n):t.hasOwnProperty("defaultValue")&&Mi(e,t.type,Et(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Qu(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Mi(e,t,n){(t!=="number"||tl(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var bn=Array.isArray;function an(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Et(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function Di(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(v(91));return B({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ku(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(v(92));if(bn(n)){if(1<n.length)throw Error(v(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Et(n)}}function ta(e,t){var n=Et(t.value),r=Et(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Yu(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function na(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Fi(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?na(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Tr,ra=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Tr=Tr||document.createElement("div"),Tr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Tr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function qn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Bn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Kd=["Webkit","ms","Moz","O"];Object.keys(Bn).forEach(function(e){Kd.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Bn[t]=Bn[e]})});function la(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Bn.hasOwnProperty(e)&&Bn[e]?(""+t).trim():t+"px"}function ia(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=la(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var Yd=B({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ai(e,t){if(t){if(Yd[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(v(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(v(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(v(61))}if(t.style!=null&&typeof t.style!="object")throw Error(v(62))}}function bi(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ji=null;function Po(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ui=null,cn=null,dn=null;function Gu(e){if(e=gr(e)){if(typeof Ui!="function")throw Error(v(280));var t=e.stateNode;t&&(t=zl(t),Ui(e.stateNode,e.type,t))}}function oa(e){cn?dn?dn.push(e):dn=[e]:cn=e}function ua(){if(cn){var e=cn,t=dn;if(dn=cn=null,Gu(e),t)for(e=0;e<t.length;e++)Gu(t[e])}}function sa(e,t){return e(t)}function aa(){}var si=!1;function ca(e,t,n){if(si)return e(t,n);si=!0;try{return sa(e,t,n)}finally{si=!1,(cn!==null||dn!==null)&&(aa(),ua())}}function Zn(e,t){var n=e.stateNode;if(n===null)return null;var r=zl(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(v(231,t,typeof n));return n}var Bi=!1;if(rt)try{Yt={},Object.defineProperty(Yt,"passive",{get:function(){Bi=!0}}),window.addEventListener("test",Yt,Yt),window.removeEventListener("test",Yt,Yt)}catch{Bi=!1}var Yt;function Gd(e,t,n,r,l,i,o,u,s){var a=Array.prototype.slice.call(arguments,3);try{t.apply(n,a)}catch(f){this.onError(f)}}var Vn=!1,nl=null,rl=!1,Vi=null,Xd={onError:function(e){Vn=!0,nl=e}};function qd(e,t,n,r,l,i,o,u,s){Vn=!1,nl=null,Gd.apply(Xd,arguments)}function Zd(e,t,n,r,l,i,o,u,s){if(qd.apply(this,arguments),Vn){if(Vn){var a=nl;Vn=!1,nl=null}else throw Error(v(198));rl||(rl=!0,Vi=a)}}function Ht(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function da(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Xu(e){if(Ht(e)!==e)throw Error(v(188))}function Jd(e){var t=e.alternate;if(!t){if(t=Ht(e),t===null)throw Error(v(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var i=l.alternate;if(i===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===i.child){for(i=l.child;i;){if(i===n)return Xu(l),e;if(i===r)return Xu(l),t;i=i.sibling}throw Error(v(188))}if(n.return!==r.return)n=l,r=i;else{for(var o=!1,u=l.child;u;){if(u===n){o=!0,n=l,r=i;break}if(u===r){o=!0,r=l,n=i;break}u=u.sibling}if(!o){for(u=i.child;u;){if(u===n){o=!0,n=i,r=l;break}if(u===r){o=!0,r=i,n=l;break}u=u.sibling}if(!o)throw Error(v(189))}}if(n.alternate!==r)throw Error(v(190))}if(n.tag!==3)throw Error(v(188));return n.stateNode.current===n?e:t}function fa(e){return e=Jd(e),e!==null?pa(e):null}function pa(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=pa(e);if(t!==null)return t;e=e.sibling}return null}var ma=ke.unstable_scheduleCallback,qu=ke.unstable_cancelCallback,ef=ke.unstable_shouldYield,tf=ke.unstable_requestPaint,$=ke.unstable_now,nf=ke.unstable_getCurrentPriorityLevel,No=ke.unstable_ImmediatePriority,ga=ke.unstable_UserBlockingPriority,ll=ke.unstable_NormalPriority,rf=ke.unstable_LowPriority,ha=ke.unstable_IdlePriority,Cl=null,Ke=null;function lf(e){if(Ke&&typeof Ke.onCommitFiberRoot=="function")try{Ke.onCommitFiberRoot(Cl,e,void 0,(e.current.flags&128)===128)}catch{}}var be=Math.clz32?Math.clz32:sf,of=Math.log,uf=Math.LN2;function sf(e){return e>>>=0,e===0?32:31-(of(e)/uf|0)|0}var zr=64,Rr=4194304;function jn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function il(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,i=e.pingedLanes,o=n&268435455;if(o!==0){var u=o&~l;u!==0?r=jn(u):(i&=o,i!==0&&(r=jn(i)))}else o=n&~l,o!==0?r=jn(o):i!==0&&(r=jn(i));if(r===0)return 0;if(t!==0&&t!==r&&!(t&l)&&(l=r&-r,i=t&-t,l>=i||l===16&&(i&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-be(t),l=1<<n,r|=e[n],t&=~l;return r}function af(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function cf(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,i=e.pendingLanes;0<i;){var o=31-be(i),u=1<<o,s=l[o];s===-1?(!(u&n)||u&r)&&(l[o]=af(u,t)):s<=t&&(e.expiredLanes|=u),i&=~u}}function $i(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function va(){var e=zr;return zr<<=1,!(zr&4194240)&&(zr=64),e}function ai(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function pr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-be(t),e[t]=n}function df(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-be(n),i=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~i}}function To(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-be(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var R=0;function ya(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var wa,zo,_a,ka,Sa,Wi=!1,Ir=[],ht=null,vt=null,yt=null,Jn=new Map,er=new Map,ft=[],ff="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Zu(e,t){switch(e){case"focusin":case"focusout":ht=null;break;case"dragenter":case"dragleave":vt=null;break;case"mouseover":case"mouseout":yt=null;break;case"pointerover":case"pointerout":Jn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":er.delete(t.pointerId)}}function Rn(e,t,n,r,l,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:i,targetContainers:[l]},t!==null&&(t=gr(t),t!==null&&zo(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function pf(e,t,n,r,l){switch(t){case"focusin":return ht=Rn(ht,e,t,n,r,l),!0;case"dragenter":return vt=Rn(vt,e,t,n,r,l),!0;case"mouseover":return yt=Rn(yt,e,t,n,r,l),!0;case"pointerover":var i=l.pointerId;return Jn.set(i,Rn(Jn.get(i)||null,e,t,n,r,l)),!0;case"gotpointercapture":return i=l.pointerId,er.set(i,Rn(er.get(i)||null,e,t,n,r,l)),!0}return!1}function xa(e){var t=Mt(e.target);if(t!==null){var n=Ht(t);if(n!==null){if(t=n.tag,t===13){if(t=da(n),t!==null){e.blockedOn=t,Sa(e.priority,function(){_a(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Hr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Hi(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);ji=r,n.target.dispatchEvent(r),ji=null}else return t=gr(n),t!==null&&zo(t),e.blockedOn=n,!1;t.shift()}return!0}function Ju(e,t,n){Hr(e)&&n.delete(t)}function mf(){Wi=!1,ht!==null&&Hr(ht)&&(ht=null),vt!==null&&Hr(vt)&&(vt=null),yt!==null&&Hr(yt)&&(yt=null),Jn.forEach(Ju),er.forEach(Ju)}function In(e,t){e.blockedOn===t&&(e.blockedOn=null,Wi||(Wi=!0,ke.unstable_scheduleCallback(ke.unstable_NormalPriority,mf)))}function tr(e){function t(l){return In(l,e)}if(0<Ir.length){In(Ir[0],e);for(var n=1;n<Ir.length;n++){var r=Ir[n];r.blockedOn===e&&(r.blockedOn=null)}}for(ht!==null&&In(ht,e),vt!==null&&In(vt,e),yt!==null&&In(yt,e),Jn.forEach(t),er.forEach(t),n=0;n<ft.length;n++)r=ft[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<ft.length&&(n=ft[0],n.blockedOn===null);)xa(n),n.blockedOn===null&&ft.shift()}var fn=ut.ReactCurrentBatchConfig,ol=!0;function gf(e,t,n,r){var l=R,i=fn.transition;fn.transition=null;try{R=1,Ro(e,t,n,r)}finally{R=l,fn.transition=i}}function hf(e,t,n,r){var l=R,i=fn.transition;fn.transition=null;try{R=4,Ro(e,t,n,r)}finally{R=l,fn.transition=i}}function Ro(e,t,n,r){if(ol){var l=Hi(e,t,n,r);if(l===null)hi(e,t,r,ul,n),Zu(e,r);else if(pf(l,e,t,n,r))r.stopPropagation();else if(Zu(e,r),t&4&&-1<ff.indexOf(e)){for(;l!==null;){var i=gr(l);if(i!==null&&wa(i),i=Hi(e,t,n,r),i===null&&hi(e,t,r,ul,n),i===l)break;l=i}l!==null&&r.stopPropagation()}else hi(e,t,r,null,n)}}var ul=null;function Hi(e,t,n,r){if(ul=null,e=Po(r),e=Mt(e),e!==null)if(t=Ht(e),t===null)e=null;else if(n=t.tag,n===13){if(e=da(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return ul=e,null}function Ea(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(nf()){case No:return 1;case ga:return 4;case ll:case rf:return 16;case ha:return 536870912;default:return 16}default:return 16}}var mt=null,Io=null,Qr=null;function Ca(){if(Qr)return Qr;var e,t=Io,n=t.length,r,l="value"in mt?mt.value:mt.textContent,i=l.length;for(e=0;e<n&&t[e]===l[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===l[i-r];r++);return Qr=l.slice(e,1<r?1-r:void 0)}function Kr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Lr(){return!0}function es(){return!1}function Se(e){function t(n,r,l,i,o){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=i,this.target=o,this.currentTarget=null;for(var u in e)e.hasOwnProperty(u)&&(n=e[u],this[u]=n?n(i):i[u]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?Lr:es,this.isPropagationStopped=es,this}return B(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Lr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Lr)},persist:function(){},isPersistent:Lr}),t}var Sn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Lo=Se(Sn),mr=B({},Sn,{view:0,detail:0}),vf=Se(mr),ci,di,Ln,Pl=B({},mr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Oo,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ln&&(Ln&&e.type==="mousemove"?(ci=e.screenX-Ln.screenX,di=e.screenY-Ln.screenY):di=ci=0,Ln=e),ci)},movementY:function(e){return"movementY"in e?e.movementY:di}}),ts=Se(Pl),yf=B({},Pl,{dataTransfer:0}),wf=Se(yf),_f=B({},mr,{relatedTarget:0}),fi=Se(_f),kf=B({},Sn,{animationName:0,elapsedTime:0,pseudoElement:0}),Sf=Se(kf),xf=B({},Sn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Ef=Se(xf),Cf=B({},Sn,{data:0}),ns=Se(Cf),Pf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Tf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function zf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Tf[e])?!!t[e]:!1}function Oo(){return zf}var Rf=B({},mr,{key:function(e){if(e.key){var t=Pf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Kr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Nf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Oo,charCode:function(e){return e.type==="keypress"?Kr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Kr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),If=Se(Rf),Lf=B({},Pl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),rs=Se(Lf),Of=B({},mr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Oo}),Mf=Se(Of),Df=B({},Sn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ff=Se(Df),Af=B({},Pl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),bf=Se(Af),jf=[9,13,27,32],Mo=rt&&"CompositionEvent"in window,$n=null;rt&&"documentMode"in document&&($n=document.documentMode);var Uf=rt&&"TextEvent"in window&&!$n,Pa=rt&&(!Mo||$n&&8<$n&&11>=$n),ls=" ",is=!1;function Na(e,t){switch(e){case"keyup":return jf.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ta(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Zt=!1;function Bf(e,t){switch(e){case"compositionend":return Ta(t);case"keypress":return t.which!==32?null:(is=!0,ls);case"textInput":return e=t.data,e===ls&&is?null:e;default:return null}}function Vf(e,t){if(Zt)return e==="compositionend"||!Mo&&Na(e,t)?(e=Ca(),Qr=Io=mt=null,Zt=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Pa&&t.locale!=="ko"?null:t.data;default:return null}}var $f={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function os(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!$f[e.type]:t==="textarea"}function za(e,t,n,r){oa(r),t=sl(t,"onChange"),0<t.length&&(n=new Lo("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Wn=null,nr=null;function Wf(e){Ua(e,0)}function Nl(e){var t=tn(e);if(Js(t))return e}function Hf(e,t){if(e==="change")return t}var Ra=!1;rt&&(rt?(Mr="oninput"in document,Mr||(pi=document.createElement("div"),pi.setAttribute("oninput","return;"),Mr=typeof pi.oninput=="function"),Or=Mr):Or=!1,Ra=Or&&(!document.documentMode||9<document.documentMode));var Or,Mr,pi;function us(){Wn&&(Wn.detachEvent("onpropertychange",Ia),nr=Wn=null)}function Ia(e){if(e.propertyName==="value"&&Nl(nr)){var t=[];za(t,nr,e,Po(e)),ca(Wf,t)}}function Qf(e,t,n){e==="focusin"?(us(),Wn=t,nr=n,Wn.attachEvent("onpropertychange",Ia)):e==="focusout"&&us()}function Kf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Nl(nr)}function Yf(e,t){if(e==="click")return Nl(t)}function Gf(e,t){if(e==="input"||e==="change")return Nl(t)}function Xf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ue=typeof Object.is=="function"?Object.is:Xf;function rr(e,t){if(Ue(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!Ni.call(t,l)||!Ue(e[l],t[l]))return!1}return!0}function ss(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function as(e,t){var n=ss(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=ss(n)}}function La(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?La(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Oa(){for(var e=window,t=tl();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=tl(e.document)}return t}function Do(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function qf(e){var t=Oa(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&La(n.ownerDocument.documentElement,n)){if(r!==null&&Do(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,i=Math.min(r.start,l);r=r.end===void 0?i:Math.min(r.end,l),!e.extend&&i>r&&(l=r,r=i,i=l),l=as(n,i);var o=as(n,r);l&&o&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),i>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Zf=rt&&"documentMode"in document&&11>=document.documentMode,Jt=null,Qi=null,Hn=null,Ki=!1;function cs(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Ki||Jt==null||Jt!==tl(r)||(r=Jt,"selectionStart"in r&&Do(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Hn&&rr(Hn,r)||(Hn=r,r=sl(Qi,"onSelect"),0<r.length&&(t=new Lo("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Jt)))}function Dr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var en={animationend:Dr("Animation","AnimationEnd"),animationiteration:Dr("Animation","AnimationIteration"),animationstart:Dr("Animation","AnimationStart"),transitionend:Dr("Transition","TransitionEnd")},mi={},Ma={};rt&&(Ma=document.createElement("div").style,"AnimationEvent"in window||(delete en.animationend.animation,delete en.animationiteration.animation,delete en.animationstart.animation),"TransitionEvent"in window||delete en.transitionend.transition);function Tl(e){if(mi[e])return mi[e];if(!en[e])return e;var t=en[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Ma)return mi[e]=t[n];return e}var Da=Tl("animationend"),Fa=Tl("animationiteration"),Aa=Tl("animationstart"),ba=Tl("transitionend"),ja=new Map,ds="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Pt(e,t){ja.set(e,t),Wt(t,[e])}for(Fr=0;Fr<ds.length;Fr++)Ar=ds[Fr],fs=Ar.toLowerCase(),ps=Ar[0].toUpperCase()+Ar.slice(1),Pt(fs,"on"+ps);var Ar,fs,ps,Fr;Pt(Da,"onAnimationEnd");Pt(Fa,"onAnimationIteration");Pt(Aa,"onAnimationStart");Pt("dblclick","onDoubleClick");Pt("focusin","onFocus");Pt("focusout","onBlur");Pt(ba,"onTransitionEnd");gn("onMouseEnter",["mouseout","mouseover"]);gn("onMouseLeave",["mouseout","mouseover"]);gn("onPointerEnter",["pointerout","pointerover"]);gn("onPointerLeave",["pointerout","pointerover"]);Wt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Wt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Wt("onBeforeInput",["compositionend","keypress","textInput","paste"]);Wt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Wt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Wt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Un="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Jf=new Set("cancel close invalid load scroll toggle".split(" ").concat(Un));function ms(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Zd(r,t,void 0,e),e.currentTarget=null}function Ua(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var i=void 0;if(t)for(var o=r.length-1;0<=o;o--){var u=r[o],s=u.instance,a=u.currentTarget;if(u=u.listener,s!==i&&l.isPropagationStopped())break e;ms(l,u,a),i=s}else for(o=0;o<r.length;o++){if(u=r[o],s=u.instance,a=u.currentTarget,u=u.listener,s!==i&&l.isPropagationStopped())break e;ms(l,u,a),i=s}}}if(rl)throw e=Vi,rl=!1,Vi=null,e}function O(e,t){var n=t[Zi];n===void 0&&(n=t[Zi]=new Set);var r=e+"__bubble";n.has(r)||(Ba(t,e,2,!1),n.add(r))}function gi(e,t,n){var r=0;t&&(r|=4),Ba(n,e,r,t)}var br="_reactListening"+Math.random().toString(36).slice(2);function lr(e){if(!e[br]){e[br]=!0,Ys.forEach(function(n){n!=="selectionchange"&&(Jf.has(n)||gi(n,!1,e),gi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[br]||(t[br]=!0,gi("selectionchange",!1,t))}}function Ba(e,t,n,r){switch(Ea(t)){case 1:var l=gf;break;case 4:l=hf;break;default:l=Ro}n=l.bind(null,t,n,e),l=void 0,!Bi||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function hi(e,t,n,r,l){var i=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var u=r.stateNode.containerInfo;if(u===l||u.nodeType===8&&u.parentNode===l)break;if(o===4)for(o=r.return;o!==null;){var s=o.tag;if((s===3||s===4)&&(s=o.stateNode.containerInfo,s===l||s.nodeType===8&&s.parentNode===l))return;o=o.return}for(;u!==null;){if(o=Mt(u),o===null)return;if(s=o.tag,s===5||s===6){r=i=o;continue e}u=u.parentNode}}r=r.return}ca(function(){var a=i,f=Po(n),m=[];e:{var g=ja.get(e);if(g!==void 0){var y=Lo,w=e;switch(e){case"keypress":if(Kr(n)===0)break e;case"keydown":case"keyup":y=If;break;case"focusin":w="focus",y=fi;break;case"focusout":w="blur",y=fi;break;case"beforeblur":case"afterblur":y=fi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":y=ts;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":y=wf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":y=Mf;break;case Da:case Fa:case Aa:y=Sf;break;case ba:y=Ff;break;case"scroll":y=vf;break;case"wheel":y=bf;break;case"copy":case"cut":case"paste":y=Ef;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":y=rs}var _=(t&4)!==0,A=!_&&e==="scroll",d=_?g!==null?g+"Capture":null:g;_=[];for(var c=a,p;c!==null;){p=c;var h=p.stateNode;if(p.tag===5&&h!==null&&(p=h,d!==null&&(h=Zn(c,d),h!=null&&_.push(ir(c,h,p)))),A)break;c=c.return}0<_.length&&(g=new y(g,w,null,n,f),m.push({event:g,listeners:_}))}}if(!(t&7)){e:{if(g=e==="mouseover"||e==="pointerover",y=e==="mouseout"||e==="pointerout",g&&n!==ji&&(w=n.relatedTarget||n.fromElement)&&(Mt(w)||w[lt]))break e;if((y||g)&&(g=f.window===f?f:(g=f.ownerDocument)?g.defaultView||g.parentWindow:window,y?(w=n.relatedTarget||n.toElement,y=a,w=w?Mt(w):null,w!==null&&(A=Ht(w),w!==A||w.tag!==5&&w.tag!==6)&&(w=null)):(y=null,w=a),y!==w)){if(_=ts,h="onMouseLeave",d="onMouseEnter",c="mouse",(e==="pointerout"||e==="pointerover")&&(_=rs,h="onPointerLeave",d="onPointerEnter",c="pointer"),A=y==null?g:tn(y),p=w==null?g:tn(w),g=new _(h,c+"leave",y,n,f),g.target=A,g.relatedTarget=p,h=null,Mt(f)===a&&(_=new _(d,c+"enter",w,n,f),_.target=p,_.relatedTarget=A,h=_),A=h,y&&w)t:{for(_=y,d=w,c=0,p=_;p;p=Gt(p))c++;for(p=0,h=d;h;h=Gt(h))p++;for(;0<c-p;)_=Gt(_),c--;for(;0<p-c;)d=Gt(d),p--;for(;c--;){if(_===d||d!==null&&_===d.alternate)break t;_=Gt(_),d=Gt(d)}_=null}else _=null;y!==null&&gs(m,g,y,_,!1),w!==null&&A!==null&&gs(m,A,w,_,!0)}}e:{if(g=a?tn(a):window,y=g.nodeName&&g.nodeName.toLowerCase(),y==="select"||y==="input"&&g.type==="file")var S=Hf;else if(os(g))if(Ra)S=Gf;else{S=Kf;var E=Qf}else(y=g.nodeName)&&y.toLowerCase()==="input"&&(g.type==="checkbox"||g.type==="radio")&&(S=Yf);if(S&&(S=S(e,a))){za(m,S,n,f);break e}E&&E(e,g,a),e==="focusout"&&(E=g._wrapperState)&&E.controlled&&g.type==="number"&&Mi(g,"number",g.value)}switch(E=a?tn(a):window,e){case"focusin":(os(E)||E.contentEditable==="true")&&(Jt=E,Qi=a,Hn=null);break;case"focusout":Hn=Qi=Jt=null;break;case"mousedown":Ki=!0;break;case"contextmenu":case"mouseup":case"dragend":Ki=!1,cs(m,n,f);break;case"selectionchange":if(Zf)break;case"keydown":case"keyup":cs(m,n,f)}var C;if(Mo)e:{switch(e){case"compositionstart":var P="onCompositionStart";break e;case"compositionend":P="onCompositionEnd";break e;case"compositionupdate":P="onCompositionUpdate";break e}P=void 0}else Zt?Na(e,n)&&(P="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(P="onCompositionStart");P&&(Pa&&n.locale!=="ko"&&(Zt||P!=="onCompositionStart"?P==="onCompositionEnd"&&Zt&&(C=Ca()):(mt=f,Io="value"in mt?mt.value:mt.textContent,Zt=!0)),E=sl(a,P),0<E.length&&(P=new ns(P,e,null,n,f),m.push({event:P,listeners:E}),C?P.data=C:(C=Ta(n),C!==null&&(P.data=C)))),(C=Uf?Bf(e,n):Vf(e,n))&&(a=sl(a,"onBeforeInput"),0<a.length&&(f=new ns("onBeforeInput","beforeinput",null,n,f),m.push({event:f,listeners:a}),f.data=C))}Ua(m,t)})}function ir(e,t,n){return{instance:e,listener:t,currentTarget:n}}function sl(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,i=l.stateNode;l.tag===5&&i!==null&&(l=i,i=Zn(e,n),i!=null&&r.unshift(ir(e,i,l)),i=Zn(e,t),i!=null&&r.push(ir(e,i,l))),e=e.return}return r}function Gt(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function gs(e,t,n,r,l){for(var i=t._reactName,o=[];n!==null&&n!==r;){var u=n,s=u.alternate,a=u.stateNode;if(s!==null&&s===r)break;u.tag===5&&a!==null&&(u=a,l?(s=Zn(n,i),s!=null&&o.unshift(ir(n,s,u))):l||(s=Zn(n,i),s!=null&&o.push(ir(n,s,u)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var ep=/\r\n?/g,tp=/\u0000|\uFFFD/g;function hs(e){return(typeof e=="string"?e:""+e).replace(ep,`
`).replace(tp,"")}function jr(e,t,n){if(t=hs(t),hs(e)!==t&&n)throw Error(v(425))}function al(){}var Yi=null,Gi=null;function Xi(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var qi=typeof setTimeout=="function"?setTimeout:void 0,np=typeof clearTimeout=="function"?clearTimeout:void 0,vs=typeof Promise=="function"?Promise:void 0,rp=typeof queueMicrotask=="function"?queueMicrotask:typeof vs<"u"?function(e){return vs.resolve(null).then(e).catch(lp)}:qi;function lp(e){setTimeout(function(){throw e})}function vi(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),tr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);tr(t)}function wt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function ys(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var xn=Math.random().toString(36).slice(2),Qe="__reactFiber$"+xn,or="__reactProps$"+xn,lt="__reactContainer$"+xn,Zi="__reactEvents$"+xn,ip="__reactListeners$"+xn,op="__reactHandles$"+xn;function Mt(e){var t=e[Qe];if(t)return t;for(var n=e.parentNode;n;){if(t=n[lt]||n[Qe]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ys(e);e!==null;){if(n=e[Qe])return n;e=ys(e)}return t}e=n,n=e.parentNode}return null}function gr(e){return e=e[Qe]||e[lt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function tn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(v(33))}function zl(e){return e[or]||null}var Ji=[],nn=-1;function Nt(e){return{current:e}}function M(e){0>nn||(e.current=Ji[nn],Ji[nn]=null,nn--)}function L(e,t){nn++,Ji[nn]=e.current,e.current=t}var Ct={},ue=Nt(Ct),ge=Nt(!1),jt=Ct;function hn(e,t){var n=e.type.contextTypes;if(!n)return Ct;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},i;for(i in n)l[i]=t[i];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function he(e){return e=e.childContextTypes,e!=null}function cl(){M(ge),M(ue)}function ws(e,t,n){if(ue.current!==Ct)throw Error(v(168));L(ue,t),L(ge,n)}function Va(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(v(108,Hd(e)||"Unknown",l));return B({},n,r)}function dl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Ct,jt=ue.current,L(ue,e),L(ge,ge.current),!0}function _s(e,t,n){var r=e.stateNode;if(!r)throw Error(v(169));n?(e=Va(e,t,jt),r.__reactInternalMemoizedMergedChildContext=e,M(ge),M(ue),L(ue,e)):M(ge),L(ge,n)}var Je=null,Rl=!1,yi=!1;function $a(e){Je===null?Je=[e]:Je.push(e)}function up(e){Rl=!0,$a(e)}function Tt(){if(!yi&&Je!==null){yi=!0;var e=0,t=R;try{var n=Je;for(R=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Je=null,Rl=!1}catch(l){throw Je!==null&&(Je=Je.slice(e+1)),ma(No,Tt),l}finally{R=t,yi=!1}}return null}var rn=[],ln=0,fl=null,pl=0,Pe=[],Ne=0,Ut=null,et=1,tt="";function Lt(e,t){rn[ln++]=pl,rn[ln++]=fl,fl=e,pl=t}function Wa(e,t,n){Pe[Ne++]=et,Pe[Ne++]=tt,Pe[Ne++]=Ut,Ut=e;var r=et;e=tt;var l=32-be(r)-1;r&=~(1<<l),n+=1;var i=32-be(t)+l;if(30<i){var o=l-l%5;i=(r&(1<<o)-1).toString(32),r>>=o,l-=o,et=1<<32-be(t)+l|n<<l|r,tt=i+e}else et=1<<i|n<<l|r,tt=e}function Fo(e){e.return!==null&&(Lt(e,1),Wa(e,1,0))}function Ao(e){for(;e===fl;)fl=rn[--ln],rn[ln]=null,pl=rn[--ln],rn[ln]=null;for(;e===Ut;)Ut=Pe[--Ne],Pe[Ne]=null,tt=Pe[--Ne],Pe[Ne]=null,et=Pe[--Ne],Pe[Ne]=null}var _e=null,we=null,F=!1,Ae=null;function Ha(e,t){var n=Te(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function ks(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,_e=e,we=wt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,_e=e,we=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Ut!==null?{id:et,overflow:tt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Te(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,_e=e,we=null,!0):!1;default:return!1}}function eo(e){return(e.mode&1)!==0&&(e.flags&128)===0}function to(e){if(F){var t=we;if(t){var n=t;if(!ks(e,t)){if(eo(e))throw Error(v(418));t=wt(n.nextSibling);var r=_e;t&&ks(e,t)?Ha(r,n):(e.flags=e.flags&-4097|2,F=!1,_e=e)}}else{if(eo(e))throw Error(v(418));e.flags=e.flags&-4097|2,F=!1,_e=e}}}function Ss(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;_e=e}function Ur(e){if(e!==_e)return!1;if(!F)return Ss(e),F=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Xi(e.type,e.memoizedProps)),t&&(t=we)){if(eo(e))throw Qa(),Error(v(418));for(;t;)Ha(e,t),t=wt(t.nextSibling)}if(Ss(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){we=wt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}we=null}}else we=_e?wt(e.stateNode.nextSibling):null;return!0}function Qa(){for(var e=we;e;)e=wt(e.nextSibling)}function vn(){we=_e=null,F=!1}function bo(e){Ae===null?Ae=[e]:Ae.push(e)}var sp=ut.ReactCurrentBatchConfig;function On(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(v(309));var r=n.stateNode}if(!r)throw Error(v(147,e));var l=r,i=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===i?t.ref:(t=function(o){var u=l.refs;o===null?delete u[i]:u[i]=o},t._stringRef=i,t)}if(typeof e!="string")throw Error(v(284));if(!n._owner)throw Error(v(290,e))}return e}function Br(e,t){throw e=Object.prototype.toString.call(t),Error(v(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function xs(e){var t=e._init;return t(e._payload)}function Ka(e){function t(d,c){if(e){var p=d.deletions;p===null?(d.deletions=[c],d.flags|=16):p.push(c)}}function n(d,c){if(!e)return null;for(;c!==null;)t(d,c),c=c.sibling;return null}function r(d,c){for(d=new Map;c!==null;)c.key!==null?d.set(c.key,c):d.set(c.index,c),c=c.sibling;return d}function l(d,c){return d=xt(d,c),d.index=0,d.sibling=null,d}function i(d,c,p){return d.index=p,e?(p=d.alternate,p!==null?(p=p.index,p<c?(d.flags|=2,c):p):(d.flags|=2,c)):(d.flags|=1048576,c)}function o(d){return e&&d.alternate===null&&(d.flags|=2),d}function u(d,c,p,h){return c===null||c.tag!==6?(c=Ci(p,d.mode,h),c.return=d,c):(c=l(c,p),c.return=d,c)}function s(d,c,p,h){var S=p.type;return S===qt?f(d,c,p.props.children,h,p.key):c!==null&&(c.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===ct&&xs(S)===c.type)?(h=l(c,p.props),h.ref=On(d,c,p),h.return=d,h):(h=el(p.type,p.key,p.props,null,d.mode,h),h.ref=On(d,c,p),h.return=d,h)}function a(d,c,p,h){return c===null||c.tag!==4||c.stateNode.containerInfo!==p.containerInfo||c.stateNode.implementation!==p.implementation?(c=Pi(p,d.mode,h),c.return=d,c):(c=l(c,p.children||[]),c.return=d,c)}function f(d,c,p,h,S){return c===null||c.tag!==7?(c=bt(p,d.mode,h,S),c.return=d,c):(c=l(c,p),c.return=d,c)}function m(d,c,p){if(typeof c=="string"&&c!==""||typeof c=="number")return c=Ci(""+c,d.mode,p),c.return=d,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case Pr:return p=el(c.type,c.key,c.props,null,d.mode,p),p.ref=On(d,null,c),p.return=d,p;case Xt:return c=Pi(c,d.mode,p),c.return=d,c;case ct:var h=c._init;return m(d,h(c._payload),p)}if(bn(c)||zn(c))return c=bt(c,d.mode,p,null),c.return=d,c;Br(d,c)}return null}function g(d,c,p,h){var S=c!==null?c.key:null;if(typeof p=="string"&&p!==""||typeof p=="number")return S!==null?null:u(d,c,""+p,h);if(typeof p=="object"&&p!==null){switch(p.$$typeof){case Pr:return p.key===S?s(d,c,p,h):null;case Xt:return p.key===S?a(d,c,p,h):null;case ct:return S=p._init,g(d,c,S(p._payload),h)}if(bn(p)||zn(p))return S!==null?null:f(d,c,p,h,null);Br(d,p)}return null}function y(d,c,p,h,S){if(typeof h=="string"&&h!==""||typeof h=="number")return d=d.get(p)||null,u(c,d,""+h,S);if(typeof h=="object"&&h!==null){switch(h.$$typeof){case Pr:return d=d.get(h.key===null?p:h.key)||null,s(c,d,h,S);case Xt:return d=d.get(h.key===null?p:h.key)||null,a(c,d,h,S);case ct:var E=h._init;return y(d,c,p,E(h._payload),S)}if(bn(h)||zn(h))return d=d.get(p)||null,f(c,d,h,S,null);Br(c,h)}return null}function w(d,c,p,h){for(var S=null,E=null,C=c,P=c=0,H=null;C!==null&&P<p.length;P++){C.index>P?(H=C,C=null):H=C.sibling;var x=g(d,C,p[P],h);if(x===null){C===null&&(C=H);break}e&&C&&x.alternate===null&&t(d,C),c=i(x,c,P),E===null?S=x:E.sibling=x,E=x,C=H}if(P===p.length)return n(d,C),F&&Lt(d,P),S;if(C===null){for(;P<p.length;P++)C=m(d,p[P],h),C!==null&&(c=i(C,c,P),E===null?S=C:E.sibling=C,E=C);return F&&Lt(d,P),S}for(C=r(d,C);P<p.length;P++)H=y(C,d,P,p[P],h),H!==null&&(e&&H.alternate!==null&&C.delete(H.key===null?P:H.key),c=i(H,c,P),E===null?S=H:E.sibling=H,E=H);return e&&C.forEach(function(z){return t(d,z)}),F&&Lt(d,P),S}function _(d,c,p,h){var S=zn(p);if(typeof S!="function")throw Error(v(150));if(p=S.call(p),p==null)throw Error(v(151));for(var E=S=null,C=c,P=c=0,H=null,x=p.next();C!==null&&!x.done;P++,x=p.next()){C.index>P?(H=C,C=null):H=C.sibling;var z=g(d,C,x.value,h);if(z===null){C===null&&(C=H);break}e&&C&&z.alternate===null&&t(d,C),c=i(z,c,P),E===null?S=z:E.sibling=z,E=z,C=H}if(x.done)return n(d,C),F&&Lt(d,P),S;if(C===null){for(;!x.done;P++,x=p.next())x=m(d,x.value,h),x!==null&&(c=i(x,c,P),E===null?S=x:E.sibling=x,E=x);return F&&Lt(d,P),S}for(C=r(d,C);!x.done;P++,x=p.next())x=y(C,d,P,x.value,h),x!==null&&(e&&x.alternate!==null&&C.delete(x.key===null?P:x.key),c=i(x,c,P),E===null?S=x:E.sibling=x,E=x);return e&&C.forEach(function(G){return t(d,G)}),F&&Lt(d,P),S}function A(d,c,p,h){if(typeof p=="object"&&p!==null&&p.type===qt&&p.key===null&&(p=p.props.children),typeof p=="object"&&p!==null){switch(p.$$typeof){case Pr:e:{for(var S=p.key,E=c;E!==null;){if(E.key===S){if(S=p.type,S===qt){if(E.tag===7){n(d,E.sibling),c=l(E,p.props.children),c.return=d,d=c;break e}}else if(E.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===ct&&xs(S)===E.type){n(d,E.sibling),c=l(E,p.props),c.ref=On(d,E,p),c.return=d,d=c;break e}n(d,E);break}else t(d,E);E=E.sibling}p.type===qt?(c=bt(p.props.children,d.mode,h,p.key),c.return=d,d=c):(h=el(p.type,p.key,p.props,null,d.mode,h),h.ref=On(d,c,p),h.return=d,d=h)}return o(d);case Xt:e:{for(E=p.key;c!==null;){if(c.key===E)if(c.tag===4&&c.stateNode.containerInfo===p.containerInfo&&c.stateNode.implementation===p.implementation){n(d,c.sibling),c=l(c,p.children||[]),c.return=d,d=c;break e}else{n(d,c);break}else t(d,c);c=c.sibling}c=Pi(p,d.mode,h),c.return=d,d=c}return o(d);case ct:return E=p._init,A(d,c,E(p._payload),h)}if(bn(p))return w(d,c,p,h);if(zn(p))return _(d,c,p,h);Br(d,p)}return typeof p=="string"&&p!==""||typeof p=="number"?(p=""+p,c!==null&&c.tag===6?(n(d,c.sibling),c=l(c,p),c.return=d,d=c):(n(d,c),c=Ci(p,d.mode,h),c.return=d,d=c),o(d)):n(d,c)}return A}var yn=Ka(!0),Ya=Ka(!1),ml=Nt(null),gl=null,on=null,jo=null;function Uo(){jo=on=gl=null}function Bo(e){var t=ml.current;M(ml),e._currentValue=t}function no(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function pn(e,t){gl=e,jo=on=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(me=!0),e.firstContext=null)}function Re(e){var t=e._currentValue;if(jo!==e)if(e={context:e,memoizedValue:t,next:null},on===null){if(gl===null)throw Error(v(308));on=e,gl.dependencies={lanes:0,firstContext:e}}else on=on.next=e;return t}var Dt=null;function Vo(e){Dt===null?Dt=[e]:Dt.push(e)}function Ga(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,Vo(t)):(n.next=l.next,l.next=n),t.interleaved=n,it(e,r)}function it(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var dt=!1;function $o(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Xa(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function nt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function _t(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,T&2){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,it(e,n)}return l=r.interleaved,l===null?(t.next=t,Vo(r)):(t.next=l.next,l.next=t),r.interleaved=t,it(e,n)}function Yr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,To(e,n)}}function Es(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};i===null?l=i=o:i=i.next=o,n=n.next}while(n!==null);i===null?l=i=t:i=i.next=t}else l=i=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:i,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function hl(e,t,n,r){var l=e.updateQueue;dt=!1;var i=l.firstBaseUpdate,o=l.lastBaseUpdate,u=l.shared.pending;if(u!==null){l.shared.pending=null;var s=u,a=s.next;s.next=null,o===null?i=a:o.next=a,o=s;var f=e.alternate;f!==null&&(f=f.updateQueue,u=f.lastBaseUpdate,u!==o&&(u===null?f.firstBaseUpdate=a:u.next=a,f.lastBaseUpdate=s))}if(i!==null){var m=l.baseState;o=0,f=a=s=null,u=i;do{var g=u.lane,y=u.eventTime;if((r&g)===g){f!==null&&(f=f.next={eventTime:y,lane:0,tag:u.tag,payload:u.payload,callback:u.callback,next:null});e:{var w=e,_=u;switch(g=t,y=n,_.tag){case 1:if(w=_.payload,typeof w=="function"){m=w.call(y,m,g);break e}m=w;break e;case 3:w.flags=w.flags&-65537|128;case 0:if(w=_.payload,g=typeof w=="function"?w.call(y,m,g):w,g==null)break e;m=B({},m,g);break e;case 2:dt=!0}}u.callback!==null&&u.lane!==0&&(e.flags|=64,g=l.effects,g===null?l.effects=[u]:g.push(u))}else y={eventTime:y,lane:g,tag:u.tag,payload:u.payload,callback:u.callback,next:null},f===null?(a=f=y,s=m):f=f.next=y,o|=g;if(u=u.next,u===null){if(u=l.shared.pending,u===null)break;g=u,u=g.next,g.next=null,l.lastBaseUpdate=g,l.shared.pending=null}}while(!0);if(f===null&&(s=m),l.baseState=s,l.firstBaseUpdate=a,l.lastBaseUpdate=f,t=l.shared.interleaved,t!==null){l=t;do o|=l.lane,l=l.next;while(l!==t)}else i===null&&(l.shared.lanes=0);Vt|=o,e.lanes=o,e.memoizedState=m}}function Cs(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(v(191,l));l.call(r)}}}var hr={},Ye=Nt(hr),ur=Nt(hr),sr=Nt(hr);function Ft(e){if(e===hr)throw Error(v(174));return e}function Wo(e,t){switch(L(sr,t),L(ur,e),L(Ye,hr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Fi(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Fi(t,e)}M(Ye),L(Ye,t)}function wn(){M(Ye),M(ur),M(sr)}function qa(e){Ft(sr.current);var t=Ft(Ye.current),n=Fi(t,e.type);t!==n&&(L(ur,e),L(Ye,n))}function Ho(e){ur.current===e&&(M(Ye),M(ur))}var j=Nt(0);function vl(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var wi=[];function Qo(){for(var e=0;e<wi.length;e++)wi[e]._workInProgressVersionPrimary=null;wi.length=0}var Gr=ut.ReactCurrentDispatcher,_i=ut.ReactCurrentBatchConfig,Bt=0,U=null,K=null,X=null,yl=!1,Qn=!1,ar=0,ap=0;function le(){throw Error(v(321))}function Ko(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ue(e[n],t[n]))return!1;return!0}function Yo(e,t,n,r,l,i){if(Bt=i,U=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Gr.current=e===null||e.memoizedState===null?pp:mp,e=n(r,l),Qn){i=0;do{if(Qn=!1,ar=0,25<=i)throw Error(v(301));i+=1,X=K=null,t.updateQueue=null,Gr.current=gp,e=n(r,l)}while(Qn)}if(Gr.current=wl,t=K!==null&&K.next!==null,Bt=0,X=K=U=null,yl=!1,t)throw Error(v(300));return e}function Go(){var e=ar!==0;return ar=0,e}function He(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return X===null?U.memoizedState=X=e:X=X.next=e,X}function Ie(){if(K===null){var e=U.alternate;e=e!==null?e.memoizedState:null}else e=K.next;var t=X===null?U.memoizedState:X.next;if(t!==null)X=t,K=e;else{if(e===null)throw Error(v(310));K=e,e={memoizedState:K.memoizedState,baseState:K.baseState,baseQueue:K.baseQueue,queue:K.queue,next:null},X===null?U.memoizedState=X=e:X=X.next=e}return X}function cr(e,t){return typeof t=="function"?t(e):t}function ki(e){var t=Ie(),n=t.queue;if(n===null)throw Error(v(311));n.lastRenderedReducer=e;var r=K,l=r.baseQueue,i=n.pending;if(i!==null){if(l!==null){var o=l.next;l.next=i.next,i.next=o}r.baseQueue=l=i,n.pending=null}if(l!==null){i=l.next,r=r.baseState;var u=o=null,s=null,a=i;do{var f=a.lane;if((Bt&f)===f)s!==null&&(s=s.next={lane:0,action:a.action,hasEagerState:a.hasEagerState,eagerState:a.eagerState,next:null}),r=a.hasEagerState?a.eagerState:e(r,a.action);else{var m={lane:f,action:a.action,hasEagerState:a.hasEagerState,eagerState:a.eagerState,next:null};s===null?(u=s=m,o=r):s=s.next=m,U.lanes|=f,Vt|=f}a=a.next}while(a!==null&&a!==i);s===null?o=r:s.next=u,Ue(r,t.memoizedState)||(me=!0),t.memoizedState=r,t.baseState=o,t.baseQueue=s,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do i=l.lane,U.lanes|=i,Vt|=i,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Si(e){var t=Ie(),n=t.queue;if(n===null)throw Error(v(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,i=t.memoizedState;if(l!==null){n.pending=null;var o=l=l.next;do i=e(i,o.action),o=o.next;while(o!==l);Ue(i,t.memoizedState)||(me=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,r]}function Za(){}function Ja(e,t){var n=U,r=Ie(),l=t(),i=!Ue(r.memoizedState,l);if(i&&(r.memoizedState=l,me=!0),r=r.queue,Xo(nc.bind(null,n,r,e),[e]),r.getSnapshot!==t||i||X!==null&&X.memoizedState.tag&1){if(n.flags|=2048,dr(9,tc.bind(null,n,r,l,t),void 0,null),q===null)throw Error(v(349));Bt&30||ec(n,t,l)}return l}function ec(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=U.updateQueue,t===null?(t={lastEffect:null,stores:null},U.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function tc(e,t,n,r){t.value=n,t.getSnapshot=r,rc(t)&&lc(e)}function nc(e,t,n){return n(function(){rc(t)&&lc(e)})}function rc(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ue(e,n)}catch{return!0}}function lc(e){var t=it(e,1);t!==null&&je(t,e,1,-1)}function Ps(e){var t=He();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:cr,lastRenderedState:e},t.queue=e,e=e.dispatch=fp.bind(null,U,e),[t.memoizedState,e]}function dr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=U.updateQueue,t===null?(t={lastEffect:null,stores:null},U.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function ic(){return Ie().memoizedState}function Xr(e,t,n,r){var l=He();U.flags|=e,l.memoizedState=dr(1|t,n,void 0,r===void 0?null:r)}function Il(e,t,n,r){var l=Ie();r=r===void 0?null:r;var i=void 0;if(K!==null){var o=K.memoizedState;if(i=o.destroy,r!==null&&Ko(r,o.deps)){l.memoizedState=dr(t,n,i,r);return}}U.flags|=e,l.memoizedState=dr(1|t,n,i,r)}function Ns(e,t){return Xr(8390656,8,e,t)}function Xo(e,t){return Il(2048,8,e,t)}function oc(e,t){return Il(4,2,e,t)}function uc(e,t){return Il(4,4,e,t)}function sc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function ac(e,t,n){return n=n!=null?n.concat([e]):null,Il(4,4,sc.bind(null,t,e),n)}function qo(){}function cc(e,t){var n=Ie();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Ko(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function dc(e,t){var n=Ie();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Ko(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function fc(e,t,n){return Bt&21?(Ue(n,t)||(n=va(),U.lanes|=n,Vt|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,me=!0),e.memoizedState=n)}function cp(e,t){var n=R;R=n!==0&&4>n?n:4,e(!0);var r=_i.transition;_i.transition={};try{e(!1),t()}finally{R=n,_i.transition=r}}function pc(){return Ie().memoizedState}function dp(e,t,n){var r=St(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},mc(e))gc(t,n);else if(n=Ga(e,t,n,r),n!==null){var l=de();je(n,e,r,l),hc(n,t,r)}}function fp(e,t,n){var r=St(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(mc(e))gc(t,l);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var o=t.lastRenderedState,u=i(o,n);if(l.hasEagerState=!0,l.eagerState=u,Ue(u,o)){var s=t.interleaved;s===null?(l.next=l,Vo(t)):(l.next=s.next,s.next=l),t.interleaved=l;return}}catch{}finally{}n=Ga(e,t,l,r),n!==null&&(l=de(),je(n,e,r,l),hc(n,t,r))}}function mc(e){var t=e.alternate;return e===U||t!==null&&t===U}function gc(e,t){Qn=yl=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function hc(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,To(e,n)}}var wl={readContext:Re,useCallback:le,useContext:le,useEffect:le,useImperativeHandle:le,useInsertionEffect:le,useLayoutEffect:le,useMemo:le,useReducer:le,useRef:le,useState:le,useDebugValue:le,useDeferredValue:le,useTransition:le,useMutableSource:le,useSyncExternalStore:le,useId:le,unstable_isNewReconciler:!1},pp={readContext:Re,useCallback:function(e,t){return He().memoizedState=[e,t===void 0?null:t],e},useContext:Re,useEffect:Ns,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Xr(4194308,4,sc.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Xr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Xr(4,2,e,t)},useMemo:function(e,t){var n=He();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=He();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=dp.bind(null,U,e),[r.memoizedState,e]},useRef:function(e){var t=He();return e={current:e},t.memoizedState=e},useState:Ps,useDebugValue:qo,useDeferredValue:function(e){return He().memoizedState=e},useTransition:function(){var e=Ps(!1),t=e[0];return e=cp.bind(null,e[1]),He().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=U,l=He();if(F){if(n===void 0)throw Error(v(407));n=n()}else{if(n=t(),q===null)throw Error(v(349));Bt&30||ec(r,t,n)}l.memoizedState=n;var i={value:n,getSnapshot:t};return l.queue=i,Ns(nc.bind(null,r,i,e),[e]),r.flags|=2048,dr(9,tc.bind(null,r,i,n,t),void 0,null),n},useId:function(){var e=He(),t=q.identifierPrefix;if(F){var n=tt,r=et;n=(r&~(1<<32-be(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=ar++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=ap++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},mp={readContext:Re,useCallback:cc,useContext:Re,useEffect:Xo,useImperativeHandle:ac,useInsertionEffect:oc,useLayoutEffect:uc,useMemo:dc,useReducer:ki,useRef:ic,useState:function(){return ki(cr)},useDebugValue:qo,useDeferredValue:function(e){var t=Ie();return fc(t,K.memoizedState,e)},useTransition:function(){var e=ki(cr)[0],t=Ie().memoizedState;return[e,t]},useMutableSource:Za,useSyncExternalStore:Ja,useId:pc,unstable_isNewReconciler:!1},gp={readContext:Re,useCallback:cc,useContext:Re,useEffect:Xo,useImperativeHandle:ac,useInsertionEffect:oc,useLayoutEffect:uc,useMemo:dc,useReducer:Si,useRef:ic,useState:function(){return Si(cr)},useDebugValue:qo,useDeferredValue:function(e){var t=Ie();return K===null?t.memoizedState=e:fc(t,K.memoizedState,e)},useTransition:function(){var e=Si(cr)[0],t=Ie().memoizedState;return[e,t]},useMutableSource:Za,useSyncExternalStore:Ja,useId:pc,unstable_isNewReconciler:!1};function De(e,t){if(e&&e.defaultProps){t=B({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ro(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:B({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ll={isMounted:function(e){return(e=e._reactInternals)?Ht(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=de(),l=St(e),i=nt(r,l);i.payload=t,n!=null&&(i.callback=n),t=_t(e,i,l),t!==null&&(je(t,e,l,r),Yr(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=de(),l=St(e),i=nt(r,l);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=_t(e,i,l),t!==null&&(je(t,e,l,r),Yr(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=de(),r=St(e),l=nt(n,r);l.tag=2,t!=null&&(l.callback=t),t=_t(e,l,r),t!==null&&(je(t,e,r,n),Yr(t,e,r))}};function Ts(e,t,n,r,l,i,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,i,o):t.prototype&&t.prototype.isPureReactComponent?!rr(n,r)||!rr(l,i):!0}function vc(e,t,n){var r=!1,l=Ct,i=t.contextType;return typeof i=="object"&&i!==null?i=Re(i):(l=he(t)?jt:ue.current,r=t.contextTypes,i=(r=r!=null)?hn(e,l):Ct),t=new t(n,i),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ll,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=i),t}function zs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Ll.enqueueReplaceState(t,t.state,null)}function lo(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},$o(e);var i=t.contextType;typeof i=="object"&&i!==null?l.context=Re(i):(i=he(t)?jt:ue.current,l.context=hn(e,i)),l.state=e.memoizedState,i=t.getDerivedStateFromProps,typeof i=="function"&&(ro(e,t,i,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&Ll.enqueueReplaceState(l,l.state,null),hl(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function _n(e,t){try{var n="",r=t;do n+=Wd(r),r=r.return;while(r);var l=n}catch(i){l=`
Error generating stack: `+i.message+`
`+i.stack}return{value:e,source:t,stack:l,digest:null}}function xi(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function io(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var hp=typeof WeakMap=="function"?WeakMap:Map;function yc(e,t,n){n=nt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){kl||(kl=!0,ho=r),io(e,t)},n}function wc(e,t,n){n=nt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){io(e,t)}}var i=e.stateNode;return i!==null&&typeof i.componentDidCatch=="function"&&(n.callback=function(){io(e,t),typeof r!="function"&&(kt===null?kt=new Set([this]):kt.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function Rs(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new hp;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Rp.bind(null,e,t,n),t.then(e,e))}function Is(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Ls(e,t,n,r,l){return e.mode&1?(e.flags|=65536,e.lanes=l,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=nt(-1,1),t.tag=2,_t(n,t,1))),n.lanes|=1),e)}var vp=ut.ReactCurrentOwner,me=!1;function ce(e,t,n,r){t.child=e===null?Ya(t,null,n,r):yn(t,e.child,n,r)}function Os(e,t,n,r,l){n=n.render;var i=t.ref;return pn(t,l),r=Yo(e,t,n,r,i,l),n=Go(),e!==null&&!me?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,ot(e,t,l)):(F&&n&&Fo(t),t.flags|=1,ce(e,t,r,l),t.child)}function Ms(e,t,n,r,l){if(e===null){var i=n.type;return typeof i=="function"&&!iu(i)&&i.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=i,_c(e,t,i,r,l)):(e=el(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!(e.lanes&l)){var o=i.memoizedProps;if(n=n.compare,n=n!==null?n:rr,n(o,r)&&e.ref===t.ref)return ot(e,t,l)}return t.flags|=1,e=xt(i,r),e.ref=t.ref,e.return=t,t.child=e}function _c(e,t,n,r,l){if(e!==null){var i=e.memoizedProps;if(rr(i,r)&&e.ref===t.ref)if(me=!1,t.pendingProps=r=i,(e.lanes&l)!==0)e.flags&131072&&(me=!0);else return t.lanes=e.lanes,ot(e,t,l)}return oo(e,t,n,r,l)}function kc(e,t,n){var r=t.pendingProps,l=r.children,i=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},L(sn,ye),ye|=n;else{if(!(n&1073741824))return e=i!==null?i.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,L(sn,ye),ye|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=i!==null?i.baseLanes:n,L(sn,ye),ye|=r}else i!==null?(r=i.baseLanes|n,t.memoizedState=null):r=n,L(sn,ye),ye|=r;return ce(e,t,l,n),t.child}function Sc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function oo(e,t,n,r,l){var i=he(n)?jt:ue.current;return i=hn(t,i),pn(t,l),n=Yo(e,t,n,r,i,l),r=Go(),e!==null&&!me?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,ot(e,t,l)):(F&&r&&Fo(t),t.flags|=1,ce(e,t,n,l),t.child)}function Ds(e,t,n,r,l){if(he(n)){var i=!0;dl(t)}else i=!1;if(pn(t,l),t.stateNode===null)qr(e,t),vc(t,n,r),lo(t,n,r,l),r=!0;else if(e===null){var o=t.stateNode,u=t.memoizedProps;o.props=u;var s=o.context,a=n.contextType;typeof a=="object"&&a!==null?a=Re(a):(a=he(n)?jt:ue.current,a=hn(t,a));var f=n.getDerivedStateFromProps,m=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function";m||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(u!==r||s!==a)&&zs(t,o,r,a),dt=!1;var g=t.memoizedState;o.state=g,hl(t,r,o,l),s=t.memoizedState,u!==r||g!==s||ge.current||dt?(typeof f=="function"&&(ro(t,n,f,r),s=t.memoizedState),(u=dt||Ts(t,n,u,r,g,s,a))?(m||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=s),o.props=r,o.state=s,o.context=a,r=u):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,Xa(e,t),u=t.memoizedProps,a=t.type===t.elementType?u:De(t.type,u),o.props=a,m=t.pendingProps,g=o.context,s=n.contextType,typeof s=="object"&&s!==null?s=Re(s):(s=he(n)?jt:ue.current,s=hn(t,s));var y=n.getDerivedStateFromProps;(f=typeof y=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(u!==m||g!==s)&&zs(t,o,r,s),dt=!1,g=t.memoizedState,o.state=g,hl(t,r,o,l);var w=t.memoizedState;u!==m||g!==w||ge.current||dt?(typeof y=="function"&&(ro(t,n,y,r),w=t.memoizedState),(a=dt||Ts(t,n,a,r,g,w,s)||!1)?(f||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,w,s),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,w,s)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=w),o.props=r,o.state=w,o.context=s,r=a):(typeof o.componentDidUpdate!="function"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),r=!1)}return uo(e,t,n,r,i,l)}function uo(e,t,n,r,l,i){Sc(e,t);var o=(t.flags&128)!==0;if(!r&&!o)return l&&_s(t,n,!1),ot(e,t,i);r=t.stateNode,vp.current=t;var u=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&o?(t.child=yn(t,e.child,null,i),t.child=yn(t,null,u,i)):ce(e,t,u,i),t.memoizedState=r.state,l&&_s(t,n,!0),t.child}function xc(e){var t=e.stateNode;t.pendingContext?ws(e,t.pendingContext,t.pendingContext!==t.context):t.context&&ws(e,t.context,!1),Wo(e,t.containerInfo)}function Fs(e,t,n,r,l){return vn(),bo(l),t.flags|=256,ce(e,t,n,r),t.child}var so={dehydrated:null,treeContext:null,retryLane:0};function ao(e){return{baseLanes:e,cachePool:null,transitions:null}}function Ec(e,t,n){var r=t.pendingProps,l=j.current,i=!1,o=(t.flags&128)!==0,u;if((u=o)||(u=e!==null&&e.memoizedState===null?!1:(l&2)!==0),u?(i=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),L(j,l&1),e===null)return to(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=r.children,e=r.fallback,i?(r=t.mode,i=t.child,o={mode:"hidden",children:o},!(r&1)&&i!==null?(i.childLanes=0,i.pendingProps=o):i=Dl(o,r,0,null),e=bt(e,r,n,null),i.return=t,e.return=t,i.sibling=e,t.child=i,t.child.memoizedState=ao(n),t.memoizedState=so,e):Zo(t,o));if(l=e.memoizedState,l!==null&&(u=l.dehydrated,u!==null))return yp(e,t,o,r,u,l,n);if(i){i=r.fallback,o=t.mode,l=e.child,u=l.sibling;var s={mode:"hidden",children:r.children};return!(o&1)&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=s,t.deletions=null):(r=xt(l,s),r.subtreeFlags=l.subtreeFlags&14680064),u!==null?i=xt(u,i):(i=bt(i,o,n,null),i.flags|=2),i.return=t,r.return=t,r.sibling=i,t.child=r,r=i,i=t.child,o=e.child.memoizedState,o=o===null?ao(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},i.memoizedState=o,i.childLanes=e.childLanes&~n,t.memoizedState=so,r}return i=e.child,e=i.sibling,r=xt(i,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Zo(e,t){return t=Dl({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Vr(e,t,n,r){return r!==null&&bo(r),yn(t,e.child,null,n),e=Zo(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function yp(e,t,n,r,l,i,o){if(n)return t.flags&256?(t.flags&=-257,r=xi(Error(v(422))),Vr(e,t,o,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(i=r.fallback,l=t.mode,r=Dl({mode:"visible",children:r.children},l,0,null),i=bt(i,l,o,null),i.flags|=2,r.return=t,i.return=t,r.sibling=i,t.child=r,t.mode&1&&yn(t,e.child,null,o),t.child.memoizedState=ao(o),t.memoizedState=so,i);if(!(t.mode&1))return Vr(e,t,o,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var u=r.dgst;return r=u,i=Error(v(419)),r=xi(i,r,void 0),Vr(e,t,o,r)}if(u=(o&e.childLanes)!==0,me||u){if(r=q,r!==null){switch(o&-o){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=l&(r.suspendedLanes|o)?0:l,l!==0&&l!==i.retryLane&&(i.retryLane=l,it(e,l),je(r,e,l,-1))}return lu(),r=xi(Error(v(421))),Vr(e,t,o,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Ip.bind(null,e),l._reactRetry=t,null):(e=i.treeContext,we=wt(l.nextSibling),_e=t,F=!0,Ae=null,e!==null&&(Pe[Ne++]=et,Pe[Ne++]=tt,Pe[Ne++]=Ut,et=e.id,tt=e.overflow,Ut=t),t=Zo(t,r.children),t.flags|=4096,t)}function As(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),no(e.return,t,n)}function Ei(e,t,n,r,l){var i=e.memoizedState;i===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(i.isBackwards=t,i.rendering=null,i.renderingStartTime=0,i.last=r,i.tail=n,i.tailMode=l)}function Cc(e,t,n){var r=t.pendingProps,l=r.revealOrder,i=r.tail;if(ce(e,t,r.children,n),r=j.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&As(e,n,t);else if(e.tag===19)As(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(L(j,r),!(t.mode&1))t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&vl(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Ei(t,!1,l,n,i);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&vl(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Ei(t,!0,n,null,i);break;case"together":Ei(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function qr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function ot(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Vt|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(v(153));if(t.child!==null){for(e=t.child,n=xt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=xt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function wp(e,t,n){switch(t.tag){case 3:xc(t),vn();break;case 5:qa(t);break;case 1:he(t.type)&&dl(t);break;case 4:Wo(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;L(ml,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(L(j,j.current&1),t.flags|=128,null):n&t.child.childLanes?Ec(e,t,n):(L(j,j.current&1),e=ot(e,t,n),e!==null?e.sibling:null);L(j,j.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return Cc(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),L(j,j.current),r)break;return null;case 22:case 23:return t.lanes=0,kc(e,t,n)}return ot(e,t,n)}var Pc,co,Nc,Tc;Pc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};co=function(){};Nc=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,Ft(Ye.current);var i=null;switch(n){case"input":l=Li(e,l),r=Li(e,r),i=[];break;case"select":l=B({},l,{value:void 0}),r=B({},r,{value:void 0}),i=[];break;case"textarea":l=Di(e,l),r=Di(e,r),i=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=al)}Ai(n,r);var o;n=null;for(a in l)if(!r.hasOwnProperty(a)&&l.hasOwnProperty(a)&&l[a]!=null)if(a==="style"){var u=l[a];for(o in u)u.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else a!=="dangerouslySetInnerHTML"&&a!=="children"&&a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(Xn.hasOwnProperty(a)?i||(i=[]):(i=i||[]).push(a,null));for(a in r){var s=r[a];if(u=l!=null?l[a]:void 0,r.hasOwnProperty(a)&&s!==u&&(s!=null||u!=null))if(a==="style")if(u){for(o in u)!u.hasOwnProperty(o)||s&&s.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in s)s.hasOwnProperty(o)&&u[o]!==s[o]&&(n||(n={}),n[o]=s[o])}else n||(i||(i=[]),i.push(a,n)),n=s;else a==="dangerouslySetInnerHTML"?(s=s?s.__html:void 0,u=u?u.__html:void 0,s!=null&&u!==s&&(i=i||[]).push(a,s)):a==="children"?typeof s!="string"&&typeof s!="number"||(i=i||[]).push(a,""+s):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&(Xn.hasOwnProperty(a)?(s!=null&&a==="onScroll"&&O("scroll",e),i||u===s||(i=[])):(i=i||[]).push(a,s))}n&&(i=i||[]).push("style",n);var a=i;(t.updateQueue=a)&&(t.flags|=4)}};Tc=function(e,t,n,r){n!==r&&(t.flags|=4)};function Mn(e,t){if(!F)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function ie(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function _p(e,t,n){var r=t.pendingProps;switch(Ao(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ie(t),null;case 1:return he(t.type)&&cl(),ie(t),null;case 3:return r=t.stateNode,wn(),M(ge),M(ue),Qo(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Ur(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Ae!==null&&(wo(Ae),Ae=null))),co(e,t),ie(t),null;case 5:Ho(t);var l=Ft(sr.current);if(n=t.type,e!==null&&t.stateNode!=null)Nc(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(v(166));return ie(t),null}if(e=Ft(Ye.current),Ur(t)){r=t.stateNode,n=t.type;var i=t.memoizedProps;switch(r[Qe]=t,r[or]=i,e=(t.mode&1)!==0,n){case"dialog":O("cancel",r),O("close",r);break;case"iframe":case"object":case"embed":O("load",r);break;case"video":case"audio":for(l=0;l<Un.length;l++)O(Un[l],r);break;case"source":O("error",r);break;case"img":case"image":case"link":O("error",r),O("load",r);break;case"details":O("toggle",r);break;case"input":Hu(r,i),O("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!i.multiple},O("invalid",r);break;case"textarea":Ku(r,i),O("invalid",r)}Ai(n,i),l=null;for(var o in i)if(i.hasOwnProperty(o)){var u=i[o];o==="children"?typeof u=="string"?r.textContent!==u&&(i.suppressHydrationWarning!==!0&&jr(r.textContent,u,e),l=["children",u]):typeof u=="number"&&r.textContent!==""+u&&(i.suppressHydrationWarning!==!0&&jr(r.textContent,u,e),l=["children",""+u]):Xn.hasOwnProperty(o)&&u!=null&&o==="onScroll"&&O("scroll",r)}switch(n){case"input":Nr(r),Qu(r,i,!0);break;case"textarea":Nr(r),Yu(r);break;case"select":case"option":break;default:typeof i.onClick=="function"&&(r.onclick=al)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{o=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=na(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(n,{is:r.is}):(e=o.createElement(n),n==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,n),e[Qe]=t,e[or]=r,Pc(e,t,!1,!1),t.stateNode=e;e:{switch(o=bi(n,r),n){case"dialog":O("cancel",e),O("close",e),l=r;break;case"iframe":case"object":case"embed":O("load",e),l=r;break;case"video":case"audio":for(l=0;l<Un.length;l++)O(Un[l],e);l=r;break;case"source":O("error",e),l=r;break;case"img":case"image":case"link":O("error",e),O("load",e),l=r;break;case"details":O("toggle",e),l=r;break;case"input":Hu(e,r),l=Li(e,r),O("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=B({},r,{value:void 0}),O("invalid",e);break;case"textarea":Ku(e,r),l=Di(e,r),O("invalid",e);break;default:l=r}Ai(n,l),u=l;for(i in u)if(u.hasOwnProperty(i)){var s=u[i];i==="style"?ia(e,s):i==="dangerouslySetInnerHTML"?(s=s?s.__html:void 0,s!=null&&ra(e,s)):i==="children"?typeof s=="string"?(n!=="textarea"||s!=="")&&qn(e,s):typeof s=="number"&&qn(e,""+s):i!=="suppressContentEditableWarning"&&i!=="suppressHydrationWarning"&&i!=="autoFocus"&&(Xn.hasOwnProperty(i)?s!=null&&i==="onScroll"&&O("scroll",e):s!=null&&So(e,i,s,o))}switch(n){case"input":Nr(e),Qu(e,r,!1);break;case"textarea":Nr(e),Yu(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Et(r.value));break;case"select":e.multiple=!!r.multiple,i=r.value,i!=null?an(e,!!r.multiple,i,!1):r.defaultValue!=null&&an(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=al)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return ie(t),null;case 6:if(e&&t.stateNode!=null)Tc(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(v(166));if(n=Ft(sr.current),Ft(Ye.current),Ur(t)){if(r=t.stateNode,n=t.memoizedProps,r[Qe]=t,(i=r.nodeValue!==n)&&(e=_e,e!==null))switch(e.tag){case 3:jr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&jr(r.nodeValue,n,(e.mode&1)!==0)}i&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Qe]=t,t.stateNode=r}return ie(t),null;case 13:if(M(j),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(F&&we!==null&&t.mode&1&&!(t.flags&128))Qa(),vn(),t.flags|=98560,i=!1;else if(i=Ur(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(v(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(v(317));i[Qe]=t}else vn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;ie(t),i=!1}else Ae!==null&&(wo(Ae),Ae=null),i=!0;if(!i)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||j.current&1?Y===0&&(Y=3):lu())),t.updateQueue!==null&&(t.flags|=4),ie(t),null);case 4:return wn(),co(e,t),e===null&&lr(t.stateNode.containerInfo),ie(t),null;case 10:return Bo(t.type._context),ie(t),null;case 17:return he(t.type)&&cl(),ie(t),null;case 19:if(M(j),i=t.memoizedState,i===null)return ie(t),null;if(r=(t.flags&128)!==0,o=i.rendering,o===null)if(r)Mn(i,!1);else{if(Y!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=vl(e),o!==null){for(t.flags|=128,Mn(i,!1),r=o.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)i=n,e=r,i.flags&=14680066,o=i.alternate,o===null?(i.childLanes=0,i.lanes=e,i.child=null,i.subtreeFlags=0,i.memoizedProps=null,i.memoizedState=null,i.updateQueue=null,i.dependencies=null,i.stateNode=null):(i.childLanes=o.childLanes,i.lanes=o.lanes,i.child=o.child,i.subtreeFlags=0,i.deletions=null,i.memoizedProps=o.memoizedProps,i.memoizedState=o.memoizedState,i.updateQueue=o.updateQueue,i.type=o.type,e=o.dependencies,i.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return L(j,j.current&1|2),t.child}e=e.sibling}i.tail!==null&&$()>kn&&(t.flags|=128,r=!0,Mn(i,!1),t.lanes=4194304)}else{if(!r)if(e=vl(o),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Mn(i,!0),i.tail===null&&i.tailMode==="hidden"&&!o.alternate&&!F)return ie(t),null}else 2*$()-i.renderingStartTime>kn&&n!==1073741824&&(t.flags|=128,r=!0,Mn(i,!1),t.lanes=4194304);i.isBackwards?(o.sibling=t.child,t.child=o):(n=i.last,n!==null?n.sibling=o:t.child=o,i.last=o)}return i.tail!==null?(t=i.tail,i.rendering=t,i.tail=t.sibling,i.renderingStartTime=$(),t.sibling=null,n=j.current,L(j,r?n&1|2:n&1),t):(ie(t),null);case 22:case 23:return ru(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?ye&1073741824&&(ie(t),t.subtreeFlags&6&&(t.flags|=8192)):ie(t),null;case 24:return null;case 25:return null}throw Error(v(156,t.tag))}function kp(e,t){switch(Ao(t),t.tag){case 1:return he(t.type)&&cl(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return wn(),M(ge),M(ue),Qo(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return Ho(t),null;case 13:if(M(j),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(v(340));vn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return M(j),null;case 4:return wn(),null;case 10:return Bo(t.type._context),null;case 22:case 23:return ru(),null;case 24:return null;default:return null}}var $r=!1,oe=!1,Sp=typeof WeakSet=="function"?WeakSet:Set,k=null;function un(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){V(e,t,r)}else n.current=null}function fo(e,t,n){try{n()}catch(r){V(e,t,r)}}var bs=!1;function xp(e,t){if(Yi=ol,e=Oa(),Do(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,i=r.focusNode;r=r.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var o=0,u=-1,s=-1,a=0,f=0,m=e,g=null;t:for(;;){for(var y;m!==n||l!==0&&m.nodeType!==3||(u=o+l),m!==i||r!==0&&m.nodeType!==3||(s=o+r),m.nodeType===3&&(o+=m.nodeValue.length),(y=m.firstChild)!==null;)g=m,m=y;for(;;){if(m===e)break t;if(g===n&&++a===l&&(u=o),g===i&&++f===r&&(s=o),(y=m.nextSibling)!==null)break;m=g,g=m.parentNode}m=y}n=u===-1||s===-1?null:{start:u,end:s}}else n=null}n=n||{start:0,end:0}}else n=null;for(Gi={focusedElem:e,selectionRange:n},ol=!1,k=t;k!==null;)if(t=k,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,k=e;else for(;k!==null;){t=k;try{var w=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(w!==null){var _=w.memoizedProps,A=w.memoizedState,d=t.stateNode,c=d.getSnapshotBeforeUpdate(t.elementType===t.type?_:De(t.type,_),A);d.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var p=t.stateNode.containerInfo;p.nodeType===1?p.textContent="":p.nodeType===9&&p.documentElement&&p.removeChild(p.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(v(163))}}catch(h){V(t,t.return,h)}if(e=t.sibling,e!==null){e.return=t.return,k=e;break}k=t.return}return w=bs,bs=!1,w}function Kn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var i=l.destroy;l.destroy=void 0,i!==void 0&&fo(t,n,i)}l=l.next}while(l!==r)}}function Ol(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function po(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function zc(e){var t=e.alternate;t!==null&&(e.alternate=null,zc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Qe],delete t[or],delete t[Zi],delete t[ip],delete t[op])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Rc(e){return e.tag===5||e.tag===3||e.tag===4}function js(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Rc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function mo(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=al));else if(r!==4&&(e=e.child,e!==null))for(mo(e,t,n),e=e.sibling;e!==null;)mo(e,t,n),e=e.sibling}function go(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(go(e,t,n),e=e.sibling;e!==null;)go(e,t,n),e=e.sibling}var J=null,Fe=!1;function at(e,t,n){for(n=n.child;n!==null;)Ic(e,t,n),n=n.sibling}function Ic(e,t,n){if(Ke&&typeof Ke.onCommitFiberUnmount=="function")try{Ke.onCommitFiberUnmount(Cl,n)}catch{}switch(n.tag){case 5:oe||un(n,t);case 6:var r=J,l=Fe;J=null,at(e,t,n),J=r,Fe=l,J!==null&&(Fe?(e=J,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):J.removeChild(n.stateNode));break;case 18:J!==null&&(Fe?(e=J,n=n.stateNode,e.nodeType===8?vi(e.parentNode,n):e.nodeType===1&&vi(e,n),tr(e)):vi(J,n.stateNode));break;case 4:r=J,l=Fe,J=n.stateNode.containerInfo,Fe=!0,at(e,t,n),J=r,Fe=l;break;case 0:case 11:case 14:case 15:if(!oe&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var i=l,o=i.destroy;i=i.tag,o!==void 0&&(i&2||i&4)&&fo(n,t,o),l=l.next}while(l!==r)}at(e,t,n);break;case 1:if(!oe&&(un(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(u){V(n,t,u)}at(e,t,n);break;case 21:at(e,t,n);break;case 22:n.mode&1?(oe=(r=oe)||n.memoizedState!==null,at(e,t,n),oe=r):at(e,t,n);break;default:at(e,t,n)}}function Us(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Sp),t.forEach(function(r){var l=Lp.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Me(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var i=e,o=t,u=o;e:for(;u!==null;){switch(u.tag){case 5:J=u.stateNode,Fe=!1;break e;case 3:J=u.stateNode.containerInfo,Fe=!0;break e;case 4:J=u.stateNode.containerInfo,Fe=!0;break e}u=u.return}if(J===null)throw Error(v(160));Ic(i,o,l),J=null,Fe=!1;var s=l.alternate;s!==null&&(s.return=null),l.return=null}catch(a){V(l,t,a)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Lc(t,e),t=t.sibling}function Lc(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Me(t,e),We(e),r&4){try{Kn(3,e,e.return),Ol(3,e)}catch(_){V(e,e.return,_)}try{Kn(5,e,e.return)}catch(_){V(e,e.return,_)}}break;case 1:Me(t,e),We(e),r&512&&n!==null&&un(n,n.return);break;case 5:if(Me(t,e),We(e),r&512&&n!==null&&un(n,n.return),e.flags&32){var l=e.stateNode;try{qn(l,"")}catch(_){V(e,e.return,_)}}if(r&4&&(l=e.stateNode,l!=null)){var i=e.memoizedProps,o=n!==null?n.memoizedProps:i,u=e.type,s=e.updateQueue;if(e.updateQueue=null,s!==null)try{u==="input"&&i.type==="radio"&&i.name!=null&&ea(l,i),bi(u,o);var a=bi(u,i);for(o=0;o<s.length;o+=2){var f=s[o],m=s[o+1];f==="style"?ia(l,m):f==="dangerouslySetInnerHTML"?ra(l,m):f==="children"?qn(l,m):So(l,f,m,a)}switch(u){case"input":Oi(l,i);break;case"textarea":ta(l,i);break;case"select":var g=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!i.multiple;var y=i.value;y!=null?an(l,!!i.multiple,y,!1):g!==!!i.multiple&&(i.defaultValue!=null?an(l,!!i.multiple,i.defaultValue,!0):an(l,!!i.multiple,i.multiple?[]:"",!1))}l[or]=i}catch(_){V(e,e.return,_)}}break;case 6:if(Me(t,e),We(e),r&4){if(e.stateNode===null)throw Error(v(162));l=e.stateNode,i=e.memoizedProps;try{l.nodeValue=i}catch(_){V(e,e.return,_)}}break;case 3:if(Me(t,e),We(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{tr(t.containerInfo)}catch(_){V(e,e.return,_)}break;case 4:Me(t,e),We(e);break;case 13:Me(t,e),We(e),l=e.child,l.flags&8192&&(i=l.memoizedState!==null,l.stateNode.isHidden=i,!i||l.alternate!==null&&l.alternate.memoizedState!==null||(tu=$())),r&4&&Us(e);break;case 22:if(f=n!==null&&n.memoizedState!==null,e.mode&1?(oe=(a=oe)||f,Me(t,e),oe=a):Me(t,e),We(e),r&8192){if(a=e.memoizedState!==null,(e.stateNode.isHidden=a)&&!f&&e.mode&1)for(k=e,f=e.child;f!==null;){for(m=k=f;k!==null;){switch(g=k,y=g.child,g.tag){case 0:case 11:case 14:case 15:Kn(4,g,g.return);break;case 1:un(g,g.return);var w=g.stateNode;if(typeof w.componentWillUnmount=="function"){r=g,n=g.return;try{t=r,w.props=t.memoizedProps,w.state=t.memoizedState,w.componentWillUnmount()}catch(_){V(r,n,_)}}break;case 5:un(g,g.return);break;case 22:if(g.memoizedState!==null){Vs(m);continue}}y!==null?(y.return=g,k=y):Vs(m)}f=f.sibling}e:for(f=null,m=e;;){if(m.tag===5){if(f===null){f=m;try{l=m.stateNode,a?(i=l.style,typeof i.setProperty=="function"?i.setProperty("display","none","important"):i.display="none"):(u=m.stateNode,s=m.memoizedProps.style,o=s!=null&&s.hasOwnProperty("display")?s.display:null,u.style.display=la("display",o))}catch(_){V(e,e.return,_)}}}else if(m.tag===6){if(f===null)try{m.stateNode.nodeValue=a?"":m.memoizedProps}catch(_){V(e,e.return,_)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===e)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===e)break e;for(;m.sibling===null;){if(m.return===null||m.return===e)break e;f===m&&(f=null),m=m.return}f===m&&(f=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Me(t,e),We(e),r&4&&Us(e);break;case 21:break;default:Me(t,e),We(e)}}function We(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Rc(n)){var r=n;break e}n=n.return}throw Error(v(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(qn(l,""),r.flags&=-33);var i=js(e);go(e,i,l);break;case 3:case 4:var o=r.stateNode.containerInfo,u=js(e);mo(e,u,o);break;default:throw Error(v(161))}}catch(s){V(e,e.return,s)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Ep(e,t,n){k=e,Oc(e,t,n)}function Oc(e,t,n){for(var r=(e.mode&1)!==0;k!==null;){var l=k,i=l.child;if(l.tag===22&&r){var o=l.memoizedState!==null||$r;if(!o){var u=l.alternate,s=u!==null&&u.memoizedState!==null||oe;u=$r;var a=oe;if($r=o,(oe=s)&&!a)for(k=l;k!==null;)o=k,s=o.child,o.tag===22&&o.memoizedState!==null?$s(l):s!==null?(s.return=o,k=s):$s(l);for(;i!==null;)k=i,Oc(i,t,n),i=i.sibling;k=l,$r=u,oe=a}Bs(e,t,n)}else l.subtreeFlags&8772&&i!==null?(i.return=l,k=i):Bs(e,t,n)}}function Bs(e){for(;k!==null;){var t=k;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:oe||Ol(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!oe)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:De(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var i=t.updateQueue;i!==null&&Cs(t,i,r);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Cs(t,o,n)}break;case 5:var u=t.stateNode;if(n===null&&t.flags&4){n=u;var s=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":s.autoFocus&&n.focus();break;case"img":s.src&&(n.src=s.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var a=t.alternate;if(a!==null){var f=a.memoizedState;if(f!==null){var m=f.dehydrated;m!==null&&tr(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(v(163))}oe||t.flags&512&&po(t)}catch(g){V(t,t.return,g)}}if(t===e){k=null;break}if(n=t.sibling,n!==null){n.return=t.return,k=n;break}k=t.return}}function Vs(e){for(;k!==null;){var t=k;if(t===e){k=null;break}var n=t.sibling;if(n!==null){n.return=t.return,k=n;break}k=t.return}}function $s(e){for(;k!==null;){var t=k;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ol(4,t)}catch(s){V(t,n,s)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(s){V(t,l,s)}}var i=t.return;try{po(t)}catch(s){V(t,i,s)}break;case 5:var o=t.return;try{po(t)}catch(s){V(t,o,s)}}}catch(s){V(t,t.return,s)}if(t===e){k=null;break}var u=t.sibling;if(u!==null){u.return=t.return,k=u;break}k=t.return}}var Cp=Math.ceil,_l=ut.ReactCurrentDispatcher,Jo=ut.ReactCurrentOwner,ze=ut.ReactCurrentBatchConfig,T=0,q=null,Q=null,ee=0,ye=0,sn=Nt(0),Y=0,fr=null,Vt=0,Ml=0,eu=0,Yn=null,pe=null,tu=0,kn=1/0,Ze=null,kl=!1,ho=null,kt=null,Wr=!1,gt=null,Sl=0,Gn=0,vo=null,Zr=-1,Jr=0;function de(){return T&6?$():Zr!==-1?Zr:Zr=$()}function St(e){return e.mode&1?T&2&&ee!==0?ee&-ee:sp.transition!==null?(Jr===0&&(Jr=va()),Jr):(e=R,e!==0||(e=window.event,e=e===void 0?16:Ea(e.type)),e):1}function je(e,t,n,r){if(50<Gn)throw Gn=0,vo=null,Error(v(185));pr(e,n,r),(!(T&2)||e!==q)&&(e===q&&(!(T&2)&&(Ml|=n),Y===4&&pt(e,ee)),ve(e,r),n===1&&T===0&&!(t.mode&1)&&(kn=$()+500,Rl&&Tt()))}function ve(e,t){var n=e.callbackNode;cf(e,t);var r=il(e,e===q?ee:0);if(r===0)n!==null&&qu(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&qu(n),t===1)e.tag===0?up(Ws.bind(null,e)):$a(Ws.bind(null,e)),rp(function(){!(T&6)&&Tt()}),n=null;else{switch(ya(r)){case 1:n=No;break;case 4:n=ga;break;case 16:n=ll;break;case 536870912:n=ha;break;default:n=ll}n=Bc(n,Mc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Mc(e,t){if(Zr=-1,Jr=0,T&6)throw Error(v(327));var n=e.callbackNode;if(mn()&&e.callbackNode!==n)return null;var r=il(e,e===q?ee:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=xl(e,r);else{t=r;var l=T;T|=2;var i=Fc();(q!==e||ee!==t)&&(Ze=null,kn=$()+500,At(e,t));do try{Tp();break}catch(u){Dc(e,u)}while(!0);Uo(),_l.current=i,T=l,Q!==null?t=0:(q=null,ee=0,t=Y)}if(t!==0){if(t===2&&(l=$i(e),l!==0&&(r=l,t=yo(e,l))),t===1)throw n=fr,At(e,0),pt(e,r),ve(e,$()),n;if(t===6)pt(e,r);else{if(l=e.current.alternate,!(r&30)&&!Pp(l)&&(t=xl(e,r),t===2&&(i=$i(e),i!==0&&(r=i,t=yo(e,i))),t===1))throw n=fr,At(e,0),pt(e,r),ve(e,$()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(v(345));case 2:Ot(e,pe,Ze);break;case 3:if(pt(e,r),(r&130023424)===r&&(t=tu+500-$(),10<t)){if(il(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){de(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=qi(Ot.bind(null,e,pe,Ze),t);break}Ot(e,pe,Ze);break;case 4:if(pt(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var o=31-be(r);i=1<<o,o=t[o],o>l&&(l=o),r&=~i}if(r=l,r=$()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Cp(r/1960))-r,10<r){e.timeoutHandle=qi(Ot.bind(null,e,pe,Ze),r);break}Ot(e,pe,Ze);break;case 5:Ot(e,pe,Ze);break;default:throw Error(v(329))}}}return ve(e,$()),e.callbackNode===n?Mc.bind(null,e):null}function yo(e,t){var n=Yn;return e.current.memoizedState.isDehydrated&&(At(e,t).flags|=256),e=xl(e,t),e!==2&&(t=pe,pe=n,t!==null&&wo(t)),e}function wo(e){pe===null?pe=e:pe.push.apply(pe,e)}function Pp(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],i=l.getSnapshot;l=l.value;try{if(!Ue(i(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function pt(e,t){for(t&=~eu,t&=~Ml,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-be(t),r=1<<n;e[n]=-1,t&=~r}}function Ws(e){if(T&6)throw Error(v(327));mn();var t=il(e,0);if(!(t&1))return ve(e,$()),null;var n=xl(e,t);if(e.tag!==0&&n===2){var r=$i(e);r!==0&&(t=r,n=yo(e,r))}if(n===1)throw n=fr,At(e,0),pt(e,t),ve(e,$()),n;if(n===6)throw Error(v(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Ot(e,pe,Ze),ve(e,$()),null}function nu(e,t){var n=T;T|=1;try{return e(t)}finally{T=n,T===0&&(kn=$()+500,Rl&&Tt())}}function $t(e){gt!==null&&gt.tag===0&&!(T&6)&&mn();var t=T;T|=1;var n=ze.transition,r=R;try{if(ze.transition=null,R=1,e)return e()}finally{R=r,ze.transition=n,T=t,!(T&6)&&Tt()}}function ru(){ye=sn.current,M(sn)}function At(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,np(n)),Q!==null)for(n=Q.return;n!==null;){var r=n;switch(Ao(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&cl();break;case 3:wn(),M(ge),M(ue),Qo();break;case 5:Ho(r);break;case 4:wn();break;case 13:M(j);break;case 19:M(j);break;case 10:Bo(r.type._context);break;case 22:case 23:ru()}n=n.return}if(q=e,Q=e=xt(e.current,null),ee=ye=t,Y=0,fr=null,eu=Ml=Vt=0,pe=Yn=null,Dt!==null){for(t=0;t<Dt.length;t++)if(n=Dt[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,i=n.pending;if(i!==null){var o=i.next;i.next=l,r.next=o}n.pending=r}Dt=null}return e}function Dc(e,t){do{var n=Q;try{if(Uo(),Gr.current=wl,yl){for(var r=U.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}yl=!1}if(Bt=0,X=K=U=null,Qn=!1,ar=0,Jo.current=null,n===null||n.return===null){Y=1,fr=t,Q=null;break}e:{var i=e,o=n.return,u=n,s=t;if(t=ee,u.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){var a=s,f=u,m=f.tag;if(!(f.mode&1)&&(m===0||m===11||m===15)){var g=f.alternate;g?(f.updateQueue=g.updateQueue,f.memoizedState=g.memoizedState,f.lanes=g.lanes):(f.updateQueue=null,f.memoizedState=null)}var y=Is(o);if(y!==null){y.flags&=-257,Ls(y,o,u,i,t),y.mode&1&&Rs(i,a,t),t=y,s=a;var w=t.updateQueue;if(w===null){var _=new Set;_.add(s),t.updateQueue=_}else w.add(s);break e}else{if(!(t&1)){Rs(i,a,t),lu();break e}s=Error(v(426))}}else if(F&&u.mode&1){var A=Is(o);if(A!==null){!(A.flags&65536)&&(A.flags|=256),Ls(A,o,u,i,t),bo(_n(s,u));break e}}i=s=_n(s,u),Y!==4&&(Y=2),Yn===null?Yn=[i]:Yn.push(i),i=o;do{switch(i.tag){case 3:i.flags|=65536,t&=-t,i.lanes|=t;var d=yc(i,s,t);Es(i,d);break e;case 1:u=s;var c=i.type,p=i.stateNode;if(!(i.flags&128)&&(typeof c.getDerivedStateFromError=="function"||p!==null&&typeof p.componentDidCatch=="function"&&(kt===null||!kt.has(p)))){i.flags|=65536,t&=-t,i.lanes|=t;var h=wc(i,u,t);Es(i,h);break e}}i=i.return}while(i!==null)}bc(n)}catch(S){t=S,Q===n&&n!==null&&(Q=n=n.return);continue}break}while(!0)}function Fc(){var e=_l.current;return _l.current=wl,e===null?wl:e}function lu(){(Y===0||Y===3||Y===2)&&(Y=4),q===null||!(Vt&268435455)&&!(Ml&268435455)||pt(q,ee)}function xl(e,t){var n=T;T|=2;var r=Fc();(q!==e||ee!==t)&&(Ze=null,At(e,t));do try{Np();break}catch(l){Dc(e,l)}while(!0);if(Uo(),T=n,_l.current=r,Q!==null)throw Error(v(261));return q=null,ee=0,Y}function Np(){for(;Q!==null;)Ac(Q)}function Tp(){for(;Q!==null&&!ef();)Ac(Q)}function Ac(e){var t=Uc(e.alternate,e,ye);e.memoizedProps=e.pendingProps,t===null?bc(e):Q=t,Jo.current=null}function bc(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=kp(n,t),n!==null){n.flags&=32767,Q=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Y=6,Q=null;return}}else if(n=_p(n,t,ye),n!==null){Q=n;return}if(t=t.sibling,t!==null){Q=t;return}Q=t=e}while(t!==null);Y===0&&(Y=5)}function Ot(e,t,n){var r=R,l=ze.transition;try{ze.transition=null,R=1,zp(e,t,n,r)}finally{ze.transition=l,R=r}return null}function zp(e,t,n,r){do mn();while(gt!==null);if(T&6)throw Error(v(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(v(177));e.callbackNode=null,e.callbackPriority=0;var i=n.lanes|n.childLanes;if(df(e,i),e===q&&(Q=q=null,ee=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Wr||(Wr=!0,Bc(ll,function(){return mn(),null})),i=(n.flags&15990)!==0,n.subtreeFlags&15990||i){i=ze.transition,ze.transition=null;var o=R;R=1;var u=T;T|=4,Jo.current=null,xp(e,n),Lc(n,e),qf(Gi),ol=!!Yi,Gi=Yi=null,e.current=n,Ep(n,e,l),tf(),T=u,R=o,ze.transition=i}else e.current=n;if(Wr&&(Wr=!1,gt=e,Sl=l),i=e.pendingLanes,i===0&&(kt=null),lf(n.stateNode,r),ve(e,$()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(kl)throw kl=!1,e=ho,ho=null,e;return Sl&1&&e.tag!==0&&mn(),i=e.pendingLanes,i&1?e===vo?Gn++:(Gn=0,vo=e):Gn=0,Tt(),null}function mn(){if(gt!==null){var e=ya(Sl),t=ze.transition,n=R;try{if(ze.transition=null,R=16>e?16:e,gt===null)var r=!1;else{if(e=gt,gt=null,Sl=0,T&6)throw Error(v(331));var l=T;for(T|=4,k=e.current;k!==null;){var i=k,o=i.child;if(k.flags&16){var u=i.deletions;if(u!==null){for(var s=0;s<u.length;s++){var a=u[s];for(k=a;k!==null;){var f=k;switch(f.tag){case 0:case 11:case 15:Kn(8,f,i)}var m=f.child;if(m!==null)m.return=f,k=m;else for(;k!==null;){f=k;var g=f.sibling,y=f.return;if(zc(f),f===a){k=null;break}if(g!==null){g.return=y,k=g;break}k=y}}}var w=i.alternate;if(w!==null){var _=w.child;if(_!==null){w.child=null;do{var A=_.sibling;_.sibling=null,_=A}while(_!==null)}}k=i}}if(i.subtreeFlags&2064&&o!==null)o.return=i,k=o;else e:for(;k!==null;){if(i=k,i.flags&2048)switch(i.tag){case 0:case 11:case 15:Kn(9,i,i.return)}var d=i.sibling;if(d!==null){d.return=i.return,k=d;break e}k=i.return}}var c=e.current;for(k=c;k!==null;){o=k;var p=o.child;if(o.subtreeFlags&2064&&p!==null)p.return=o,k=p;else e:for(o=c;k!==null;){if(u=k,u.flags&2048)try{switch(u.tag){case 0:case 11:case 15:Ol(9,u)}}catch(S){V(u,u.return,S)}if(u===o){k=null;break e}var h=u.sibling;if(h!==null){h.return=u.return,k=h;break e}k=u.return}}if(T=l,Tt(),Ke&&typeof Ke.onPostCommitFiberRoot=="function")try{Ke.onPostCommitFiberRoot(Cl,e)}catch{}r=!0}return r}finally{R=n,ze.transition=t}}return!1}function Hs(e,t,n){t=_n(n,t),t=yc(e,t,1),e=_t(e,t,1),t=de(),e!==null&&(pr(e,1,t),ve(e,t))}function V(e,t,n){if(e.tag===3)Hs(e,e,n);else for(;t!==null;){if(t.tag===3){Hs(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(kt===null||!kt.has(r))){e=_n(n,e),e=wc(t,e,1),t=_t(t,e,1),e=de(),t!==null&&(pr(t,1,e),ve(t,e));break}}t=t.return}}function Rp(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=de(),e.pingedLanes|=e.suspendedLanes&n,q===e&&(ee&n)===n&&(Y===4||Y===3&&(ee&130023424)===ee&&500>$()-tu?At(e,0):eu|=n),ve(e,t)}function jc(e,t){t===0&&(e.mode&1?(t=Rr,Rr<<=1,!(Rr&130023424)&&(Rr=4194304)):t=1);var n=de();e=it(e,t),e!==null&&(pr(e,t,n),ve(e,n))}function Ip(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),jc(e,n)}function Lp(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(v(314))}r!==null&&r.delete(t),jc(e,n)}var Uc;Uc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ge.current)me=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return me=!1,wp(e,t,n);me=!!(e.flags&131072)}else me=!1,F&&t.flags&1048576&&Wa(t,pl,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;qr(e,t),e=t.pendingProps;var l=hn(t,ue.current);pn(t,n),l=Yo(null,t,r,e,l,n);var i=Go();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,he(r)?(i=!0,dl(t)):i=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,$o(t),l.updater=Ll,t.stateNode=l,l._reactInternals=t,lo(t,r,e,n),t=uo(null,t,r,!0,i,n)):(t.tag=0,F&&i&&Fo(t),ce(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(qr(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Mp(r),e=De(r,e),l){case 0:t=oo(null,t,r,e,n);break e;case 1:t=Ds(null,t,r,e,n);break e;case 11:t=Os(null,t,r,e,n);break e;case 14:t=Ms(null,t,r,De(r.type,e),n);break e}throw Error(v(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:De(r,l),oo(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:De(r,l),Ds(e,t,r,l,n);case 3:e:{if(xc(t),e===null)throw Error(v(387));r=t.pendingProps,i=t.memoizedState,l=i.element,Xa(e,t),hl(t,r,null,n);var o=t.memoizedState;if(r=o.element,i.isDehydrated)if(i={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){l=_n(Error(v(423)),t),t=Fs(e,t,r,n,l);break e}else if(r!==l){l=_n(Error(v(424)),t),t=Fs(e,t,r,n,l);break e}else for(we=wt(t.stateNode.containerInfo.firstChild),_e=t,F=!0,Ae=null,n=Ya(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(vn(),r===l){t=ot(e,t,n);break e}ce(e,t,r,n)}t=t.child}return t;case 5:return qa(t),e===null&&to(t),r=t.type,l=t.pendingProps,i=e!==null?e.memoizedProps:null,o=l.children,Xi(r,l)?o=null:i!==null&&Xi(r,i)&&(t.flags|=32),Sc(e,t),ce(e,t,o,n),t.child;case 6:return e===null&&to(t),null;case 13:return Ec(e,t,n);case 4:return Wo(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=yn(t,null,r,n):ce(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:De(r,l),Os(e,t,r,l,n);case 7:return ce(e,t,t.pendingProps,n),t.child;case 8:return ce(e,t,t.pendingProps.children,n),t.child;case 12:return ce(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,i=t.memoizedProps,o=l.value,L(ml,r._currentValue),r._currentValue=o,i!==null)if(Ue(i.value,o)){if(i.children===l.children&&!ge.current){t=ot(e,t,n);break e}}else for(i=t.child,i!==null&&(i.return=t);i!==null;){var u=i.dependencies;if(u!==null){o=i.child;for(var s=u.firstContext;s!==null;){if(s.context===r){if(i.tag===1){s=nt(-1,n&-n),s.tag=2;var a=i.updateQueue;if(a!==null){a=a.shared;var f=a.pending;f===null?s.next=s:(s.next=f.next,f.next=s),a.pending=s}}i.lanes|=n,s=i.alternate,s!==null&&(s.lanes|=n),no(i.return,n,t),u.lanes|=n;break}s=s.next}}else if(i.tag===10)o=i.type===t.type?null:i.child;else if(i.tag===18){if(o=i.return,o===null)throw Error(v(341));o.lanes|=n,u=o.alternate,u!==null&&(u.lanes|=n),no(o,n,t),o=i.sibling}else o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===t){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}ce(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,pn(t,n),l=Re(l),r=r(l),t.flags|=1,ce(e,t,r,n),t.child;case 14:return r=t.type,l=De(r,t.pendingProps),l=De(r.type,l),Ms(e,t,r,l,n);case 15:return _c(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:De(r,l),qr(e,t),t.tag=1,he(r)?(e=!0,dl(t)):e=!1,pn(t,n),vc(t,r,l),lo(t,r,l,n),uo(null,t,r,!0,e,n);case 19:return Cc(e,t,n);case 22:return kc(e,t,n)}throw Error(v(156,t.tag))};function Bc(e,t){return ma(e,t)}function Op(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Te(e,t,n,r){return new Op(e,t,n,r)}function iu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Mp(e){if(typeof e=="function")return iu(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Eo)return 11;if(e===Co)return 14}return 2}function xt(e,t){var n=e.alternate;return n===null?(n=Te(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function el(e,t,n,r,l,i){var o=2;if(r=e,typeof e=="function")iu(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case qt:return bt(n.children,l,i,t);case xo:o=8,l|=8;break;case Ti:return e=Te(12,n,t,l|2),e.elementType=Ti,e.lanes=i,e;case zi:return e=Te(13,n,t,l),e.elementType=zi,e.lanes=i,e;case Ri:return e=Te(19,n,t,l),e.elementType=Ri,e.lanes=i,e;case qs:return Dl(n,l,i,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Gs:o=10;break e;case Xs:o=9;break e;case Eo:o=11;break e;case Co:o=14;break e;case ct:o=16,r=null;break e}throw Error(v(130,e==null?e:typeof e,""))}return t=Te(o,n,t,l),t.elementType=e,t.type=r,t.lanes=i,t}function bt(e,t,n,r){return e=Te(7,e,r,t),e.lanes=n,e}function Dl(e,t,n,r){return e=Te(22,e,r,t),e.elementType=qs,e.lanes=n,e.stateNode={isHidden:!1},e}function Ci(e,t,n){return e=Te(6,e,null,t),e.lanes=n,e}function Pi(e,t,n){return t=Te(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Dp(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ai(0),this.expirationTimes=ai(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ai(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function ou(e,t,n,r,l,i,o,u,s){return e=new Dp(e,t,n,u,s),t===1?(t=1,i===!0&&(t|=8)):t=0,i=Te(3,null,null,t),e.current=i,i.stateNode=e,i.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},$o(i),e}function Fp(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Xt,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Vc(e){if(!e)return Ct;e=e._reactInternals;e:{if(Ht(e)!==e||e.tag!==1)throw Error(v(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(he(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(v(171))}if(e.tag===1){var n=e.type;if(he(n))return Va(e,n,t)}return t}function $c(e,t,n,r,l,i,o,u,s){return e=ou(n,r,!0,e,l,i,o,u,s),e.context=Vc(null),n=e.current,r=de(),l=St(n),i=nt(r,l),i.callback=t??null,_t(n,i,l),e.current.lanes=l,pr(e,l,r),ve(e,r),e}function Fl(e,t,n,r){var l=t.current,i=de(),o=St(l);return n=Vc(n),t.context===null?t.context=n:t.pendingContext=n,t=nt(i,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=_t(l,t,o),e!==null&&(je(e,l,o,i),Yr(e,l,o)),o}function El(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Qs(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function uu(e,t){Qs(e,t),(e=e.alternate)&&Qs(e,t)}function Ap(){return null}var Wc=typeof reportError=="function"?reportError:function(e){console.error(e)};function su(e){this._internalRoot=e}Al.prototype.render=su.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(v(409));Fl(e,t,null,null)};Al.prototype.unmount=su.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;$t(function(){Fl(null,e,null,null)}),t[lt]=null}};function Al(e){this._internalRoot=e}Al.prototype.unstable_scheduleHydration=function(e){if(e){var t=ka();e={blockedOn:null,target:e,priority:t};for(var n=0;n<ft.length&&t!==0&&t<ft[n].priority;n++);ft.splice(n,0,e),n===0&&xa(e)}};function au(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function bl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ks(){}function bp(e,t,n,r,l){if(l){if(typeof r=="function"){var i=r;r=function(){var a=El(o);i.call(a)}}var o=$c(t,r,e,0,null,!1,!1,"",Ks);return e._reactRootContainer=o,e[lt]=o.current,lr(e.nodeType===8?e.parentNode:e),$t(),o}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var u=r;r=function(){var a=El(s);u.call(a)}}var s=ou(e,0,!1,null,null,!1,!1,"",Ks);return e._reactRootContainer=s,e[lt]=s.current,lr(e.nodeType===8?e.parentNode:e),$t(function(){Fl(t,s,n,r)}),s}function jl(e,t,n,r,l){var i=n._reactRootContainer;if(i){var o=i;if(typeof l=="function"){var u=l;l=function(){var s=El(o);u.call(s)}}Fl(t,o,e,l)}else o=bp(n,t,e,l,r);return El(o)}wa=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=jn(t.pendingLanes);n!==0&&(To(t,n|1),ve(t,$()),!(T&6)&&(kn=$()+500,Tt()))}break;case 13:$t(function(){var r=it(e,1);if(r!==null){var l=de();je(r,e,1,l)}}),uu(e,1)}};zo=function(e){if(e.tag===13){var t=it(e,134217728);if(t!==null){var n=de();je(t,e,134217728,n)}uu(e,134217728)}};_a=function(e){if(e.tag===13){var t=St(e),n=it(e,t);if(n!==null){var r=de();je(n,e,t,r)}uu(e,t)}};ka=function(){return R};Sa=function(e,t){var n=R;try{return R=e,t()}finally{R=n}};Ui=function(e,t,n){switch(t){case"input":if(Oi(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=zl(r);if(!l)throw Error(v(90));Js(r),Oi(r,l)}}}break;case"textarea":ta(e,n);break;case"select":t=n.value,t!=null&&an(e,!!n.multiple,t,!1)}};sa=nu;aa=$t;var jp={usingClientEntryPoint:!1,Events:[gr,tn,zl,oa,ua,nu]},Dn={findFiberByHostInstance:Mt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Up={bundleType:Dn.bundleType,version:Dn.version,rendererPackageName:Dn.rendererPackageName,rendererConfig:Dn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ut.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=fa(e),e===null?null:e.stateNode},findFiberByHostInstance:Dn.findFiberByHostInstance||Ap,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Fn=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Fn.isDisabled&&Fn.supportsFiber))try{Cl=Fn.inject(Up),Ke=Fn}catch{}var Fn;xe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=jp;xe.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!au(t))throw Error(v(200));return Fp(e,t,null,n)};xe.createRoot=function(e,t){if(!au(e))throw Error(v(299));var n=!1,r="",l=Wc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=ou(e,1,!1,null,null,n,!1,r,l),e[lt]=t.current,lr(e.nodeType===8?e.parentNode:e),new su(t)};xe.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(v(188)):(e=Object.keys(e).join(","),Error(v(268,e)));return e=fa(t),e=e===null?null:e.stateNode,e};xe.flushSync=function(e){return $t(e)};xe.hydrate=function(e,t,n){if(!bl(t))throw Error(v(200));return jl(null,e,t,!0,n)};xe.hydrateRoot=function(e,t,n){if(!au(e))throw Error(v(405));var r=n!=null&&n.hydratedSources||null,l=!1,i="",o=Wc;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=$c(t,null,e,1,n??null,l,!1,i,o),e[lt]=t.current,lr(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new Al(t)};xe.render=function(e,t,n){if(!bl(t))throw Error(v(200));return jl(null,e,t,!1,n)};xe.unmountComponentAtNode=function(e){if(!bl(e))throw Error(v(40));return e._reactRootContainer?($t(function(){jl(null,null,e,!1,function(){e._reactRootContainer=null,e[lt]=null})}),!0):!1};xe.unstable_batchedUpdates=nu;xe.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!bl(n))throw Error(v(200));if(e==null||e._reactInternals===void 0)throw Error(v(38));return jl(e,t,n,!1,r)};xe.version="18.3.1-next-f1338f8080-20240426"});var Yc=Xe((pm,Kc)=>{"use strict";function Qc(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Qc)}catch(e){console.error(e)}}Qc(),Kc.exports=Hc()});var Xc=Xe(cu=>{"use strict";var Gc=Yc();cu.createRoot=Gc.createRoot,cu.hydrateRoot=Gc.hydrateRoot;var mm});var ud=Xe(Bl=>{"use strict";var Kp=qe(),Yp=Symbol.for("react.element"),Gp=Symbol.for("react.fragment"),Xp=Object.prototype.hasOwnProperty,qp=Kp.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Zp={key:!0,ref:!0,__self:!0,__source:!0};function od(e,t,n){var r,l={},i=null,o=null;n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(o=t.ref);for(r in t)Xp.call(t,r)&&!Zp.hasOwnProperty(r)&&(l[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)l[r]===void 0&&(l[r]=t[r]);return{$$typeof:Yp,type:e,key:i,ref:o,props:l,_owner:qp.current}}Bl.Fragment=Gp;Bl.jsx=od;Bl.jsxs=od});var ne=Xe((Sm,sd)=>{"use strict";sd.exports=ud()});var zt=b(qe()),hd=b(Xc());var Z=b(qe());function Zc(e,t,n){switch(n){case"volume":return Bp(e,t);case"bogo":return Vp(e,t);case"fbt":case"mix-match":case"fixed":return qc(e,t);case"free-gift":return $p(e,t);default:return qc(e,t)}}function Bp(e,t){let n=t[0];if(!n)return Ul();let r=n.price,l=e.quantity,i=r*l,o,u=0;switch(e.discountType){case"percentage":o=i*(1-e.discountValue/100);break;case"fixed":o=Math.max(0,i-e.discountValue);break;case"fixed_price":o=e.discountValue;break;case"free":u=1,o=r*(l-1);break;default:o=i}o=se(o);let s=se(i-o),a=i>0?Math.round(s/i*100):0,f=se(o/l),m=[],g=n.variantId||"";for(let y=0;y<l;y++)m.push({variantId:g,quantity:1,price:y<l-u?f:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:`${a}%`}});return{originalPrice:i,bundlePrice:o,savingsAmount:s,savingsPercent:a,perUnitPrice:f,freeItemsCount:u,lineItems:m}}function Vp(e,t){let n=t[0];if(!n)return Ul();let r=n.price,l=e.quantity,i=e.discountType==="free"?Math.floor(e.discountValue):0,o=l+i,u=se(r*o),s=se(r*l),a=se(u-s),f=u>0?Math.round(a/u*100):0,m=se(s/o),g=[],y=n.variantId||"";for(let w=0;w<o;w++)g.push({variantId:y,quantity:1,price:w<l?r:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:w>=l?"FREE":""}});return{originalPrice:u,bundlePrice:s,savingsAmount:a,savingsPercent:f,perUnitPrice:m,freeItemsCount:i,lineItems:g}}function qc(e,t){if(t.length===0)return Ul();let n=se(t.reduce((a,f)=>a+f.price*f.quantity,0)),r;switch(e.discountType){case"percentage":r=n*(1-e.discountValue/100);break;case"fixed":r=Math.max(0,n-e.discountValue);break;case"fixed_price":r=e.discountValue;break;default:r=n}r=se(r);let l=se(n-r),i=n>0?Math.round(l/n*100):0,o=t.reduce((a,f)=>a+f.quantity,0),u=o>0?se(r/o):0,s=t.map(a=>{let f=a.price*a.quantity,m=n>0?f/n:0,g=l*m;return{variantId:a.variantId||"",quantity:a.quantity,price:se(f-g),properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:`${i}%`}}});return{originalPrice:n,bundlePrice:r,savingsAmount:l,savingsPercent:i,perUnitPrice:u,freeItemsCount:0,lineItems:s}}function $p(e,t){if(t.length===0)return Ul();let n=t.slice(0,-1),r=t[t.length-1],l=se(t.reduce((m,g)=>m+g.price*g.quantity,0)),i=se(n.reduce((m,g)=>m+g.price*g.quantity,0)),o=se(r?r.price*r.quantity:0),u=l>0?Math.round(o/l*100):0,s=t.reduce((m,g)=>m+g.quantity,0),a=s>0?se(i/s):0,f=t.map((m,g)=>({variantId:m.variantId||"",quantity:m.quantity,price:g<t.length-1?m.price*m.quantity:0,properties:{_bundle_id:"",_bundle_tier:e.id,_bundle_discount:g===t.length-1?"FREE GIFT":""}}));return{originalPrice:l,bundlePrice:i,savingsAmount:o,savingsPercent:u,perUnitPrice:a,freeItemsCount:r?r.quantity:0,lineItems:f}}function Ul(){return{originalPrice:0,bundlePrice:0,savingsAmount:0,savingsPercent:0,perUnitPrice:0,freeItemsCount:0,lineItems:[]}}function se(e){return Math.round(e*100)/100}function Wp(e,t="${{amount}}"){let n=e/100,r={amount:n.toFixed(2),amount_no_decimals:Math.round(n).toString(),amount_with_comma_separator:n.toFixed(2).replace(".",",").replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1."),amount_no_decimals_with_comma_separator:Math.round(n).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1."),amount_with_apostrophe_separator:n.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1'"),amount_no_decimals_with_space_separator:Math.round(n).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1 "),amount_with_space_separator:n.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1 ")},l=t;for(let[i,o]of Object.entries(r))l=l.replace(`{{${i}}}`,o),l=l.replace(`{{ ${i} }}`,o);return l}function Be(e,t="${{amount}}"){return Wp(Math.round(e*100),t)}function Jc(e){return e<=0?"":`${Math.round(e)}% OFF`}function ed(e,t){return`${Be(e,t)} each`}function td(){if(typeof window>"u")return"desktop";let e=window.innerWidth;return e<768?"mobile":e<1024?"tablet":"desktop"}function nd(){if(typeof sessionStorage>"u")return"ssr_"+Math.random().toString(36).substring(2,11);let e="shopi_bundle_session",t=sessionStorage.getItem(e);return t||(t="sb_"+Math.random().toString(36).substring(2,11)+"_"+Date.now(),sessionStorage.setItem(e,t)),t}async function rd(e){let t=await fetch("/cart/add.js",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:e.items})});if(!t.ok){let n=await t.text(),r="Failed to add to cart";try{let l=JSON.parse(n);r=l.description||l.message||r}catch{}throw new Error(r)}return t.json()}function Hp(){document.dispatchEvent(new CustomEvent("cart:updated")),document.dispatchEvent(new CustomEvent("cart:refresh",{bubbles:!0}))}function ld(e){switch(Hp(),e){case"redirect":window.location.href="/cart";break;case"drawer":document.dispatchEvent(new CustomEvent("cart:open")),document.dispatchEvent(new CustomEvent("theme:cart:open"));let t=document.querySelector('a[href="/cart"], .cart-icon-bubble, .site-header__cart, [data-cart-toggle]');t&&t.click();break;case"stay":break}}var Ve=b(qe());function id(e){let t=(0,Ve.useRef)(nd()),n=(0,Ve.useRef)(!1),r=(0,Ve.useCallback)(f=>{var y;if(!e.analytics.enabled)return;let m=e.analytics.trackingEndpoint||"/apps/proxy/ai/events/track";fetch(m,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shop:((y=window.Shopify)==null?void 0:y.shop)||"",bundleId:f.bundleId,productId:f.productId||"",eventType:Qp(f.eventName),sessionId:f.sessionId,metadata:{bundleType:f.bundleType,tierId:f.tierId,tierLabel:f.tierLabel,discountType:f.discountType,discountValue:f.discountValue,originalPrice:f.originalPrice,bundlePrice:f.bundlePrice,savingsAmount:f.savingsAmount,quantity:f.quantity,experimentId:f.experimentId,experimentVariant:f.experimentVariant,deviceType:f.deviceType}})}).catch(()=>{});let g=window.dataLayer;g&&g.push({event:`shopibundle_${f.eventName}`,bundle_id:f.bundleId,bundle_type:f.bundleType,tier_id:f.tierId,bundle_price:f.bundlePrice,savings_amount:f.savingsAmount})},[e.analytics]),l=(0,Ve.useCallback)((f,m,g)=>({eventName:f,bundleId:e.id,bundleType:e.type,tierId:m==null?void 0:m.id,tierLabel:m==null?void 0:m.label,discountType:m==null?void 0:m.discountType,discountValue:m==null?void 0:m.discountValue,originalPrice:g==null?void 0:g.originalPrice,bundlePrice:g==null?void 0:g.bundlePrice,savingsAmount:g==null?void 0:g.savingsAmount,quantity:m==null?void 0:m.quantity,experimentId:e.analytics.experimentId,experimentVariant:e.analytics.experimentVariant,timestamp:Date.now(),sessionId:t.current,deviceType:td()}),[e]),i=(0,Ve.useCallback)(()=>{n.current||(n.current=!0,r(l("bundle_viewed")))},[l,r]),o=(0,Ve.useCallback)((f,m)=>{r(l("tier_selected",f,m))},[l,r]),u=(0,Ve.useCallback)((f,m)=>{r(l("add_to_cart_clicked",f,m))},[l,r]),s=(0,Ve.useCallback)((f,m)=>{r(l("add_to_cart_success",f,m))},[l,r]),a=(0,Ve.useCallback)((f,m)=>{let g=l("add_to_cart_failed",f);g.error=m,r(g)},[l,r]);return{trackView:i,trackTierSelect:o,trackAddToCart:u,trackAddToCartSuccess:s,trackAddToCartFailed:a}}function Qp(e){return{bundle_viewed:"impression",tier_selected:"click",variant_changed:"click",add_to_cart_clicked:"add_to_cart",add_to_cart_success:"add_to_cart",add_to_cart_failed:"add_to_cart"}[e]||e}var du=b(qe());var vr=b(ne());function ad({savingsAmount:e,savingsPercent:t,moneyFormat:n,style:r="pill"}){if(e<=0)return null;let l=Be(e,n),i=Jc(t);return(0,vr.jsxs)("span",{className:`sb-savings-badge sb-savings-badge--${r}`,"aria-label":`Save ${l} (${i})`,children:[(0,vr.jsx)("span",{className:"sb-savings-badge__percent",children:i}),(0,vr.jsxs)("span",{className:"sb-savings-badge__amount",children:["Save ",l]})]})}var W=b(ne());function cd({tier:e,selected:t,disabled:n,moneyFormat:r,locale:l,visual:i,pricing:o,onSelect:u}){let s=(0,du.useCallback)(()=>{n||u(e.id)},[e.id,n,u]),a=(0,du.useCallback)(y=>{(y.key==="Enter"||y.key===" ")&&!n&&(y.preventDefault(),u(e.id))},[e.id,n,u]),f=o.savingsAmount>0,m=e.badge||(e.isDefault?"Most Popular":""),g=e.badgeColor||(e.isDefault?"#ff6b35":"#4CAF50");return(0,W.jsxs)("div",{role:"radio","aria-checked":t,"aria-label":`${e.label}: ${Be(o.bundlePrice,r)}${f?`, save ${Be(o.savingsAmount,r)}`:""}`,tabIndex:0,className:["sb-offer",t&&"sb-offer--selected",n&&"sb-offer--disabled",e.isDefault&&"sb-offer--default",f&&"sb-offer--has-savings"].filter(Boolean).join(" "),onClick:s,onKeyDown:a,style:t&&i.primaryColor?{"--sb-primary":i.primaryColor}:void 0,children:[m&&(0,W.jsx)("div",{className:`sb-offer__badge sb-offer__badge--${i.badgeStyle}`,style:{backgroundColor:g},children:m}),(0,W.jsx)("div",{className:"sb-offer__radio",children:(0,W.jsx)("div",{className:"sb-offer__radio-dot"})}),(0,W.jsxs)("div",{className:"sb-offer__content",children:[(0,W.jsxs)("div",{className:"sb-offer__header",children:[(0,W.jsx)("span",{className:"sb-offer__label",children:e.label}),e.subtitle&&(0,W.jsx)("span",{className:"sb-offer__subtitle",children:e.subtitle})]}),(0,W.jsxs)("div",{className:"sb-offer__pricing",children:[(0,W.jsx)("span",{className:"sb-offer__price",children:Be(o.bundlePrice,r)}),i.showCompareAtPrice&&f&&(0,W.jsx)("span",{className:"sb-offer__compare-price",children:Be(o.originalPrice,r)}),i.showPerUnitPrice&&e.quantity>1&&(0,W.jsx)("span",{className:"sb-offer__per-unit",children:ed(o.perUnitPrice,r)})]}),f&&(i.showSavingsAmount||i.showSavingsPercent)&&(0,W.jsx)("div",{className:"sb-offer__savings",children:(0,W.jsx)(ad,{savingsAmount:o.savingsAmount,savingsPercent:o.savingsPercent,currency:"",moneyFormat:r,locale:l,style:i.badgeStyle})}),o.freeItemsCount>0&&(0,W.jsxs)("div",{className:"sb-offer__free-tag",children:["+",o.freeItemsCount," FREE"]})]}),t&&(0,W.jsx)("div",{className:"sb-offer__check","aria-hidden":"true",children:(0,W.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[(0,W.jsx)("circle",{cx:"10",cy:"10",r:"10",fill:"currentColor"}),(0,W.jsx)("path",{d:"M6 10l3 3 5-6",stroke:"#fff",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})})]})}var $l=b(qe());var Vl=b(qe()),Ge=b(ne());function dd({variants:e,selectedVariantId:t,onSelect:n,layout:r="dropdown"}){if(!e||e.length<=1)return null;let l=(0,Vl.useCallback)(s=>{n(s.target.value)},[n]),i=(0,Vl.useCallback)(s=>{n(s)},[n]),o=(0,Vl.useCallback)((s,a)=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),n(a))},[n]),u=Jp(e);return r==="swatches"&&u.length>0?(0,Ge.jsx)("div",{className:"sb-variant-selector sb-variant-selector--swatches",children:u.map(s=>(0,Ge.jsxs)("div",{className:"sb-variant-group",children:[(0,Ge.jsx)("span",{className:"sb-variant-group__label",children:s.name}),(0,Ge.jsx)("div",{className:"sb-variant-group__options",role:"radiogroup","aria-label":s.name,children:s.values.map(a=>{let f=e.find(y=>y.options.some(w=>w.name===s.name&&w.value===a)),m=(f==null?void 0:f.id)===t,g=(f==null?void 0:f.available)!==!1;return(0,Ge.jsx)("button",{type:"button",role:"radio","aria-checked":m,"aria-label":`${s.name}: ${a}`,className:["sb-swatch",m&&"sb-swatch--selected",!g&&"sb-swatch--unavailable"].filter(Boolean).join(" "),onClick:()=>f&&i(f.id),onKeyDown:y=>f&&o(y,f.id),disabled:!g,children:a},a)})})]},s.name))}):(0,Ge.jsx)("div",{className:"sb-variant-selector sb-variant-selector--dropdown",children:(0,Ge.jsx)("select",{className:"sb-variant-select",value:t||"",onChange:l,"aria-label":"Select variant",children:e.map(s=>(0,Ge.jsxs)("option",{value:s.id,disabled:!s.available,children:[s.title,s.available?"":" (Sold out)"]},s.id))})})}function Jp(e){let t=new Map;for(let n of e)for(let r of n.options)t.has(r.name)||t.set(r.name,new Set),t.get(r.name).add(r.value);return Array.from(t.entries()).map(([n,r])=>({name:n,values:Array.from(r)}))}var Ee=b(ne());function fd({product:e,size:t,showPrice:n,onVariantChange:r}){var a,f;let[l,i]=(0,$l.useState)(e.variantId||((f=(a=e.variants)==null?void 0:a[0])==null?void 0:f.id)),o=(0,$l.useCallback)(m=>{i(m),r==null||r(e.productId,m)},[e.productId,r]),u=!e.available,s=t==="small"?80:t==="medium"?120:180;return(0,Ee.jsxs)("div",{className:`sb-product sb-product--${t} ${u?"sb-product--oos":""}`,children:[e.imageUrl&&(0,Ee.jsxs)("div",{className:"sb-product__image-wrap",children:[(0,Ee.jsx)("img",{className:"sb-product__image",src:e.imageUrl,alt:e.imageAlt||e.title,width:s,height:s,loading:"lazy"}),u&&(0,Ee.jsx)("span",{className:"sb-product__oos-overlay",children:"Sold out"})]}),(0,Ee.jsxs)("div",{className:"sb-product__info",children:[(0,Ee.jsx)("p",{className:"sb-product__title",children:e.title}),n&&(0,Ee.jsxs)("p",{className:"sb-product__price",children:[e.compareAtPrice&&e.compareAtPrice>e.price&&(0,Ee.jsxs)("span",{className:"sb-product__compare-price",children:["$",e.compareAtPrice.toFixed(2)]}),(0,Ee.jsxs)("span",{children:["$",e.price.toFixed(2)]})]}),e.quantity>1&&(0,Ee.jsxs)("span",{className:"sb-product__qty",children:["\xD7",e.quantity]})]}),r&&e.variants&&e.variants.length>1&&(0,Ee.jsx)(dd,{variants:e.variants,selectedVariantId:l,onSelect:o,layout:"swatches"})]})}var Qt=b(ne());function pd({current:e,target:t,label:n,color:r}){if(t<=0)return null;let l=Math.min(100,Math.round(e/t*100)),i=t-e;return(0,Qt.jsxs)("div",{className:"sb-progress",role:"progressbar","aria-valuenow":l,"aria-valuemin":0,"aria-valuemax":100,"aria-label":n,children:[(0,Qt.jsx)("div",{className:"sb-progress__label",children:n}),(0,Qt.jsx)("div",{className:"sb-progress__track",children:(0,Qt.jsx)("div",{className:"sb-progress__fill",style:{width:`${l}%`,backgroundColor:r||void 0}})}),i>0&&(0,Qt.jsxs)("div",{className:"sb-progress__hint",children:["Add ",i," more to unlock!"]})]})}var D=b(ne());function fu({config:e,onAddToCart:t,className:n}){let{tiers:r,products:l,visual:i,settings:o}=e,u=id(e),s=(0,Z.useMemo)(()=>r.find(x=>x.isDefault)||r[0],[r]),[a,f]=(0,Z.useState)((s==null?void 0:s.id)||""),[m,g]=(0,Z.useState)("idle"),[y,w]=(0,Z.useState)(""),[_,A]=(0,Z.useState)(()=>{let x={};for(let z of l)z.variantId&&(x[z.productId]=z.variantId);return x}),d=(0,Z.useMemo)(()=>r.find(x=>x.id===a)||s,[r,a,s]),c=(0,Z.useMemo)(()=>{let x={};for(let z of r)x[z.id]=Zc(z,l,e.type);return x},[r,l,e.type]),p=d?c[d.id]:void 0;(0,Z.useEffect)(()=>{u.trackView()},[u]);let h=(0,Z.useMemo)(()=>{if(!d)return null;let x=r.findIndex(z=>z.id===d.id);return x<r.length-1?r[x+1]:null},[r,d]),S=(0,Z.useCallback)(x=>{f(x),g("idle"),w("");let z=r.find(G=>G.id===x);z&&u.trackTierSelect(z,c[x])},[r,c,u]),E=(0,Z.useCallback)((x,z)=>{A(G=>({...G,[x]:z}))},[]),C=(0,Z.useCallback)(async()=>{if(!d||!p)return;g("loading"),w(""),u.trackAddToCart(d,p);let z={items:p.lineItems.map(G=>{var gu;let En=Object.entries(_).find(([,Wl])=>Wl);return{...G,variantId:_[((gu=l.find(Wl=>Wl.variantId===G.variantId))==null?void 0:gu.productId)||""]||G.variantId,properties:{...G.properties,_bundle_id:e.id}}}).map(G=>({...G,variantId:tm(G.variantId)}))};try{t?await t(z):await rd(z),g("success"),u.trackAddToCartSuccess(d,p),setTimeout(()=>{ld(o.addToCartBehavior)},600)}catch(G){let En=G instanceof Error?G.message:"Failed to add to cart";w(En),g("error"),u.trackAddToCartFailed(d,En),setTimeout(()=>{g("idle"),w("")},3e3)}},[d,p,_,l,e.id,o.addToCartBehavior,t,u]);if(!r.length||!l.length)return(0,D.jsx)(D.Fragment,{});let P=(e.type==="fbt"||e.type==="mix-match"||e.type==="fixed"||e.type==="free-gift")&&i.showProductImages,H=em(m,p,o.currency);return(0,D.jsxs)("div",{className:`sb-widget sb-widget--${i.layout} sb-widget--${i.colorScheme} ${n||""}`,role:"group","aria-label":e.title,children:[(0,D.jsxs)("div",{className:"sb-widget__header",children:[(0,D.jsx)("h3",{className:"sb-widget__title",children:e.title}),e.subtitle&&(0,D.jsx)("p",{className:"sb-widget__subtitle",children:e.subtitle})]}),P&&(0,D.jsx)("div",{className:"sb-widget__products",children:l.map((x,z)=>(0,D.jsxs)(Z.default.Fragment,{children:[z>0&&(0,D.jsx)("span",{className:"sb-widget__plus","aria-hidden":"true",children:"+"}),(0,D.jsx)(fd,{product:x,size:i.imageSize,showPrice:e.type!=="volume",onVariantChange:o.allowVariantSelection?E:void 0})]},x.productId))}),(0,D.jsx)("div",{className:"sb-widget__offers",role:"radiogroup","aria-label":"Select bundle option",children:r.map(x=>{let z=c[x.id],G=!l.every(En=>En.available)&&o.outOfStockBehavior==="disable";return(0,D.jsx)(cd,{tier:x,products:l,selected:x.id===a,disabled:G,currency:o.currency,moneyFormat:o.moneyFormat,locale:o.locale,visual:i,pricing:z,onSelect:S},x.id)})}),i.showProgressBar&&h&&d&&(0,D.jsx)(pd,{current:d.quantity,target:h.quantity,label:`Add ${h.quantity-d.quantity} more for ${h.badge||"extra savings"}!`,color:i.accentColor}),(0,D.jsxs)("div",{className:"sb-widget__footer",children:[p&&(0,D.jsxs)("div",{className:"sb-widget__total",children:[(0,D.jsx)("span",{className:"sb-widget__total-label",children:"Total:"}),(0,D.jsxs)("div",{className:"sb-widget__total-prices",children:[p.savingsAmount>0&&(0,D.jsx)("span",{className:"sb-widget__total-original",children:Be(p.originalPrice,o.moneyFormat)}),(0,D.jsx)("span",{className:"sb-widget__total-price",children:Be(p.bundlePrice,o.moneyFormat)})]})]}),(0,D.jsxs)("button",{type:"button",className:`sb-widget__cta sb-widget__cta--${m}`,onClick:C,disabled:m==="loading"||m==="success","aria-busy":m==="loading",children:[m==="loading"&&(0,D.jsx)("span",{className:"sb-spinner","aria-hidden":"true"}),H]}),y&&(0,D.jsx)("p",{className:"sb-widget__error",role:"alert",children:y})]})]})}function em(e,t,n){switch(e){case"loading":return"Adding...";case"success":return"Added to Cart!";case"error":return"Try Again";default:return t&&t.savingsAmount>0?`Add to Cart \u2014 Save $${t.savingsAmount.toFixed(2)}`:"Add to Cart"}}function tm(e){if(e.startsWith("gid://")){let t=e.split("/");return t[t.length-1]}return e}var Le=b(ne());function pu(){return(0,Le.jsxs)("div",{className:"sb-skeleton",role:"status","aria-label":"Loading bundle offers",children:[(0,Le.jsx)("div",{className:"sb-skeleton__title"}),(0,Le.jsx)("div",{className:"sb-skeleton__cards",children:[0,1,2].map(e=>(0,Le.jsxs)("div",{className:"sb-skeleton__card",children:[(0,Le.jsx)("div",{className:"sb-skeleton__badge"}),(0,Le.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--short"}),(0,Le.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--medium"}),(0,Le.jsx)("div",{className:"sb-skeleton__line sb-skeleton__line--long"}),(0,Le.jsx)("div",{className:"sb-skeleton__btn"})]},e))}),(0,Le.jsx)("span",{className:"sb-sr-only",children:"Loading..."})]})}var md=`/**
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
`;var Rt=b(ne()),gd=!1;function rm(){if(gd||typeof document>"u")return;gd=!0;let e=document.createElement("style");e.setAttribute("data-shopibundle",""),e.textContent=md,document.head.appendChild(e)}rm();function lm({mountConfig:e}){let[t,n]=(0,zt.useState)(null),[r,l]=(0,zt.useState)(!0),[i,o]=(0,zt.useState)(null);return(0,zt.useEffect)(()=>{im(e).then(u=>{n(u),l(!1)}).catch(u=>{console.warn("[ShopiBundle] Failed to load bundle:",u),o(u.message),l(!1)})},[e]),r?(0,Rt.jsx)(pu,{}):i||!t?(0,Rt.jsx)(Rt.Fragment,{}):(0,Rt.jsx)(fu,{config:t})}async function im(e){let t=new URLSearchParams;e.bundleHandle&&t.set("handle",e.bundleHandle),e.productId&&t.set("product_id",e.productId),t.set("shop",e.shopDomain),e.locale&&t.set("locale",e.locale),e.currency&&t.set("currency",e.currency);let n=e.proxyPath||"/apps/proxy",r=await fetch(`${n}/bundle-widget?${t.toString()}`);if(!r.ok)throw new Error(`HTTP ${r.status}`);let l=await r.json();if(!l.success||!l.config)throw new Error(l.error||"No bundle config returned");if(e.moneyFormat&&l.config.settings&&(l.config.settings.moneyFormat=e.moneyFormat),e.locale&&l.config.settings&&(l.config.settings.locale=e.locale),e.currency&&l.config.settings&&(l.config.settings.currency=e.currency),e.abTest&&l.config){if(e.abTest.defaultTierId)for(let i of l.config.tiers)i.isDefault=i.id===e.abTest.defaultTierId;e.abTest.colorScheme&&(l.config.visual.colorScheme=e.abTest.colorScheme),e.abTest.layoutVariant&&(l.config.analytics.experimentVariant=e.abTest.variant,l.config.analytics.experimentId=e.abTest.experimentId)}return l.config}function om(e){var t;return{containerId:e.id,bundleHandle:e.dataset.bundleHandle||void 0,productId:e.dataset.productId||void 0,shopDomain:e.dataset.shop||((t=window.Shopify)==null?void 0:t.shop)||"",proxyPath:e.dataset.proxyPath||"/apps/proxy",locale:e.dataset.locale||document.documentElement.lang||"en",currency:e.dataset.currency||void 0,moneyFormat:e.dataset.moneyFormat||"${{amount}}"}}function mu(){document.querySelectorAll("[data-shopibundle-widget], #shopibundle-widget").forEach(t=>{if(t.dataset.mounted==="true")return;t.dataset.mounted="true";let n=om(t);if(!n.shopDomain){console.warn("[ShopiBundle] No shop domain found, skipping widget mount");return}if(!n.bundleHandle&&!n.productId){console.warn("[ShopiBundle] No bundle handle or product ID found");return}(0,hd.createRoot)(t).render((0,Rt.jsx)(zt.default.StrictMode,{children:(0,Rt.jsx)(lm,{mountConfig:n})}))})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",mu):mu();window.ShopiBundle={mount:mu,BundleWidget:fu,SkeletonLoader:pu};})();
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
