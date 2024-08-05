import { Member } from "src/members/entities/member.entity";
import { PaginatedApiResponse } from "src/types/ApiResponse";

export interface FindPaginatedResponse extends PaginatedApiResponse<Member> { }