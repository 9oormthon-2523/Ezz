import { Database } from '../../_utils/supabase/database.types';

export type StreamCardType = Database['public']['Tables']['streaming_rooms']['Row'];
