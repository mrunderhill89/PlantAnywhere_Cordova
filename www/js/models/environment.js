define(['backbone_streams', 'bacon', 'models/timeline', 'models/timeline_point'],function(Backbone, Bacon, Timeline, TimelinePoint){
    var EnvironmentModel = Backbone.StreamingModel.extend({
        defaults: {
            readers: [],
            read_public: false,
            writers: [],
            write_public: false,
            name: "",
            description: "",
        },
        initialize: function(attributes, options){
            var illumination = new Timeline({
                points:[
                    new TimelinePoint({time: 0, value:0.0}),  //Midnight
                    new TimelinePoint({time: 6, delta:0.5}),  //Dawn
                    new TimelinePoint({time: 12, delta: 0.5}),//Noon
                    new TimelinePoint({time: 18, delta:-0.5}),//Dusk
                    new TimelinePoint({time: 23, delta:-0.4}),//Midnight
                    new TimelinePoint({time: 24, value:0.0}),//Midnight
                ]
            });
            this.set("illumination", illumination);
        }
    });
    return EnvironmentModel;
});