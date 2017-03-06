<?php

/**
 * @file
 * Hooks provided by the Taxon module.
 */

/**
 * @addtogroup hooks
 * @{
 */

/**
 * Act on a taxon before rendering.
 * 
 * The module may add elements to $taxon->content prior to rendering. The structure
 * of $taxon->content is a renderable array as expected by drupal_render().
 * 
 * @see taxon_facts_taxon_view()
 * @see taxon_media_taxon_view()
 * 
 * @param $taxon
 *   The taxon that is being assembled for rendering.
 */
function hook_taxon_view($taxon) {
  $taxon->content['additional_description'] = array(
    '#markup' => $additional_description,
    '#weight' => 10,
    '#theme' => 'mymodule_my_additional_description',
  );
}

/**
 * @} End of "addtogroup hooks".
 */