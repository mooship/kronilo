import { create } from "zustand";
import { kroniloStoreShape } from "./kroniloStoreShape";

export const useKroniloStore = create(kroniloStoreShape);
