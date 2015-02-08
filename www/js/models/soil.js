define(['underscore','backbone_associations','models/plant', 'collections/nutrients'],function(_, Backbone,Plant,Nutrients){
    var Soil = Backbone.AssociatedModel.extend({
        defaults : {
            plant: null,
            x: 0,
            y: 0
        },
    });
    return Soil;
});