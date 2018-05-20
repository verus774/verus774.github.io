let puzzles;
const roundTime = 150;

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

    _.forEach(data, (solutions, idx) => {
        const tr = table.insertRow();

        const td = document.createElement('td');
        td.textContent = solutions.displayName;
        tr.appendChild(td);

        let total = 0;
        _.forEach(puzzles, puzzle => {
            const td = document.createElement('td');
            td.textContent = roundTime;

            const solution =_.find(solutions, {round: puzzle});
            if(solution) {
                td.textContent = solution.time;
                td.setAttribute('title', solution.code);
            }

            total += Number(td.textContent);
            tr.appendChild(td);
        });

        const totalCell = document.createElement('td');
        totalCell.textContent = total;
        tr.appendChild(totalCell);
    });

    container.appendChild(table);
}


const isDemo = document.querySelector('#is-demo');
const datasetForm = document.querySelector('#dataset-form');
datasetForm.addEventListener('change', () => getAllData(isDemo.checked));

getAllData(isDemo.checked);
