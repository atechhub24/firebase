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
  action: "create" | "update" | "delete" | "createWithId" | "get" | "onValue";
  actionBy?: string;
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
    case "onValue": {
      const unsubscribe = onValue(dbRef, (snapshot) => {
        return snapshot.val();
      });
      return unsubscribe;
    }
    default:
      throw new Error("Invalid action type");
  }
}
