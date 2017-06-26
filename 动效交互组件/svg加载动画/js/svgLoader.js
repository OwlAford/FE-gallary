(function (win) {
	function extend (a, b) {
		for(var key in b) { 
			if (b.hasOwnProperty(key)) {
				a[key] = b[key]
			}
		}
		return a
	}

	function SVGLoader (el, options) {
		this.el = el
		this.options = extend({}, this.options)
		extend(this.options, options)
		this._init()
	}

	SVGLoader.prototype = {
		options: {
			speedIn : 500,
			easingIn : mina.linear
		},

		_init: function () {
			var s = Snap(this.el.querySelector('svg'))
			this.path = s.select('path')
			this.initialPath = this.path.attr('d')
			var openingStepsStr = this.el.getAttribute('data-opening')
			this.openingSteps = openingStepsStr ? openingStepsStr.split(';') : ''
			this.openingStepsTotal = openingStepsStr ? this.openingSteps.length : 0
			if (this.openingStepsTotal === 0) return

			var closingStepsStr = this.el.getAttribute('data-closing') ? this.el.getAttribute('data-closing') : this.initialPath
			this.closingSteps = closingStepsStr ? closingStepsStr.split(';') : ''
			this.closingStepsTotal = closingStepsStr ? this.closingSteps.length : 0

			this.isAnimating = false

			if(!this.options.speedOut) {
				this.options.speedOut = this.options.speedIn;
			}
			if(!this.options.easingOut) {
				this.options.easingOut = this.options.easingIn;
			}
		},

		show: function () {
			if( this.isAnimating ) {
				return false
			}
			this.isAnimating = true

			var self = this
			var	onEndAnimation = function() {
					self.el.classList.add('pageload-loading')
				}
			this._animateSVG('in', onEndAnimation)
			this.el.classList.add('show')
		},

		hide: function () {
			var self = this
			this.el.classList.remove('pageload-loading')
			this._animateSVG('out', function () { 
				self.path.attr('d', self.initialPath)
				self.el.classList.remove('show')
				self.isAnimating = false; 
			})
		},

		_animateSVG: function (dir, cb) {
			var self = this
			var	pos = 0
			var	steps = dir === 'out' ? this.closingSteps : this.openingSteps
			var	stepsTotal = dir === 'out' ? this.closingStepsTotal : this.openingStepsTotal
			var	speed = dir === 'out' ? self.options.speedOut : self.options.speedIn
			var	easing = dir === 'out' ? self.options.easingOut : self.options.easingIn
			var	nextStep = function (pos) {
					if(pos > stepsTotal - 1) {
						if( cb && typeof cb === 'function' ) {
							cb()
						}
						return
					}
					self.path.animate({
						'path': steps[pos]
					}, speed, easing, function () {
						nextStep(pos)
					})
					pos++
				}
			nextStep(pos)
		}
	}

	win.SVGLoader = SVGLoader

})(window)