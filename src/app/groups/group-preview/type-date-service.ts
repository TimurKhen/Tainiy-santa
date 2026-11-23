import { computed, Service, signal } from '@angular/core';
import { Group } from '../../interfaces/group/group';

export type DateStageType = 'd' | 's' | 't' | '';

export interface DistributionStageResult {
  type: DateStageType;
  date: Date;
}

@Service()
export class TypeDateService {
  private parseDate(value: string | Date | null | undefined): Date | null {
    if (!value) return null;

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (dateOnlyMatch) {
      const year = Number(dateOnlyMatch[1]);
      const month = Number(dateOnlyMatch[2]) - 1;
      const day = Number(dateOnlyMatch[3]);
      const localDate = new Date(year, month, day);
      return Number.isNaN(localDate.getTime()) ? null : localDate;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private toStartOfDayTimestamp(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }

  isDistributionEnded(data: Group): DistributionStageResult {
    const now = new Date();

    if (data.is_ended) {
      return { type: '', date: now };
    }

    const distributionDate = this.parseDate(data.distribution_date);
    const swapDate = this.parseDate(data.swap_date);

    if (!distributionDate || !swapDate) {
      return { type: '', date: now };
    }

    const currentDay = this.toStartOfDayTimestamp(now);
    const distDay = this.toStartOfDayTimestamp(distributionDate);
    const swapDay = this.toStartOfDayTimestamp(swapDate);

    if (currentDay === swapDay) {
      return { type: 't', date: swapDate };
    }

    if (data.is_selected_gifters) {
      if (currentDay < swapDay) {
        return { type: 's', date: swapDate };
      }
      return { type: '', date: now };
    }

    if (currentDay < distDay) {
      return { type: 'd', date: distributionDate };
    }

    if (currentDay >= distDay && currentDay < swapDay) {
      return { type: 's', date: swapDate };
    }

    return { type: '', date: now };
  }
}
