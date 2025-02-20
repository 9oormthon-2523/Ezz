export interface StreamCardType {
  uid: string; // uuid
  title: string;
  start_time: string; // timestamp
  is_active: boolean;
  audience_cnt: number;
  nickname: string;
  thumbnail: string;
  profile_img: string;
  tags: string[];
}
