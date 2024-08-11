import { Fingerprint } from "src/fingerprints/entities/fingerprint.entity";
import { PaginatedApiResponse } from "src/types/ApiResponse";

export interface FindPaginatedFingerprintResponse extends PaginatedApiResponse<Fingerprint> {}