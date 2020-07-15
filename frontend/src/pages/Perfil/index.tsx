import React from 'react';

import './styles.css';
import Header from '../../components/header';

const Perfil = () => {
    
    return (
        <div id="page-perfil">
            <Header/>
            <div className="container">
                <div className="info"></div>
                <div className="att"></div>
            </div>
        </div>
    )
}
export default Perfil;