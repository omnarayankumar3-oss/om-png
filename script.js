const search = document.getElementById('search');

search.addEventListener('keyup', function() {
    const value = this.value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(value) ? 'block' : 'none';
    });
});