require(["jquery","xwiki-meta"],function(b,c){b(document).on("click","#button-inout",function(){var d=b("#button-inout");var g=b("#reference-value");var e=c.documentReference.relativeTo(c.documentReference.getRoot());var f=c.documentReference;if(d.hasClass("btn-info")){g.text(e);d.removeClass("btn-info");d.attr("title","$services.localization.render('core.viewers.information.pageReference.globalButton')")}else{g.text(f);d.addClass("btn-info");d.attr("title","$services.localization.render('core.viewers.information.pageReference.localButton')")}});var a=function(d){var f=b("<input>");b("body").append(f);var e=b(d).text();f.val(e).select();document.execCommand("copy");f.remove();return e};b(document).on("click","#button-paste",function(){a("#reference-value");new XWiki.widgets.Notification("$services.localization.render('core.viewers.information.pageReference.copied')","info")})});