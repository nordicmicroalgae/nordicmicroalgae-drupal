(function ($) {
  
  var config = {
    placeholder: 'Taxon search',
    acceptedNamesLimit: 15,
    synonymNamesLimit: 10
  }
  
  $(document).ready(function() {
    var wrapper = $('#taxon-search');
    if (wrapper.length == 0) {
      return;
    }
    
    // Create a new input element and append it to ther wrapper element.
    var input = $('<input type="text" />').appendTo(wrapper);
    
    // Add placeholder.
    input.val(config.placeholder)
    input.focus(function() { 
      if ($(this).val() == config.placeholder) 
        $(this).val('') 
    });
    input.blur(function() { 
      if ($(this).val() == '') 
        $(this).val(config.placeholder) 
    });
    
    // Initialize automplete widget.
    input.autocomplete({
      position: {
        my: 'right top',
        at: 'right bottom'
      },
      source: function(request, response) {
        var accepted_names = [];
        var synonym_names = [];
        var all_called = false;
        var counter = 0;
        
        function handleNames(taxa, name_status) {
          if (name_status === 'accepted') {
            accepted_names = $.map(taxa, function(taxon) {
              return {
                label: taxon.name,
                value: taxon.name,
                classname: 'accepted-name'
              }
            });
          }
          else if (name_status === 'synonym') {
            synonym_names = $.map(taxa, function(taxon) {
              return {
                label: taxon.synonym_name + ' (synonym)',
                value: taxon.name,
                classname: 'synonym-name'
              }
            });
          }
          
          counter--;
          if (all_called && counter === 0) {
            var items = $.merge(accepted_names, synonym_names);
            response(items);
          }
        }
        
        // Load accepted names that match requested term.
        counter++;
        $.ajax({
          url: Drupal.settings.taxon.api_url + '/taxa.json',
          dataType: 'jsonp',
          data: {
            name: '*' + request.term + '*',
            name_status: 'accepted',
            per_page: config.acceptedNamesLimit
          },
          success: function(data) { handleNames(data.taxa, 'accepted'); }
        });
        
        // Load synonym names that match requested term.
        counter++;
        $.ajax({
          url: Drupal.settings.taxon.api_url + '/taxa.json',
          dataType: 'jsonp',
          data: {
            name: '*' + request.term + '*',
            name_status: 'synonym',
            per_page: config.synonymNamesLimit
          },
          success: function(data) { handleNames(data.taxa, 'synonym'); }
        });
        
        
        all_called = true;
      },
      select: function(event, ui) {
        window.location = Drupal.taxon.url(ui.item.value);
      }
    });
    
    // Modify the AC item builder to add custom classname (for name status).
    input.data('autocomplete')._renderItem = function(ul, item) {
      return $('<li></li>')
        .data('item.autocomplete', item)
        .append($('<a></a>').text(item.label))
        .addClass(item.classname)
        .appendTo(ul);
    }
    
  });

})(jQuery);