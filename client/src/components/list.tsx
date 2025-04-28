import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useMutation } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useUsers } from "../hooks/use-users";
import { ListItem } from "./list-item";
import { type User } from "../types";
import { API_ROOT_URL } from "../config/env";

interface Props {
  searchInput: string;
}

export function List(props: Props) {
  const mutation = useMutation({
    mutationFn: (body: { oldIndex: number; newIndex: number }) => {
      return fetch(`${API_ROOT_URL}/users`, {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({ position: body }),
      });
    },
  });

  //
  // Pagination + Infinite scroll feature
  //
  // Setup intersection observer to detect when user scrolls to bottom
  const { ref, inView } = useInView();
  // Setup infinite query
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useUsers(props.searchInput);
  // Automatically fetch next page when user scrolls to bottom
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  //
  // Drag'n'Drop feature
  //

  const [users, setUsers] = useState<User[]>([]);
  React.useEffect(() => {
    if (data) setUsers(data.pages.map((page) => page.results).flat());
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setUsers((items: User[]) => {
        const oldIndex = items.findIndex((o) => o.id === event.active.id);
        const newIndex = items.findIndex((o) => o.id === event.over?.id);

        // Don't update position in DB if the list is *search results*
        if (props.searchInput.trim().length === 0) {
          mutation.mutate({ oldIndex, newIndex });
        }

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  //

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error: {error.message}</div>;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={users} strategy={verticalListSortingStrategy}>
          <ul className="list">
            {users.map((user: User) => (
              <ListItem key={user.id} user={user} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {/* Loading indicator */}
      <div ref={ref}>
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
            ? "Scroll to load more"
            : "No more data to load"}
      </div>
    </>
  );
}
