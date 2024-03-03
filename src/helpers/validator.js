import * as yup from 'yup';

export default (url, urlList) => {
	const schema = yup
		.string()
		.required()
		.url()
		.notOneOf(urlList);

	return schema.validate(url);
}