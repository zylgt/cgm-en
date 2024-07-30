/**
 * 注册事件监听器，并返回一个可用于移除事件监听的对象。
 *
 * @param {Object} target - 事件监听器要添加到的目标对象。
 * @param {string} eventType - 事件类型，如 'click'、'blur' 等。
 * @param {function} cb - 事件回调函数。
 * @returns {Object} - 可用于移除事件监听的对象，具有一个 `remove` 方法。
 */
 export function _registerEvent(target, eventType, cb) {
    const eventListener = target.addEventListener || target.attachEvent;
    eventListener.call(target, eventType, cb);
  
    return {
      remove: function () {
        const eventRemover = target.removeEventListener || target.detachEvent;
        eventRemover.call(target, eventType, cb);
      },
    };
  }
  
  /**
   * 在打开指定URI之前设置一个超时，以处理超时情况。
   *
   * @param {string} uri - 要打开的URI。
   * @param {function} failCb - 超时或失败时的回调函数。
   * @param {function} successCb - 成功时的回调函数。
   * @param {number} timeoutDuration - 超时时长（毫秒）。
   */


  // function openUriWithTimeoutHack(){

  // }

  function _createHiddenIframe(target, uri) {
    let iframe = document.createElement("iframe");
    iframe.src = uri;
    iframe.id = "hiddenIframe";
    iframe.style.display = "none";
    target.appendChild(iframe);

    return iframe;
  }

  function openUriWithHiddenFrame(uri, failCb, successCb, timeoutDuration) {

      let timeout = setTimeout(function () {
          failCb();
          handler.remove();
      }, timeoutDuration);

      let iframe = document.querySelector("#hiddenIframe");
      if (!iframe) {
          iframe = _createHiddenIframe(document.body, "about:blank");
      }

      let handler = _registerEvent(window, "blur", onBlur);

      function onBlur() {
          clearTimeout(timeout);
          handler.remove();
          successCb();
      }

      iframe.contentWindow.location.href = uri;
  }
  function openUriWithTimeoutHack(uri, failCb, successCb, timeoutDuration) {
    let timeout = setTimeout(function () {
      failCb();
      handler.remove();
    }, timeoutDuration);
  
    let target = window;
    while (target !== target.parent) {
      target = target.parent;
    }
    let handler = _registerEvent(target, 'blur', onBlur);
  
    function onBlur() {
      clearTimeout(timeout);
      handler.remove();
      successCb();
    }
  
    window.location = uri;
  }
  function checkBrowser() {
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var ua = navigator.userAgent.toLowerCase();
    return {
        isOpera   : isOpera,
        isFirefox : typeof InstallTrigger !== 'undefined',
        isSafari  : (~ua.indexOf('safari') && !~ua.indexOf('chrome')) || Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
        isIOS     : /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
        isChrome  : !!window.chrome && !isOpera,
        isIE      : /*@cc_on!@*/false || !!document.documentMode // At least IE6
    }
  }
  export function openProcedure(uri, failCb, successCb, timeoutDuration){
    var browser = checkBrowser();
    if(browser.isSafari){
      return openUriWithHiddenFrame(uri, failCb, successCb, timeoutDuration)
    }else{
      return openUriWithTimeoutHack(uri, failCb, successCb, timeoutDuration)
    }

  }
  