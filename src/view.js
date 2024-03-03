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
const renderPosts = (state, elements, i18n) => {
	elements.postsContainer.innerHTML = '';

	const divEl = document.createElement('div');
	divEl.classList.add('card', 'border-0');
	elements.postsContainer.prepend(divEl);

	const divTitleEl = document.createElement('div');
	divTitleEl.classList.add('card-body');
	divEl.append(divTitleEl);

	const h2El = document.createElement('h2');
	h2El.classList.add('card-title', 'h4');
	h2El.textContent = i18n.t('posts.title');
	divTitleEl.prepend(h2El);

	const ulEl = document.createElement('ul');
  	ulEl.classList.add('list-group', 'border-0', 'rounded-0');

	state.posts.forEach(({ id, title, link }) => {
		const classes = state.uiState.visitedPosts.has(id) ? 'fw-normal link-secondary' : 'fw-bold';

		const liEl = document.createElement('li');
		liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

		const aEl = document.createElement('a');
		aEl.setAttribute('class', classes);
		aEl.setAttribute('href', link);
		aEl.dataset.id = id;
		aEl.setAttribute('target', '_blank');
		aEl.setAttribute('rel', 'noopener noreferrer');
		aEl.textContent = title;
		liEl.append(aEl);

		const buttonEl = document.createElement('button');
		buttonEl.setAttribute('type', 'button');
		buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
		buttonEl.dataset.id = id;
		buttonEl.dataset.bsToggle = 'modal';
		buttonEl.dataset.bsTarget = '#modal';
		buttonEl.textContent = i18n.t('posts.button');
		liEl.append(buttonEl);

		ulEl.append(liEl);
	});

	divEl.append(ulEl);
};

// Errors
const renderErrors = (error, elements, i18n) => {
	elements.feedbackContainer.textContent = '';
	if (error) {
		elements.input.readOnly = false;
		elements.button.disabled = false;
		elements.button.innerHTML = '';
		elements.button.textContent = 'Добавить';
		elements.feedbackContainer.classList.remove('text-success');
		elements.feedbackContainer.classList.add('text-danger');
		elements.feedbackContainer.textContent = i18n.t(error);
	}
};