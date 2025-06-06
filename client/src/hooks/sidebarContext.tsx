import { createContext, useContext, useState, ReactNode } from "react";

interface SideBarContextType {
    sidebarClose: boolean,
    setSidebarClose: (value: boolean) => void
}

const SidebarContext = createContext<SideBarContextType | undefined>(undefined)

export const SidebarProvider = ({ children }: {children: ReactNode}) => {
    const [sidebarClose, setSidebarClose] = useState(false);

    return <SidebarContext.Provider value={{sidebarClose, setSidebarClose}}>
        {children}
    </SidebarContext.Provider>
}

export const useSideBar = () => {
    const context = useContext(SidebarContext);

    if(!context){
        throw new Error("useSideBar must be used inside a SidebarProvider.")
    }
    return context;
}