import moment from "moment";
import { getManager, IsNull, Not } from "typeorm";
import { Image } from '../entity/image.entity';


export async function deleteImage() {
    const result = await getManager().getRepository(Image).find({
        select: ["id", "createDate", "deleteAfter"],
        where: {
            deleteAfter: Not(IsNull())
        }
    })

    result.forEach(async (r) => {
        let now = moment(new Date()); //todays date
        let end = moment(r.createDate); // create date
        let duration = moment.duration(now.diff(end));
        let mins = duration.asMinutes()
        console.log(mins);
        if(mins >= r.deleteAfter) {
            await getManager().getRepository(Image).delete(r.id);
        }
    })

    console.log(result);
}