import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

// service
import { GlobalService } from '../shared/services/global.service';
import { GlobalMovieService } from '../shared/services/global-movie/global-movie.service';
import { SnackbarService } from '../shared/template/snackbar/snackbar.service';

// type
import { MediaType, UserFavouriteType } from '../shared/types/movie.type';
import { UserType } from '../shared/types/auth.type';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent {
  showNavbar = true;
  elementsArray!: NodeListOf<Element>;
  searchArray: MediaType[] = [];
  newSearchArray!: MediaType[];
  usersData!: UserFavouriteType;
  userInfo!: UserType;

  query: string | null = null;

  currentPage = 1;
  loading = false;

  searchForm = new FormGroup({
    search: new FormControl('', Validators.required),
  });

  constructor(
    private globalService: GlobalService,
    public movieService: GlobalMovieService,
    private snackbar: SnackbarService,
    private renderer: Renderer2,
    private element: ElementRef,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.userInfo = this.globalService.getMe();
    this.usersData = this.globalService.getUsersData();
  }

  ngOnInit() {
    // Subscribe to query parameters changes
    this.activatedRouter.queryParams.subscribe((params) => {
      // Retrieve the search query from query parameters
      this.query = params['query'];
      // Initialize the search form with the retrieved query
      this.searchForm = this.formBuilder.group({
        search: [this.query],
      });
    });
    // Perform the initial search with the current page number
    this.search(this.currentPage);
  }

  /**
   * Event handler for the window scroll event.
   * Initiates the fadeIn animation and fetches the next page of search results if scrolled to the bottom.
   * @param event The scroll event object.
   */
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Trigger the fadeIn animation
    this.fadeIn();

    // Calculate window, scroll, and body heights
    const windowHeight = window.innerHeight + 20;
    const scrollY = window.scrollY;
    const bodyHeight = document.body.offsetHeight;

    // Check if scrolled to the bottom of the page
    if (windowHeight + scrollY >= bodyHeight) {
      // Fetch the next page of search results
      this.fetchNextPage();
    }
  }

  /**
   * Fetches the next page of search results.
   * Calls the scrollSearch method with the incremented current page number.
   */
  fetchNextPage() {
    // Check if loading is already in progress
    if (!this.loading) {
      // Set loading flag to true
      this.loading = true;

      // Increment the current page number
      this.currentPage++;

      // Call the scrollSearch method with the incremented current page number
      this.scrollSearch(this.currentPage).then(() => {
        // Set loading flag to false when the search operation is complete
        this.loading = false;
      });
    }
  }

  /**
   * Fades in elements when they come into view during scrolling.
   * Adds 'inView' class to elements that are within the viewport.
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
   * Scrolls through the search results to load more items based on the current page.
   * @param currentPage The current page of search results.
   */
  async scrollSearch(currentPage: number) {
    // Show loading indicator
    this.snackbar.showLoading(true);
    try {
      // Check if search form is valid
      if (this.searchForm.valid) {
        // Get form value
        const formValue = this.searchForm.value;
        // Check if search query exists
        if (formValue.search) {
          // Fetch search results for the current page
          const search = await this.movieService.fetchMultiSearch(
            formValue.search,
            currentPage
          );
          // Store new search results
          this.newSearchArray = search.results;
          // Check if new search results exist
          if (this.newSearchArray.length === 0) {
            // Show notification if no more search results available
            this.snackbar.show('No more search available');
            return;
          }
          // Add new search results to the existing array
          this.searchArray.push(...this.newSearchArray);
          // Trigger fade-in animation for new search results
          setTimeout(() => {
            this.elementsArray =
              this.element.nativeElement.querySelectorAll('.animated-fade-in');
            this.fadeIn();
          }, 500);
        }
      }
    } catch (error) {
      // Handle errors during search
      console.error('Error fetching search:', error);
      this.snackbar.show('Error fetching search');
    } finally {
      // Hide loading indicator
      this.snackbar.showLoading(false);
    }
  }

  /**
   * Initiates a search operation and displays the search results.
   * @param currentPage The current page of search results.
   */
  async search(currentPage: number) {
    // Show loading indicator
    this.snackbar.showLoading(true);
    // Reset current page and search array
    this.currentPage = 1;
    this.searchArray = [];
    try {
      // Check if search form is valid
      if (this.searchForm.valid) {
        // Get form value
        const formValue = this.searchForm.value;
        // Check if search query exists
        if (formValue.search) {
          // Fetch search results for the current page
          const search = await this.movieService.fetchMultiSearch(
            formValue.search,
            this.currentPage
          );
          // Store new search results
          this.newSearchArray = search.results;
          // Add new search results to the search array
          this.searchArray.push(...this.newSearchArray);
          // Trigger fade-in animation for new search results
          setTimeout(() => {
            this.elementsArray =
              this.element.nativeElement.querySelectorAll('.animated-fade-in');
            this.fadeIn();
          }, 500);
          // Show notification if no results found
          if (this.newSearchArray.length === 0) {
            this.snackbar.show('No results found');
          } else {
            // Navigate to search page with query parameter
            this.router.navigateByUrl(`/search?query=${formValue.search}`);
          }
        }
      }
    } catch (error) {
      // Handle errors during search
      console.error('Error fetching search:', error);
      this.snackbar.show('Error fetching search');
    } finally {
      // Hide loading indicator
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
