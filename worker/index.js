export default {
    async fetch(request, env) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);

        if (url.pathname === '/api/counter') {
            if (request.method === 'GET') {
                const result = await env.DB.prepare('SELECT count FROM visitors WHERE id = 1').first();

                if (!result) {
                    await env.DB.prepare('INSERT INTO visitors (id, count) VALUES (1, 1)').run();
                    return new Response(JSON.stringify({ count: 1 }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                const newCount = result.count + 1;
                await env.DB.prepare('UPDATE visitors SET count = ? WHERE id = 1').bind(newCount).run();

                return new Response(JSON.stringify({ count: newCount }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        return new Response('Not Found', { status: 404 });
    },
};
