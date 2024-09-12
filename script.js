let soldiers = JSON.parse(localStorage.getItem('soldiers')) || [];
// מיקום החייל(כעת אין כמובן)
let editIndex = null;
//משתנה בשביל מיון החיילים
let sortAsc = true;

document.getElementById('soldierForm').addEventListener('submit', addSoldier);
document.getElementById('editForm').addEventListener('submit', saveEdit);
document.getElementById('cancelEdit').addEventListener('click', showHomeSection);
document.getElementById('sortBtn').addEventListener('click', sortSoldiers);

function addSoldier(e) {
    e.preventDefault();
    const soldier = {
        fullName: document.getElementById('fullName').value,
        rank: document.getElementById('rank').value,
        position: document.getElementById('position').value,
        platoon: document.getElementById('platoon').value,
        status: document.getElementById('status').value,
        missionTime: document.getElementById('missionTime').value
    };
    soldiers.push(soldier);
    localStorage.setItem('soldiers', JSON.stringify(soldiers));
    renderTable();
    document.getElementById('soldierForm').reset();
}

function renderTable() {
    const tbody = document.querySelector('#soldiersTable tbody');
    tbody.innerHTML = '';
    soldiers.forEach((soldier, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${soldier.fullName}</td>
            <td>${soldier.rank}</td>
            <td>${soldier.position}</td>
            <td>${soldier.platoon}</td>
            <td>${soldier.status}</td>
            <td>
                ${soldier.status === 'Active' || soldier.status === 'Reserve' ? 
                    `<button data-index="${index}" onclick="startMission(this)">Mission</button>` : 
                    ''}
                <button data-index="${index}" onclick="editSoldier(this)">Edit</button>
                <button data-index="${index}" onclick="deleteSoldier(this)">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
//עריכת פרטי החייל הקפצה של הפופאפ
function editSoldier(button) {
    editIndex = button.getAttribute('data-index');
    const soldier = soldiers[editIndex];
    document.getElementById('editFullName').value = soldier.fullName;
    document.getElementById('editRank').value = soldier.rank;
    document.getElementById('editPosition').value = soldier.position;
    document.getElementById('editPlatoon').value = soldier.platoon;
    document.getElementById('editStatus').value = soldier.status;
    document.getElementById('editMissionTime').value = soldier.missionTime;
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('edit-section').style.display = 'block';
}
//שמירת השינויים בלוקל סטורג וחזרה לסקשן הבית
function saveEdit(e) {
    e.preventDefault();
    const soldier = {
        fullName: document.getElementById('editFullName').value,
        rank: document.getElementById('editRank').value,
        position: document.getElementById('editPosition').value,
        platoon: document.getElementById('editPlatoon').value,
        status: document.getElementById('editStatus').value,
        missionTime: document.getElementById('editMissionTime').value
    };
    soldiers[editIndex] = soldier;
    localStorage.setItem('soldiers', JSON.stringify(soldiers));
    renderTable();
    showHomeSection();
}
//מחיקה להלוקל סטורג
function deleteSoldier(button) {
    const index = button.getAttribute('data-index');
    soldiers.splice(index, 1);
    localStorage.setItem('soldiers', JSON.stringify(soldiers));
    renderTable();
}
//מיון לפי סדר שימוש עם מתודה שמשווה מחרוזות לפי סדק השפה
function sortSoldiers() {
    soldiers.sort((a, b) => sortAsc ? a.fullName.localeCompare(b.fullName) : b.fullName.localeCompare(a.fullName));
    sortAsc = !sortAsc;
    renderTable();
}
//פונקציה האחראית על הסקשנים
function showHomeSection() {
    document.getElementById('home-section').style.display = 'block';
    document.getElementById('edit-section').style.display = 'none';
}
//פונקציה של משימות עם טיימר רק עם החייל פעיל או במילואים
function startMission(button) {
    const index = button.getAttribute('data-index');
    const soldier = soldiers[index];
    if (soldier.status === 'Active' || soldier.status === 'Reserve') {
        let missionTime = soldier.missionTime;
        button.disabled = true;
        button.textContent = `${missionTime} seconds remaining`;
        let timer = setInterval(() => {
            missionTime--;
            button.textContent = `${missionTime} seconds remaining`;
            if (missionTime < 0) {
                clearInterval(timer);
                button.textContent = 'Mission Completed';
            }
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});
