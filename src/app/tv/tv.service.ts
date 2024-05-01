import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetResponse } from '../shared/types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class TvService {

  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  /**
 * Fetches a list of top-rated TV shows from the API.
 * @param pageNumber The page number for pagination.
 * @returns A Promise that resolves with the response containing the top-rated TV shows.
 */
  async getTopRatedTvs(pageNumber: number): Promise<GetResponse> {
    try {
      // Construct the URL for fetching top-rated TV shows
      const url = `${this.apiUrl}/tv/top_rated?language=en-US&page=${pageNumber}`;

      // Send an HTTP GET request to the API endpoint and await the response
      const response = await this.http.get<GetResponse>(url).toPromise();

      // Check if the response is undefined
      if (!response) {
        throw new Error('Response is undefined');
      }

      // Return the response containing the top-rated TV shows
      return response;
    } catch (error) {
      // Handle errors that occur during the HTTP request or processing of the response
      console.error('Error fetching top-rated TV shows:', error);
      // Re-throw the error to propagate it to the caller
      throw error;
    }
  }

}
