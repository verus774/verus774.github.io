let puzzles;
const roundTime = 150;
const chartsLimit = 10;

const ctx = document.getElementById('scoreChart');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        responsive: true,
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Puzzle'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }]
        }
    }
});

function getRandomColor() {
    const hexAlphabet = 'ABCDEF0123456789';
    let res = '#';

    for (let i = 0; i < 6; i++) {
        res += hexAlphabet[Math.floor(Math.random() * 16)];
    }
    return res;
}

function getUsers() {
    return fetch('data/users.json').then(res => res.json());
}

function getSessions(demo) {
    return fetch(`data/${demo ? 'sessions-demo' : 'sessions'}.json`).then(res => res.json());
}

function getAllData(demo = false) {
    return Promise.all([
        getUsers(),
        getSessions(demo),
    ])
        .then(data => transformData(data[0], data[1]))
        .then(transformedData => {
            const scoreContainer = document.querySelector('#score');
            return createTable(scoreContainer, transformedData);
        })
        .catch(console.log);
}


function transformData(users, sessions) {
    const res = [];
    puzzles = _.map(sessions.puzzles, 'name');

    chart.data.labels = puzzles;
    chart.data.datasets = [];
    chart.update();

    _.forEach(sessions.rounds, round => {
        _.forEach(round.solutions, (solution, user) => {
            res.push({
                user,
                code: solution.code,
                round: puzzles[round.puzzleIndex.$numberLong],
                time: solution.correct === 'Correct' ? solution.time.$numberLong : roundTime
            });
        });
    });

    const grouped = _.groupBy(res, 'user');
    _.forEach(grouped, (item, key) => {
        item.displayName = _.find(users, {uid: key}).displayName;
    });

    return grouped;
}

function createTable(container, data) {
    Array.from(container.children).forEach(item => item.remove());

    const table = document.createElement('table');
    const tr = table.insertRow();

    const nameCell = document.createElement('th');
    nameCell.textContent = 'Display name';
    tr.appendChild(nameCell);

    _.forEach(puzzles, puzzle => {
        const th = document.createElement('th');
        th.textContent = puzzle;
        tr.appendChild(th);
    });

    const totalCell = document.createElement('th');
    totalCell.textContent = 'Total';
    tr.appendChild(totalCell);

    const comparisonCell = document.createElement('th');
    comparisonCell.textContent = 'Comparison';
    tr.appendChild(comparisonCell);

    _.forEach(data, (solutions, idx) => {
        const tr = table.insertRow();

        const td = document.createElement('td');
        td.textContent = solutions.displayName;
        tr.appendChild(td);

        let total = 0;
        const time = [];
        _.forEach(puzzles, puzzle => {
            const td = document.createElement('td');
            td.textContent = roundTime;

            const solution = _.find(solutions, {round: puzzle});
            if (solution) {
                td.textContent = solution.time;
                time.push(Number(solution.time));
                td.setAttribute('title', solution.code);
            }

            total += Number(td.textContent);
            tr.appendChild(td);
        });

        const totalCell = document.createElement('td');
        totalCell.textContent = total;
        tr.appendChild(totalCell);

        const comparisonCell = document.createElement('td');

        const label = document.createElement('label');
        label.textContent = 'Compare';

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.addEventListener('click', (evt) => {
            let target = evt.target;

            if (target.checked) {
                if (chart.data.datasets.length < chartsLimit) {
                    chart.data.datasets.push({
                        label: solutions.displayName,
                        data: time,
                        backgroundColor: 'transparent',
                        borderColor: getRandomColor()
                    });
                    chart.update();
                } else {
                    target.checked = false;
                }
            } else {
                _.remove(chart.data.datasets, {label: solutions.displayName});
                chart.update();
            }
        });

        label.appendChild(checkBox);
        comparisonCell.appendChild(label);
        tr.appendChild(comparisonCell);
    });

    container.appendChild(table);
}


const isDemo = document.querySelector('#is-demo');
const datasetForm = document.querySelector('#dataset-form');
datasetForm.addEventListener('change', () => getAllData(isDemo.checked));

getAllData(isDemo.checked);
