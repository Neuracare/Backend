import * as mongoose from 'mongoose';
import * as mongo from './database/mongo';
import * as gpt from './OpenAI/openai';
import { WebSocket } from 'ws';

await mongoose.connect('mongodb+srv://neuracare:Dancing12@cluster0.aw0klyp.mongodb.net/NeuraCare?retryWrites=true&w=majority');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*', // Allows access from any origin
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Allowed HTTP methods
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept', // Allowed headers
    'Access-Control-Max-Age': '3600', // Max age for the CORS options
};

async function handleRequest(req :any) {
    const { pathname } = new URL(req.url);

    const stat200 = new Response("Success", { status: 200 });
    const stat404 = new Response("Bad Request", { status: 404 });

    let contentType = req.headers.get("content-type") || "";

    if(contentType.includes("application/json") == true){
        var reqid = await req.json();
    }
    else{
        reqid = {};
    }


    // Define your endpoints here
    switch (pathname) {
        case "/":
            return new Response(JSON.stringify({ message: "Hello World" }), { status: 200 });
        
        // Updates, Gets and Adds
        case "/patient":
            try{
                let patient = await mongo.getPatient(reqid.id);
                //console.log(patient);
                return new Response(String(patient), { status: 200 });
            }
            catch{
                return new Response("Not found", { status: 404 });
            }

        case '/patient/info':
            try{
                let patient = await mongo.getPatientinfo(reqid.id, reqid.query);
                console.log(patient);
                return new Response(JSON.stringify(patient), { status: 200 });
            }
            catch(err){
                console.log(err);
                return new Response("Not found", { status: 404 });
            }

        case "/caregiver":
            try{
                let caregiver = await mongo.getCaregiver(reqid.id);
                return new Response(JSON.stringify(caregiver), { status: 200 });
            }
            catch{
                return new Response("Not found", { status: 404 });
            }
        case "/patient/update":
            return await mongo.updatePatient(reqid.id, reqid.update) ? stat200 : stat404;
        case "/caregiver/update":
            return await mongo.updateCaregiver(reqid.id, reqid.update) ? stat200 : stat404;
        case "/patient/add":
            return await mongo.addPatient(reqid.newPatient) ? stat200 : stat404;
        case "/caregiver/add":
            return await mongo.addCaregiver(reqid.newCaregiver) ? stat200 : stat404;

        // Todo List
        case "/patient/todo":
            try{
                //console.log(reqid);
                let todo_gpt = JSON.parse(await gpt.todo(reqid.transcript));
                let todo_existed = await mongo.getPatientinfo(reqid.id, "todo");
                if (todo_existed.length == 0){
                    todo_existed = [];
                }
                let todoUpdate = await mongo.updatePatient(reqid.id, {"todo": [...todo_existed ,...todo_gpt.tasks]});

                // Summary Points
                let summary_gpt = todo_gpt.summary_points;
                let summary_existed = await mongo.getPatientinfo(reqid.id, "summary");
                if (summary_existed.length == 0){
                    summary_existed = [];
                }
                let summaryUpdate = await mongo.updatePatient(reqid.id, {"summary": [...summary_existed ,...summary_gpt]});
                //console.log(summaryUpdate);

                return stat200;
            }
            catch(err){
                console.log(err);
                return new Response("Err: JSON not right", { status: 404 });
            }

        // Web App
        case "/web/getPatients":
            try{
                console.log(reqid);
                let patients = await mongo.getCaregiver(reqid.id);
                console.log(patients[0]);
                if(patients[0].patients.length == 0){
                    return new Response("Not found", { status: 404 });
                }
                for (let i = 0; i < patients[0].patients.length; i++){
                    let patient = await mongo.getPatient(patients[0].patients[i]);
                    patients[0].patients[i] = patient[0];
                }
                const newresp = new Response(JSON.stringify(patients), { status: 200 })
                newresp.headers.set("Access-Control-Allow-Origin", "*");
                newresp.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                return newresp
            }
            catch(err){
                console.log(err);
                const newresp = new Response("Not found", { status: 404 })
                newresp.headers.set("Access-Control-Allow-Origin", "*");
                newresp.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                return newresp;
            }

        case "/web/getPatient":
            try{
                let patient = await mongo.getPatient(reqid.id);
                let data = {
                    "name": patient[0].name,
                    "heartRate": patient[0].heartRate,
                    "bloodPressure": patient[0].bloodPressure,
                    "respiratoryRate": patient[0].respiratoryRate,
                    "bloodOxygen": patient[0].bloodOxygen,
                    "location": patient[0].location,
                }
                return new Response(JSON.stringify(data), { status: 200 });
            }
            catch{
                return new Response("Not found", { status: 404 });
            }
        case "/ios/update":
            try{
                let respiratoryRate = await mongo.updatePatient(reqid.id, {"respiratoryRate": reqid.respiratoryRate});
                let location = await mongo.updatePatient(reqid.id, {"location": reqid.location});
                let heartRate = await mongo.updatePatient(reqid.id, {"heartRate": reqid.heartRate});
                let bloodOxygen = await mongo.updatePatient(reqid.id, {"bloodOxygen": reqid.bloodOxygen});
                console.log(reqid);
                return stat200;
            }
            catch(err){
                console.log(err);
                return new Response("Not found", { status: 404 });
            }
        
    }

    return new Response("Not found", { status: 404 });
}

async function handleWebSocket(message :String | Buffer) {
    let message_parsed = JSON.parse(String(message));
    
    switch (message_parsed.type) {
        case "web":
            let heartRate = await mongo.getPatientinfo(message_parsed.id, "heartRate");
            let bloodPressure = await mongo.getPatientinfo(message_parsed.id, "bloodPressure");
            let respiratoryRate = await mongo.getPatientinfo(message_parsed.id, "respiratoryRate");
            let bloodOxygen = await mongo.getPatientinfo(message_parsed.id, "bloodOxygen");
            let location = await mongo.getPatientinfo(message_parsed.id, "location");
            let data = {
                "heartRate": heartRate,
                "bloodPressure": bloodPressure,
                "respiratoryRate": respiratoryRate,
                "bloodOxygen": bloodOxygen,
                "location": location
            }
            console.log(data);
            return data;
        case "ios":
            return "Hello iOS";
    }


}




const server = Bun.serve({
    port: 3000,
    async fetch(request: Request) {
        if(server.upgrade(request)){
            return new Response(null, {status: 200});
        }
        const response = await handleRequest(request);

        // Add CORS headers to the response
        return new Response(response.body, {
            ...response,
            headers: {
                ...response.headers,
                ...CORS_HEADERS,
            },
        });
    },    

    // Create a Websocket server
    websocket:{
        async message(ws, message) {
            let data = await handleWebSocket(message);
            ws.send(data);
        },
    }


  });
  
  console.log(`Listening on localhost: ${server.port}`);
