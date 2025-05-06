import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "@tanstack/react-query";
import { API_ROOT_URL } from "../config/env";
import { User } from "../types";

interface Props {
  user: User;
}

export function ListItem(props: Props) {
  // Make item sortable
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ resizeObserverConfig: {}, id: props.user.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Save checkbox on server
  const mutation = useMutation({
    mutationFn: (body: { id: number; isChecked: boolean }) => {
      return fetch(`${API_ROOT_URL}/users`, {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(body),
      });
    },
  });
  const [checked, setChecked] = React.useState(props.user.isChecked);
  function handleChange(id: number) {
    mutation.mutate({ id, isChecked: !checked });
    setChecked(!checked);
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="list-item"
    >
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => {
            handleChange(props.user.id);
          }}
        ></input>
        <span className="item-id">(ID: {props.user.id})</span>
        {props.user.username}
        {mutation.isPending ? (
          "Saving..."
        ) : (
          <>
            {mutation.isError ? <div>An error occurred</div> : null}
            {mutation.isSuccess ? <div>Server state updated!</div> : null}
          </>
        )}
      </label>
    </li>
  );
}
