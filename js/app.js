var board = null
var $board = $('#myBoard')
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var game = new Chess()
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
var squareClass = 'square-55d63'
var squareToHighlight = null
var colorToHighlight = null

document.addEventListener('DOMContentLoaded', () => {
  var config = {
    position: 'start',
    draggable: true,
    showNotation: false,
    onMoveEnd: onMoveEnd,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
  }
  board = Chessboard('myBoard', config)

  timer = null

  $('#ruyLopezBtn').on('click', function () {
    board.position('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R');
    game.load('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'); // Atualiza o estado do jogo
    updateStatus();
  });
  $('#startBtn').on('click', function () {
    board.start();
    game.reset(); // Reinicia o jogo
    updateStatus();
  });
  $('#clearBtn').on('click', function () {
    board.clear();
    game.clear(); // Remove todas as peças
    updateStatus();
  });
  
  updateStatus(); 
})

function onMoveEnd () {
  $board
    .find('.square-' + squareToHighlight)
    .addClass('highlight-' + colorToHighlight)
}

function onDragStart (source, piece, position, orientation) {
  if (game.game_over()) return false

  // Bloquear movimentos da peça adversária
  if (
    (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1)
  ) {
    return false
  }

}
function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }
}

// Evento: Validação do movimento
function onDrop (source, target) {
  removeGreySquares()

  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' // Sempre promove peões para rainha
  })

  if (move === null) return 'snapback'

  /* if (move.color === 'w') {
    $board.find('.' + squareClass).removeClass('highlight-white')
    $board.find('.square-' + move.from).addClass('highlight-white')
    squareToHighlight = move.to
    colorToHighlight = 'white'
  } else {
    $board.find('.' + squareClass).removeClass('highlight-black')
    $board.find('.square-' + move.from).addClass('highlight-black')
    squareToHighlight = move.to
    colorToHighlight = 'black'
  } */

  if (move.color === 'w') {
    $('.square-55d63').removeClass('highlight-white')
    $('.square-' + move.from).addClass('highlight-white')
    $('.square-' + move.to).addClass('highlight-white')
  } else {
    $('.square-55d63').removeClass('highlight-black')
    $('.square-' + move.from).addClass('highlight-black')
    $('.square-' + move.to).addClass('highlight-black')
  }

  updateStatus()
}

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  // Use cores diferentes para casas brancas e pretas
  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background-color', background)
}


// Evento: Atualizar a posição do tabuleiro após o movimento
function onSnapEnd () {
  board.position(game.fen())
}


function onMouseoverSquare (square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare (square, piece) {
  removeGreySquares()
}

function onSnapEnd () {
  board.position(game.fen())
}

function highlightSquare (from, to) {
  // Remove qualquer destaque anterior
  $('.square-55d63').css('box-shadow', 'none')

  // Adiciona destaques às casas de origem e destino
  $('.square-' + from).css('box-shadow', 'inset 0 0 3px 3px yellow')
  $('.square-' + to).css('box-shadow', 'inset 0 0 3px 3px blue')
}