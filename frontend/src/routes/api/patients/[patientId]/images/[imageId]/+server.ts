import api from "$lib/server/utils/api";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ params, request }) => {
  const res = await fetch(
    api(`/patients/${params.patientId}/images/${params.imageId}`),
    {
      method: "DELETE",
      headers: { Authorization: request.headers.get("Authorization") ?? "" },
    },
  );
  const data = await res.json();
  return Response.json(data, { status: res.status });
};
