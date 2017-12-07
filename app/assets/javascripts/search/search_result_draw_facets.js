jQuery(document).ready(function($) {
	"use strict";

	window.collex.create_facet_button = function(label, value, action, key) {
		return window.pss.createHtmlTag("button",
            { 'class': 'select-facet nav_link', 'data-action': action, 'data-key': key, 'data-value': value }, label);
	};

	window.collex.number_with_delimiter = function(number) {
		var delimiter = ',';
		var separator = '.';
		var parts = (""+number).split('.');
		parts[0] = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter);
		return parts.join(separator);
	};

	function createFacetRow(name, count, dataKey, isSelected, label) {
		if (!label) label = name;
		if (isSelected) {
			var remove = window.collex.create_facet_button('[X]', name, "remove", dataKey);
			return window.pss.createHtmlTag("tr", { 'class': "limit_to_selected" },
				window.pss.createHtmlTag("td", { 'class': "limit_to_lvl1" }, label + "&nbsp;&nbsp;" + remove) +
				window.pss.createHtmlTag("td", { 'class': "num_objects" }, window.collex.number_with_delimiter(count)));
		} else {
			var button = window.collex.create_facet_button(label, name, "add", dataKey);
			return window.pss.createHtmlTag("tr", {},
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

    function createRoleFacetBlock(facet_class, obj) {
        var html = "";
        var selected = "";
        var labels = "";

        var hash_role = obj.facets.role;
        var consolidated_role_params = [];

        for(var role in obj.facets.role) {
            var values = _.pluck(obj.hits, role).flatten();
            values = _.reject(values, function(val){ return val == undefined });

            if(values.length > 0) {
                consolidated_role_params[role] = _.uniq(values);
            }
        }

        console.log("roles arr: ");
        console.log(consolidated_role_params);

        var idx = 0;
        for (var key in consolidated_role_params) {
            if (consolidated_role_params.hasOwnProperty(key)) {
                selected = obj.query.aut;
                if (typeof selected === 'string') selected = [ selected ];
                var selectedIndex = $.inArray(key, selected);
                var label = key;
                if (labels) label = labels[key];

                var data_key = 'aut';
                if(key == 'role_OWN'){
                    data_key = 'r_own'
                }
                else if(key == 'role_RPS'){
                    data_key = 'role_RPS'
                }

                html += createRoleFacetRow(key, consolidated_role_params[key].length, data_key, selectedIndex !== -1, label, false, idx);
                _.map(consolidated_role_params[key], function(role_desc){ return html += createRoleFacetRow(key, role_desc, data_key, selectedIndex !== -1, label, true, idx); });
            }
            idx++;
        }

        var block = $("."+facet_class);
        var header = window.pss.createHtmlTag("tr", {}, block.find("tr:first-of-type").html());
        block.html(header + html);
    }

    function createRoleFacetRow(name, count, dataKey, isSelected, label, isSubmenu, index) {
        if (!label) label = name;
        if (isSelected) {
            var remove = window.collex.create_facet_button('[X]', name, "remove", dataKey);
            return window.pss.createHtmlTag("tr", { 'class': "limit_to_selected" },
                window.pss.createHtmlTag("td", { 'class': "limit_to_lvl1" }, label + "&nbsp;&nbsp;" + remove) +
                window.pss.createHtmlTag("td", { 'class': "num_objects" }, window.collex.number_with_delimiter(count)));
        } else {
            if(isSubmenu){
                var display = (index == 0 ? '' : 'no-display');
                var button = window.collex.create_facet_button(count, count, "add", dataKey);
                return window.pss.createHtmlTag("tr", {'class': ''+ name + ' ' + display},
                    window.pss.createHtmlTag("td", {'class': ""}, button) +
                    window.pss.createHtmlTag("td", {'class': ""}, ""));
            }
            else {
                var arrow = (index == 0 ? 'hidden' : '');
                var down = (index == 0 ? '' : 'hidden');
                var menu_style = (index == 0 ? 'expanded' : 'collapsed');

                var button = window.collex.create_facet_button(label, name, "add", dataKey);
                var arrow_html = '<span class="exp-arrow "' + arrow + '><img alt="Arrow" src="/assets/arrow.gif">' +
                                 '</span><span class="col-arrow"' + down + '><img alt="Arrow_dn" src="/assets/arrow_dn.gif"></span>';

                return window.pss.createHtmlTag("tr", {'class': 'category-btn ' + menu_style, 'data-key': dataKey},
                    window.pss.createHtmlTag("td", {'class': "limit_to_lvl0"}, arrow_html + '<span class="nav_link">' + name + '</span>') +
                    window.pss.createHtmlTag("td", {'class': "num_objects"}, window.collex.number_with_delimiter(count)));
            }
        }
    }

	function createFacetBlock(facet_class, obj) {

		var html = "";
		
		var selected = "";
		var labels = "";

		var hash_genre = obj.facets.genre;
		var hash_coverage = obj.facets.coverage;
		var hash_discipline = obj.facets.discipline;
		var hash_format = obj.facets.doc_type;
		var hash_access = obj.facets.access;


		if(facet_class == 'facet-coverage') {
            for (var key in hash_coverage) {
                if (hash_coverage.hasOwnProperty(key)) {
                    selected = obj.query.coverage;
                    if (typeof selected === 'string') selected = [selected];
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_coverage[key], 'coverage', selectedIndex !== -1, label);
                }
            }
        }

        if(facet_class == 'facet-genre') {
            for (var key in hash_genre) {
                if (hash_genre.hasOwnProperty(key)) {
                    selected = obj.query.g;
                    if (typeof selected === 'string') selected = [selected];
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_genre[key], 'g', selectedIndex !== -1, label);
                }
            }

            for (var key in hash_discipline) {
                if (hash_discipline.hasOwnProperty(key)) {
                    selected = obj.query.discipline;
                    if (typeof selected === 'string') selected = [selected];
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_discipline[key], 'discipline', selectedIndex !== -1, label);
                }
            }

            for (var key in hash_format) {
                if (hash_format.hasOwnProperty(key)) {
                    selected = obj.query.doc_type;
                    if (typeof selected === 'string') selected = [selected];
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_format[key], 'doc_type', selectedIndex !== -1, label);
                }
            }

            for (var key in hash_access) {
                if (hash_access.hasOwnProperty(key)) {
                    selected = obj.query.o;
                    labels = window.collex.facetNames.access;
                    if (typeof selected === 'string') selected = [selected];
                    var selectedIndex = $.inArray(key, selected);
                    var label = key;
                    if (labels) label = labels[key];
                    html += createFacetRow(key, hash_access[key], 'o', selectedIndex !== -1, label);
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
		createFacetBlock('facet-coverage', obj);
		createFacetBlock('facet-genre', obj);
		/*createFacetBlock('facet-genre', obj.facets.discipline, 'discipline', obj.query.discipline);
		createFacetBlock('facet-genre', obj.facets.doc_type, 'doc_type', obj.query.doc_type);
		createFacetBlock('facet-genre', obj.facets.access, 'o', obj.query.o, window.collex.facetNames.access);*/
        createRoleFacetBlock('facet-new-role', obj);
		createResourceBlock(obj.facets.archive, obj.query.a);
	};
});
