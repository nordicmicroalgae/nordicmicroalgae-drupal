(function( $ ){
  
  $.fn.taxongroups = function( options ) {
    
    var config = $.extend({
      changedCallback: $.noop,
      renderSettings: {}
    }, options);
    
    return this.each(function() {
      
      var container = $(this).addClass('taxon-groups');
      for (index in config.renderSettings["Group list"]) {
        var group = config.renderSettings["Group list"][index];
        var options = config.renderSettings["Groups"][group];
        
        var label = $('<label></label>');
        label.html(' ' + options["Label"]);
        label.css('background-color', '#' + options["Color"]);
        label.attr('title', options["Hint"]);
        
        var input = $('<input />');
        input.attr({
          type: 'radio',
          name: 'taxon_groups',
          value: options["Value"]
        });
        input.data({
          filter: 'Group',
          value: options["Value"]
        });
        
        input.attr('defaultChecked', options["Default"] === "True");
        if (options["Checked"]) {
          input.attr('checked', options["Checked"] === "True");
        }
        
        input.change(function() { config.changedCallback(); });
        
        label.prepend(input);
        container.append(label);
      }
           
    });
    
  }
  
})(jQuery)