import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [isLogged, setIsLogged] =useState(false)

    const checkLoginStatus = async () => {
        try {
            const csrfRes = await fetch("http://localhost:3001/csrf/token", {
                credentials: "include"
            })
            const { csrfToken } = await csrfRes.json()

            const res = await fetch("http://localhost:3001/login/logged", {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'csrf-token': csrfToken
                }
            })
            setIsLogged(res.ok)
        } catch(err) {
            console.error("Erreur de vérification du login", err);
            setIsLogged(false); 
        }
    }

    useEffect(() => {
        checkLoginStatus()
    }, [])

    return(
        <AuthContext.Provider value={{isLogged, setIsLogged, checkLoginStatus}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}