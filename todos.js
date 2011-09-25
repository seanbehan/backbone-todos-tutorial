jQuery(function($){
  /*
    Model
    Since we're using localStorage we do not have to define an endpoint. We are only going to 
    define a couple defaults here. 
    
    Notice that we aren't defining the ${content} variable. Attributes can be attached/saved at anytime.
    We're adding it on line 92 of this file, when we pass an objec to the Todos collection.

  */
  window.Todo = Backbone.Model.extend({
    defaults: {
      done: false
    }
  });

  /*
  The collection of Todo models
  We can define a store (localStorage for now) and the model this collection will be responsible for.
  */
  window.TodoCollection = Backbone.Collection.extend({
    model: Todo,

    localStorage: new Store("todos")

  });
  window.Todos = new TodoCollection; // Needs to be instantiate

  /*
  The single list element view
  <li>${content}</li>
  We use jQuery template to grab the right template and update variables
  with model data. We declare the tagName so it will wrap the template that
  we give it with this element. This is why you only see the ${content} variable in the template.
  */
  window.TodoView = Backbone.View.extend({
    tagName: "li",

    template: $("#todo-item").template(), // Look in index.html for this div. Only contains ${content} variable for now.

    initialize: function(){
      _.bindAll(this, "render");
      this.model.bind("change", this.render,  this);
    },

    render: function(){
      var element = jQuery.tmpl(this.template, this.model.toJSON());
      $(this.el).html(element);
      return this;
    }
  });

  /*
  The application view
  What happens here? When a key is pressed in the #new-todo input field, the
  createTodo function is called. The function checks to see that the Enter key
  was pressed. If yes, it adds a new Todo to the Collection (defined above).
  In the initialize function, we see the following

  Todos.bind('add', this.addOne)

  What this is saying is that anytime the "add" event is fired on "Todos" collection, the addOne function
  should be called as well. When we use the Todos.create method, "add" is called behind the
  scenes. Our addOne function then updates the DOM with the logic. Todos.create/add handles passing a
  model to our addOne function.
  */
  window.AppView = Backbone.View.extend({
    el: $("#app"),

    // execute the createTodo function when a key is pressed
    events: {
      "keypress #new-todo": "createTodo"
    },

    initialize: function(){
      _.bindAll(this, "addOne", "render");
      this.input = this.$("#new-todo"); // store a reference so our functions can use it for convenience.

      Todos.bind('add', this.addOne);
    },

    addOne: function(todo){
      var view = new TodoView({model: todo});
      this.$("#todo-list").prepend(view.render().el); // update DOM
    },

    createTodo: function(e){
      if(e.keyCode!=13) return;
      var value = this.input.val();

      // we use the Todos collection to add items
      Todos.create({content: value});
    }
  });

  window.App = new AppView;
});