let clients = [];

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const client = {
        send: (data) => {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          } catch (err) {
            console.error("SSE send failed:", err.message);
            removeClient(client);
          }
        },
      };

      function removeClient(c) {
        clients = clients.filter((cl) => cl !== c);
      }

      clients.push(client);

      // Keep-alive ping
      const interval = setInterval(() => {
        client.send({ type: "ping" });
      }, 15000);

      // Handle disconnect (browser closes connection)
      controller.signal?.addEventListener("abort", () => {
        clearInterval(interval);
        removeClient(client);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

// Broadcast update to all connected clients
export function broadcastUpdate(data) {
  clients.forEach((client) => client.send(data));
}
