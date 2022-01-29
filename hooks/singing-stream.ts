import useSWRImmutable from 'swr/immutable';
import { supabase } from '../utils/supabaseClient';
import type { SingingStreamForSearch, SingingStreamForWatch } from './../types/index';

const PREFIX = 'get-singing-stream-' as const;
const KEYS = {
  search: `${PREFIX}list`,
  watch: `${PREFIX}watch`,
} as const;

export function useSingingStreamsForSearch(keyword: string = '') {
  const { data, error } = useSWRImmutable(`${KEYS.search}-${keyword}`, getForList);
  return {
    streams: data,
    error,
  };
}

export function useSingingStreamForWatch(id: string | undefined) {
  // when id is undefined, do not fetch
  const { data, error } = useSWRImmutable(id ? `${KEYS.watch}-${id}` : null, getForWatch);
  return {
    stream: data,
    error,
  };
}

async function getForWatch(key: string) {
  const match = new RegExp(`${KEYS.watch}-(.*)`).exec(key);
  if (!match) return null;

  const id = match[1];
  const { data, error } = await supabase
    .from<SingingStreamForWatch>('singing_stream')
    .select('start, end, video_id, published_at, song(title, artist), video!video_id(title, url)')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

async function getForList(key: string): Promise<SingingStreamForSearch[] | null> {
  const match = new RegExp(`${KEYS.search}-(.*)`).exec(key);
  if (!match) return null;

  const keyword = match[1];
  const query = supabase
    .from('singing_stream')
    .select('id, start, video_id, published_at, video!video_id(title, url), song(title, artist)');

  if (keyword) {
    query
      .select('id, start, video_id, published_at, video!video_id(title, url), song!inner(title, artist)')
      .ilike('song.title', `%${keyword}%`);
  }
  query
    .order('published_at', {
      nullsFirst: false,
      ascending: false,
    })
    .order('start', {
      ascending: true,
    });

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
