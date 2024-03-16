import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import {
  validateURL, proxify, updatePosts, getError,
} from './helpers.js';
import getParsedXML from './parser.js';
import ru from './locales/ru.js';
import customErrors from './locales/errors.js';
import initView from './view.js';

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type="submit"]'),
    feedbackContainer: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modal: document.querySelector('#modal'),
  };

  const initialState = {
    loadingProcess: {
      status: 'filling',
      error: '',
    },
    rssForm: {
      status: 'filling',
      error: '',
      isValid: true,
    },
    feeds: [],
    posts: [],
    uiState: {
      visitedPosts: new Set(),
      modalId: null,
    },
  };

  const axiosTimeout = 10000;

  const i18n = i18next.createInstance();
  i18n
    .init({
      lng: 'ru',
      debug: true,
      resources: {
        ru,
      },
    }).then(() => {
      const watchedState = initView(initialState, elements, i18n);
      yup.setLocale(customErrors);

      const loadRSS = (url) => {
        watchedState.loadingProcess.status = 'loading';
        axios.get(proxify(url), {
          timeout: axiosTimeout,
        })
          .then(({ data }) => {
            const [feed, posts] = getParsedXML(data.contents);
            const newFeed = { ...feed, id: _.uniqueId(), url };
            const newPosts = posts.map((post) => (
              { ...post, id: _.uniqueId(), feedId: newFeed.id }));
            watchedState.feeds = [newFeed, ...watchedState.feeds];
            watchedState.posts = [...newPosts, ...watchedState.posts];
            watchedState.loadingProcess.status = 'success';
          })
          .catch((error) => {
            watchedState.loadingProcess.error = getError(error);
            watchedState.loadingProcess.status = 'failed';
          });
      };

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const urlsList = watchedState.feeds.map((feed) => feed.url);
        validateURL(url, urlsList)
          .then((error) => {
            if (error) {
              watchedState.rssForm.error = error;
              watchedState.rssForm.isValid = false;
              return;
            }
            watchedState.rssForm.error = '';
            watchedState.rssForm.isValid = true;
            loadRSS(url);
          });
      });

      elements.postsContainer.addEventListener('click', ({ target }) => {
        if (target.closest('a')) {
          const { id } = target.dataset;
          watchedState.uiState.visitedPosts.add(id);
        }
        if (target.closest('button')) {
          const { id } = target.dataset;
          watchedState.uiState.visitedPosts.add(id);
          watchedState.uiState.modalId = id;
        }
      });
      setTimeout(() => updatePosts(watchedState));
    });
};
