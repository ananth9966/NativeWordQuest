function normalizeHeader(header) {
  return header
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

const HEADER_ALIASES = {
  "ojibwe": "ojibwe",
  "ojibwe word": "ojibwe",
  "anishinaabemowin": "ojibwe",
  "english": "english",
  "english word": "english",
  "meaning": "english",
  "category": "category",
  "group": "category",
  "group/category": "category",
  "group / category": "category",
  "id": "id"
};

export async function loadTSV(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not load TSV file: ${response.status}`);
  }

  const text = await response.text();
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);

  if (!lines.length) return [];

  const headers = lines[0].split("\t").map((header) => {
    const normalized = normalizeHeader(header);
    return HEADER_ALIASES[normalized] || normalized;
  });

  return lines.slice(1).map((line, rowIndex) => {
    const values = line.split("\t");
    const row = { _rowNumber: rowIndex + 2 };

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() ?? "";
    });

    return row;
  });
}
