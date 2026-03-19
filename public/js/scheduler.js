let bookedAppointments = [];
let currentLawyerId = 1;

document.addEventListener('DOMContentLoaded', () => {
    initScheduler();
});

async function initScheduler() {
    if (typeof LAWYER_ID !== 'undefined' && LAWYER_ID !== '') {
        currentLawyerId = LAWYER_ID;
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const paramId = urlParams.get('lawyerId');
        if (paramId) currentLawyerId = paramId;
    }

    try {
        await fetchAppointments();
        renderDates();
    } catch (err) {
        console.error("Eroare la inițializare scheduler:", err);
    }
}

async function fetchAppointments() {
    try {
        const response = await fetch('/api/appointments');
        const result = await response.json();

        if (Array.isArray(result)) {
            bookedAppointments = result;
        } else if (result.data) {
            bookedAppointments = result.data;
        } else {
            bookedAppointments = [];
        }
    } catch (err) {
        console.error('Error fetching appointments:', err);
        bookedAppointments = [];
    }
}

function renderDates() {
    const datesContainer = document.getElementById('dates-grid');
    if (!datesContainer) return;

    const today = new Date();
    const days = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];

    datesContainer.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);

        const dayName = days[d.getDay()];
        const dateNum = d.getDate();

        const div = document.createElement('div');
        div.className = `date-card ${i === 0 ? 'active' : ''}`;
        div.innerHTML = `
            <span class="date-day">${dayName}</span>
            <span class="date-num">${dateNum}</span>
        `;
        div.onclick = () => selectDate(div, d);
        datesContainer.appendChild(div);

        if (i === 0) renderSlots(d);
    }
}

function selectDate(element, dateObj) {
    document.querySelectorAll('.date-card').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    renderSlots(dateObj);
}

function renderSlots(dateObj) {
    const slotsContainer = document.getElementById('slots-grid');
    slotsContainer.innerHTML = '';

    const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

    if (isWeekend) {
        slotsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Nu sunt programări în weekend.</p>';
        return;
    }

    const dateStr = dateObj.toLocaleDateString('ro-RO');

    times.forEach(time => {
        const slotString = `${dateStr} la ora ${time}`;

        const isBooked = bookedAppointments.some(appt =>
            String(appt.lawyer_id) === String(currentLawyerId) &&
            appt.appointment_date === slotString
        );

        const btn = document.createElement('button');
        btn.className = `time-slot ${isBooked ? 'booked' : ''}`;
        btn.innerText = time;

        if (!isBooked) {
            btn.onclick = () => openBookingModal(time, dateObj);
        } else {
            btn.disabled = true;
            btn.title = "Deja ocupat";
        }

        slotsContainer.appendChild(btn);
    });
}

function openBookingModal(time, dateObj) {
    const dateStr = dateObj.toLocaleDateString('ro-RO');
    document.getElementById('modal-time-display').innerText = `${dateStr} la ora ${time}`;
    document.getElementById('booking-modal').style.display = 'flex';
}

function closeBookingModal() {
    document.getElementById('booking-modal').style.display = 'none';
}

async function submitBooking(e) {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector('button');
    const originalText = btn.innerText;

    const name = form.querySelector('input[name="name"]').value;
    const phone = form.querySelector('input[name="phone"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const desc = form.querySelector('textarea[name="description"]').value;
    const appointmentDate = document.getElementById('modal-time-display').innerText;

    btn.innerText = "Se trimite...";
    btn.disabled = true;

    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                phone,
                email,
                description: desc,
                lawyer_id: currentLawyerId,
                appointment_date: appointmentDate
            }),
        });

        if (!response.ok) throw new Error(`Eroare HTTP! Status: ${response.status}`);

        await response.json();

        closeBookingModal();
        form.reset();
        location.reload();

    } catch (error) {
        console.error('Error:', error);
        alert("A apărut o eroare la salvarea programării. Verificați conexiunea sau încercați din nou.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

window.onclick = function (event) {
    const modal = document.getElementById('booking-modal');
    if (event.target == modal) closeBookingModal();
};

