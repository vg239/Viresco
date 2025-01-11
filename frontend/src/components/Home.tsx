import { LogInWithAnonAadhaar, useAnonAadhaar, AnonAadhaarProof, useProver } from "@anon-aadhaar/react";
import { useEffect } from "react";
import { toast } from 'react-toastify';

interface Proof {
  proof: {
    ageAbove18: boolean;
    [key: string]: any;
  };
}

function Home() {
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver() as [unknown, Proof | null];

  useEffect(() => {
    if (latestProof?.proof) {
      console.log("This is the latest proof : ", latestProof.proof.ageAbove18);
    }
  }, [latestProof]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-8">
        <LogInWithAnonAadhaar 
          nullifierSeed={1234} 
          fieldsToReveal={["revealAgeAbove18"]} 
        />
        <p className="mt-4 text-gray-300">{anonAadhaar?.status}</p>
      </div>
      <div>
        {/* Render the proof if generated and valid */}
        {anonAadhaar?.status === "logged-in" && (
          <div className="text-center">
            <p className="text-green-500 mb-4">✅ Proof is valid</p>
            {latestProof && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <AnonAadhaarProof code={JSON.stringify(latestProof, null, 2)} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home; 