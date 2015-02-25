# Backbone.Validation

This is a heavily modified version of https://github.com/thedersen/backbone.validation - it is NOT compatible with the original. Basically all the "view" parts have been completely ripped out and replaced with a tight integration with knockout+knockback. The customization is tailored towards a single project, it is not suitable for general consumption.

## Getting started

Short version: include the following in your view template and use either the 'desktop' or 'tablet' layout:
```
{% set dataBinding = true %}
```

### Configure validation rules on the Model

To configure your validation rules, simply add a validation property with a property for each attribute you want to validate on your model. The validation rules can either be an object with one of the built-in validators or a combination of two or more of them, or a function where you implement your own custom validation logic.

Validating complex objects is also supported. To configure validation rules for objects, use dot notation in the name of the attribute, e.g `'address.street'`.

#### Example

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    name: {
      required: true
    },
    'address.street': {
      required: true
    },
    'address.zip': {
      length: 4
    },
    age: {
      range: [1, 80]
    },
    email: {
      pattern: 'email'
    },
    someAttribute: function(value) {
      if(value !== 'somevalue') {
        return 'Error message';
      }
    }
  }
});

// validation attribute can also be defined as a function returning a hash
var SomeModel = Backbone.Model.extend({
  validation: function() {
    return {
      name: {
        required: true
      };
    }
  }
});
```

See the **[built-in validators](#built-in-validators)** section for a list of the validators and patterns that you can use.

### Specifying error messages

Backbone.Validation comes with a set of default error messages. If you don't like to use those, you can either [override them](#extending-backbone-validation/overriding-the-default-error-messages), or you can specify error messages where you declare validation rules on the model.

You can specify an error message per attribute by adding a `msg` property like this:

```js
MyModel = Backbone.Model.extend({
  validation: {
    email: {
      required: true,
      pattern: 'email',
      msg: 'Please enter a valid email'
    }
  }
});
```

Or, you can specify an error message per validator, by adding an array of validators like this:

```js
MyModel = Backbone.Model.extend({
  validation: {
    email: [{
      required: true,
      msg: 'Please enter an email address'
    },{
      pattern: 'email',
      msg: 'Please enter a valid email'
    }]
  }
});
```

The `msg` property can also be a function returning a string.

## Validation on the view

See prototype code. Particularly `ZenithMobilePOSBundle:Prototype:form.html.twig`

Short version - define validation on the model, wrap it in a ViewModel, bind it to the view, use the `validate` or `isValid` and `errorMsg` binding handlers. See `ZenithMobilePOSBundle:Layout:_dataBinding.html.twig` for the details on how the handlers work, or look at the prototype code for examples of how they are used.

## Using model validation

The philosophy behind this way of using the plugin, is to give you an easy way to implement validation across *all* your models without the need to bind to a view. Of course, if you use this option the callbacks to update the view is not executed, since there is no way of knowing what view a model belongs to.

### Validation mix-in

If your model is being wrapped in a ViewModel, which should be the case 99% of the time, you do not need to do this. It is only needed if you are ONLY doing validation in the model.

To add validation to your models, call `bind` in the `initialize` method. 

```js
	initialize: function() {
        	Backbone.Validation.bind(this, {liveValidation: false});
        },
```

## Methods

### validate

This is called by Backbone when it needs to perform validation. You can also call it manually without any parameters to validate the entire model.

### isValid

Check to see if an attribute, an array of attributes or the entire model is valid.

`isValid` returns `undefined` when no validation has occurred and the model has validation (except with Backbone v0.9.9 where validation is called from the constructor), otherwise, `true` or `false`.

If you pass `true` as an argument, this will force an validation before the result is returned:

```js
var isValid = model.isValid(true);
```

If you pass the name of an attribute or an array of names, you can check whether or not the attributes are valid:

```js
// Check if name is valid
var isValid = model.isValid('name');

// Check if name and age are valid
var isValid = model.isValid(['name', 'age']);
```

### preValidate

Sometimes it can be useful to check (for instance on each key press) if the input is valid - without changing the model - to perform some sort of live validation. You can execute the set of validators for an attribute, or a hash of attributes, by calling the `preValidate` method and pass it the name of the attribute and the value to validate, or a hash of attributes.

If the value is not valid, the error message is returned (truthy), otherwise it returns a falsy value.

```js
// Validate one attribute
// The `errorsMessage` returned is a string
var errorMessage = model.preValidate('attributeName', 'Value');

// Validate a hash of attributes
// The errors object returned is a key/value pair of attribute name/error, e.g
// {
//   name: 'Name is required',
//   email: 'Email must be a valid email'
// }
var errors = model.preValidate({name: 'value', email: 'foo@example.com');
```

## Configuration

### Callbacks

The `Backbone.Validation.callbacks` contains two methods: `valid` and `invalid`. These are called after validation of an attribute is performed when using form validation.

The default implementation of `invalid` tries to look up an element within the view with an name attribute equal to the name of the attribute that is validated. If it finds one, an `invalid` class is added to the element as well as a `data-error` attribute with the error message. The `valid` method removes these if they exists.

The implementation is a bit naïve, so I recomend that you override it with your own implementation

globally:

```js
_.extend(Backbone.Validation.callbacks, {
  valid: function(view, attr, selector) {
    // do something
  },
  invalid: function(view, attr, error, selector) {
    // do something
  }
});
```
### Force update

*Default: false*

Sometimes it can be useful to update the model with invalid values. Especially when using automatic modelbinding.

You can turn this on globally by calling:

```js
Backbone.Validation.configure({
  forceUpdate: true
});
```

Or, you can turn it on for one set operation only (Backbone.VERSION >= 0.9.1 only):

```js
model.set({attr: 'invalidValue'}, {
  forceUpdate: true
});
```

Note that when switching this on, Backbone's error event is no longer triggered.

### Label formatter

*Default: sentenceCase*

Label formatters determines how an attribute name is transformed before it is displayed in an error message.

There are three options available:

* 'none': Just returns the attribute name without any formatting
* 'sentenceCase': Converts `attributeName` or `attribute_name` to Attribute name
* 'label': Looks for a label configured on the model and returns it. If none found, sentenceCase is applied.

```js
var Model = Backbone.Model.extend({
  validation: {
    someAttribute: {
      required: true
    }
  },

  labels: {
    someAttribute: 'Custom label'
  }
});
```

To configure which one to use, set the labelFormatter options in configure:

```js
Backbone.Validation.configure({
  labelFormatter: 'label'
});
```


## Events

After validation is performed, the model will trigger some events with the result of the validation.

Note that the events reflects the state of the model, not only the current operation. So, if for some reason your model is in an invalid state and you set a value that is valid, `validated:invalid` will still be triggered, not `validated:valid`.

The `errors` object passed with the invalid events is a key/value pair of attribute name/error.

```js
{
  name: 'Name is required',
  email: 'Email must be a valid email'
}
```

### validated

The `validated` event is triggered after validation is performed, either it was successful or not. `isValid` is `true` or `false` depending on the result of the validation.

```js
model.bind('validated', function(isValid, model, errors) {
  // do something
});
```

### validated:valid

The `validated:valid` event is triggered after a successful validation is performed.

```js
model.bind('validated:valid', function(model) {
  // do something
});
```

### validated:invalid

The `validated:invalid` event is triggered after an unsuccessful validation is performed.

```js
model.bind('validated:invalid', function(model, errors) {
  // do something
});
```

## Built-in validators

### method validator

Lets you implement a custom function used for validation.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    name: function(value, attr, computedState) {
      if(value !== 'something') {
        return 'Name is invalid';
      }
    }
  }
});

var SomeModel = Backbone.Model.extend({
  validation: {
    name: {
      fn: function(value, attr, computedState) {
        if(value !== 'something') {
          return 'Name is invalid';
        }
      }
    }
  }
});
```

### named method validator

Lets you implement a custom function used for validation.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    name: 'validateName'
  },
  validateName: function(value, attr, computedState) {
    if(value !== 'something') {
      return 'Name is invalid';
    }
  }
});

var SomeModel = Backbone.Model.extend({
  validation: {
    name: {
      fn: 'validateName'
    }
  },
  validateName: function(value, attr, computedState) {
    if(value !== 'something') {
      return 'Name is invalid';
    }
  }
});
```

### required

Validates if the attribute is required or not.
This can be specified as either a boolean value or a function that returns a boolean value.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    name: {
      required: true | false
    }
  }
});

var SomeModel = Backbone.Model.extend({
  validation: {
    name: {
      required: function(value, attr, computedState) {
        return true | false;
      }
    }
  }
});
```

### acceptance

Validates that something has to be accepted, e.g. terms of use. `true` or 'true' are valid.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    termsOfUse: {
      acceptance: true
    }
  }
});
```

### min

Validates that the value has to be a number and equal to or greater than the min value specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    age: {
      min: 1
    }
  }
});
```

### max

Validates that the value has to be a number and equal to or less than the max value specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
      age: {
      max: 100
    }
  }
});
```

### range

Validates that the value has to be a number and equal to or between the two numbers specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    age: {
      range: [1, 10]
    }
  }
});
```

### length

Validates that the value has to be a string with length equal to the length value specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    postalCode: {
      length: 4
    }
  }
});
```

### minLength

Validates that the value has to be a string with length equal to or greater than the min length value specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    password: {
      minLength: 8
    }
  }
});
```

### maxLength

Validates that the value has to be a string with length equal to or less than the max length value specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    password: {
      maxLength: 100
    }
  }
});
```

### rangeLength

Validates that the value has to be a string and equal to or between the two numbers specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    password: {
      rangeLength: [6, 100]
    }
  }
});
```

### oneOf

Validates that the value has to be equal to one of the elements in the specified array. Case sensitive matching.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    country: {
      oneOf: ['Norway', 'Sweeden']
    }
  }
});
```

### equalTo

Validates that the value has to be equal to the value of the attribute with the name specified.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    password: {
      required: true
    },
    passwordRepeat: {
      equalTo: 'password'
    }
  }
});
```

### pattern

Validates that the value has to match the pattern specified. Can be a regular expression or the name of one of the built in patterns.

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    email: {
      pattern: 'email'
    }
  }
});
```
The built-in patterns are:

* number - Matches any number (e.g. -100.000,00)
* email - Matches a valid email address (e.g. mail@example.com)
* url - Matches any valid url (e.g. http://www.example.com)
* digits - Matches any digit(s) (i.e. 0-9)

Specify any regular expression you like:

```js
var SomeModel = Backbone.Model.extend({
  validation: {
    email: {
      pattern: /^sample/
    }
  }
});
```

## Extending Backbone.Validation

### Adding custom validators

If you have custom validation logic that are used several places in your code, you can extend the validators with your own. And if you don't like the default implementation of one of the built-ins, you can override it.

```js
_.extend(Backbone.Validation.validators, {
  myValidator: function(value, attr, customValue, model) {
    if(value !== customValue){
      return 'error';
    }
  },
  required: function(value, attr, customValue, model) {
    if(!value){
      return 'My version of the required validator';
    }
  },
});

var Model = Backbone.Model.extend({
  validation: {
    age: {
      myValidator: 1 // uses your custom validator
    }
  }
});
```

The validator should return an error message when the value is invalid, and nothing (`undefined`) if the value is valid. If the validator returns `false`, this will result in that all other validators specified for the attribute is bypassed, and the attribute is considered valid.

### Adding custom patterns

If you have custom patterns that are used several places in your code, you can extend the patterns with your own. And if you don't like the default implementation of one of the built-ins, you can override it.

Remember to also provide a default error message for it.

```js
_.extend(Backbone.Validation.patterns, {
  myPattern: /my-pattern/,
  email: /my-much-better-email-regex/
});

_.extend(Backbone.Validation.messages, {
  myPattern: 'This is an error message'
});

var Model = Backbone.Model.extend({
  validation: {
    name: {
      pattern: 'myPattern'
    }
  }
});
```

### Overriding the default error messages

If you don't like the default error messages you can easilly customize them by override the default ones globally:

```js
_.extend(Backbone.Validation.messages, {
  required: 'This field is required',
  min: '{0} should be at least {1} characters'
});
```

The message can contain placeholders for arguments that will be replaced:

* `{0}` will be replaced with the [formatted name](#configuration/label-formatter) of the attribute being validated
* `{1}` will be replaced with the allowed value configured in the validation (or the first one in a range validator)
* `{2}` will be replaced with the second value in a range validator

## Examples

* [Example 1:](http://jsfiddle.net/thedersen/udXL5/) Uses jQuery.serializeObject to serialize the form and set all data on submit
* [Example 2:](http://jsfiddle.net/thedersen/c3kK2/) Uses [StickIt](https://github.com/NYTimes/backbone.stickit) to perform binding between the model and the view

*If you have other cool examples, feel free to fork the fiddle, add a link here, and send me a pull request.*

## FAQ

### What gets validated when?

If you are using Backbone v0.9.1 or later, all attributes in a model will be validated. However, if for instance `name` never has been set (either explicitly or with a default value) that attribute will not be validated before it gets set.

This is very useful when validating forms as they are populated, since you don't want to alert the user about errors in input not yet entered.

If you need to validate entire model (both attributes that has been set or not) you can call `validate()` or `isValid(true)` on the model.

### Can I call one of the built in validators from a method validator?

Yes you can!

```js
var Model = Backbone.Model.extend({
  validation: {
    name: function(val, attr, computed) {
      return Backbone.Validation.validators.length(val, attr, 4, this);
    }
  }
});
```

### Can I call one of the custom validators from a custom validator?

Yes you can!

```js
_.extend(Backbone.Validation.validators, {
  custom: function(value, attr, customValue, model) {
    return this.length(value, attr, 4, model) || this.custom2(value, attr, customValue, model);
  },
  custom2: function(value, attr, customValue, model) {
    if (value !== customValue) {
      return 'error';
    }
  }
});
```

### How can I allow empty values but still validate if the user enters something?

By default, if you configure a validator for an attribute, it is considered required. However, if you want to allow empty values and still validate when something is entered, add required: false in addition to other validators.

```js
validation: {
	value: {
		min: 1,
    required: false
  }
}
```

### Do you support conditional validation?

Yes, well, sort of. You can have conditional validation by specifying the required validator as a function.

```js
validation: {
  attribute: {
    required: function(val, attr, computed) {
      return computed.someOtherAttribute === 'foo';
    },
    length: 10
  }
}
```

In the example above, `attribute` is required and must have 10 characters only if `someOtherAttribute` has the value of foo. However, when `attribute` has any value it must be 10 characters, regardless of the value of `someOtherAttribute`.

## License

http://thedersen.mit-license.org/
