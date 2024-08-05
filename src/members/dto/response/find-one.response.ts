import { Member } from "src/members/entities/member.entity";
import { SingleApiResponse } from "src/types/ApiResponse";

export interface FindOneResponse extends SingleApiResponse<Member> { }