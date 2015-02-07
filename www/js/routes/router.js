define(['jquery', 'underscore', 'backbone_streams', 'utils/bacon_utils', 'models/environment'], function($, _, Backbone, Bacon, EnvironmentModel){
    var MainRouter = Backbone.Router.extend({
        routes: {
            "environment/:id":"environment",
            "*actions": "default"
        },
        initialize: function(params){
            this.streams = new Backbone.Streams({
                environment: null,
                user: null
            },{
                environment: null,
                user: null
            });
            var test_env = new EnvironmentModel({
                name:"Test Environment"
            });
            test_env.on_property("name", function(name){console.log(name);});

            this.fire_stream("environment", test_env);
            this.on('route:default', function (actions) {
                console.log("router.default:" + actions );
            });
        },
    });
    Backbone.Streams.mixin(MainRouter.prototype, "streams");
    return MainRouter;
});