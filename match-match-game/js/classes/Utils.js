export default class {
    static shuffleArray(arr) {
        arr.sort(() => Math.random() - 0.5);
    }

    static generateRecords(recordsTable) {
        if(!localStorage.getItem('recordsTable')) {
            for (let i = 0; i < 10; i++) {
                recordsTable.save(`Player ${i + 1}`, i + 40);
            }
        }

    }
}
