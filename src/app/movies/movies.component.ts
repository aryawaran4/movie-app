import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { FavouriteType, MovieType, UserFavouriteType } from '../shared/types/movie.type';
import { GlobalService } from '../shared/services/global.service';
import { GlobalMovieService } from '../shared/services/global-movie/global-movie.service';
import { SnackbarService } from '../shared/template/snackbar/snackbar.service';
import { UserType } from '../shared/types/auth.type';
import { MoviesService } from './movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent {
  showNavbar = true;
  elementsArray!: NodeListOf<Element>;
  userInfo!: UserType;
  reachedBottom: boolean = false

  TopRatedMovies: MovieType[] = []
  newTopRatedMovies!: MovieType[]

  favourite!: FavouriteType;
  usersData!: UserFavouriteType

  currentPage = 1
  loading = false

  constructor(
    private globalService: GlobalService,
    public movieService: GlobalMovieService,
    public moviesService: MoviesService,
    private snackbar: SnackbarService,
    private renderer: Renderer2,
    private element: ElementRef,
  ) {
    this.userInfo = this.globalService.getMe()
    this.usersData = this.globalService.getUsersData()
  }

  ngOnInit() {
    this.getTopRatedMovies(this.currentPage)
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.fadeIn();

    const windowHeight = window.innerHeight + 20;
    const scrollY = window.scrollY;
    const bodyHeight = document.body.offsetHeight;

    // Check if the user has scrolled to the bottom of the page
    if (windowHeight + scrollY >= bodyHeight) {
      this.fetchNextPage();
    }
  }

  fetchNextPage() {
    if (!this.loading) {
      // Set loading indicator to true to prevent multiple requests
      this.loading = true;

      // Increment the page number to fetch the next page
      this.currentPage++;

      // Fetch movies for the next page
      this.getTopRatedMovies(this.currentPage).then(() => {
        // Reset loading indicator after the request is completed
        this.loading = false;
      });
    }
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

  async getTopRatedMovies(pageNumber: number) {
    this.snackbar.showLoading(true)
    try {
      const movies = await this.moviesService.getTopRatedMovies(pageNumber);
      this.newTopRatedMovies = movies.results;
      console.log(this.newTopRatedMovies);

      if (this.newTopRatedMovies.length === 0) {
        // No more movies available, stop fetching
        return;
      }
      this.TopRatedMovies.push(...this.newTopRatedMovies);
      setTimeout(() => {
        this.elementsArray =
          this.element.nativeElement.querySelectorAll('.animated-fade-in');
        this.fadeIn();
      }, 500);
    } catch (error) {
      console.error('Error fetching movies:', error);
      // this.snackbar.show('Error fetching movies');
      this.snackbar.showLoading(false)
    } finally {
      console.log('API call completed.');
      this.snackbar.showLoading(false)
    }
  }

  async toggleFavorite(showId: number, mediaType: string): Promise<void> {
    this.snackbar.showLoading(true)
    try {
      if (this.isFavorite(showId, mediaType)) {
        const favourite = await this.movieService.removeFavourite(this.userInfo.uuid, showId, mediaType);
        this.usersData = this.globalService.getUsersData();
      } else {
        const favourite = await this.movieService.addFavourite(this.userInfo.uuid, showId, mediaType);
        this.usersData = this.globalService.getUsersData();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // this.snackbar.show('Error toggling favorite');
    } finally {
      this.snackbar.showLoading(false)
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

}
