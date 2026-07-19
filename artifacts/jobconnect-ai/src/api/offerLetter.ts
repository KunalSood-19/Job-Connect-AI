import api from "./axios";

export async function createOfferLetter(data: any) {
  const res = await api.post(
    "/recruiter/offer-letter",
    data
  );

  return res.data;
}