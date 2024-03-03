export default (xml) => {
	const parsedXML = new DOMParser().parseFromString(xml, 'text/xml');
	const parseError = parsedXML.querySelector('parsererror');
	if (parseError) {
		const textError = parseError.textContent;
		const error = new Error(textError);
		error.notValidRss = true;
		throw error;
	}

	const feed = {
		title: parsedXML.querySelector('channel title').textContent,
		description: parsedXML.querySelector('channel description').textContent,
	};

	const postsArr = Array.from(parsedXML.querySelectorAll('item'));
	const posts = postsArr.map((post) => (
		{
			title: post.querySelector('title').textContent,
        	description: post.querySelector('description').textContent,
        	link: post.querySelector('link').textContent,
		}
	));
	return [feed, posts];
}