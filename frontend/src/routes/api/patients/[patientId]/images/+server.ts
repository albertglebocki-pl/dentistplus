import api from "$lib/server/utils/api";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, request }) => {
  const res = await fetch(api(`/patients/${params.patientId}/images`), {
    headers: { Authorization: request.headers.get("Authorization") ?? "" },
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
};

export const POST: RequestHandler = async ({ params, request }) => {
  const body = await request.formData();
  const res = await fetch(api(`/patients/${params.patientId}/images`), {
    method: "POST",
    headers: { Authorization: request.headers.get("Authorization") ?? "" },
    body,
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
};
