export async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&type=multiple"
    );

    const data = await response.json();

    if (!Array.isArray(data.results)) return [];

    const seen = new Set();
    const unique = [];
    for (const item of data.results) {
      if (!item || !item.question) continue;
      if (seen.has(item.question)) continue;
      seen.add(item.question);
      unique.push(item);
    }

    return unique;
  } catch (error) {
    return [];
  }
}
