// Backbone.Validation v0.9.3-sibrus
//
// Copyright (c) 2011-2015 Thomas Pedersen
// Distributed under MIT License
//
// Documentation and full license available at:
// http://thedersen.com/projects/backbone-validation
Backbone.Validation=function(a){"use strict";var b={forceUpdate:!1,labelFormatter:"sentenceCase",liveValidation:!0},c={formatLabel:function(a,c){return g[b.labelFormatter](a,c)},format:function(){var a=Array.prototype.slice.call(arguments),b=a.shift();return b.replace(/\{(\d+)\}/g,function(b,c){return"undefined"!=typeof a[c]?a[c]:b})}},d=function(){var d=function(b){return a.reduce(a.keys(a.result(b,"validation")||{}),function(a,b){return a[b]=void 0,a},{})},e=function(b,c){var d=b.validation?a.result(b,"validation")[c]||{}:{};return(a.isFunction(d)||a.isString(d))&&(d={fn:d}),a.isArray(d)||(d=[d]),a.reduce(d,function(b,c){return a.each(a.without(a.keys(c),"msg","deps"),function(a){b.push({fn:h[a],val:c[a],msg:c.msg})}),b},[])},f=function(b,d,f,g){var i=b.get("validationSuspended")||!1,j=i?"":a.reduce(e(b,d),function(e,i){var j=a.extend({},c,h),k=i.fn.call(j,f,d,i.val,b,g);return k===!1||e===!1?!1:k&&!e?a.result(i,"msg")||k:e},"");return""===j?b._invalidAttrs&&a.has(b._invalidAttrs,d)&&delete b._invalidAttrs[d]:(b._invalidAttrs=b._invalidAttrs||{},b._invalidAttrs[d]=j),j},g=function(b,c){var d,e={},g=!0,h=a.clone(c);return a.each(c,function(a,c){d=f(b,c,a,h),d&&(e[c]=d,g=!1)}),{invalidAttrs:e,isValid:g}},i=function(b,c){return{preValidate:function(b,c){var d,e=this,g={};return a.isObject(b)?(a.each(b,function(a,b){d=e.preValidate(b,a),d&&(g[b]=d)}),a.isEmpty(g)?void 0:g):f(this,b,c,a.extend({},this.attributes))},isValid:function(b){var c=a.clone(this.attributes);return a.isString(b)?!f(this,b,c[b],a.extend({},this.attributes)):a.isArray(b)?a.reduce(b,function(b,d){return b&&!f(this,d,c[d],a.extend({},this.attributes))},!0,this):(b===!0&&this.validate(),this.validation?this._isValid:!0)},checkValid:function(b,c){return c&&this.isValid(b),this._invalidAttrs?!a.has(this._invalidAttrs,b):!0},validationMessage:function(b,c){return c&&this.isValid(b),this._invalidAttrs&&a.has(this._invalidAttrs,b)?this._invalidAttrs[b]:null},validate:function(b,e){var f=this;f.set("validationSuspended",!1);var h=a.extend({},c,e),i=d(f),j=a.extend({},i,f.attributes,b),k=b||j,l=g(f,j);return f._isValid=l.isValid,f._invalidAttrs=l.invalidAttrs,a.defer(function(){f.trigger("validated",f._isValid,f,l.invalidAttrs),f.trigger("validated:"+(f._isValid?"valid":"invalid"),f,l.invalidAttrs)}),f.set("validationVersion",f.get("validationVersion")+1),!h.forceUpdate&&a.intersection(a.keys(l.invalidAttrs),a.keys(k)).length>0?l.invalidAttrs:void 0}}},j=function(b,c,e){if(a.extend(c,i(b,e)),console.log("Starting to bind..."),c instanceof Backbone.Epoxy.Model){console.log("Really binding..."),void 0===c.get("validationSuspended")&&c.set("validationSuspended",!0),void 0===c.get("validationVersion")&&c.set("validationVersion",1);var f=d(c);a.each(f,function(a,b){var d=["validationSuspended","validationVersion"];d=d.concat(c.validation[b].deps||[b]),c.computeds[b+"_invalid"]={deps:d,get:function(){return!c.checkValid(b,e.liveValidation)}},c.computeds[b+"_error"]={deps:d,get:function(){return c.validationMessage(b,e.liveValidation)}}}),c.initComputeds()}},k=function(a){delete a.validate,delete a.preValidate,delete a.isValid},l=function(a){j(this.view,a,this.options)},m=function(a){k(a)};return{version:"0.9.3-sibrus",configure:function(c){a.extend(b,c)},bind:function(c,d){d=a.extend({},b,d),j(null,c,d)},unbind:function(b,c){c=a.extend({},c);var d=c.model||b.model,e=c.collection||b.collection;d?k(d):e&&(e.each(function(a){k(a)}),e.unbind("add",l),e.unbind("remove",m))},mixin:i(null,b)}}(),e=d.patterns={digits:/^\d+$/,number:/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,url:/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i},f=d.messages={required:"{0} is required",acceptance:"{0} must be accepted",min:"{0} must be greater than or equal to {1}",max:"{0} must be less than or equal to {1}",range:"{0} must be between {1} and {2}",length:"{0} must be {1} characters",minLength:"{0} must be at least {1} characters",maxLength:"{0} must be at most {1} characters",rangeLength:"{0} must be between {1} and {2} characters",oneOf:"{0} must be one of: {1}",equalTo:"{0} must be the same as {1}",digits:"{0} must only contain digits",number:"{0} must be a number",email:"{0} must be a valid email",url:"{0} must be a valid url",inlinePattern:"{0} is invalid"},g=d.labelFormatters={none:function(a){return a},sentenceCase:function(a){return a.replace(/(?:^\w|[A-Z]|\b\w)/g,function(a,b){return 0===b?a.toUpperCase():" "+a.toLowerCase()}).replace(/_/g," ")},label:function(a,b){return b.labels&&b.labels[a]||g.sentenceCase(a,b)}},h=d.validators=function(){var b=String.prototype.trim?function(a){return null===a?"":String.prototype.trim.call(a)}:function(a){var b=/^\s+/,c=/\s+$/;return null===a?"":a.toString().replace(b,"").replace(c,"")},c=function(b){return a.isNumber(b)||a.isString(b)&&b.match(e.number)},d=function(c){return!(a.isNull(c)||a.isUndefined(c)||a.isString(c)&&""===b(c)||a.isArray(c)&&a.isEmpty(c))};return{fn:function(b,c,d,e,f){return a.isString(d)&&(d=e[d]),d.call(e,b,c,f)},required:function(b,c,e,g,h){var i=a.isFunction(e)?e.call(g,b,c,h):e;return i||d(b)?i&&!d(b)?this.format(f.required,this.formatLabel(c,g)):void 0:!1},acceptance:function(b,c,d,e){return"true"===b||a.isBoolean(b)&&b!==!1?void 0:this.format(f.acceptance,this.formatLabel(c,e))},min:function(a,b,d,e){return!c(a)||d>a?this.format(f.min,this.formatLabel(b,e),d):void 0},max:function(a,b,d,e){return!c(a)||a>d?this.format(f.max,this.formatLabel(b,e),d):void 0},range:function(a,b,d,e){return!c(a)||a<d[0]||a>d[1]?this.format(f.range,this.formatLabel(b,e),d[0],d[1]):void 0},length:function(b,c,d,e){return a.isString(b)&&b.length!==d?this.format(f.length,this.formatLabel(c,e),d):void 0},minLength:function(b,c,d,e){return a.isString(b)&&b.length<d?this.format(f.minLength,this.formatLabel(c,e),d):void 0},maxLength:function(b,c,d,e){return a.isString(b)&&b.length>d?this.format(f.maxLength,this.formatLabel(c,e),d):void 0},rangeLength:function(b,c,d,e){return a.isString(b)&&(b.length<d[0]||b.length>d[1])?this.format(f.rangeLength,this.formatLabel(c,e),d[0],d[1]):void 0},oneOf:function(b,c,d,e){return a.include(d,b)?void 0:this.format(f.oneOf,this.formatLabel(c,e),d.join(", "))},equalTo:function(a,b,c,d,e){return a!==e[c]?this.format(f.equalTo,this.formatLabel(b,d),this.formatLabel(c,d)):void 0},pattern:function(a,b,c,g){return d(a)&&!a.toString().match(e[c]||c)?this.format(f[c]||f.inlinePattern,this.formatLabel(b,g),c):void 0}}}();return a.each(h,function(b,d){h[d]=a.bind(h[d],a.extend({},c,h))}),d}(_);