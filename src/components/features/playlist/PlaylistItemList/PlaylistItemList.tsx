import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Box, Divider, Sx } from '@mantine/core';
import { Fragment, useState } from 'react';

import { useSortPlaylistItem } from '../../../../services/playlists/client';
import type { Playlist, PlaylistItemWithMusic, PlaylistWithItem } from '../../../../services/playlists/type';
import type { ApiResponse } from '../../../../types/api';
import { PlaylistItem } from './PlaylistItem/PlaylistItem';

type Props = {
  playlistId: Playlist['id'];
  items: PlaylistItemWithMusic[];
  sx?: Sx;
};

export function PlaylistItemList({ playlistId, items, sx }: Props) {
  const { sortPlaylistItem } = useSortPlaylistItem(playlistId);
  const [activeId, setActiveId] = useState<PlaylistItemWithMusic['id']>();
  const [sorted, setSorted] = useState<PlaylistItemWithMusic[]>([]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
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
    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={items}>
        <Box sx={sx}>
          {items.map((item, i) => (
            <Fragment key={item.id}>
              {i !== 0 ? <Divider sx={{ marginTop: 8, marginBottom: 8 }} /> : null}
              <PlaylistItem item={item} />
            </Fragment>
          ))}
        </Box>
      </SortableContext>

      <DragOverlay>{activeId ? <PlaylistItem item={items.find((item) => item.id === activeId)!} /> : null}</DragOverlay>
    </DndContext>
  );
}
