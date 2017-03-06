/*
 HTML5 Shiv v3.6.2pre | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
 Uncompressed source: https://github.com/aFarkas/html5shiv
*/
(function(l, f) {
	function m() {
		var a = e.elements;
		return "string" == typeof a ? a.split(" ") : a
	}

	function i(a) {
		var b = n[a[o]];
		b || (b = {}, h++, a[o] = h, n[h] = b);
		return b
	}

	function p(a, b, c) {
		b || (b = f);
		if (g) return b.createElement(a);
		c || (c = i(b));
		b = c.cache[a] ? c.cache[a].cloneNode() : r.test(a) ? (c.cache[a] = c.createElem(a)).cloneNode() : c.createElem(a);
		return b.canHaveChildren && !s.test(a) ? c.frag.appendChild(b) : b
	}

	function t(a, b) {
		if (!b.cache) b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag();
		a.createElement = function(c) {
			return !e.shivMethods ? b.createElem(c) : p(c, a, b)
		};
		a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + m().join().replace(/\w+/g, function(a) {
			b.createElem(a);
			b.frag.createElement(a);
			return 'c("' + a + '")'
		}) + ");return n}")(e, b.frag)
	}

	function q(a) {
		a || (a = f);
		var b = i(a);
		if (e.shivCSS && !j && !b.hasCSS) {
			var c, d = a;
			c = d.createElement("p");
			d = d.getElementsByTagName("head")[0] || d.documentElement;
			c.innerHTML = "x<style>article,aside,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}</style>";
			c = d.insertBefore(c.lastChild, d.firstChild);
			b.hasCSS = !! c
		}
		g || t(a, b);
		return a
	}
	var k = l.html5 || {}, s = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
		r = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
		j, o = "_html5shiv",
		h = 0,
		n = {}, g;
	(function() {
		try {
			var a = f.createElement("a");
			a.innerHTML = "<xyz></xyz>";
			j = "hidden" in a;
			var b;
			if (!(b = 1 == a.childNodes.length)) {
				f.createElement("a");
				var c = f.createDocumentFragment();
				b = "undefined" == typeof c.cloneNode ||
					"undefined" == typeof c.createDocumentFragment || "undefined" == typeof c.createElement
			}
			g = b
		} catch (d) {
			g = j = !0
		}
	})();
	var e = {
		elements: k.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary time video",
		version: "3.6.2pre",
		shivCSS: !1 !== k.shivCSS,
		supportsUnknownElements: g,
		shivMethods: !1 !== k.shivMethods,
		type: "default",
		shivDocument: q,
		createElement: p,
		createDocumentFragment: function(a, b) {
			a || (a = f);
			if (g) return a.createDocumentFragment();
			for (var b = b || i(a), c = b.frag.cloneNode(), d = 0, e = m(), h = e.length; d < h; d++) c.createElement(e[d]);
			return c
		}
	};
	l.html5 = e;
	q(f)
})(this, document);
(function(k){var s={};k.respond=s;s.update=function(){};var c=[],f=(function(){var w=false;try{w=new k.XMLHttpRequest()}catch(A){w=new k.ActiveXObject("Microsoft.XMLHTTP")}return function(){return w}})(),o=function(w,B){var A=f();if(!A){return}A.open("GET",w,true);A.onreadystatechange=function(){if(A.readyState!==4||A.status!==200&&A.status!==304){return}B(A.responseText)};if(A.readyState===4){return}A.send(null)},u=function(w){return w.replace(s.regex.minmaxwh,"").match(s.regex.other)};s.ajax=o;s.queue=c;s.unsupportedmq=u;s.regex={media:/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,keyframes:/@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,comments:/\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,urls:/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,findStyles:/@media *([^\{]+)\{([\S\s]+?)$/,only:/(only\s+)?([a-zA-Z]+)\s?/,minw:/\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,maxw:/\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,minmaxwh:/\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,other:/\([^\)]*\)/g};s.mediaQueriesSupported=k.matchMedia&&k.matchMedia("only all")!==null&&k.matchMedia("only all").matches;if(s.mediaQueriesSupported){return}var z=k.document,t=z.documentElement,h=[],j=[],x=[],p={},g=30,e=z.getElementsByTagName("head")[0]||t,d=z.getElementsByTagName("base")[0],b=e.getElementsByTagName("link"),a,r,v,n=function(){var B,E=z.createElement("div"),w=z.body,D=t.style.fontSize,C=w&&w.style.fontSize,A=false;E.style.cssText="position:absolute;font-size:1em;width:1em";if(!w){w=A=z.createElement("body");w.style.background="none"}t.style.fontSize="100%";w.style.fontSize="100%";w.appendChild(E);if(A){t.insertBefore(w,t.firstChild)}B=E.offsetWidth;if(A){t.removeChild(w)}else{w.removeChild(E)}t.style.fontSize=D;if(C){w.style.fontSize=C}B=v=parseFloat(B);return B},i=function(O){var Q="clientWidth",C=t[Q],A=z.compatMode==="CSS1Compat"&&C||z.body[Q]||C,F={},E=b[b.length-1],B=(new Date()).getTime();if(O&&a&&B-a<g){k.clearTimeout(r);r=k.setTimeout(i,g);return}else{a=B}for(var M in h){if(h.hasOwnProperty(M)){var G=h[M],H=G.minw,N=G.maxw,L=H===null,P=N===null,w="em";if(!!H){H=parseFloat(H)*(H.indexOf(w)>-1?(v||n()):1)}if(!!N){N=parseFloat(N)*(N.indexOf(w)>-1?(v||n()):1)}if(!G.hasquery||(!L||!P)&&(L||A>=H)&&(P||A<=N)){if(!F[G.media]){F[G.media]=[]}F[G.media].push(j[G.rules])}}}for(var K in x){if(x.hasOwnProperty(K)){if(x[K]&&x[K].parentNode===e){e.removeChild(x[K])}}}x.length=0;for(var J in F){if(F.hasOwnProperty(J)){var I=z.createElement("style"),D=F[J].join("\n");I.type="text/css";I.media=J;e.insertBefore(I,E.nextSibling);if(I.styleSheet){I.styleSheet.cssText=D}else{I.appendChild(z.createTextNode(D))}x.push(I)}}},l=function(J,w,B){var I=J.replace(s.regex.comments,"").replace(s.regex.keyframes,"").match(s.regex.media),L=I&&I.length||0;w=w.substring(0,w.lastIndexOf("/"));var A=function(M){return M.replace(s.regex.urls,"$1"+w+"$2$3")},F=!L&&B;if(w.length){w+="/"}if(F){L=1}for(var E=0;E<L;E++){var G,H,C,K;if(F){G=B;j.push(A(J))}else{G=I[E].match(s.regex.findStyles)&&RegExp.$1;j.push(RegExp.$2&&A(RegExp.$2))}C=G.split(",");K=C.length;for(var D=0;D<K;D++){H=C[D];if(u(H)){continue}h.push({media:H.split("(")[0].match(s.regex.only)&&RegExp.$2||"all",rules:j.length-1,hasquery:H.indexOf("(")>-1,minw:H.match(s.regex.minw)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:H.match(s.regex.maxw)&&parseFloat(RegExp.$1)+(RegExp.$2||"")})}}i()},y=function(){if(c.length){var w=c.shift();o(w.href,function(A){l(A,w.href,w.media);p[w.href]=true;k.setTimeout(function(){y()},0)})}},m=function(){for(var C=0;C<b.length;C++){var B=b[C],A=B.href,D=B.media,w=B.rel&&B.rel.toLowerCase()==="stylesheet";if(!!A&&w&&!p[A]){if(B.styleSheet&&B.styleSheet.rawCssText){l(B.styleSheet.rawCssText,A,D);p[A]=true}else{if((!/^([a-zA-Z:]*\/\/)/.test(A)&&!d)||A.replace(RegExp.$1,"").split("/")[0]===k.location.host){if(A.substring(0,2)==="//"){A=k.location.protocol+A}c.push({href:A,media:D})}}}}y()};m();s.update=m;s.getEmValue=n;function q(){i(true)}if(k.addEventListener){k.addEventListener("resize",q,false)}else{if(k.attachEvent){k.attachEvent("onresize",q)}}})(this);