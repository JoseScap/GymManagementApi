import { Member } from "src/members/entities/member.entity";
import { PaginatedApiResponse } from "src/types/ApiResponse";

export interface FindMembersResponse extends PaginatedApiResponse<Member> { }