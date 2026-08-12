export async function loadTSV(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not load TSV file: ${response.status}`);
  }

  const text = await response.text();
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);

  const headers = lines[0].split("\t").map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split("\t");
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() ?? "";
    });

    return row;
  });
}
