import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';

const flowCheckDelay = 5000;

// Validator
const validateURL = (url, urlsList, i18n) => {
  yup.setLocale({
    string: {
      url: i18n.t('form.errors.notValidUrl'),
    },
    mixed: {
      required: i18n.t('form.errors.required'),
      notOneOf: i18n.t('form.errors.notUniqueUrl'),
    },
  });
  const schema = yup
    .string()
    .required()
    .url()
    .notOneOf(urlsList);
  return schema.validate(url);
};


// Proxy
const proxify = (url, base = 'https://allorigins.hexlet.app/get') => {
  const newUrl = new URL(base);
  const searchUrl = encodeURI(url);
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', searchUrl);
  return newUrl;
};


// FetchData
const fetchData = (url) => axios.get(proxify(url), {
  timeout: 10000
});


// Updater
const updatePosts = (watchedState) => {
  const { feeds, posts } = watchedState;
  const promises = feeds.map(({ url, id }) => fetchData(url)
    .then(({ data }) => {
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



export {validateURL, fetchData, updatePosts};