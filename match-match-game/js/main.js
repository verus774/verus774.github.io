import Game from './classes/Game.js';
import RecordsTable from './classes/RecordsTable.js';
import Utils from './classes/Utils.js';
import Player from './classes/Player.js';

const recordsTable = new RecordsTable(10);
recordsTable.createTable();

Utils.generateRecords(recordsTable);

const settingsForm = document.querySelector('#settingsForm');
settingsForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    const back = this.back.value;
    const count = this.count.value;
    const player = new Player(
        this.firstName.value,
        this.lastName.value,
        this.email.value,
    );

    this.reset();

    const game = new Game(back, count, player, recordsTable);
    game.startGame();
});
