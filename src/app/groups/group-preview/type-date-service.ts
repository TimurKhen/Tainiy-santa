import { computed, Service, signal } from '@angular/core';
import { Group } from '../../interfaces/group/group';

@Service()
export class TypeDateService {
  isDistributionEnded(data: Group) {
    const currentDate = new Date();
    const rawDistDate = data.distribution_date;
    const rawSwapDate = data.swap_date;

    const distributionDate = rawDistDate ? new Date(rawDistDate) : null;
    const swapDate = rawSwapDate ? new Date(rawSwapDate) : null;

    if (!distributionDate || !swapDate) {
      return { type: '', date: currentDate };
    }

    const currentDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    ).getTime();
    const distDay = new Date(
      distributionDate.getFullYear(),
      distributionDate.getMonth(),
      distributionDate.getDate(),
    ).getTime();
    const swapDay = new Date(
      swapDate.getFullYear(),
      swapDate.getMonth(),
      swapDate.getDate(),
    ).getTime();

    if (currentDay === swapDay) {
      return {
        type: 't',
        date: swapDate,
      };
    } else if (currentDay < distDay) {
      return {
        type: 'd',
        date: distributionDate,
      };
    } else if (currentDay > distDay && currentDay <= swapDay) {
      return {
        type: 's',
        date: swapDate,
      };
    } else {
      return { type: '', date: new Date() };
    }
  }
}
