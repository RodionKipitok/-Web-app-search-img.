import axios from "axios";


export default async function fetchImages(searchTerm,page) {

	const url = 'https://pixabay.com/api/';
	const key = '38551841-d8533955233ba15d75df4f404';
	const filter = `?key=${key}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
   
   let response = await axios.get(`${url}${filter}`).then(response => response.data);
   console.log(response.hits);
	return response;
	
};

