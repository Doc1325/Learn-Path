import supabase from "./clienteSupabase";
import OpenAI from "openai";

const API_KEY = import.meta.env.VITE_OPENAIKEY

const prompt = `Eres un generador de rutas de aprendizaje.

Reglas Generales:  

Responde únicamente con un objeto JSON válido. 

No incluyas explicaciones, comentarios, markdown ni texto fuera del JSON. 

No uses \`\`\` ni bloques de código. 

No agregues campos adicionales. 

No cambies la estructura solicitada. 

Todos los textos deben estar en español. 

Para videos, Asegúrate de que los enlaces de YouTube sean reales, existentes y relevantes para el tema. No inventes URLs

Si no estás seguro de un enlace, usa documentación oficial. 
Nunca devuelvas texto antes o después del JSON. 

ESTRUCTURA  DE LA RESPUESTA:
  {
    "name": "string",
    "weeks": [
      {
        "week": text,
        "lessons": [
          {
            "id": number,
            "title": "string",
            "topic": "string",
            "type": "lectura | video",
            "content": "string"
          }
        ] 
      }
    ]
  }

REGLAS ADICIONALES

El campo "content" debe contener una URL si el tipo es "video" 

El campo "content" debe contener un texto de al menos 200 palabras si el tipo es "lectura" 

El campo "name" debe mantenerse tal como lo decida el usuario. 

Puedes variar la cantidad de lecciones en cada semana, pero debe haber al menos 2 y máximo 5 lecciones por semana. 

Los identificadores únicos (IDs) deben ser numéricos y únicos. 

Los títulos deben ser claros, educativos y en español. 

Mezcla lecturas y videos en cada semana. 

No dejes campos vacíos. 

El JSON debe poder ser convertido directamente con JSON.parse(). 

Si no puedes cumplir alguna regla, devuelve igualmente un JSON válido siguiendo la estructura.`;

export async function fetchGPTResponse(inputData) {
  //   const response = await fetch(
  //     `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,

  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         contents: [
  //           {
  //             role: "user",
  //             parts: [
  //               {
  //                 text: `
  // ${prompt}

  // Crea una ruta de aprendizaje para aprender ${inputData.focus} 
  // a un nivel ${inputData.level} en ${inputData.duration} semanas, 
  // mezclando videos y lecturas.
  //                 `, 
  //               },
  //             ],
  //           },
  //         ],
  //       }),
  //     }
  //   );



  const client = new OpenAI({
    apiKey: API_KEY, dangerouslyAllowBrowser: true
  });

  const response = await client.responses.create({
    model: "gpt-5.2",
    input: ` ${prompt}

Crea una ruta de aprendizaje para aprender ${inputData.focus} 
 a un nivel ${inputData.level} en ${inputData.duration} semanas, 
 mezclando videos y lecturas.
                `
  });



  const text = response.output[0].content[0].text;

  let parsedRoute;
  try {
       parsedRoute = JSON.parse(text);
  console.log(parsedRoute);
  } catch (e) {
    console.error("Error al parsear la respuesta:", e);
    parsedRoute = null;
  }

  if (parsedRoute) {
    parsedRoute.name = inputData.routeName || parsedRoute.name;
    await saveRoute(parsedRoute);


    return parsedRoute;

  }


  return null;



}

export const saveRoute = async (routeData) => {


  // Insertar ruta principal
  const { data: nuevaRuta, error: rutaError } = await supabase
    .from("Ruta")
    .insert({
      nombre: routeData.name,
      completado: false,
    })
    .select()
    .single()

  if (rutaError) {
    console.error(rutaError)
    return
  }

  //  Insertar secciones
  for (let i = 0; i < routeData.weeks.length; i++) {

    const seccion = routeData.weeks[i]

    const { data: seccionInsertada, error: seccionError } = await supabase
      .from("Seccion")
      .insert({
        nombre: seccion.week.toString(),
        id_ruta: nuevaRuta.id,
        completado: false,
        orden: i
      })
      .select()
      .single()

    if (seccionError) {
      console.error(seccionError)
      continue
    }

    // 3️⃣ Insertar contenidos
    const Lecciones = seccion.lessons.map((c, index) => ({
      nombre: c.title,
      id_categoria: c.type === "video" ? 2 : 1,
      contenido: c.content,
      completado: false,
      id_seccion: seccionInsertada.id,
      orden: index
    }))

    await supabase
      .from("Leccion")
      .insert(Lecciones)
  }





  console.log("Ruta guardada completamente ✅")
}


export const getRouteList = async () => {

  const data = await supabase.from("Ruta")
    .select(`
      *,
      secciones:Seccion (
        *,
        lecciones:Leccion (*)
      )
    `);

  return data;

  consoloe.log("Rutas obtenidas ✅")
}


