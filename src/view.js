import onChange from "on-change";

// Feeds
const renderFeeds = (state, elements, i18n) => {
	elements.feedsContainer.innerHTML = '';

	const divEl = document.createElement('div');
	divEl.classList.add('card', 'border-0');
	elements.feedsContainer.append(divEl);

	const divTitleEl = document.createElement('div');
	divTitleEl.classList.add('card-body');
	divEl.append(divTitleEl);

	const h2El = document.createElement('h2');
	h2El.classList.add('card-title', 'h4');
	h2El.textContent = i18n.t('feeds.title');
	divTitleEl.append(h2El);

	const ulEl = document.createElement('ul');
	ulEl.classList.add('list-group', 'border-0', 'rounded-0');

	state.feeds.forEach((feed) => {
		const liEl = document.createElement('li');
		liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
  
		const h3El = document.createElement('h3');
		h3El.classList.add('h6', 'm-0');
		h3El.textContent = feed.title;
		liEl.append(h3El);
  
		const pEl = document.createElement('p');
		pEl.classList.add('m-0', 'small', 'text-black-50');
		pEl.textContent = feed.description;
		liEl.append(pEl);
  
		ulEl.prepend(liEl);
	});
};

// Posts