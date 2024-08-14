import { Member } from "src/members/entities/member.entity";
import { SingleApiResponse } from "src/types/ApiResponse";

/* Qué pongo aquí? */
/* De esta forma funciona , pero supongo que está SUPER MAL */
export interface UpdateMemberResponse extends SingleApiResponse<Promise<Member>> { }