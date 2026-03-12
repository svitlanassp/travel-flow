const MEDIA_BASE = 'http://127.0.0.1:8000';

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' });
}

function calcProgressPercent(spent, budget) {
    if (!budget || budget <= 0) return 0;
    return Math.min(Math.round((spent / budget) * 100), 100);
}

function renderTripCard(trip) {
    const imgSrc = trip.cover_image
        ? `${MEDIA_BASE}${trip.cover_image}`
        : 'images/paris.jpg';
    const spent = parseFloat(trip.total_spent || 0).toFixed(2);
    const budget = parseFloat(trip.total_budget || 0).toFixed(2);
    const percent = calcProgressPercent(spent, budget);

    return `
        <article class="trip-card">
            <a href="trip-calendar.html?id=${trip.id}" class="stretched-link"></a>
            <div class="trip-image-placeholder">
                <img src="${imgSrc}" alt="${trip.title}">
            </div>
            <div class="trip-info">
                <h2 class="trip-title">${trip.title}</h2>
                <p class="trip-location">${trip.city || ''}, ${trip.country || ''}</p>
                <p class="trip-dates">${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}</p>
                <div class="budget-progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percent}%;"></div>
                    </div>
                    <div class="budget-footer">
                        <span class="budget-amount">$${spent} / $${budget}</span>
                        <div class="actions-group">
                            <button class="action-btn btn-edit-trip" data-id="${trip.id}" data-title="${trip.title}" data-country="${trip.country || ''}" data-city="${trip.city || ''}" data-start="${trip.start_date}" data-end="${trip.end_date}" data-budget="${trip.total_budget}">
                                <img src="icons/edit.svg" alt="Edit">
                            </button>
                            <button class="action-btn btn-delete-trip" data-id="${trip.id}">
                                <img src="icons/delete.svg" alt="Delete">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function renderTrips(trips) {
    const grid = document.getElementById('trips-grid');
    if (trips.length === 0) {
        grid.innerHTML = '<p>No trips yet. Add your first one!</p>';
        return;
    }
    grid.innerHTML = trips.map(renderTripCard).join('');
}

async function loadTrips() {
    const trips = await api.getTrips();
    renderTrips(trips);
}

function openModal() {
    document.getElementById('trip-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('trip-modal').style.display = 'none';
    document.getElementById('add-trip-form').reset();
}

async function handleAddTrip(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('trip-title').value);
    formData.append('country', document.getElementById('trip-country').value);
    formData.append('city', document.getElementById('trip-city').value);
    formData.append('start_date', document.getElementById('trip-start').value);
    formData.append('end_date', document.getElementById('trip-end').value);
    formData.append('total_budget', parseFloat(document.getElementById('trip-budget').value) || 0);

    const photoFile = document.getElementById('trip-photo').files[0];
    if (photoFile) {
        formData.append('cover_image', photoFile);
    }
    await api.createTrip(formData);
    closeModal();
    await loadTrips();
}

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('btn-open-modal').addEventListener('click', openModal);
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('add-trip-form').addEventListener('submit', handleAddTrip);

    document.getElementById('btn-close-edit-modal').addEventListener('click', closeEditModal);
    document.getElementById('edit-trip-form').addEventListener('submit', handleEditTrip);

    document.getElementById('btn-close-delete-modal').addEventListener('click', closeDeleteModal);
    document.getElementById('btn-confirm-delete').addEventListener('click', handleDeleteTrip);

    document.getElementById('trips-grid').addEventListener('click', (e) => {
        const editBtn = e.target.closest('.btn-edit-trip');
        const deleteBtn = e.target.closest('.btn-delete-trip');
        if (editBtn) {
            e.preventDefault();
            openEditModal(editBtn);
        }
        if (deleteBtn) {
            e.preventDefault();
            openDeleteModal(deleteBtn);
        }
    });

    loadTrips();
});

let currentEditId = null;
let currentDeleteId = null;

function openEditModal(btn) {
    currentEditId = btn.dataset.id;
    document.getElementById('edit-trip-title').value = btn.dataset.title;
    document.getElementById('edit-trip-country').value = btn.dataset.country;
    document.getElementById('edit-trip-city').value = btn.dataset.city;
    document.getElementById('edit-trip-start').value = btn.dataset.start;
    document.getElementById('edit-trip-end').value = btn.dataset.end;
    document.getElementById('edit-trip-budget').value = btn.dataset.budget;
    document.getElementById('edit-trip-modal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('edit-trip-modal').style.display = 'none';
    document.getElementById('edit-trip-form').reset();
    currentEditId = null;
}

function openDeleteModal(btn) {
    currentDeleteId = btn.dataset.id;
    document.getElementById('delete-trip-modal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('delete-trip-modal').style.display = 'none';
    currentDeleteId = null;
}

async function handleEditTrip(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('edit-trip-title').value);
    formData.append('country', document.getElementById('edit-trip-country').value);
    formData.append('city', document.getElementById('edit-trip-city').value);
    formData.append('start_date', document.getElementById('edit-trip-start').value);
    formData.append('end_date', document.getElementById('edit-trip-end').value);
    formData.append('total_budget', parseFloat(document.getElementById('edit-trip-budget').value) || 0);
    const photoFile = document.getElementById('edit-trip-photo').files[0];
    if(photoFile) {
        formData.append('cover_image', photoFile);
    }
    await api.updateTrip(currentEditId, formData);
    closeEditModal();
    await loadTrips();
}

async function handleDeleteTrip() {
    await api.deleteTrip(currentDeleteId);
    closeDeleteModal();
    await loadTrips();
}