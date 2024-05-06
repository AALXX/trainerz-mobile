import mysql from 'mysql2';
import config from './config';
import logging from './logging';
import express from 'express';

interface CustomRequest extends express.Request {
    pool?: mysql.Pool;
}

const createPool = () => {
    const pool = mysql.createPool({
        connectionLimit: 10, // Adjust the connection limit as needed
        multipleStatements: true,
        waitForConnections: true,
        user: config.mysql.user,
        password: config.mysql.password,
        host: config.mysql.host,
        database: config.mysql.database,
    });

    // Optional: Handle connection errors
    pool.on('error', (err) => {
        console.error('MySQL Pool Error:', err.message);
    });

    return pool;
};
const query = async (connection: any, queryString: string, values?: any[]): Promise<any> => {
    const NAMESPACE = 'MYSQL_QUERY_FUNC';
    try {
        const dbresult = await connection.query(queryString, values);
        const result = JSON.parse(JSON.stringify(dbresult));
        connection.release();
        return result[0];
    } catch (error: any) {
        logging.error(NAMESPACE, error);
    }
};

/**
 * connects to an sql server
 * @return {Promise<mysql.Connection>}
 */
const connect = async (pool: mysql.Pool) => {
    try {
        // Get a connection from the pool
        return await pool.promise().getConnection();
    } catch (error) {
        return null;
    }
};

export { query, createPool, connect, CustomRequest };
