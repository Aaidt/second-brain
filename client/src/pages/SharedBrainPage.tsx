import { Sidebar } from "../components/ui/Sidebar"
import { CardComponent } from "../components/ui/CardComponent"
import { useContent } from "../hooks/useContent"

export const SharedBrainPage = () => {
    const { contents } = useContent()

    return (
        <div>
            <div className="bg-[#F5EEDC] flex font-serif text-[#DDA853]">
                <div>
                    <Sidebar />
                </div>
                <div className="flex p-4 pt-20 flex-wrap">
                    {contents.map(({ title, link, type, _id }) =>
                        <CardComponent title={title} type={type} link={link} id={_id} />
                    )}
                </div>
            </div>
        </div>
    )
}
