import { Task } from "../types";
import { List } from "../context/FiltersContext";

// Definizione della URL base per tutte le chiamate API
const API_URL = import.meta.env.VITE_API_URL;

//#region AUTH

/**
 * LOGIN
 * - Invia username e password tramite POST.
 * - Se va a buon fine, restituisce token e dati utente.
 */
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
    return { success: false, message: "An error occurred during login" };
  }
};

/**
 * REGISTRAZIONE
 * - Richiede nome, username e password.
 * - Se va a buon fine, restituisce messaggio di conferma.
 */
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
    return { success: false, message: "An error occurred during registration" };
  }
};

//#endregion

//#region TASKS

/**
 * Recupera tutte le task dell'utente autenticato.
 * - Richiede userId e token JWT di autenticazione.
 */
export const getTasksByUserId = async (userId: number, token: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks?userId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Token passato nell'header
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Failed to fetch tasks" };
    }
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: "An error occurred while fetching tasks" };
  }
};

/**
 * Crea una nuova task per l'utente.
 * - Richiede i dati della task (senza id) e token.
 */
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
    return { success: false, message: "An error occurred while creating task" };
  }
};

/**
 * Modifica una task esistente.
 * - Richiede oggetto task completo di id, e token.
 */
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
    return { success: false, message: "An error occurred while updating task" };
  }
};

/**
 * Cancella una task esistente.
 * - Richiede ID della task e token.
 */
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
    return { success: false, message: "An error occurred while deleting the task" };
  }
};

//#endregion

//#region LISTS

/**
 * Recupera tutte le liste dell'utente autenticato.
 * - Richiede userId e token.
 */
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
    return { success: false, message: "An error occurred while fetching lists" };
  }
};

/**
 * Crea una nuova lista legata all'utente.
 * - Richiede nome, colore, userId e token.
 */
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
    return { success: false, message: "An error occurred while creating list" };
  }
};

/**
 * Modifica una lista esistente.
 * - Richiede un oggetto Lista e token.
 */
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
    return { success: false, message: "An error occurred while updating list" };
  }
};

/**
 * Cancella una lista.
 * - Richiede un listId e token.
 */
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
