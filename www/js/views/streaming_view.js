define(['backbone', 'utils/bacon_utils', 'utils/stream_box'],function(Backbone, Bacon, Streams){
    var StreamingView = Backbone.View.extend({
        constructor: function(){
            this.streams = new Streams({
            });
            this.stream("render").onValue(this.render.bind(this));
            Backbone.View.apply(this,arguments);
        },
    });
    Streams.mixin(StreamingView.prototype,"streams")
    return StreamingView;
});