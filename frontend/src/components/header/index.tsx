import React from 'react';
import { FiChevronDown } from "react-icons/fi";
import { useHistory, Link } from 'react-router-dom';

import './styles.css';

const Header = () => {
    const history = useHistory();
    const name = localStorage.getItem('name');

    function handleLogoff(){
        localStorage.clear();
        
        if(localStorage.getItem('user') == null){
            return history.push('/');
        }
    }

    function goMain(){
        history.push('/');
    }

    return (
        <header className="header">
            <h1 className="logo" onClick={goMain}>CyclistNow</h1> 
            <li>
                <p className="header-right" >
                    Bem vindo {name} 
                    <FiChevronDown/>
                </p>
                <ul>
                    <li className="options-user">
                        <button className="button-options" onClick={handleLogoff}>Sair</button> 
                        <button className="button-options"><Link to="/perfil">Editar usuário</Link></button> 
                    </li>
                </ul>
            </li>
        </header>
    )
}

export default Header;