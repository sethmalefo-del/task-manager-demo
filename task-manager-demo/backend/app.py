from flask import Flask, jsonify, request  #We are importing the Flask funtionality
from flask_cors import CORS 
import sqlite3
from datetime import datetime

app = Flask(__name__) #This creates the Flask App
# think of "app" = as our backendapplication

## Allow our React frontend to communicate with Flask
CORS(app)  # this mans thats our backend will be running ofa dfferent development ports

DATABASE = "tasks.db"


# -----------------------------------------
# DATABASE CONNECTION
# -----------------------------------------

def get_db_connection(): #this creates a reusable function
    connection = sqlite3.connect(DATABASE) #this connects the SQLite database
    connection.row_factory = sqlite3.Row
    return connection


# -----------------------------------------
# CREATE DATABASE TABLE
# -----------------------------------------

def initialize_database():
    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            completed INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


# -----------------------------------------
# GET ALL TASKS
# -----------------------------------------

@app.route("/api/tasks", methods=["GET"]) #When somebody sends a GET request to /api/tasks, run this function.
def get_tasks():

    connection = get_db_connection() #assigning the task e.g open the fridge

#We add the query database below
#Hey fridge show me everything ===>Select *
#From ===> tasks
#Order by ID Desc ===> returns newest first. & fetchall() the data
#eg = bringing the plates to the table like a waitress in a restuarant
    tasks = connection.execute("""
        SELECT * 
        FROM tasks
        ORDER BY id DESC
    """).fetchall()

    connection.close()

    task_list = []

    for task in tasks:
        task_list.append({
            "id": task["id"],
            "title": task["title"],
            "description": task["description"],
            "completed": bool(task["completed"]),
            "created_at": task["created_at"]
        })

    return jsonify(task_list)


# -----------------------------------------
# CREATE TASK
# -----------------------------------------

@app.route("/api/tasks", methods=["POST"])
def create_task():

    data = request.get_json()  #I want to Ad a new dish ==> it does'nt change the fridge

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    title = data.get("title", "").strip() #taking out the title from the box
    description = data.get("description", "").strip()

    if not title:
        return jsonify({
            "error": "Title is required"
        }), 400

    connection = get_db_connection()

    cursor = connection.execute("""
        INSERT INTO tasks
        (title, description, completed, created_at)
        VALUES (?, ?, ?, ?)
    """, (
        title,
        description,
        0,
        datetime.now().isoformat()
    ))

    connection.commit()

    task_id = cursor.lastrowid

    connection.close()

    return jsonify({
        "message": "Task created successfully",
        "id": task_id
    }), 201


# -----------------------------------------
# UPDATE TASK
# -----------------------------------------

@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    completed = data.get("completed")

    if not isinstance(completed, bool):
        return jsonify({
            "error": "completed must be true or false"
        }), 400

    connection = get_db_connection()

    cursor = connection.execute("""
        UPDATE tasks
        SET completed = ?
        WHERE id = ?
    """, (
        int(completed),
        task_id
    ))

    connection.commit()

    if cursor.rowcount == 0:
        connection.close()

        return jsonify({
            "error": "Task not found"
        }), 404

    connection.close()

    return jsonify({
        "message": "Task updated successfully"
    })


# -----------------------------------------
# DELETE TASK
# -----------------------------------------

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    connection = get_db_connection()

    cursor = connection.execute("""
        DELETE FROM tasks
        WHERE id = ?
    """, (task_id,))

    connection.commit()

    if cursor.rowcount == 0:
        connection.close()

        return jsonify({
            "error": "Task not found"
        }), 404

    connection.close()

    return jsonify({
        "message": "Task deleted successfully"
    })


# -----------------------------------------
# START APPLICATION
# -----------------------------------------

if __name__ == "__main__":

    initialize_database()

    app.run(
        debug=True,
        port=5000
    )