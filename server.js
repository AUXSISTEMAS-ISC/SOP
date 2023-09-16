import express from "express";
import { Resend } from "resend";
import process from "process";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

let tasks = [];
let users = [];
let survey = [];

/* <-- POST --> */



app.post("/User", (req, res) => {
    const { name, status } = req.query;

    if (!name || !status) {
        return res
            .status(400)
            .json({ error: 'Se requieren los parámetros "name" , "status"' });
    }

    const statusBool = status.toLowerCase() === "true";
    const date = new Date();
    const lascontact = date.toLocaleString();
    // Buscar si el usuario ya existe en la lista
    const existingUser = users.find((user) => user.name === name);

    if (existingUser) {
        existingUser.status = statusBool; // Actualizar el estado
        return res.json(existingUser);
    } else {
        const userData = {
            name,
            status: statusBool,
            last: lascontact,
        };

        users.push(userData);
        return res.json(userData);
    }
});
app.post("/Survey", (req, res) => {
    const questionData = req.body; // El objeto JSON se espera en el cuerpo de la solicitud

    if (!questionData) {
        return res
            .status(400)
            .json({
                error:
                    'Se requiere un objeto JSON válido con "titulo" y "opciones" en el cuerpo de la solicitud.',
            });
    }

    survey.push(questionData);
    return res.json(questionData);
});

app.post("/Tasks", (req, res) => {
    const task = req.body;
    console.log(tasks)
    if (!task || !task.name) {
        return res
            .status(400)
            .json({
                error: 'Se requieren un objeto JSON valido con "tasks" , "fecha" en el cuerpo de la solicitud.'
            });
    }
    tasks.push(task)
    return res.json(tasks)
});

/* <-- GET --> */

app.get("/UsersList", (req, res) => {
    return res.json(users);
});

app.get("/SurveyList", (req, res) => {
    return res.json(survey);
});

app.get("/TasksList", (req, res) => {
    return res.json(tasks)
})

app.listen(PORT, () => {
    console.log(`Servidor API corriendo en el puerto ${PORT}`);
});

/* <-- SEND EMAIL --> */
const resend = new Resend("re_HUnWQDWq_EKaqSwbTrN6SqRhVyXuDn331");

app.get("/Email", async (req, res) => {
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["eduardobarboza1520@g"],
      subject: "hello world",
      html: "<strong>it works!</strong>",
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
});
