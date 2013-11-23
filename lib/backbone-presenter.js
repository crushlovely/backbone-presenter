var _ = require('underscore');
var Backbone = require('backbone');
var Presenter = require('model-presenter');




Backbone.Presenter = Presenter.extend({

  serializer: function( model ) {
    return model.toJSON();
  }

})

module.exports = Backbone;
