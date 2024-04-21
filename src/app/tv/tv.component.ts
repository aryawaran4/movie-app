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

  TopRatedTvs!: TvType[]

  favourite!: FavouriteType;
  usersData!: UserFavouriteType

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
    this.getTopRatedTvs()
  }

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

  async getTopRatedTvs() {
    this.snackbar.showLoading(true)
    try {
      const tvs = await this.tvService.topRatedTvs();
      this.TopRatedTvs = tvs.results;
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
