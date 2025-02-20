"use client";

import { z } from "zod";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Info, Loader2, Plus, Trash } from "lucide-react";
import { memo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import UserStoryDialogUpdate from "./user-story-dialog-update";
import { updatePlanningPokerSchema } from "../_libs/planning-poker";
import {
  useCreateUserStory,
  useGetUserStoriesByPlanningPokerId,
  useRemoveUserStory,
  useUpdateUserStoryRanks,
} from "../_hooks/user-story.hook";
import { useToast } from "@/hooks/use-toast";

interface UserStoriesTabProps {
  disabled: boolean;
}

const UserStoriesTab = memo(({ disabled }: UserStoriesTabProps) => {
  const { toast } = useToast();
  const { watch, setValue } =
    useFormContext<z.infer<typeof updatePlanningPokerSchema>>();
  const userStories = watch("userStories");

  const { data: serverUserStories, isLoading: isLoadingStories } =
    useGetUserStoriesByPlanningPokerId();
  const { mutate: updateRanks, isPending } = useUpdateUserStoryRanks();
  const { mutate: createStory, isPending: isCreating } = useCreateUserStory();
  const { mutate: deleteStory } = useRemoveUserStory();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = userStories.findIndex((story) => story.id === active.id);
    const newIndex = userStories.findIndex((story) => story.id === over.id);

    const newUserStories = arrayMove(userStories, oldIndex, newIndex).map(
      (story, index) => ({
        ...story,
        rank: index + 1,
      })
    );

    setValue(
      "userStories",
      newUserStories.map((story) => ({ ...story, rank: story.rank.toString() }))
    );
    updateRanks(
      newUserStories.map((story) => ({
        userStoryId: story.id,
        rank: story.rank.toString(),
      }))
    );
  };

  const addStory = () => {
    createStory(undefined, {
      onSuccess: (newStory) => {
        // Update the form state with the new story
        const updatedStories = [...userStories, newStory];
        setValue("userStories", updatedStories);

        toast({
          title: "Success",
          description: "New story added successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to add new story",
          variant: "destructive",
        });
      },
    });
  };

  const removeStory = (userStoryId: string) => {
    deleteStory(userStoryId);
  };

  useEffect(() => {
    if (serverUserStories) {
      setValue("userStories", serverUserStories);
    }
  }, [serverUserStories, setValue]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs hidden sm:block">
            ({userStories.length})
          </span>
        </div>
        <Button
          variant="outline"
          type="button"
          onClick={addStory}
          disabled={disabled || isCreating}
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          &nbsp;Ajouter une story
        </Button>
      </div>
      {userStories.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Aucune user story</AlertTitle>
          <AlertDescription>Lancez vous !</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-2 relative">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={userStories}
            strategy={verticalListSortingStrategy}
          >
            {userStories.map((story) => (
              <SortableItem
                id={story.id}
                key={`user-story-${story.id}`}
                title={story.title}
              >
                {isPending && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                )}

                <div className="flex items-center justify-end col-span-1 sm:col-span-2">
                  <UserStoryDialogUpdate userStory={story} />
                  <Button
                    variant="ghost"
                    title="Supprimer cette story"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStory(story.id);
                    }}
                    type="button"
                    disabled={disabled}
                  >
                    <Trash />
                  </Button>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
});

UserStoriesTab.displayName = "UserStoriesTab";

const SortableItem = ({
  children,
  id,
  title,
}: {
  children: React.ReactNode;
  id: string;
  title: string;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="p-2 border rounded-lg odd:bg-gray-50 flex flex-col w-full gap-2 sm:grid sm:grid-cols-8 md:gap-0 active:bg-indigo-300"
    >
      <div
        {...listeners}
        className="flex items-center gap-4 col-span-6 sm:col-span-6"
      >
        <GripVertical size={20} className="hover:cursor-move" />
        <span className="text-sm">{title}</span>
      </div>
      {children}
    </div>
  );
};

export default UserStoriesTab;
