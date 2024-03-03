import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import validateURL from './helpers/validator.js';
import getParsedXML from './helpers/parser.js';


export default () => {

	const elements = {
		form: document.querySelector('form'),
		input: document.querySelector('#url-input'),
		button: document.querySelector('button[type="submit"]'),
		feedbackContainer: document.querySelector('.feedback'),
		postsContainer: document.querySelector('.posts'),
		feedsContainer: document.querySelector('.feeds'),
		modal: document.querySelector('#modal'),
		spanSpinner: document.createElement('span'),
		spanLoading: document.createElement('span')
	};

	const initialState = {
		rssForm: {
		  state: 'filling',
		  error: null,
		  valid: true
		},
		feeds: [],
		posts: [],
		uiState: {
		  visitedPosts: new Set(),
		  modalId: null
		},
	};

	const i18n = i18next.createInstance();
	i18n.init({
		lng: 'ru',
		debug: true,
		resources: {
			ru
		},
	});

};

