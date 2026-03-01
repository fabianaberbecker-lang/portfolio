import { openDB, type IDBPDatabase } from 'idb';
import type { FlowBoard, FlowColumn, FlowCard, Connector, BoardData } from './types';

const DB_NAME = 'flowboard';
const DB_VERSION = 1;
const STORE_NAME = 'boards';

interface FlowBoardDBSchema {
  boards: {
    key: string;
    value: BoardData;
  };
}

let dbPromise: Promise<IDBPDatabase<FlowBoardDBSchema>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<FlowBoardDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'board.id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function loadAllBoards(): Promise<BoardData[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function loadBoard(boardId: string): Promise<BoardData | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, boardId);
}

export async function persistBoard(data: BoardData): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, data);
}

export async function deleteBoard(boardId: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, boardId);
}

export async function persistAllBoards(allData: BoardData[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  // Clear and rewrite all
  await tx.store.clear();
  for (const data of allData) {
    await tx.store.put(data);
  }
  await tx.done;
}
