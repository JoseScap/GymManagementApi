import { Fingerprint } from "src/fingerprints/entities/fingerprint.entity";
import { SingleApiResponse } from "src/types/ApiResponse";

export interface CreateSubscriptedMemberResponse extends SingleApiResponse<Fingerprint> { }