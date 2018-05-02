export default class {
    constructor(count = 10) {
        this.count = count;
        this.recordsContainer = document.querySelector('#records');
        this.records = JSON.parse(localStorage.getItem('recordsTable')) || [];
    }

    save(firstName, score) {
        const isRecordExists = this.records.some(el => {
            return (el.firstName === firstName) && (el.score === score);
        });

        if (!isRecordExists) {
            this.records.push({firstName, score});
            localStorage.setItem('recordsTable', JSON.stringify(this.records));

            this.clearTable();
            this.createTable();
        }
    }

    getTop() {
        return this.records.sort(this.recordsComparator).slice(0, this.count);
    }

    recordsComparator(a, b) {
        return a.score - b.score;
    }

    createTable() {
        const topRecords = this.getTop();

        if (topRecords.length) {
            const table = document.createElement('table');
            const tr = table.insertRow();

            const thIdx = document.createElement('th');
            const thName = document.createElement('th');
            const thScore = document.createElement('th');

            thIdx.textContent = '#';
            thName.textContent = 'First name';
            thScore.textContent = 'Score';

            tr.appendChild(thIdx);
            tr.appendChild(thName);
            tr.appendChild(thScore);

            topRecords.forEach((record, idx) => {
                const tr = table.insertRow();

                const tdIdx = tr.insertCell();
                const tdName = tr.insertCell();
                const tdScore = tr.insertCell();

                tdIdx.textContent = idx + 1;
                tdName.textContent = record.firstName;
                tdScore.textContent = record.score;
            });

            this.recordsContainer.appendChild(table);
        }
    }

    clearTable() {
        Array.from(this.recordsContainer.children).forEach(item => item.remove());
    }
}
