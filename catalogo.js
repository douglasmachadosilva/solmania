(() => {
  const cards = [...document.querySelectorAll('.product-card')];
  const search = document.querySelector('#product-search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  let category = 'Todos';
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  function applyFilters() {
    const words = normalize(search.value).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      const visible = (category === 'Todos' || card.dataset.category === category) && words.every(word => normalize(card.dataset.search).includes(word));
      card.hidden = !visible;
      if (visible) count++;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    document.querySelector('#result-count').textContent = `${count} ${count === 1 ? 'modelo encontrado' : 'modelos encontrados'}`;
    document.querySelector('.empty-state').hidden = count !== 0;
  }
  document.querySelector('.catalog-tools').hidden = false;
  filters.forEach(button => button.addEventListener('click', () => {category = button.dataset.filter; applyFilters();}));
  search.addEventListener('input', applyFilters);
  document.querySelector('#reset-filters').addEventListener('click', () => {category = 'Todos'; search.value = ''; applyFilters(); search.focus();});
  function revealLinkedPiece() {
    const card = cards.find(item => '#' + item.id === location.hash);
    if (card) {
      category = 'Todos'; search.value = ''; applyFilters();
      requestAnimationFrame(() => card.scrollIntoView({block:'start', behavior:'instant'}));
    }
  }
  window.addEventListener('hashchange', revealLinkedPiece);
  applyFilters(); revealLinkedPiece();
  const dialog = document.querySelector('.photo-dialog');
  let photos = [], photoIndex = 0, opener;
  function showPhoto() {
    const img = dialog.querySelector('.expanded-photo');
    img.src = 'assets/produtos/' + photos[photoIndex];
    img.alt = dialog.querySelector('#photo-title').textContent + ` — foto ${photoIndex + 1}`;
    dialog.querySelector('.photo-count').textContent = `${photoIndex + 1} / ${photos.length}`;
    dialog.querySelector('.photo-prev').disabled = photoIndex === 0;
    dialog.querySelector('.photo-next').disabled = photoIndex === photos.length - 1;
  }
  document.querySelectorAll('.product-photo').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.product-card'); opener = button;
    photos = JSON.parse(button.dataset.photos); photoIndex = 0;
    dialog.querySelector('#photo-title').textContent = card.querySelector('h2').textContent + ' · ' + card.querySelector('.product-ref').textContent;
    dialog.querySelector('.photo-contact').href = card.querySelector('.product-contact').href;
    showPhoto(); dialog.showModal(); document.body.classList.add('photo-open');
  }));
  dialog.querySelector('.photo-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) {const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();} });
  dialog.addEventListener('close', () => {document.body.classList.remove('photo-open'); opener?.focus();});
  dialog.querySelector('.photo-prev').addEventListener('click', () => {if (photoIndex > 0) {photoIndex--; showPhoto();}});
  dialog.querySelector('.photo-next').addEventListener('click', () => {if (photoIndex < photos.length - 1) {photoIndex++; showPhoto();}});
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && photoIndex > 0) {photoIndex--; showPhoto();}
    if (event.key === 'ArrowRight' && photoIndex < photos.length - 1) {photoIndex++; showPhoto();}
  });
})();
