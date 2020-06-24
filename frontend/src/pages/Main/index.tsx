import React,{ useState, useEffect, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import api from '../../services/api';

import "./styles.css";

interface IBGEUFResponse{
    sigla: string;
}

interface IBGECityResponse{
    nome: string;
}

interface Points{
    id: number;
    longitude: number;
    latitude: number;
}

interface MyPoints {
    id: number;
    hour: String;
    day: Date;
    place: String;
}

const Main = () => {
    
    const history = useHistory();
    const cyclist_id = localStorage.getItem('user') ;

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [points, setPoints] = useState<Points[]>([]);
    const [myPoints, setMyPoints] = useState<MyPoints[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);

    const [name, setName] = useState("");
    const [selectedUf, setSelectedUf] = useState('0'); 
    const [selectedCity, setSelectedCity] = useState('0'); 

    useEffect(() => {
        api.get(`mymeetingpoints/${cyclist_id}`).then(response => {
           setMyPoints(response.data);
        })
    }, [cyclist_id]);

    useEffect(() => {
        if(localStorage.getItem('user') == null){
            return history.push('/');
        }
    });

    useEffect(() => {
        const name = localStorage.getItem('name');
        if(name){
            setName(name);
        }
    },[]);
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude]);
        })
    });

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
           const ufInitials = response.data.map(uf => uf.sigla);
           setUfs(ufInitials);
        })
    }, []);

    useEffect(() => {
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
           const cityNames = response.data.map(city => city.nome);
           setCities(cityNames);
        })
    }, [selectedUf]);

    useEffect(() => {
        api.get(`meetingPoint?city=${selectedCity}`).then(response => {
           const markedpoints = response.data;
           setPoints(markedpoints);
           
        })
    }, [selectedCity]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setSelectedCity(city);
    }
    
    function handleLogoff(){
        localStorage.clear();
        
        if(localStorage.getItem('user') == null){
            return history.push('/');
        }
    }

    function handleMoreDetail(id: number){
        console.log(id);
    }

    function handleClick(id: number){
        return history.push(`/detail/${id}`);
    }
    
    return (

        <div id="page-main">
            <header>
                <h1>CyclistNow</h1> 
                <li>
                    <p>Bem vindo {name}</p>
                    <ul>
                        <li>
                            <button className="button-logoff" onClick={handleLogoff}>Sair</button> 
                        </li>
                    </ul>
                </li>
            </header>
            
            <section className="section-map">
                <h3>Escolha uma cidade de interresse para exibir no mapa os pontos de encontro existentes.</h3>
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="uf">Estado (UF)</label>
                        <select 
                            name="uf" 
                            id="uf" 
                            value={selectedUf} 
                            onChange={handleSelectUf} 
                        >
                            <option value="0">Selecione uma UF</option>
                            {ufs.map(uf =>(
                                <option key={uf} value={uf}>{uf}</option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <select 
                            name="city" 
                            id="city"
                            value={selectedCity}
                            onChange={handleSelectCity}
                        >
                            <option value="0">Selecione uma cidade</option>
                            {cities.map(city =>(
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <Map center={ initialPosition } zoom={15} >
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {points.map(point => (
                        <Marker key={point.id} position={ [ point.latitude , point.longitude] }  onclick={ () => handleClick(point.id)} />
                    ))}  
                    
                </Map>      
                <div className="button-new-point">
                    <button>Marcar novo ponto de encontro.</button>       
                </div>        
            </section>
            <section className="section-points">
                <h3>Pontos de encontro que marquei presença</h3>
                {   myPoints.map( point => (
                    <div key={point.id} className="points">
                        <div className="field">
                            <span>Local: {point.place}</span>
                        </div>
                        <div className="field-group">
                            <div className="field">
                                <span>Data: {Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' , year: 'numeric', month: 'numeric', day: 'numeric'}).format( new Date(point.day))}</span> 
                            </div>
                            <div className="field">
                                <span>Horario: {point.hour}</span>
                            </div>
                            <div className="field">
                                <button onClick={() => handleMoreDetail(point.id)}>Ver mais informações</button>
                            </div>
                        </div>
                    </div>
                ))}
                  
                <hr/>

                
            </section>
        </div>
           
    );
}

export default Main;
