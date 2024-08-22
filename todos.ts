import { TODO_KEY } from "./constants.ts";
import { Todo } from "./types.ts";

export const getAll = async (kv: Deno.Kv): Promise<Todo[]> => {
  const records = kv.list<Todo>({ prefix: [TODO_KEY] });
  const todos = [];
  for await (const t of records) {
    todos.push(t.value);
  }
  return todos;
};

export const getById = async (
  kv: Deno.Kv,
  id: string,
): Promise<Todo | undefined> => {
  const { value } = await kv.get<Todo>([TODO_KEY, id]);
  if (value) {
    return value;
  }
};

export const create = async (
  kv: Deno.Kv,
  record: Omit<Todo, "id">,
): Promise<Todo | undefined> => {
  const id = crypto.randomUUID();
  const todo = { ...record, id };
  const { ok } = await kv.set([TODO_KEY, id], todo);
  if (ok) {
    return todo;
  }
};

export const update = async (
  kv: Deno.Kv,
  id: Todo["id"],
  updates: Todo,
): Promise<Todo | undefined> => {
  const todo = await getById(kv, id);
  if (!todo) {
    return;
  }
  const { id: _id, ...restUpdates } = updates;
  const updatedTodo = { ...todo, ...restUpdates };
  const { ok } = await kv.set([TODO_KEY, id], updatedTodo);
  if (ok) {
    return updatedTodo;
  }
};

export const deleteById = (
  kv: Deno.Kv,
  id: Todo["id"],
): Promise<void> => kv.delete([TODO_KEY, id]);
