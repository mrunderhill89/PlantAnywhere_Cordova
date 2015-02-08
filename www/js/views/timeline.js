define(['jquery','jquery_mobile', 'backbone_streams', 'bacon'],function($,$m, Backbone, Bacon){
    var TimelineView = Backbone.StreamingView.extend({
        initialize: function(params){
            //<input type="range" name="slider-1" id="slider-1" value="60" min="0" max="100">
            this.scrubber = $("<input>")
                .attr("type","range")
                .attr("id","scrubber")
                .attr("value","0")
                .attr("min","0")
                .attr("max","100")
                ;
            this.property("time", null, 0.0);
        },
        render: function(){
            var time = this.stream("time");
            this.$el.empty()
                .attr("data-role","footer")
                .addClass("ui-bar")
                .append(this.scrubber)
                .on('change','#scrubber',function(){
                    time.push(this.value);
                });
            return this;
        }
    });
    return TimelineView;
});