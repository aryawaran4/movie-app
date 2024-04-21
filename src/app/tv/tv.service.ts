import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetResponse } from '../shared/types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class TvService {

  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  async getTopRatedTvs(pageNumber: number): Promise<GetResponse> {
    try {
      const url = `${this.apiUrl}/tv/top_rated?language=en-US&page=${pageNumber}`;

      const response = await this.http.get<GetResponse>(url).toPromise();
      if (!response) {
        throw new Error('Response is undefined');
      }
      return response;
    } catch (error) {
      console.error('Error fetching tvs:', error);
      throw error;
    }
  }
}
