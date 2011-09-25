jQuery(function($){
  window.Todo = Backbone.Model.extend({
    defaults: {
      title: "Hello World",
      done: false
    },

    toggle: function(){
      this.save({done: !this.get("done")});
    }
  });

  window.TodoCollection = Backbone.Collection.extend({
    model: Todo,
    localStorage: new Store("todos"),

    done: function(){
      return this.filter(function(todo){
        return todo.get('done');
      });
    },

    remaining: function(){
      return this.filter(function(todo){
        return !todo.get('done')
      });
    }

  });
  window.Todos = new TodoCollection;

  window.TodoView = Backbone.View.extend({
    tagName: "li",

    events: {
      "click li .checkbox":  "toggleDone",
      "click a.delete":                 "deleteTodo",
      "click a.edit":                   "editTodo",
      "dblclick span":                  "editTodo",
      "click a.cancel":                 "cancelEdit",
      "click .done":                    "doneEditing"
    },

    template: $("#todo-item").template(),

    initialize: function(){
      _.bindAll(this, "render", "toggleDone", "deleteTodo", "editTodo", "cancelEdit", "doneEditing");

      this.model.bind("change", this.render,  this);
      this.model.bind("destroy", this.remove, this);
    },

    toggleDone: function(){
      this.model.toggle()
    },

    editTodo: function(){
      $(".editing").removeClass("editing");
      $(this.el).addClass('editing').focus();
    },

    cancelEdit: function(){
      $(this.el).removeClass('editing');
    },

    doneEditing: function(){
      this.model.save({content: this.$("input[type=text]").val()})
      $(this.el).removeClass('editing');
    },

    deleteTodo: function(){
      this.model.destroy()
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
      "keypress #new-todo": "createTodo",
      "click .clear-done": "clearDone",
      "click .check-remaining": "checkRemaining"
    },

    initialize: function(){
      _.bindAll(this, "addOne", "addAll", "clearDone", "checkRemaining", "render");

      this.input = this.$("#new-todo");

      Todos.bind('add', this.addOne);       // when Todos.create is called, add is invoked
      Todos.bind('reset', this.addAll);   // refresh needs to fetch and add all to the page

      Todos.fetch();
    },

    clearDone: function(){
      _.each(Todos.done(), function(todo){
        todo.destroy();
      });
      return false;
    },

    checkRemaining: function(){
      var remaining = Todos.remaining()
      if(remaining.length == 0){
        _.each(Todos.done(), function(todo){
          todo.toggle();
        });
      } else {
        _.each(Todos.remaining(), function(todo){
          todo.toggle();
        });
      }
    },

    addAll: function(){
      Todos.each(this.addOne)
    },

    addOne: function(todo){
      var view = new TodoView({model: todo});
      this.$("#todo-list").prepend(view.render().el);
    },

    createTodo: function(e){
      if(e.keyCode!=13) return;
      var value = this.input.val();
      if(!value) return;

      Todos.create({content: value}); // will call add (which is bound above)
      this.input.val(''); // reset the input field
    }
  });

  window.App = new AppView;

});