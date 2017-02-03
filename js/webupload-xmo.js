function xmoupload (options) {
  var _this = this;
  var date_now = new Date();
  _this.settings = $.extend({

  },options || {});

  _this.lang_opt = options.lang || "EN";
  _this.progress_id = date_now.getTime();
  _this.upload;
  _this.radObj;
  _this.init();
}

xmoupload.prototype.init = function() {
  var _this = this;
  if (WebUploader) {

    _this.upload=WebUploader.create(_this.settings);

    _this.bindEvent();
     //resetCss
    setTimeout(function(){_this.resetCss()},1000);
  };
};
xmoupload.prototype.resetCss = function(){
  var _this = this;
  var $resetDiv = $(_this.settings.pick).find("[type=file]");
  if ($resetDiv.length==0) {
    $resetDiv = $(_this.settings.pick).find("object");
  };

  $resetDiv.parent().css("width","80px");
  $resetDiv.parent().css("height","30px");
}
xmoupload.prototype.bindEvent = function(){
  var _this = this;
  var fileQueued = _this.settings.fileQueued || _this.fileQueued;
  var uploadProgress = _this.settings.uploadProgress || _this.uploadProgress;
  var uploadComplete = _this.settings.uploadComplete || _this.uploadComplete;
  var uploadSuccess  = _this.settings.uploadSuccess || _this.uploadSuccess;
  var uploadError  = _this.settings.uploadError || _this.uploadError;
  _this.upload.on( 'uploadComplete', function (file) {
    uploadComplete(file,_this);
  });

  // 文件上传过程中创建进度条实时显示。
  _this.upload.on( 'uploadProgress',function (file, percentage) {
    uploadProgress(file, percentage,_this);
  });

  _this.upload.on("uploadSuccess",function (file,response) {
    uploadSuccess(file,response,_this);
  })

   _this.upload.on("uploadError",function (file) {
    uploadError(file,_this);
  })

   _this.upload.on("fileQueued",function(file){
      fileQueued(file,_this);
   })
}
xmoupload.prototype.fileQueued = function(file,_this){
  /*测试用
  var per=0.1;
   setInterval(function(){
      per+=0.05;
      _this.uploadProgress(file,per,_this);
   },1000);
*/
}
xmoupload.prototype.uploadProgress =  function(file, percentage,_this) {
    var $li = $( '#dnd-content'),
        $percent = $li.find("#"+_this.progress_id).find(".uploadProgress");
    if(percentage==1) percentage=0.95;
    percentage = percentage*100 || 0;
    // 避免重复创建
    if ( !$percent.length ) {
        $percent = $('<div id="'+_this.progress_id+'" class="uploadProgressWrap">' +
          '<div class="uploadProgress" role="progressbar">' +
          '</div>' +
          '<p class="uploadText" role="progressbar">' +
          '</p>' +
        '</div><div class="modal-backdrop fade in" style="background: #fff;"></div>').appendTo( $li ).find('.uploadProgress');
    }
    if (radialIndicator && !_this.radObj) {
        _this.radObj = $percent.radialIndicator({
          barColor: '#F13F2D',
          fontColor:"#333",
          barWidth: 15,
          fontSize: 18,
          initValue: percentage,
          frameNum:10000,
          frameTime:10,
          roundCorner : true,
          percentage:true
        }).data('radialIndicator');
    };

    $li.find('p.uploadText').text(_this.lang[_this.lang_opt]["progressText"]);
    _this.radObj.animate(percentage);
}
xmoupload.prototype.uploadComplete = function(file,_this){
  _this.radObj.animate(100);
  $("#"+_this.progress_id).remove();
  $(".modal-backdrop").remove();
}
xmoupload.prototype.uploadSuccess = function(file,response,_this){

}
xmoupload.prototype.uploadError = function(file,_this){

}
xmoupload.prototype.lang = {
  'ZH':{
    "progressText":"请等候，上传中。。"
  },
  'EN':{
    "progressText":"Please wait,uploading.."
  }
}
