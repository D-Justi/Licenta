import express from "express";
import { connectDB } from "./src/config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import router from "./src/routes/router.js";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/api", router);
app.use(express.static(path.join(__dirname, "public")));

app.get("/",async (req, res, next) => {
    try{
        const response = await fetch("http://localhost:3000/api/lawyers",{
            method: "GET"
        });

        const lawyers = await response.json();

        res.render("pages/index", { 
            title: "Acasă | Cabinet Avocat",
            lawyers: lawyers,
            path: "/" 
        });
    }catch(err){
        next(err);
    }
});

app.get("/despre",async (req, res, next) => {
    try{
        const response = await fetch("http://localhost:3000/api/lawyers",{
            method: "GET"
        });

        const lawyers = await response.json();

        res.render("pages/despre", { 
            title: "Despre Noi",
            lawyers: lawyers,
            path: "/despre" 
        });
    }catch(err){
        next(err);
    }
});

app.get("/servicii", (req, res) => {
    res.render("pages/servicii", { 
        title: "Serviciile Noastre" 
    });
});

app.get("/clienti", (req, res) => {
    res.render("pages/clienti", { 
        title: "Clienți și Portofoliu" 
    });
});

app.get("/contact", (req, res) => {
    res.render("pages/contact", { 
        title: "Contactează-ne" 
    });
});

app.get("/programare",async (req, res, next) => {
    try{
        const response = await fetch("http://localhost:3000/api/lawyers",{
            method: "GET"
        });

        const lawyers = await response.json();

        res.render("pages/programare",
        {   title: "Programare Online",
            path: "/programare",
            lawyer: lawyers.find(el => el.id === parseInt(req.query.lawyerId)),
            selectedLawyerId: req.query.lawyerId || null
        });
    }catch(err){
        next(err);
    }
});

const startServer = async () => {
    try {

        await connectDB();
        
        app.listen(port, () => {
            console.log(`🚀 Serverul a pornit pe portul ${port}`);
            console.log(`🔗 Accesează: http://localhost:${port}`);
        });
    } catch (err) {
        console.error("❌ Nu s-a putut conecta la baza de date:", err);
    }
};

startServer();

app.use((req, res, next) => {
    res.status(404).render("pages/404", { title: "Pagina nu a fost găsită" });
});

app.use((err,req,res,next)=>{
    console.log("[ERROR] ",err);
    return res.status(500).json({message: "server error "});
});

