const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.TMDB_ACCESS_TOKEN!;

// 🔹 film populer
export async function getPopularMovies(limit = 5) {
  const url = `${BASE_URL}/movie/popular?language=en-US&page=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) throw new Error("TMDB fetch error");
  const data = await res.json();
  return data.results.slice(0, limit);
}

// 🔹 cari film
export async function searchMovies(query: string, limit = 5) {
  const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(
    query
  )}&include_adult=false&language=en-US&page=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) throw new Error("TMDB fetch error");
  const data = await res.json();
  return data.results.slice(0, limit);
}
