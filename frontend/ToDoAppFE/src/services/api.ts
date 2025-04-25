import { Task } from "../types";
import { List } from "../context/FiltersContext";

const API_URL = import.meta.env.VITE_API_URL;

//#region AUTH

export const login = async (data: { username: string; password: string }) => {
  try {
    const response = await fetch(`${API_URL}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Login failed" };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
};

export const register = async (data: { name: string; username: string; password: string }) => {
  try {
    const response = await fetch(`${API_URL}/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Registration failed" };
    }

    return { success: true, message: result.message };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "An error occurred during registration" };
  }
};

//#endregion

//#region TASKS

export const getTasksByUserId = async (userId: number, token: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks?userId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Failed to fetch tasks" };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Get tasks error:", error);
    return { success: false, message: "An error occurred while fetching tasks" };
  }
};

export const createTask = async (task: Omit<Task, "id">, token: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const result = await response.json();
      return { success: false, message: result.message || "Failed to create task" };
    }

    return { success: true };
  } catch (error) {
    console.error("Create task error:", error);
    return { success: false, message: "An error occurred while creating task" };
  }
};

export const editTask = async (task: Task, token: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const result = await response.json();
      return { success: false, message: result.message || "Failed to update task" };
    }

    return { success: true };
  } catch (error) {
    console.error("Update task error:", error);
    return { success: false, message: "An error occurred while updating task" };
  }
};

export const deleteTask = async (taskId: number, token: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return { success: false, message: result.message || "Failed to delete task" };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete task error:", error);
    return { success: false, message: "An error occurred while deleting the task" };
  }
};

//#endregion

//#region LISTS

export const getListsByUserId = async (userId: number, token: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/lists?userId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Failed to fetch lists" };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Get lists error:", error);
    return { success: false, message: "An error occurred while fetching lists" };
  }
};

export const createList = async (data: { name: string; color: string; userId: number }, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      return { success: false, message: result.message || "Failed to create list" };
    }

    return { success: true };
  } catch (error) {
    console.error("Create list error:", error);
    return { success: false, message: "An error occurred while creating list" };
  }
};

export const updateList = async (list: List, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/lists`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(list),
    });

    if (!response.ok) {
      const result = await response.json();
      return { success: false, message: result.message || "Failed to update list" };
    }

    return { success: true };
  } catch (error) {
    console.error("Update list error:", error);
    return { success: false, message: "An error occurred while updating list" };
  }
};

export const deleteList = async (listId: number, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/lists/${listId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return { success: false, message: result.message || "Failed to delete list" };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete list error:", error);
    return { success: false, message: "An error occurred while deleting list" };
  }
};

//#endregion
