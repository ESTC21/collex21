jQuery(document).ready(function($) {
	"use strict";
	var body = $("body");

	function restoreLine(parent, type, value) {
		var line = window.pss.createHtmlTag("a", {'class': "modify_link query-editable", href: '#', 'data-original': value, 'data-type': type }, value);
		parent.html(line);
	}

	body.on("blur", ".query-editing", function() {
		var el = $(this);
		var type = el.attr("data-type");
		var original = el.attr("data-original");
		var value = el.val();
		var processing = el.attr("data-processing");
		if (!processing && original !== value)
			body.trigger('ModifySearch', { key: type, original: original, newValue: value });
		var parent = el.closest('td');
		restoreLine(parent, type, value);
	});

	body.on("keydown", ".query-editing", function(e) {
		var key = e.which;
		if (key === 13 || key === 10 || key === 27)
			return false;

	});

	body.on("keyup", ".query-editing", function(e) {
		var el = $(this);
		var parent = el.closest('td');
		var key = e.which;
		var original = el.attr("data-original");
		var value = el.val();
		var type = el.attr("data-type");
		if (key === 13 || key === 10) {
			el.attr("data-processing", 'true');
			body.trigger('ModifySearch', { key: type, original: original, newValue: value });
			return false;
		} else if (key === 27) {
			el.attr("data-processing", 'true');
			restoreLine(parent, type, original);
			return false;
		}
	});

	body.on("click", ".query-editable", function() {
		var el = $(this);
		var parent = el.closest('td');
		var type = el.attr("data-type");
		var value = el.text();

		if(jQuery.inArray(type, ['q', 'aut', 'ed', 'pub', 'coverage', 'g', 'lang', 'doc_type', 'r_own', 'r_rps', 'record_format', 'subject'])) {
      parent.html(window.pss.createHtmlTag("input", { 'class': "add-autocomplete regular-input query-editing", type: 'text', placeholder: "click here to add new search term", 'data-autocomplete-url': "/search/auto_complete_for_q", 'data-autocomplete-field': ".query_type_select", 'data-type': type, autocomplete: 'off', 'data-original': value, 'value': value }) + window.pss.createHtmlTag("div", {'class': "auto_complete", id: "search_phrase_auto_complete", style: "display: none;" }, ''));
      window.collex.initAutoComplete(parent.find(".query-editing"));
    }
    else
      parent.html("<input type='text' data-original='" + value + "' data-type='" + type + "' value='" + value + "' class='query-editing' />");

		parent.find(".query-editing").focus();
		return false;
	});
});
