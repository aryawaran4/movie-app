import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'minutesToHoursMinutes' })
export class MinutesToHoursMinutesPipe implements PipeTransform {
  transform(minutes: number | null): string {
    if (minutes === null || isNaN(minutes) || minutes < 0) {
      return '';
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const hoursDisplay = hours > 0 ? hours + 'h ' : '';
    const minutesDisplay = remainingMinutes > 0 ? remainingMinutes + 'm' : '';

    return hoursDisplay + minutesDisplay;
  }
}
