import Card from './Card.js';
import Timer from './Timer.js';
import Utils from './Utils.js';

export default class {
    constructor(back, count, player, recordsTable) {
        this.back = back;
        this.count = count;
        this.player = player;
        this.recordsTable = recordsTable;

        this.selectedCards = [];

        this.board = document.querySelector('#board');
        this.timer = new Timer(document.querySelector('#timer'));
        this.settings = document.querySelector('#settings');
    }

    fillCards(back, count) {
        if (count % 2 !== 0) throw 'Card count error';

        this.cards = [];

        for (let i = 0; i < count / 2; i++) {
            const card1 = new Card(i, back);
            const card2 = new Card(i, back);
            this.cards.push(card1, card2);
        }

        Utils.shuffleArray(this.cards);

        for (const card of this.cards) {
            this.board.appendChild(card.createCard());
        }
    }

    clearBoard() {
        Array.from(this.board.children).forEach(item => item.remove());
        this.board.removeEventListener('click', this.openCardHandler);
    }

    openCardHandler(evt) {
        if (this.selectedCards.length === 2) {
            return;
        }

        let target = evt.target;

        while (target !== this.board) {
            if (target.className === 'card') {
                target.classList.add('show-card');
                this.selectedCards.push(target);
                break;
            }

            target = target.parentNode;
        }

        if (this.selectedCards.length === 2) {
            setTimeout(this.compareCards.bind(this), 500, this.selectedCards[0], this.selectedCards[1]);
        }
    }

    compareCards(firstCard, secondCard) {
        const firstCardImg = firstCard.querySelector('img.front').src;
        const secondCardImg = secondCard.querySelector('img.front').src;

        if (firstCardImg === secondCardImg) {
            this.removeCards();
        } else {
            this.closeCards();
        }

        this.selectedCards = [];

        if (this.isFinished()) {
            setTimeout(this.finishGame.bind(this), 500);
        }
    }

    closeCards() {
        this.selectedCards[0].classList.remove('show-card');
        this.selectedCards[1].classList.remove('show-card');
    }

    removeCards() {
        this.selectedCards[0].classList.add('remove-card');
        this.selectedCards[1].classList.add('remove-card');
    }

    isFinished() {
        const cards = this.cards;
        const removedCards = this.board.querySelectorAll('.remove-card');

        return cards.length === removedCards.length;
    }

    finishGame() {
        this.timer.stopTimer();
        this.clearBoard();

        const score = this.timer.gameTime;
        this.player.score.push(score);

        const tryAgain = confirm(`
            Your time: ${score} seconds
            Try again?
        `);

        if (tryAgain) {
            this.startGame();
        } else {
            alert(`Best result: ${this.player.bestScore} seconds`);
            this.recordsTable.save(this.player.firstName, this.player.bestScore);
            this.settings.classList.remove('hidden');
        }
    }

    startGame() {
        this.settings.classList.add('hidden');
        this.fillCards(this.back, this.count);

        this.openCardHandler = this.openCardHandler.bind(this);
        this.board.addEventListener('click', this.openCardHandler);

        this.timer.resetTimer();
        this.timer.startTimer();
    }

}
