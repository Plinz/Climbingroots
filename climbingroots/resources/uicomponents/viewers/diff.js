require(["jquery","xwiki-events-bridge"],function(c){var b=function(){var d=c(this).next("ul");if(d.size()>0){d.hide();c(this).find("a").click(function(e){e.preventDefault();d.toggle()})}};var a=function(d){c(d).find("div.diff-summary-item").each(b)};c(document).on("xwiki:dom:updated",function(d,e){a(e.elements)});a([document.body])});