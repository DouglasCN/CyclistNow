import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import {  useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

import Header from '../../components/header';
import './styles.css';
import Dropzone from '../../components/Dropzone';

interface IBGEUFResponse{
    sigla: string;
}

interface IBGECityResponse{
    nome: string;
}
const CreateMeetingPoint = ( ) => {

    const history = useHistory();
    const [selectedFile, setSelectedFile] = useState<File>();
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
   
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0'); 
    const [selectedCity, setSelectedCity] = useState('0');
    
    const [distance, setDistance] = useState(10);  
    const [organized, setOrganized] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [place, setPlace] = useState("");
    const [day, setDay] = useState("");
    const [hour, setHour] = useState("");

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

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setSelectedCity(city);
    }


    function handleInputeOrganized(event: ChangeEvent<HTMLInputElement>){
        const name = String(event.target.value);
        setOrganized(name);
    }  

    function handleInputeWhatsapp(event: ChangeEvent<HTMLInputElement>){
        const whatsapp = String(event.target.value);
        setWhatsapp(whatsapp);
    } 

    function handleInputePlace(event: ChangeEvent<HTMLInputElement>){
        const place = String(event.target.value);
        setPlace(place);
    }  

    function handleInputeDay(event: ChangeEvent<HTMLInputElement>){
        const day = String(event.target.value);
        setDay(day);
    } 

    function handleInputeHour(event: ChangeEvent<HTMLInputElement>){
        const hour = String(event.target.value);
        setHour(hour);
    }  

    

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function addDistance(){
        if(distance <= 60) {
            setDistance(distance + 10);
        }else {
            setDistance(10);
        }
    }

    function goBack(){
        history.goBack();
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault(); 

        const [latitude, longitude] = selectedPosition;
        const uf = selectedUf;
        const city = selectedCity;
        const ciclyst = localStorage.getItem('user');
        // console.log(distance,organized, whatsapp, place, day, hour)

        const data = new FormData();

        data.append('organizes', organized);
        data.append('whatsapp', whatsapp);
        data.append('place', place);
        data.append('hour', hour);
        data.append('day', day);
        data.append('distance', String(distance));
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('uf', uf);
        data.append('city', city);
        data.append('cyclist_id',  String(ciclyst));
        
        
        if(selectedFile){
            data.append('image', selectedFile)
        }
        
        await api.post('meetingPoint', data);
        alert('ponto de encontro criado');

        history.push('/main');
    }

    return (
        <div id="page-create-meeting-point">  

            <Header/>

            <section className="section-create">
                <form onSubmit={handleSubmit}>
                    <div className="title">
                        <span className="h2">Cadastro de ponto de encontro</span>
                        <span className="back" onClick={goBack}>Voltar</span>
                    </div>
                    
                    <Dropzone onFileUploaded={setSelectedFile} />  

                    <span>Dados</span>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name" className="field-label">Organizado por:</label>
                            <input 
                                type="text"
                                id="name"
                                name="name"
                                value={organized}
                                onChange={handleInputeOrganized}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp" className="field-label">Whatsapp</label>
                            <input 
                                type="text"
                                id="whatsapp"
                                name="whatsapp"
                                onChange={handleInputeWhatsapp}
                            />
                        </div>
                    </div>

                    <span className="span">Clique em algum lugar do mapa para marca-lo, isso irá ajudar o ciclisca a entroncar o ponto de encontro</span>
                    <Map center={ initialPosition } zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={ selectedPosition } />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf" className="label-select">Estado (UF)</label>
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
                            <label htmlFor="city" className="label-select">Cidade</label>
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

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="place" className="field-label">Local do ponto de encontro</label>
                            <input 
                                type="text"
                                id="place"
                                name="place"
                                onChange={handleInputePlace}
                            />
                        </div>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name" className="field-label">Dia da pedalada</label>
                            <input type="date" onChange={handleInputeDay}/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp" className="field-label">Horario de saida</label>
                            <input  
                                type="time" 
                                onChange={handleInputeHour}
                            />
                        </div>
                        <div className="field">
                            
                        </div>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label className="field-label">
                                Quantos quilometros em média pretendem pedalar.
                                <span className="span"> Clique no botão para aumentar o valor de 10-70</span>
                            </label>      
                            <div className="group-buttons">
                                <button className="button-distance" type="button" onClick={addDistance}>{distance}</button>    
                                <button type='submit' className="button-submit">Salvar</button>    
                            </div>
                               
                        </div>    
                    </div>
                </form>
                
            </section>
        </div>
    )
}
export default CreateMeetingPoint;