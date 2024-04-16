import ScheduleItemAPI from "../../apis/ScheduleItemAPI";

class ScheduleValidator {

    static async scheduleIsClear(startTime, duration, itemId) {
        //get all items
        const scheduleItems = (await ScheduleItemAPI.getPatient()).success.rows;

        console.log("raw items");
        console.log(scheduleItems);

        //filter by date
        const filteredScheduleItems = scheduleItems.filter((a) => {
            const proposedStartDate = new Date(startTime);

            const candidateDate = new Date(a.start_timestamp);

            console.log("candidate");
            console.log(proposedStartDate + " : " + candidateDate)

            return (proposedStartDate.getDate() === candidateDate.getDate())
            && (proposedStartDate.getMonth() === candidateDate.getMonth())
            && (proposedStartDate.getFullYear() === proposedStartDate.getFullYear());
        });

        console.log("items on the same day");
        console.log(filteredScheduleItems);

        //filter by whether enters bounds for proposed item

        const itemsOverlapping = filteredScheduleItems.filter((a) => {
            console.log("ids")
            console.log(itemId + " : " + a.schedule_item_id)
            if(itemId === parseInt(a.schedule_item_id)) {
                return false;
            }

            const proposedStartTime = new Date(startTime);

            const proposedEndTime = new Date(proposedStartTime.getTime() + (duration * 15 * 60000))

            const candidateStartTime = new Date(a.start_timestamp);
            const candidateEndTime = new Date(candidateStartTime.getTime() + (a.estimated_duration_minutes * 15 * 60000));

            // start is in range
            const startInRange = (candidateStartTime.getTime() <= proposedStartTime.getTime()) && (candidateEndTime.getTime() >= proposedStartTime.getTime())
            
            // end is in range
            const endInRange = (candidateEndTime.getTime() <= proposedEndTime.getTime()) && (candidateEndTime.getTime() >= proposedStartTime.getTime())

            // start is before and end is after range
            const goesThrough = (candidateStartTime.getTime() < proposedStartTime.getTime()) && (candidateEndTime.getTime() > proposedEndTime.getTime()) 


            return startInRange || endInRange || goesThrough;
        });

        console.log(itemsOverlapping);

        return itemsOverlapping.length === 0;
    }

}

export default ScheduleValidator;