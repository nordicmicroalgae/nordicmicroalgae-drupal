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
 * Act on a taxon being loaded from database.
 *
 * The module may add additional information to the taxon object.
 *
 * @see taxon_external_link_taxon_load()
 * @see taxon_facts_taxon_load()
 * @see taxon_media_taxon_load()
 * @see taxon_navigation_taxon_load()
 * @see taxon_synonym_taxon_load()
 *
 * @param $taxon
 *   The taxon that is being loaded.
 */
 function hook_taxon_load($taxon) {
   if (!isset($taxon->additional_information)) {
     $taxon->additional_information = $additional_information;
   }
 }

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
