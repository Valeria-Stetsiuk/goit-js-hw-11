import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox'; // Описаний в документації
import 'simplelightbox/dist/simple-lightbox.min.css'; // Додатковий імпорт стилів
import { SearchThings } from './js/fetchSearch';

const search = new SearchThings();
const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});

const formForSearch = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');

formForSearch.addEventListener('submit', onSearchForm);
moreBtn.addEventListener('click', onSubmitMore);
function onSearchForm(evt) {
  evt.preventDefault();
  moreBtn.classList.add('is-hidden');
  gallery.innerHTML = '';

  const requery = evt.target.elements.searchQuery.value.trim();

  if (requery === '') {
    return;
  }
  search.setPage();
  search
    .getImage(requery)
    .then(gallery => {
      const { totalHits, hits } = gallery.data;
      if (!hits.length) {
        throw new Error(alertWrong());
      }
      createImage(hits);
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      search.increasePage();
      moreBtn.classList.remove('is-hidden');
    })
    .catch(err => console.log(err));

  formForSearch.reset();
}

function onSubmitMore() {
  search
    .getImage()
    .then(gallery => {
      const { totalHits, hits } = gallery.data;
      createImage(hits);
      search.increasePage();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      const {
        params: { page, per_page },
      } = search;
      if (page > totalHits / per_page) {
        moreBtn.classList.add('is-hidden');
        throw new Error(alerTheEnd());
      }
    })
    .catch(err => console.log(err));
}

function createImage(arr) {
  const listOfGallery = arr
    .map(arr => {
      return `
      <a class="gallery-link" href="${arr.largeImageURL}">
          <div class="photo-card">
  <img class="gallery-image" src="${arr.webformatURL}" alt="${arr.tags}" loading="lazy" /> </div>
  <div class="info">
    <p class="info-item">
      <b>♥</b>${arr.likes}
    </p>
    <p class="info-item">
      <b>👁‍🗨</b>${arr.views}
    </p>
    <p class="info-item">
      <b>💬</b>${arr.comments}
    </p>
    <p class="info-item">
      <b>🔄</b>${arr.downloads}
    </p>
 
</div></a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', listOfGallery);
  lightbox.refresh();
}
function alertWrong() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
function alerTheEnd() {
  Notiflix.Notify.info(
    'We are sorry, but you have reached the end of search results.'
  );
}

