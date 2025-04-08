import { Button } from "../components/ui/Button"
import { Sidebar } from "../components/ui/Sidebar"
import { PlusIcon } from "../components/icons/PlusIcon"
import { ShareIcon } from "../components/icons/ShareIcon"
import { CardComponent } from "../components/ui/CardComponent"

export const Dashboard = () => {
    return (
        <div className="bg-[#F5EEDC] flex font-serif text-[#DDA853]">
            <div>
                <Sidebar />
            </div>
            <div className="flex p-4">
                <div className="pt-25 p-6">{<CardComponent />}</div>
                <div className="pt-5 p-3 fixed right-0 top-0 flex">
                    <div className="">
                        <Button
                            size="md" text="Add content" bg_color="blue"
                            fullWidth={false} startIcon={<PlusIcon />}
                        />
                    </div>
                    <div className="">
                        <Button
                            size="md" text="Share Brain" bg_color="blue"
                            fullWidth={false} startIcon={<ShareIcon />}
                        />
                    </div>
                </div>
            </div>


        </div>
    )
}