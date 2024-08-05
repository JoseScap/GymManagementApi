import { Member } from "src/members/entities/member.entity";
import { SingleApiResponse } from "src/types/ApiResponse";

export interface FindOneMemberResponse extends SingleApiResponse<Member> { }