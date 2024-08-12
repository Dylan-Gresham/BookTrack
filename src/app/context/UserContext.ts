import { createContext } from "react";

let defaultContext: { user: string | null } = {
    user: null
};

export const UserContext = createContext(defaultContext);
