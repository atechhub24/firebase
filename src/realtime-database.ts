import { getApps, getApp } from "firebase/app";
import {
  ref,
  remove,
  set,
  push,
  update,
  get,
  onValue,
  getDatabase,
} from "firebase/database";

/**
 * Recursively removes all undefined fields from an object or array.
 * Useful for cleaning data before sending to Firebase (which rejects undefined values).
 */
export function removeUndefinedFields<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj
      .map((item) => removeUndefinedFields(item))
      .filter((item) => item !== undefined) as unknown as T;
  } else if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) continue;
      if (typeof value === "object" && value !== null) {
        const cleaned = removeUndefinedFields(value);
        if (cleaned !== undefined) {
          result[key] = cleaned;
        }
      } else {
        result[key] = value;
      }
    }
    return result as T;
  }
  return obj;
}

export const generateSystemInfo = (actionBy: string) => {
  const timestamp = new Date().toISOString();
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const browser = (() => {
    const ua = userAgent;
    if (ua.indexOf("Firefox") > -1) return "Firefox";
    if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) return "Opera";
    if (ua.indexOf("Chrome") > -1) return "Chrome";
    if (ua.indexOf("Safari") > -1) return "Safari";
    if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1)
      return "Internet Explorer";
    return "Unknown";
  })();

  return {
    timestamp,
    actionBy,
    userAgent,
    platform,
    language,
    screenResolution,
    browser,
  };
};

export type MutateData = {
  path: string;
  data?: Record<string, unknown>;
  action: "create" | "update" | "delete" | "createWithId" | "get";
  actionBy?: string;
};

export type ListenOptions = {
  path: string;
  onData: (data: any) => void;
  onError?: (error: Error) => void;
};

export async function mutate({
  path,
  data = {},
  action = "update",
  actionBy = "anonymous",
}: MutateData) {
  if (getApps().length === 0) {
    throw new Error("Firebase not initialized");
  }
  const app = getApp();
  const db = getDatabase(app);
  const systemInfo = generateSystemInfo(actionBy);
  const dbRef = ref(db, path);

  switch (action) {
    case "create":
      await set(
        dbRef,
        removeUndefinedFields({
          ...data,
          createdAt: new Date().toISOString(),
          createdBy: systemInfo,
        })
      );
      break;
    case "createWithId": {
      const newRef = await push(
        dbRef,
        removeUndefinedFields({
          ...data,
          createdAt: new Date().toISOString(),
          createdBy: systemInfo,
        })
      );
      return newRef.key;
    }
    case "update":
      await update(
        dbRef,
        removeUndefinedFields({
          ...data,
          updatedAt: new Date().toISOString(),
          updatedBy: systemInfo,
        })
      );
      break;
    case "delete":
      await remove(dbRef);
      break;
    case "get": {
      const snapshot = await get(dbRef);
      return snapshot.val();
    }
    default:
      throw new Error("Invalid action type");
  }
}

/**
 * Listen to real-time changes at a database path
 * @param options - Configuration object with path, onData callback, and optional onError callback
 * @returns Unsubscribe function to stop listening
 */
export function listen({ path, onData, onError }: ListenOptions) {
  if (getApps().length === 0) {
    throw new Error("Firebase not initialized");
  }

  const app = getApp();
  const db = getDatabase(app);
  const dbRef = ref(db, path);

  const unsubscribe = onValue(
    dbRef,
    (snapshot) => {
      const data = snapshot.val();
      onData(data);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error("Database listen error:", error);
      }
    }
  );

  return unsubscribe;
}

/**
 * Listen to real-time changes with automatic cleanup
 * @param options - Configuration object with path and callbacks
 * @returns Object with unsubscribe function and current data
 */
export function useRealtimeData({ path, onData, onError }: ListenOptions) {
  if (getApps().length === 0) {
    throw new Error("Firebase not initialized");
  }

  const app = getApp();
  const db = getDatabase(app);
  const dbRef = ref(db, path);

  let currentData: any = null;

  const unsubscribe = onValue(
    dbRef,
    (snapshot) => {
      currentData = snapshot.val();
      onData(currentData);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error("Database listen error:", error);
      }
    }
  );

  return {
    unsubscribe,
    getCurrentData: () => currentData,
  };
}
