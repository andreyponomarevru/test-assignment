import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { List } from "./list";
import { useLocalStorage } from "../hooks/use-local-storage";

type Inputs = { searchQuery: string };

function App() {
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const [searchQuery, setSearchQuery] = useLocalStorage<string>(
    "searchInput",
    "",
  );
  const searchInput = watch("searchQuery", searchQuery);
  React.useEffect(() => {
    setSearchQuery(searchInput);
  }, [searchInput, setSearchQuery]);

  return (
    <div className="app">
      <h1>React App</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          defaultValue={searchInput}
          placeholder="Поиск по юзернейму..."
          {...register("searchQuery")}
        />
        {/* Temporarily hide the submit btn */}
        {/*<input type="submit" value="Find by username" />*/}
      </form>

      <List searchInput={searchInput.trim()} />
    </div>
  );
}

export { App };
