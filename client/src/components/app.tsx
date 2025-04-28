import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { List } from "./list";

type Inputs = { searchQuery: string };

function App() {
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  const searchInput = watch(["searchQuery"], { searchQuery: "" });

  return (
    <div className="app">
      <h1>React App</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          defaultValue=""
          placeholder="Поиск по юзернейму..."
          {...register("searchQuery")}
        />
        {/* Temporarily hide the submit btn */}
        {/*<input type="submit" value="Find by username" />*/}
      </form>

      <List searchInput={searchInput[0].trim()} />
    </div>
  );
}

export { App };
