export class Options {

    title = null
    titleTextColor = null
    filter = {
        name : null,
        style : null,
        foregroundColor: null, // LineDrawing filter
        backgroundColor: null // LineDrawing filter
    }
    surroundColor = null
    font = null
    logoImage = null
    enableScreenshots = null
    closeButtonTintColor = null
    closeButtonImage = null
    promptTextColor = null
    promptBackgroundColor = null
    promptRoundedCorners = null
    disableExteriorEffects = null
    headerBackgroundColor = null
    certificates = null
    timeout = null
    orientation = null
    camera = null
    
    genuinePresenceAssurance = {
        readyOvalStrokeColor: null,
        notReadyOvalStrokeColor: null
    }
    livenessAssurance = {
        ovalStrokeColor: null,
        completedOvalStrokeColor: null
    }

    // options.orientation
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
  
    // options.camera
    static get FRONT() {
      return 'front'
    }
  
    static get EXTERNAL() {
      return 'external'
    }
  
    // options.filter.name
    static get NATURAL() {
        return 'natural'
    }

    static get LINE_DRAWING() {
        return 'line_drawing'
    }

    // Styles for Natural filter
    // options.filter.style
    static get CLEAR() {
        return 'clear'
      }
      
    static get BLUR() {
        return 'blur'
      }

    // Styles for LineDrawing filter
    // options.filter.style
    static get CLASSIC() {
        return 'classic'
      }

    static get SHADED() {
      return 'shaded'
    }
  
    static get VIBRANT() {
      return 'vibrant'
    }
    
  }