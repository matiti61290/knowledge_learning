import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
    const [collapsedMenu, setCollapsedMenu] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const menuRef = useRef(null)
    const dropdownRef = useRef(null); 
    const { isLogged } = useAuth()

    const toggleMenu = () => {
        setCollapsedMenu(prev => !prev)
    }

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    //Close the collapsed menu is click outside
    useEffect(() => {
        const handleMenuClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setCollapsedMenu(false)
            }
        }

        document.addEventListener("mousedown", handleMenuClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleMenuClickOutside)
        }
    })

    // Close the dropdown menu if click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="navbar-toggler" type="button" aria-label="Toggle navigation" onClick={toggleMenu}>
                <span className="navbar-toggler-icon"></span>
            </button>

            <div ref={menuRef} className={`collapse navbar-collapse ${collapsedMenu ? "show" : ""}`} id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Accueil</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/formations">Nos formations</Link>
                    </li>
                    <li ref={dropdownRef} className={`nav-item dropdown ${dropdownOpen ? "show" : ""}`}>
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen ? "true" : "false"}
                            onClick={(e) => {
                                e.preventDefault();
                                toggleDropdown();
                            }}
                        >
                            Categories
                        </a>
                        <div
                            className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
                            aria-labelledby="navbarDropdown"
                        >
                            <Link className="dropdown-item" to="/category/1">Musique</Link>
                            <Link className="dropdown-item" to="/category/2">Informatique</Link>
                            <Link className="dropdown-item" to="/category/3">Jardinage</Link>
                            <Link className="dropdown-item" to="/category/4">Cuisine</Link>
                        </div>
                    </li>
                    {isLogged ? (
                        <Link className="nav-link" to="/userProfile">Mon profil</Link>
                    ): (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Me connecter</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">M'inscrire</Link>
                            </li>
                        </>
                    )}

                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
