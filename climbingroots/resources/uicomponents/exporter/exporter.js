require(["jquery","$!services.webjars.url('org.xwiki.platform:xwiki-platform-tree-webjar', 'require-config.min.js', {'evaluate': true})"],function(a){var b=function(d,e){var c=this;c.path=d;c.params=e;c.initFromURL=function(h){c.params={};var m=h.indexOf("?");if(m==-1){c.path=h}else{c.path=h.substring(0,m);var g=h.substring(m+1);var k=g.split("&");for(var l=0;l<k.length;++l){var o=k[l].split("=");var j=decodeURIComponent(o[0]);var n=decodeURIComponent(o[1]);if(c.params[j]!==undefined){if(Array.isArray(c.params[j])){c.params[j].push(n)}else{var f=c.params[j];c.params[j]=[f,n]}}else{c.params[j]=n}}}};c.serialize=function(){var f=c.path;var j="?";for(var k in c.params){var h=c.params[k];if(k!=""&&h!==undefined){if(Array.isArray(h)){for(var g=0;g<h.length;++g){f+=j+encodeURIComponent(k)+"="+encodeURIComponent(h[g]);j="&"}}else{if(typeof h==="string"){f+=j+encodeURIComponent(k)+"="+encodeURIComponent(h);j="&"}}}}return f};c.clone=function(){var h=new b();h.path=c.path;h.params=[];for(var g in c.params){if(Array.isArray(c.params[g])){h.params[g]=[];for(var f=0;f<c.params[g].length;++f){h.params[g].push(c.params[g][f])}}else{if(typeof c.params[g]==="string"){h.params[g]=c.params[g]}}}return h}};require(["tree"],function(){a(document).ready(function(){a("#exportModal a.btn").each(function(){var e=a(this);var d=new b();d.initFromURL(e.attr("href"));e.data("url",d)});var c=a("#exportModal .xtree");c.on("loaded.jstree",function(){var d=a.jstree.reference(c);d.settings.checkbox.cascade="down";d.settings.checkbox.three_state=false;d.settings.contextmenu.select_node=false;d.check_all();d.settings.contextmenu.items=function(g){var f={};f.select_children={label:"$escapetool.javascript($services.localization.render('core.exporter.selectChildren'))",action:function(){for(var h=0;h<g.children.length;++h){var j=g.children[h];d.check_node(j)}},_disabled:!g.state.opened};f.unselect_children={label:"$escapetool.javascript($services.localization.render('core.exporter.unselectChildren'))",action:function(){for(var h=0;h<g.children.length;++h){var j=g.children[h];d.uncheck_node(j)}},_disabled:!g.state.opened};return f};a("#exportModal .tree_select_all").click(function(){d.check_all();return false});a("#exportModal .tree_select_none").click(function(){d.uncheck_all();return false});var e=function(i,o){var m=false;var f=false;var h=i.data.id;var j=XWiki.Model.resolve(h,XWiki.EntityType.DOCUMENT);var n=XWiki.Model.serialize(new XWiki.EntityReference("%",XWiki.EntityType.DOCUMENT,j.parent));var g=[];var k=[];var l=[];if(!d.is_checked(i)){l.push(XWiki.Model.serialize(j))}else{k.push(XWiki.Model.serialize(j))}i.children.forEach(function(t){var r=d.get_node(t);var s=r.data.id;var q;if(d.is_leaf(r)){if(r.data.type==="pagination"){m=true;f=d.is_checked(r)}else{q=XWiki.Model.serialize(XWiki.Model.resolve(s,XWiki.EntityType.DOCUMENT));if(d.is_checked(r)){k.push(q)}else{l.push(q)}}}else{q=XWiki.Model.resolve(s,XWiki.EntityType.DOCUMENT);var p=XWiki.Model.serialize(new XWiki.EntityReference("%",XWiki.EntityType.DOCUMENT,q.parent));if(!d.is_loaded(r)){if(d.is_checked(r)){k.push(p)}else{l.push(p)}}else{l.push(p);g.push(r)}}});if(!m||(m&&f)){o[n]=l}else{k.forEach(function(p){o[p]=[]})}g.forEach(function(p){e(p,o)})};a("#exportModal #exportModelOtherCollapse a.btn").click(function(f){f.preventDefault();var l=a(this);var g=l.data("url").clone();var n={};if(g.params!==undefined){g.params.pages=[]}else{g.params={pages:[]}}var k=d.get_node("#").children[0];var j=d.get_node(k);e(j,n);var m=function(o){return o.map(function(p){return encodeURIComponent(p)}).join("&")};a("#export-form").remove();var h=a('<form id="export-form" />').appendTo("body");h.attr({action:g.serialize(),method:"post"});for(var i in n){a("<input>").attr({type:"hidden",name:"pages",value:i}).appendTo(h);a("<input>").attr({type:"hidden",name:"excludes",value:m(n[i])}).appendTo(h)}h.submit()})})})})});