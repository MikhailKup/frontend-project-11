import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';


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

};

