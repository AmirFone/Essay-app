export default async function handler(req, res) {
	if (req.method === 'POST') {
	  const { context, prompt, id, answers } = req.body;
	  if (context && prompt) {
	    // Send context and prompt to backend for question generation
	    const response = await fetch('http://backend/generate-questions', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify({ context, prompt }),
	    });
	    const data = await response.json();
	    res.status(200).json({ id: data.id });
	  } else if (id && answers) {
	    // Send id and answers to backend for essay generation
	    const response = await fetch('http://backend/generate-essay', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify({ id, answers }),
	    });
	    const data = await response.json();
	    res.status(200).json({ id: data.id });
	  } else {
	    res.status(400).json({ error: 'Invalid request' });
	  }
	} else if (req.method === 'GET') {
	  const { id } = req.query;
	  if (id) {
	    // Fetch questions or essay from backend based on id
	    const response = await fetch(`http://backend/data?id=${id}`);
	    const data = await response.json();
	    if (data.questions) {
	      res.status(200).json({ questions: data.questions });
	    } else if (data.essay) {
	      res.status(200).json({ essay: data.essay });
	    } else {
	      res.status(404).json({ error: 'Data not found' });
	    }
	  } else {
	    res.status(400).json({ error: 'Invalid request' });
	  }
	} else {
	  res.status(405).json({ error: 'Method not allowed' });
	}
      }