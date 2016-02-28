(function() {

  // @see http://jsdo.it/Yukisuke/y9Jv
  function Base64toBlob(_base64) {
    var i;
    var tmp = _base64.split(',');
    var data = atob(tmp[1]);
    var mime = tmp[0].split(':')[1].split(';')[0];

    //var buff = new ArrayBuffer(data.length);
    //var arr = new Uint8Array(buff);
    var arr = new Uint8Array(data.length);
    for (i = 0; i < data.length; i++) {arr[i] = data.charCodeAt(i);}
    var blob = new Blob([arr], { type: mime });
    return blob;
  }

  // @see http://jsdo.it/Yukisuke/c1VD
  function saveBlob(_blob,_file) {
    if( /*@cc_on ! @*/ false ) {
      // IEの場合
      window.navigator.msSaveBlob(_blob, _file);
    } else {
      var url = (window.URL || window.webkitURL);
      var data = url.createObjectURL(_blob);
      var e = document.createEvent("MouseEvents");
      e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
      a.href = data;
      a.download = _file;
      a.dispatchEvent(e);
    }
  }

  /** jQueryの開始 */
  $(function() {

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    var video = document.getElementById('myVideo');
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var localStream = null;

    /** Canvasへの描画を開始 */
    function start() {
      /**
       * カメラ開始
       */
      navigator.getUserMedia({video: true, audio: false},
        function(stream) { // for success case
          console.log(stream);
          video.src = window.URL.createObjectURL(stream);
          localStream = stream;
        },
        function(err) { // for error case
          console.log(err);
        }
      );

      // 反転
      // ctx.transform(-1, 0, 0, 1, video.width, 0);
      setInterval(function() {
        ctx.drawImage(video, 0, 0);
      }, 1000/30);
    }

    start();

    $("#download").on("click", function(e) {
      var base64 = canvas.toDataURL();    // firfoxならtoblobで直接blobにして保存できます。
      var blob = Base64toBlob(base64);
      saveBlob(blob,"image.png");
    });

    $("#start").on("click", function(e) {
      start();
    });

    $("#stop").on("click", function(e) {
      /*
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      }).then(stream => {
        stream.getVideoTracks()[0].stop();
      });
      */
      localStream.getVideoTracks()[0].stop();
    });

    $("#draw").on("click", function(e) {
      $('#myVideo').pow({
        originX:"60%" || undefined,
        originY:"30%" || undefined,
        rays:"128" || undefined,
        bgColorStart:"hsl(210, 100%, 90%)" || undefined,
        bgColorEnd:"hsl(210, 100%, 97%)" || undefined,
        rayColorStart:"hsl(210, 100%, 60%)" || undefined,
        rayColorEnd:"hsl(210, 100%, 80%)" || undefined,
        originEl:undefined
      });
    });

  });

})();
