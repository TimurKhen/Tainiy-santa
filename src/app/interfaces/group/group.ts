export interface Group {
  groupId: string; // UUIDv4
  name: string;
  membersId: number[];
  adminId: number;
  data: {
    swapDate: Date;
    distributionDate: Date;
    where: string;
    money: number;
  };
  isSelectedGifters: boolean;
  isEnded: boolean;
  icon: string;
}
