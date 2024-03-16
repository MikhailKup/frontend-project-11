import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import getParsedXML from './parser.js';

const flowCheckDelay = 5000;
const axiosTimeout = 10000;

// Validator
const validateURL = (url, urlsList) => {
  const schema = yup
    .string()
    .required()
    .url()
    .notOneOf(urlsList);
  return schema.validate(url)
	.then(() => {})
	.catch((error) => error.message);
};

// Proxy
const proxify = (url, base = 'https://allorigins.hexlet.app/get') => {
  const newUrl = new URL(base);
  const searchUrl = encodeURI(url);
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', searchUrl);
  return newUrl;
};

// Updater
const updatePosts = (watchedState) => {
  const { feeds, posts } = watchedState;
  const promises = feeds.map(({ url, id }) => axios.get(proxify(url), {
		timeout: axiosTimeout
	}).then(({ data }) => {
      const [, receivedPosts] = getParsedXML(data.contents);
      const oldPosts = posts.filter((post) => post.feedId === id);
      const addedPosts = _.differenceBy(receivedPosts, oldPosts, 'link');
      if (addedPosts.length !== 0) {
        const newPosts = addedPosts.map((post) => ({ ...post, id: _.uniqueId(), feedId: id }));
        watchedState.posts = [...newPosts, ...posts];
      }
    })
    .catch(console.error));

  Promise.all(promises)
    .finally(() => setTimeout(() => updatePosts(watchedState), flowCheckDelay));
};

// Errorrs
const getError = (error) => {
	if (axios.isAxiosError(error)) {
		return 'form.errors.networkProblems';
	}
	if (error.NotValidRss) {
		return 'form.errors.notValidRss';
	}
	return 'form.errors.unknownError';
};

export {
  validateURL, proxify, updatePosts, getError
};
