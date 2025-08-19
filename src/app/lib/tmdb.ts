const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

if (!TMDB_TOKEN) {
  console.error("❌ TMDB_ACCESS_TOKEN is missing");
}

export async function getPopularMovies() {
  const url = `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`TMDB fetch error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data.results.slice(0, 5);
}
