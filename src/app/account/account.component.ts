import { Component } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { UserFavouriteType } from '../shared/types/movie.type';
import { UserType } from '../shared/types/auth.type';
import { MovieService } from '../shared/services/movie/movie.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  showNavbar = true;

  userInfo!: UserType;
  usersData!: UserFavouriteType;

  constructor(
    private globalService: GlobalService,
    public movieService: MovieService
  ) {
    this.userInfo = this.globalService.getMe()
    this.usersData = this.globalService.getUsersData()
  }

  ngOnInit() {
  }

  async toggleFavorite(showId: number, mediaType: string): Promise<void> {
    try {
      if (this.isFavorite(showId, mediaType)) {
        const favourite = await this.movieService.removeFavourite(this.userInfo.uuid, showId, mediaType);
        // this.refreshFavoriteUI(showId, mediaType, 'remove')
        this.usersData = this.globalService.getUsersData()
      } else {
        const favourite = await this.movieService.addFavourite(this.userInfo.uuid, showId, mediaType);
        // this.refreshFavoriteUI(showId, mediaType, 'add')
        this.usersData = this.globalService.getUsersData()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
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