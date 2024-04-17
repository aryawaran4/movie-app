import { Component } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { MovieService } from '../shared/services/movie/movie.service';
import { MovieType } from '../shared/types/movie.type';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showNavbar = true;
  userLogin = false

  discoveries! : MovieType[];

  constructor(private globalService: GlobalService, private movieService: MovieService) { }

  ngOnInit() {
    const token = this.globalService.getToken()
    if (token) {
      this.userLogin = true
    } else {
      this.userLogin = false
    }
    console.log(this.userLogin);
    this.getMovies()
  }

  // ***SLICK***
  slides = [];
  slideConfig = { "slidesToShow": 3, "slidesToScroll": 1 };

  slickInit(e: any) {
    console.log('slick initialized');
  }

  breakpoint(e: any) {
    console.log('breakpoint');
  }

  afterChange(e: any) {
    console.log('afterChange');
  }

  beforeChange(e: any) {
    console.log('beforeChange');
  }
  // ***SLICK***

  async getMovies() {
    try {
      const movies = await this.movieService.discoverMovies();
      console.log('Movies:', movies);
      this.discoveries = movies.results
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      console.log('API call completed.');
    }
  }

  getImageUrl(backdropPath: string | null): string {
    if (backdropPath) {
        const baseUrl = 'https://image.tmdb.org/t/p/';
        const size = 'w500'; // Adjust the size as needed
        return `${baseUrl}${size}${backdropPath}`;
    } else {
        // Provide a default image URL if backdropPath is not provided
        return 'path_to_default_image.jpg';
    }
}
}
