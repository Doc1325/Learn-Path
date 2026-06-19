export function normalizeFromAPI(apiData) {
  if (!apiData) return null;

  return {
    name: apiData.name,
    weeks: apiData.weeks.map((week) => ({
      week: week.week,
      title: week.lessons?.[0]?.topic || `Semana ${week.week}`,
      lessons: week.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        type: lesson.type,
        completado: false
      }))
    })),
    completado: false

  };
}


export function normalizeFromDB(path) {
  if (!path) return null;

  return {
    id: path.id,
    name: path.nombre,
    weeks: path.secciones.map((seccion, index) => ({
      week: index + 1,
      title: seccion.nombre,
      lessons: seccion.lecciones.map((l) => ({
        id: l.id,
        title: l.nombre,
        content: l.contenido,
        type: l.id_categoria === 2 ? "video" : "lectura",
        completado: l.completado
      }))
    })), 
    completado: path.completado
  };
}




export function normalizePath(data, source) {

  if (source === "db") {
    return normalizeFromDB(data);
  }

  if (source === "api") {
    return normalizeFromAPI(data);
  }

  return null;
}