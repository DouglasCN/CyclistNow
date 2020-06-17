import knex from '../database/connection';
import { Request, Response } from "express";

const bcrypt = require('bcrypt');
const saltRounds = 10;
// index, show, create, update, delete
class CyclistController{

    //login the cyclist
    //efetua o login do ciclista
    async index(request: Request, response: Response){
    
        const {
            email,
            password
        } = request.body;
    
        const cyclist = await knex('cyclist').where('email', email).first();
        
        if(!cyclist){
            return response.status(400).json({ message: "Cyclist not found" });
        }

        if(bcrypt.compareSync(password, cyclist.password)){
            return response.json({ logon: "success", cyclist });
        } 
        else{
            return response.json({ logon: "fail" });
        } 
    
     }

    //create a cyclist user
    //cria um usuario ciclista
    async create(request: Request, response: Response){
    
        const {
           name,
           email,
           password,
           whatsapp
        } = request.body;
    
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);  
        
        await knex('cyclist').insert({
           name,
           email,
           password: hash,
           whatsapp
        });
       
        return response.json({ success: true })
    }

    //deletes the cyclist user, and all their dependencies on meeting points and presence of meeting points
    //deleta o usuario ciclista, e todas as suas dependencias de pontos de encontro e presenças de pontos de encontro
    async delete(request: Request, response: Response){
        const cyclistId = request.params.id;
        const cyclist = await knex('cyclist').where('id', cyclistId).first();

        if(!cyclist){
            //status
            return response.json({ error: "Cyclist not found" });
        }

        await knex('cyclist')
        .where('id', cyclistId)
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

    //update a cyclist user
    //atualiza o usuario ciclista
    async update(request: Request, response: Response){

        const {
            id,
            name,
            email,
            whatsapp,
            currentPassword,
            newPassword,
         } = request.body;

        const cyclist = await knex('cyclist').where('id', id).first();

        if(!cyclist){
            //status
            return response.json({ error: "Cyclist not found" });
        }
        
        if(bcrypt.compareSync(currentPassword, cyclist.password)){
            
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(newPassword, salt); 

            const password = newPassword != "" ? hash : cyclist.id;

            await knex('cyclist')
            .where('id', id)
            .update({
                name,
                email,
                whatsapp,
                password
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
        else{
            return response.json({ Update: "Current password incorrect" });
        } 
    }
}

export default CyclistController;