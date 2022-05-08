import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import "reflect-metadata";
import { Router } from './startup/router';
import { Logger } from './common/logger';
import { ConfigurationManager } from "./config/configuration.manager";
import { Loader } from './startup/loader';
import { Scheduler } from './startup/scheduler';
import { DatabaseModelManager } from './database/database.model.manager';
import { DatabaseConnector } from './database/database.connector';

/////////////////////////////////////////////////////////////////////////

export default class Application {

    //#region Member variables

    public _app: express.Application = null;

    private _router: Router = null;

    private static _instance: Application = null;

    //#endregion

    private constructor() {
        this._app = express();
        this._router = new Router(this._app);
    }

    public static instance(): Application {
        return this._instance || (this._instance = new this());
    }
    
    public app(): express.Application {
        return this._app;
    }

    warmUp = async () => {
        try {
            await this.setupDatabaseConnection();
            await Loader.init();
            await this.setupMiddlewares();
            await this._router.init();
            await Loader.Seeder.seed();
            await Scheduler.instance().schedule();
        }
        catch (error) {
            Logger.instance().log('An error occurred while warming up.' + error.message);
        }
    }

    setupDatabaseConnection = async () => {

        await DatabaseConnector.createDatabase();
        await DatabaseConnector.initialize();

        const connection = await DatabaseConnector.db();

        if (process.env.NODE_ENV === 'test') {
            //Note: This is only for test environment
            //Drop all tables in db
            await DatabaseModelManager.dropAll();
        }
    
        DatabaseModelManager.setupAssociations(); //set associations
    
        await connection.sequelize.sync({ alter: true });
    
    }

    public start = async(): Promise<void> => {
        try {
            await this.warmUp();
            
            process.on('exit', code => {
                Logger.instance().log(`Process exited with code: ${code}`);
            });

            //Start listening
            await this.listen();
            
        }
        catch (error){
            Logger.instance().log('An error occurred while starting reancare-api service.' + error.message);
        }
    };

    private setupMiddlewares = async (): Promise<boolean> => {

        return new Promise((resolve, reject) => {
            try {
                this._app.use(express.urlencoded({ extended: true }));
                this._app.use(express.json());
                this._app.use(helmet());
                this._app.use(cors());

                const MAX_UPLOAD_FILE_SIZE = ConfigurationManager.MaxUploadFileSize();
            
                this._app.use(fileUpload({
                    limits            : { fileSize: MAX_UPLOAD_FILE_SIZE },
                    preserveExtension : true,
                    createParentPath  : true,
                    parseNested       : true,
                    useTempFiles      : true,
                    tempFileDir       : '/tmp/uploads/'
                }));
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    };

    private listen = () => {
        return new Promise((resolve, reject) => {
            try {
                const port = process.env.PORT;
                const server = this._app.listen(port, () => {
                    const serviceName = 'REANCare api' + '-' + process.env.NODE_ENV;
                    Logger.instance().log(serviceName + ' is up and listening on port ' + process.env.PORT.toString());
                    this._app.emit("server_started");
                });
                module.exports.server = server;
                resolve(this._app);
            }
            catch (error) {
                reject(error);
            }
        });
    };

}