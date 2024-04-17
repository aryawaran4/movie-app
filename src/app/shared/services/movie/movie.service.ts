import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DiscoverResponse } from '../../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NTRkZmM5MmQ2MzBjYmU4NjRhMzllMWU3NmJjYzdlNSIsInN1YiI6IjYxNmU4YzMzMTA4OWJhMDA0NGM2NzU0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P3DryXumKOqJdhTMRDQN7MEhsIilwlhYbNIF710Q6VQ'; // Replace with your actual API key

  constructor(private http: HttpClient) { }

  async discoverMovies(): Promise<DiscoverResponse> {
    try {
      const url = `${this.apiUrl}/discover/movie?language=en-US&page=1&sort_by=popularity.desc`;
      const options = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        }
      };

      const response = await this.http.get<DiscoverResponse>(url, options).toPromise();
      if (!response) {
        throw new Error('Response is undefined');
      }
      return response;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  }

}
