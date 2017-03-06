<?php

/**
 * @file
 * Hooks provided by the taxon_facts module.
 */

/**
 * @addtogroup hooks
 * @{
 */

/**
 * Taxon facts was updated.
 * 
 * Modules may use this hook to update their data after facts has been updated.
 * 
 * @param $update
 *   Array of data after update.
 * @param $original
 *   Array of data before update.
 * @param $taxon_id
 *   The taxon id for facts being updated.
 * 
 * @see change_history_taxon_facts_update()
 */
function hook_taxon_facts_update($update, $original, $taxon_id) {
  db_insert('taxon_facts_changes')
    ->fields(array(
      'taxon_id' => $taxon_id,
      'changed' => time(),
    ))
    ->execute();
}

/**
* @} End of "addtogroup hooks".
*/