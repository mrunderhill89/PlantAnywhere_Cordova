define(['underscore', 'backbone_streams', 'utils/bacon_utils', 'models/environment'], function(_, Backbone, Bacon, EnvironmentModel){
    var MainRouter = Backbone.Router.extend({
        routes: {
            "environment/:id":"environment",
            "*actions": "default"
        },
        initialize: function(params){
            this.streams = new Backbone.Streams();
            this.property("user", this.stream("user").scan_replace());
            this.property("environment", this.stream("environment").scan_replace());
            this.on_property("environment", function(params){
                var env = params.current;
                if (env){
                    env.on_property("name", function(name){
                        console.log(name);
                    });
                }
            });
            var test_env = new EnvironmentModel({
                name:"Test Environment"
            });
            this.fire_stream("environment", test_env);
            this.on('route:default', function (actions) {
                console.log("router.default:" + actions );
            });
        },
    });
    Backbone.Streams.mixin(MainRouter.prototype, "streams");
    return MainRouter;
});