import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../shared/services/global.service';
import { GlobalMovieService } from '../shared/services/global-movie/global-movie.service';
import { SnackbarService } from '../shared/template/snackbar/snackbar.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
    this.search(this.currentPage)
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
      this.search(this.currentPage).then(() => {
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

  async search(pageNumber: number) {
    this.snackbar.showLoading(true);

    try {
      if (this.searchForm.valid) {
        const formValue = this.searchForm.value;
        if (formValue.search) {
          console.log(formValue.search);
          const search = await this.movieService.fetchMultiSearch(formValue.search, pageNumber);
          this.newSearchArray = search.results;

          if (this.newSearchArray.length === 0) {
            // No more search available, stop fetching
            this.snackbar.show('No more search available');
            return;
          }
          this.searchArray.push(...this.newSearchArray);
          setTimeout(() => {
            this.elementsArray =
              this.element.nativeElement.querySelectorAll('.animated-fade-in');
            this.fadeIn();
          }, 500);

          if (this.searchArray.length === 0) {
            console.log('No results found.');
            this.snackbar.show('No results found');
          } else {
            this.router.navigate(['/search'], { queryParams: { query: formValue.search } });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
      this.snackbar.show('An error occurred during search');
    } finally {
      this.snackbar.showLoading(false);
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
        // this.snackbar.show('Error toggling favorite');      
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
