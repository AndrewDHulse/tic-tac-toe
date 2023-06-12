	/*----- constants -----*/
const COLORS = {
	'0': 'black',
	'1': 'blue',
	'-1': 'yellow',
};

const winningCombinations = [
	[ 'c0r2', 'c1r2', 'c2r2' ], // Horiz 
	[ 'c0r1', 'c1r1', 'c2r1' ], // Horiz
	[ 'c0r0', 'c1r0', 'c2r0' ], // Horiz
	[ 'c0r2', 'c0r1', 'c0r0' ], // Vert
	[ 'c1r2', 'c1r1', 'c1r0' ], // Vert
	[ 'c2r2', 'c2r1', 'c2r0' ], // Vert
	[ 'c0r2', 'c1r1', 'c2r0' ], // Diag
	[ 'c0r0', 'c1r1', 'c2r2' ]  // Diag
  ];

	/*----- state variables -----*/
let board; // array of 3 columns arrays
let turn; // 1 || -1
let winner; // null=no winner; 1 || -1=winner, T=tie

	/*----- cached elements  -----*/
const messageEl=document.querySelector('h1');
const playAgainBtn= document.querySelector('button');
const tileEls = [...document.querySelectorAll('#board > div')]; 

	/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleClick);
playAgainBtn.addEventListener('click', init);

	/*----- functions -----*/
init();

function init(){
	board = [
		[0,0,0], 
		[0,0,0], 
		[0,0,0], 
	];
	turn = 1;
	winner = null;
	render ();
}

function handleClick(evt) {
	const tileId= evt.target.id;
	const colIdx = parseInt(tileId.charAt(1));
	const rowIdx = parseInt(tileId.charAt(3));
	if (board[colIdx][rowIdx]===0 && !winner){
		board[colIdx][rowIdx] =turn;
		turn *= -1;
		winner = getWinner(colIdx, rowIdx)
		render();
	}
  }

function getWinner(colIdx, rowIdx){
	return (
	checkVerticalWin(colIdx, rowIdx) ||
	checkHorizontalWin(colIdx, rowIdx) ||
	checkDiagonalWinNESW(colIdx, rowIdx) ||
	checkDiagonalWinNWSE(colIdx, rowIdx)
	);
}

function checkDiagonalWinNESW(colIdx, rowIdx) {
	const adjCountNE = countAdjacent(colIdx, rowIdx, 1, -1);
	const adjCountSW = countAdjacent(colIdx, rowIdx, -1, 1);
	return (adjCountNE + adjCountSW) >= 2 ? board[colIdx][rowIdx] : null;
  }
  
function checkDiagonalWinNWSE(colIdx, rowIdx) {
	const adjCountNW = countAdjacent(colIdx, rowIdx, -1, -1);
	const adjCountSE = countAdjacent(colIdx, rowIdx, 1, 1);
	return (adjCountNW + adjCountSE) >= 2 ? board[colIdx][rowIdx] : null;
  }
  
function checkHorizontalWin(colIdx, rowIdx) {
	const adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0);
	const adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0);
	return (adjCountLeft + adjCountRight) >= 2 ? board[colIdx][rowIdx] : null;
  }
  
function checkVerticalWin(colIdx, rowIdx) {
	const adjCountUp = countAdjacent(colIdx, rowIdx, 0, -1);
	const adjCountDown = countAdjacent(colIdx, rowIdx, 0, 1);
	return (adjCountUp + adjCountDown) >= 2 ? board[colIdx][rowIdx] : null;
  }
  
function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
	const player = board[colIdx][rowIdx];
	let count = 0;
	colIdx += colOffset;
	rowIdx += rowOffset;
	while (
		board[colIdx] !== undefined &&
		board[colIdx][rowIdx] !== undefined &&
		board[colIdx][rowIdx] === player
	) {
		count++;
		colIdx += colOffset;
		rowIdx += rowOffset;
	}
	return count;
  }
  
function render(){
	renderBoard();
	renderMessage();
	renderControls();
}

function renderBoard(){
	board.forEach(function(colArr, colIdx){
		colArr.forEach(function(cellVal,rowIdx){
			const cellId =`c${colIdx}r${rowIdx}`;
			const cellEl =document.getElementById(cellId);
			cellEl.style.backgroundColor = COLORS[cellVal];
			cellEl.style.gridColumn = colIdx + 1;
			cellEl.style.gridRow = 3 - rowIdx;
		});
	});
}

function renderMessage() {
	const boardFull = board.every(function (colArr) {
	  return !colArr.includes(0);
	});
	if (boardFull) {
	  messageEl.innerText = "a cat's game";
	} else if (winner) {
	  messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner]}</span> wins`;
	} else {
	  messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn]}</span>'s turn`;
	}
  }
  
  function renderControls() {
	playAgainBtn.style.visibility = winner !== null || t() ? 'visible' : 'hidden';
	const boardFull = board.every(function (colArr) {
	  return !colArr.includes(0);
	});
	tileEls.forEach(function (tileEl) {
	  const hideTile = boardFull || winner !== null;
	  tileEl.style.display = hideTile ? 'none' : 'block';
	});
  }
  
  function t() {
	return winner === null && board.every(function (colArr) {
	  return colArr.every(function (cellVal) {
		return cellVal !== 0;
	  });
	});
  }