import { BACKEND_URL } from "$env/static/private";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ params, request }) => {
  const res = await fetch(
    `${BACKEND_URL}/patients/${params.patientId}/images/${params.imageId}`,
    {
      method: "DELETE",
      headers: { Authorization: request.headers.get("Authorization") ?? "" },
    },
  );
  const data = await res.json();
  return Response.json(data, { status: res.status });
};
