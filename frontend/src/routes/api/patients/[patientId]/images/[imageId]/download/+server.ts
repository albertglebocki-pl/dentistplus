import { BACKEND_URL } from "$env/static/private";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, request }) => {
  const res = await fetch(
    `${BACKEND_URL}/patients/${params.patientId}/images/${params.imageId}/download`,
    { headers: { Authorization: request.headers.get("Authorization") ?? "" } },
  );
  if (!res.ok) return new Response(await res.text(), { status: res.status });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type":
        res.headers.get("Content-Type") ?? "application/octet-stream",
      "Content-Disposition": res.headers.get("Content-Disposition") ?? "",
    },
  });
};
