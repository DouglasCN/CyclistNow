import knex from '../database/connection';
import { Request, Response } from "express";

class MyMeetingPoints {

    //returns all meeting points he has scheduled to attend
    //Retorna todos os pontos de encontro que o ciclista marcou presença
    async index(request: Request, response: Response){
        const id  = request.params.id;

        const data = await knex('meeting_points')
        .innerJoin('my_meeting_points', 'meeting_points.id', 'my_meeting_points.meeting_point_id')
        .where('my_meeting_points.cyclist_id', id)
        .select('meeting_points.*')
        // const data = knex.select('my_meeting_points').where('cyclist_id', Number(id));
        return response.json({
             data
        })
    }

    //marks a new meeting point that you want to attend
    //marca presença do ciclista em algum ponto de encontro
    async create(request: Request, response: Response){
        const { meeting_point_id, cyclist_id } = request.body;

        await knex('my_meeting_points').insert({
            meeting_point_id, 
            cyclist_id
        })

        return response.json({ create: "Success in create"});
           
    }

    //exclude a meeting point you wished to attend
    //exclui a presenã do ciclista no ponto de encotro
    async delete(request: Request, response: Response){
        const meeting_point_id = request.params.id
        const cyclist_id = request.headers.authorization;

        await knex('my_meeting_points')
        .where('meeting_point_id', meeting_point_id)
        .where('cyclist_id', Number(cyclist_id))
        .del()
        .then(function(row){
            if(row == 1){
                  //status
                return response.json({ delete: "Success in delete"});
            }else if(row == 0){
                  //status
                return response.json({ delete: "Fail in delete"});
            }
        })
        .catch(function(error) {
            return response.status(error).json({ error: "Something unexpected happened, contact with the administrator"});       
        });
    }

}

export default MyMeetingPoints;
