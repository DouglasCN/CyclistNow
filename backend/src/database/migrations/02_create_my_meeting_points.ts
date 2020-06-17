import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('my_meeting_points', table => {
        table.increments('id').primary();

        table.integer('meeting_point_id')
        .notNullable()
        .references('id')
        .inTable('meeting_points');

        table.integer('cyclist_id')
        .notNullable()
        .references('id')
        .inTable('cyclist');
        
    })
}

export async function down(knex: Knex){
    return knex.schema.dropTable('my_meeting_points');
}