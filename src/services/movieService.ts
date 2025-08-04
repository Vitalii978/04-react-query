import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/search/movie";

export default async function getMovies(searchText: string, page: number = 1): Promise<Movie[]>  {
  const response = await axios.get<MovieSearchResponse>(BASE_URL, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,  
    },
    params: {
      query: searchText,
      include_adult: false,
      language: 'en-US',
      page,
    },
  });

  return response.data.results;
}