import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router'
import api from '../../services/api';

interface Data{
    logon: string;
    point: {
        image: string,
        organizes: string,
        whatsapp: string,
        place: string,
        hour: string,
        day: Date,
        distance: string,
        longitude: number,
        latitude: number,
        city: string,
        uf: string
    };
}

const Detail = ( ) => {
    const {id} = useParams();
    const [data, setData]  = useState<Data>({} as Data);
    

    useEffect(() => {
        api.get<Data>(`meetingPoint/${id}`).then(response => {
            setData(response.data);
            
        })
    },[id]);

    console.log(data)
    return (
        <div>
                     
            {/* {data.map(data => ( <div> {data.point} </div>))} */}
        </div>
    )
}
export default Detail;