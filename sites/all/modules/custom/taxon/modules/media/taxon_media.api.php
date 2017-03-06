<?php

/**
 * @file
 * Hooks provided by the taxon_media module.
 */

/**
 * @addtogroup hooks
 * @{
 */

/**
 * Taxon media was created.
 * 
 * Modules may use this hook to update their data when new taxon media is being created.
 * 
 * @param $media
 *   The media object that is being created.
 * 
 * @see change_history_taxon_media_insert()
 */
function hook_taxon_media_insert($media) {
  db_insert('taxon_media_changes')
    ->fields(array(
      'media_id' => $media->media_id,
      'message' => 'Created media',
      'created' => time(),
    ))
    ->execute();
}

/**
 * Taxon media metadata was updated.
 * 
 * Modules may use this hook to update their data when media metadata is being updated.
 * 
 * @param $update
 *   Array of data after update.
 * @param $original
 *   Array of data before update.
 * @param $media_id
 *   The media_id for media being updated.
 * 
 * @see change_history_taxon_media_metadata_update()
 */
function hook_taxon_media_metadata_update($update, $original, $media_id) {
  db_update('taxon_media_changes')
    ->fields(array(
      'message' => 'Updated media metadata',
      'changed' => time(),
    ))
    ->condition('media_id', $media_id)
    ->execute();
}

/**
 * Taxon media was deleted.
 * 
 * Modules may use this hook to update their data when media is being deleted.
 * 
 * @param $media
 *   The media object that is being deleted.
 * 
 * @see change_history_taxon_media_delete()
 */
function hook_taxon_media_delete($media) {
  db_delete('taxon_media_changes')
    ->condition('media_id', $media->media_id)
    ->execute();
}

/**
* @} End of "addtogroup hooks".
*/