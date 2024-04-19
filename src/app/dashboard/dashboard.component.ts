import { ChangeDetectorRef, Component } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { MovieService } from '../shared/services/movie/movie.service';
import { FavouriteType, GenresType, TrendingType, UserFavouriteType } from '../shared/types/movie.type';
import { Router } from '@angular/router';
import { UserType } from '../shared/types/auth.type';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showNavbar = true;  
  userInfo!: UserType
  isMenuOpen = true

  trends!: TrendingType[];
  favourite!: FavouriteType;
  usersData!: UserFavouriteType

  genresMovie!: GenresType
  genresTv!: GenresType

  constructor(
    private globalService: GlobalService,
    public movieService: MovieService,
    private router: Router,) {       
      this.userInfo = this.globalService.getMe()
      this.usersData = this.globalService.getUsersData()
    }

  ngOnInit() {
    this.getMovies()
    this.getGenres()
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
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

  async toggleFavorite(showId: number, mediaType: string): Promise<void> {
    try {
      if (this.isFavorite(showId, mediaType)) {
        const favourite = await this.movieService.removeFavourite(this.userInfo.uuid, showId, mediaType);
        // this.refreshFavoriteUI(showId, mediaType, 'remove')
        this.usersData = this.globalService.getUsersData()
      } else {
        const favourite = await this.movieService.addFavourite(this.userInfo.uuid, showId, mediaType);
        // this.refreshFavoriteUI(showId, mediaType, 'add')
        this.usersData = this.globalService.getUsersData()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  isFavorite(showId: number, mediaType: string): boolean {
    const user = this.usersData
    if (user) {
      if (mediaType === 'movie') {
        return user.favourites.movies.some((movie) => movie.id === showId);
      } else if (mediaType === 'tv') {
        return user.favourites.tv.some((tvShow) => tvShow.id === showId);
      }
    }
    return false;
  }

  async getGenres() {
    try {
      // Fetch genres for both movies and TV shows concurrently
      const [movieGenres, tvGenres] = await Promise.all([
        this.movieService.GenresList('movie'),
        this.movieService.GenresList('tv')
      ]);
      this.genresMovie = movieGenres;
      this.genresTv = tvGenres;
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }

  getGenreName(genreId: number, mediaType: string): string {
    const genresList = mediaType === 'movie' ? this.genresMovie : this.genresTv;
    const genre = genresList.genres.find(genre => genre.id === genreId);
    return genre ? genre.name : 'Unknown Genre';
  }

}