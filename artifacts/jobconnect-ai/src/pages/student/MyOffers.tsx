import { useEffect, useState } from "react";
import {
  getMyOffers,
  acceptOffer as acceptOfferApi,
  rejectOffer as rejectOfferApi,
} from "@/api/studentOffer";
export default function MyOffers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      setLoading(true);

      const res = await getMyOffers();

      setOffers(res.offers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  async function acceptOffer(id: string) {
  await acceptOfferApi(id);

  alert("Offer Accepted");

  loadOffers();
}

async function rejectOffer(id: string) {
  await rejectOfferApi(id);

  alert("Offer Declined");

  loadOffers();
}

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        Loading Offer Letters...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">

      <h1 className="text-3xl font-bold mb-8">
        My Offer Letters
      </h1>

      {offers.length === 0 && (
        <div className="border rounded-xl p-10 text-center">
          No Offer Letters Found
        </div>
      )}

      <div className="space-y-5">

        {offers.map((offer: any) => (

          <div
            key={offer.id}
            className="border rounded-xl p-6 shadow-sm bg-card flex justify-between items-center"
          >

            <div>

              <h2 className="text-xl font-semibold">
                {offer.application.job.company.name}
              </h2>

              <p className="text-muted-foreground">
                {offer.designation}
              </p>

              <p className="mt-2">
                💰 Salary :
                ₹{offer.salary.toLocaleString()}
              </p>

              <p>
                📅 Joining :
                {new Date(
                  offer.joiningDate
                ).toLocaleDateString()}
              </p>

              <p>
                📍 {offer.location}
              </p>

              <p>
                💼 {offer.workMode}
              </p>

            </div>

            <div className="flex flex-col items-end gap-3">

              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
                OFFERED
              </span>

           <div className="flex flex-col gap-3">

  <a
  href={offer.pdfUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
>
  📄 Download Offer Letter
</a>

  {offer.status === "SENT" && (
    <>
      <button
        onClick={() => acceptOffer(offer.id)}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
      >
        ✅ Accept Offer
      </button>

      <button
        onClick={() => rejectOffer(offer.id)}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
      >
        ❌ Reject Offer
      </button>
    </>
  )}

  {offer.status === "ACCEPTED" && (
    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold text-center">
      ✅ Offer Accepted
    </div>
  )}

  {offer.status === "DECLINED" && (
    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold text-center">
      ❌ Offer Declined
    </div>
  )}

</div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}