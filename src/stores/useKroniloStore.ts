import { create } from "zustand";
import type { KroniloState } from "../types/store";
import { kroniloStoreShape } from "./kroniloStoreShape";

export const useKroniloStore = create<KroniloState>()(kroniloStoreShape);
