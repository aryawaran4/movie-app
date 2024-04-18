import { Component } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { MovieService } from '../shared/services/movie/movie.service';
import { FavouriteType, MovieType } from '../shared/types/movie.type';
import { AuthService } from '../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { UserType } from '../shared/types/auth.type';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showNavbar = true;
  userLogin = false
  userInfo!: UserType

  discoveries!: MovieType[];
  favourite!: FavouriteType;

  constructor(private globalService: GlobalService, private movieService: MovieService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const token = this.globalService.getToken()
    if (token) {
      this.userLogin = true
    } else {
      this.userLogin = false
    }
    console.log(this.userLogin);
    this.userInfo = this.globalService.getMe()
    this.getMovies()
  }

  // ***SLICK***
  slides = [];
  slideConfig = { "slidesToShow": 1, "slidesToScroll": 1, 'arrows': false };

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
      const size = 'w1280'; // Adjust the size as needed
      return `${baseUrl}${size}${backdropPath}`;
    } else {
      // Provide a default image URL if backdropPath is not provided
      return 'path_to_default_image.jpg';
    }
  }

  async addFavourite(movieId: number) {
    try {
      const favourite = await this.movieService.addFavouriteMovie(this.userInfo.uuid, movieId);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      console.log('API call completed.');
    }
  }

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('login');
  }
}
