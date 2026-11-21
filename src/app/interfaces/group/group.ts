import { MeResponse } from '../../api/user/user';

export interface Group {
  id: number;
  name: string;
  admin_id: number;
  swap_date: string;
  distribution_date: string;
  place: string;
  money: number;
  is_selected_gifters: boolean;
  is_ended: boolean;
  icon: string;
  users: MeResponse[];
  recipient: MeResponse | null;
}
