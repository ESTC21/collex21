jQuery(document).ready(function($) {
	"use strict";

	var $j = jQuery.noConflict();
	var query = ""+window.location.search;
	if(query.search("action=annotate") > -1){
		$j("#nav_container").hide();
		$j(".my_collex_link").hide();
		$j("#subnav_container").hide();
	}

  $("#annotation_predicate").on("change", function() {
    var data_type = $(this).find(":selected").attr('data-type');

    var types = {
      'author': 'aut',
      'subject': 'subject',
      'coverage': 'coverage',
      'editor': 'ed',
      'publisher': 'pub',
      'artist': 'r_art',
      'owner': 'r_own',
      'repository': 'r_rps',
    }
    if (types[data_type])
      $(this).siblings('.add-autocomplete').attr('data-type', types[data_type]);
    else
      $(this).siblings('.add-autocomplete').attr('data-type', '');
  });
});

jQuery(document).on("click", "#closebtn", function() {
    var returnURL = sessionStorage.getItem('returnURI');
    if(returnURL == '' || returnURL == null){
        returnURL = '/';
    }
    window.location = returnURL;
});
