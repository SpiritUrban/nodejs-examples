import fileUpload from 'express-fileupload';
import { log } from 'high-level';
import { cleanUp, ensureFolder } from '../my_modules/fs-utils.js';
import { __dirname, serverEntryPoint, pause } from '../my_modules/stuff.js';

export default function (app) {
    app.use(fileUpload());
    app.post('/api/v1/upload', async function (req, res) {
        let sampleFile;
        let uploadPath;
        let pathForUploading;
        let fileName;
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send('No files were uploaded.');
            return;
        };
        sampleFile = req.files.sampleFile;
        pathForUploading = req.query.pathForUploading;
        fileName = req.query.fileName;
        await cleanUp(pathForUploading, fileName, __dirname(import.meta.url))
        if (req.query.fileName) {
            const extention = sampleFile.name.split('.')[1];
            fileName = `${req.query.fileName}.${extention}`
        } else {
            fileName = sampleFile.name
        }
        const folders = '/uploads' + pathForUploading
        uploadPath = folders + fileName;
        await ensureFolder(folders);
        await pause(300)
        sampleFile.mv(serverEntryPoint() + uploadPath, function (err) {
            if (err) {
                log(err)
                return res.status(500).send(err)
            };
            res.send('File uploaded to ' + uploadPath);
        });
    });
};