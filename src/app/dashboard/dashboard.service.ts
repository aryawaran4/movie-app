import { Injectable } from '@angular/core';
import { GetResponse } from '../shared/types/movie.type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  async getTrendingShows(): Promise<GetResponse> {
    try {
      const url = `${this.apiUrl}/trending/all/week?language=en-US`;

      const response = await this.http.get<GetResponse>(url).toPromise();
      if (!response) {
        throw new Error('Response is undefined');
      }
      return response;
    } catch (error) {
      console.error('Error fetching trends:', error);
      throw error;
    }
  }

  async getPopularMovies(): Promise<GetResponse> {
    try {
      const url = `${this.apiUrl}/movie/popular?language=en-US`;

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

  async getPopularTvShows(): Promise<GetResponse> {
    try {
      const url = `${this.apiUrl}/tv/popular?language=en-US`;

      const response = await this.http.get<GetResponse>(url).toPromise();
      if (!response) {
        throw new Error('Response is undefined');
      }
      return response;
    } catch (error) {
      console.error('Error fetching tv shows:', error);
      throw error;
    }
  }
}
