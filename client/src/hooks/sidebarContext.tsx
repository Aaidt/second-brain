import { createContext, useContext, useState, ReactNode } from "react";

interface SideBarContextType {
    sidebarClose: boolean,
    setSidebarClose: (value: boolean) => void,
    isSharedPage: boolean
}

const SidebarContext = createContext<SideBarContextType | undefined>(undefined)

export function SidebarProvider({ children, isSharedPage }: { children: ReactNode, isSharedPage: boolean }) {
    const [sidebarClose, setSidebarClose] = useState(false);

    return <SidebarContext.Provider value={{ sidebarClose, setSidebarClose, isSharedPage }}>
        {children}
    </SidebarContext.Provider>
}

export function useSideBar() {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error("useSideBar must be used inside a SidebarProvider.")
    }
    return context;
}