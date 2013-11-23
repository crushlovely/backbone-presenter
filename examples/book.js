var Backbone = require('backbone');
               require('../lib/backbone-presenter');




var PersonPresenter = Backbone.Presenter.extend({

  customAttributes: {

    salutation: function() {
      var salutationMap = {male: 'Mr', female: {married: 'Mrs', notMarried: 'Ms'}}
      var genderMap = salutationMap[ this.attributes.gender ]
      var marriedStatus = ( this.attributes.married ) ? 'married' : 'notMarried'
      var salutation = ( typeof genderMap === 'string' ) ? genderMap : genderMap[ marriedStatus ]
      return salutation
    }

  , fullName: function() {
      return [this.attributes.firstName, this.attributes.lastName].join(' ');
    }

  , fullNameWithSalutation: function() {
      return [this.customAttribute('salutation') + '.', this.customAttribute('fullName')].join(' ')
    }

  }

, strategies: {

    stationery: {
      whitelist: ['firstName']
    , attributes: ['salutation', 'fullNameWithSalutation']
    }

  , whitelisted: {
      whitelist: ['firstName']
    }

  , blacklisted: {
      blacklist: ['ssn']
    }
  }

})




var Person = Backbone.Model.extend({

  presenter: PersonPresenter

, initialize: function() {
    this.presenter.bind( this );
  }

})


var person = new Person({
  firstName: 'John'
, lastName: 'Smith'
, gender: 'male'
, married: true
, ssn: '111-11-1111'
});




var View = new Backbone.View({

  render: function() {
    this.$el.html( this.template( this.model.presenter() ) );
  }

});


var view = new View();