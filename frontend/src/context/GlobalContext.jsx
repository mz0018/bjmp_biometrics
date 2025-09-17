import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [value, setValue] = useState(false);

    return (
        <GlobalContext.Provider value={{ value, setValue }}>
            {children}
        </GlobalContext.Provider>
    )
}