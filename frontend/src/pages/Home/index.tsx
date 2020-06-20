import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiLogIn, FiUser, FiLock } from "react-icons/fi";
import api from '../../services/api';

import './styles.css';

import logo from '../../assets/cycle.png';
import sombra from '../../assets/Sobra.png';

const Home = () => {
    const [styleLogin, setStyleLogin] = useState("none");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();
    
    useEffect(() => {
        if(localStorage.getItem('user') != null){
            return history.push('/main');
        }
    });

    function handleDisplayBlock(){
        setStyleLogin("block");
    }

    function handleDisplayNone(){
        setStyleLogin("none");
    }

    function handleEmail(event: ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
        
    }

    function handlePassword(event: ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value);
        
    }

    async function handleLogin(event: FormEvent){
        event.preventDefault();
        const data = {
            email,
            password
        }
        
        const cyclist = await api.post('logon', data) ;

        if(cyclist.data.logon === "success"){
            localStorage.setItem('user', cyclist.data.cyclist.id);
            localStorage.setItem('name', cyclist.data.cyclist.name);
            history.push("/main");
        }
    }
    
    return (
        <div id="page-home">
            <div id="login" style={{ display: styleLogin }}>
                <div className="container-login">
                    <form className="form" onSubmit={handleLogin}>
                        <h1 className="logo-login" >CyclistNow</h1>
                        {/* <label htmlFor="text" className="label-login" >E-mail</label> */}
                        <div className="div-input-login">
                            <span>
                                <FiUser/>
                            </span>
                            <input 
                                type="email" 
                                className="input-login" 
                                placeholder="Insira seu e-mail"
                                onChange={handleEmail}
                            />
                        </div>
                        {/* <label htmlFor="password" className="label-login" >Senha</label> */}
                        <div className="div-input-login">
                            <span>
                                <FiLock/>
                            </span>
                            <input 
                                type="password" 
                                className="input-login" 
                                placeholder="Insira sua senha" 
                                onChange={handlePassword}
                            />
                        </div>
                        <button type="submit" className="button-login">Entrar</button>

                        <div onClick={handleDisplayNone} className="button-close" > <span> Fechar </span> </div>
                    </form>
                </div>
            </div>
            <div className="content" >
                <header>
                    <h1>CyclistNow</h1>
                </header>
 
                <main className="container">
                    <div className="description">
                        <h1>Venha <span>pedalar</span> conosco</h1>
                        <p>Não saia por ai pedalando sozinho, aqui você encontrara grandes “amantes de pedais” para pedalar juntos.</p>
                        <button className="button" onClick={handleDisplayBlock}>
                            <span>
                                <FiLogIn/>
                            </span>
                            <strong>
                                Fazer login
                            </strong>
                        </button>
                        <Link to='/create-user'> 
                            <strong>Não tenho conta, quero fazer parte dos amantes de pedais.</strong>
                        </Link>
                    </div>    
                    <div>
                        <img className="ShadowImg"src={sombra} alt=""/>
                        <img className="cycleImg" src={logo} alt="cycle"/>
                    </div>                  
                </main>
            </div>
        </div>
    )
}

export default Home;