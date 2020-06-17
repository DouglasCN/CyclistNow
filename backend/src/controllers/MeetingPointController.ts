import knex from '../database/connection';
import { Request, Response } from "express";

class MeetingPoint {

    //returns all meeting points filtered by the city
    //Retorna todos os pontos de encontro filtrados pela cidade
    async index(request: Request, response: Response){
        const { city } = request.query;

        const meetingPoints = await knex('meeting_points')
        .where('city', String(city))
        .distinct()
        .select('*');

        const serializedMeetingPoints = meetingPoints.map( point => {
            return {
                ...point,
                image_url: `http://{ipDaRede}/uploads/${point.image}`,
            };
        });

        return response.json(serializedMeetingPoints);

    }

    //create a meeting point
    //cria um ponto de encontro
    async create(request: Request, response: Response){
        
        const {
            organizes,
            whatsapp,
            place,
            hour,
            day,
            distance,
            longitude,
            latitude,
            city,
            uf,
            cyclist_id
        } = request.body;


        await knex('meeting_points').insert({
            image: request.file.filename,
            organizes,
            whatsapp,
            place,
            hour,
            day,
            distance,
            longitude,
            latitude,
            city,
            uf,
            cyclist_id
         });
        
         return response.json({ success: true })

    }

    //update a meeting point
    //ataualiza um ponto de encontro
    async update(request: Request, response: Response){
        const {
            id,
            organizes,
            whatsapp,
            place,
            hour,
            day,
            distance,
            longitude,
            latitude,
            city,
            uf,
            cyclist_id
        } = request.body;

        const cyclist = await knex('cyclist')
        .innerJoin('meeting_points', 'meeting_points.cyclist_id', 'cyclist.id')
        .where('cyclist.id', cyclist_id)
        .where('meeting_points.id', id)
        .select('meeting_points.*')
        .first();

        if(!cyclist){
            response.status(401).json({ Error: "You are not authorized to do this" });
        }
        else{
           
            await knex('meeting_points')
            .where('id', id)
            .update({
                organizes,
                whatsapp,
                place,
                hour,
                day,
                distance,
                longitude,
                latitude,
                city,
                uf,
                cyclist_id
            }).then(function(row){
                if(row == 1){
                    //status
                    return response.json({ update: "Success in update"});
                }else if(row == 0){
                    //status
                    return response.json({ update: "Fail in update"});
                }
            })
        }
        
    }

    //deletes all meeting point presence and meeting point
    //deleta todas as presenças de ponto de encontro e o ponto de encontro
    async delete(request: Request, response: Response){
        const id = request.params.id;

        const trx = await knex.transaction();

        await trx('my_meeting_points').where('meeting_point_id',id).del();

        await trx('meeting_points').where('id', id).del();
        
        await trx.commit();

        return response.json({ message: "Delete success" });
    }
}

export default MeetingPoint;