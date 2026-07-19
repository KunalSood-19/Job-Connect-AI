import api from "./axios";

export async function getMyOffers() {
  const res = await api.get("/student/offers");
  return res.data;
}

export async function acceptOffer(id: string) {
  const res = await api.patch(
    `/recruiter/offer-letter/${id}/accept`
  );

  return res.data;
}

export async function rejectOffer(id: string) {
  const res = await api.patch(
    `/recruiter/offer-letter/${id}/reject`
  );

  return res.data;
}