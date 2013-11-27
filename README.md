# Backbone Presenter

![https://travis-ci.org/crushlovely/backbone-presenter.png](https://travis-ci.org/crushlovely/backbone-presenter.png)

A [model-presenter](https://github.com/crushlovely/model-presenter) adapter for Backbone models.

For more information on how to customize your presenter, see the [model-presenter](https://github.com/crushlovely/model-presenter) README.

## Example

```js
var Backbone = require('backbone');

var PersonPresenter = Backbone.Presenter.extend({

  customAttributes: {
    fullName: function() {
      return this.attributes.firstName + ' ' + this.attributes.lastName;
    },
    fullNameAllCaps: function() {
      return this.customAttribute('fullName').toUpperCase();
    }
  },

  strategies: {
    avatar: {
      whitelist: ['image', 'username'],
      customAttributes: ['fullNameAllCaps']
    },
    profile: {
      blacklist: ['ssn'],
      customAttributes: ['fullName']
    },
    chat: {
      whitelist: ['image', 'username', 'memberSince']
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
    image: 'image.jpeg',
    username: 'createbang',
    firstName: 'Michael',
    lastName: 'Phillips',
    ssn: '111-11-1111',
    memberSince: '2013-01-01'
});

person.present() // returns full representation of object including custom attributes
person.present('avatar') // returns {image: 'image.jpeg', username: 'createbang', fullNameAllCaps: 'MICHAEL PHILLIPS'}
person.present('profile') // returns all model data except ssn and adds fullName custom attribute
person.present('chat') // returns just the whitelisted keys
```



## Installation

Extends the `Backbone` global with the constructor `Presenter`.

via npm

```bash
$ npm install backbone-presenter
```

## Usage

Backbone Presenters are defined as an attribute on the applicable model and are bound to the model in the initialize method:

```js
var Person = Backbone.Model.extend({

  presenter: PersonPresenter,

  initialize: function() {
    this.presenter.bind( this );
  }

})
```

### serialize

Presenters call a method on the presenter class to convert the model into a raw JavaScript object, if one is defined.  Backbone.Presenter defines the serialize method as the result of `model.toJSON()`.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Running tests

```bash
npm install
npm test
```
