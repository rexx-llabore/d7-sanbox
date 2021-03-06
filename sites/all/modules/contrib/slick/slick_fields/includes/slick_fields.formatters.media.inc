<?php

/**
 * @file
 * Fields formatter for the Slick fields Media integration.
 */

/**
 * Format image/media file data.
 */
function _slick_fields_format_media(&$settings, $items, $field, $view_mode, $langcode) {
  $build = array();
  $media = '';
  $field_type = $field['type'];

  foreach ($items as $key => $item) {
    $tmp = $item;
    $item = array(
      'item' => $tmp,
      'slide' => array(),
      'caption' => array(),
    );

    $item_type = isset($item['item']['type']) ? $item['item']['type'] : $field_type;

    // Setup the variables for the image.
    $image_style     = $settings['image_style'];
    $fid             = $item['item']['fid'];
    $image['uri']    = $item['item']['uri'];
    $image['width']  = isset($item['item']['metadata']['width']) ? $item['item']['metadata']['width'] : NULL;
    $image['height'] = isset($item['item']['metadata']['height']) ? $item['item']['metadata']['height'] : NULL;
    $image['alt']    = $item['item']['alt'];
    $image['title']  = $item['item']['title'];

    $settings['has_media']      = TRUE;
    $settings['is_media']       = FALSE;
    $settings['media_height']   = $image['height'];
    $settings['media_width']    = $image['width'];

    $file = (object) $item['item'];
    $uri = $file->uri;

    // If a file has an invalid type, allow file_view_file() to work.
    if (!file_type_is_enabled($file->type)) {
      $file->type = file_get_type($file);
    }

    $media = file_view_file($file, $view_mode, $langcode);

    if ($media && isset($media['#uri'])) {
      $settings['is_media'] = TRUE;
      $settings['media_height']   = $media['#options']['height'] ?: 640;
      $settings['media_width']    = $media['#options']['width'] ?: 360;
      $settings['media_uri']      = $media['#uri'];
      $settings['media_fid']      = $file->fid;
      $settings['media_filename'] = $file->filename;
    }
    $scheme = file_uri_scheme($uri);
    $image_style = isset($media['#style_name']) ? $media['#style_name'] : $image_style;

    $settings['image_style'] = $image_style;
    $settings['scheme']      = $scheme;
    $settings['type']        = $item_type;

    // Get audio/video thumbnail uri.
    if ($media_image_uri = _slick_fields_get_media_thumbnail($settings, $uri, $image_style)) {
      $image['uri'] = $media_image_uri;
    }

    // Title, if so configured.
    if (!empty($settings['slide_title'])) {
      if ($field_title = field_get_items('file', $file, $settings['slide_title'], $langcode)) {
        $title = $field_title[0]['safe_value'];
        $item['caption']['title'] = $title;
      }
    }

    // Other caption fields, if so configured.
    if (!empty($settings['slide_caption'])) {
      $caption_items = array();
      foreach ($settings['slide_caption'] as $i => $caption_field) {
        $caption = field_view_field('file', $file, $caption_field, $view_mode, $langcode);
        if ($caption) {
          $caption_items[$i] = $caption;
        }
      }
      $item['caption']['data'] = $caption_items;
    }

    // Link, if so configured.
    if (!empty($settings['slide_link'])) {
      $link = field_view_field('file', $file, $settings['slide_link'], $view_mode, $langcode);
      $item['caption']['link'] = $link;
    }

    // Layout, if so configured.
    if (!empty($settings['slide_layout'])) {
      if ($field_layout = field_get_items('file', $file, $settings['slide_layout'], $langcode)) {
        $layout = $field_layout[0]['value'];
        $item['caption']['layout'] = check_plain($layout);
      }
    }

    $media_url = '';
    if ($settings['is_media']) {
      $rendered_media = render($media);
      $media_url = slick_get_media_url($rendered_media);
      $settings['url'] = $media_url;
    }

    // Image with picture supports.
    $image_slide = _slick_fields_get_picture($settings, $image, $key, $media_url);

    // Provide thumbnail pagers if so configured.
    if (!empty($settings['thumbnail_style'])) {
      $image['path'] = $image['uri'];
      $image['style_name'] = $settings['thumbnail_style'];

      $thumbnail = theme('image_style', $image);

      if ($settings['thumbnail_hover']) {
        $image_slide .= '<div class="slide__thumbnail slide__thumbnail--hover"><div class="slide__thumbnail__box">' . $thumbnail . '</div>';
        $image_slide .= '<button type="button">' . ($key + 1) . '</button></div>';
      }
      else {
        $image_slide .= '<div class="slide__thumbnail">' . $thumbnail . '</div>';
      }
    }

    // Pass it over theme_slick_media.
    $item['slide'] = array(
      '#theme' => 'slick_media',
      '#item' => $image_slide,
      '#settings' => $settings,
    );

    // If has Media fields.
    if ($settings['is_media']) {
      $item['slide']['#media'] = $media;
    }

    $item['settings'] = $settings;

    $build[$key] = $item;
  }

  return $build;
}
