import React, { useState, ChangeEvent, FormEvent } from 'react';
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/cycle.png';

const CreateUser = () => {
    const [confirmPassword, setConfirmPassword] = useState('');
    const [warning, setWarning] = useState('');

    const [data, setData] = useState({
        name: '',
        whatsapp: '',
        email: '',
        password: '',
    })

    const history = useHistory();

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;

        setData({...data, [name]: value});
    }
    function handleConfirmPassword(event: ChangeEvent<HTMLInputElement>){
        setConfirmPassword(event.target.value);
        
    }


    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        const { name, email, whatsapp, password} = data;


        if(confirmPassword === password){

            const newdata ={
                name,
                email,
                whatsapp,
                password
            }
            
            const status = await api.post('cyclist', newdata);

            if(status){
                alert('ponto de coleta criado');
                history.push('/');
            }else {
                console.log(status)
            }
        }
        else{
           setWarning('warning');
        }
        
    }

    return (
        <div id="page-create-user">
            <img className="shadowImg"src={logo} alt=""/>
            <div className="content">
                <header>
                    <h1>CyclistNow</h1>
                </header>
                <div className="container">
                    <p>Cadastrar como ciclista</p>
                    <form onSubmit={handleSubmit}>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="name" className="field-label">Nome:</label>
                                <input 
                                    type="text"
                                    id="name"
                                    name="name"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="whatsapp" className="field-label">Whatsapp</label>
                                <input 
                                    type="text"
                                    id="whatsapp"
                                    name="whatsapp"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="email" className="field-label">E-mail:</label>
                            <input type="email" 
                                id="email"
                                name="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="password" className="field-label">Senha:</label>
                                <input 
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="confirmPassword" className="field-label">Confirmar senha:</label>
                                <input 
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    onChange={handleConfirmPassword}
                                    className={warning}
                                />
                            </div>

                        </div>
                        <div className="buttons">
                            <Link to="/" className="button-back">
                                Voltar
                            </Link>

                            <button type="submit" className="button-submit">Salvar</button>
                        </div>
                        
                    </form>
                </div>
            </div>
            
        </div>
    )
}
export default CreateUser;