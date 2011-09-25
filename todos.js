jQuery(function($){
  window.Todo = Backbone.Model.extend({
    defaults: {
      done: false
    }
  });

  window.TodoCollection = Backbone.Collection.extend({
    model: Todo,

    localStorage: new Store("todos")

  });
  window.Todos = new TodoCollection;

  window.TodoView = Backbone.View.extend({
    tagName: "li",

    template: $("#todo-item").template(),

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

  window.AppView = Backbone.View.extend({
    el: $("#app"),

    events: {
      "keypress #new-todo": "createTodo"
    },

    initialize: function(){
      _.bindAll(this, "addOne", "render");
      this.input = this.$("#new-todo");

      Todos.bind('add', this.addOne);
    },

    addOne: function(todo){
      var view = new TodoView({model: todo});
      this.$("#todo-list").prepend(view.render().el);
    },

    createTodo: function(e){
      if(e.keyCode!=13) return;
      var value = this.input.val();
      Todos.create({content: value});
    }
  });

  window.App = new AppView;
});