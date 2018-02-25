!function(e,t){var n=function(e,t){var n=e;if(e.querySelector||(n=document),"string"==typeof t){var i=n.querySelector(t);return $._extendSingleNode(i),i}if("object"==typeof t){if(t.nodeName)return $._extendSingleNode(t),t;if(t.length&&"string"==typeof t[0]){for(var r=n.querySelectorAll(t),o=[],s=0;s<r.length;s++)o[s]=r[s];return $._extendMultiNode(o),o}}},$=function(e){if("string"==typeof e&&0===e.indexOf("<")){var t=document.createElement(e.replace("<","").replace(">",""));return $._extendSingleNode(t),t}return n(this,e)};e[t]=$,window.___$hermes=$,$._={},$._.find=function(e){return n(this,e)},$._.getBounds=function(){var e=this._$bounds;return($.time!==this._$accessed&&($._scrolled||$._resized)||!e)&&(e=this.getBoundingClientRect()),this.getBounds._$bounds=e,this.getBounds._$accessed=$.time,e},$._.getTop=function(){return this.getBounds().top+$.scrollY},$._.isVisible=function(){var e=this.getTop(),t=this.getBounds().height,n=e+t;return $.scrollY+$.screenHeight>=e&&$.scrollY<n},$._.on=function(e,t){for(var n=e.split(" "),i=0;i<n.length;i++)this.addEventListener(n[i],t);return this},$._.off=function(e,t){for(var n=e.split(" "),i=0;i<n.length;i++)this.removeEventListener(n[i],t);return this},$._.emit=function(e,t){var n=new CustomEvent(e,t);return this.dispatchEvent(n),this},$._.append=function(e){return this.appendChild(e),this},$._.prepend=function(e){return this.firstChild&&this.insertBefore(e,this.firstChild),this},$._.show=function(){return this.removeAttribute("hidden"),this},$._.hide=function(){return this.setAttribute("hidden","true"),this},$._.attr=function(e,t,n){return 0===e.indexOf("!")?(this.removeAttribute(e.split("!")[1]),this):void 0===t?this.getAttribute(e):(void 0===n?this.setAttribute(e,t):this.setAttribute(e,t,n),this)},$._.addClass=function(e){return this.classList.add(e),this},$._.hasClass=function(e){return this.classList.contains(e)},$._.removeClass=function(e){return this.classList.remove(e),this},$.__={},$.__.show=function(){return this.forEach(function(e){e.show()}),this},$.__.hide=function(){return this.forEach(function(e){e.hide()}),this},$.__.attr=function(e,t){return void 0===t?this:(this.forEach(function(n){n.attr(e,t)}),this)},$.__.on=function(e,t){return this.forEach(function(n){n.on(e,t)}),this},$.__.off=function(e,t){return this.forEach(function(n){n.off(e,t)}),this},$._extendSingleNode=function(e){if(e)for(var t in $._)e[t]||(e[t]=$._[t])},$._extendMultiNode=function(e){if(e){e.multi=!0;for(var t in $.__)e[t]||(e[t]=$.__[t]);e.forEach(function(e){$._extendSingleNode(e)})}},$.newID=function(){var e=t+"_"+this.newID._id;return this.newID._id++,e},$.newID._id=0,$.log=function(e){if(e){var t=!0;this.log.history.length>0&&$.time<this.log.history[this.log.history.length-1].time+2e3&&(t=!1),t&&window.console.info("log timeStamp "+new Date),this.log.history.push({message:e,time:$.time}),window.console.log.apply(this,arguments)}},$.log.history=[],$.error=function(e){var t=new Error;window.console.error(e),window.console.error(t.stack)},$.fetch=function(e,t){return e||$.error("Comms error: Missing endpoint from request"),window.Promise?(t=t||{},new window.Promise(function(n,i){var r=this.api+(e||""),o=new XMLHttpRequest;o.open(t.method||"GET",r,!0),t.contentType&&o.setRequestHeader("Content-Type",t.contentType),o.onload=function(){this.status>=200&&this.status<300?n(o.response):i({status:this.status,statusText:o.statusText})},o.onerror=function(){i({status:this.status,statusText:o.statusText})},o.send(t.data)})):($.error("Comms error: No Promise API"),!1)},$.send=function(e,t,n){return t||$.error("Send error: No data to send"),$.fetch(e,n)},$.go=function(e,t){!1===t?window.location=e:window.open(e,"_blank")},$.screenWidth=window.innerWidth,$.screenHeight=window.innerHeight,$._resized=!1,$._onResize=function(){$._resized=!0,$.screenWidth=window.innerWidth,$.screenHeight=window.innerHeight,$._scrolled=!0,$.scrollY=window.pageYOffset},window.addEventListener("resize",$._onResize),$.scrollY=0,$._scrolled=!1,$._onScroll=function(){$._scrolled=!0,$.scrollY=window.pageYOffset,$._onResize()},window.addEventListener("scroll",$._onScroll),$.start=Date.now(),$.time=Date.now(),$.elapsed=0,$._updates=[],$._accumulator=0,$._interval=1/60*1e3,$._prevTime=Date.now(),$._passed=0,$.addUpdate=function(e){if(e){var t={id:$.newID(),dirty:!1,time:$.time,interval:e.interval||0,repeat:e.hasOwnProperty("repeat")?e.repeat:-1,updateOnScroll:e.updateOnScroll||!1,updateOnResize:e.updateOnResize||!1,_scrolled:!1,_resized:!1};return t.preUpdate=function(){t.updateOnScroll&&(t._scrolled=$._scrolled),t.updateOnResize&&(t._resized=$._resized),e.preUpdate&&e.preUpdate()},t.update=function(){if(0!==t.repeat&&$.time>=this.time+this.interval&&(!t.updateOnScroll||t._scrolled)&&(!t.updateOnResize||t._resized)&&(t.dirty=!0,t._scrolled=!1,t._resized=!1,e.update)){var n=e.update();"boolean"==typeof n&&(t.dirty=n)}t.dirty&&(t.time=$.time,t.repeat>0&&t.repeat--)},t.draw=function(){t.dirty&&e.draw&&e.draw(),t.dirty=!1},-1===t.priority?$._updates.unshift(t):$._updates.push(t),e.run&&(t.preUpdate(),t.update(),t.draw()),t}},$.removeUpdate=function(e){$._updates.forEach(function(e){e.id})},$.update=function(){$._theUpdate(!0)},$._scheduleUpdate=function(){requestAnimationFrame(function(){$._theUpdate(),$._scheduleUpdate()})},$._theUpdate=function(e){var t=Date.now();$.time=t,$._passed=Math.max(100,t-$._prevTime),$.elapsed=$.time-$.start,$._updates.forEach(function(t){if(t.preUpdate($._interval),e)$._updates.forEach(function(e){e.update($._interval)}),t.dirty=!0;else for($._accumulator+=$._passed;$._accumulator>=$._interval;)t.update($._interval),$._accumulator-=$._interval;t.draw($._passed)}),$._resized=!1,$._scrolled=!1,$._prevTime=t},$._onLoad=function(){$._scheduleUpdate()},window.addEventListener("load",$._onLoad)}(window,window.hasOwnProperty("$")?"_$":"$");