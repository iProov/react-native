export class Options  {

  ui = {
    filter: null,
    line_color: null,
    background_color: null,
    header_background_color: null,
    footer_background_color: null,
    header_text_color: null,
    footer_text_color: null,
    prompt_text_color: null,
    primary_tint_color: null,
    secondary_tint_color: null,
    title: null,
    font_path: null,
    // TODO double check
    logo_image: null,
    floating_prompt_enabled: null,
    enable_screenshots: null,
    orientation: null,
    activity_compatibility_request_code: null,

    genuine_presence_assurance: {
      not_ready_tint_color: null,
      ready_tint_color: null,
      progress_bar_color: null,
      auto_start_disabled: null
    },

    liveness_assurance: {
      liveness_tint_color: null,
      liveness_scanning_color: null
    }
  }

  capture = {
    camera: null,
    face_detector: null,

    genuine_presence_assurance: {
      max_yaw: null,
      max_roll: null,
      max_pitch: null
    }
  }

  network = {
    path: null,
    timeout: null,
    certificates: null
  }

  sanitize() {
    // TODO for assurance type specific options this will put a null object rather than null
    this.ui = removeNulls(this.ui)
    this.capture = removeNulls(this.capture)
    this.network = removeNulls(this.network)
    return this
  }

}

function removeNulls(object) {
  let replacer = (key, value) => {
    console.log('key: ' + key);
    if (typeof object === 'object') {

    }

    return (value == null) ? undefined : value
  }
  return JSON.parse(JSON.stringify(object, replacer));
}

// Adapted from https://stackoverflow.com/a/38340730
// Why is this so hard in JS!?!?
// Removes nested null from nested objects
function removeNulls2(object) {
  // convert entried to list
  return Object.entries(object)
  // filter entries with null values
  .filter(([key, value]) => value != null || value != undefined)
  .reduce((obj, [key, value]) => ({ ...obj, [key]: (typeof value == 'object') ? removeNulls2(value) : value }), {  })

}
