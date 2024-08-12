import { createContext } from "react";

export interface UserContextType {
    user: string | null;
    updateUser: (user: string | null) => void;
}

export const UserContext = createContext<UserContextType | null>({
    user: null,
    updateUser: () => {},
});
