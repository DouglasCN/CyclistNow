import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useHistory } from "react-router-dom";
import api from '../../services/api';

import logo from '../../assets/cycle.png';
import './styles.css';
import Header from '../../components/header';

const Perfil = () => {

    const [newPassword, setNewPassword] = useState('');
    const [data, setData] = useState({
        name: '',
        whatsapp: '',
        email: '',
        password: '',
    })

    const [stylesData, setStylesData] = useState("none");
    const [stylesPassword, setStylesPassword] = useState("none");
    const [stylesInitial, setStylesInitial] = useState("block");

    const history = useHistory();
    const cyclist_id = localStorage.getItem('user');
    const cyclist_name = localStorage.getItem('name') ;
    const cyclist_email = localStorage.getItem('email') ;
    const cyclist_whatsapp = localStorage.getItem('whatsapp') ;

    useEffect(() => {
        if(localStorage.getItem('user') == null){
            return history.push('/');
        }
    });

    function handleDisplayBlockData(){
        setStylesData("block");
        setStylesPassword("none");
        setStylesInitial("none");
    }

    function handleDisplayBlockPassw(){
        setStylesData("none");
        setStylesPassword("block");
        setStylesInitial("none");
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;

        setData({...data, [name]: value});
    }
    function handleNewPassword(event: ChangeEvent<HTMLInputElement>){
        setNewPassword(event.target.value);
        
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        const { name, email, whatsapp, password} = data;
        const id = cyclist_id;
        const newPassword = password;
        console.log(data)
        const newdata ={
            id,
            name,
            email,
            whatsapp,
            currentPassword: password,
            newPassword
        }
        
        const status = await api.put('cyclist', newdata);

        if(status){
            // alert('ponto de coleta criado');
            // history.push('/');
            console.log(status)
        }else {
            console.log(status)
        }
        
    }


    return (
        <div id="page-perfil">
            <Header/>
            <div className="container">
                <div className="info">
                    <h2>{cyclist_name}</h2>
                    <div className="data">
                        <p>Email: {cyclist_email}</p>
                        <p>whatsapp: {cyclist_whatsapp}</p>
                    </div>
                    
                    <div className="buttons">
                        <button className="button-upgrade-data" onClick={handleDisplayBlockData}>Atualizar dados</button>
                        <button className="button-upgrade-passw" onClick={handleDisplayBlockPassw}>Trocar senha</button>
                        <button className="button-delete">Excluir conta</button>
                    </div>
                </div>

                <div className="initial" style={{ display: stylesInitial }}>
                    <h3>Pedalando sempre junto com a gelera!</h3>
                    <img className="shadowImg1"src={logo} alt=""/>
                    <img className="shadowImg2"src={logo} alt=""/>
                    <img className="shadowImg"src={logo} alt=""/>
                </div>

                <div className="upgrade" style={{ display: stylesData }} >
                    <h3>Caso queira atualizar algum dado cadastrado erradamente, basta escrever nos campos e comfirmar sua senha de login.</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="name" className="field-label">Nome:</label>
                                <input 
                                    type="text"
                                    id="name"
                                    name="name"
                                    onChange={handleInputChange}
                                    required
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
                                <label htmlFor="name" className="field-label">Confirmar senha:</label>
                                <input 
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={handleInputChange}
                                    
                                />
                            </div>
                            <div className="field field-button">
                                <button type="submit">Salvar</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="upgrade" style={{ display: stylesPassword }}>
                    <h3>Caso queira trocar de senha, basta escrever no nova senha e confirmar sua senha de login.</h3>
                    <form>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="name" className="field-label">Nova senha:</label>
                                <input 
                                    type="Newpassword"
                                    id="Newpassword"
                                    name="Newpassword"
                                    //onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="whatsapp" className="field-label">Confirmar senha</label>
                                <input 
                                    type="password"
                                    id="password"
                                    name="password"
                                    //onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        
                        <div className="field field-button">
                            <button>Salvar</button>
                        </div>
                        
                    </form>
                </div>
            
            </div>
        </div>
    )
}
export default Perfil;