
import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('meeting_points', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('organizes').notNullable();
        table.string('whatsapp').notNullable();
        table.string('place').notNullable();
        table.string('hour').notNullable();
        table.date('day').notNullable();
        table.string('distance').notNullable();
        table.decimal('longitude').notNullable();
        table.decimal('latitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();

        table.integer('cyclist_id')
        .notNullable()
        .references('id')
        .inTable('cyclist');
    })
}

export async function down(knex: Knex){
    return knex.schema.dropTable('meeting_points');
}