define(['backbone', 'bacon', 'models/streaming_model'],function(Backbone, Bacon, StreamingModel){
    var EnvironmentModel = StreamingModel.extend({
        defaults: {
            readers: [],
            read_public: false,
            writers: [],
            write_public: false,
            name: "",
            description: "",
        },
    });
    return EnvironmentModel;
});