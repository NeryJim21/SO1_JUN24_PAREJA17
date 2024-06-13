import React from "react";
import { Link } from "react-router-dom"

function NavBar() {
    return(
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-dark py-3">
    <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link text-secondary fw-bold fs-5" aria-current="page" to="/">Datos</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-secondary fw-bold fs-5" aria-current="page" to="/real">Tiempo real</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-secondary fw-bold fs-5" aria-current="page" to="/processtable">Procesos</Link>
                </li>
            </ul>
        </div>
    </div>
</nav>

        </>
    )
}

export default NavBar