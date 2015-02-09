define(['jquery', 'jquery_mobile', 'pixi','backbone_streams', 'views/timeline', 'views/soil'],function($, $m, Pixi, Backbone, TimelineView, SoilView){
    var EnvironmentView = Backbone.StreamingView.extend({
        initialize: function(params){
            this.stage = new Pixi.Stage(0xFFFFFF);
            this.timeline = new TimelineView({
            }).render();
            this.width = $(".app").width();
            this.height = $(".app").height()
                -$(".top_bar").height()
                -this.timeline.$el.height();
            this.renderer = Pixi.autoDetectRenderer(this.width,this.height);
            this.renderer.render(this.stage);
            this.stream("report_time", 
                this.timeline.stream("time").combine(
                    this.property("model").map(".current"), 
                    function(time,env){
                        return env.get("illumination").integrate(time);
                    })
               ).onValue(
                    function(light){console.log(light);}
            );
            /*
            this.on_property("model", function(diff){
                if (diff){
                    if (diff.prev){};
                    if (diff.current){
                        var env = diff.current;
                        this.soil_views = _.map(env.get("soil"), function(soil){
                            return new SoilView(
                                {
                                    model:soil, 
                                    time: this.timeline.property("time"),
                                    stage: this.stage
                                }
                            );});
                    };
                }
            }.bind(this));
            */
        },
        render: function(){
            this.$el.empty()
                .append(this.renderer.view)
                .append(this.timeline.$el);
        }
    });
    return EnvironmentView;
});