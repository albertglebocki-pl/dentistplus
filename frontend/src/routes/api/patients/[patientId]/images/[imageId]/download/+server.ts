import api from "$lib/server/utils/api";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, request }) => {
  const res = await fetch(
    api(`/patients/${params.patientId}/images/${params.imageId}/download`),
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
