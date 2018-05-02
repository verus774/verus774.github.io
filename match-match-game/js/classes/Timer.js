export default class {
    constructor(timerContainer) {
        this.timerContainer = timerContainer;
        this.gameTime = 0;
    }

    startTimer() {
        this.timerContainer.classList.remove('hidden');
        this.timerContainer.innerText = this.gameTime;

        this.gameInterval = setInterval(() => {
            this.timerContainer.innerText = ++this.gameTime;
        }, 1000);
    }

    resetTimer() {
        this.gameTime = 0;
    }

    stopTimer() {
        this.timerContainer.classList.add('hidden');
        clearInterval(this.gameInterval);
    }
}
