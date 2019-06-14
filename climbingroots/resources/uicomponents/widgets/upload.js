var XWiki=(function(d){if(typeof(File)==="undefined"||typeof(FormData)==="undefined"||typeof(XMLHttpRequest)==="undefined"){return d}var b={secondsToTime:function(h){var g=Math.floor(h/3600);var e=Math.floor((h-(g*3600))/60);var f=Math.floor(h-(g*3600)-(e*60));if(g<10){g="0"+g}if(e<10){e="0"+e}if(f<10){f="0"+f}return g+":"+e+":"+f},bytesToSize:function(e){var g=["b","Kb","Mb"];if(e==0){return"n/a"}var f=parseInt(Math.floor(Math.log(e)/Math.log(1024)));if(f>=g.length){f=g.length-1}return(e/Math.pow(1024,f)).toFixed(1)+" "+g[f]},createDiv:function(e,f){return new Element("div",{"class":e||""}).update(f||"")},createSpan:function(e,f){return new Element("span",{"class":e||""}).update(f||"")},createButton:function(f,e){return new Element("a",{"class":"button secondary",href:"#"}).update(f||"").wrap("span",{"class":"buttonwrapper"}).observe("click",e||Prototype.emptyFunction)}};var c=Class.create({initialize:function(g,e,h,f){this.file=g;this.container=e;this.formData=h;this.options=f;this.validate();this.initProgressParameters();this.generateStatusUI()},validate:function(){if(!this.options.fileFilter.test(this.file.type)){throw"INVALID_FILE_TYPE"}if(this.file.size>this.options.maxFilesize){throw"UPLOAD_LIMIT_EXCEEDED"}},generateStatusUI:function(){var e=this.statusUI={};e.UPLOAD_STATUS=b.createDiv("upload-status upload-inprogress");if(this.options.enableFileInfo){e.FILE_INFO=b.createDiv("file-info");(e.FILE_NAME=b.createSpan("file-name",this.file.name)).title=this.file.type;e.FILE_SIZE=b.createSpan("file-size"," ("+b.bytesToSize(this.file.size)+")");e.FILE_CANCEL=b.createButton("$services.localization.render('core.widgets.html5upload.item.cancel')",this.cancelUpload.bindAsEventListener(this));e.FILE_INFO.insert(e.FILE_NAME).insert(e.FILE_SIZE).insert(e.FILE_CANCEL);e.UPLOAD_STATUS.insert(e.FILE_INFO)}if(this.options.enableProgressInfo){e.PROGRESS_INFO=b.createDiv("progress-info");e.PROGRESS_CONTAINER=b.createDiv("progress-container");e.PROGRESS=b.createDiv("progress");e.PROGRESS_PERCENTAGE=b.createSpan("progress-percentage","&nbsp;");e.PROGRESS_SPEED=b.createSpan("progress-speed","&nbsp;");e.PROGRESS_REMAINING=b.createSpan("progress-remaining","&nbsp;");e.PROGRESS_TRANSFERED=b.createSpan("progress-transfered","&nbsp;");e.PROGRESS_INFO.insert(e.PROGRESS_CONTAINER.insert(e.PROGRESS)).insert(e.PROGRESS_PERCENTAGE).insert(e.PROGRESS_TRANSFERED).insert(b.createDiv("progress-time").insert(e.PROGRESS_SPEED).insert(e.PROGRESS_REMAINING).insert(b.createDiv("clearfloats")));e.UPLOAD_STATUS.insert(e.PROGRESS_INFO)}if(this.options.responseContainer){e.UPLOAD_RESPONSE=this.options.responseContainer}else{e.UPLOAD_RESPONSE=b.createDiv("upload-response");e.UPLOAD_STATUS.insert(e.UPLOAD_RESPONSE)}this.container.insert(e.UPLOAD_STATUS);return e},initProgressParameters:function(){this.progressData={bytesUploaded:0,bytesTotal:0,previousBytesUploaded:0,resultFileSize:"",latestSpeed:0,updatesPerSecond:2,updatesDone:0}},startUploading:function(g){if(this.canceled){this.onUploadAbort();return}if(g){g.stop()}var h=new FormData();h.append(this.formData.input.name,this.file);var e=this.formData.additionalFields;Object.keys(e).each(function(i){e[i]&&h.append(i,e[i])});var f=this.request=new XMLHttpRequest();if(this.options.enableProgressInfo){f.upload.addEventListener("progress",this.onUploadProgress.bindAsEventListener(this),false);this.timer=setInterval(this.doInnerUpdates.bind(this),Math.round(1000/this.progressData.updatesPerSecond))}f.upload.addEventListener("load",this.onUploadFinish.bindAsEventListener(this),false);f.addEventListener("load",this.onRequestDone.bindAsEventListener(this),false);f.addEventListener("error",this.onUploadError.bindAsEventListener(this),false);f.addEventListener("abort",this.onUploadAbort.bindAsEventListener(this),false);f.open("POST",this.formData.action);f.send(h)},cancelUpload:function(e){e&&e.stop();if(this.completed){return}this.request&&this.request.abort();this.canceled=true;clearInterval(this.timer);this.statusUI.FILE_CANCEL.addClassName("upload-canceled-label").removeClassName("buttonwrapper").update("$services.localization.render('core.widgets.html5upload.item.canceled')");this.statusUI.UPLOAD_STATUS.removeClassName("upload-inprogress").addClassName("upload-canceled")},doInnerUpdates:function(){this.progressData.updatesDone=this.progressData.updatesDone+1;var g=this.progressData.updatesDone/this.progressData.updatesPerSecond;var e=this.progressData.bytesUploaded;var k=e-this.progressData.previousBytesUploaded;if(k===0){return}this.progressData.previousBytesUploaded=e;var f=e/g;var j=this.progressData.bytesTotal-this.progressData.previousBytesUploaded;var h=j/f;var l=k*this.progressData.updatesPerSecond;var i=b.bytesToSize(l)+"/s";this.progressData.latestSpeed=i;this.statusUI.PROGRESS_SPEED.update(i);this.statusUI.PROGRESS_REMAINING.update(" | "+b.secondsToTime(h))},onUploadProgress:function(g){if(g.lengthComputable){this.progressData.bytesUploaded=g.loaded;this.progressData.bytesTotal=g.total;var f=Math.round(g.loaded*100/g.total);var e=b.bytesToSize(this.progressData.bytesUploaded);this.statusUI.PROGRESS_PERCENTAGE.update(f+"%");this.statusUI.PROGRESS.style.width=f+"%";this.statusUI.PROGRESS_TRANSFERED.update("("+e+")")}else{this.statusUI.PROGRESS.update("n/a")}},onUploadFinish:function(e){this.completed=true;clearInterval(this.timer);if(this.statusUI.FILE_CANCEL){this.statusUI.FILE_CANCEL.addClassName("hidden")}this.formData.input.fire("xwiki:html5upload:message",{content:"UPLOAD_FINISHING",type:"inprogress",source:this,parameters:{name:this.file.name}})},onRequestDone:function(e){if(e&&e.target&&typeof e.target.status==="number"){if(e.target.status>=200&&e.target.status<300){this.statusUI.UPLOAD_RESPONSE.update(e.target.responseText)}else{this.onUploadError();return}}if(this.options.enableProgressInfo){this.statusUI.PROGRESS_PERCENTAGE.update("100%");this.statusUI.PROGRESS.style.width="100%";this.statusUI.PROGRESS_REMAINING.update(" | 00:00:00");this.statusUI.PROGRESS_TRANSFERED.update("("+b.bytesToSize(this.file.size)+")");if(this.progressData.latestSpeed===0){this.statusUI.PROGRESS_SPEED.update(b.bytesToSize(this.file.size)+"/s")}}this.formData.input.fire("xwiki:html5upload:message",{content:"UPLOAD_FINISHED",type:"done",source:this,parameters:{name:this.file.name,size:b.bytesToSize(this.file.size)}});this.formData.input.fire("xwiki:html5upload:fileFinished",{source:this});clearInterval(this.timer);this.statusUI.UPLOAD_STATUS.removeClassName("upload-inprogress").addClassName("upload-done")},onUploadError:function(){this.statusUI.FILE_CANCEL.remove();this.statusUI.UPLOAD_STATUS.removeClassName("upload-inprogress").addClassName("upload-error");this.abnormalUploadFinish("UNKNOWN_ERROR")},onUploadAbort:function(){this.abnormalUploadFinish("UPLOAD_ABORTED")},abnormalUploadFinish:function(e){clearInterval(this.timer);this.formData.input.fire("xwiki:html5upload:message",{content:e,type:"error",source:this,parameters:{name:this.file.name}});this.formData.input.fire("xwiki:html5upload:fileFinished",{source:this})}});var a='$!escapetool.javascript($xwiki.getSpacePreference("upload_maxsize"))';a=parseInt(a||33554432);d.FileUploader=Class.create({options:{maxFilesize:a,fileFilter:/.*/i,enableFileInfo:true,enableProgressInfo:true,progressAutohide:false,autoUpload:true,targetURL:null,responseContainer:null,responseURL:null},messages:{UNKNOWN_ERROR:new Template("$services.localization.render('core.widgets.html5upload.error.unknown', ['#{name}'])"),INVALID_FILE_TYPE:new Template("$services.localization.render('core.widgets.html5upload.error.invalidType', ['#{name}'])"),UPLOAD_LIMIT_EXCEEDED:new Template("$services.localization.render('core.widgets.html5upload.error.invalidSize', ['#{name}', '#{size}'])"),UPLOAD_ABORTED:new Template("$services.localization.render('core.widgets.html5upload.error.aborted', ['#{name}'])"),UPLOAD_FINISHING:new Template("$services.localization.render('core.widgets.html5upload.status.finishing', ['#{name}'])"),UPLOAD_FINISHED:new Template("$services.localization.render('core.widgets.html5upload.status.finished', ['#{name}', '#{size}'])")},initialize:function(e,f){this.options=Object.extend(Object.clone(this.options),f||{});if(e.__x_html5uploader){return}else{e.__x_html5uploader=this}if(e.type!="file"){return}this.input=e;this.inputContainer=this.input.up(".fileupload-field")||this.input;this.form=e.form;if(!this.form){return}var g=this.form.down("input[type=hidden][name="+e.name+"__filter]");if(!this.options.fileFilter&&g&&g.value!=""){this.options.fileFilter=new RegExp(g.value,"i")}this.options.targetURL=this.options.targetURL||this.form.action;this.formData={input:this.input,action:this.options.targetURL,additionalFields:{}};var i=this.form.down("input[name=xredirect]");this.formData.additionalFields.xredirect=this.options.responseURL||i&&i.value;var h=this.form.down("input[name=form_token]");h&&(this.formData.additionalFields.form_token=h.value);this.onUploadNextFile=this.onUploadNextFile.bindAsEventListener(this);this.input.observe("change",this.onFilesSelected.bindAsEventListener(this));this.input.observe("xwiki:html5upload:start",this.showUploadStatus.bindAsEventListener(this));this.input.observe("xwiki:html5upload:start",this.onUploadNextFile);this.input.observe("xwiki:html5upload:fileFinished",this.onUploadNextFile);this.input.observe("xwiki:html5upload:message",this.onMessage.bindAsEventListener(this));this.input.observe("xwiki:html5upload:done",this.onUploadDone.bindAsEventListener(this));this.generateStatusUI()},generateStatusUI:function(){var e=this.statusUI={};e.CONTAINER=b.createDiv("upload-status-container");e.LIST=b.createDiv("upload-status-list");e.CANCEL=b.createButton("$services.localization.render('core.widgets.html5upload.cancelAll')",this.cancelUpload.bindAsEventListener(this));e.HIDE=b.createButton("$services.localization.render('core.widgets.html5upload.hideStatus')",this.hideUploadStatus.bindAsEventListener(this));e.HIDE.hide();e.CONTAINER.insert(e.LIST).insert(e.CANCEL).insert(e.HIDE)},showUploadStatus:function(){this.inputContainer.insert({after:this.statusUI.CONTAINER});this.statusUI.HIDE.hide();this.statusUI.CANCEL.show()},hideUploadStatus:function(e){e&&e.stop();this.input.value="";this.statusUI.CONTAINER.up()&&this.statusUI.CONTAINER.remove();this.statusUI.LIST.update("")},onFilesSelected:function(){var h=this.input.files.length;this.fileUploadItems=[];for(var g=0;g<h;++g){var f=this.input.files[g];try{this.fileUploadItems.push(new c(f,this.statusUI.LIST,this.formData,this.options))}catch(e){this.showMessage(e,"error",{size:b.bytesToSize(this.options&&this.options.maxFilesize),name:f.name,type:f.type})}}Event.fire(this.input,"xwiki:html5upload:start")},onUploadNextFile:function(){var e=this.currentUpload=this.fileUploadItems.shift();if(e){e.startUploading()}else{Event.fire(this.input,"xwiki:html5upload:done")}},cancelUpload:function(e){e&&e.stop();this.fileUploadItems.invoke("cancelUpload");this.currentUpload&&this.currentUpload.cancelUpload();this.input.fire("xwiki:html5upload:done")},onUploadDone:function(){this.statusUI.CANCEL.hide();if(this.options.progressAutohide){setTimeout(this.hideUploadStatus.bind(this),2000)}else{this.statusUI.HIDE.show()}},onMessage:function(e){if(!(e.memo&&e.memo.source&&e.memo.content)){return}if(e.memo.source._currentMessage){e.memo.source._currentMessage.hide()}e.memo.source._currentMessage=this.showMessage(e.memo.content,e.memo.type,e.memo.parameters)},showMessage:function(h,f,g){var e=this.messages[h]||h;if(e instanceof Template){e=e.evaluate(g||{})}return new d.widgets.Notification(e,f||"plain")},hideFormButtons:function(){if(!this.form.hasClassName("html5upload-initialized")){this.form.addClassName("html5upload-initialized");if(this.options.autoUpload){this.form.select("input[type=submit]").invoke("hide")}var e=this.form.down(".cancel");if(e){e.hide()}}}});return d}(XWiki||{}));