import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { MovieService } from '../shared/services/movie/movie.service';
import { FavouriteType, GenresType, MovieType, TvType, UserFavouriteType, MediaType } from '../shared/types/movie.type';
import { Router } from '@angular/router';
import { UserType } from '../shared/types/auth.type';
import { SnackbarService } from '../shared/template/snackbar/snackbar.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showNavbar = true;
  loading: boolean = false
  elementsArray!: NodeListOf<Element>;
  userInfo!: UserType

  trends!: MediaType[];
  searchArray!: MediaType[];
  popularMovies!: MovieType[]
  popularTvShows!: TvType[]
  favourite!: FavouriteType;
  usersData!: UserFavouriteType

  genresMovie!: GenresType
  genresTv!: GenresType

  searchForm = new FormGroup({
    search: new FormControl('', Validators.required),
  })

  constructor(
    private globalService: GlobalService,
    public movieService: MovieService,
    private snackbar: SnackbarService,
    private renderer: Renderer2,
    private element: ElementRef,
  ) {
    this.userInfo = this.globalService.getMe()
    this.usersData = this.globalService.getUsersData()
  }

  ngOnInit() {
    this.getTrending()
    this.getPopularMovies()
    this.getPopularTvShows()
    this.getGenres()
  }

  // ***SLICK***
  mainSlides = [];
  mainSlideConfig = {
    "slidesToShow": 1, "slidesToScroll": 1, 'arrows': false, 'autoplay': true,
    'autoplaySpeed': 7000,
  };

  sectionSlides = [];
  sectionSlideConfig = {
    "slidesToShow": 5, "slidesToScroll": 2, 'arrows': true, 'infinite': true
  };
  // ***SLICK***

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.fadeIn();
  }

  fadeIn() {
    for (let i = 0; i < this.elementsArray.length; i++) {
      const elem = this.elementsArray[i];
      const distInView =
        elem.getBoundingClientRect().top - window.innerHeight + 20;
      if (distInView < 0) {
        this.renderer.addClass(elem, 'inView');
      }
    }
  }

  async search() {
    try {
      if (this.searchForm.valid) {
        const formValue = this.searchForm.value;
        if (formValue.search) {
          console.log(formValue.search);
          const search = await this.movieService.searchMulti(formValue.search);

          this.searchArray = search.results;
          console.log(this.searchArray);
          if (this.searchArray.length === 0) {
            console.log('No results found.');
            // Show a message to the user indicating no results found
            this.snackbar.show('No results found.');
          }

        }
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
      // Show an error message to the user
      this.snackbar.show('Error fetching search');
    } finally {
      console.log('API call completed.');
    }
  }


  async getTrending() {
    try {
      const trends = await this.movieService.trendingShows();
      this.trends = trends.results
    } catch (error) {
      console.error('Error fetching trends:', error);
      this.snackbar.show('Error fetching trends');
    } finally {
      console.log('API call completed.');
    }
  }

  async getPopularMovies() {
    try {
      const popular = await this.movieService.popularMovies();
      this.popularMovies = popular.results
    } catch (error) {
      console.error('Error fetching movies:', error);
      this.snackbar.show('Error fetching movies');
    } finally {
      console.log('API call completed.');
      setTimeout(() => {
        this.elementsArray =
          this.element.nativeElement.querySelectorAll('.animated-fade-in');
        this.fadeIn();
      }, 500);
    }
  }

  async getPopularTvShows() {
    try {
      const popular = await this.movieService.popularTvShows();
      this.popularTvShows = popular.results
    } catch (error) {
      console.error('Error fetching tv shows:', error);
      this.snackbar.show('Error fetching tv shows');
    } finally {
      console.log('API call completed.');
      setTimeout(() => {
      this.elementsArray =
        this.element.nativeElement.querySelectorAll('.animated-fade-in');
      this.fadeIn();
    }, 500);
    }
  }

  async toggleFavorite(showId: number, mediaType: string): Promise<void> {
    try {
      if (this.isFavorite(showId, mediaType)) {
        const favourite = await this.movieService.removeFavourite(this.userInfo.uuid, showId, mediaType);
        this.usersData = this.globalService.getUsersData()
      } else {
        const favourite = await this.movieService.addFavourite(this.userInfo.uuid, showId, mediaType);
        this.usersData = this.globalService.getUsersData()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      this.snackbar.show('Error toggling favorite');
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
      this.snackbar.show('Error fetching genres');
    }
  }

  getGenreName(genreId: number, mediaType: string): string {
    const genresList = mediaType === 'movie' ? this.genresMovie : this.genresTv;
    const genre = genresList.genres.find(genre => genre.id === genreId);
    return genre ? genre.name : 'Unknown Genre';
  }

}