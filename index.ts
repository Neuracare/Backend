import * as mongoose from 'mongoose';
import * as mongo from './database/mongo';
import * as gpt from './OpenAI/openai';

await mongoose.connect('mongodb+srv://neuracare:Dancing12@cluster0.aw0klyp.mongodb.net/NeuraCare?retryWrites=true&w=majority');

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
                console.log(patient);
                return new Response(String(patient), { status: 200 });
            }
            catch{
                return new Response("Not found", { status: 404 });
            }

        case '/patients/info':
            try{
                let patient = await mongo.getPatientinfo(reqid.id, reqid.query);
                return new Response(String(patient), { status: 200 });
            }
            catch(err){
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
                let todo_gpt = JSON.parse(await gpt.todo(reqid.transcript));
                let exisitng = await mongo.getPatientinfo(reqid.id, "todo");
                if (exisitng == undefined){
                    exisitng = {"todo": []};
                }
                let new_todo = {todo: [...exisitng.todo, todo_gpt.tasks]}
                let todoUpdate = await mongo.updatePatient(reqid.id, {todo: new_todo});

                // Summary Points
                let summary_gpt = todo_gpt.summary_points;
                console.log(summary_gpt);
                let exisitng_summary = await mongo.getPatientinfo(reqid.id, "summary");
                if (exisitng_summary == undefined){
                    exisitng_summary = {"summary": []};
                }
                let new_summary = {summary: [...exisitng_summary.summary, summary_gpt]}
                let summaryUpdate = await mongo.updatePatient(reqid.id, {summary: new_summary});
                console.log(summaryUpdate);

                return stat200;
            }
            catch(err){
                console.log(err);
                return new Response("Err: JSON not right", { status: 404 });
            }

        // Web App


        
    }

    return new Response("Not found", { status: 404 });
}

const server = Bun.serve({
    port: 3000,
    fetch(request: Request) {
        return handleRequest(request);
    }
  });
  
  console.log(`Listening on localhost: ${server.port}`);