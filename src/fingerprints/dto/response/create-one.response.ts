import { Fingerprint } from "src/fingerprints/entities/fingerprint.entity";
import { SingleApiResponse } from "src/types/ApiResponse";

export interface CreateOneFingerprintResponse extends SingleApiResponse<Fingerprint> {}