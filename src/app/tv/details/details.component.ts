import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// service
import { GlobalMovieService } from 'src/app/shared/services/global-movie/global-movie.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SnackbarService } from 'src/app/shared/template/snackbar/snackbar.service';
import { VideoDialogService } from 'src/app/shared/template/video-dialog/video-dialog.service';

// type
import { UserType } from 'src/app/shared/types/auth.type';
import {
  UserFavouriteType,
  TvDetailsType,
  CastMemberType,
} from 'src/app/shared/types/movie.type';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class TvDetailsComponent {
  notfound = false;
  showNavbar = true;
  elementsArray!: NodeListOf<Element>;

  userInfo!: UserType;
  usersData!: UserFavouriteType;

  tv!: TvDetailsType;
  castLists!: CastMemberType[];

  idParam!: number;
  isSmallScreen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private globalService: GlobalService,
    public movieService: GlobalMovieService,
    private snackbar: SnackbarService,    
    private videoDialogService: VideoDialogService
  ) {
    this.userInfo = this.globalService.getMe();
    this.usersData = this.globalService.getUsersData();
  }

  ngOnInit() {
    this.onResize('');
    this.route.params.subscribe((params) => {
      this.idParam = params['id'];
    });
    this.getDetailsTv();
    this.getCastList();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 768;
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

  /**
   * Fetches the details of a TV show.
   * @returns A Promise that resolves with the TV show details.
   */
  async getDetailsTv(): Promise<void> {
    // Show loading indicator while fetching TV show details
    this.snackbar.showLoading(true);
    try {
      // Fetch the details of the TV show with the specified ID
      const details = await this.movieService.getTvDetails(this.idParam);
      // Store the fetched TV show details
      this.tv = details;
    } catch (error) {
      // Handle errors during fetching TV show details
      console.error('Error fetching TV show details:', error);
      // Set 'notfound' flag to true to indicate TV show not found
      this.notfound = true;
      // Show error message to the user
      this.snackbar.show('Error fetching TV show details');
    } finally {
      // Hide loading indicator regardless of success or failure
      this.snackbar.showLoading(false);
    }
  }

  /**
   * Fetches the cast list for a tv.
   * @returns A Promise that resolves with the cast list.
   */
  async getCastList(): Promise<void> {
    // Show loading indicator while fetching cast list
    this.snackbar.showLoading(true);
    try {
      // Fetch the cast list for the tv with the specified ID
      const casts = await this.movieService.getCastList(this.idParam, 'tv');
      // Store the fetched cast list
      this.castLists = casts;
    } catch (error) {
      // Handle errors during fetching cast list
      console.error('Error fetching cast list:', error);
      // Show error message to the user
      this.snackbar.show('Error fetching cast list');
    } finally {
      // Hide loading indicator regardless of success or failure
      this.snackbar.showLoading(false);
    }
  }

  /**
   * Opens a video dialog for a given link ID and media type.
   * @param linkId The ID of the link.
   * @param mediaType The type of media (movie or TV).
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
}
