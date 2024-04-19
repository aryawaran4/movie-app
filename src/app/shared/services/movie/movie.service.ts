import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetResponse, FavouriteType, UserFavouriteType, MovieDetailsType, TvDetailsType, GenresType } from '../../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  async trendingMovies(): Promise<GetResponse> {
    try {
      const url = `${this.apiUrl}/trending/all/week?language=en-US`;

      const response = await this.http.get<GetResponse>(url).toPromise();
      if (!response) {
        throw new Error('Response is undefined');
      }
      return response;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  }

  async getMovieDetails(showId: number): Promise<MovieDetailsType> {
    const url = `${this.apiUrl}/movie/${showId}`;
    try {
      const response = await this.http.get<MovieDetailsType>(url).toPromise();
      if (response) {
        return response;
      } else {
        throw new Error('Movie details not found');
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  async getTvDetails(showId: number): Promise<TvDetailsType> {
    const url = `${this.apiUrl}/tv/${showId}`;
    try {
      const response = await this.http.get<TvDetailsType>(url).toPromise();
      if (response) {
        return response;
      } else {
        throw new Error('TV details not found');
      }
    } catch (error) {
      console.error('Error fetching tv details:', error);
      throw error;
    }
  }

  async addFavourite(userId: string, showId: number, mediaType: string): Promise<void> {
    // Retrieve users data from localStorage
    const users = JSON.parse(localStorage.getItem('usersData') || '[]') as UserFavouriteType[];

    // Find the index of the user in the users array
    const userIndex = users.findIndex((u: UserFavouriteType) => u.uuid === userId);

    // If user not found, log an error and return
    if (userIndex === -1) {
      console.error('User not found');
      return;
    }

    // Define variable to hold show details
    let showDetails: MovieDetailsType | TvDetailsType;

    // Fetch show details based on media type
    if (mediaType === 'movie') {
      showDetails = await this.getMovieDetails(showId);
      if (!showDetails) {
        console.error('Movie details not found');
        return;
      }
      // Check if the movie with the specified ID already exists in the user's favorites
      if (users[userIndex].favourites.movies.some(movie => movie.id === showId)) {
        console.error('Movie already exists in favorites');
        return;
      }
      // Push the movie details to the user's favourites
      users[userIndex].favourites.movies.push(showDetails);
    } else if (mediaType === 'tv') {
      showDetails = await this.getTvDetails(showId);
      if (!showDetails) {
        console.error('TV show details not found');
        return;
      }
      // Check if the TV show with the specified ID already exists in the user's favorites
      if (users[userIndex].favourites.tv.some(tv => tv.id === showId)) {
        console.error('TV show already exists in favorites');
        return;
      }
      // Push the TV show details to the user's favourites
      users[userIndex].favourites.tv.push(showDetails);
    } else {
      console.error('Invalid media type');
      return;
    }

    // Update the localStorage with the modified users array
    localStorage.setItem('usersData', JSON.stringify(users));

  }

  async removeFavourite(userId: string, showId: number, mediaType: string): Promise<void> {
    // Retrieve users data from localStorage
    const users = JSON.parse(localStorage.getItem('usersData') || '[]') as UserFavouriteType[];

    // Find the index of the user in the users array
    const userIndex = users.findIndex((u: UserFavouriteType) => u.uuid === userId);

    // If user not found, log an error and return
    if (userIndex === -1) {
      console.error('User not found');
      return;
    }

    // Define variable to hold the index of the show in the user's favourites
    let showIndex: number;

    // Determine the index of the show based on media type
    if (mediaType === 'movie') {
      // Find the index of the movie in the user's favourites
      showIndex = users[userIndex].favourites.movies.findIndex(movie => movie.id === showId);

      // If movie not found in favourites, log an error and return
      if (showIndex === -1) {
        console.error('Movie not found in favorites');
        return;
      }

      // Remove the movie from the user's favourites
      users[userIndex].favourites.movies.splice(showIndex, 1);
    } else if (mediaType === 'tv') {
      // Find the index of the TV show in the user's favourites
      showIndex = users[userIndex].favourites.tv.findIndex(tv => tv.id === showId);

      // If TV show not found in favourites, log an error and return
      if (showIndex === -1) {
        console.error('TV show not found in favorites');
        return;
      }

      // Remove the TV show from the user's favourites
      users[userIndex].favourites.tv.splice(showIndex, 1);
    } else {
      console.error('Invalid media type');
      return;
    }

    // Update the localStorage with the modified users array
    localStorage.setItem('usersData', JSON.stringify(users));

  }

  async GenresList(mediaType: string): Promise<GenresType> {
    const url = `${this.apiUrl}/genre/${mediaType}/list?language=en`;
    try {
      const response = await this.http.get<GenresType>(url).toPromise();
      if (!response) {
        throw new Error('Response is undefined');
      }
      return response;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  }

}
