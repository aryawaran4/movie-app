import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { GlobalMovieService } from '../shared/services/global-movie/global-movie.service';
import { FavouriteType, GenresType, MovieType, TvType, UserFavouriteType, MediaType } from '../shared/types/movie.type';
import { Router } from '@angular/router';
import { UserType } from '../shared/types/auth.type';
import { SnackbarService } from '../shared/template/snackbar/snackbar.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VideoDialogService } from '../shared/template/video-dialog/video-dialog.service';
import { DashboardService } from './dashboard.service';

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
    this.onResize('')
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
    "slidesToShow": 5, "slidesToScroll": 2, 'arrows': true, 'infinite': true, adaptiveHeight: true, centerMode: true,
    initialSlide: 2,
    variableWidth: true,
  };

  updateSlickShow() {
    if (window.innerWidth < 768) {
      this.sectionSlideConfig.slidesToShow = 1
    } else {
      this.sectionSlideConfig.slidesToShow = 5
    }
  }
  // ***SLICK***

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.fadeIn();
  }  
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
      // Handle error appropriately, e.g., show error message
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
          console.log(formValue.search);
          const search = await this.movieService.fetchMultiSearch(formValue.search);

          this.searchArray = search.results;
          console.log(this.searchArray);

          if (this.searchArray.length === 0) {
            console.log('No results found.');
            this.snackbar.show('No results found');
            // Show a message to the user indicating no results found            
          } else {
            this.router.navigateByUrl(`/search?query=${formValue.search}`);
          }

        }
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
      // Show an error message to the user
      // this.snackbar.showLoading(false)
    } finally {
      console.log('API call completed.');
      this.snackbar.showLoading(false)
    }
  }

  async getTrending() {
    this.snackbar.showLoading(true)
    try {
      const trends = await this.dashboardService.getTrendingShows();
      this.trends = trends.results;
      setTimeout(() => {
        this.elementsArray =
          this.element.nativeElement.querySelectorAll('.animated-fade-in');
        this.fadeIn();
      }, 500);
    } catch (error) {
      console.error('Error fetching trends:', error);
      // this.snackbar.show('Error fetching trends');
      this.snackbar.showLoading(false)
    } finally {
      console.log('API call completed.');
      this.snackbar.showLoading(false)
    }
  }

  async getPopularMovies() {
    this.snackbar.showLoading(true)
    try {
      const popular = await this.dashboardService.getPopularMovies();
      this.popularMovies = popular.results
      setTimeout(() => {
        this.elementsArray =
          this.element.nativeElement.querySelectorAll('.animated-fade-in');
        this.fadeIn();
      }, 500);
    } catch (error) {
      console.error('Error fetching movies:', error);
      // this.snackbar.show('Error fetching movies');
    } finally {
      console.log('API call completed.');
      this.snackbar.showLoading(false)
    }
  }

  async getPopularTvShows() {
    this.snackbar.showLoading(true)
    try {
      const popular = await this.dashboardService.getPopularTvShows();
      this.popularTvShows = popular.results
      setTimeout(() => {
        this.elementsArray =
          this.element.nativeElement.querySelectorAll('.animated-fade-in');
        this.fadeIn();
      }, 500);
    } catch (error) {
      console.error('Error fetching tv shows:', error);
      // this.snackbar.show('Error fetching tv shows');
    } finally {
      console.log('API call completed.');
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
        // this.snackbar.show('Error toggling favorite');      
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
    this.snackbar.showLoading(true)
    try {
      // Fetch genres for both movies and TV shows concurrently
      const [movieGenres, tvGenres] = await Promise.all([
        this.movieService.getGenresList('movie'),
        this.movieService.getGenresList('tv')
      ]);
      this.genresMovie = movieGenres;
      this.genresTv = tvGenres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      // this.snackbar.show('Error fetching genres');
    } finally {
      this.snackbar.showLoading(false)
    }
  }

  getGenreName(genreId: number, mediaType: string): string {
    const genresList = mediaType === 'movie' ? this.genresMovie : this.genresTv;
    const genre = genresList.genres.find(genre => genre.id === genreId);
    return genre ? genre.name : 'Unknown Genre';
  }

}