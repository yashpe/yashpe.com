var compressor = require('node-minify');

// Using Google Closure
new compressor.minify({
    type: 'gcc',
    fileIn: ["ext/jquery.min.js", 
             "ext/underscore-min.js", 
             "ext/jquery.scrollToPos.min.js", 
             "ext/jquery.mousewheel.min.js",
             "assets/wedding.js"],
    fileOut: 'assets/base-min-gcc.js',
    callback: function(err, min){
        console.log(err);
        
//        console.log(min);
    }
});



// Using YUI Compressor for CSS
new compressor.minify({
    type: 'yui-css',
    fileIn: ["ext/reset.css",
            "assets/animate.css",
             "assets/wedding.css"],
    fileOut: 'assets/base-min-yui.css',
    callback: function(err, min){
        console.log(err);
//        console.log(min);
    }
});