<?php
// $Id$

/**
 * @file
 * Page callbacks and forms for editing taxon facts.
 */


/**
 * Menu callback; presents the taxon facts editing form.
 * 
 * @param $taxon
 *   The taxon object to edit facts for.
 */
function taxon_facts_page_edit($taxon) {
  drupal_set_title(t('<em>@name</em>: Edit facts', array('@name' => $taxon->name)), PASS_THROUGH);
  return drupal_get_form('taxon_facts_form', $taxon);
}

/**
 * Form builder; Displays the form for editing taxon facts.
 * 
 * @param $form
 * @param $form_state
 * @param $taxon
 *   The taxon object to edit facts for.
 */
function taxon_facts_form($form, &$form_state, $taxon) {
  
  // Set id attribute to identify this as an taxon facts edit form.
  $form['#id'] = 'taxon-facts-form';
  
  // Store the taxon for later use.
  $form['#taxon'] = $taxon;
  $form_state['taxon'] = $taxon;
  
  // Add facts fields to the form.
  $settings = taxon_get_settings('Facts');
  $field_list = $settings['Field list'];
  
  $edit_formats = taxon_get_settings('Facts edit formats');
  $form += taxon_form_generate_fields($field_list, $edit_formats, $taxon->facts);
  
  // Add buttons.
  $form['buttons']['#weight'] = 100;
  $form['buttons']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
    '#weight' => 5,
    '#submit' => array('taxon_facts_form_submit'),
  );
  
  return $form;
}

/**
 * Button submit function: handle the 'Save' button on the taxon facts form.
 */
function taxon_facts_form_submit($form, &$form_state) {
  $taxon = &$form_state['taxon'];
  
  $settings = taxon_get_settings('Facts');
  $field_list = $settings['Field list'];
  
  $edit = taxon_form_get_data($field_list, $form, $form_state);
  
  // Save facts and notify the user.
  $taxon_id = taxon_name_to_id($taxon->name);
  if (taxon_facts_save($taxon_id, $edit)) {
    drupal_set_message(t('Facts saved.'));
    $form_state['redirect'] = taxon_path($taxon->name);
  } else {
    drupal_set_message(t('Facts could not be saved.'), 'error');
    $form_state['rebuild'] = TRUE;
  }
  
}
