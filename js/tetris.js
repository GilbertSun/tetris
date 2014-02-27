(function ($) {
	function Tetris (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Tetris.DEFAULT, options);
		this.init();
	}
	Tetris.DEFAULT = {
		w: 12,
		h: 21,
		initSpeed: 400,
		speedRate: function (score, oldRate) {},
		tetrominos: [
			[[1, 1, 1, 1]]
		],
		hotKey: {
			rotate: 38,
			left: 37,
			right: 39,
			down: 40,
			pause: 32,
			restart: 116
		},
		scoreRate: function (elimate, oldscore) {},
		statusHandler: function (score, speed) {},
		autoStart: false
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
		this._bindController();
		if (this.options.autoStart) {
			this.start();
		}
	};
	Tetris.prototype.start = function () {
		this._resetStatus();
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
		if (offsetX > 0 && !this._isTetrominoCollision(this.offsetY, this.offsetX - 1)) {
			this.offsetX--;
			this._displayTetromino();
		}
	};
	Tetris.prototype.moveRight = function () {
		var offsetX = this.offsetX,
			tetrominoWidth = this.tetromino[0].length;
		if (offsetX <  this.options.w - tetrominoWidth && !this._isTetrominoCollision(this.offsetY, this.offsetX + 1)) {
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
		var speed = this.speed,
			_this = this;
		window.clearInterval(this.timer);
		this._resetOffset();
		this.tetromino = this._randTetromino();

		_this._downTetromino();
		this.timer = window.setInterval(function () {
			_this._downTetromino();
		}, speed);
	};
	Tetris.prototype._downTetromino = function () {
		if (this.fail) return;
		if (this._isTetrominoCollision(this.offsetY + 1)) {
			$('td.droping', this.$element)
				.removeClass('droping')
				.addClass('fill');
			if (this.offsetY < 0) {
				this.fail = true;
				this.failHandler && this.failHandler();
				return;
			}
			this._dealWithElimate();
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
			$ele = this.$element,
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
						$('table tr:eq(' + celly + ') td:eq(' + cellx + ')', $ele)
							.css('background', 'red')
							.addClass('droping');
					}
				}
			}
		}
	};
	Tetris.prototype._isTetrominoCollision = function (offsetY, offsetX, tetromino) {
		var i, ilen, j, jlen,
			$nextcell = $();

		tetromino = tetromino || this.tetromino;
		offsetY = offsetY || this.offsetY;
		offsetX = offsetX || this.offsetX;

		if (offsetX + tetromino[0].length > this.options.w) return true;
		for (i = 0, ilen = tetromino.length; i < ilen; i++) {
			for (j = 0, jlen = tetromino[i].length; j < jlen; j++) {
				if (offsetY + i >= 0 && offsetX + j >= 0) {
					$nextcell = $('table tr', this.$element).eq(offsetY + i).children().eq(offsetX + j);
				}
				if (tetromino[i][j] === 1 && ($nextcell.hasClass('fill') || offsetY + i + 1 > this.options.h)) {
					return true;
				}
			}
		}
		return false;
	};
	Tetris.prototype._dealWithElimate = function () {
		var $ele = this.$element,
			scoreRate = this.options.scoreRate,
			speedRate = this.options.speedRate,
			statusHandler = this.options.statusHandler,
			$completeRow = $('tr', $ele)
				.filter(function () {
					return $(this).children(':not(.fill)').length === 0;
				}),
			elimate = $completeRow.length;

		$ele.find('table').prepend($completeRow.children('td').css('background', '').removeClass('fill').end());

		if (elimate > 0) {
			if (typeof scoreRate === 'function') {
				this.score = scoreRate(elimate, this.score) || this.score;
			} else if (typeof scoreRate === 'number') {
				this.score += elimate * scoreRate;
			}

			if (typeof speedRate === 'function') {
				this.speed = speedRate(this.score, this.speed) || this.speed;
			}

			if (typeof statusHandler === 'function') {
				statusHandler(this.score, this.speed);
			}
		}
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
		$('td', this.$element)
			.removeClass('fill droping')
			.css('background', '');
	};
	Tetris.prototype._resetStatus = function () {
		this.speed = this.options.initSpeed;
		this.score = 0;
		this.fail = false;
	};
	Tetris.prototype._drawScreen = function() {
		var $ele = this.$element,
			options = this.options,
			$table = $('<table/>'),
			$tr, $td,
			rowi, coli, $ttr;

		for (rowi = 0; rowi < options.h; rowi++) {
			$tr = $('<tr />');
			for (coli = 0; coli < options.w; coli++) {
				$tr.append($('<td />'));
			}
			$table.append($tr);
		}
		$ele.append($table);
	};
	Tetris.prototype._bindController = function () {
		var hotKey = this.options.hotKey,
			_this = this;
		$(window).bind('keydown.tetris', function (e) {
			switch (e.which) {
				case hotKey.rotate:
					_this.rotate();
				return false;
				case hotKey.left:
					_this.moveLeft();
				return false;
				case hotKey.right:
					_this.moveRight();
				return false;
				case hotKey.down:
					_this.moveDown();
				return false;
				case hotKey.restart:
					_this.start();
				return false;
			}
		});
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
