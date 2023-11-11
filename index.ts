import * as mongoose from 'mongoose';
import * as mongo from './database/mongo';

await mongoose.connect('mongodb+srv://neuracare:Dancing12@cluster0.aw0klyp.mongodb.net/NeuraCare?retryWrites=true&w=majority');

async function handleRequest(req :any) {
    const { pathname } = new URL(req.url);

    const stat200 = new Response("Success", { status: 200 });
    const stat404 = new Response("Bad Request", { status: 404 });

    let reqid = await req.json();

    // Define your endpoints here
    switch (pathname) {
        case "/":
            return new Response(JSON.stringify({ message: "Hello World" }), { status: 200 });
        
        // Updates, Gets and Adds
        case "/patient":
            try{
                let patient = await mongo.getPatient(reqid.id);
                return new Response(String(patient), { status: 200 });
            }
            catch{
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