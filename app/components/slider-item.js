import Ember from 'ember';
import SliderElement from '../mixins/slider-element';

export default Ember.Component.extend(SliderElement, {
  classNameBindings: [':no-select', ':slider-item']

});
