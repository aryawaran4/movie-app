import { ChangeDetectorRef, Component } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { MovieService } from '../shared/services/movie/movie.service';
import { FavouriteType, TrendingType, UserFavouriteType } from '../shared/types/movie.type';
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
  isMenuOpen = true

  trends!: TrendingType[];
  favourite!: FavouriteType;
  favoriteIds!: UserFavouriteType[]

  subscription: any;

  constructor(
    private globalService: GlobalService,
    private movieService: MovieService,
    private router: Router,) { }

  ngOnInit() {
    const token = this.globalService.getToken()
    if (token) {
      this.userLogin = true
    } else {
      this.userLogin = false
    }
    console.log(this.userLogin);
    this.userInfo = this.globalService.getMe()
    this.favoriteIds = this.globalService.getUsersData()
    this.getMovies()
  }

  // ***SLICK***
  slides = [];
  slideConfig = {
    "slidesToShow": 1, "slidesToScroll": 1, 'arrows': false, 'autoplay': false,
    'autoplaySpeed': 7000,
  };

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
      const movies = await this.movieService.trendingMovies();
      console.log('Movies:', movies);
      this.trends = movies.results
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

  async toggleFavorite(showId: number, mediaType: string): Promise<void> {
    try {
      if (this.isFavorite(showId, mediaType)) {
        const favourite = await this.movieService.removeFavourite(this.userInfo.uuid, showId, mediaType);
        // this.refreshFavoriteUI(showId, mediaType, 'remove')
        this.favoriteIds = this.globalService.getUsersData()
      } else {
        const favourite = await this.movieService.addFavourite(this.userInfo.uuid, showId, mediaType);
        // this.refreshFavoriteUI(showId, mediaType, 'add')
        this.favoriteIds = this.globalService.getUsersData()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  isFavorite(showId: number, mediaType: string): boolean {
    const user = this.favoriteIds.find((user) => user.uuid === this.userInfo.uuid);
    if (user) {
      if (mediaType === 'movie') {
        return user.favourites.movies.some((movie) => movie.id === showId);
      } else if (mediaType === 'tv') {
        return user.favourites.tv.some((tvShow) => tvShow.id === showId);
      }
    }
    return false;
  }
  
}