class Game {

    constructor() {

        this.fields = document.querySelectorAll('.field');
        this.fields.forEach(field => {
            field.addEventListener('click', this.handleFieldClick.bind(this))
        })
    }

    handleFieldClick(event) {

        const index = event.target.id;

        if (!this.board[index]) {
            this.setFieldValue(index, this.actual);
            this.renderBoard();
            this.changePlayer();

            if (this.checkWin()) {
                alert('Winner: ' + this.winner);
                this.initGame();
            }
            else if (this.checkFullBoard()) {
                alert('Draw!');
                this.initGame();
            }
        }
        else {
            alert('This move is incorrect');
        }

    }

    checkFullBoard() {
        return this.board.indexOf('') === -1;
    }

    setFieldValue(index, value) {
        this.board[index] = value;
    }

    changePlayer() {
        this.actual = this.actual === 'O' ? 'X' : 'O';
    }

    initGame() {

        this.actual = this.randomPlayer();
        this.winner = null;
        this.board = new Array(9).fill('');

        this.renderBoard();
    }

    randomPlayer() {
        return Math.floor(Math.random() * 10) % 2 ? 'X' : 'O';
    }

    renderBoard() {

        this.fields.forEach((field, index) => {
            field.innerText = this.board[index];
        })
    }

    checkWin() {

        const board = this.board;

        //Horizontal
        for (let i = 0; i < 3; i++) {
            if (this.check3equals(board[i * 3], board[i * 3 + 1], board[i * 3 + 2])) {
                this.winner = board[i * 3];
                return true;
            }
        }

        //Vertical
        for (let i = 0; i < 3; i++) {
            if (this.check3equals(board[i], board[i + 3], board[i + 6])) {
                this.winner = board[i];
                return true;
            }
        }

        //Diagonal
        if (this.check3equals(board[0], board[4], board[8])) {
            this.winner = board[0];
            return true;
        }

        if (this.check3equals(board[2], board[4], board[6])) {
            this.winner = board[0];
            return true;
        }
    }

    check3equals(a, b, c) {
        return !!a && a === b && b === c && a === c;
    }
}

window.addEventListener('load', () => {

    const game = new Game();

    game.initGame();
})