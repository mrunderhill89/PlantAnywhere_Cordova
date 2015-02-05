require.config({
  paths: {
    jquery: 'libs/jquery/jquery',
    jquery_mobile: 'libs/jquery/jquery.mobile-1.4.5',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
    backbone_associations: 'libs/backbone/backbone-associations',
    bacon:'libs/bacon/bacon',
    pixi:'libs/pixi/pixi.dev',
  },
    shims:{
        backbone_associations:{
            deps:["backbone"],
            exports:"Backbone"
        },
    }
});

requirejs(['bacon', 'views/main', 'cordova.js'],
    function (Bacon, MainView) {
        var exec = cordova.require('cordova/exec');
        var main_view = new MainView({
            el: ".app"
        });
    }
); 