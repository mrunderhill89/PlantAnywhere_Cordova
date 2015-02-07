define(['backbone','utils/bacon_utils','utils/streams', 'models/streaming_model'], function(Backbone, Bacon, Streams, StreamingModel){
    var TimelinePoint = StreamingModel.extend({
        defaults: {
            time: 0,
            value: null,
            delta: null
        },
        initialize: function(params){
            
        }
    });
    return TimelinePoint;
});