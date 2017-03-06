(function($) {
  
  function localStorageSupport() {
    try {
      return !!localStorage.getItem;
    } catch (e) {
      return false;
    }
  }
  var hasLocalStorage = localStorageSupport();
  
  $(document).ready(function() {    
    // Abort if localStorage isn't supported.
    if (!hasLocalStorage) return;

    var form = $('#taxon-media-form');

    // Create save button and bind a click handler that saves the form.
    var saveButton = $('<button>Save as template</button>');
    saveButton.click(function() {
      // Serialize form elements (name, value and states).
      var items = form.find('.save-state').map(function(index, element) {
        var obj = $(this);
      
        // Return name, value and selected-state for each option in select boxes.
        if (obj.is('select')) {
          return $.map(element.options, function(option, i) {
            return { name: element.name, value: $(option).val(), selected: option.selected };
          });
        }
        
        // Return name, value and checked-state for radio and checkbox,
        // and just name and value for everyhing else.
        return {
          name: element.name,
          value: obj.val(),
          checked: obj.is(':checkbox, :radio') ? element.checked : undefined
        };
      }).get();
      
      localStorage.setItem('Drupal.taxon.media_form', JSON.stringify(items));
    });
    
    // Create restore button and bind a click handler that restores the form.
    var restoreButton = $('<button>Load template</button>');
    restoreButton.click(function() {
      var items = JSON.parse(localStorage.getItem('Drupal.taxon.media_form'));
      $(items).each(function(index, item) {
        var element = $('[name="' + item['name'] + '"]', form);
        if (element.is('select, :checkbox, :radio')) {
          var selector = '[value="' + item['value'] + '"]';
          if (element.is('select')) {
            element.find(selector).attr('selected', item['selected']);
          } else {
            element.filter(selector).attr('checked', item['checked']);
          }
        } else {
          element.val(item['value']);
        } 
      });
      
    });

    // Create a container and append buttons.
    var container = $('<div></div>');
    container.append(saveButton);
    container.append(restoreButton);
    
    // Insert the container before the form.
    form.before(container);  
  });
  
})(jQuery);
