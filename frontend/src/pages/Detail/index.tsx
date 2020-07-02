import React, { useEffect, useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router'
import { FaWhatsapp } from 'react-icons/fa';
import api from '../../services/api';

import './styles.css'; 
import Header from '../../components/header';

interface Point{
    
    image: string;
    organizes: string;
    whatsapp: string;
    place: string;
    hour: string;
    day: Date;
    distance: string;
    longitude: string;
    latitude: string;
    city: string;
    uf: string;
    image_url: string
    
}

const Detail = ( ) => {
    const history = useHistory();

    const {id} = useParams();
    const cyclist_id = localStorage.getItem('user') ;
    const meeting_point_id = id;

    const [data, setData]  = useState<Point>({} as Point);
    const [markedPresence, setMarkedPresence] = useState();
    
    useEffect(() => {
        if(localStorage.getItem('user') == null){
            return history.push('/');
        }
    });

    useEffect(() => {
        api.get<Point>(`meetingPoint/${id}`).then(response => {
            setData(response.data);
        })
    },[id]);

    useEffect(() => {
        api.get(`mymeetingpoints/?meeting_point_id=${meeting_point_id}&cyclist_id=${cyclist_id}`).then(response => {
            setMarkedPresence(response.data);
        })
    });

    function goBack(){
        history.goBack();
    }
        
    async function handleSubmitMarkedPresence(event: FormEvent){
        event.preventDefault();

        const mymeetingpoints ={
            cyclist_id,
            meeting_point_id
        }
        
        const status = await api.post('mymeetingpoints', mymeetingpoints);

        if(status){
            alert('Ponto de encontro marcado');
            history.push('/main');
        }else {
            console.log(status)
        }
    }
    
    async function handleSubmitDeselectPresence(event: FormEvent){
        event.preventDefault();
        
        const status = await api.delete(`mymeetingpoints/${meeting_point_id}`, {
            headers: { 'authorization': cyclist_id},
        });
       
        if(status){
            alert('Ponto de encontro desmarcado');
            history.push('/main');
        }else {
            console.log(status)
        }
    }
    
    const split = String(data.day).split('-');

    return (
        <div id="page-detail">  

            <Header/>

            <section className="section-detail">
                <div className="detail">
                    <div className="group-description">
                        <div className="description">
                            <span className="organized">Organizado por {data.organizes}</span>
                        </div>
                        <div className="description">
                            <span className="back" onClick={goBack}>Voltar</span>
                        </div>
                    </div>
                    <div className="group-description">
                        <div className="description">
                            <span>Dia da pedalada: {split[2]+"/"+split[1]+"/"+split[0]}</span>
                        </div>
                        <div className="description">
                            <span>Sairemos às: {data.hour}</span>
                        </div>
                        <div className="description">
                            <button className="button-whatsapp">
                                   <strong>
                                   Mensagem
                                    </strong>  
                                <span>
                                    <FaWhatsapp/>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="image-detail">
                        <img src={data.image_url} alt="Place"/>
                    </div>
                    <div className="group-description">
                        <div className="description">
                            <span>O local para se encontrar é: {data.city}, {data.uf} - {data.place}</span>
                        </div>
                    </div>
                    <div className="group-description">
                        <div className="description">
                            <span>Sera feito cerca de {data.distance} kilometros nessa pedalada. </span>
                        </div>
                    </div>
                    {
                        markedPresence === true ?(
                            <form className="div-button-presence" onSubmit={handleSubmitDeselectPresence}>
                                <button className="button-presence">Desmarcar presença</button>
                            </form>
                        ) : (
                            <form className="div-button-presence" onSubmit={handleSubmitMarkedPresence}>
                                <button className="button-presence">Marcar presença</button>
                            </form>
                        )
                    }
                    
                </div>
            </section>
        </div>
    )
}
export default Detail;