import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DiscoverResponse, FavouriteType, UserFavouriteType } from '../../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NTRkZmM5MmQ2MzBjYmU4NjRhMzllMWU3NmJjYzdlNSIsInN1YiI6IjYxNmU4YzMzMTA4OWJhMDA0NGM2NzU0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P3DryXumKOqJdhTMRDQN7MEhsIilwlhYbNIF710Q6VQ'; // Replace with your actual API key

  private options = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${this.apiKey}`
    }
  };

  constructor(private http: HttpClient) { }

  async discoverMovies(): Promise<DiscoverResponse> {
    try {
      const url = `${this.apiUrl}/discover/movie?language=en-US&page=1&sort_by=popularity.desc`;

      const response = await this.http.get<DiscoverResponse>(url, this.options).toPromise();
      if (!response) {
        throw new Error('Response is undefined');
      }
      return response;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  }

  async getMovieDetails(movieId: number): Promise<FavouriteType> {
    const url = `${this.apiUrl}/movie/${movieId}`;
    try {
      const response = await this.http.get<FavouriteType>(url, this.options).toPromise();
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

  async addFavouriteMovie(userId: string, movieId: number): Promise<void> {
    const users = JSON.parse(localStorage.getItem('usersData') || '[]') as UserFavouriteType[];
    const userIndex = users.findIndex((u: UserFavouriteType) => u.uuid === userId);

    if (userIndex === -1) {
      console.error('User not found');
      return;
    }

    const movieDetails = await this.getMovieDetails(movieId);
    if (!movieDetails) {
      console.error('Movie details not found');
      return;
    }

    // Check if the movie with the specified ID already exists in the user's favorites
    if (users[userIndex].favourites.some(movie => movie.id === movieId)) {
      console.error('Movie already exists in favorites');
      return;
    }

    // Push the movie details to the user's favourite array
    users[userIndex].favourites.push(movieDetails);

    // Update the localStorage with the modified users array
    localStorage.setItem('usersData', JSON.stringify(users));
  }


}
