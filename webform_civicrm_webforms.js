(function ($) {

function webform_civicrm_parse_name(name) {
  var pos = name.lastIndexOf('[civicrm_');
  return name.slice(1+pos, -1);
}

function webform_civicrm_populate_states(stateSelect, countryId) {
  var value = $(stateSelect).val();
  $(stateSelect).attr('disabled', 'disabled');
  $.ajax({
    url: '/webform-civicrm/js/state_province/'+countryId,
    dataType: 'json',
    success: function(data) {
      $(stateSelect).find('option').remove();
      for (key in data) {
        $(stateSelect).append('<option value="'+key+'">'+data[key]+'</option>');
      }
      $(stateSelect).val(value);
      $(stateSelect).removeAttr('disabled');
    }
  });
}

$(document).ready(function(){
  $('form.webform-client-form').find('input[name*="_address_state_province_id"][name*="civicrm_"]').each(function(){
    var id = $(this).attr('id');
    var name = $(this).attr('name');
    var key = webform_civicrm_parse_name(name);
    var value = $(this).val();
    var countrySelect = $(this).parents('form.webform-client-form').find('[name*="'+(key.replace('state_province','country' ))+'"]');
    var classes = $(this).attr('class').replace('text', 'select');
    $(this).replaceWith('<select id="'+id+'" name="'+name+'" class="'+classes+'"><option selected="selected" value="'+value+'"> </option></select>');
    var countryVal = 'default';
    if (countrySelect.length === 1) {
      countryVal = $(countrySelect).val();
    }
    else if (countrySelect.length > 1) {
      countryVal = $(countrySelect).filter(':checked').val();
    }
    if (!countryVal) {
      countryVal = '';
    }
    webform_civicrm_populate_states($('#'+id), countryVal);
  });

  $('form.webform-client-form [name*="_address_country_id"][name*="civicrm_"]').change(function(){
    var name = webform_civicrm_parse_name($(this).attr('name'));
    var countryId = $(this).val();
    var stateSelect = $(this).parents('form.webform-client-form').find('select[name*="'+(name.replace('country', 'state_province'))+'"]');
    $(stateSelect).val('');
    webform_civicrm_populate_states(stateSelect, countryId);
  });
});

})(jQuery);