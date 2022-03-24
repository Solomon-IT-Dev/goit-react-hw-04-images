const BASE_URL = 'https://pixabay.com/api/';
const KEY = '24992333-26303cf37c585c2123ccaf94d';
const PER_PAGE = 12;

export default async function findImages(searchQuery, page) {
  const response = await fetch(
    `${BASE_URL}?q=${searchQuery}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`
  );
  return await response.json();
}
