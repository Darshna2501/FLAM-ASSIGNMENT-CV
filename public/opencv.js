// Lightweight shim to load real OpenCV.js from CDN when served
;(function(){
  var src = 'https://docs.opencv.org/4.x/opencv.js'
  var s = document.createElement('script')
  s.async = true
  s.src = src
  s.onload = function(){ /* cv global becomes available */ }
  s.onerror = function(){ console.error('Failed to load OpenCV.js from CDN') }
  document.currentScript && document.currentScript.parentNode ? document.currentScript.parentNode.appendChild(s) : document.head.appendChild(s)
})()


