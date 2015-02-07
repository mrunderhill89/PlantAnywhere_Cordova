define(['underscore','backbone','utils/bacon_utils','utils/streams', 'models/timeline_point','models/streaming_model'], function(Underscore, Backbone, Bacon, Streams, TimelinePoint, StreamingModel){
    var KeyFrames = Backbone.Collection.extend({
        binary_search: function(time, check, front, back){
        },
        compare_time: function(time, id){}
    });
    var Timeline = StreamingModel.extend({
        defaults: {
            dependencies:[]
        },
        initialize: function(params){
            this.set("keyframes", new KeyFrames());
            this.attr_property("keyframes");
        },
        integrate: function(time){
            return 0.0;
        }
    });
    return Timeline;
});