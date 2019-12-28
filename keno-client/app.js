const lastResultDate = document.querySelector('#lastResultDate');
const updateBtn = document.querySelector('button');
const statTable = document.querySelector('tbody');

const URL = 'https://keno-api.herokuapp.com/';

function getLastResultDate() {
    return fetch(`${URL}results/?limit=1`)
        .then(res => res.json())
        .then(res => res[0].date)
        .then(date => new Date(date).toLocaleDateString());
}

function updateResults() {
    return fetch(`${URL}results/add-all`, {method: 'POST'})
        .then(res => res.json());
}

function getStat() {
    return fetch(`${URL}stat`)
        .then(res => res.json())
        .then(stat => stat.map(({ num, count }, idx)  =>
            `
            <tr>
                <td>${idx + 1}</td>
                <td>${num}</td>
                <td>${count}</td>
            </tr>
        `).join(''));
}

(async function() {
    updateBtn.addEventListener('click', async () => {
        updateBtn.disabled = true;
        updateBtn.classList.add('disabled');
        statTable.innerHTML = '';
        lastResultDate.textContent = '...';

        await updateResults();

        lastResultDate.textContent = await getLastResultDate();
        statTable.innerHTML = await getStat();
        updateBtn.disabled = false;
        updateBtn.classList.remove('disabled');
    });

    lastResultDate.textContent = await getLastResultDate();
    statTable.innerHTML = await getStat();
})();
