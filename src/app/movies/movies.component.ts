import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';

// service
import { GlobalService } from '../shared/services/global.service';
import { GlobalMovieService } from '../shared/services/global-movie/global-movie.service';
import { SnackbarService } from '../shared/template/snackbar/snackbar.service';
import { MoviesService } from './movies.service';

// type
import {
  FavouriteType,
  MovieType,
  UserFavouriteType,
} from '../shared/types/movie.type';
import { UserType } from '../shared/types/auth.type';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent {
  showNavbar = true;
  elementsArray!: NodeListOf<Element>;
  userInfo!: UserType;
  reachedBottom: boolean = false;

  TopRatedMovies: MovieType[] = [];
  newTopRatedMovies!: MovieType[];

  favourite!: FavouriteType;
  usersData!: UserFavouriteType;

  currentPage = 1;
  loading = false;

  constructor(
    private globalService: GlobalService,
    public movieService: GlobalMovieService,
    public moviesService: MoviesService,
    private snackbar: SnackbarService,
    private renderer: Renderer2,
    private element: ElementRef
  ) {
    this.userInfo = this.globalService.getMe();
    this.usersData = this.globalService.getUsersData();
  }

  ngOnInit() {
    this.getTopRatedMovies(this.currentPage);
  }

  // Listen for scroll events on the window
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Call the fadeIn method when the window is scrolled
    this.fadeIn();

    // Calculate window and body dimensions for infinite scrolling
    const windowHeight = window.innerHeight + 20;
    const scrollY = window.scrollY;
    const bodyHeight = document.body.offsetHeight;

    // Check if the user has scrolled to the bottom of the page
    if (windowHeight + scrollY >= bodyHeight) {
      // If so, fetch the next page of content
      this.fetchNextPage();
    }
  }

  /**
   * Fetches the next page of top-rated movies and adds them to the existing list.
   */
  fetchNextPage() {
    // Check if not already loading
    if (!this.loading) {
      // Set loading flag to true
      this.loading = true;
      // Increment current page number
      this.currentPage++;

      // Fetch the next page of top-rated movies
      this.getTopRatedMovies(this.currentPage).then(() => {
        // Schedule fade-in animation after a delay
        setTimeout(() => {
          // Query for elements with the 'animated-fade-in' class
          this.elementsArray =
            this.element.nativeElement.querySelectorAll('.animated-fade-in');
          // Trigger fade-in animation
          this.fadeIn();
        }, 500);
        // Reset loading flag after fetching
        this.loading = false;
      });
    }
  }

  /**
   * Fades in elements when they come into view.
   */
  fadeIn() {
    // Ensure that elementsArray is not null or undefined before proceeding
    if (this.elementsArray) {
      // Loop through each element in the elementsArray
      for (let i = 0; i < this.elementsArray.length; i++) {
        // Get the current element
        const elem = this.elementsArray[i];
        // Calculate the distance of the element from the top of the viewport
        const distInView =
          elem.getBoundingClientRect().top - window.innerHeight + 20;
        // If the element is in view (above the bottom of the viewport)
        if (distInView < 0) {
          // Add the 'inView' class to the element to trigger the fade-in animation
          this.renderer.addClass(elem, 'inView');
        }
      }
    }
  }

  /**
   * Fetches a list of top-rated movies from the API and adds them to the existing list.
   * @param pageNumber The page number for pagination.
   */
  async getTopRatedMovies(pageNumber: number) {
    // Show loading indicator
    this.snackbar.showLoading(true);
    try {
      // Fetch top-rated movies from the service
      const movies = await this.moviesService.getTopRatedMovies(pageNumber);
      // Store the fetched movies in a temporary variable
      this.newTopRatedMovies = movies.results;

      // Check if no new movies were fetched
      if (this.newTopRatedMovies.length === 0) {
        // Return early if no new movies were fetched
        return;
      }

      // Add the new movies to the existing list
      this.TopRatedMovies.push(...this.newTopRatedMovies);

      // Check if there are movies in the list
      if (this.TopRatedMovies.length > 0) {
        // Schedule fade-in animation after a delay
        setTimeout(() => {
          // Query for elements with the 'animated-fade-in' class
          this.elementsArray =
            this.element.nativeElement.querySelectorAll('.animated-fade-in');
          // Trigger fade-in animation
          this.fadeIn();
        }, 500);
      }
    } catch (error) {
      // Handle errors during fetching top-rated movies
      console.error('Error fetching movies:', error);
      // Show error message to the user
      this.snackbar.show('Error fetching movies');
    } finally {
      // Hide loading indicator regardless of success or failure
      this.snackbar.showLoading(false);
    }
  }

  /**
   * Toggles the favorite status for a show.
   * @param showId The ID of the show.
   * @param mediaType The type of media (movie or TV).
   * @returns A Promise that resolves once the favorite status is toggled.
   */
  async toggleFavorite(showId: number, mediaType: string): Promise<void> {
    // Check if the user is logged in
    if (this.globalService.getToken()) {
      // Show loading indicator while toggling favorite
      this.snackbar.showLoading(true);
      try {
        // Check if the show is already a favorite
        if (this.isFavorite(showId, mediaType)) {
          // Remove the show from favorites
          await this.movieService.removeFavourite(
            this.userInfo.uuid,
            showId,
            mediaType
          );
        } else {
          // Add the show to favorites
          await this.movieService.addFavourite(
            this.userInfo.uuid,
            showId,
            mediaType
          );
        }
        // Update usersData after adding or removing favorite
        this.usersData = this.globalService.getUsersData();
      } catch (error) {
        // Handle errors during toggling favorite
        console.error('Error toggling favorite:', error);
        // Show error message to the user
        this.snackbar.show('Error toggling favorite');
      } finally {
        // Hide loading indicator regardless of success or failure
        this.snackbar.showLoading(false);
      }
    } else {
      // If user is not logged in, show a message to login first
      this.snackbar.show('Need to login first');
    }
  }

  /**
   * Checks if a show is marked as favorite.
   * @param showId The ID of the show.
   * @param mediaType The type of media (movie or TV).
   * @returns True if the show is marked as favorite, otherwise false.
   */
  isFavorite(showId: number, mediaType: string): boolean {
    const user = this.usersData;
    if (user) {
      // Check if the media type is 'movie'
      if (mediaType === 'movie') {
        // Check if the show is in the list of favorite movies
        return user.favourites.movies.some((movie) => movie.id === showId);
      } else if (mediaType === 'tv') {
        // Check if the show is in the list of favorite TV shows
        return user.favourites.tv.some((tvShow) => tvShow.id === showId);
      }
    }
    // Return false if user data is not available or show is not a favorite
    return false;
  }
}
