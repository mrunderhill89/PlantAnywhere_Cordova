define(['backbone_streams', 'bacon'],function(Backbone, Bacon){
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
        }
    });
    return EnvironmentModel;
});