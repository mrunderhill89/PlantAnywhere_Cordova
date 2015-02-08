define(['jquery_mobile', 'backbone_streams', 'utils/bacon_utils', 'views/environment'],function($, Backbone, Bacon, EnvironmentView){
    var MainView = Backbone.StreamingView.extend({
        initialize: function(params){
            this.router = params.router;
            this.sub_views = {
                environment: new EnvironmentView({
                    model:this.router.property("environment")
                })
            };
            this.property("current_view", this.stream("current_view").scan_replace("environment"));
            this.stream("device_ready", Bacon.fromEventTarget(document, 'deviceready'));
            this.on_stream("device_ready", this.render.bind(this));
        },
        render: function(){
            this.on_property("current_view", function(params){
                var sub_view = this.sub_views[params.current];
                sub_view.render();
                this.$el.empty().append(sub_view.$el).trigger("create");
            }.bind(this));
            return this;
        },
    });
    return MainView;
});