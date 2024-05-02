import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetResponse } from '../shared/types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  /**
 * Retrieves a list of top-rated movies from the API.
 * @param pageNumber The page number for pagination.
 * @returns A Promise that resolves with the response containing top-rated movies.
 */
  async getTopRatedMovies(pageNumber: number): Promise<GetResponse> {
    try {
      // Construct the URL for fetching top-rated movies
      const url = `${this.apiUrl}/movie/top_rated?language=en-US&page=${pageNumber}`;

      // Send an HTTP GET request to the API endpoint and await the response
      const response = await this.http.get<GetResponse>(url).toPromise();

      // Check if the response is undefined
      if (!response) {
        throw new Error('Response is undefined');
      }

      // Return the response containing top-rated movies
      return response;
    } catch (error) {
      // Handle errors that occur during the HTTP request or processing of the response
      console.error('Error fetching movies:', error);
      // Re-throw the error to propagate it to the caller
      throw error;
    }
  }

}
