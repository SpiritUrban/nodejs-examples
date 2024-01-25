import { log } from 'high-level';
import { ensureFolder } from '../../my_modules/stuff.js';
import fs from 'fs';
const fsPromises = fs.promises;

class FileService {
    constructor() { }

    async get(user) {
        return new Promise((resolve, reject) => {
            let user_folder = './uploads/' + user._id
            if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads'); // create General Folder ?
            if (!fs.existsSync(user_folder)) fs.mkdirSync(user_folder); // create User Folder ?
            fs.readdir('./uploads/' + user._id, (err, files) => { // Get list of file names
                files.forEach(file => files.push(file));
                let unique = [...new Set(files)];
                resolve({ unique });
            });
        });
    }

    async upload(user, msg)  {
        // var-s
        const load_type = msg.load_type;
        const mainFolder = msg.mainFolder;
        const folder = (msg.folder) ?
            './' + mainFolder + '/' + msg.folder :
            './' + mainFolder + '/' + user._id; // folder or user._id
        const path = folder + '/' + msg.name.toLowerCase();
        //
        console.log('---------------------------->', path);
        const allowed = ['uploads', 'uploads-msg', 'uploads-ads', 'uploads-app', 'uploads-alarm']; // ............................. Control allowed folders
        if (!allowed.some(_ => _ == mainFolder)) bad(null, req, res, 'You can not write to this main-folder!');
        //

        // if (msg.name == 'avatar') del all other avatars !!!! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        //
        if (load_type == 'new') { // ............................................................................. Algorithm of uploading
            await ensureFolder('./uploads/'); // ................................................................. need create the folders?
            await ensureFolder(folder); // ....................................................................... need create the folders?
            await fsPromises.writeFile(path, msg.data, 'binary'); // ............................................. Write first chunk of File
        } else if (load_type == 'append') { // ................................................................... Append part of file
            await fsPromises.appendFile(path, msg.data, 'binary');
        };
        // custom additionals
        //
        if (mainFolder == 'uploads-msg') {
            // mark phrase about existing of audio
            const lang = msg.name.split('.')[0];
            await Phrase.findByIdAndUpdate({ _id: msg.folder }, {
                ["audio." + lang]: true
            });
        };
        if (mainFolder == 'uploads-ads') {
            // mark phrase about existing of audio
            const lang = msg.name.split('.')[0];
            await Advertising.findByIdAndUpdate({ _id: msg.folder }, {
                ["audio." + lang]: true
            });
        };
        if (mainFolder == 'uploads-alarm') {
            // mark phrase about existing of audio
            const lang = msg.name.split('.')[0];
            await AlarmMsg.findByIdAndUpdate({ _id: msg.folder }, {
                ["audio." + lang]: true
            });
        };
    }

    async del(_id)  {
        const user = msg._user;
        const user_folder = './uploads/' + user._id;
        const path = user_folder + '/' + msg.name;
        await this.remove(path); // Remove file
    }

    async delAny(folders, files)  {
        for (let i = 0; i < files.length; i++) {
            const path = folders + '/' + files[i];
            await this.remove(path);
        };
    }

    async delOfUser(user, files)  {
        let user_folder = './uploads/' + user._id;
        for (let i = 0; i < files.length; i++) {
            const path = user_folder + '/' + files[i];
            await this.remove(path);
        }
    }

    async remove(path)  {
        console.log('Remove--->', path);
        try {
            await fsPromises.unlink(path);
            return true
        } catch (e) {
            return false
        }
    }

};

export default new FileService();