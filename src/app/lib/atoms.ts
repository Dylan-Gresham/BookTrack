import { atom } from "jotai";
import { Config } from "./config";

export const userAtom = atom<string | null>(null);
export const configAtom = atom<Config | undefined>(undefined);
