import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, CSSProperties, Divider } from '@mantine/core';
import { Fragment, useState } from 'react';

import { useSortPlaylistItem } from '../../../../services/playlists/client';
import type { Playlist, PlaylistItemWithMusic, PlaylistWithItem } from '../../../../services/playlists/type';
import type { ApiResponse } from '../../../../types/api';
import { PlaylistItem } from './PlaylistItem/PlaylistItem';

type Props = {
  playlistId: Playlist['id'];
  items: PlaylistItemWithMusic[];
  sortable?: boolean;
};

export function PlaylistItemList({ playlistId, items, sortable = false }: Props) {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const { sortPlaylistItem } = useSortPlaylistItem(playlistId);
  const [activeId, setActiveId] = useState<PlaylistItemWithMusic['id']>();

  function handleDragStart(event: DragStartEvent) {
    if (!sortable) return;
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!sortable) return;

    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const sortedItems = arrayMove(items, oldIndex, newIndex);

      sortPlaylistItem(
        { sortedIds: sortedItems.map((item) => item.id) },
        {
          optimisticData: (currentData?: ApiResponse<PlaylistWithItem>) => {
            if (!currentData || !currentData.data) return {};

            return { data: { ...currentData.data, items: sortedItems } };
          },
        },
      );
    }
    setActiveId(undefined);
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} disabled={!sortable} strategy={verticalListSortingStrategy}>
        <Box>
          {items.map((item, i) => (
            <Fragment key={item.id}>
              {i !== 0 ? <Divider style={{ marginTop: 8, marginBottom: 8 }} /> : null}
              <PlaylistItem item={item} sortable={sortable} />
            </Fragment>
          ))}
        </Box>
      </SortableContext>

      <DragOverlay>{activeId ? <PlaylistItem item={items.find((item) => item.id === activeId)!} /> : null}</DragOverlay>
    </DndContext>
  );
}
