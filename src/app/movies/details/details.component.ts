import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalMovieService } from 'src/app/shared/services/global-movie/global-movie.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SnackbarService } from 'src/app/shared/template/snackbar/snackbar.service';
import { VideoDialogService } from 'src/app/shared/template/video-dialog/video-dialog.service';
import { UserType } from 'src/app/shared/types/auth.type';
import { CastMemberType, CrewMemberType, MovieDetailsType, UserFavouriteType } from 'src/app/shared/types/movie.type';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class MovieDetailsComponent {
  showNavbar = true;
  elementsArray!: NodeListOf<Element>;

  userInfo!: UserType;
  usersData!: UserFavouriteType;

  movie!: MovieDetailsType
  castLists!: CastMemberType[]

  idParam!: number
  isSmallScreen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private globalService: GlobalService,
    public movieService: GlobalMovieService,
    private snackbar: SnackbarService,
    private renderer: Renderer2,
    private element: ElementRef,
    private videoDialogService: VideoDialogService
  ) {
    this.userInfo = this.globalService.getMe()
    this.usersData = this.globalService.getUsersData()
  }

  ngOnInit() {
    this.onResize('')
    this.route.params.subscribe(params => {
      this.idParam = params['id'];
    });
    this.getDetailsMovie()
    this.getCastList()
  }


  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.fadeIn();
  }
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 768;
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

  async getDetailsMovie() {
    this.snackbar.showLoading(true)
    try {
      const details = await this.movieService.getMovieDetails(this.idParam);
      this.movie = details
      console.log(this.movie);

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

  async getCastList() {
    this.snackbar.showLoading(true)
    try {
      const casts = await this.movieService.getCastList(this.idParam, 'movie');
      this.castLists = casts
      console.log(this.castLists);

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
}
