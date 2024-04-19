import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { UserFavouriteType } from '../shared/types/movie.type';
import { UserType } from '../shared/types/auth.type';
import { MovieService } from '../shared/services/movie/movie.service';
import { SnackbarService } from '../shared/template/snackbar/snackbar.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  showNavbar = true;
  elementsArray!: NodeListOf<Element>;

  loading$ = new BehaviorSubject<boolean>(false);

  userInfo!: UserType;
  usersData!: UserFavouriteType;

  constructor(
    private globalService: GlobalService,
    public movieService: MovieService,
    private snackbar: SnackbarService,
    private renderer: Renderer2,
    private element: ElementRef,
  ) {
    this.userInfo = this.globalService.getMe()
    this.usersData = this.globalService.getUsersData()
    setTimeout(() => {
      this.elementsArray =
        this.element.nativeElement.querySelectorAll('.animated-fade-in');
      this.fadeIn();
    }, 500);
  }

  ngOnInit() {
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

  async toggleFavorite(showId: number, mediaType: string): Promise<void> {
    this.loading$.next(true); // Start loading
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
      this.loading$.next(false); // Stop loading
      setTimeout(() => {
        this.elementsArray =
          this.element.nativeElement.querySelectorAll('.animated-fade-in');
        this.fadeIn();
      }, 500);
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