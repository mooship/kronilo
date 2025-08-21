import { create } from "zustand";
import { kroniloStoreShape } from "../stores/kroniloStoreShape";
import type { KroniloState } from "../types/store";

export const useKroniloStore = create<KroniloState>()(kroniloStoreShape);
