import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';

// type
import { UserFavouriteType } from '../shared/types/movie.type';
import { UserType } from '../shared/types/auth.type';

// service
import { GlobalMovieService } from '../shared/services/global-movie/global-movie.service';
import { SnackbarService } from '../shared/template/snackbar/snackbar.service';
import { GlobalService } from '../shared/services/global.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  showNavbar = true;
  elementsArray!: NodeListOf<Element>;

  userInfo!: UserType;
  usersData!: UserFavouriteType;

  constructor(
    private globalService: GlobalService,
    public movieService: GlobalMovieService,
    private snackbar: SnackbarService,
    private renderer: Renderer2,
    private element: ElementRef
  ) {
    this.userInfo = this.globalService.getMe();
    this.usersData = this.globalService.getUsersData();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.elementsArray =
        this.element.nativeElement.querySelectorAll('.animated-fade-in');
      this.fadeIn();
    }, 500);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.fadeIn();
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
      const distInView =
        elem.getBoundingClientRect().top - window.innerHeight + 20;
      // If the element is in view (above the bottom of the viewport)
      if (distInView < 0) {
        // Add the 'inView' class to the element to trigger the fade-in animation
        this.renderer.addClass(elem, 'inView');
      }
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
