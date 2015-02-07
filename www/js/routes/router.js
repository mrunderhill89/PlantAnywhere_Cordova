define(['jquery', 'underscore', 'backbone', 'utils/bacon_utils', 'utils/stream_box', 'models/environment'], function($, _, Backbone, Bacon, Streams, EnvironmentModel){
    var MainRouter = Backbone.Router.extend({
        routes: {
            "environment/:id":"environment",
            "*actions": "default"
        },
        initialize: function(params){
            this.streams = new Streams({
                environment: null,
                user: null
            },{
                environment: null,
                user: null
            });
            this.on('route:default', function (actions) {
                console.log("router.default:" + actions );
            });
        },
    });
    Streams.mixin(MainRouter.prototype, "streams");
    return MainRouter;
});