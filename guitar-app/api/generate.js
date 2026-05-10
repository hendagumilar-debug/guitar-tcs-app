// api/generate.js
// Serverless function — API key aman di server, tidak terekspos ke browser

export default async function handler(req, res) {
  // Hanya terima POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic, availableChords } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const prompt = `Kamu adalah instruktur gitar profesional. Buat tutorial gitar dalam Bahasa Indonesia untuk: "${topic}".

Chord yang tersedia di sistem: ${availableChords}

Balas HANYA dengan JSON valid (tanpa backtick, tanpa teks lain):
{
  "title": "judul tutorial menarik",
  "level": "Pemula / Menengah / Lanjut",
  "duration": "estimasi waktu, contoh: 10-15 menit",
  "steps": [
    {
      "title": "judul step singkat",
      "chord": "nama chord PERSIS dari daftar tersedia, atau null jika bukan chord spesifik",
      "description": "penjelasan 2-3 kalimat jelas dan memotivasi dalam Bahasa Indonesia",
      "tips": "tips singkat praktis untuk pemula",
      "fingers": ["Jari 1: string ke-X fret ke-Y", "Jari 2: ..."]
    }
  ]
}

Buat 4-6 steps yang logis dan berurutan. Gunakan chord PERSIS dari daftar yang tersedia. Bahasa Indonesia yang hangat dan memotivasi.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API error" });
    }

    const text = data.content?.map((c) => c.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate tutorial: " + err.message });
  }
}
