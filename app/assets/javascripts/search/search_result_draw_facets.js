jQuery(document).ready(function($) {
    "use strict";

    window.collex.create_facet_button = function(label, value, action, key) {
        return window.pss.createHtmlTag("button",
            { 'class': 'select-facet nav_link crop', 'data-action': action, 'data-key': key, 'data-value': value , 'title': value}, label);
  };

    window.collex.number_with_delimiter = function(number) {
        var delimiter = ',';
        var separator = '.';
        var parts = (""+number).split('.');
        parts[0] = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter);
        return parts.join(separator);
    };

    function totalFacetCount(_hash) {
        return _.chain(_hash).values().reduce(function(m,x) { return parseInt(m) + parseInt(x); }, 0).value();
    }

    function createFacetRow(name, count, dataKey, isSelected, label, hide) {
        var _style = "display: none";
        if (!hide) _style = "";
        if (!label) label = name;
        if (isSelected) {
          var remove = window.collex.create_facet_button('[X]', name, "remove", dataKey);
          return window.pss.createHtmlTag("tr", { 'class': "limit_to_selected", 'style': _style },
            window.pss.createHtmlTag("td", { 'class': "limit_to_lvl1" }, label + "&nbsp;&nbsp;" + remove) +
            window.pss.createHtmlTag("td", { 'class': "num_objects" }, window.collex.number_with_delimiter(count)));
        } else {
          var button = window.collex.create_facet_button(label, name, "add", dataKey);
          return window.pss.createHtmlTag("tr", {'class': ''+ dataKey, 'style': _style},
            window.pss.createHtmlTag("td", { 'class': "limit_to_lvl1" }, button) +
            window.pss.createHtmlTag("td", { 'class': "num_objects" }, window.collex.number_with_delimiter(count)));
        }
  }

    function createFacetBlockOrig(facet_class, hash, dataKey, selected, labels) {
        var html = "";
        if (typeof selected === 'string') selected = [ selected ];
        for (var key in hash) {
            if (hash.hasOwnProperty(key)) {
                var selectedIndex = $.inArray(key, selected);
                var label = key;
                if (labels) label = labels[key];
                html += createFacetRow(key, hash[key], dataKey, selectedIndex !== -1, label);
            }
        }

        var block = $("."+facet_class);
        var header = window.pss.createHtmlTag("tr", {}, block.find("tr:first-of-type").html());
        block.html(header + html);
    }

    // helper for createRoleFacetBlock()
    function data_key_and_header_text(key) {
        var key_header = {
            'role_AUT': ['aut', 'Author'],
            'role_OWN': ['r_own', 'Owner'],
            'role_RPS': ['r_rps', 'Repository'],
        };
        return key_header[key]
    }

    function createRoleFacetBlock(facet_class, obj) {
        var html = "";
        var selected = "";
        var labels = "";

        var hash_role = obj.facets.role;
        var consolidated_role_params = [];

        for(var role in obj.facets.role) {

            var role_members = obj.facets[role];
            if (role_members) {
                var stripped_values = _.object(_.map(role_members, function (value, key) {
                    return [key.replace(/[0-9.,/(/)-]/g, '').strip(), value]
                }));
                consolidated_role_params[role] = stripped_values;
            }
        }

        var idx = 0;
        for (var key in consolidated_role_params) {
            if (consolidated_role_params.hasOwnProperty(key)) {
                var data_key = data_key_and_header_text(key)[0];
                var data_value = data_key_and_header_text(key)[1];

                selected = obj.query[data_key];

                if (typeof selected === 'string') selected = [ selected ];
                var selectedIndex = $.inArray(key, selected);
                var label = key;
                if (labels) label = labels[key];
                html += createFacetCountRow(data_value, totalFacetCount(consolidated_role_params[key]), data_key, selectedIndex !== -1, label, false, (idx != 0 && selected == undefined));

                for (var _key in consolidated_role_params[key]) {
                    if (typeof selected === 'string') selected = [selected];
                    var selectedIndex = $.inArray(_key.strip(), selected);
                    var label = _key;
                    if (labels) label = labels[_key];
                    html += createFacetRow(_key, consolidated_role_params[key][_key], data_key, selectedIndex !== -1, _key, (idx != 0 && selected == undefined));
                }
            }
            idx++;
        }

        var block = $("."+facet_class);
        var header = window.pss.createHtmlTag("tr", {}, block.find("tr:first-of-type").html());
        block.html(header + html);
    }

    function createFacetCountRow(name, count, dataKey, isSelected, label, isSubmenu, hide) {
        var header_text = name;
        var arrow = (hide == true ? '' : 'hidden');
        var down = (hide == true ? 'hidden' : '');
        var menu_style = (hide == true ? 'collapsed' : 'expanded');
        var arrow_html = '<span class="exp-arrow "' + arrow + '><img alt="Arrow" src="/assets/arrow.gif">' +
                         '</span><span class="col-arrow"' + down + '><img alt="Arrow_dn" src="/assets/arrow_dn.gif"></span>';

        return window.pss.createHtmlTag("tr", {'class': 'category-btn ' + menu_style, 'data-key': dataKey},
            window.pss.createHtmlTag("td", {'class': "limit_to_lvl0"}, arrow_html + '<span class="nav_link">' + header_text + '</span>') +
            window.pss.createHtmlTag("td", {'class': "num_objects"}, window.collex.number_with_delimiter(count)));
    }

    function createFacetBlock(facet_class, obj) {
        var html = "";
        var total = 0;
        var selected = "";
        var labels = "";

        var hash_genre = obj.facets.genre;
        var hash_publisher = obj.facets.publisher;
        var hash_coverage = obj.facets.coverage;
        var hash_discipline = obj.facets.discipline;
        var hash_format = obj.facets.doc_type;
        var hash_access = obj.facets.access;
        var hash_subject = obj.facets.subjectFacet;
        var hash_language = obj.facets.language;
        var hash_publication_year = obj.facets.year;
        var hash_format = obj.facets.format;
        var hash_type = obj.facets.doc_type;


        if(facet_class == 'facet-imprint') {
            total = totalFacetCount(hash_publisher);
            selected = obj.query.publisher;
            if (typeof selected === 'string') selected = [selected];
                html += createFacetCountRow('Imprint', total, 'publisher', false, 'Imprint', false, selected == undefined);
            for (var key in hash_publisher) {
                if (hash_publisher.hasOwnProperty(key)) {
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_publisher[key], 'publisher', selectedIndex !== -1, label, selected == undefined);
                }
            }
        }

        if(facet_class == 'facet-coverage') {
            total = totalFacetCount(hash_coverage)
            selected = obj.query.coverage;
            if (typeof selected === 'string') selected = [selected];
            html += createFacetCountRow('Coverage', total, 'coverage', false, 'Coverage', false, selected == undefined)
            for (var key in hash_coverage) {
                if (hash_coverage.hasOwnProperty(key)) {
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_coverage[key], 'coverage', selectedIndex !== -1, label, selected == undefined);
                }
            }
        }

        if(facet_class == 'facet-genre') {
            total = totalFacetCount(hash_genre)
            selected = obj.query.g;
            if (typeof selected === 'string') selected = [selected];
            html += createFacetCountRow('Genre', total, 'g', false, 'Genre', false, selected == undefined)
            for (var key in hash_genre) {
                if (hash_genre.hasOwnProperty(key)) {
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_genre[key], 'g', selectedIndex !== -1, label, selected == undefined);
                }
            }

            // for (var key in hash_discipline) {
            //     if (hash_discipline.hasOwnProperty(key)) {
            //         selected = obj.query.discipline;
            //         if (typeof selected === 'string') selected = [selected];
            //         var selectedIndex = $.inArray(key, selected);
            //         var label = key;
            //         if (labels) label = labels[key];
            //         html += createFacetRow(key, hash_discipline[key], 'discipline', selectedIndex !== -1, label);
            //     }
            // }

            // for (var key in hash_access) {
            //     if (hash_access.hasOwnProperty(key)) {
            //         selected = obj.query.o;
            //         labels = window.collex.facetNames.access;
            //         if (typeof selected === 'string') selected = [selected];
            //         var selectedIndex = $.inArray(key, selected);
            //         var label = key;
            //         if (labels) label = labels[key];
            //         html += createFacetRow(key, hash_access[key], 'o', selectedIndex !== -1, label);
            //     }
            // }
        }

        if(facet_class == 'facet-subject') {
            total = totalFacetCount(hash_subject)
            selected = obj.query.subject;
            if (typeof selected === 'string') selected = [selected];
            html += createFacetCountRow('Subject', total, 'subject', false, 'Subject', false, selected == undefined)
            for (var key in hash_subject) {
                if (hash_subject.hasOwnProperty(key)) {
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_subject[key], 'subject', selectedIndex !== -1, label, selected == undefined);
                }
            }
        }

        if(facet_class == 'facet-language') {
            total = totalFacetCount(hash_language)
            selected = obj.query.language;
            if (typeof selected === 'string') selected = [selected];
            html += createFacetCountRow('Language', total, 'language', false, 'Language', false, selected == undefined)
            for (var key in hash_language) {
                if (hash_language.hasOwnProperty(key)) {
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_language[key], 'language', selectedIndex !== -1, label, selected == undefined);
                }
            }
        }

        if(facet_class == 'facet-publication-year') {
            total = totalFacetCount(hash_publication_year)
            selected = obj.query.y;
            if (typeof selected === 'string') selected = [selected];
            html += createFacetCountRow('Publication Year', total, 'y', false, 'Publication Year', false, selected == undefined)
            for (var key in hash_publication_year) {
                if (hash_publication_year.hasOwnProperty(key)) {
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_publication_year[key], 'y', selectedIndex !== -1, label, selected == undefined);
                }
            }
        }

        if(facet_class == 'facet-format') {
            total = totalFacetCount(hash_format)
            selected = obj.query.record_format;
            if (typeof selected === 'string') selected = [selected];
            html += createFacetCountRow('Format', total, 'record_format', false, 'Format', false, selected == undefined)
            for (var key in hash_format) {
                if (hash_format.hasOwnProperty(key)) {
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_format[key], 'record_format', selectedIndex !== -1, label, selected == undefined);
                }
            }
        }

        if(facet_class == 'facet-type') {
            total = totalFacetCount(hash_format)
            selected = obj.query.doc_type;
            if (typeof selected === 'string') selected = [selected];
            html += createFacetCountRow('Type', total, 'doc_type', false, 'Type', false, selected == undefined)
            for (var key in hash_format) {
                if (hash_format.hasOwnProperty(key)) {
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_format[key], 'doc_type', selectedIndex !== -1, label, selected == undefined);
                }
            }
        }

    var block = $("."+facet_class);
    var header = window.pss.createHtmlTag("tr", {}, block.find("tr:first-of-type").html());
    block.html(header + html);
  }

  function createResourceNode(id, level, label, total, childClass) {
    var open = window.pss.createHtmlTag("button", { 'class': 'nav_link  limit_to_arrow', 'data-action': "open" },
      window.pss.createHtmlTag("img", { 'alt': 'Arrow Open', src: window.collex.images.arrow_open }));
    var close = window.pss.createHtmlTag("button", { 'class': 'nav_link  limit_to_arrow', 'data-action': "close" },
      window.pss.createHtmlTag("img", { 'alt': 'Arrow Close', src: window.collex.images.arrow_close }));
    var name = window.pss.createHtmlTag("button", { 'class': 'nav_link limit_to_category', 'data-action': "toggle" }, label);

    var left = window.pss.createHtmlTag("td", { 'class': 'resource-tree-node limit_to_lvl'+level, 'data-id': id }, open+close+name);
    var right = window.pss.createHtmlTag("td", { 'class': 'num_objects' }, window.collex.number_with_delimiter(total));
    var trClass = "resource_node " + childClass;
    return window.pss.createHtmlTag("tr", { id: 'resource_'+id, 'class': trClass }, left+right);
  }

  function createResourceLeaf(id, level, label, total, handle, childClass, isSelected) {
    var trClass = childClass;
    var left;
    if (isSelected) {
      trClass += ' limit_to_selected';
      left = window.pss.createHtmlTag("td", { 'class': 'limit_to_lvl'+level }, label + '&nbsp;&nbsp;' + window.collex.create_facet_button('[X]', handle, 'remove', 'a'));
    } else {
      left = window.pss.createHtmlTag("td", { 'class': 'limit_to_lvl'+level }, window.collex.create_facet_button(label, handle, 'replace', 'a'));
    }
    var right = window.pss.createHtmlTag("td", { 'class': 'num_objects' }, window.collex.number_with_delimiter(total));
    return window.pss.createHtmlTag("tr", { id: 'resource_'+id, 'class': trClass }, left+right);
  }

  function createResourceSection(resources, hash, level, childClass, handleOfSelected) {
    var html = "";
    var total = 0;
        if(resources === null) {
            resources = Array();
        }
    for (var i = 0; i < resources.length; i++) {
      var archive = resources[i];
      if (archive.children) {
        var section = createResourceSection(archive.children, hash, level + 1, 'child_of_'+archive.id, handleOfSelected);
        total += section.total;
        if (section.total > 0) {
          var thisNode = createResourceNode(archive.id, level, archive.name, window.collex.number_with_delimiter(section.total), childClass);
          html += thisNode + section.html;
        }
      } else {
        if (hash[archive.handle]) { // If there are no results, then we don't show that archive.
          html += createResourceLeaf(archive.id, level, archive.name, hash[archive.handle], archive.handle, childClass, archive.handle === handleOfSelected);
          total += parseInt(hash[archive.handle], 10);
        }
      }
    }
    return { html: html, total: total };
  }

  function cascadeHiding(parent, id) {
    var hiddenChildNodes = parent.find('.resource_node.child_of_'+id);
    for (var i = 0; i < hiddenChildNodes.length; i++) {
      var node = hiddenChildNodes[i];
      var nodeId = node.id.split("_")[1];
      parent.find(".child_of_"+nodeId).hide();
      cascadeHiding(parent, nodeId);
    }
  }

  window.collex.setResourceToggle = function(block, resources) {
        if(resources === null) {
            resources = Array();
        }
    for (var i = 0; i < resources.length; i++) {
      var archive = resources[i];
      if (archive.children) {
        if (archive.toggle === 'open') {
          block.find("#resource_" + archive.id + ' button[data-action="open"]').hide();
        } else {
          block.find("#resource_" + archive.id + ' button[data-action="close"]').hide();
          block.find('.child_of_'+archive.id).hide();
          // Also hide any grandchildren of nodes that would be open.
          cascadeHiding(block,archive.id);
        }
        window.collex.setResourceToggle(block, archive.children);
      }
    }
  };

  function createResourceBlock(hash, handleOfSelected) {
    var html = createResourceSection(window.collex.facetNames.archives, hash, 1, '', handleOfSelected).html;

    var block = $(".facet-archive");
    var header = window.pss.createHtmlTag("tr", {}, block.find("tr:first-of-type").html());
    block.html(header + html);
    // Now close the items that need to be closed.
    window.collex.setResourceToggle(block, window.collex.facetNames.archives);
  }

  window.collex.createFacets = function(obj) {
    createFacetBlock('facet-imprint', obj);
    createFacetBlock('facet-coverage', obj);
    createFacetBlock('facet-genre', obj);
    createFacetBlock('facet-subject', obj);
    createFacetBlock('facet-language', obj);
    createFacetBlock('facet-publication-year', obj);
    createFacetBlock('facet-format', obj);
    createFacetBlock('facet-type', obj);

    /*createFacetBlock('facet-genre', obj.facets.discipline, 'discipline', obj.query.discipline);
    createFacetBlock('facet-genre', obj.facets.doc_type, 'doc_type', obj.query.doc_type);
    createFacetBlock('facet-genre', obj.facets.access, 'o', obj.query.o, window.collex.facetNames.access);*/
    createRoleFacetBlock('facet-new-role', obj);
    createResourceBlock(obj.facets.archive, obj.query.a);
  };
});
