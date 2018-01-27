jQuery(document).on("click", ".user_role_checkbox", function() {
  if (jQuery(this).siblings('label').text() == 'Institutional User')
  {
    if (jQuery(this).is(':checked')) {
      jQuery("#institutional_code").removeClass('hide');
      jQuery("#institutional_code").addClass('show');
    }
    else {
      jQuery("#institutional_code").removeClass('show');
      jQuery("#institutional_code").addClass('hide');
    }
  }
});

jQuery(document).ready(function($) {
  if (jQuery(".user_role_institutional-user").is(':checked')) {
    jQuery("#institutional_code").removeClass('hide');
    jQuery("#institutional_code").addClass('show');
  }
});
