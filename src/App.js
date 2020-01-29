import React from 'react';
import Chessboard from 'chessboardjsx'
import Chess from 'chess.js'
import * as pe from './piecesEvalution'
import './App.css'


class App extends React.Component {
	state = { fen: 'start', pieceSquare: '' };

	componentDidMount() {
		this.game = new Chess()
	}
	//------------------------
	getBestMove = (depth, isPlayer) => {
		const newGameMoves = this.game.moves();
		let bestMove = -9999;
		let bestMoveFound;

		for (var i = 0; i < newGameMoves.length; i++) {
			let newGameMove = newGameMoves[i]
			this.game.move(newGameMove);
			let value = this.minimax(depth - 1, -10000, 10000, !isPlayer);
			this.game.undo();
			if (value >= bestMove) {
				bestMove = value;
				bestMoveFound = newGameMove;
			}
		}
		return bestMoveFound;
	};

	minimax = (depth, alpha, beta, isPlayer) => {
		if (depth === 0) {
			let val = this.evaluateBoard();
			//console.log(val);
			return -val;
		}

		const newGameMoves = this.game.moves();

		if (isPlayer) {
			let bestMove = -9999;
			for (let i = 0; i < newGameMoves.length; i++) {
				this.game.move(newGameMoves[i]);
				bestMove = Math.max(bestMove, this.minimax(depth - 1, alpha, beta, !isPlayer));
				this.game.undo();
				alpha = Math.max(alpha, bestMove);
				if (beta <= alpha) {
					return bestMove;
				}
			}
			return bestMove;
		} else {
			let bestMove = 9999;
			for (let i = 0; i < newGameMoves.length; i++) {
				this.game.move(newGameMoves[i]);
				bestMove = Math.min(bestMove, this.minimax(depth - 1, alpha, beta, !isPlayer));
				this.game.undo();
				beta = Math.min(beta, bestMove);
				if (beta <= alpha) {
					return bestMove;
				}
			}
			return bestMove;
		}
	};

	evaluateBoard = () => {
		var totalEvaluation = 0;
		this.game.SQUARES.forEach(square => {
			totalEvaluation = totalEvaluation + this.getPieceValue(square);
		});
		
		return totalEvaluation;
	};

	getPieceValue = (square) => {
		let piece = this.game.get(square)
		if (piece != null) {
			let pos = this.getPositionBySquare(square)
			let absoluteValue = this.getAbsluteValue(piece, pos.x, pos.y)
			return (piece.type === 'w' ? absoluteValue : -absoluteValue)
		}
		return 0;
	}

	getAbsluteValue = (piece, x, y) => {
		if (piece.type === 'p') {
			return 10 + (piece.color === 'w' ? pe.pawnEvalWhite[y][x] : pe.pawnEvalBlack[y][x]);
		} else if (piece.type === 'r') {
			return 50 + (piece.color === 'w' ? pe.rookEvalWhite[y][x] : pe.rookEvalBlack[y][x]);
		} else if (piece.type === 'n') {
			return 30 + pe.knightEval[y][x];
		} else if (piece.type === 'b') {
			return 30 + (piece.color === 'w' ? pe.bishopEvalWhite[y][x] : pe.bishopEvalBlack[y][x]);
		} else if (piece.type === 'q') {
			return 90 + pe.evalQueen[y][x];
		} else if (piece.type === 'k') {
			return 900 + (piece.color === 'w' ? pe.kingEvalWhite[y][x] : pe.kingEvalBlack[y][x]);
		}
		return 0;
	}
	//------------------------
	// getBestMove = (depth, isPlayer) => {
	// 	const moves = this.game.moves()
	// 	let bestMoveValue = -1000
	// 	let bestMoveFound;
	// 	for (let i = 0; i < moves.length; i++) {
	// 		this.game.move(moves[i])
	// 		let value = this.minimax(depth - 1, -1001, 1001, !isPlayer)
	// 		this.game.undo()
	// 		if (value >= bestMoveValue) {
	// 			bestMoveValue = value
	// 			bestMoveFound = moves[i]
	// 		}
	// 	}
	// 	return bestMoveFound;
	// }

	// minimax = (depth, alpha, beta, isPlayer) => {
	// 	if (depth === 0) {
	// 		return -(this.evaluateBoard());
	// 	}

	// 	let moves = this.game.moves()
	// 	if (isPlayer) {
	// 		let bestMove = 1000;
	// 		for (let i = 0; i < moves.length; i++) {
	// 			this.game.move(moves[i])
	// 			bestMove = Math.min(bestMove, this.minimax(depth - 1, alpha, beta, !isPlayer))
	// 			this.game.undo()
	// 			beta = Math.min(beta, bestMove)
	// 			if (beta <= alpha) {
	// 				return bestMove;
	// 			}
	// 		}
	// 		return bestMove;
	// 	} else {
	// 		let bestMove = -1000;
	// 		for (let i = 0; i < moves.length; i++) {
	// 			this.game.move(moves[i])
	// 			bestMove = Math.max(bestMove, this.minimax(depth - 1, alpha, beta, !isPlayer))
	// 			this.game.undo()
	// 			alpha = Math.max(alpha, bestMove)
	// 			if (beta <= alpha) {
	// 				return bestMove;
	// 			}
	// 		}
	// 		return bestMove;
	// 	}
	// }

	// evaluateBoard = () => {
	// 	let totalEval = 0
	// 	let piece = null
	// 	this.game.SQUARES.forEach(square => {
	// 		piece = this.game.get(square)
	// 		let pos = this.getPositionBySquare(square)
	// 		let i = pos.x
	// 		let j = pos.y
	// 		if (piece != null) {
	// 			switch (piece.type) {
	// 				case 'p':
	// 					totalEval += 1 + (piece.color === 'w' ? pe.pawnEvalWhite[i][j] : -pe.pawnEvalBlack[i][j])
	// 					break;
	// 				case 'r':
	// 					totalEval += 5 + (piece.color === 'w' ? pe.rookEvalWhite[i][j] : -pe.rookEvalBlack[i][j])
	// 					break;
	// 				case 'n':
	// 					totalEval += 3 + (piece.color === 'w' ? pe.knightEval[i][j] : -pe.knightEval[i][j]);
	// 					break;
	// 				case 'b':
	// 					totalEval += 3 + (piece.color === 'w' ? pe.bishopEvalWhite[i][j] : -pe.bishopEvalBlack[i][j])
	// 					break;
	// 				case 'q':
	// 					totalEval += 9 + (piece.color === 'w' ? pe.evalQueen[i][j] : -pe.evalQueen[i][j])
	// 					break;
	// 				case 'k':
	// 					totalEval += 90 + (piece.color === 'w' ? pe.kingEvalWhite[i][j] : -pe.kingEvalBlack[i][j])
	// 					break;
	// 				default:
	// 					console.log('Error unknown piece type');
	// 			}
	// 		}
	// 	})
	// 	return totalEval;
	// }

	getPositionBySquare = square => {
		let position = { x: undefined, y: undefined }
		switch (square.charAt(0)) {
			case 'a':
				position.y = 0
				break;
			case 'b':
				position.y = 1
				break;
			case 'c':
				position.y = 2
				break;
			case 'd':
				position.y = 3
				break;
			case 'e':
				position.y = 4
				break;
			case 'f':
				position.y = 5
				break;
			case 'g':
				position.y = 6
				break;
			case 'h':
				position.y = 7
				break;
			default:
		}
		position.x = 8 - parseInt(square.charAt(1))
		return position;
	}

	makeRandomMove = () => {
		// exit if the game is over
		if (
			this.game.game_over() === true ||
			this.game.in_draw() === true //||
			//possibleMoves.length === 0
		)
			return;

		const bestMove = this.getBestMove(3, true);
		//let randomIndex = Math.floor(Math.random() * possibleMoves.length);
		this.game.move(bestMove);
		this.setState({
			fen: this.game.fen(),
		});
	};

	onDrop = ({ sourceSquare, targetSquare }) => {
		// see if the move is legal
		var move = this.game.move({
			from: sourceSquare,
			to: targetSquare,
			promotion: 'q' // always promote to a queen for example simplicity
		});

		// illegal move
		if (move === null) return;
		this.setState({ fen: this.game.fen() });
		window.setTimeout(this.makeRandomMove, 10);
	};

	onSquareClick = square => {
		this.setState({
			pieceSquare: square
		});

		let move = this.game.move({
			from: this.state.pieceSquare,
			to: square,
			promotion: 'q' // always promote to a queen for example simplicity
		});

		// illegal move
		if (move === null) return;

		this.setState({ fen: this.game.fen() });
		window.setTimeout(this.makeRandomMove, 10);
	};

	render() {
		return (
			<div className='screen'>
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
					<Chessboard
						position={this.state.fen}
						onDrop={this.onDrop}
						boardStyle={{
							borderRadius: '5px',
							boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
						}}
						onSquareClick={this.onSquareClick}
						squareStyles={this.state.squareStyles}
						width={400}
					/>
				</div>
			</div>
		);
	}
}

export default App;
