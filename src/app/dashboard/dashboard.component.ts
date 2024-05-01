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

  /**
 * Listens for scroll events on the window and triggers the fadeIn method.
 * @param event The scroll event.
 */
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    this.fadeIn();
  }

  /**
   * Listens for resize events on the window and updates the isSmallScreen property.
   * @param event The resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 768;
  }

  /**
   * Executes after the view has been initialized.
   * Updates the slick show and adds a resize event listener to the window.
   */
  ngAfterViewInit() {
    this.updateSlickShow();
    window.addEventListener('resize', this.updateSlickShow.bind(this));
  }

  /**
 * Fades in elements when they come into view.
 */
  fadeIn() {
    // Loop through each element in the elementsArray
    for (let i = 0; i < this.elementsArray.length; i++) {
      // Get the current element
      const elem = this.elementsArray[i];
      // Calculate the distance of the element from the top of the viewport
      const distInView = elem.getBoundingClientRect().top - window.innerHeight + 20;
      // If the element is in view (above the bottom of the viewport)
      if (distInView < 0) {
        // Add the 'inView' class to the element to trigger the fade-in animation
        this.renderer.addClass(elem, 'inView');
      }
    }
  }

  /**
   * Opens a video dialog for a given link ID and media type.
   * @param linkId The ID of the link.
   * @param mediaType The type of media (e.g., 'movie' or 'tv').
   * @returns A Promise that resolves once the video dialog is opened.
   */
  async openVideoDialog(linkId: number, mediaType: string): Promise<void> {
    // Show loading indicator while opening the video dialog
    this.snackbar.showLoading(true);
    try {
      // Get the video key using the link ID and media type
      const key = await this.movieService.getLinkVideoId(linkId, mediaType);
      // Open the video dialog with the retrieved key
      this.videoDialogService.openVideoDialog(key);
    } catch (error) {
      // Handle errors during opening the video dialog
      console.error('Error opening video dialog:', error);
      // Show error message to the user
      this.snackbar.show('Error opening video dialog');
    } finally {
      // Hide loading indicator regardless of success or failure
      this.snackbar.showLoading(false);
    }
  }

  /**
 * Performs a search based on the provided search query and updates the component's state.
 */
  async search() {
    // Show loading indicator while performing the search
    this.snackbar.showLoading(true);
    try {
      // Check if the search form is valid
      if (this.searchForm.valid) {
        // Get the form value
        const formValue = this.searchForm.value;
        // Check if the search query is not empty
        if (formValue.search) {
          // Perform the multi-search using the search query and initial page number
          const search = await this.movieService.fetchMultiSearch(formValue.search, this.initialPage);
          // Store the search results in the searchArray property
          this.searchArray = search.results;
          // If no results found, show a message to the user
          if (this.searchArray.length === 0) {
            this.snackbar.show('No results found');
          } else {
            // If results found, navigate to the search results page
            this.router.navigateByUrl(`/search?query=${formValue.search}`);
          }
        }
      }
    } catch (error) {
      // Handle errors during search
      console.error('Error fetching search:', error);
      // Show error message to the user
      this.snackbar.show('Error fetching search');
    } finally {
      // Hide loading indicator regardless of success or failure
      this.snackbar.showLoading(false);
    }
  }

  /**
   * Fetches trending shows and updates the component's state.
   */
  async getTrending() {
    // Show loading indicator
    this.snackbar.showLoading(true);
    // Reset error flag
    this.trendsErr = false;
    try {
      // Fetch trending shows
      const trends = await this.dashboardService.getTrendingShows();
      // Store fetched trending shows
      this.trends = trends.results;
    } catch (error) {
      // Handle errors during fetching trending shows
      console.error('Error fetching trends:', error);
      this.snackbar.show('Error fetching trends');
      // Show error flag
      this.trendsErr = true;
    } finally {
      // Hide loading indicator regardless of success or failure
      this.snackbar.showLoading(false);
    }
  }

  /**
 * Fetches popular movies and updates the component's state.
 */
  async getPopularMovies() {
    // Show loading indicator
    this.snackbar.showLoading(true);
    // Reset error flag
    this.movieErr = false;
    try {
      // Fetch popular movies
      const popular = await this.dashboardService.getPopularMovies();
      // Store fetched popular movies
      this.popularMovies = popular.results;
      // Check if popular movies are available
      if (this.popularMovies.length > 0) {
        // Schedule fade-in animation after a delay
        setTimeout(() => {
          this.elementsArray =
            this.element.nativeElement.querySelectorAll('.animated-fade-in');
          this.fadeIn();
        }, 500);
      }
    } catch (error) {
      // Handle errors during fetching popular movies
      console.error('Error fetching movies:', error);
      this.snackbar.show('Error fetching movies');
    } finally {
      // Hide loading indicator regardless of success or failure
      this.snackbar.showLoading(false);
      // Show error flag
      this.movieErr = true;
    }
  }

  /**
   * Fetches popular TV shows and updates the component's state.
   */
  async getPopularTvShows() {
    // Show loading indicator
    this.snackbar.showLoading(true);
    // Reset error flag
    this.tvErr = false;
    try {
      // Fetch popular TV shows
      const popular = await this.dashboardService.getPopularTvShows();
      // Store fetched popular TV shows
      this.popularTvShows = popular.results;
      // Check if popular TV shows are available
      if (this.popularTvShows.length > 0) {
        // Schedule fade-in animation after a delay
        setTimeout(() => {
          this.elementsArray =
            this.element.nativeElement.querySelectorAll('.animated-fade-in');
          this.fadeIn();
        }, 500);
      }
    } catch (error) {
      // Handle errors during fetching popular TV shows
      console.error('Error fetching tv shows:', error);
      this.snackbar.show('Error fetching tv shows');
      // Show error flag
      this.tvErr = true;
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
          await this.movieService.removeFavourite(this.userInfo.uuid, showId, mediaType);
        } else {
          // Add the show to favorites
          await this.movieService.addFavourite(this.userInfo.uuid, showId, mediaType);
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

  /**
 * Retrieves movie and TV genres concurrently using Promise.all.
 * Stores fetched genres in component properties.
 * @returns A Promise that resolves once genres are fetched and stored.
 */
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

  /**
   * Retrieves the name of a genre based on genre ID and media type (movie or TV).
   * @param genreId The ID of the genre.
   * @param mediaType The type of media (movie or TV).
   * @returns The name of the genre if found, otherwise returns 'Unknown Genre'.
   */
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