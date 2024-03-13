import i18next from 'i18next';

export default {
  string: {
		url: i18next.t('form.errors.notValidUrl'),
	},
	mixed: {
		required: i18next.t('form.errors.required'),
		notOneOf: i18next.t('form.errors.notUniqueUrl')
	}
};