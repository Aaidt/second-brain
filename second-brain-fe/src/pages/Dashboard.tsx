import { Button } from "../components/ui/Button"
import { Sidebar } from "../components/ui/Sidebar"
import { PlusIcon } from "../components/icons/PlusIcon"
import { ShareIcon } from "../components/icons/ShareIcon"

export const Dashboard = () => {
    return (
        <div className="flex justify-between bg-[#F5EEDC] font-serif text-[#DDA853]">
            <div>{<Sidebar />}</div>

            <div className="flex justify-end">
                <div className="">
                    <Button
                        size="md" text="Add content"
                        bg_color="blue" fullWidth={false}
                        startIcon={<PlusIcon />}
                    />
                </div>
                <div className="">
                    <Button
                        size="md" text="Share Brain"
                        bg_color="blue" fullWidth={false}
                        startIcon={<ShareIcon />}
                    />
                </div>
            </div>

        </div>
    )
}