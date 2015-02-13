import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';
import PagedInfiniteArray from 'ember-cli-pagination/infinite/paged-infinite-array';


export default Ember.ArrayController.extend({

  queryParams: ["page"],
  page: 1,


  sortProperties: ['firstName', 'lastName'],
  sortAscending: true,



  filteredContent: Ember.computed.alias('arrangedContent'),


  // "unpaged" in this example indicates the source array (the content property) is a regular (unpaged) array, as opposed to a PagedArray.
  // pagedContent: pagedArray('filteredContent', {infinite: "unpaged", perPage: 5}),

  pagedContent: function() {

    console.log("len:", this.get('filteredContent.length'));

    var ops = {
      infinite: "unpaged", 
      perPage: 5,
      // page: this.get('currentPage'),
      all: this.get('filteredContent')
    };
     var paged = PagedInfiniteArray.createFromUnpaged(ops);

     console.log(paged);

     return paged;
    // return PagedInfiniteArray.create({all: this.get('filteredContent')});
  }.property('filteredContent.length'),

  // currentPage: Ember.computed.alias('pagedContent.page'),
  // totalPages: Ember.computed.alias('pagedContent.totalPages'),


/* 2 ember syntax's for observers */
      // observePageBefore1: function() {
      //   console.log("currentPage:", this.get('currentPage'));
      // }.observesBefore('currentPage'),

      // observePageBefore2: Ember.beforeObserver('currentPage', function() {
      //    console.log("currentPage will change:", this.get('currentPage'));
      // }),

      // observePageAfter1: function() {
      //   console.log("currentPage:", this.get('currentPage'));
      // }.observes('currentPage'),

      // observePageAfter2: Ember.observer('currentPage', function(obj, keyName) {
      //   console.log("currentPage after change:", this.get('currentPage'));
      // }),
/* end */

  
  // contentArrayWillChange: function(array, idx, removedCount, addedCount) {

  //   console.log(array);
  //   console.log(idx);
  //   console.log(removedCount);
  //   console.log(addedCount);


  //   return this._super(array, idx, removedCount, addedCount);
  // },



  // _contentWillChange: Ember.beforeObserver('content', function() {

  //   console.log("sdfsdfsd >>> ");
  //   var content = this.get('content');

  //   if (content) { content.removeArrayObserver(this); }
  //   var len = content ? this.get('content.length') : 0;
  //   this.arrayWillChange(content, 0, len);
  // }),
  
  nextId: 1,


  actions: {
    loadNext: function() {
      this.get('pagedContent').loadNextPage();
    },

    dropItems: function() {
      this.get('filteredContent.firstObject').destroyRecord();
    },

    addItems: function() {

      var person = this.store.createRecord('person', {
        id: this.get('nextId'),
        firstName: 'Alpha',
        lastName: this.get('nextId')
      });

      person.save();

      this.incrementProperty('nextId');
    }


  }
});

// iPage: 0,
// iPerPage: 10,

// content: null, 
// sortProperties: ['id'],
// sortAscending: false,
// arrangedContent: null,


// paginatedContent: (function() {
//   var start = (this.get('iPage') - 1) * this.get('iPerPage');
//   var end = start + this.get('perPage');
  
//   return this.get('arrangedContent').slice(start, end);
// }).property('page', 'totalPages', 'arrangedContent.[]'),

