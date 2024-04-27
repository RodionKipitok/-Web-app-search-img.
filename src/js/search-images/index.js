import axios from 'axios';
import fetchImages from './fetch-img';

import { Notify } from 'notiflix';

// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

const saerchInput = document.querySelector('input');
const searchButton = document.querySelector('button');
const loadMorebtn = document.querySelector('.load-more');
const containerImgescard = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');

function renderImagescard(arr) {
  const markup = arr
    .map(item => {
      return `<div class="photo-card">
		<a href="${item.webformatURL}">
		<img src="${item.largeImageURL}" alt="${item.tags}" loading="lazy" class="card__img" />
		</a>
		<div class="container__card__text">
		 <div class = "headings__card--wrapper">
		 <p class='headings__info-text'>Likes</p>
		 <p class='headings__info-text'>Views</p>
		 <p class='headings__info-text'>Comments</p>
		 <p class='headings__info-text'>Downloads</p>
		 </div>
		 <div class= 'subtitle__card--wrapper'>
		 <p class="subtitle__info-text"> ${item.likes}</p>
		 <p class="subtitle__info-text"> ${item.views} </p>
		 <p class="subtitle__info-text">	${item.comments} </p>
		 <p class="subtitle__info-text">${item.downloads} </p>
		 </div>
		</div>
	 </div>`;
    })
    .join(' ');

  containerImgescard.insertAdjacentHTML('beforeend', markup);
}

const lightbox = new SimpleLightbox('.photo-card  a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', onSubmitsearchForm);

async function onSubmitsearchForm(event) {
  event.preventDefault();

  searchQuery = event.currentTarget.searchQuery.value;
  currentPage = 1;

  const response = await fetchImages(searchQuery, currentPage);
  currentHits = response.hits.length;

  console.log(searchQuery);

  if (searchQuery === '') {
    return;
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      containerImgescard.innerHTML = '';
      renderImagescard(response.hits);
      lightbox.refresh();
      loadMorebtn.style.display = 'block';
    }

    if (response.totalHits === 0) {
      containerImgescard.innerHTML = '';
      Notify.info(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      loadMorebtn.style.display = 'none';
    }
  } catch (error) {
    console.log(error);
  }
}

loadMorebtn.addEventListener('click', onClickloadMorebtn);

async function onClickloadMorebtn() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  renderImagescard(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    loadMorebtn.style.display = 'none';
  }
}

const btnTop = document.getElementById('myBtn');

console.log(btnTop);

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById('myBtn').style.display = 'block';
  } else {
    document.getElementById('myBtn').style.display = 'none';
  }
}

btnTop.addEventListener('click', topFunction);

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
