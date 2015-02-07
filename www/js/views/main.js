define(['jquery_mobile', 'backbone_streams', 'bacon', 'views/environment'],function($, Backbone, Bacon, EnvironmentView){
    var MainView = Backbone.StreamingView.extend({
        initialize: function(params){
            this.device_ready =  Bacon.fromEventTarget(document, 'deviceready');
            this.device_ready.onValue(this.render.bind(this));
            this.sub_views = {
                environment: new EnvironmentView()
            };
            
            this.router = params.router;
        },
        render: function(){
            if (this.current){
                this.$el.empty().append(
                    this.sub_views[this.current].render().$el
                );
            };
            return this;
        },
    });
    return MainView;
});