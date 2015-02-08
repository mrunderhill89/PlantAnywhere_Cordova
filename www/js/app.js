require.config({
  paths: {
    jquery: 'libs/jquery/jquery',
    jquery_mobile: 'libs/jquery/jquery.mobile-1.4.5',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
    backbone_associations: 'libs/backbone/backbone-associations',
    backbone_streams: 'libs/backbone/backbone-streams',
    bacon:'libs/bacon/bacon',
    pixi:'libs/pixi/pixi.dev',
  },
    shims:{
        backbone_associations:{
            deps:["backbone"],
            exports:"Backbone"
        },
        backbone_streams:{
            deps:["backbone", "bacon"],
            exports:"Backbone"
        }
    }
});

requirejs(['bacon', 'backbone', 'views/main', 'routes/router', 'cordova.js'],
    function (Bacon, Backbone, MainView, MainRouter) {
        var exec = cordova.require('cordova/exec');
        var main_router = new MainRouter({});
        var main_view = new MainView({
            el: ".main_view",
            router: main_router
        });
        Backbone.history.start({ pushState: true });
    }
); 