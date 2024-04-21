import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { SnackbarService } from '../shared/template/snackbar/snackbar.service';
import { UserType } from '../shared/types/auth.type';
import { TvType, FavouriteType, UserFavouriteType } from '../shared/types/movie.type';
import { MoviesService } from '../movies/movies.service';
import { TvService } from './tv.service';
import { GlobalMovieService } from '../shared/services/global-movie/global-movie.service';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.scss']
})
export class TvComponent {
  showNavbar = true;
  elementsArray!: NodeListOf<Element>;
  userInfo!: UserType;

  TopRatedTvs: TvType[] = []
  newTopRatedTvs!: TvType[]

  favourite!: FavouriteType;
  usersData!: UserFavouriteType

  currentPage = 1
  loading = false

  constructor(
    private globalService: GlobalService,
    public movieService: GlobalMovieService,
    public tvService: TvService,
    private snackbar: SnackbarService,
    private renderer: Renderer2,
    private element: ElementRef,
  ) {
    this.userInfo = this.globalService.getMe()
    this.usersData = this.globalService.getUsersData()
  }

  ngOnInit() {
    this.getTopRatedTvs(this.currentPage)
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
      this.getTopRatedTvs(this.currentPage).then(() => {
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

  async getTopRatedTvs(pageNumber: number) {
    this.snackbar.showLoading(true)
    try {
      const tvs = await this.tvService.getTopRatedTvs(pageNumber);
      this.newTopRatedTvs = tvs.results;
      console.log(this.newTopRatedTvs);

      if (this.newTopRatedTvs.length === 0) {
        // No more Tvs available, stop fetching
        return;
      }
      this.TopRatedTvs.push(...this.newTopRatedTvs);
      setTimeout(() => {
        this.elementsArray =
          this.element.nativeElement.querySelectorAll('.animated-fade-in');
        this.fadeIn();
      }, 500);
    } catch (error) {
      console.error('Error fetching tvs:', error);
      // this.snackbar.show('Error fetching tvs');
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
      if (mediaType === 'tv') {
        return user.favourites.tv.some((tv) => tv.id === showId);
      } else if (mediaType === 'tv') {
        return user.favourites.tv.some((tvShow) => tvShow.id === showId);
      }
    }
    return false;
  }

}
