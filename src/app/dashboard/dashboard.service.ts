import { Injectable } from '@angular/core';
import { GetResponse } from '../shared/types/movie.type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  /**
 * Fetches trending shows from the API.
 * @returns A Promise that resolves with the response containing trending shows.
 */
  async getTrendingShows(): Promise<GetResponse> {
    try {
      // Construct URL for fetching trending shows
      const url = `${this.apiUrl}/trending/all/week?language=en-US`;
      // Send HTTP GET request to the API endpoint and await the response
      const response = await this.http.get<GetResponse>(url).toPromise();
      // Check if response is valid
      if (!response) {
        throw new Error('Response is undefined');
      }
      // Return the response
      return response;
    } catch (error) {
      // Handle errors during fetching trending shows
      console.error('Error fetching trends:', error);
      // Throw the error to be caught by the calling code
      throw error;
    }
  }

  /**
   * Fetches popular movies from the API.
   * @returns A Promise that resolves with the response containing popular movies.
   */
  async getPopularMovies(): Promise<GetResponse> {
    try {
      // Construct URL for fetching popular movies
      const url = `${this.apiUrl}/movie/popular?language=en-US`;
      // Send HTTP GET request to the API endpoint and await the response
      const response = await this.http.get<GetResponse>(url).toPromise();
      // Check if response is valid
      if (!response) {
        throw new Error('Response is undefined');
      }
      // Return the response
      return response;
    } catch (error) {
      // Handle errors during fetching popular movies
      console.error('Error fetching movies:', error);
      // Throw the error to be caught by the calling code
      throw error;
    }
  }

  /**
   * Fetches popular TV shows from the API.
   * @returns A Promise that resolves with the response containing popular TV shows.
   */
  async getPopularTvShows(): Promise<GetResponse> {
    try {
      // Construct URL for fetching popular TV shows
      const url = `${this.apiUrl}/tv/popular?language=en-US`;
      // Send HTTP GET request to the API endpoint and await the response
      const response = await this.http.get<GetResponse>(url).toPromise();
      // Check if response is valid
      if (!response) {
        throw new Error('Response is undefined');
      }
      // Return the response
      return response;
    } catch (error) {
      // Handle errors during fetching popular TV shows
      console.error('Error fetching tv shows:', error);
      // Throw the error to be caught by the calling code
      throw error;
    }
  }

}
