/*!
#set ($jsExtension = '.min')
#if (!$services.debug.minify)
  #set ($jsExtension = '')
#end
*/
require.config({paths:{JobRunner:'$!services.webjars.url("org.xwiki.platform:xwiki-platform-job-webjar", "jobRunner$jsExtension")'}});require(["jquery","xwiki-meta","JobRunner"],function(i,j,f){var b=function(s,r){s.find(".ui-progress-background").toggle(r.state!=="NONE");s.find(".ui-progress-message").toggle(r.state==="NONE");if(r.state!=="NONE"){s.find("#state-none-hint").remove()}else{s.find("#state-none-hint").removeClass("hidden")}var q=Math.floor((r.progress.offset||0)*100);s.find(".ui-progress-bar").css("width",q+"%");var p=r.log.items||[];if(p.size()>0){s.find(".ui-progress-message").html(p[p.size()-1].renderedMessage)}};var h=function(s,r,t){var q=s.find(".ui-question");if(typeof t==="function"){var p="${request.contextPath}/job/wiki/"+j.wiki+"/question/"+r.id.join("/");q.data("answerCallback",t);i.ajax(p).done(i.proxy(o,q))}else{q.empty()}};var o=function(q){var p=i(this);p.html(q);p.trigger("job:question:loaded")};var m=function(s,r){var p=r.log.items||[];var q=s.find(".log");if(r.log.offset===0){q.html("")}q.find(".log-item-loading").removeClass("log-item-loading");i.each(p,function(t,u){var v=["log-item","log-item-"+u.level];if(r.state!=="FINISHED"&&t===p.size()-1){v.push("log-item-loading")}i(document.createElement("li")).addClass(v.join(" ")).html(u.renderedMessage).appendTo(q)})};var a=function(q,p){if(typeof q==="function"){return q.bind(p)()}return q};var e=function(s,r){var q={};var t=s.data("job-answer-properties");if(t){d(q,a(t,s))}else{c(q,s,r)}var p=s.data("job-answer-properties-extra");if(p){d(q,a(p,s))}return q};var d=function(q,p){i.each(p,function(r,s){q["qproperty_"+r]=s})};var c=function(s,r,q){var p=r.serializeArray();if(q&&!q.prop("disabled")&&q.attr("name")!==""){p.push({name:q.attr("name"),value:q.val()})}p.each(function(u){var t=s[u.name];if(t){if(Array.isArray(t)){t.push(u.value)}else{t=[t,u.value]}}else{t=u.value}s[u.name]=t})};var g=function(q){q.preventDefault();var s=i(this);var u=s.parents(".form-question");u.find("btAnswerConfirm").prop("disabled",true);u.find("btAnswerCancel").prop("disabled",true);if(u.length){var p=u.parents(".ui-question");if(p.length){var x=p.data("answerCallback");if(typeof x==="function"){var t=u.data("job-answer-createRequest");if(t){x(t)}else{var v=e(u,s);var r="$escapetool.javascript($services.localization.render('job.question.notification.answering'))";if(s.hasClass("btAnswerCancel")){v.cancel="true";r="$escapetool.javascript($services.localization.render('job.question.notification.canceling'))"}var w=new XWiki.widgets.Notification(r,"inprogress");x(v).done(new function(){w.hide()})}}}}};var n=function(q,r){var p=i(this);b(p,q);h(p,q,r);m(p,q)};var l=function(q){var p=i(this);p.find(".ui-progress").replaceWith(q.message)};var k=function(){};i(".job-status").has(".ui-progress").each(function(){var t=i(this);var p=t.attr("data-url");if(p!==""){var r=t.find(".log");var q={};q.createStatusRequest=function(){return{url:p,data:{logOffset:r.find(".log-item").size()}}};var s=t.find(".ui-question");if(s.length){s.on("click",".btAnswerConfirm",g);s.on("click",".btAnswerCancel",g);q.createAnswerRequest=function(u,w){if(typeof w==="function"){return w()}else{var v="${request.contextPath}/job/question/"+u.join("/");return{url:v,data:w}}}}new f(q).resume().progress(i.proxy(n,this)).done(i.proxy(l,this)).fail(i.proxy(k,this))}})});