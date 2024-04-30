export async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error, status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
