(function( $ ){
  
  $.fn.taxonfilters = function( options ) {
    
    var config = $.extend({
      changedCallback: $.noop,
      renderSettings: {}
    }, options);
    
    return this.each(function() {
      var container = $(this);

      for (var index in config.renderSettings["Group list"]) {
        var group = config.renderSettings["Group list"][index];
        
        var fieldset = $('<fieldset></fieldset>');
        var legend = $('<legend></legend>');
        legend.html(group);
        fieldset.append(legend);
        
        var options = config.renderSettings["Groups"][group];
        for (var i = 0; i < options.length; i++) {
          
          var label = $('<label></label>');
          label.html(' ' + options[i]["Label"]);
          
          var input = $('<input type="checkbox" />');
          
          input.data('filter', options[i]["Filter"]);
          input.data('value', options[i]["Value"]);
          
          input.attr('defaultChecked', options[i]["Default"] === "True");
  
          if (options[i]["Checked"]) 
            input.attr('checked', options[i]["Checked"] === "True");
          
          if (options[i]["Type"] == 'Master') {
            input.addClass('master');
            input.change(function() {
              $(this).parents('fieldset').find('input').attr('checked', false);
              $(this).parents('fieldset').find('input.master').attr('checked', true);
            });
          } else {
            input.attr('value', options[i]["Value"]);
            input.change(function() {
              $(this).parents('fieldset').find('input.master').attr('checked', false);
            });
          }
          
          input.change(function() { config.changedCallback() } );
          
          label.prepend(input);
          fieldset.append(label);
        }
        container.append(fieldset);
      }
      
      var reset = $('<a href="#">Reset filters</a>').prependTo(container);
      reset.click(function() {
        var hasChanged = false;
        $(':checkbox', container).each(function() {
          var checked = $(this).attr('checked');
          var defaultChecked = $(this).attr('defaultChecked');
      
          $(this).attr('checked', defaultChecked);
          
          if (checked !== defaultChecked) 
            hasChanged = true;
        });
        
        if (hasChanged) 
          config.changedCallback();
      });
      
     
    });
    
  }
  
})(jQuery)