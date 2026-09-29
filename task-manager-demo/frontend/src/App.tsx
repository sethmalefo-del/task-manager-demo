import { FormEvent, useEffect, useState } from "react";
import "./index.css";

// defined the structure of a task
interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/tasks";

  // -----------------------------------------
  // GET TASKS -
  // The <Task[]> tells TypeScript that this state contains an array of Task objects.
  // -----------------------------------------

  async function loadTasks() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }

      const data: Task[] = await response.json();

      setTasks(data);

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }


  // -----------------------------------------
  // LOAD TASKS WHEN COMPONENT STARTS
  // -----------------------------------------

  useEffect(() => {
    loadTasks();
  }, []);


  // -----------------------------------------
  // CREATE TASK
  // -----------------------------------------

  async function handleSubmit(event: FormEvent) {

    event.preventDefault();

    //Event error handling
    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          title,
          description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      setTitle("");
      setDescription("");

      await loadTasks();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  }


  // -----------------------------------------
  // UPDATE TASK
  // -----------------------------------------

  async function toggleTask(task: Task) {

    try {

      const response = await fetch(
        `${API_URL}/${task.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            completed: !task.completed
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      await loadTasks();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }


  // -----------------------------------------
  // DELETE TASK
  // -----------------------------------------

  async function deleteTask(id: number) {

    try {

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await loadTasks();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }


  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="container">

      <header>
        <h1>Task Manager</h1>

        <p>
          React + TypeScript + Flask + SQLite
        </p>
      </header>


      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>

      </form>


      {error && (
        <div className="error">
          {error}
        </div>
      )}


      <section>

        <h2>Tasks</h2>

        {tasks.length === 0 && (
          <p>No tasks available.</p>
        )}


        {tasks.map((task) => (

          <article
            key={task.id}
            className={
              task.completed
                ? "task completed"
                : "task"
            }
          >

            <div>

              <h3>{task.title}</h3>

              <p>{task.description}</p>

            </div>


            <div className="actions">

              <button
                onClick={() => toggleTask(task)}
              >
                {task.completed
                  ? "Mark Pending"
                  : "Complete"}
              </button>

              <button
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>

            </div>

          </article>

        ))}

      </section>

    </div>
  );
}

export default App;