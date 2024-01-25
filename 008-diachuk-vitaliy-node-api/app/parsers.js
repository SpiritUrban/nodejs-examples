import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';

export default function (app) {
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true, limit: '11111111mb' }));
    app.use(bodyParser.json({ limit: '11111111mb' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
};