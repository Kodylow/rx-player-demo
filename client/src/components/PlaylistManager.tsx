import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, GripVertical, X } from 'lucide-react';
import type { PlaylistItem } from '@/lib/types';

interface PlaylistManagerProps {
  playlist: PlaylistItem[];
  currentItem: PlaylistItem | null;
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  onSelect: (item: PlaylistItem) => void;
  onRemove: (id: string) => void;
}

export function PlaylistManager({
  playlist,
  currentItem,
  onReorder,
  onSelect,
  onRemove,
}: PlaylistManagerProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Playlist</h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="playlist-items">
            {(provided) => (
              <ScrollArea className="h-[300px] pr-4">
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {playlist.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-2 p-2 rounded-lg border ${
                            snapshot.isDragging ? 'opacity-50' : ''
                          } ${
                            currentItem?.id === item.id
                              ? 'bg-primary/10 border-primary'
                              : 'bg-card hover:bg-accent'
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium">
                              {item.title || (item.type === 'file' 
                                ? (item.content as File).name 
                                : item.content as string)
                              }
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onSelect(item)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => onRemove(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </ScrollArea>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
}