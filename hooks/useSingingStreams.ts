import { useCallback, useEffect, useState } from 'react';
import { SingingStream } from './../types/index';
import { supabase } from './../utils/supabaseClient';

type Params = {
  id?: string;
  ready: boolean;
  limit?: number;
};

export function useSingingStreams(params: {
  id: string;
  ready: boolean;
}): SingingStream;
export function useSingingStreams(params: { ready: boolean }): SingingStream[];

export function useSingingStreams(params: Params) {
  const [data, setData] = useState<SingingStream | SingingStream[]>();

  const fetch = useCallback(async (id?: string) => {
    try {
      let result;
      if (id) {
        result = await fetchSingle(id);
      } else {
        result = await fetchAll();
      }
      if (result.error) {
        throw result.error;
      }
      setData(result.data as SingingStream | SingingStream[]);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (params.ready) {
      fetch(params.id);
    }
  }, [fetch, params.id, params.ready]);

  return data;
}

function fetchSingle(id: string) {
  return supabase
    .from<SingingStream>('singing_stream')
    .select()
    .eq('id', id)
    .single();
}

function fetchAll() {
  return supabase.from<SingingStream[]>('singing_stream').select(
    `
      *,
      video( * )
    `);
}
