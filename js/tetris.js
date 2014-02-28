/**
*
* @file jQuery plugin to create a tetris game
* @author GilbertSun <szb4321@gmail.com>
* @version 0.0.1
*
**/


(function ($) {
    /**
     * create a Tetris game
     * @class
     * @classdesc the constructor of Tetris class
     * @param {element} element contain the tetris scene
     * @param {object} options the config of the game
     */
    function Tetris (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Tetris.DEFAULT, options);
        this.init();
    }

    // default option for Tetris
    Tetris.DEFAULT = {
        w: 12, // the horizontal cell width of the game
        h: 21, // the vertical cell width of the game
        control: 'keyboard',
        hotKey: {
            rotate: 38,
            left: 37,
            right: 39,
            down: 40,
            pause: 32,
            restart: 116
        },
        /**
         * the initial speed of game 1=>400ms move down the tetrominos per initSpeed
         * @type {Number}
         *  1=>400ms
         *  2=>300ms
         *  3=>200ms
         *  4=>100ms
         */
        initSpeed: 1,
        // tetrominos maybe shown
        tetrominos: [
            [[1, 1, 1, 1]], // I
            [[1, 0, 0], [1, 1, 1]], // J
            [[0, 0, 1], [1, 1, 1]], // L
            [[1, 1], [1, 1]], // O
            [[0, 1, 1], [1, 1, 0]], // S
            [[0, 1, 0], [1, 1, 1]], // T
            [[1, 1, 0], [0, 1, 1]] // Z
        ],
        // tetromino's maybe color
        tetrominosColor: ['#f00', '#f90', '#ff0', '#9f0', '#0f0', '#0f9', '#0ff', '#09f', '#00f', '#90f', '#f0f', '#f09'],
        speed: function (score, oldRate) {},
        score: function (elimate, oldscore) {},
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

        if (this.options.control === 'keyboard') {
            this.bindControl();
        }
        if (this.options.autoStart) {
            this.start();
        }
    };
    Tetris.prototype.destroy = function () {
        this.unbindControl();
    };
    Tetris.prototype.unbindControl = function () {
        $(window).unbind('.tetris');
    };
    Tetris.prototype.bindControl = function () {
        this.unbindControl();
        this._bindController();
    };
    Tetris.prototype.start = function () {
        this._resetStatus();
        this._resetOffset();
        this._resetScreen();
        window.clearInterval(this.timer);
        this.throwTetrmino();
    };
    Tetris.prototype.pause = function () {
        this.paused = true;
        window.clearTimeout(this.timer);
    };
    Tetris.prototype.resume = function () {
        this.paused = false;
        this._downTetromino();
    };
    Tetris.prototype.moveDown = function () {
        this._downTetromino();
    };
    Tetris.prototype.moveLeft = function () {
        var offsetX = this.offsetX;
        if (!this.paused && offsetX > 0 && !this._isTetrominoCollision(this.offsetY, this.offsetX - 1)) {
            this.offsetX--;
            this._displayTetromino();
        }
    };
    Tetris.prototype.moveRight = function () {
        var offsetX = this.offsetX,
            tetrominoWidth = this.tetromino[0].length;
        if (!this.paused && offsetX <  this.options.w - tetrominoWidth && !this._isTetrominoCollision(this.offsetY, this.offsetX + 1)) {
            this.offsetX++;
            this._displayTetromino();
        }
    };
    Tetris.prototype.rotate = function () {
        var tetromino = this.tetromino,
            rotateTetromino = Tetris.rotateRight90deg(tetromino);
        if (!this.paused && !this._isTetrominoCollision(this.offsetY, this.offsetX, rotateTetromino)) {
            this.tetromino = rotateTetromino;
            this._displayTetromino();
        }
    };
    Tetris.prototype.throwTetrmino = function () {
        window.clearInterval(this.timer);
        this._resetOffset();
        this.tetromino = this._randTetromino();
        this.tetrominoColor = this._randColor();

        this._downTetromino();
    };
    Tetris.prototype._downTetromino = function () {
        var speed = this.speed,
            _this = this;

        if (this.fail) return;
        if (this._isTetrominoCollision(this.offsetY + 1)) {
            $('td.droping', this.$element)
                .removeClass('droping')
                .addClass('fill');
            if (this.offsetY < 0) {
                this.fail = true;
                typeof this.options.failHandler === 'function' && this.options.failHandler();
                return;
            }
            this._dealWithElimate();
            this.throwTetrmino();
        } else {
            this.offsetY++;
            this._displayTetromino();
            window.clearTimeout(this.timer);
            this.timer = window.setTimeout(function () {
                _this._downTetromino();
            }, speed);
        }
    };
    Tetris.prototype._displayTetromino = function () {
        var tetromino = this.tetromino,
            color = this.tetrominoColor,
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
                            .css('background', color)
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
            score = this.options.score,
            speed = this.options.speed,
            statusHandler = this.options.statusHandler,
            $completeRow = $('tr', $ele)
                .filter(function () {
                    return $(this).children(':not(.fill)').length === 0;
                }),
            elimate = $completeRow.length;

        $ele.find('table').prepend($completeRow.children('td').css('background', '').removeClass('fill').end());

        if (elimate > 0) {
            if (typeof score === 'function') {
                this.score = score(elimate, this.score);
            } else if (typeof score === 'number') {
                this.score += elimate * score;
            }

            if (typeof speed === 'function') {
                this.speed = this._convertRealSpeed(speed(this.score, this.speed));
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
    Tetris.prototype._randColor = function () {
        var tetrominosColor = this.options.tetrominosColor;

        return tetrominosColor[random(0, tetrominosColor.length - 1)];
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
        this.speed = this._convertRealSpeed(this.options.initSpeed);
        this.score = 0;
        this.fail = false;
        this.paused = false;
    };
    Tetris.prototype._convertRealSpeed = function (relativeSpeed) {
        return Math.max((5 - relativeSpeed) * 100, 100);
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
                case hotKey.pause:
                    _this.paused ? _this.resume() : _this.pause();
                return false;
            }
        });
    };

    $.fn.tetris = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('tetris'),
                options = typeof option === 'object' && option;
            if (!data) $this.data('tetris', (data = new Tetris(this, options)));

            if (typeof option === 'string' && typeof data[option] === 'function') {
                data[option]();
            }

            if (option === 'destroy') {
                $this.removeData('tetris');
            }
        });
    };
    $.fn.tetris.Constructor = Tetris;

    function random(start, end) {
        return Math.floor(Math.random()*(end - start + 1) + start);
    }
}(window.jQuery));
