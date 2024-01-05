import type { Activity } from '@prisma/client';
import useSWR from 'swr';

import type { ApiResponse } from '../../types/api';
import { apiClient } from '../apiClient';

const KEY = '/api/activities';

export function useActivities() {
  const { data, ...rest } = useSWR<ApiResponse<Activity[]>>(KEY, apiClient);

  return { activities: data?.data, ...rest };
}
