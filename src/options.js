export class Options {
  // options.ui.orientation
  static get PORTRAIT() {
    return 'portrait'
  }
  static get LANDSCAPE() {
    return 'landscape'
  }
  static get REVERSE_LANDSCAPE() {
    return 'reverse_landscape'
  }
  static get REVERSE_PORTRAIT() {
    return 'reverse_portrait'
  }

  // options.capture.camera
  static get FRONT() {
    return 'front'
  }
  static get EXTERNAL() {
    return 'external'
  }

  // options.capture.face_detector
  static get AUTO() {
    return 'auto'
  }
  // TODO naming collision with filter.classic
  // Might be a good idea to name space these options
  static get CLASSIC() {
    return 'classic'
  }
  static get ML_KIT() {
    return 'ml_kit'
  }
  static get BLAZEFACE() {
    return 'blazeface'
  }

  // options.ui.filter
  static get SHADED() {
    return 'shaded'
  }
  static get VIBRANT() {
    return 'vibrant'
  }

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
    this.ui = removeNulls(this.ui)
    this.capture = removeNulls(this.capture)
    this.network = removeNulls(this.network)
    return this
  }
}

function removeNulls(object) {
  let replacer = (key, value) => {
    return value == null ? undefined : value
  }

  return JSON.parse(JSON.stringify(object, replacer))
}
