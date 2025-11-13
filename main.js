// ...existing code...
// Main JS: render events, countdowns, and search. Uses images from "x-images/" folder.

const events = [
    {
        title: "Opening Keynote: The Future of AI",
        type: "Keynote",
        date: "2025-11-20T09:00:00",
        description: "Industry visionary Dr. Evelyn Reed unveils the next decade of AI innovation.",
        image: "x-images/image1.png"
    },
    {
        title: "Advanced JavaScript Workshop",
        type: "Workshop",
        date: "2025-11-20T10:30:00",
        description: "Hands-on deep-dive into asynchronous JavaScript, Promises, and modern ES6+ features.",
        image: "x-images/image2.png"
    },
    {
        title: "Building Scalable Microservices",
        type: "Talk",
        date: "2025-11-20T14:00:00",
        description: "Best practices and architecture patterns for resilient microservices.",
        image: "x-images/image3.png"
    },
    {
        title: "Developer Social & Networking",
        type: "Social",
        date: "2025-11-21T18:00:00",
        description: "Casual networking event with snacks and lightning talks.",
        image: "x-images/image4.png"
    },
    {
        title: "Panel: Ethics in Machine Learning",
        type: "Panel",
        date: "2025-11-22T11:00:00",
        description: "A moderated discussion about fairness, bias, and governance in ML.",
        image: "x-images/image5.png"
    },
    {
        title: "Closing Ceremony & Awards",
        type: "Social",
        date: "2025-11-22T17:30:00",
        description: "Celebrate highlights and announce hackathon winners.",
        image: "x-images/image7.png"
    }
];

// Helpers
function formatEventDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getTypeClass(type) {
    return type.toLowerCase();
}

// Render
function renderEventCards(list) {
    const grid = document.getElementById('event-grid');
    grid.innerHTML = '';

    if (!list.length) {
        const no = document.createElement('div');
        no.className = 'no-results';
        no.textContent = 'No events found.';
        grid.appendChild(no);
        return;
    }

    list.forEach((event, idx) => {
        const card = document.createElement('article');
        card.className = 'event-card';
        card.setAttribute('data-date', event.date);

        const img = document.createElement('img');
        img.alt = event.title;
        // ensure relative path and avoid accidental absolute/leading slashes
        img.src = './' + event.image.replace(/^[./]+/, '');

        // fallback uses image7.jpg (present in x-images) — prevents infinite loop if missing
        img.onerror = function () {
            console.warn('Image failed to load:', this.src);
            this.onerror = null;
            this.src = './x-images/image7.jpg';
        };

        const content = document.createElement('div');
        content.className = 'card-content';

        const title = document.createElement('h2');
        title.className = 'event-title';
        title.textContent = event.title;

        const countdown = document.createElement('div');
        countdown.className = 'event-countdown';
        countdown.id = `countdown-${idx}`;
        countdown.textContent = '';

        const dateEl = document.createElement('div');
        dateEl.className = 'event-date';
        dateEl.textContent = formatEventDate(event.date);

        const desc = document.createElement('p');
        desc.className = 'event-description';
        desc.textContent = event.description;

        const type = document.createElement('span');
        type.className = `event-type ${getTypeClass(event.type)}`;
        type.textContent = event.type;

        content.appendChild(title);
        content.appendChild(countdown);
        content.appendChild(dateEl);
        content.appendChild(desc);
        content.appendChild(type);

        card.appendChild(img);
        card.appendChild(content);
        grid.appendChild(card);
    });

    // Immediately update countdowns once
    updateCountdowns();
}

// Countdown update
function updateCountdowns() {
    const now = Date.now();
    document.querySelectorAll('.event-card').forEach((card, i) => {
        const dateStr = card.getAttribute('data-date');
        const target = new Date(dateStr).getTime();
        const countdownEl = card.querySelector('.event-countdown');

        if (isNaN(target)) {
            countdownEl.textContent = 'Invalid date';
            return;
        }

        const diff = target - now;
        if (diff <= 0) {
            countdownEl.textContent = 'Event has started';
            countdownEl.classList.add('ended');
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        countdownEl.textContent = `${days}d ${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m ${String(seconds).padStart(2,'0')}s`;
        countdownEl.classList.remove('ended');
    });
}

// Search/filter
function setupSearch() {
    const input = document.getElementById('search-bar');
    input.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        const filtered = events.filter(ev => {
            return ev.title.toLowerCase().includes(q) || ev.description.toLowerCase().includes(q) || ev.type.toLowerCase().includes(q);
        });
        renderEventCards(filtered);
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderEventCards(events);
    setupSearch();
    // update every second
    setInterval(updateCountdowns, 1000);
});
// ...existing code...