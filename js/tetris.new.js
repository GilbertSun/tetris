(function ($) {
	function Tetris (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Tetris.DEFAULT, options);
		this.init();
	}
	Tetris.DEFAULT = {
		w: 12,
		h: 21,
		initSpeed: 1000,
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
	// 将数值向右旋转90度
	Tetris.rotateRight90deg = function (originArr) {
		var rotateArr = [],
			i, ilen, j, jlen;

		for (i = 0, ilen = originArr.length; i < ilen; i++) {
			for (j = 0, jlen = originArr[i].length; j < jlen; j++) {
				if (typeof rotateArr[j] === 'undefined') rotateArr[j] = [];
				rotateArr[j][i] = originArr[ilen - i - 1][j];
			}
		}
		return rotateArr;
	};
	Tetris.prototype.init = function() {
		this._drawScreen();
	};
	Tetris.prototype.start = function () {
		this.duration = this.options.initSpeed;
		this._resetOffset();
		this._resetScreen();
		window.clearInterval(this.timer);
		this.throwTetrmino();
	};

	Tetris.prototype.moveDown = function () {
		this._downTetromino();
	};
	Tetris.prototype.moveLeft = function () {
		var offsetX = this.offsetX;
		if (offsetX > 0) {
			this.offsetX--;
			this._displayTetromino();
		}
	};
	Tetris.prototype.moveRight = function () {
		var offsetX = this.offsetX,
			tetrominoWidth = this.tetromino[0].length;
		if (offsetX <  this.options.w - tetrominoWidth) {
			this.offsetX++;
			this._displayTetromino();
		}
	};
	Tetris.prototype.rotate = function () {
		var tetromino = this.tetromino,
			rotateTetromino = Tetris.rotateRight90deg(tetromino);

		if (!this._isTetrominoCollision(this.offsetY, this.offsetX, rotateTetromino)) {
			this.tetromino = rotateTetromino;
			this._displayTetromino();
		}
	};
	Tetris.prototype.throwTetrmino = function () {
		var duration = this.duration,
			_this = this;
		window.clearInterval(this.timer);
		this._resetOffset();
		this.tetromino = this._randTetromino();

		_this._downTetromino();
		this.timer = window.setInterval(function () {
			_this._downTetromino();
		}, duration);
	};
	Tetris.prototype._downTetromino = function () {
		if (this._isTetrominoCollision(this.offsetY + 1)) {
			$('td.droping', this.$ele)
				.removeClass('droping')
				.addClass('fill');
			this.throwTetrmino();
		} else {
			this.offsetY++;
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
					if (cellx >= 0 && celly >= 0) {
						$('table tr:eq(' + celly + ') td:eq(' + cellx + ')', this.$ele)
							.css('background', 'red')
							.addClass('droping');
					}
				}
			}
		}
	};
	Tetris.prototype._isTetrominoCollision = function (offsetY, offsetX, tetromino) {
		var i, ilen, j, jlen,
			nextcell;

		tetromino = tetromino || this.tetromino;
		offsetY = offsetY || this.offsetY;
		offsetX = offsetX || this.offsetX;

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

		return tetrominos[random(0, tetrominos.length - 1)].slice();
	};
	Tetris.prototype._resetOffset = function () {
		this.offsetY = -2;
		this.offsetX = this.options.w / 2 -2;
	};
	Tetris.prototype._resetScreen = function() {
		$('td', this.$ele)
			.removeClass('fill droping')
			.css('background', '');
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

	$.fn.tetris = function (option) {
		return this.each(function () {
			var $this = $(this);
			$this.data('tetris', (new Tetris(this, option)));
		});
	};
	$.fn.tetris.Constructor = Tetris;

	function random(start, end) {
		return Math.floor(Math.random()*(end - start + 1) + start);
	}
}(window.jQuery));
