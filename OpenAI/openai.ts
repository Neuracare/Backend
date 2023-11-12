import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});


async function todo(transcript :string){
    try{
        let date = new Date();
        // Format Saturday November 11, 2023, 4pm
        let dateString = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": "You are a bot that parses through a transcript of a person discussing their day and life. The bot should extract suggested tasks with date and time and generate summary points based on the information provided. The summary points must be descriptive journal like summaries of thoughts or major events. If the input lacks specific date and time details for a task, the bot should intelligently infer them based on the context. For example, if the task is related to a morning activity, suggest a time around 8 AM. If it's an afternoon activity, suggest a time around 2 PM, and for evening activities, suggest a time around 7 PM. Ensure that each task includes a date, time, and summary, even if not explicitly mentioned in the input. Return the extracted information as a formatted JSON with 'tasks' and 'summary_points' fields. Each task should have 'date'(mm-dd-yyyy), time(2400 hour format int), and title(string). Summary points should capture the emotions and expectations expressed in the text, providing a concise overview of the individual's thoughts and feelings. Use the current day and date and time to infer dates and times for the tasks: "+ dateString +". Your response should always be a formatted json. It can have empty tasks and summaries list."
              },
              {
                "role": "user",
                "content": "This is my journal entry return a json for it:\n\n"+transcript
              }
            ],
            temperature: 0.2,
            max_tokens: 640,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
    
        console.log(response.choices[0].message.content);
          // @ts-ignore
        return String(response.choices[0].message.content);
    }
    catch(err){
        console.log(err);
        return "{'Error': 'Error'}";
    }

}

export {todo};

