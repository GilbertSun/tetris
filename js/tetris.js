//参考源代码写的俄罗斯方块js文件
var tetris = {
	//shape color
	colors: [
		'#eaeaea',
		'#ff6600',
		'#eec900',
		'#0000ff',
		'#cc00ff',
		'#00ff00',
		'#66ccff',
		'#ff0000'
	],

	//starting line for each shape
	startAt: [0, -1, -1, -1, 0, -1, -1, 0],

	//points per line for each shape
	Points: [0, 40, 100, 300, 1200],

	shapes: [
		// none
		[],
		// I
		[
			[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
			[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]
		],
		// T
		[
			[[0,0,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0]],
			[[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
			[[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
			[[0,1,0,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]]
		],
		// L
		[
			[[0,0,0,0],[1,1,1,0],[1,0,0,0],[0,0,0,0]],
			[[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
			[[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
			[[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,0,0]]
		],
		// J
		[
			[[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
			[[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
			[[0,0,0,0],[1,1,1,0],[0,0,1,0],[0,0,0,0]],
			[[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]]
		],
		// Z
		[
			[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],
			[[0,0,1,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]]
		],
		// S
		[
			[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],
			[[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]]
		],
		// O
		[
			[[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]]]
		],

	//per-load elements for the grid
	init : function(){
		var i, j, k;
		this.cells = [];
		for(i = -3; i < 18; i++){
			this.cells[i] = [];
			for(j = 1; j < 11; j++){
				k = String.fromCharCode(i + 97);
				if(i < 0)
					k = 'z';
				this.cells[i][j] = $(['#', k, j].join(''));
			}
		}
		this.bound = $.browser == 'msie' ? '#tetris' : window;
	},

	//Initialize to start the game
	start: function(){
		tetris.level = 0;
		tetris.lines = 0;
		tetris.score = 0;

		//Array which contains data of the grid
		tetris.grid = [
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1]
		];
		$('#grid td').css('backgroundColor', tetris.colors[0]);
		$('#start').unbind('click', tetris.start).val('pause').click(tetris.pause);
		$('#stop').removeAttr('disabled');
		$(tetris.bound).keypress(tetris.key);
		tetris.next =tetris.newShape();
		tetris.shift();
		tetris.duration = 600;
		tetris.refresh();
		tetris.timer = window.setInterval(tetris.moveDown, tetris.duration);
	},
	key: function(e){
		switch(e.which){
			case 74 : case 106 :tetris.moveLeft(); break; //J
			case 76 : case 108 :tetris.moveRight(); break; //L
			case 75 : case 107 :tetris.moveDown(); break; //K
			case 73 : case 105 :tetris.rotate(); break; //I
		}
	},
	newShape: function(){
		var r = 1 + Math.random() * 7;
		return parseInt(r >7 ? 7 : r, 10);
	},
	setNext: function(){
		var i, j, s, c, d, n = this.colors[0];
		this.next = this.newShape();
		s = this.shapes[this.next][0];
		c = this.colors[this.next];
		for(i = 0; i < 4; i++){
			for(j = 0; j < 4; j++){
				d = s[i][j] ? c : n;
				$(['#x', j, i].join('')).css('backgroundColor', d);
			}
		}
	},

	//the next shape becomes the current one; reset coordinates
	shift: function(){
		this.cur = this.next;
		this.x = this.x0 = 4;
		this.y = this.startAt[this.cur];
		this.y0 = this.y -2;
		this.r = this.r0 = 0;
		this.curShape = this.shapes[this.cur];
		if(this.canGo(0, this.x, this.y)){
			this.setNext();
			return true;
		}
		return false;
	},
	pause: function(){
		$(tetris.bound).unbind('press', tetris.key);
		window.clearInterval(tetris.timer);
		tetris.timer = null;
		$('#start').unbind('click0', tetris.pause).val('resume').click(tetris.resume);
	},
	resume: function(){
		$(this.bound).keypress(this.key);
		this.timer = window.setInterval(this.moveDown, this.duration);
		$('#start').unclick(this.resume).val('pause').click(this.pause);
	},
	//	stop the game
	gameOver: function(){
		var i, j;
		if(tetris.timer){
			$(tetris.bound).unbind('keypress', tetris.key);
			window.clearInterval(tetris.timer);
			tetris.timer = null;
			$('#start').unbind('click', tetris.pause).val('start').click(tetris.start);
		}else{
			$('#start').unbind('click', tetris.resume).val('start').click(tetris.start);
		}
		$('#stop').attr('disabled', true);

		for(i < 0; i < 18; i++){
			for(j = 1; j < 11; j++){
				if(tetris.grid[i][j]){
					tetris.cells[i][j].css('backgroundColor', '#ccc');
				}
			}
		}
		tetris.draw(tetris.r0,tetris.x0,tetris.y0, '#ccc');
	},
	//check overlays
	canGo: function(r, x, y){
		var i, j;
		for(i = 0; i < 4; i++){
			for(j = 0; j < 4; j++){
				if(this.curShape[r][j][i] && this.grid[y + j] && this.grid[y + j][x + i])
					return false;
			}
		}
		return true;
	},
	//Move the current shape to the left
	moveLeft: function(){
		if(tetris.canGo(tetris.r, tetris.x - 1, tetris.y)){
			tetris.x--;
			tetris.refresh();
		}
	},
	//Move the current shape to right
	moveRight: function(){
		if(tetris.canGo(tetris.r, tetris.x + 1, tetris.y)){
			tetris.x++;
			tetris.refresh();
		}
	},
	//Rotate the current shape
	rotate: function(){
		var r = tetris.r == tetris.curShape.length -1 ? 0 : tetris.r + 1;
		if(tetris.canGo(r, tetris.x, tetris.y)){
			tetris.r0 = tetris.r;
			tetris.r = r;
			tetris.refresh();
		}
	},
	moveDown: function(){
		if(tetris.canGo(tetris.r, tetris.x, tetris.y + 1)){
			tetris.y++;
			tetris.refresh();
		}else{
			tetris.touchDown();
		}
	},
	//The current shape touches down
	touchDown: function(){
		var i, j, k, r, f;
		//mark the grid
		for(i = 0; i < 4; i++){
			for(j = 0; j < 4; j++){
				if(this.curShape[this.r][j][i] && this.grid[this.y + j])
					this.grid[this.y + j][this.x + i] = this.cur;
			}
		}

		f = 0;
		for(i = 17, k = 17; i > -1 && f < 4; i--, k--){
			if(this.grid[i].join('').indexOf('0') == -1){
				for(j = 1; j < 11; j++){
					this.cells[k][j].css('backgroundColor', '#ccc');
				}
				f++;
				for(j = i; j > 0; j--){
					this.grid[j] = this.grid[j - 1].concat();
				}
				i++;
			}
		}
		//animate
		if(f){
			window.clearInterval(this.timer);
			this.timer = window.setTimeout(function(){tetris.after(f);}, 100);
		}
		//try to continue
		if(this.shift()){
			this.refresh();
		}else{
			this.gameOver();
		}

	},
	//finish the touchdown process
	after: function(f){
		var i, j, l = (this.level < 20 ? this.level :20) * 25;
		//status
		this.lines += f;

		if(this.lines % 10 === 10){
			this.level = this.lines / 10;
		}
		window.clearTimeout(this.timer);
		this.timer = window.setInterval(this.moveDown, this.duration - l);
		this.score += (this.level + 1) * this.Points[f];
		//redraw the grid
		for(i = 0; i < 18; i++){
			for(j = 1; j < 11; j++){
				this.cells[i][j].css('backgroundColor', this.colors[this.grid[i][j]]);
			}
		}
		this.refresh();
	},
	draw: function(r, x, y, c){
		var i, j;
		for(i = 0; i < 4; i++){
			for(j = 0; j < 4; j++){
				if(this.curShape[r][j][i]){
					this.cells[y + j][x + i].css('backgroundColor', c);
				}
			}
		}
	},
	refresh: function(){
		this.draw(this.r0, this.x0, this.y0, this.colors[0]);
		this.draw(this.r, this.x, this.y, this.colors[this.cur]);

		$('#level').html(this.level + 1);
		$('#lines').html(this.line);
		$('#score').html(this.score);

		this.x0 = this.x;
		this.y0 = this.y;
		this.r0 = this.r;
	}
};

$(function(){
	tetris.init();
	$('#grid table, #next table').css('backgroundColor', tetris.colors[0]);
	$('#start').click(tetris.start);
	$('#stop').click(tetris.gameOver);
});
