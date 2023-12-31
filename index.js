import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet, { crossOriginResourcePolicy } from 'helmet'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import {register} from './controllers/auth.js'
import { verifyToken } from './middleware/auth.js'
import { createPost } from './controllers/posts.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postsRoutes from './routes/posts.js'

/*CONFIGURATIONS*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));
app.use(bodyParser.json({limit: "30mb",extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

/*FILE STORAGE SETUP */
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"public/assets");
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname);
    }
})
const upload = multer({storage});

//Routes with files

app.post('/auth/register',upload.single("picture"),register);
app.post('/posts',verifyToken,upload.single("picture"),createPost);
/*MONGOOSE SETUP */
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    app.listen(PORT,()=>{console.log(`listening on ${PORT}`)});
}).catch(err=>{console.error(err)});

/*For ease8*/
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
})
app.post('/auth/register',upload.single("picture"),register);


/*Routes*/ 
app.use('/auth',authRoutes);
app.use('/users',userRoutes);
app.use('/posts',postsRoutes);


