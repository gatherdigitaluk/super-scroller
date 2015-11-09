/**
 *  Super Scroller
 *  19/09/2012 - OMFG This needs serious refactoring!!!!!
 *  21/11/2012 - Added a bunch of handy methods for defining areas in css style data-gss-slidename attributes
 *  12/04/2013 - Added trigger feature addClass/removeClass
 *  16/04/2013 - Added feature to change the height of a component.
 *  18/04/2013 - Added area disabling to tidy up areas on scrolling up.
 *  18/04/2013 - Added component activation/deactivation to support hidden elements with delays
 *  @author Paul David Clegg @cleggypdc
 *  @copyright  Framewerx UK / Gather Digital 2012-13
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
 
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 (function(h){var e={viewport:{_el:null,_width:0,_height:0,_scrollPosition:0,_scrollDiff:0,_totalAreaHeight:0,_activeAreaRef:null,_activeArea:null,_areaIndex:null}},f={init:function(){f.initHtmlDefinitions();f.initViewport();f.initAreas();f.initComponents();f.activateArea();e.viewport._el.scroll(f.scrollListener)},initViewport:function(){e.viewport._el=h(window);var a=e.viewport._el;e.viewport._width=a.width();e.viewport._height=a.height();e.viewport._scrollPosition=a.scrollTop();e.viewport._areaIndex=
e.viewport._areaIndex||[]},initAreas:function(){var a=0,c=0;for(i in e.areas){var d=e.areas[i];d.start=a;d.height=lastAreaHeight=e.viewport._height*d.scale;c+=lastAreaHeight;d.end=a+d.height;a=d.end+1;e.viewport._areaIndex.push(i)}e.viewport._totalAreaHeight=c},initHtmlDefinitions:function(){var a=document.getElementsByTagName("body")[0].getAttribute("data-gss-areas");a?(e.areas=e.areas||{},slides=f.CSSToAreas(a),h(".GSS").each(function(){for(var a in slides){var d=slides[a].trim(),b=this.getAttribute("data-gss-"+
d);if(b){var g=this.getAttribute("id");if(!g)throw"Required ID not found in element with GSS class...";e.components=e.components||{};e.components[g]=e.components[g]||{};e.components[g].areas=e.components[g].areas||{};e.components[g].areas[d]=e.components[g].areas[d]||f.CSSToComponent(b)}}})):alert("There are no areas configured for this slider, please add the configuration into the document body")},CSSToAreas:function(a){a=a.replace(/\s+/g,"");var c=-1,d=[];do{var b=a.indexOf("{",c);1>b&&(b=a.length);
c=a.substring(c+1,b);0<c.length&&(c=c.split(","),d=d.concat(c));c=a.indexOf("}",b)}while(0<=c&&c<a.length);var d=f.getUnique(d),g;for(g in d)e.areas[d[g]]=f.CSSClassToConfig(d[g],a);return d},CSSToComponent:function(a){slideConf={};slideConf.start=f.CSSClassToConfig("start",a);slideConf.end=f.CSSClassToConfig("end",a);slideConf.speed=f.CSSClassToConfig("speed",a,!0);slideConf.triggers=f.CSSClassToConfig("triggers",a);slideConf.direction=f.CSSClassToConfig("direction",a,!0);return slideConf},CSSClassToConfig:function(a,
c,d){var b=c.indexOf(a)+a.length;if(b<a.length)return"undefined"==typeof d?{}:null;a=c.indexOf("{",b)+1;b=c.indexOf("}",b);c=c.substring(a,b);if(d){var e=c.trim();return e?e:1}d=c.split(";");c={};for(e in d)d[e]&&!(1>d[e].trim().length)&&(b=d[e].split(":"))&&(c[b[0].trim()]=isNaN(b[1])?b[1]:parseFloat(b[1]));return c},getUnique:function(a){for(var c={},d=[],b=0,e=a.length;b<e;++b)c.hasOwnProperty(a[b])||(d.push(a[b]),c[a[b]]=1);return d},getIntersect:function(a,c){var d=[],b={},e=c.length,f,j;for(f=
0;f<e;f++)b[c[f]]=!0;e=a.length;for(f=0;f<e;f++)j=a[f],j in b&&d.push(j);return d},initComponents:function(){for(componentName in e.components){var a=e.components[componentName];for(areaName in a.areas){var c=a.areas[areaName],d=e.areas[areaName];if("object"!=!typeof d){d.components=d.components||{};d.components[componentName]={};var b=d.components[componentName],f=c.start,h=c.end;b.start=f;b.end=h;b.triggers=c.triggers;b.direction=c.direction;for(transitionName in f){var j=f[transitionName],k=h[transitionName];
"undefined"!=typeof k&&(j=100*((k-j)/d.height)*(c.speed||1),b._increments=b._increments||{},b._increments[transitionName]=j)}}}}},activateArea:function(a){var c=e.viewport,d=c._activeAreaRef;newIndex=c._areaIndex.indexOf(c._activeAreaRef);if("next"==a)newIndex++,c._activeAreaRef=c._areaIndex[newIndex]||d,c._activeArea=e.areas[c._activeAreaRef];else if("prev"==a)newIndex--,c._activeAreaRef=c._areaIndex[newIndex]||d,c._activeArea=e.areas[c._activeAreaRef];else if("undefined"==!typeof a&&"undefined"==
!typeof e.areas[a])c._activeAreaRef=a,c._activeArea=e.areas[a];else{a=c._activeArea;var b=c._scrollPosition;if(!a||a&&!f.checkAreaBoundarys(a,b))for(var g in e.areas)if(f.checkAreaBoundarys(e.areas[g],b)){c._activeAreaRef=g;c._activeArea=e.areas[g];break}}d!=c._activeAreaRef&&(f.activateAreaComponents(),f.positionAreaComponents(),f.deactivateArea(e.areas[d]))},activateAreaComponents:function(){var a=e.viewport;if(a._activeArea&&(a=a._activeArea.components))for(comp in a){a[comp]._el=a[comp]._el||
h("#"+comp);var c=a[comp].triggers.delay;(!c||c&&f.getAreaProgress()>=c)&&f.activateComponent(a[comp])}},activateComponent:function(a){a.start&&(a.start.opacity||0==a.start.opacity)?a._el.css({opacity:a.start.opacity}):a._el.css({opacity:1});a._isActive=!0},deactivateComponent:function(a){a.start&&(a.start.opacity||0==a.start.opacity)?a._el.css({opacity:a.start.opacity}):a._el.css({opacity:0});a._isActive=!1},deactivateArea:function(a){var c=e.viewport;if(a){var d=a.components;if(d&&c._scrollPosition<=
a.start)for(comp in d)d[comp]._el.removeAttr("style"),d[comp]._taskDone=null,d[comp]._el=null}},checkAreaBoundarys:function(a,c){return c>=a.start&&c<=a.end||c>e.viewport._totalAreaHeight?!0:!1},getAreaProgress:function(){return 100*((e.viewport._scrollPosition-e.viewport._activeArea.start)/e.viewport._activeArea.height)},positionAreaComponents:function(){var a=e.viewport._activeArea,c=a.components,a=100*((e.viewport._scrollPosition-a.start)/a.height);for(n in c){cmp=c[n];var d={};f.checkTriggers(cmp,
a);if(cmp._isActive&&f.checkDirection(cmp)){if(cmp._task){switch(cmp._task){case "ac":cmp._el.addClass(cmp._taskVal);break;case "rc":cmp._el.removeClass(cmp._taskVal)}cmp._task=null;cmp._taskVal=null;cmp._taskDone=!0}for(trans in cmp._increments){var b=cmp._increments[trans],g=a-(cmp.triggers.delay?cmp.triggers.delay:0);switch(trans){case "left":b=cmp.start.left+g*b;d.left=b>=cmp.start.left&&b<=cmp.end.left||b<=cmp.start.left&&b>=cmp.end.left?b+"%":cmp.end.left+"%";break;case "top":b=cmp.start.top+
g*b;d.top=b>=cmp.start.top&&b<=cmp.end.top||b<=cmp.start.top&&b>=cmp.end.top?b+"%":cmp.end.top+"%";break;case "bottom":b=cmp.start.bottom+g*b;d.bottom=b>=cmp.start.bottom&&b<=cmp.end.bottom||b<=cmp.start.bottom&&b>=cmp.end.bottom?b+"%":cmp.end.bottom+"%";break;case "rotation":b=cmp.start.rotation+g*b;b=b>=cmp.start.rotation&&b<=cmp.end.rotation||b<=cmp.start.rotation&&b>=cmp.end.rotation?" rotate("+b+"deg) ":" rotate("+cmp.end.rotation+"deg) ";d["-webkit-transform"]=d["-webkit-transform"]?d["-webkit-transform"]+
b:b;break;case "scale":b=cmp.start.scale+g*b;b=b>=cmp.start.scale&&b<=cmp.end.scale||b<=cmp.start.scale&&b>=cmp.end.scale?" scale("+b+") ":" scale("+cmp.end.scale+") ";d["-webkit-transform"]=d["-webkit-transform"]?d["-webkit-transform"]+b:b;break;case "opacity":b=cmp.start.opacity+(2<g)?g*b:0;d.opacity=b>=cmp.start.opacity&&b<=cmp.end.opacity||b<=cmp.start.opacity&&b>=cmp.end.opacity?b:cmp.end.opacity;break;case "height":b=cmp.start.height+(0.5<g)?g*b:0,d.height=b>=cmp.start.height&&b<=cmp.end.height||
b<=cmp.start.height&&b>=cmp.end.height?b+"%":cmp.end.height+"%"}}cmp._el.css(d)}}},checkTriggers:function(a,c){for(var d in a.triggers){var b=a.triggers[d];switch(d){case "delay":c>=b?f.activateComponent(a):f.deactivateComponent(a);break;case "addClass":a._task=!a._taskDone?"ac":null;a._taskVal=b;break;case "removeClass":a._task=!a._taskDone?"rc":null,a._taskVal=b}}},checkDirection:function(a){return!a.direction||e.viewport._scrollDir==a.direction?!0:!1},scrollListener:function(){var a=e.viewport;
a._lastScrollPos=a._scrollPosition;a._scrollPosition=a._el.scrollTop();a._scrollDiff=Math.abs(a._scrollPosition-a._scrollPosition);a._scrollDir=a._scrollPosition>a._lastScrollPos?"d":"u";f.checkAreaBoundarys(a._activeArea,a._scrollPosition)?f.positionAreaComponents():f.activateArea("d"==a._scrollDir?"next":"prev")}};h.fn.SuperScroller=function(a){if("function"==typeof f[a])return f[a].apply(this,Array.prototype.slice.call(arguments,1));if("object"==typeof a||!a)return f.init.apply(this,arguments);
h.error("Method does not exist")}})(jQuery);