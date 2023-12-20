//Model needs to be the EXACT

import { DatePipe } from "@angular/common";

//same name as the data you are recieving to work.
export interface LightLog{
    id: number;
    productId: string;
    hours: string;
    minutes: string;
    seconds: string;
    dateSent: string;
}