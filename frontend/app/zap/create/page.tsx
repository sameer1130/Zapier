
"use client"
import { Appbar } from "@/components/Appbar";
import { Zapcell } from "@/components/Zapcell";
import { LinkButton } from "@/components/buttons/LinkButton";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { useState } from "react";


export default function(){
    const [selectedTrigger, setSelectedTrigger] = useState("");
    const [selectedActions, setSelectedActions] = useState<{
    availableActionId: string;
    availableActionName: string;
}[]>([]);

    return <div>
        <Appbar />
        <div className="w-full h-screen bg-slate-200 flex flex-col justify-center">
        <div className="flex justify-center">
            <Zapcell name={selectedTrigger ? selectedTrigger : "Trigger"} index={1} />
        </div>
        <div className=" w-full pt-2 pb-2">
            {selectedActions.map((action,index) =><div className="flex justify-center pt-2 pb-2 "> <Zapcell name={action.availableActionName ? action.availableActionName : "Action"} index={2 + index} /></div>) }
            
        </div>
        <div className="flex justify-center">
            
                <PrimaryButton onClick={() => {
                    setSelectedActions(a => [...a, {
                        availableActionId: "",
                        availableActionName: ""
                    }])
                }}><div className="text-3xl ">
                    +
                    </div></PrimaryButton>
                </div>
            
        </div>
    </div>
}