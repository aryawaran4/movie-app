import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// service
import { GlobalService } from '../shared/services/global.service';
import { GlobalMovieService } from '../shared/services/global-movie/global-movie.service';
import { SnackbarService } from '../shared/template/snackbar/snackbar.service';
import { VideoDialogService } from '../shared/template/video-dialog/video-dialog.service';
import { DashboardService } from './dashboard.service';

// type
import { FavouriteType, GenresType, MovieType, TvType, UserFavouriteType, MediaType } from '../shared/types/movie.type';
import { UserType } from '../shared/types/auth.type';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showNavbar = true;
  isSmallScreen: boolean = false;
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

  initialPage = 1

  trendsErr = false
  movieErr = false
  tvErr = false

  searchForm = new FormGroup({
    search: new FormControl('', Validators.required),
  })

  constructor(
    private globalService: GlobalService,
    public movieService: GlobalMovieService,
    private dashboardService: DashboardService,
    private snackbar: SnackbarService,
    private renderer: Renderer2,
    private element: ElementRef,
    private router: Router,
    private videoDialogService: VideoDialogService
  ) {
    this.userInfo = this.globalService.getMe()
    this.usersData = this.globalService.getUsersData()
  }

  ngOnInit() {
    this.getGenres()
    this.onResize('')
    this.getTrending()
    this.getPopularMovies()
    this.getPopularTvShows()
  }

  // ***SLICK***
  mainSlides = [];
  mainSlideConfig = {
    "slidesToShow": 1, "slidesToScroll": 1, 'arrows': false, 'autoplay': true, 'autoplaySpeed': 7000,
  };

  sectionSlides = [];
  sectionSlideConfig = {
    "slidesToShow": 7, "slidesToScroll": 2, 'arrows': true, 'infinite': true, adaptiveHeight: true, centerMode: true, variableWidth: true, initialSlide: 7,
  };

  updateSlickShow() {
    if (window.innerWidth < 768) {
      this.sectionSlideConfig.slidesToShow = 1
    } else {
      this.sectionSlideConfig.slidesToShow = 7
    }
  }
  // ***SLICK***

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.fadeIn();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 768;
  }

  ngAfterViewInit() {
    this.updateSlickShow();
    window.addEventListener('resize', this.updateSlickShow.bind(this));
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

  async openVideoDialog(linkId: number, mediaType: string): Promise<void> {
    this.snackbar.showLoading(true)
    try {
      const key = await this.movieService.getLinkVideoId(linkId, mediaType);
      this.videoDialogService.openVideoDialog(key);
    } catch (error) {
      console.error('Error opening video dialog:', error);
      this.snackbar.show('Error opening video dialog')
    } finally {
      this.snackbar.showLoading(false)
    }
  }


  async search() {
    this.snackbar.showLoading(true)
    try {
      if (this.searchForm.valid) {
        const formValue = this.searchForm.value;
        if (formValue.search) {
          const search = await this.movieService.fetchMultiSearch(formValue.search, this.initialPage);

          this.searchArray = search.results;

          if (this.searchArray.length === 0) {
            this.snackbar.show('No results found');
          } else {
            this.router.navigateByUrl(`/search?query=${formValue.search}`);
          }

        }
      }
    } catch (error) {
      console.error('Error fetching search:', error);
      this.snackbar.show('Error fetching search')
    } finally {
      this.snackbar.showLoading(false)
    }
  }

  async getTrending() {
    this.snackbar.showLoading(true)
    this.trendsErr = false
    try {
      const trends = await this.dashboardService.getTrendingShows();
      this.trends = trends.results;
    } catch (error) {
      console.error('Error fetching trends:', error);
      this.snackbar.show('Error fetching trends');
      this.snackbar.showLoading(false)
      this.trendsErr = true
    } finally {
      this.snackbar.showLoading(false)
    }
  }

  async getPopularMovies() {
    this.snackbar.showLoading(true)
    this.movieErr = false
    try {
      const popular = await this.dashboardService.getPopularMovies();
      this.popularMovies = popular.results
      if (this.popularMovies.length > 0) {
        setTimeout(() => {
          this.elementsArray =
            this.element.nativeElement.querySelectorAll('.animated-fade-in');
          this.fadeIn();
        }, 500);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      this.snackbar.show('Error fetching movies');
    } finally {
      this.snackbar.showLoading(false)
      this.movieErr = true
    }
  }

  async getPopularTvShows() {
    this.snackbar.showLoading(true)
    this.tvErr = false
    try {
      const popular = await this.dashboardService.getPopularTvShows();
      this.popularTvShows = popular.results
      if (this.popularTvShows.length > 0) {
        setTimeout(() => {
          this.elementsArray =
            this.element.nativeElement.querySelectorAll('.animated-fade-in');
          this.fadeIn();
        }, 500);
      }
    } catch (error) {
      console.error('Error fetching tv shows:', error);
      this.snackbar.show('Error fetching tv shows');
      this.tvErr = true
    } finally {
      this.snackbar.showLoading(false)
    }
  }

  async toggleFavorite(showId: number, mediaType: string): Promise<void> {
    if (this.globalService.getToken()) {
      this.snackbar.showLoading(true)
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
      finally {
        this.snackbar.showLoading(false)
      }
    } else {
      this.snackbar.show('Need to login first');
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
    // Show loading indicator while fetching genres
    this.snackbar.showLoading(true);
    try {
      // Fetch movie and TV genres concurrently using Promise.all
      const [movieGenres, tvGenres] = await Promise.all([
        this.movieService.getGenresList('movie'),
        this.movieService.getGenresList('tv')
      ]);
      // Store fetched genres in component properties
      this.genresMovie = movieGenres;
      this.genresTv = tvGenres;
    } catch (error) {
      // Handle errors during genre fetching
      console.error('Error fetching genres:', error);
      this.snackbar.show('Error fetching genres');
    } finally {
      // Hide loading indicator regardless of success or failure
      this.snackbar.showLoading(false);
    }
  }

  // Get the name of a genre based on genre ID and media type (movie or TV)
  getGenreName(genreId: number, mediaType: string): string {
    try {
      // Determine which genre list to use based on media type
      const genresList = mediaType === 'movie' ? this.genresMovie : this.genresTv;
      // Check if genre list or genres array is not available
      if (!genresList || !genresList.genres) {
        throw new Error('Genres list is not available.');
      }
      // Find the genre object with matching ID
      const genre = genresList.genres.find(genre => genre.id === genreId);

      // Throw error if genre is not found
      if (!genre) {
        throw new Error('Genre not found.');
      }
      // Return the name of the genre
      return genre.name;
    } catch (error) {
      // Handle errors gracefully and return a default genre name
      console.error('Error fetching genre name:', error);
      return 'Unknown Genre';
    }
  }


}