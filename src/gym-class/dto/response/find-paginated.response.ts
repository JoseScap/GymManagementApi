import { GymClass } from "src/gym-class/entities/gym-class.entity";
import { PaginatedApiResponse } from "src/types/ApiResponse";

export interface FindPaginatedGymClassResponse extends PaginatedApiResponse<GymClass> { }