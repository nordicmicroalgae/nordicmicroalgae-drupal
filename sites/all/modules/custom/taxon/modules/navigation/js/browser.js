(function ($) {
  
  function localStorageSupport() {
    try {
      return !!localStorage.getItem;
    } catch (e) {
      return false;
    }
  }
  var hasLocalStorage = localStorageSupport();
  
  var TaxonBrowser = {
    container: null,
    params: {
      per_page: 100,
      page: 1
    },
    
    initialize: function (container) {
      // Initialize container elements and render options.
      TaxonBrowser.container = container;
      TaxonBrowser.container.append(
        $('<div class="taxon-browser-options"></div>'),
        $('<div class="taxon-browser-matches"></div>'),
        $('<div class="taxon-browser-pages"></div>'),
        $('<div class="taxon-browser-results"></div>'),
        $('<div class="taxon-browser-pages"></div>')
      );
      
      TaxonBrowser.renderOptions();
    },
    
    renderOptions: function () {
      var limit_options = $('<div class="taxon-browser-limit-options"> per page</div>');
      $([1000, 500, 100]).each(function() {
        var value = parseInt(this);
        var option = TaxonBrowser.buildOption('per_page', value, value);

        if (value == TaxonBrowser.params.per_page)
          option.addClass('current');

        limit_options.prepend(option);
      });
      
      $('div.taxon-browser-options', TaxonBrowser.container).append(limit_options);
    },
    
    render: function (response) {
      TaxonBrowser.renderResults(response.taxa);
      
      var pages = parseInt(response.pages),
          page = parseInt(response.page),
          per_page = parseInt(response.per_page),
          total = parseInt(response.total);
      
      TaxonBrowser.renderPages(pages, page, per_page);
      TaxonBrowser.renderMatches(pages, page, per_page, total);
    },
    
    renderResults: function (results) {
      var table = $('<table></table>');
      var thead = $('<thead><tr><th class="taxon-image">Illustration</th><th class="taxon-name">Taxon name</th></tr></thead>').appendTo(table);
      var tbody = $('<tbody></tbody>').appendTo(table);
      
      if (results.length) {
        for (var i = 0; i < results.length; i++) {
          var name = results[i].name;
          var path = Drupal.taxon.url(name);
          var img_src = Drupal.settings.taxon.media_url + '/small/' + name + '.jpg';
          
          $('<tr></tr>').append(
            $('<td class="taxon-image"></td>').append($('<a></a>').attr('href', path).html('<img src="' + img_src + '" alt="" />')),
            $('<td class="taxon-name"></td>').append($('<a></a>').attr('href', path).html(name))
          ).appendTo(tbody);
          
        }
      }
      
      $('div.taxon-browser-results', TaxonBrowser.container).html(table).removeClass('loading');      
    },
    
    renderMatches: function (pages, page, per_page, total) {
      var container = $('div.taxon-browser-matches', TaxonBrowser.container);
      var start = (total >= 1) ? ((page - 1) * per_page) + 1 : 0;
      var end = (total < (start + per_page - 1)) ? total : start + per_page - 1;
      
      container.html('Displaying ' + start + ' - ' + end + ' of ' + total + ' matches');
    },
    
    renderPages: function (pages, page, per_page) {
      if (pages > 1) {
        var containers = $('div.taxon-browser-pages', TaxonBrowser.container);        
        containers.each(function() {
          var container = $(this);
          for (var i = 1; i <= pages; i++) {
            if (i >= (page - 5) && i <= (page + 5)) {
              var item = TaxonBrowser.buildOption('page', i, i);
              if (i == page)
                item.addClass('current');

              container.append(item);         
            }
          }

          if (page < pages)
            container.append(TaxonBrowser.buildOption('page', 'Next', page + 1));

          if (page > 1)
            container.prepend(TaxonBrowser.buildOption('page', 'Prev', page - 1));
        });
        
      }
    },
    
    
    buildOption: function (option, label, value) {
      return $('<span></span>')
        .html(label)
        .data({ option: option, value: value })
        .click(TaxonBrowser.setOption);
    },
    
    setOption: function () {
      var clicked = $(this);
      if (clicked.hasClass('current'))
        return;
      
      clicked
        .addClass('current')
        .siblings('span')
        .removeClass('current');
      
      TaxonBrowser.setParam(
        clicked.data('option'), 
        clicked.data('value')
      );
      
      TaxonBrowser.update();
    },
    
    setParam: function (key, value) {
      TaxonBrowser.params[key] = value;
    },
    
    update: function () {      
      // Clear result containers and start ajax request.
      $('div.taxon-browser-results', TaxonBrowser.container).empty().addClass('loading');
      $('div.taxon-browser-matches', TaxonBrowser.container).empty();
      $('div.taxon-browser-pages', TaxonBrowser.container).empty();
      
      $.ajax({
        url: Drupal.settings.taxon.api_url + '/taxa.json',
        dataType: 'jsonp',
        data: $.param(TaxonBrowser.params),
        success: TaxonBrowser.render
      });
    }

  }
  
  
  $(document).ready(function() {
    // Containers.
    var browser = $('#taxon-browser');
    var alphabetical = $('#taxon-alphabet');
    var filters = $('#taxon-filters');
    var groups = $('#taxon-groups');

    var savedFilters = {};
    var defaultFilters = {};
        
    if (hasLocalStorage && (window.JSON && window.JSON.parse)) {
      savedFilters = JSON.parse(localStorage.getItem('Drupal.taxon.filters'));
    }
    
    // Initialize filters and groups.
    if (filters.length) {
      setupFilterStates(Drupal.settings.taxon.filters);
      filters.taxonfilters({
        renderSettings: Drupal.settings.taxon.filters,
        changedCallback: (browser.length) ? filtersChanged : $.noop
      });
    }
    
    if (groups.length) {
      setupFilterStates(Drupal.settings.taxon.groups);
      groups.taxongroups({
        renderSettings: Drupal.settings.taxon.groups,
        changedCallback: (browser.length) ? filtersChanged : $.noop
      });
    }
    
    
    // Use default or saved params.
    if ($.isEmptyObject(savedFilters)) {
      TaxonBrowser.params.filters = defaultFilters;
    } else {
      TaxonBrowser.params.filters = savedFilters;
    }
    
    // Initialize alphabetical tree.
    if (alphabetical.length) {
      alphabetical.taxonAlphabet({
        groupSize: 6,
        changeCallback: (browser.length) ? alphabeticalClick : $.noop
      });
    }
    
    // Initialize Taxon Browser.
    if (browser.length) {
      TaxonBrowser.initialize(browser);
      TaxonBrowser.update();
    }
    
    // Alphabetical tree click callback
    function alphabeticalClick(node) {
      if (node.data('value')) {
        TaxonBrowser.setParam('name', node.data('value').split(';'));
      } else {
        TaxonBrowser.setParam('name', '');
      }
      TaxonBrowser.setParam('page', 1);
      TaxonBrowser.update();
    }
    
    // Filters and groups changed callback.
    function filtersChanged() {
      var inputs = $.merge($(':checked', filters), $(':checked', groups));
          
      var params = {};
      inputs.each(function() {
        var filterName = $(this).data('filter');
        var filterValue = $(this).data('value');
        
        if (filterValue) {
          params[filterName] = params[filterName] || [];
          params[filterName].push(filterValue);
        }
      });
      
      if (hasLocalStorage && (window.JSON && window.JSON.stringify)) {
        localStorage.setItem('Drupal.taxon.filters', JSON.stringify(params));
      }
      
      TaxonBrowser.setParam('filters', params);
      TaxonBrowser.update();
    }
    
    function setupFilterStates(settings) {
      for (var group in settings["Groups"]) {
        var options = settings["Groups"][group];
        options = $.isArray(options) ? options : [options];
        $(options).each(function(index, option) {
          
          // Modify checked option if filter exists in saved filters.
          if ($.isEmptyObject(savedFilters) == false) {
            if (savedFilters[option["Filter"]]) {
              var checked = ($.inArray(option["Value"], savedFilters[option["Filter"]]) !== -1);
              option["Checked"] = checked ? "True" : "False";
            } else {
              if (option["Type"] !== "Master") 
                option["Checked"] = "False";
            }
          }
          
          // Add to default filters if default and has a value.
          if (option["Default"] === "True" && option["Value"]) {
            defaultFilters[option["Filter"]] = defaultFilters[option["Filter"]] || [];
            defaultFilters[option["Filter"]].push(option["Value"]);
          }
          
        });
      }
    }    
  });


  
})(jQuery);