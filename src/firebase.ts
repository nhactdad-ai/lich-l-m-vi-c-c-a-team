import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { Task } from './types';
import { DEFAULT_TASKS } from './data';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom Database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const TASKS_COLLECTION = 'tasks';

/**
 * Seed initial tasks if collection is empty
 */
async function seedInitialTasksIfNeeded() {
  const q = query(collection(db, TASKS_COLLECTION));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    const batch = writeBatch(db);
    DEFAULT_TASKS.forEach((task) => {
      const docRef = doc(db, TASKS_COLLECTION, task.id);
      batch.set(docRef, task);
    });
    await batch.commit();
    console.log('Successfully seeded default tasks to Firestore');
  }
}

/**
 * Subscribe to tasks from Firestore (triggers in real-time)
 */
export function subscribeToTasks(onUpdate: (tasks: Task[]) => void): () => void {
  // Call seeding first
  seedInitialTasksIfNeeded().catch(err => {
    console.error('Failed to check/seed default tasks:', err);
  });

  const q = query(collection(db, TASKS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const fetchedTasks: Task[] = [];
      snapshot.forEach((doc) => {
        fetchedTasks.push(doc.data() as Task);
      });
      // Sort tasks by STT or creation/original order to be visual
      const sorted = fetchedTasks.sort((a, b) => a.stt.localeCompare(b.stt));
      onUpdate(sorted);
    },
    (error) => {
      console.error('Error listening to tasks collection:', error);
    }
  );
}

/**
 * Add a new task to Firestore
 */
export async function addTaskToFirebase(taskData: Omit<Task, 'id' | 'stt'>, currentTasksLength: number): Promise<void> {
  const newSttNum = currentTasksLength + 1;
  const formattedStt = newSttNum < 10 ? `0${newSttNum}` : `${newSttNum}`;
  const newId = `task-${Date.now()}`;

  const newTask: Task = {
    ...taskData,
    id: newId,
    stt: formattedStt
  };

  const docRef = doc(db, TASKS_COLLECTION, newId);
  await setDoc(docRef, newTask);
}

/**
 * Update an existing task in Firestore
 */
export async function updateTaskInFirebase(task: Task): Promise<void> {
  const docRef = doc(db, TASKS_COLLECTION, task.id);
  await setDoc(docRef, task);
}

/**
 * Delete a task and re-index the STTs of all remaining tasks so the sequence stays clean
 */
export async function deleteTaskFromFirebase(idToDelete: string, currentTasks: Task[]): Promise<void> {
  // Delete the specific document
  const deleteRef = doc(db, TASKS_COLLECTION, idToDelete);
  await deleteDoc(deleteRef);

  // Filter out the deleted task from local state to compute new indexes
  const remaining = currentTasks.filter(t => t.id !== idToDelete);
  
  // Re-index remaining tasks
  const batch = writeBatch(db);
  remaining.forEach((task, index) => {
    const idx = index + 1;
    const formattedStt = idx < 10 ? `0${idx}` : `${idx}`;
    
    // Only update if STT actually changed
    if (task.stt !== formattedStt) {
      const docRef = doc(db, TASKS_COLLECTION, task.id);
      batch.update(docRef, { stt: formattedStt });
    }
  });

  await batch.commit();
}

/**
 * Toggle task status in Firestore
 */
export async function toggleTaskStatusInFirebase(task: Task): Promise<void> {
  const updatedStatus: Task['status'] = task.status === 'hoan_thanh' ? 'dang_cho' : 'hoan_thanh';
  const docRef = doc(db, TASKS_COLLECTION, task.id);
  await setDoc(docRef, { ...task, status: updatedStatus });
}
