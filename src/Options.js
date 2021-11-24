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
  // Also can be 'classic'
  static get SHADED() {
    return 'shaded'
  }

  static get VIBRANT() {
    return 'vibrant'
  }

  ui = {
    filter: null,
    lineColor: null,
    backgroundColor: null,
    headerBackgroundColor: null,
    footerBackgroundColor: null,
    headerTextColor: null,
    footertTextColor: null,
    promptTextColor: null,
    primaryTintColor: null,
    secondaryTintColor: null,
    title: null,
    fontPath: null,
    logoImage: null,
    floatingPromptEnabled: null,
    enableScreenshots: null,
    orientation: null,
    activityCompatibilityRequestCode: null,

    genuinePresenceAssurance: {
      notReadyTintColor: null,
      readyTintColor: null,
      progressBarColor: null,
      autoStartDisabled: null
    },

    livenessAssurance: {
      livenessTintColor: null,
      livenessScanningColor: null
    }
  }

  capture = {
    camera: null,
    faceDetector: null,

    genuinePresenceAssurance: {
      maxYaw: null,
      maxRoll: null,
      maxPitch: null
    }
  }

  network = {
    path: null,
    timeout: null,
    certificates: null
  }
}
