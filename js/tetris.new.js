(function ($) {
	function Tetris (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Tetris.DEFAULT, options);
		this.init();
	}
	Tetris.DEFAULT = {
		w: 12,
		h: 21,
		initSpeed: 300,
		tetrominos: [
			[[1, 1, 1, 1]], // I
			[[1, 0, 0], [1, 1, 1]], // J
			[[0, 0, 1], [1, 1, 1]], // L
			[[1, 1], [1, 1]], // O
			[[0, 1, 1], [1, 1, 0]], // S
			[[0, 1, 0], [1, 1, 1]], // T
			[[1, 1, 0], [0, 1, 1]] // Z
		]
	};

	Tetris.prototype.init = function() {
		this._drawScreen();
		// this.start();
	};
	Tetris.prototype._drawScreen = function() {
		var $ele = this.$element,
			options = this.options,
			$table = $('<table class="tetris"/>'),
			$tr, $td,
			rowi, coli, $ttr;

		for (rowi = 0; rowi < options.h; rowi++) {
			$tr = $('<tr class=row-"' + rowi + '"/>');
			for (coli = 0; coli < options.w; coli++) {
				$tr.append($('<td class="r' + rowi + 'c' + coli + '"/>'));
			}
			$table.append($tr);
		}
		$ele.append($table);
	};
	Tetris.prototype.start = function () {
		this.duration = this.options.initSpeed;
		this._resetOffset();

		window.clearInterval(this.timer);
		this.throwTetrmino();
	};
	Tetris.prototype.moveDown = function () {

	};
	Tetris.prototype.moveLeft = function () {

	};
	Tetris.prototype.moveRight = function () {

	};
	Tetris.prototype.rotate = function () {

	};
	Tetris.prototype.throwTetrmino = function () {
		var duration = this.duration,
			_this = this;
		window.clearInterval(this.timer);
		this._resetOffset();
		this.tetromino = this._randTetromino();
		this.timer = window.setInterval(function () {
			_this._downTetromino();
		}, duration);
	};
	Tetris.prototype._downTetromino = function () {
		this.offsetY++;
		if (this._isTetrominoCollision()) {
			$('td.droping', this.$ele)
				.removeClass('droping')
				.addClass('fill');
			this.throwTetrmino();
		} else {
			this._displayTetromino();
		}
	};
	Tetris.prototype._displayTetromino = function () {
		var tetromino = this.tetromino,
			offsetX = this.offsetX,
			offsetY = this.offsetY,
			$ele = this.$ele,
			i, j, ilen, jlen,
			cellx, celly;

		$('td.droping', $ele)
			.css('background', '')
			.removeClass('droping');

		for (i = 0, ilen = tetromino.length; i < ilen; i++) {
			for (j = 0, jlen = tetromino[i].length; j < jlen; j++) {
				if (tetromino[i][j] === 1) {
					cellx = offsetX + j;
					celly = offsetY + i;
					$('.r' + celly + 'c' + cellx, this.$ele)
						.css('background', 'red')
						.addClass('droping');
				}
			}
		}
	};
	Tetris.prototype._isTetrominoCollision = function () {
		var tetromino = this.tetromino,
			offsetY = this.offsetY,
			offsetX = this.offsetX,
			i, ilen, j, jlen,
			nextcell;

		for (i = 0, ilen = tetromino.length; i < ilen; i++) {
			for (j = 0, jlen = tetromino[i].length; j < jlen; j++) {
				$nextcell = $('.r' + (offsetY + i) + 'c' + (offsetX + j), this.$ele);
				if (tetromino[i][j] === 1 && ($nextcell.hasClass('fill') || offsetY + i + 1 > this.options.h)) {
					return true;
				}
			}
		}
		return false;

	};
	Tetris.prototype._randTetromino = function () {
		var tetrominos = this.options.tetrominos;

		return tetrominos[random(0, tetrominos.length - 1)];
	};
	Tetris.prototype._resetOffset = function () {
		this.offsetY = -2;
		this.offsetX = this.options.w / 2 -2;
	};

	$.fn.tetris = function (option) {
		return this.each(function () {
			var $this = $(this);
			$this.data('tetris', (new Tetris(this, option)));
		});
	};

	function random(start, end) {
		return Math.floor(Math.random()*(end - start + 1) + start);
	}
}(window.jQuery));
