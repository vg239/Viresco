import { LogInWithAnonAadhaar, useAnonAadhaar, AnonAadhaarProof, useProver } from "@anon-aadhaar/react";
import { useEffect } from "react";
import { toast } from 'react-toastify';

export default function Home() {
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();

  useEffect(() => {
    console.log("This is the latest proof : ", latestProof?.proof.ageAbove18);
  }, [latestProof]);

  return (
    <>
      <div>
        <LogInWithAnonAadhaar nullifierSeed={1234} fieldsToReveal={["revealAgeAbove18"]} />
        <p>{anonAadhaar?.status}</p>
      </div>
      <div>
        {/* Render the proof if generated and valid */}
        {anonAadhaar?.status === "logged-in" && (
          <>
            <p>✅ Proof is valid</p>
            {latestProof && (
              <AnonAadhaarProof code={JSON.stringify(latestProof, null, 2)} />
            )}
          </>
        )}
      </div>
    </>
  );
}

