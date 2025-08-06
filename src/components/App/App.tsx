// import { useState } from "react";
// import SearchBar from "../SearchBar/SearchBar";
// import getMovies from "../../services/movieService";
// import Loader from "../Loader/Loader";
// import ErrorMessage from "../ErrorMessage/ErrorMessage";
// import toast, { Toaster } from "react-hot-toast";
// import MovieGrid from "../MovieGrid/MovieGrid";
// import MovieModal from "../MovieModal/MovieModal";
// import type { Movie } from "../../types/movie";
// import css from "./App.module.css";

// import { useQuery } from '@tanstack/react-query'
// import { keepPreviousData } from '@tanstack/react-query'
// import ReactPaginate from 'react-paginate'

// const notify = () => toast.error("No movies found for your request.");

// export default function App() {
//   const [loader, setLoader] = useState(false);
//   const [error, setError] = useState<Error | null>(null);
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [activeMovie, setActiveMovie] = useState<Movie | null>(null);

//   const [page, setPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");


//   const handleSearch = async (userSearch: string) => {
//     setError(null);
//     setLoader(true);
//     setMovies([]);
//     try {
//       const response = await getMovies(userSearch);
//       if (response.length === 0) {
//         setMovies([]);
//         notify();
//       } else {
//         setMovies(response);
//       }
//     } catch (err) {
//       setMovies([]);
//       setError(err as Error);
//       console.error(err);
//     } finally {
//       setLoader(false);
//     }
//   };

//   return (
//     <div className={css.app}>
//       <SearchBar onSubmit={handleSearch} />
//       <MovieGrid
//         movies={movies}
//         onSelect={(movie) => setActiveMovie(movie)}
//       />
//       {activeMovie && (
//         <MovieModal
//           movie={activeMovie}
//           onClose={() => setActiveMovie(null)}
//         />
//       )}
//       {loader && <Loader />}
//       {error && <ErrorMessage />}
//       <Toaster />
//     </div>
//   );
// }




import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import toast, { Toaster } from 'react-hot-toast';
import getMovies from '../../services/movieService';
import type { MoviesResponse } from '../../services/movieService';
import MovieGrid from '../MovieGrid/MovieGrid';
import type { Movie } from '../../types/movie';
import { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => setSelectedMovie(null);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<MoviesResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => getMovies(query, page),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages || 1;

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <MovieGrid onSelect={openModal} movies={data?.results ?? []} />
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}

      <Toaster position="top-center" />
    </div>
  );
}