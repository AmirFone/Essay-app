export async function POST(request) {
	const { context, prompt, id, answers } = await request.json();
	if (context && prompt) {
	  // Send context and prompt to backend for question generation
	  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-questions`, {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({ context, prompt }),
	  });
	  const data = await response.json();
	  return new Response(JSON.stringify({ id: data.id }), { status: 200 });
	} else if (id && answers) {
	  // Send id and answers to backend for essay generation
	  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-essay`, {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({ id, answers }),
	  });
	  const data = await response.json();
	  return new Response(JSON.stringify({ id: data.id }), { status: 200 });
	} else {
	  return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
	}
      }
      
      export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
	if (id) {
	  // Fetch questions or essay from backend based on id
	  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/data?id=${id}`);
	  const data = await response.json();
	  if (data.questions) {
	    return new Response(JSON.stringify({ questions: data.questions }), { status: 200 });
	  } else if (data.essay) {
	    return new Response(JSON.stringify({ essay: data.essay }), { status: 200 });
	  } else {
	    return new Response(JSON.stringify({ error: 'Data not found' }), { status: 404 });
	  }
	} else {
	  return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
	}
      }