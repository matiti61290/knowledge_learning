import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [isLogged, setIsLogged] =useState(false)
    const [csrfToken, setCsrfToken] = useState(null)

    const checkLoginStatus = async () => {
        try {
            const csrfRes = await fetch("http://localhost:3001/csrf/token", {
                credentials: "include"
            })
            const csrfData = await csrfRes.json()
            setCsrfToken(csrfData.csrfToken)

            const res = await fetch("http://localhost:3001/login/logged", {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'x-csrf-token': csrfData.csrfToken
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
        <AuthContext.Provider value={{isLogged, setIsLogged, checkLoginStatus, csrfToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}