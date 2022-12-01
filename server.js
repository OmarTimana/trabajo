require('dotenv').config();
const mongoose = require("mongoose")
try {
    await mongoose.connect(process.env.MONGO_CON, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    console.log("ESTA VIVAAAAAAAAA!!!!!!!!!")
} catch (error) {
    console.log("sumakina da error nmm: ",error)
    throw new Error("sumakina da error nmm")
}

const Server = require('./models/server');
const server = new Server();

server.listen();


this.app.post('/ressol', [
            check('email', 'sumakina correo no valido').custom(CorreoExiste),
            check('email', 'es necesaria una fecha de inicio').custom(CorreoValido)
        ], async(req, res)=>{
            const f = formidable({multiples:false});
            f.parse(req, async(err, fields, files) =>{
                if (err) {
                    next(err);
                    return
                }
                else{
                    res.json({ fields, files });
                    const r=new Reserv({
                        fini:fields.fini,
                        fend:fields.fend,
                        namevent:fields.event,
                        depend:fields.depen,
                        cont:fields.cont,
                        sitio:fields.sit,
                        state:"solicitado",
                        email:fields.email
                    })
                    await r.save()
                    .then(async() =>{
                        console.log("YES")
                        if (files.file.size != 0) {
                            var paths=files.file.originalFilename.split(".")
                            var wea=fs.createReadStream(files.file.filepath).pipe(this.bucket.openUploadStream(files.file.originalFilename, {contentType:paths[paths.length-1]}))
                            var fileid=wea.id.toString()
                            await Reserv.findOneAndUpdate(r,{anexo:fileid})
                        }
                        const rep= new Report({
                            res:r,
                            modif:"solicitado"
                        })
                        await rep.save().then(async()=>{
                            console.log("reportado")
                        })
                    })
                    .catch(err => {
                        console.log("NOPE")
                        console.log(err);
                    });
                }
            })
        })
