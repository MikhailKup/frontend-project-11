export default (url) => {
	const proxy = 'https://allorigins.hexlet.app/get';
	const proxyUrl = new URL(proxy);
	proxyUrl.searchParams.set('url', url);
	proxyUrl.searchParams.set('disableCache', 'true');
	return proxyUrl.href;
}