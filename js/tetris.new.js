(function ($) {
	function Tetris (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Tetris.DEFAULT, options);
		this.init();
	}
	Tetris.DEFAULT = {
		w: 10,
		h: 18,
		Tetromino: [
			[1, 1, 1, 1], // I
			[[1, 0, 0], [1, 1, 1]], // J
			[[0, 0, 1], [1, 1, 1]], // L
			[[1, 1], [1, 1]], // O
			[[0, 1, 1], [1, 1, 0]], // S
			[[0, 1, 0], [1, 1, 1]], // T
			[[1, 1, 0], [0, 1, 1]] // Z
		]
	};
	Tetris.prototype.init = function() {
		this.drawScreen();
	};
	Tetris.prototype.drawScreen = function() {
		var $ele = this.$element,
			options = this.options,
			$table = $('<table class="tetris"/>'),
			$tr = $('<tr />'),
			$td = $('<td />'),
			rowi, coli, $ttr;

		for (rowi = 0; rowi < options.h; rowi++) {
			$ttr = $tr.clone();
			for (coli = 0; coli < options.w; coli++) {
				$ttr.append($td.clone());
			}
			$table.append($ttr);
		}
		$ele.append($table);
	};
	Tetris.prototype.start = function () {

	};

	$.fn.tetris = function (option) {
		return this.each(function () {
			var $this = $(this);
			$this.data('tetris', (new Tetris(this, option)));
		});
	};
}(window.jQuery));
