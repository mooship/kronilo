import { create } from "zustand";
import { kroniloStoreShape } from "./kroniloStoreShape";

/**
 * Zustand store hook for Kronilo application state.
 *
 * Provides access to global state and actions defined in kroniloStoreShape.
 *
 * @see kroniloStoreShape for state shape and actions
 */
export const useKroniloStore = create(kroniloStoreShape);
