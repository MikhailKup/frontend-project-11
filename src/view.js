import onChange from 'on-change';

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

  divEl.append(ulEl);
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
const renderError = (error, elements, i18n) => {
  elements.feedbackContainer.textContent = '';
  if (error) {
    elements.input.readOnly = false;
    elements.button.disabled = false;
    elements.button.innerHTML = '';
    elements.button.textContent = 'Добавить';
    elements.feedbackContainer.classList.remove('text-success');
    elements.feedbackContainer.classList.add('text-danger');
    elements.input.classList.add('is-invalid');
    elements.feedbackContainer.textContent = i18n.t(error.key);
    return;
  }
  elements.input.classList.remove('is-invalid');
  elements.feedbackContainer.classList.add('text-success');
  elements.feedbackContainer.classList.remove('text-danger');
};

// Modal
const renderModal = (state, postId, elements) => {
  const post = state.posts.find((item) => item.id === postId);
  elements.modal.querySelector('.modal-title').textContent = post.title;
  elements.modal.querySelector('.modal-body').textContent = post.description;
  elements.modal.querySelector('a.btn').href = post.link;
};

// Spinner
const spinnerControl = (elements, i18n, isOn) => {
  if (isOn) {
    elements.button.disabled = true;
    elements.button.innerHTML = '';
    const spanSpinner = document.createElement('span');
    const spanLoading = document.createElement('span');
    spanSpinner.classList.add('spinner-border', 'spinner-border-sm');
    spanSpinner.setAttribute('role', 'status');
    spanSpinner.setAttribute('aria-hidden', 'true');
    elements.button.append(spanSpinner);
    spanLoading.classList.add('sr-only');
    spanLoading.textContent = i18n.t('form.loading');
    elements.button.append(spanLoading);
    return;
  }
  elements.button.disabled = false;
  elements.button.innerHTML = '';
  elements.button.textContent = 'Добавить';
};

const handleProcessState = (state, elements, i18n) => {
  const { loadingProcess } = state;
  switch (loadingProcess.status) {
    case 'loading':
      elements.input.readOnly = true;
      spinnerControl(elements, i18n, true);
      break;
    case 'success':
      elements.input.readOnly = false;
      spinnerControl(elements, i18n, false);
      elements.form.reset();
      elements.form.focus();
      elements.feedbackContainer.classList.remove('text-danger');
      elements.feedbackContainer.classList.add('text-success');
      elements.feedbackContainer.textContent = i18n.t('form.success');
      break;
    case 'failed': {
      const error = { key: loadingProcess.error };
      elements.input.readOnly = false;
      spinnerControl(elements, i18n, false);
      renderError(error, elements, i18n);
      break;
    }
    default:
  }
};

export default (state, elements, i18n) => onChange(state, (path, value) => {
  switch (path) {
    case 'uiState.modalId':
      renderModal(state, value, elements);
      break;
    case 'uiState.visitedPosts':
      renderPosts(state, elements, i18n);
      break;
    case 'feeds':
      renderFeeds(state, elements, i18n);
      break;
    case 'posts':
      renderPosts(state, elements, i18n);
      break;
    case 'rssForm.isValid':
      renderError(state.rssForm.error, elements, i18n);
      break;
    case 'loadingProcess.status':
      handleProcessState(state, elements, i18n);
      break;
    default:
  }
});
