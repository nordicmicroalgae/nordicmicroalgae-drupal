<?php
// $Id$

/**
 * @file
 * Page callbacks and forms for uploading and editing taxon media.
 */

/**
 * Form builder; Asks for confirmation of taxon media deletion.
 */
function taxon_media_delete_confirm($form, &$form_state, $media) {
  $form['media_id'] = array('#type' => 'value', '#value' => $media->media_id);
  return confirm_form($form,
    t('Are you sure you want to delete %title?', array('%title' => $media->media_id)),
    'taxon_media/' . $media->media_id,
    t('This action cannot be undone.'),
    t('Delete'),
    t('Cancel')
  );
}

/**
 * Executes taxon media deletion.
 */
function taxon_media_delete_confirm_submit($form, &$form_state) {
  $media_id = $form_state['values']['media_id'];
  
  if ($form_state['values']['confirm']) {
    taxon_media_delete($media_id);
    drupal_set_message(t('Media: @media_id deleted.', array('@media_id' => $media_id)));
  }
  $taxon_name = taxon_media_id_to_taxon_name($media_id);
  $form_state['redirect'] = taxon_path($taxon_name) . '/media/manage';
}


/**
 * Menu callback; presents the taxon media management page.
 * 
 * @param $taxon
 *   The taxon object to manage media for.
 */
function taxon_media_page_manage($taxon) {
  drupal_set_title(t('<em>@name</em>: Manage media', array('@name' => $taxon->name)), PASS_THROUGH);
  $build = array();
  
  // Add forms for adding media, if the user has the right privileges.
  if (user_access('upload taxon media')) {
    $build['upload_form'] = drupal_get_form('taxon_media_upload_form', $taxon);
    $build['video_link_form'] = drupal_get_form('taxon_media_video_link_form', $taxon);
  }
  
  // Add a list for managing media.
  if (count($taxon->media) > 0) {
    $build['media_manage'] = array(
      '#theme' => 'taxon_media_manage',
      '#media' => $taxon->media,
    );
    
    // Add a form for updating the media list, if the user has the right privileges.
    if (user_access('update taxon media lists')) {
      $build['list_form'] = drupal_get_form('taxon_media_list_form', $taxon);
      drupal_add_library('system', 'ui.sortable');
      drupal_add_js(drupal_get_path('module', 'taxon_media') . '/js/sort.js');
    }
  }
  
  return $build;
}

/**
 * Form builder; Displays the form for managing media lists.
 * 
 * @param $form
 * @param $form_state
 * @param $taxon
 *   The taxon object to handle media list for.
 */
function taxon_media_list_form($form, &$form_state, $taxon) {
  $form['#id'] = 'taxon-media-list-form';
  
  $form['#taxon'] = $taxon;
  $form_state['taxon'] = $taxon;
  
  $taxon_id = taxon_name_to_id($taxon->name);
  $media_list = taxon_media_list_get_by_taxon_id($taxon_id);
  
  $form['media_list'] = array(
    '#title' => t('Media list'),
    '#type' => 'hidden',
    '#weight' => 5,
    '#default_value' => implode(';', $media_list),
  );
  
  $form['buttons']['#weight'] = 100;
  $form['buttons']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save order'),
    '#weight' => 5,
    '#submit' => array('taxon_media_list_form_submit'),
  );
  
  return $form;
}

/**
 * Button submit function: handle the 'Save order' button on taxon media list form.
 * @todo Use submitted list to sort and update existing list instead of overwriting.
 */
function taxon_media_list_form_submit(&$form, &$form_state) {
  $taxon = $form['#taxon'];
  $taxon_id = taxon_name_to_id($taxon->name);
  
  $media_list = explode(';', $form_state['values']['media_list']);
  taxon_media_list_save($taxon_id, $media_list);
  drupal_set_message(t('Updated media list.'));
  $form_state['redirect'] = taxon_path($taxon->name) . '/media/manage';
}

/**
 * Form builder; Displays the form for uploading taxon media.
 * 
 * @param $form
 * @param $form_state
 * @param $taxon
 *   The taxon object to upload media for.
 */
function taxon_media_upload_form($form, &$form_state, $taxon) {
  
  // Set id attribute to identify this as an taxon media upload form.
  $form['#id'] = 'taxon-media-upload-form';
  
  $form['#attributes'] = array('enctype' => "multipart/form-data");
  
  // Store the taxon for later use.
  $form['#taxon'] = $taxon;
  $form_state['taxon'] = $taxon;
  
  // Add fieldset and legend.
  $form['media_upload'] = array(
    '#type' => 'fieldset',
    '#title' => t('Upload media from your computer'),
    '#weight' => 5,
  );
  
  // Add file upload control.
  $form['media_upload']['media_file'] = array(
    '#title' => t('Attach media file'),
    '#type' => 'file',
    '#weight' => 5,
    '#required' => FALSE, // note: required is NOT supported on file controls.
    '#description' => t('Allowed formats are JPEG, PNG and GIF.')
  );
  
  // Add buttons.
  $form['media_upload']['buttons']['#weight'] = 100;
  $form['media_upload']['buttons']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Upload'),
    '#weight' => 5,
    '#submit' => array('taxon_media_upload_form_submit'),
  );
  
  // Validation for uploaded file
  $form['#validate'][] = 'taxon_media_validate_file';
  
  return $form;
}

/**
 * Validates an image uploaded by a user.
 * 
 * @see taxon_media_upload_form()
 */
function taxon_media_validate_file(&$form, &$form_state) {
  $validators = array(
    'file_validate_is_image' => array(),
    'file_validate_extensions' => array('jpg jpeg gif png'),
  );
  
  // Save the file as a temporary file.
  $file = file_save_upload('media_file', $validators);
  if ($file === FALSE) {
    form_set_error('media_file', t('Failed to upload media file.'));
  }
  elseif ($file === NULL) {
    form_set_error('media_file', t('Please choose a file to upload.'));
  }
  else {
    $form_state['values']['media_file'] = $file;
  }
}

/**
 * Button submit function: handle the 'Upload' button on taxon media upload form.
 */
function taxon_media_upload_form_submit(&$form, &$form_state) {
  $taxon = &$form_state['taxon'];
  $file = &$form_state['values']['media_file'];
  $taxon_id = taxon_name_to_id($taxon->name);
  
  $media = taxon_media_save_upload($taxon_id, $file);
  
  if($media) {
    drupal_set_message(t('Uploaded file saved successfully.'));
    $form_state['redirect'] = 'taxon_media/' . $media->media_id . '/edit';
  }
  else {
    drupal_set_message(t('Error saving media.'), 'error');
  }  
}

/**
 * Form builder; Displays the form for adding links to external video.
 * 
 * @param $form
 * @param $form_state
 * @param $taxon
 *   The taxon object to add video link for.
 */
function taxon_media_video_link_form($form, &$form_state, $taxon) {
  $form['#id'] = 'taxon-media-link-form';

  // Store the taxon for later use.
  $form['#taxon'] = $taxon;
  $form_state['taxon'] = $taxon;
  
  // Add fieldset and legend.
  $form['video_link'] = array(
    '#type' => 'fieldset',
    '#title' => t('Insert link to video at YouTube'),
    '#weight' => 5,
  );

  // Add YouTube Video ID field.
  $form['video_link']['video_id'] = array(
    '#title' => t('YouTube Video ID'),
    '#type' => 'textfield',
    '#weight' => 5,
    '#required' => TRUE,
    '#description' => t('Enter a YouTube Video ID. e.g. <strong>eEz1p-YZpVI</strong> (11 characters).')
  );
  
  // Add buttons.
  $form['video_link']['buttons']['#weight'] = 100;
  $form['video_link']['buttons']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Insert'),
    '#weight' => 5,
    '#submit' => array('taxon_media_video_link_form_submit'),
  );
  
  return $form;
}

/**
 * Validation handler for the video link form.
 */
function taxon_media_video_link_form_validate($form, &$form_state) {
  $video_id = $form_state['values']['video_id'];
  if ($video_id) {
    // Request YouTube Data API to check if video entry exists.
    $api_url = 'http://gdata.youtube.com/feeds/api/videos/' . $video_id;
    $result = drupal_http_request($api_url, array('method' => 'HEAD'));
    if ($result->code != 200) {
      form_set_error('video_id', t('Invalid YouTube video id.'));
    }
  }
  else {
    form_set_error('video_id', t('You must enter a YouTube video id.'));
  }
}

/**
 * Button submit function: handle the 'Insert' button on video link form.
 */
function taxon_media_video_link_form_submit(&$form, &$form_state) {
  $taxon = &$form_state['taxon'];
  $video_id = $form_state['values']['video_id'];
  $taxon_id = taxon_name_to_id($taxon->name);
  
  $media = taxon_media_save_video_link($taxon_id, $video_id);
  
  if($media) {
    drupal_set_message(t('Added video link successfully.'));
    $form_state['redirect'] = 'taxon_media/' . $media->media_id . '/edit';
  }
  else {
    drupal_set_message(t('Error saving media.'), 'error');
  }  
}

/**
 * Menu callback; presents the media metadata editing form
 * 
 * @param $media
 *   The media object to edit metadata for.
 */
function taxon_media_page_edit($media) {
  drupal_set_title(t('@media_id: Edit metadata', array('@media_id' => $media->media_id)), PASS_THROUGH);
  return drupal_get_form('taxon_media_form', $media);
}

/**
 * Form builder; Display the form for editing media metadata.
 * 
 * @param $form
 * @param $form_state
 * @param $media
 *   The media object to edit metadata for.
 */
function taxon_media_form($form, &$form_state, $media) {
  
  // Set id attribute to identify this as an taxon media edit form.
  $form['#id'] = 'taxon-media-form';
  
  // Store the media for later use.
  $form['#media'] = $media;
  $form_state['media'] = $media;
 
  $settings = taxon_get_settings('Media');
  $field_list = $settings['Field list'];
  
  $edit_formats = taxon_get_settings('Media edit formats');
  
  $form += taxon_form_generate_fields($field_list, $edit_formats, $media->metadata);
  
  // Add note about mandatory fields.
  $form['mandatory_note']['#weight'] = -5;
  $form['mandatory_note']['#markup'] = '<p><strong>Note: ' . t('Fields marked with an asterisk are mandatory.') . '</strong></p>';

  // Add buttons.
  $form['buttons']['#weight'] = 100;
  $form['buttons']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
    '#weight' => 5,
    '#submit' => array('taxon_media_form_submit'),
  );
  
  $form['#attached']['js'][] = drupal_get_path('module', 'taxon_media') . '/js/formstate.js';
  
  return $form;
}

/**
 * Button submit function: handle the 'Save' button on the taxon media form.
 */
function taxon_media_form_submit($form, &$form_state) {
  $media = &$form_state['media'];
  
  $settings = taxon_get_settings('Media');
  $field_list = $settings['Field list'];
  
  $edit = taxon_form_get_data($field_list, $form, $form_state);
  
  // Update media and notify the user.
  taxon_media_save_metadata($media->media_id, $edit);
  drupal_set_message(t('Metadata saved.'));
  
  $taxon_name = taxon_media_id_to_taxon_name($media->media_id);
  $form_state['redirect'] = taxon_path($taxon_name);
}

/**
 * Menu callback; Displays a listing of top photographers.
 */
function taxon_media_page_hall_of_fame() {
  $rows = taxon_db_query("SELECT value FROM {taxa_media_filter_search} WHERE filter = 'Hall of fame'");
  
  $user_list = array();
  foreach ($rows as $row) {
    list($name, $total) = explode(':', $row->value);
    $user_list[] = array('name' => trim($name), 'total' => trim($total));
  }
  
  // Sort the list by total descendingly.
  usort($user_list, function($a, $b) {
    if ($a['total'] < $b['total']) return 1;
    if ($a['total'] > $b['total']) return -1;
    return 0;
  });
  
  // Build a list of items for theme_item_list().
  $items = array();
  foreach ($user_list as $user) {
    // Link to photographer/artist page.
    $link = l($user['name'], 'taxon_media/photographer/' . $user['name']);
    $items[] = sprintf('<strong>%s</strong> (%d)', $link, $user['total']);
  }
  
  $output = '<p>' . t('The content of Nordic Microalgae is the result of many years of work by several microalgae specialists. The number of photographs per person are listed below. The list is updated at around midnight every day.') . '</p>';
  $output .= theme('item_list', array('items' => $items));
  return $output;
}

/**
 * Menu callback; Displays media produced by specified photographer/artist name.
 */
function taxon_media_page_photographer($name) {
  $media = taxon_media_get_by_filter('Artist', $name, TRUE, 100);
  
  // Return a Not Found page if no media were found by requested photographer/artist.
  if (empty($media)) {
    return MENU_NOT_FOUND;
  }
  
  drupal_set_title(t('Photos by @name', array('@name' => $name)), PASS_THROUGH);
  
  $build['media'] = array(
    '#theme' => 'taxon_mediaset',
    '#media' => $media,
  );
  $build['pager'] = array(
    '#theme' => 'pager',
  );
  
  return $build;
}