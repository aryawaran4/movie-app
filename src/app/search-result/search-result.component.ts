import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

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
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent {
  showNavbar = true;
  elementsArray!: NodeListOf<Element>;
  searchArray: MediaType[] = []
  newSearchArray!: MediaType[];
  usersData!: UserFavouriteType
  userInfo!: UserType

  query: string | null = null;

  currentPage = 1
  loading = false

  searchForm = new FormGroup({
    search: new FormControl('', Validators.required),
  })

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
    this.userInfo = this.globalService.getMe()
    this.usersData = this.globalService.getUsersData()
  }

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe(params => {
      this.query = params['query'];
      this.searchForm = this.formBuilder.group({
        search: [this.query]
      });
    });
    console.log('new page');
    this.search(this.currentPage)
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.fadeIn();

    const windowHeight = window.innerHeight + 20;
    const scrollY = window.scrollY;
    const bodyHeight = document.body.offsetHeight;

    if (windowHeight + scrollY >= bodyHeight) {
      this.fetchNextPage();
    }
  }

  fetchNextPage() {
    if (!this.loading) {
      this.loading = true;

      this.currentPage++;

      this.scrollSearch(this.currentPage).then(() => {
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

  async scrollSearch(currentPage: number) {
    this.snackbar.showLoading(true)
    try {
      if (this.searchForm.valid) {
        const formValue = this.searchForm.value;
        if (formValue.search) {
          const search = await this.movieService.fetchMultiSearch(formValue.search, this.currentPage);

          this.newSearchArray = search.results;
          if (this.newSearchArray.length === 0) {
            this.snackbar.show('No more search available');
            return;
          }
          this.searchArray.push(...this.newSearchArray);

          setTimeout(() => {
            this.elementsArray =
              this.element.nativeElement.querySelectorAll('.animated-fade-in');
            this.fadeIn();
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error fetching search:', error);
      this.snackbar.show('Error fetching search')
    } finally {
      this.snackbar.showLoading(false)
    }
  }

  async search(currentPage: number) {
    this.snackbar.showLoading(true)
    this.currentPage = 1
    this.searchArray = []
    try {
      if (this.searchForm.valid) {
        const formValue = this.searchForm.value;
        if (formValue.search) {
          const search = await this.movieService.fetchMultiSearch(formValue.search, this.currentPage);

          this.newSearchArray = search.results;

          this.searchArray.push(...this.newSearchArray);
          setTimeout(() => {
            this.elementsArray =
              this.element.nativeElement.querySelectorAll('.animated-fade-in');
            this.fadeIn();
          }, 500);

          if (this.newSearchArray.length === 0) {
            this.snackbar.show('No results found');
          } else {
            this.router.navigateByUrl(`/search?query=${formValue.search}`);
          }

        }
      }
    } catch (error) {
      console.error('Error fetching search:', error);
      this.snackbar.show('Error fetching search')
    } finally {
      this.snackbar.showLoading(false)
    }
  }

  async toggleFavorite(showId: number, mediaType: string): Promise<void> {
    if (this.globalService.getToken()) {
      this.snackbar.showLoading(true)
      try {
        if (this.isFavorite(showId, mediaType)) {
          const favourite = await this.movieService.removeFavourite(this.userInfo.uuid, showId, mediaType);
          this.usersData = this.globalService.getUsersData()
        } else {
          const favourite = await this.movieService.addFavourite(this.userInfo.uuid, showId, mediaType);
          this.usersData = this.globalService.getUsersData()
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        this.snackbar.show('Error toggling favorite');
      }
      finally {
        this.snackbar.showLoading(false)
      }
    } else {
      this.snackbar.show('Need to login first');
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
